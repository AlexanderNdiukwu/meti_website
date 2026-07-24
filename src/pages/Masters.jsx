import { motion } from 'framer-motion';
import { Clock, GraduationCap, CheckCircle, Calendar } from 'lucide-react';
import CourseTable from '../components/CourseTable';

const programsData = [
  {
    name: "Engineering Innovation & Technology Management",
    description: "Bridges the gap between engineering excellence and strategic business leadership. Cultivates visionary professionals.",
    focus: "Innovation, Leadership"
  },
  {
    name: "Supply Chain Technology Management",
    description: "Advanced knowledge in logistics, supply chain management, and cutting-edge technologies like IoT and Blockchain.",
    focus: "Logistics, Automation"
  },
  {
    name: "Industrial Systems & Process Technology Management",
    description: "Focuses on the design, optimization and management of complex industrial processes and systems.",
    focus: "Systems Engineering"
  },
  {
    name: "Production & Manufacturing Technology Management",
    description: "Prepares students for modern manufacturing environments, focusing on Industry 4.0 and smart production.",
    focus: "Smart Manufacturing"
  },
  {
    name: "Artificial Intelligence & Automation Management",
    description: "Application of AI and intelligent automation in solving complex engineering and business challenges.",
    focus: "AI, Robotics"
  },
  {
    name: "Energy Technology Management",
    description: "Management of energy resources, energy transition, and decarbonization strategies for a sustainable future.",
    focus: "Energy Transition"
  }
];

const Masters = () => {
  return (
    <div className="pt-40 pb-24 bg-black/5 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Masters Programs (M.Sc)</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our Masters degree programs are designed to equip you with advanced technical acumen and strategic management skills.
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
            className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
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
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    Candidates shall be required to possess a bachelor’s degree (<span className="font-semibold text-gray-800">B.Eng., B.Tech., or B.Sc.</span>) in an Engineering discipline or Pure and Applied Science disciplines at a minimum of <span className="font-semibold text-gray-800">second (2nd) class lower division</span>.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-uniport-blue mt-1 shrink-0" />
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    Candidates with a <span className="font-semibold text-gray-800">Post Graduate Diploma (PGD)</span> in an Engineering discipline or from the Institute of Engineering, Technology and Innovation Management with a minimum Cumulative Grade Point Average of <span className="font-semibold text-gray-800">3.5 on a 5.0 scale</span> are also eligible to apply.
                  </p>
                </li>
              </ul>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <span>M.Sc / M.Eng Track</span>
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
            className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
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
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4">
                  <div className="p-2.5 bg-white text-uniport-blue rounded-xl shadow-sm shrink-0 mt-0.5">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Full-Time Programme</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-2">
                      The full-time master's programme runs for a rigorous calendar duration.
                    </p>
                    <div className="inline-flex gap-2">
                      <span className="px-3 py-1 bg-blue-50 text-uniport-blue text-xs font-bold rounded-full">Min: 12 Months</span>
                      <span className="px-3 py-1 bg-blue-50 text-uniport-blue text-xs font-bold rounded-full">Max: 24 Months</span>
                    </div>
                  </div>
                </div>

                {/* Part Time */}
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4">
                  <div className="p-2.5 bg-white text-uniport-blue rounded-xl shadow-sm shrink-0 mt-0.5">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Part-Time Programme</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-2">
                      Structured learning with modules suitable for professional life.
                    </p>
                    <div className="inline-flex gap-2">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">Min: 24 Months</span>
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">Max: 36 Months</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <span>Flexible Delivery</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>Hybrid / On-Campus</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Masters;
