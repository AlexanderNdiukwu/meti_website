import { motion } from 'framer-motion';
import { Clock, GraduationCap, CheckCircle, Calendar } from 'lucide-react';
import CourseTable from '../components/CourseTable';

const programsData = [
  {
    name: "Engineering Innovation & Technology Management",
    description: "Advanced research to bridge the gap between engineering excellence and strategic business leadership.",
    focus: "Innovation, Tech Commercialization"
  },
  {
    name: "Supply Chain Technology Management",
    description: "Cutting-edge research in logistics, global supply chain management, and emerging technologies.",
    focus: "Logistics, Blockchain, IoT"
  },
  {
    name: "Industrial Systems & Process Technology Management",
    description: "In-depth research on the optimization and management of complex industrial processes and systems.",
    focus: "Process Optimization"
  },
  {
    name: "Production & Manufacturing Technology Management",
    description: "Focuses on advanced modern manufacturing techniques and production management research.",
    focus: "Industry 4.0"
  },
  {
    name: "Artificial Intelligence & Automation Management",
    description: "Deep research into the application of AI and automation in engineering and business environments.",
    focus: "AI, Control Systems"
  },
  {
    name: "Energy Technology Management",
    description: "Research in management of energy resources, transition, and global decarbonization strategies.",
    focus: "Decarbonization, Renewables"
  }
];

const PhD = () => {
  return (
    <div className="pt-40 pb-24  bg-black/5 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Doctor of Philosophy (PhD)</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our PhD programs foster deep, independent research to solve complex technological and engineering management problems.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CourseTable programs={programsData} />
        </motion.div>

        {/* Admission Requirements & Programme Duration Section */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Admission Requirements */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gray-50/50 p-8 rounded-3xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 text-uniport-blue rounded-2xl">
                  <GraduationCap size={28} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Admission Requirements</h2>
              </div>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-uniport-blue mt-1 shrink-0" />
                  <p className=" text-sm md:text-lg leading-relaxed">
                    Candidates shall be required to possess a Master’s degree (<span className="font-semibold text-gray-800">M.Eng., M.Tech., or M.Sc.</span>) in an Engineering discipline or Pure and Applied Science disciplines.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-uniport-blue mt-1 shrink-0" />
                  <p className=" text-sm md:text-lg leading-relaxed">
                    Alternatively, candidates who hold a degree from <span className="font-semibold text-gray-800">any METI programme</span> with a minimum Cumulative Grade Point Average of <span className="font-semibold text-gray-800">3.5 (on a 5.0 scale)</span> are also eligible to apply.
                  </p>
                </li>
              </ul>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <span>Doctoral Track</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>University of Port Harcourt</span>
            </div>
          </motion.div>

          {/* Programme Duration */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gray-50/50 p-8 rounded-3xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 text-uniport-blue rounded-2xl">
                  <Clock size={28} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Programme Duration</h2>
              </div>

              <div className="space-y-6">
                {/* Full Time */}
                <div className="p-5 bg-white rounded-2xl border border-gray-100 flex items-start gap-4">
                  <div className="p-2.5 bg-gray-50 text-uniport-blue rounded-xl shadow-sm shrink-0 mt-0.5">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Full-Time Programme</h3>
                    <p className=" text-base leading-relaxed mb-2">
                      Rigorous, dedicated full-time research under faculty supervision.
                    </p>
                    <div className="inline-flex gap-2">
                      <span className="px-3 py-1 bg-blue-50 text-uniport-blue text-xs font-bold rounded-full">Min: 36 Months</span>
                      <span className="px-3 py-1 bg-blue-50 text-uniport-blue text-xs font-bold rounded-full">Max: 48 Months</span>
                    </div>
                  </div>
                </div>

                {/* Part Time */}
                <div className="p-5 bg-white rounded-2xl border border-gray-100 flex items-start gap-4">
                  <div className="p-2.5 bg-gray-50 text-uniport-blue rounded-xl shadow-sm shrink-0 mt-0.5">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Part-Time Programme</h3>
                    <p className=" text-base leading-relaxed mb-2">
                      Flexible thesis research combined with industrial executive schedules.
                    </p>
                    <div className="inline-flex gap-2">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">Min: 36 Months</span>
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">Max: 60 Months</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <span>Research Intensive</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>Independent / Guided</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PhD;
