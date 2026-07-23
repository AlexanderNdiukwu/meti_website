import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const programs = [
  {
    id: 'masters',
    title: 'Masters Programs',
    desc: 'Advanced management frameworks integrated with deep technical acumen.',
    link: '/masters',
    color: 'from-blue-600 to-uniport-blue',
  },
  {
    id: 'phd',
    title: 'PhD Programs',
    desc: 'Cutting-edge research and innovation for global technology economy.',
    link: '/phd',
    color: 'from-indigo-600 to-blue-900',
  },
  {
    id: 'pgd',
    title: 'PGD Programs',
    desc: 'Bridging the gap between engineering excellence and strategic business leadership.',
    link: '/pgd',
    color: 'from-blue-500 to-blue-700',
  }
];

const ProgramOverview = () => {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight"
          >
            Explore Our Programs
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Specialized tracks designed for the next generation of engineering and technology leaders.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((prog, idx) => (
            <motion.div
              key={prog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
            >
              <Link to={prog.link} className="block group">
                {/* Irregular shape card using custom clip-path utility defined in index.css */}
                <div className="relative h-80 w-full overflow-hidden rounded-2xl clip-irregular transition-all duration-500 transform group-hover:scale-[1.02] group-hover:shadow-2xl">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${prog.color} opacity-90 transition-opacity duration-500 group-hover:opacity-100`} />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end text-white z-10">
                    <div className="transform transition-transform duration-500 group-hover:-translate-y-4">
                      <h3 className="text-3xl font-bold mb-3">{prog.title}</h3>
                      <p className="text-blue-100 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 h-0 group-hover:h-auto">
                        {prog.desc}
                      </p>
                      <div className="inline-flex items-center font-semibold text-white group-hover:text-blue-200 transition-colors">
                        Discover More <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramOverview;
