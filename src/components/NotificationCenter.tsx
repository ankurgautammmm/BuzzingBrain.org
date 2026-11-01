import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Award, 
  BookOpen, 
  Calendar, 
  Sparkles, 
  Trash2, 
  CheckCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { NavTab } from './Navbar';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'test_result' | 'task_reminder' | 'streak' | 'announcement' | 'curriculum';
  targetTab?: NavTab;
  targetSubTab?: string;
  actionCommand?: string;
}

interface NotificationCenterProps {
  onNavigateTab: (tab: NavTab, subTab?: string) => void;
  userId?: string;
}

const STORAGE_KEY = 'buzzing_brain_notifications';

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  onNavigateTab,
  userId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    
    // Default helpful academic notifications
    return [
      {
        id: 'notif_welcome',
        title: 'Welcome to Buzzing Brain! 🎓',
        message: 'Your personal AI study companion, NCERT handwritten notes engine, and 3D Virtual Practical Academy are ready for study.',
        timestamp: 'Just now',
        read: false,
        type: 'announcement',
        targetTab: 'studio',
      },
      {
        id: 'notif_countdown',
        title: '2026–27 Board & Entrance Countdown Active',
        message: 'CBSE Class 10 & 12 Board, NEET UG and JEE Main countdown timers and revision schedules are updated.',
        timestamp: '1 hour ago',
        read: false,
        type: 'task_reminder',
        targetTab: 'planner',
      },
      {
        id: 'notif_practical',
        title: 'Virtual Practical Academy 3D Ready',
        message: 'Master Class 9–12 Physics Ohm’s Law, Chemistry Acid-Base Titration, and Biology Compound Microscope with official NCERT logs.',
        timestamp: 'Yesterday',
        read: true,
        type: 'curriculum',
        targetTab: 'practicals',
      }
    ];
  });

  // Save to localStorage whenever notifications change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  // Listen for global custom events to push in-app notifications seamlessly
  useEffect(() => {
    const handlePushNotification = (event: CustomEvent<Omit<AppNotification, 'id' | 'timestamp' | 'read'>>) => {
      const newNotif: AppNotification = {
        ...event.detail,
        id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp: 'Just now',
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    };

    window.addEventListener('buzzing_brain_notify' as any, handlePushNotification as any);
    return () => {
      window.removeEventListener('buzzing_brain_notify' as any, handlePushNotification as any);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (n: AppNotification) => {
    markAsRead(n.id);
    if (n.targetTab) {
      onNavigateTab(n.targetTab, n.targetSubTab);
    }
    setIsOpen(false);
  };

  const getTypeIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'test_result':
        return <Award className="w-4 h-4 text-amber-400" />;
      case 'task_reminder':
        return <Calendar className="w-4 h-4 text-blue-400" />;
      case 'streak':
        return <Sparkles className="w-4 h-4 text-yellow-400" />;
      case 'curriculum':
        return <BookOpen className="w-4 h-4 text-purple-400" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="relative">
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
        title="In-App Notifications & Study Reminders"
        aria-label="View notifications"
      >
        <Bell className="w-4 h-4 text-slate-200 hover:text-amber-300 transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-black text-slate-950 shadow-sm animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Flyout */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-950/95 border border-white/15 shadow-2xl backdrop-blur-xl z-50 text-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-sm text-white">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-[11px] text-slate-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Read all</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllNotifications}
                    className="text-slate-400 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                    title="Clear all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-white/5 scrollbar-thin scrollbar-thumb-white/10">
              {notifications.length === 0 ? (
                <div className="py-12 px-6 text-center space-y-2 text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs font-semibold text-slate-300">You're all caught up!</p>
                  <p className="text-[11px] text-slate-500">
                    Test score alerts, study plan reminders, and curriculum updates will appear here.
                  </p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-white/5 ${
                      !n.read ? 'bg-amber-400/[0.04]' : ''
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0 mt-0.5">
                      {getTypeIcon(n.type)}
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`text-xs font-bold truncate ${!n.read ? 'text-white' : 'text-slate-300'}`}>
                          {n.title}
                        </h4>
                        <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                      {n.targetTab && (
                        <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-amber-400 hover:text-amber-300">
                          <span>Open {n.targetTab}</span>
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-2" />
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-2.5 bg-slate-900/60 border-t border-white/10 text-center">
              <span className="text-[10px] text-slate-500 font-mono">
                Buzzing Brain Student Notifications &bull; Academic Year 2026–27
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Global helper to fire student notifications anywhere in the app
export function dispatchStudentNotification(notification: {
  title: string;
  message: string;
  type: AppNotification['type'];
  targetTab?: NavTab;
  targetSubTab?: string;
  actionCommand?: string;
}) {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('buzzing_brain_notify', { detail: notification });
    window.dispatchEvent(event);
  }
}
