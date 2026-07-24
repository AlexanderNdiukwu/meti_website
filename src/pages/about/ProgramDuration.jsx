import { Clock, Calendar, CheckCircle2 } from 'lucide-react';

const DURATION_ITEMS = [
  {
    program: "Postgraduate Diploma (PGD)",
    fullTime: "12 Calendar Months (Min) | 24 Calendar Months (Max)",
    partTime: "24 Calendar Months (Min) | 36 Calendar Months (Max)",
    info: "Serves as an academic bridge for candidates transitions."
  },
  {
    program: "Master of Science (M.Sc)",
    fullTime: "12 Calendar Months (Min) | 24 Calendar Months (Max)",
    partTime: "24 Calendar Months (Min) | 36 Calendar Months (Max)",
    info: "Professional coursework combined with collaborative projects."
  },
  {
    program: "Doctor of Philosophy (PhD)",
    fullTime: "36 Calendar Months (Min) | 48 Calendar Months (Max)",
    partTime: "36 Calendar Months (Min) | 60 Calendar Months (Max)",
    info: "Independent doctoral research and guided dissertation defense."
  }
];

export default function ProgramDuration() {
  return (
    <div className="pt-10 pb-24 bg-black/5 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl space-y-12">
        
        {/* Header */}
        <div className="text-center">
          <span className="text-lg font-bold bg-blue-50 text-uniport-blue px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
            Timelines
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Programme Duration</h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Official calendar month thresholds for full-time and part-time study schedules at METI.
          </p>
        </div>

        {/* Duration Cards */}
        <div className="space-y-6">
          {DURATION_ITEMS.map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-black/10 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              <div className="md:col-span-4 space-y-2">
                <div className="flex items-center gap-2 text-uniport-blue font-bold">
                  <Clock size={18} />
                  <h3 className="text-lg font-black text-gray-900 leading-tight">{item.program}</h3>
                </div>
                <p className="text-gray-400 text-xs">{item.info}</p>
              </div>

              <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Full-Time Track</span>
                  <span className="text-sm font-extrabold text-gray-800 flex items-center gap-1">
                    <Calendar size={14} className="text-[#10b981]" />
                    {item.fullTime}
                  </span>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Part-Time Track</span>
                  <span className="text-sm font-extrabold text-gray-800 flex items-center gap-1">
                    <Calendar size={14} className="text-uniport-blue" />
                    {item.partTime}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Policy block */}
        <div className="bg-white p-8 rounded-3xl border border-black/10 shadow-sm space-y-4">
          <h4 className="text-base font-bold text-gray-900">Academic Progress Policy</h4>
          <ul className="space-y-3 text-xs text-gray-600 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-uniport-blue shrink-0 mt-0.5" />
              <span>Full-time students are expected to maintain minimum course unit loads each semester in compliance with the School of Graduate Studies regulations.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-uniport-blue shrink-0 mt-0.5" />
              <span>Part-time schedules utilize hybrid teaching methods, incorporating offline seminars and virtual modules to support professional executives.</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
