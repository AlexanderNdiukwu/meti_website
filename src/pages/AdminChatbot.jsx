import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmissionsStore } from '../store/admissionsStore';
import { ArrowLeft, Send, Trash2, Bot } from 'lucide-react';

// ── Admin workflow FAQ — edit/add entries here anytime, nothing else
// in this file needs to change. Same static, zero-cost pattern as the
// student-facing ChatbotWidget — no database, no API calls.
const ADMIN_FAQ = [
  {
    keywords: ['search', 'find applicant', 'find student', 'filter'],
    answer: '1. Go to the Applications tab.\n2. Use the search box (top right) to search by name, email, or programme.\n3. Use the dropdown filters next to it to narrow by programme, date range, or a specific year.',
  },
  {
    keywords: ['announcement', 'post announcement', 'send announcement', 'notify students'],
    answer: '1. Go to the Announcements tab.\n2. Fill in the title, message, and (optionally) attach a file.\n3. Choose the target programme and audience.\n4. Click "Publish Announcement".',
  },
  {
    keywords: ['approve payment', 'confirm payment', 'verify payment'],
    answer: '1. Open the applicant\'s Payment tab.\n2. Review their uploaded receipt.\n3. Click "Approve Payment — Generate Application Number". This also generates their application number automatically.',
  },
  {
    keywords: ['approve student', 'approve application', 'final approval', 'confirm application'],
    answer: '1. Make sure payment is verified and the application form is submitted.\n2. Go to the Documents tab and approve every uploaded document individually.\n3. Once all are approved, go to the Decision tab and click "Approve Student — Welcome to METI".',
  },
  {
    keywords: ['who can approve', 'am i allowed', 'permission', 'admin access', 'higher admin'],
    answer: 'Only accounts with the admin role in METI\'s system can approve, reject, or confirm applications — this is enforced by the database itself, not just the interface. If your account doesn\'t have admin access, you\'ll need to be granted it by whoever manages METI\'s admissions system.',
  },
  {
    keywords: ['reject', 'decline application'],
    answer: '1. Go to the applicant\'s Decision tab.\n2. Click "Reject Application".\n3. Enter a reason (minimum 20 characters) — this is included in the email sent to the student.',
  },
  {
    keywords: ['interview', 'request interview'],
    answer: '1. Approve all of the applicant\'s documents first — the Interview button only appears once that\'s done.\n2. Go to their Decision tab and click "Request Interview".\n3. Fill in the subject, programme, date, and message, then click "Send to Student". You can request an interview before or after final approval — the order is flexible.',
  },
  {
    keywords: ['return form', 'correction requested', 'red', 'flag'],
    answer: 'A red dot next to an applicant\'s name means they\'ve requested their form back for correction. Open their Print View or Documents tab and click "Return Form to Student" to unlock it for them.',
  },
  {
    keywords: ['reset', 'new session', 'application number reset'],
    answer: 'Go to Settings → "Start New Admission Session" to reset a programme\'s application numbers back to 000 for a new session, or "Set Next Application Number Manually" to nudge the counter without a full reset.',
  },
  {
    keywords: ['delete applicant', 'remove applicant'],
    answer: 'Open the applicant, click "Delete Applicant" in their header, then type their exact name to confirm. This permanently deletes their application data and cannot be undone — it does not delete their login.',
  },
  {
    keywords: ['clear announcement', 'delete all announcement'],
    answer: 'In the Announcements tab, click "Clear All" and type CLEAR to confirm. This removes every announcement for every student, immediately.',
  },
];

function findAnswer(input) {
  const text = input.toLowerCase();
  let best = null, bestScore = 0;
  for (const item of ADMIN_FAQ) {
    const score = item.keywords.filter(k => text.includes(k)).length;
    if (score > bestScore) { bestScore = score; best = item; }
  }
  return bestScore > 0 ? best.answer : null;
}

const MAX_MESSAGES = 30;

export default function AdminChatbot() {
  const navigate = useNavigate();
  const { user } = useAdmissionsStore();
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! Ask me how to do anything in the admin panel — searching, approving, announcements, interviews, resets, and more.' },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user || user.role !== 'admin') return null;

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    const answer = findAnswer(userMsg);
    setMessages(prev => [
      ...prev,
      { from: 'user', text: userMsg },
      { from: 'bot', text: answer || 'I don\'t have that one yet — tell your developer to add it to the admin FAQ, or ask someone with more knowledge of the system.' },
    ].slice(-MAX_MESSAGES));
    setInput('');
  };

  const handleClear = () => {
    setMessages([{ from: 'bot', text: 'Chat cleared. Ask me anything about using the admin panel!' }]);
  };

  return (
    <div className="min-h-screen font-serif bg-gray-50 flex flex-col">
      <div className="bg-white border-b px-4 sm:px-6 py-4 flex items-center gap-3">
        <button onClick={() => navigate('/admin')} className="text-gray-400 hover:text-gray-700">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-9 h-9 rounded-full bg-brand-primary flex items-center justify-center text-white">
            <Bot size={18} />
          </div>
          <h1 className="font-black text-gray-900">Admin Assistant</h1>
        </div>
        <button onClick={handleClear} className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700">
          <Trash2 size={13} /> Clear Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-3xl mx-auto w-full space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line ${
              m.from === 'user' ? 'bg-brand-primary text-white' : 'bg-white border border-gray-100 text-gray-800 shadow-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="bg-white border-t p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask how to do something…"
            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
          <button onClick={handleSend} className="bg-brand-primary text-white p-2.5 rounded-full">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}