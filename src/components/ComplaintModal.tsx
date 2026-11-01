import React, { useState } from 'react';
import { 
  AlertCircle, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  Clock, 
  X, 
  FileText,
  MessageSquare
} from 'lucide-react';
import { ComplaintCategory, ComplaintTicket, UserProfile } from '../types';
import { logger } from '../services/logger';

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: ComplaintCategory, title: string, description: string) => Promise<string>;
  myComplaints: ComplaintTicket[];
  currentProfile: UserProfile | null;
}

export const ComplaintModal: React.FC<ComplaintModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  myComplaints,
  currentProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');
  const [category, setCategory] = useState<ComplaintCategory>('Syllabus Mismatch');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const ticketId = await onSubmit(category, title, description);
      setSubmittedTicketId(ticketId);
      setTitle('');
      setDescription('');
    } catch (err) {
      logger.error('ComplaintModal', 'Failed to submit grievance', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Student Grievance &amp; Issue Desk</h3>
              <p className="text-xs text-slate-500">Report syllabus mismatches, rendering bugs, or account queries.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-100 px-5 pt-3 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('form')}
            className={`pb-2.5 transition-colors border-b-2 ${activeTab === 'form' ? 'border-rose-600 text-rose-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Submit New Grievance
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 transition-colors border-b-2 ${activeTab === 'history' ? 'border-rose-600 text-rose-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            My Submitted Tickets ({myComplaints.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {activeTab === 'form' ? (
            submittedTicketId ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Grievance Logged Successfully</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Your issue has been assigned reference ticket ID:
                </p>
                <div className="inline-block px-4 py-1.5 bg-amber-50 border border-amber-300 rounded-xl font-mono text-base font-bold text-amber-900">
                  {submittedTicketId}
                </div>
                <p className="text-xs text-slate-500">
                  Our academic administration will review your ticket and notify you.
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setSubmittedTicketId(null);
                      setActiveTab('history');
                    }}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
                  >
                    View Status in My Tickets
                  </button>
                  <button
                    onClick={() => setSubmittedTicketId(null)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-medium hover:bg-slate-200"
                  >
                    Log Another Issue
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Issue Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  >
                    <option value="Syllabus Mismatch">NCERT Syllabus Mismatch / Missing Chapter</option>
                    <option value="Generation Error">AI Generation Inaccuracy or Math/Formula Error</option>
                    <option value="Handwriting Rendering Issue">Handwriting Font / Notebook Rendering Bug</option>
                    <option value="Account Issue">User Account / Notes Storage Issue</option>
                    <option value="Other">Other Academic Grievance</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Summary / Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Class 10 Chemistry Redox reaction balance error in Chapter 1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Detailed Explanation &amp; Context *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide specific details about the issue, command used, expected NCERT textbook standard, or error encountered."
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    required
                  />
                </div>

                <div className="bg-slate-50 p-3 rounded-xl text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Logged as: <strong>{currentProfile?.email || 'Anonymous Student'}</strong></span>
                  <span>Tracked in real-time</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !description.trim()}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Registering Grievance...' : 'Submit Grievance to Administration'}</span>
                </button>
              </form>
            )
          ) : (
            /* Ticket History */
            <div className="space-y-3">
              {myComplaints.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  You haven't logged any grievances or support issues yet.
                </div>
              ) : (
                myComplaints.map((ticket) => (
                  <div key={ticket.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {ticket.ticketId}
                      </span>
                      {ticket.status === 'pending' && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold text-[10px]">
                          Pending Review
                        </span>
                      )}
                      {ticket.status === 'in_review' && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold text-[10px]">
                          Under Investigation
                        </span>
                      )}
                      {ticket.status === 'resolved' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-[10px]">
                          Resolved
                        </span>
                      )}
                    </div>

                    <div className="font-bold text-slate-800">{ticket.title}</div>
                    <p className="text-slate-600 text-[11px] whitespace-pre-wrap">{ticket.description}</p>

                    {ticket.adminNotes && (
                      <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-900">
                        <strong>Admin Response:</strong> {ticket.adminNotes}
                      </div>
                    )}

                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 flex justify-between">
                      <span>Category: {ticket.category}</span>
                      <span>Logged: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
