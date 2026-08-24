import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Mail, Phone } from 'lucide-react';

// ── Static reference data — mirrors ApplyFlow.jsx exactly. This is
// public, non-personal information (programme names, requirements,
// documents), so it's safe to bake in directly — no database needed.
const PROGRAMMES = {
  pgd: {
    label: 'Postgraduate Diploma (PGD)',
    duration: 'Full-Time: 12–24 months | Part-Time: 24–36 months',
    fee: '₦35,000',
    requirements: [
      'A Higher National Diploma (HND), OR',
      "A Third-Class Bachelor's Degree (B.Eng, B.Tech, or B.Sc.) in an Engineering discipline or Pure and Applied Science, from a recognised university, OR",
      'For candidates from unrelated science disciplines: a minimum of Second Class Lower (2.2).',
    ],
    specializations: ['Engineering Innovation & Technology Management'],
    documents: [
      'Degree Certificate or Statement of Results',
      'Academic Transcript (recommended)',
      'NYSC Certificate or Exemption Letter',
      'Academic Reference Letter 1 (recommended)',
      'Birth Certificate or Declaration of Age',
      'Academic Reference Letter 2 (recommended)',
      'Any other relevant document (optional)',
    ],
  },
  masters: {
    label: 'Master of Science (MSc)',
    duration: 'Full-Time: 12 months | Part-Time: 24 months',
    fee: '₦35,000',
    requirements: [
      "A Bachelor's degree in Engineering or Pure and Applied Science with at least Second Class Lower, OR",
      'A Postgraduate Diploma (PGD) in Engineering with a minimum CGPA of 3.5/5.0.',
    ],
    specializations: [
      'Engineering Innovation & Technology Management',
      'Supply Chain Technology Management',
      'Industrial Systems & Process Technology Management',
      'Production & Manufacturing Technology Management',
      'Artificial Intelligence & Automation Management',
      'Energy Technology Management',
    ],
    documents: [
      'Degree Certificate or Statement of Results',
      'Academic Transcript (recommended)',
      'NYSC Certificate or Exemption Letter',
      'Academic Reference Letter 1 (recommended)',
      'Birth Certificate or Declaration of Age',
      'Academic Reference Letter 2 (recommended)',
      'Any other relevant document (optional)',
    ],
  },
  phd: {
    label: 'Doctor of Philosophy (PhD)',
    duration: 'Full-Time: 36 months | Part-Time: 48 months',
    fee: '₦40,000',
    requirements: [
      "A Master's degree in a relevant Engineering or Pure and Applied Science discipline, with a minimum CGPA of 3.5/5.0, OR",
      'A degree from any METI programme with a minimum CGPA of 3.5/5.0.',
    ],
    specializations: [
      'Engineering Innovation & Technology Management',
      'Supply Chain Technology Management',
      'Industrial Systems & Process Technology Management',
      'Production & Manufacturing Technology Management',
      'Artificial Intelligence & Automation Management',
      'Energy Technology Management',
    ],
    documents: [
      'Degree Certificate or Statement of Results',
      'Academic Transcript (recommended)',
      'NYSC Certificate or Exemption Letter',
      'Academic Reference Letter 1 (recommended)',
      'Birth Certificate or Declaration of Age',
      'Academic Reference Letter 2 (recommended)',
      "Master's Degree Certificate",
      "Master's Degree Transcript",
      'Any other relevant document (optional)',
    ],
  },
};

function numbered(items) {
  return items.map((it, i) => `${i + 1}. ${it}`).join('\n');
}

function matchProgramme(text) {
  if (/\b(phd|doctor\w*)\b/.test(text)) return 'phd';
  if (/\b(masters?|msc|m\.sc)\b/.test(text)) return 'masters';
  if (/\b(pgd|diploma)\b/.test(text)) return 'pgd';
  return null;
}

const FAQ = [
  {
    keywords: ['about meti', 'what is meti institute', 'what is meti about', 'tell me about meti'],
    answer: 'METI is the Institute of Engineering, Technology and Innovation Management at the University of Port Harcourt — a postgraduate institute offering PGD, Masters, and PhD programmes focused on engineering and technology management.',
  },
  {
    keywords: ['how many programmes', 'how many courses', 'how many programs'],
    answer: 'METI offers 6 specialization tracks. All 6 are available at Masters and PhD level. Only 1 (Engineering Innovation & Technology Management) is available at PGD level.\n\nType "list masters", "list phd", or "list pgd" to see the full breakdown for each.',
  },
  {
    keywords: ['apply', 'application', 'how do i apply', 'can i apply'],
    answer: 'You can apply directly from your dashboard. If you already have an approved application, look for the "Apply for Another Programme" button.',
  },
  {
    keywords: ['rejected', 'reject', 'not approved', 'denied'],
    answer: 'If your application was not approved, you can reapply — go to your dashboard and click "Reapply" on that application. You will need to pay the application fee again for the new attempt.',
  },
  {
    keywords: ['how long', 'when will i', 'review time', 'how many days', 'processing time'],
    answer: 'Payment verification typically takes 24–48 working hours. Full application review time can vary — you\'ll receive an email the moment a decision is made, so keep an eye on your inbox and spam folder.',
  },
   {
       keywords: ['contact', 'reach', 'talk to admin', 'speak to someone', 'address', 'where is meti', 'location', 'office', 'call', 'phone', 'whatsapp', 'number'],
    answer: 'You can reach the admissions team through:\n\n1. Email: meti@uniport.edu.ng\n2. Tel: +234 816 468 3549\n3. WhatsApp only: +234 805 356 8220\n4. Office: Room 320–323, 2nd Floor, ETF Gas Engineering Building, Faculty of Engineering, Abuja Park Campus, University of Port Harcourt, Rivers State, Nigeria.',
  },
  {
    keywords: ['meti stand for', 'full meaning', 'full form', 'what does meti mean', 'meti acronym'],
    answer: 'METI stands for Institute of Engineering, Technology and Innovation Management, at the University of Port Harcourt.',
  },
  {
    keywords: ['about meti', 'history of meti', 'when was meti founded', 'cetm', 'when was meti established'],
    answer: 'The Centre for Engineering and Technology Management (CETM), under METI and the Faculty of Engineering, was approved at the 353rd extra-ordinary meeting of the UNIPORT Senate on December 3, 2009. The programmes were later upgraded to Management of Engineering (MOE) and Management of Technology (MOT), aligned with IAMOT, PICMET, and IEEE-IEMS international standards, in collaboration with the Graduate School of Technology Management (GSTM) at the University of Pretoria, South Africa.',
  },
  {
    keywords: ['approved', 'accredited', 'is meti approved', 'is meti legit', 'recognized by uniport', 'recognised by uniport'],
    answer: 'Yes — METI is fully approved by the University of Port Harcourt. It was approved at the 353rd extra-ordinary meeting of the UNIPORT Senate on December 3, 2009.',
  },
  {
    keywords: ['is meti good', 'is meti the best', 'best institute', 'top institute', 'reputable', 'quality of meti'],
    answer: 'Yes — METI is a top-notch institute, fully approved by the University of Port Harcourt and aligned with international standards (IAMOT, PICMET, IEEE-IEMS), in collaboration with the University of Pretoria\'s Graduate School of Technology Management.',
  },
  {
    keywords: ['director', 'who is the director', 'head of meti', 'who runs meti', 'who leads meti', 'big-alabo'],
    answer: 'Dr. Akuro Big-Alabo is the Director of METI and an Associate Professor of Mechanical Engineering at the University of Port Harcourt. He joined UNIPORT in 2008 and was promoted to Associate Professor in 2022. He previously served as Head of the Department of Mechanical Engineering (2020–2022) and Assistant Director of the Intellectual Property and Technology Transfer Office (IPTTO). His research focuses on Applied Mechanics and Design, systems dynamics, and innovation modeling.\n\nQualifications:\n1. Post-Doctoral Research Fellowship — University of Glasgow, UK\n2. PhD Mechanical Engineering — University of Glasgow, UK\n3. MSc Mechanical Engineering and Management (Distinction) — University of Glasgow, UK\n4. B.Eng Mechanical Engineering (First Class Honours) — University of Port Harcourt, Nigeria',
  },
];

function findAnswer(input) {
  const text = input.toLowerCase();

  // Plain "what is meti" / "what is meti?" on its own — the general
  // description. Kept as an exact-ish check, not a loose keyword, so it
  // doesn't hijack more specific questions like "what is meti phone number".
  if (/^what is meti\s*\??\s*$/.test(text.trim())) {
    return 'METI is the Institute of Engineering, Technology and Innovation Management at the University of Port Harcourt — a postgraduate institute offering PGD, Masters, and PhD programmes focused on engineering and technology management.';
  }

  // "list masters" / "list phd" / "list pgd" — full programme breakdown
  if (/\blist\b/.test(text)) {
    const prog = matchProgramme(text);
    if (prog) {
      const p = PROGRAMMES[prog];
      return `${p.label}\n\nDuration: ${p.duration}\nFee: ${p.fee}\n\nSpecializations:\n${numbered(p.specializations)}\n\nRequirements:\n${numbered(p.requirements)}`;
    }
  }

  // "requirements for phd" / "documents for masters" etc — programme-specific
  const prog = matchProgramme(text);
  if (prog && /(requirement|qualify|eligib)/.test(text)) {
    return `Requirements for ${PROGRAMMES[prog].label}:\n\n${numbered(PROGRAMMES[prog].requirements)}\n\nIf you meet these, you're eligible to apply.`;
  }
  if (prog && /(document|documents needed|what do i need|upload)/.test(text)) {
    return `Documents required for ${PROGRAMMES[prog].label}:\n\n${numbered(PROGRAMMES[prog].documents)}`;
  }
  if (prog && /(fee|cost|price|how much)/.test(text)) {
    return `${PROGRAMMES[prog].label} — Fee: ${PROGRAMMES[prog].fee}`;
  }
  if (prog && /(duration|how long is|how many years|how many months)/.test(text)) {
    return `${PROGRAMMES[prog].label} — Duration: ${PROGRAMMES[prog].duration}`;
  }
  if (prog && /(specializ|course|which course)/.test(text)) {
    return `Specializations available for ${PROGRAMMES[prog].label}:\n\n${numbered(PROGRAMMES[prog].specializations)}`;
  }

  // Generic "what courses/programmes are there" (no specific programme named)
  if (/(courses|programmes|programs|specialization|what can i study)/.test(text)) {
    return `METI offers 6 specialization tracks:\n\n${numbered(PROGRAMMES.masters.specializations)}\n\nAll 6 are available at Masters and PhD level. Only Engineering Innovation & Technology Management is available at PGD level.`;
  }

  // Generic requirements/documents (no programme named) — ask which one
  if (/(requirement|qualify|eligib)/.test(text)) {
    return 'Requirements differ by programme. Type "requirements for PGD", "requirements for Masters", or "requirements for PhD" and I\'ll list them for you.';
  }
  if (/(document|what do i need|upload)/.test(text)) {
    return 'Required documents differ slightly by programme (PhD needs a couple of extra ones). Type "documents for PGD", "documents for Masters", or "documents for PhD" and I\'ll list them for you.';
  }

  // Plain keyword FAQ fallback
  let best = null, bestScore = 0;
  for (const item of FAQ) {
    const score = item.keywords.filter(k => text.includes(k)).length;
    if (score > bestScore) { bestScore = score; best = item; }
  }
  return bestScore > 0 ? best.answer : null;
}

const MAX_MESSAGES = 20; // trims oldest messages once the chat gets this long, keeps it light

// Answers questions specific to whatever the person is actually looking
// at right now — e.g. "do I need a second degree" answers differently
// depending on which programme is currently selected. Reads only
// already-loaded context passed in as a prop — never fetches anything.
function contextualAnswer(text, context) {
  const prog = context?.selectedProgram; // 'PGD' | 'Masters' | 'PhD' | undefined
  if (/second degree/.test(text)) {
    if (prog === 'PhD') return 'Yes — a second degree (your Master\'s) is required for PhD applicants. Please fill in that section.';
    if (prog) return `No — the second degree section is only required for PhD applicants. Since you're applying for ${prog}, you can leave it blank if it doesn't apply to you.`;
    return 'The second degree section is only required for PhD applicants — optional for PGD and Masters.';
  }
  return null;
}

export default function ChatbotWidget({ context }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: context?.name
        ? `Hi ${context.name.split(' ')[0]}! Ask me anything about METI — try "list masters", "requirements for PhD", "documents for PGD", fees, applying, or reapplying.`
        : 'Hi! Ask me anything about METI — try "list masters", "requirements for PhD", "documents for PGD", fees, applying, or reapplying.',
    },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

 const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    const answer = contextualAnswer(userMsg.toLowerCase(), context) || findAnswer(userMsg);
    setMessages(prev => [
      ...prev,
      { from: 'user', text: userMsg },
      {
        from: 'bot',
        text: answer || "I'm not sure about that one — please contact the admissions team directly for help.",
        fallback: !answer,
      },
    ].slice(-MAX_MESSAGES));
    setInput('');
  };

  const handleClear = () => {
    setMessages([{ from: 'bot', text: 'Chat cleared. Ask me anything about METI!' }]);
  };

  return (
    <div className='font-serif'>

      <motion.button
        onClick={() => setOpen(!open)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-brand-primary text-white px-5 py-3.5 rounded-full shadow-xl font-bold text-sm"
      >
        <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
          <MessageCircle size={18} />
        </motion.span>
        Ask any question
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 h-[70vh] sm:h-[32rem] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            <div className="bg-brand-primary text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/images/metilogo1.png" alt="METI" className="w-7 h-7 rounded-full object-cover bg-white" />
                <p className="font-bold text-sm">METI Assistant</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleClear} className="text-[10px] font-bold underline text-white/80 hover:text-white">Clear</button>
                <button onClick={() => setOpen(false)}><X size={18} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line ${
                    m.from === 'user' ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {m.text}
                    {m.fallback && (
                      <a href="mailto:meti@uniport.edu.ng" className="mt-2 flex items-center gap-1 text-xs font-bold text-brand-primary underline">
                        <Mail size={12} /> Email Admin
                      </a>
                    )}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <div className="p-3 border-t border-gray-100 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your question…"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              <button onClick={handleSend} className="bg-brand-primary text-white p-2.5 rounded-full">
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}