import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Phone, 
  ShieldAlert, 
  CheckCheck, 
  AlertTriangle, 
  RotateCcw, 
  User, 
  Users, 
  Sparkles, 
  FileText, 
  Database, 
  BellRing, 
  ArrowRight,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Layers
} from 'lucide-react';

interface StudentInfo {
  Student_ID: string;
  Name: string;
  Batch: string;
  Roll_No: string;
  Parent_Phone_1: string;
  Parent_Phone_2: string;
  Fee_Total: number;
  Fee_Paid: number;
  Fee_Due_Date: string;
  Active: string;
}

interface ChatMessage {
  id: string;
  sender: 'parent' | 'bot' | 'system';
  text: string;
  time: string;
  route?: string;
  facts?: any;
  ownerAlert?: any;
}

interface QueryLog {
  id: string;
  Time: string;
  Phone: string;
  Student_ID: string;
  Student_Name: string;
  Question: string;
  Reply: string;
  Status: string;
  Escalated?: boolean;
}

interface OwnerAlert {
  id: string;
  timestamp: string;
  parentName: string;
  parentPhone: string;
  message: string;
  type: string;
}

const PRESET_PARENTS = [
  {
    label: "Aarav's Father (NEET Dropper)",
    phone: '9876543210',
    name: 'Rajesh Sharma',
    studentName: 'Aarav Sharma',
    batch: 'NEET Dropper Repeater 2026',
    desc: 'Regular attendance, strong in Biology, needs Chemistry attention',
  },
  {
    label: 'Mrs. Kapoor (Parent of 2 Siblings)',
    phone: '9811223344',
    name: 'Sunita Kapoor',
    studentName: 'Riya & Kabir Kapoor',
    batch: 'Class 12 JEE + Class 10 Foundation',
    desc: 'Shares same phone for both children; tests sibling resolution',
  },
  {
    label: "Vikram's Father (Overdue Fee & Absent)",
    phone: '9822001122',
    name: 'Mahesh Patel',
    studentName: 'Vikram Patel',
    batch: 'Class 11 Science (PCB Focus)',
    desc: 'Pending fees ₹35,000 overdue & 2-day consecutive absent streak',
  },
  {
    label: 'Unregistered Number (New Parent)',
    phone: '9999888877',
    name: 'Unknown Parent',
    studentName: 'Not enrolled',
    batch: 'Unregistered',
    desc: 'Tests unregistered number routing and 3-attempt lockout',
  },
];

export const CoachingParentBotHub: React.FC = () => {
  // Simulator State
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customPhone, setCustomPhone] = useState(PRESET_PARENTS[0].phone);
  const [customName, setCustomName] = useState(PRESET_PARENTS[0].name);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [childHint, setChildHint] = useState('');

  // Messages in active session
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      sender: 'bot',
      text: 'Namaste! Main Buzzing Brain Coaching Institute ka official WhatsApp assistant hoon. Main aapke bacche ki attendance, test results, teacher remarks ya fee status share kar sakta hoon. Kripya apna sawaal batayein.',
      time: '10:00 AM',
      route: 'Welcome',
    },
  ]);

  // Telemetry & Inspector State
  const [activeInspectorTab, setActiveInspectorTab] = useState<'facts' | 'alerts' | 'roster' | 'logs' | 'arch'>('facts');
  const [latestFacts, setLatestFacts] = useState<any>(null);
  const [studentsRoster, setStudentsRoster] = useState<StudentInfo[]>([]);
  const [ownerAlerts, setOwnerAlerts] = useState<OwnerAlert[]>([]);
  const [queryLogs, setQueryLogs] = useState<QueryLog[]>([]);
  const [blockedList, setBlockedList] = useState<any[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load telemetry data from server
  const fetchTelemetry = async () => {
    try {
      const [studentsRes, alertsRes, logsRes, blockedRes] = await Promise.all([
        fetch('/api/parent-bot/students').then((r) => r.json()),
        fetch('/api/parent-bot/alerts').then((r) => r.json()),
        fetch('/api/parent-bot/logs').then((r) => r.json()),
        fetch('/api/parent-bot/blocked').then((r) => r.json()),
      ]);

      if (studentsRes.students) setStudentsRoster(studentsRes.students);
      if (alertsRes.alerts) setOwnerAlerts(alertsRes.alerts);
      if (logsRes.logs) setQueryLogs(logsRes.logs);
      if (blockedRes.blocked) setBlockedList(blockedRes.blocked);
    } catch (err) {
      console.error('Failed to fetch parent bot telemetry:', err);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  // Handle Preset Change
  const handleSelectPreset = (idx: number) => {
    setSelectedPreset(idx);
    setCustomPhone(PRESET_PARENTS[idx].phone);
    setCustomName(PRESET_PARENTS[idx].name);
    setChildHint('');

    // Preload facts if known
    if (idx === 0) {
      fetch('/api/parent-bot/student/BB-2026-001/facts')
        .then((r) => r.json())
        .then((d) => d.facts && setLatestFacts(d.facts));
    }
  };

  // Send message to parent bot
  const handleSendMessage = async (textToSend?: string, isNonText = false) => {
    const text = textToSend !== undefined ? textToSend : inputText.trim();
    if (!text && !isNonText) return;

    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'parent',
      text: isNonText ? '[Sent an image / audio voice note]' : text,
      time: currentTime,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/parent-bot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: customPhone,
          name: customName,
          text: isNonText ? '' : text,
          nonText: isNonText,
          childHint: childHint || undefined,
        }),
      });

      const data = await res.json();
      const botTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'System response received.',
        time: botTime,
        route: data.status,
        facts: data.facts,
        ownerAlert: data.ownerAlert,
      };

      setMessages((prev) => [...prev, botMsg]);
      if (data.facts) {
        setLatestFacts(data.facts);
      }

      // Refresh telemetry
      fetchTelemetry();
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'system',
          text: 'Network error communicating with WhatsApp Parent Chatbot server.',
          time: currentTime,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSession = () => {
    setMessages([
      {
        id: 'init_fresh',
        sender: 'bot',
        text: `Namaste ${customName}! Main Buzzing Brain Coaching Institute ka official WhatsApp assistant hoon. Main aapke bacche ki attendance, test results, teacher remarks ya fee status share kar sakta hoon. Kripya apna sawaal batayein.`,
        time: '10:00 AM',
        route: 'Fresh Session',
      },
    ]);
  };

  const handleUnblock = async () => {
    await fetch('/api/parent-bot/reset-blocked', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: customPhone }),
    });
    fetchTelemetry();
    handleResetSession();
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12 text-slate-100">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-amber-950/40 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Production WhatsApp + AI Architecture (n8n Spec)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>Coaching Institute — Parent Chatbot</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-600/30 text-emerald-300 border border-emerald-500/30">
                Gemini Flash
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Parents message the institute WhatsApp number. Deterministic backend logic calculates attendance, test trends, fees, and teacher remarks.
              The AI agent acts strictly as a friendly explainer in the parent&apos;s language (Hindi, Hinglish, English) without direct database access.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleResetSession}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-2 border border-white/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Clear Chat</span>
            </button>
            <button
              onClick={handleUnblock}
              className="px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 border border-emerald-500/40 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Reset Blocked Numbers</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left = WhatsApp Simulator, Right = Telemetry & Fact Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ==================================================================== */}
        {/* LEFT COLUMN: WhatsApp Interactive Simulator (5 cols on lg)           */}
        {/* ==================================================================== */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Preset Parent Selector Card */}
          <div className="astra-card rounded-2xl p-4 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulated Parent Account</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Matched via Parent_Phone_1/2</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_PARENTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(idx)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                    selectedPreset === idx
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/50'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="font-bold text-white flex items-center justify-between">
                    <span className="truncate">{p.label}</span>
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400 mt-0.5">📞 {p.phone}</div>
                </button>
              ))}
            </div>

            {/* Custom Input Drawer for phone number */}
            <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-xs">
              <div className="flex-1">
                <label className="text-[10px] text-slate-400 block mb-0.5">Test Phone (91+ or 10 digits):</label>
                <input
                  type="text"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-slate-400 block mb-0.5">Sender Profile Name:</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {selectedPreset === 1 && (
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-200">
                <span className="font-bold">Sibling Mode Active:</span> Parent has two children enrolled (Riya & Kabir). Mention child&apos;s first name in question or test the automatic &apos;Which child?&apos; route!
              </div>
            )}
          </div>

          {/* Realistic WhatsApp Chat Device Frame */}
          <div className="rounded-3xl border border-emerald-500/40 bg-[#0b141a] overflow-hidden shadow-2xl flex flex-col h-[580px]">
            {/* WhatsApp Header */}
            <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    BB
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#202c33]"></div>
                </div>
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-1.5">
                    <span>Buzzing Brain Institute</span>
                    <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-500/30 text-emerald-300 font-mono">
                      Verified
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-sans">Official Parent Helpline • WhatsApp</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                  Online
                </span>
              </div>
            </div>

            {/* Chat Body with WhatsApp Doodle Background Feel */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0b141a]/95 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
              <div className="text-center my-2">
                <span className="px-3 py-1 rounded-full bg-[#182229] text-[10px] text-slate-400 border border-white/5 font-mono">
                  Messages are end-to-end encrypted • Coaching Institute Bot
                </span>
              </div>

              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'parent' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-md leading-relaxed ${
                      m.sender === 'parent'
                        ? 'bg-[#005c4b] text-white rounded-tr-xs'
                        : m.sender === 'system'
                        ? 'bg-rose-950/80 border border-rose-500/40 text-rose-200 rounded-tl-xs'
                        : 'bg-[#202c33] text-slate-100 rounded-tl-xs'
                    }`}
                  >
                    {/* Routing Flag Tag */}
                    {m.route && (
                      <div className="mb-1 flex items-center gap-1 text-[10px] font-mono">
                        <span
                          className={`px-1.5 py-0.2 rounded-md ${
                            m.route === 'ok'
                              ? 'bg-emerald-500/30 text-emerald-300'
                              : m.route === 'escalate'
                              ? 'bg-rose-500/40 text-rose-200'
                              : m.route === 'ask_which'
                              ? 'bg-purple-500/40 text-purple-200'
                              : m.route === 'blocked'
                              ? 'bg-red-600/40 text-red-200'
                              : 'bg-amber-500/30 text-amber-200'
                          }`}
                        >
                          Route: {m.route.toUpperCase()}
                        </span>
                      </div>
                    )}

                    <div className="whitespace-pre-wrap">{m.text}</div>

                    <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                      <span>{m.time}</span>
                      {m.sender === 'parent' && <CheckCheck className="w-3.5 h-3.5 text-sky-400" />}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start">
                  <div className="bg-[#202c33] text-slate-300 rounded-2xl rounded-tl-xs px-3.5 py-2 text-xs flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                    <span className="text-[11px] font-mono">Building deterministic facts & generating WhatsApp reply...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Preset Query Chips */}
            <div className="bg-[#182229] px-3 py-2 border-t border-white/10 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
              <span className="text-slate-400 font-mono text-[10px] shrink-0">Try:</span>
              <button
                onClick={() => handleSendMessage('Namaste! Aarav ki performance kaisi chal rahi hai?')}
                className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white shrink-0 cursor-pointer border border-white/5"
              >
                Overall Performance
              </button>
              <button
                onClick={() => handleSendMessage('Attendance report bhejo')}
                className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white shrink-0 cursor-pointer border border-white/5"
              >
                Attendance %
              </button>
              <button
                onClick={() => handleSendMessage('Kabir ki physics test report')}
                className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white shrink-0 cursor-pointer border border-white/5"
              >
                Kabir Test
              </button>
              <button
                onClick={() => handleSendMessage('Pending fees kitni bachi hai?')}
                className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white shrink-0 cursor-pointer border border-white/5"
              >
                Fee Due
              </button>
              <button
                onClick={() => handleSendMessage('Mujhe fees refund chahiye, institute se shikayat karni hai')}
                className="px-2 py-0.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 shrink-0 cursor-pointer border border-rose-500/30"
              >
                Escalate (Refund)
              </button>
              <button
                onClick={() => handleSendMessage('BB-2026-001')}
                className="px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 shrink-0 cursor-pointer border border-amber-500/30"
              >
                Try ID Pattern
              </button>
              <button
                onClick={() => handleSendMessage(undefined, true)}
                className="px-2 py-0.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 shrink-0 cursor-pointer border border-purple-500/30"
              >
                Send Non-Text
              </button>
            </div>

            {/* Input Bar */}
            <div className="bg-[#202c33] p-3 border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type parent's WhatsApp message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#2a3942] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputText.trim()}
                className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* RIGHT COLUMN: Telemetry, Deterministic Facts & System Spec (7 cols)  */}
        {/* ==================================================================== */}
        <div className="lg:col-span-7 space-y-4">
          {/* SubTab Navigation */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveInspectorTab('facts')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeInspectorTab === 'facts'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Deterministic Facts</span>
            </button>

            <button
              onClick={() => setActiveInspectorTab('alerts')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeInspectorTab === 'alerts'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BellRing className="w-3.5 h-3.5 text-rose-400" />
              <span>Owner Alerts ({ownerAlerts.length})</span>
            </button>

            <button
              onClick={() => setActiveInspectorTab('roster')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeInspectorTab === 'roster'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Student Roster ({studentsRoster.length})</span>
            </button>

            <button
              onClick={() => setActiveInspectorTab('logs')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeInspectorTab === 'logs'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Query Logs ({queryLogs.length})</span>
            </button>

            <button
              onClick={() => setActiveInspectorTab('arch')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeInspectorTab === 'arch'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Architecture Spec</span>
            </button>
          </div>

          {/* TAB 1: Deterministic Facts Inspector */}
          {activeInspectorTab === 'facts' && (
            <div className="astra-card rounded-2xl p-5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>Deterministic Facts (Fed to Gemini Flash)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Calculated strictly by node code, NOT the LLM. Ensures 100% mathematical accuracy without hallucination.
                  </p>
                </div>
                {latestFacts && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Student: {latestFacts.student?.name}
                  </span>
                )}
              </div>

              {latestFacts ? (
                <div className="space-y-4">
                  {/* Visual KPI Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-mono">Attendance</span>
                      <div className="text-lg font-extrabold text-emerald-400">
                        {typeof latestFacts.attendance === 'object'
                          ? `${latestFacts.attendance.overall_percent}%`
                          : 'N/A'}
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        {typeof latestFacts.attendance === 'object'
                          ? `${latestFacts.attendance.days_present}/${latestFacts.attendance.days_recorded} days present`
                          : 'No records'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-mono">Last 30 Days</span>
                      <div className="text-lg font-extrabold text-white">
                        {typeof latestFacts.attendance === 'object' && latestFacts.attendance.last_30_days_percent !== null
                          ? `${latestFacts.attendance.last_30_days_percent}%`
                          : 'N/A'}
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        Streak absent: {latestFacts.attendance?.current_consecutive_absent_days ?? 0} days
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-mono">Fee Balance</span>
                      <div className="text-lg font-extrabold text-amber-400">
                        ₹{latestFacts.fees?.due?.toLocaleString('en-IN') ?? 0}
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        Paid: ₹{latestFacts.fees?.paid?.toLocaleString('en-IN') ?? 0}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-mono">Top Subject</span>
                      <div className="text-sm font-bold text-sky-400 truncate">
                        {latestFacts.tests?.strongest_subject || 'N/A'}
                      </div>
                      <span className="text-[10px] text-slate-400 truncate block">
                        Weak: {latestFacts.tests?.weakest_subject || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Subject Breakdown Table */}
                  {Array.isArray(latestFacts.tests?.subjects) && latestFacts.tests.subjects.length > 0 && (
                    <div className="rounded-xl border border-white/10 overflow-hidden bg-black/40">
                      <div className="px-3 py-2 bg-white/5 border-b border-white/10 text-[11px] font-bold text-slate-300">
                        Subject Test Performance Breakdown
                      </div>
                      <table className="w-full text-left text-xs">
                        <thead className="text-[10px] font-mono text-slate-400 uppercase border-b border-white/10 bg-white/2">
                          <tr>
                            <th className="px-3 py-2">Subject</th>
                            <th className="px-3 py-2">Tests</th>
                            <th className="px-3 py-2">Avg %</th>
                            <th className="px-3 py-2">Latest Score</th>
                            <th className="px-3 py-2">Trend</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-300">
                          {latestFacts.tests.subjects.map((sub: any, i: number) => (
                            <tr key={i} className="hover:bg-white/5">
                              <td className="px-3 py-2 font-semibold text-white">{sub.subject}</td>
                              <td className="px-3 py-2 font-mono">{sub.tests_taken}</td>
                              <td className="px-3 py-2 font-mono font-bold text-amber-300">{sub.average_percent}%</td>
                              <td className="px-3 py-2 font-mono text-slate-300">{sub.last_marks}</td>
                              <td className="px-3 py-2">
                                <span
                                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono ${
                                    sub.trend_vs_earlier_tests === 'improving'
                                      ? 'bg-emerald-500/20 text-emerald-300'
                                      : sub.trend_vs_earlier_tests === 'declining'
                                      ? 'bg-rose-500/20 text-rose-300'
                                      : 'bg-slate-500/20 text-slate-300'
                                  }`}
                                >
                                  {sub.trend_vs_earlier_tests === 'improving' ? (
                                    <TrendingUp className="w-3 h-3" />
                                  ) : (
                                    <TrendingDown className="w-3 h-3" />
                                  )}
                                  {sub.trend_vs_earlier_tests}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Teacher Remarks */}
                  {Array.isArray(latestFacts.teacher_remarks) && latestFacts.teacher_remarks.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-300">Latest Teacher Remarks:</span>
                      <div className="space-y-1.5">
                        {latestFacts.teacher_remarks.map((rem: any, i: number) => (
                          <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span className="font-semibold text-amber-300">{rem.teacher}</span>
                              <span className="font-mono">{rem.date}</span>
                            </div>
                            <p className="text-slate-300 text-[11px] leading-relaxed">&ldquo;{rem.remark}&rdquo;</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Raw JSON View */}
                  <details className="text-xs group">
                    <summary className="font-mono text-[11px] text-slate-400 hover:text-white cursor-pointer py-1">
                      ► View Raw JSON Passed to AI Agent System Message
                    </summary>
                    <pre className="mt-2 p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-[10px] text-emerald-300 overflow-x-auto max-h-56">
                      {JSON.stringify(latestFacts, null, 2)}
                    </pre>
                  </details>
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  Select a parent or send a message to compute deterministic facts.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Owner Alerts */}
          {activeInspectorTab === 'alerts' && (
            <div className="astra-card rounded-2xl p-5 border border-rose-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <BellRing className="w-4 h-4 text-rose-400" />
                    <span>WhatsApp Owner Alerts (Template: owner_alert|en)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Dispatched to institute owner when keywords like refund, complaint, shikayat, legal or unauthorized student ID guesses are detected.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-rose-400">
                  {ownerAlerts.length} Alerts Dispatched
                </span>
              </div>

              {ownerAlerts.length > 0 ? (
                <div className="space-y-2.5">
                  {ownerAlerts.map((a) => (
                    <div
                      key={a.id}
                      className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-300 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{a.parentName} ({a.parentPhone})</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {new Date(a.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-white text-xs leading-relaxed bg-black/40 p-2 rounded-lg font-mono">
                        {a.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-400 space-y-2">
                  <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto" />
                  <p>No active escalation alerts yet.</p>
                  <p className="text-[11px] text-slate-500">
                    Tip: Send a message containing &quot;refund&quot; or &quot;shikayat&quot; from the chat to test owner escalation.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Student Roster */}
          {activeInspectorTab === 'roster' && (
            <div className="astra-card rounded-2xl p-5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>Enrolled Student Database</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Matches incoming WhatsApp messages against Parent_Phone_1 or Parent_Phone_2.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 overflow-hidden bg-black/40">
                <table className="w-full text-left text-xs">
                  <thead className="text-[10px] font-mono text-slate-400 uppercase border-b border-white/10 bg-white/2">
                    <tr>
                      <th className="px-3 py-2">ID</th>
                      <th className="px-3 py-2">Student Name</th>
                      <th className="px-3 py-2">Batch</th>
                      <th className="px-3 py-2">Parent Phone 1/2</th>
                      <th className="px-3 py-2">Fee Total / Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {studentsRoster.map((s) => (
                      <tr key={s.Student_ID} className="hover:bg-white/5">
                        <td className="px-3 py-2 font-mono text-[11px] text-amber-400">{s.Student_ID}</td>
                        <td className="px-3 py-2 font-bold text-white">{s.Name}</td>
                        <td className="px-3 py-2 text-[11px] text-slate-300">{s.Batch}</td>
                        <td className="px-3 py-2 font-mono text-[11px] text-emerald-400">
                          {s.Parent_Phone_1}
                        </td>
                        <td className="px-3 py-2 font-mono text-[11px]">
                          ₹{s.Fee_Total} / <span className="text-amber-400">₹{s.Fee_Total - s.Fee_Paid}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Query Logs */}
          {activeInspectorTab === 'logs' && (
            <div className="astra-card rounded-2xl p-5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Live Query Audit Trail</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Logged to the Query_Log sheet with timestamp, question, AI reply, and escalation status.
                  </p>
                </div>
              </div>

              {queryLogs.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {queryLogs.map((log) => (
                    <div key={log.id} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>{log.Student_Name} ({log.Phone})</span>
                        <span>{log.Time}</span>
                      </div>
                      <div className="text-amber-300 font-semibold">Q: {log.Question}</div>
                      <div className="text-slate-300 text-[11px] bg-black/40 p-2 rounded-lg">A: {log.Reply}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  No logged queries recorded yet. Send queries from the WhatsApp simulator to populate.
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Architecture & N8N Workflow Spec */}
          {activeInspectorTab === 'arch' && (
            <div className="astra-card rounded-2xl p-5 border border-purple-500/30 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>N8N Workflow Execution Specification</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="font-bold text-emerald-400">1. Blocked Route:</span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    3 or more wrong student ID attempts locks the phone for 1 hour. Returns predefined warning and alerts the institute office.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="font-bold text-sky-400">2. Which Child? (Sibling Route):</span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    If multiple students share the parent&apos;s phone, the bot checks for child&apos;s first name in the message. If absent, prompts parent to specify.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="font-bold text-rose-400">3. Escalate Route:</span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Triggered by keywords: refund, complaint, shikayat, legal, police, harass, fees wapas. Alerts owner template and tells parent office will call.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="font-bold text-purple-400">4. Gemini Flash AI Explainer:</span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    AI receives ONLY facts JSON. Strict rules: no mark predictions, no negative labels, WhatsApp style, parent language (Hindi/Hinglish/English), ~120 words.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200">
                <strong>Privacy by Design:</strong> The LLM does NOT query Google Sheets or Firestore directly. Facts are deterministically pre-computed by server logic and passed into prompt context, ensuring zero data leakage between students.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
