import { motion } from 'framer-motion';
import { Clock, GraduationCap, CheckCircle, Calendar } from 'lucide-react';
import CourseTable from '../components/CourseTable';

const programsData = [
  {
    name: "Engineering Innovation & Technology Management",
    description: "Foundational knowledge bridging engineering excellence and strategic business leadership.",
    focus: "Innovation Fundamentals"
  }
];

const PGD = () => {
  return (
    <div className="pt-40 pb-24  bg-black/5 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Postgraduate Diploma (PGD)</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The PGD program serves as a bridge for candidates from various backgrounds to gain fundamental knowledge in engineering and technology management.
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
                  <p className=" text-sm md:text-lg leading-relaxed">
                    Candidates shall possess a Higher National Diploma (HND) or a Third-Class Bachelor’s Degree (<span className="font-semibold text-gray-800">B.Eng, B.Tech, or B.Sc.</span>) in an Engineering discipline or the Pure and Applied science from a recognised university.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-uniport-blue mt-1 shrink-0" />
                  <p className=" text-sm md:text-lg leading-relaxed">
                    Candidates from unrelated science disciplines must have a minimum of <span className="font-semibold text-gray-800">second (2nd) class lower division</span> to be eligible for admission.
                  </p>
                </li>
              </ul>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <span>PGD Track</span>
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
                    <p className=" leading-relaxed  mb-2">
                      The full-time programme runs for continuous immersive coursework and projects.
                    </p>
                    <div className="inline-flex gap-2">
                      <span className="px-3 py-1 bg-blue-50 text-uniport-blue text-sm font-bold rounded-full">Min: 12 Months</span>
                      <span className="px-3 py-1 bg-blue-50 text-uniport-blue text-sm font-bold rounded-full">Max: 24 Months</span>
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
                    <p className=" leading-relaxed mb-2">
                      Flexible evening or weekend study modules for working professionals.
                    </p>
                    <div className="inline-flex gap-2">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-full">Min: 24 Months</span>
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-full">Max: 36 Months</span>
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

export default PGD;
