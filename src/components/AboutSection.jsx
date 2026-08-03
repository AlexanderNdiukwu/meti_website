import { motion } from 'framer-motion';
import { Target, Compass, Zap, GraduationCap, Clock, CheckCircle } from 'lucide-react';

const AboutSection = () => {
  const cards = [
    {
      icon: <Compass className="w-8 h-8 text-blue-500" />,
      title: 'Our Vision',
      desc: 'To build competent and excellent capacity in the management of emerging engineering technologies and innovations in critical sectors that strengthen economic productivity of nations.'
    },
    {
      icon: <Target className="w-8 h-8 text-indigo-500" />,
      title: 'Our Mission',
      desc: 'To empower engineers and technology professionals with the integrated expertise, to lead innovation, optimize technology deployment, and manage strategic transformation.'
    },
    {
      icon: <Zap className="w-8 h-8 text-amber-500" />,
      title: 'Our Philosophy',
      desc: 'Grounded in fostering a holistic mindset where technical depth converges with entrepreneurial agility, systems thinking, and ethical stewardship.'
    }
  ];

  return (
    <section className="py-5 mt-10 bg-black/5   relative overflow-hidden">
      {/* Subtle background glow */}
      {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-uniport-blue opacity-20 blur-[120px] rounded-full pointer-events-none" /> */}
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-18">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl  lg:text-5xl font-extrabold md:font-bold  text-black uppercase mb-3"
          >
            About
            <span className='text-blue-800 border-b-4 border-blue-900 pr-1'> METI</span>
            
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold max-w-3xl mx-auto leading-tight"
          >
            Pioneering the intersection of engineering capability and business strategy.
          </motion.p>
        </div>

      <p className='text-center text-2xl mb-5 font-bold '>MOTTO: DRIVING SUSTAINABLE DEVELOPMENT THROUGH INNOVATION</p>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className=" border border-gray-700/10 p-8 rounded-2xl backdrop-blur-sm hover:border hover:border-black transition-colors"
            >
              <div className="w-16 h-16  rounded-xl flex items-center justify-center mb-6 shadow-inner border border-gray-800">
                {card.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
              <p className="text-lg leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Academic Program Admissions Requirements & Durations Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl lg:text-5xl font-black text-black uppercase mb-4"
            >
              Academic Program <span className="text-uniport-blue border-b-4 border-uniport-blue pb-1">Admissions</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg"
            >
              Requirements and duration schedules across our postgraduate diploma and degree tracks.
            </motion.p>
          </div>

          <div className="grid grid-cols-1  lg:grid-cols-3 gap-8">
            {/* PGD CARD */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50/50 border border-gray-200 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-50  text-uniport-blue rounded-2xl">
                    <GraduationCap size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Postgraduate Diploma (PGD)</h3>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-xs lg:text-sm font-bold  uppercase tracking-wider mb-3">Admission Criteria</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-uniport-blue mt-1 shrink-0" />
                       <p className=" text-sm md:text-lg leading-relaxed">
                    Candidates shall possess a Higher National Diploma (HND) or a Third-Class Bachelor’s Degree (<span className="font-semibold text-gray-800">B.Eng, B.Tech, or B.Sc.</span>) in an Engineering discipline or the Pure and Applied science from a recognised university.
                  </p>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-uniport-blue mt-1 shrink-0" />
                      <p className=" text-xs md:text-lg leading-relaxed">
                        Candidates from unrelated science disciplines must have a minimum of <span className="font-semibold ">Second Class Lower (2/2)</span>.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <div className="border-t border-gray-200/80 pt-6">
                  <h4 className="text-sm font-bold t uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Clock size={14} /> Programme Duration
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-sm font-medium">Full-Time:</span>
                      <span className="font-bold text-sm text-uniport-blue">12 - 24 Months</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-sm font-medium">Part-Time:</span>
                      <span className="font-bold text-sm text-indigo-600">24 - 36 Months</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* MASTERS CARD */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gray-50/50 border border-gray-200 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-50 text-uniport-blue rounded-2xl">
                    <GraduationCap size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Master of Science (M.Sc)</h3>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-bold  uppercase tracking-wider mb-3">Admission Criteria</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-uniport-blue mt-1 shrink-0" />
                      <p className=" text-xs md:text-lg leading-relaxed">
                        Bachelor’s degree (B.Eng., B.Tech., or B.Sc.) in Engineering or Pure/Applied Sciences with at least <span className="font-semibold text-gray-800">Second Class Lower Division</span>.
                      </p>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-uniport-blue mt-1 shrink-0" />
                      <p className=" text-xs md:text-lg leading-relaxed">
                        Or a PGD in Engineering or from METI with a minimum CGPA of <span className="font-semibold text-gray-800">3.5 on a 5.0 scale</span>.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <div className="border-t border-gray-200/80 pt-6">
                  <h4 className="text-sm font-bold  uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Clock size={14} /> Programme Duration
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-sm font-medium">Full-Time:</span>
                      <span className="font-bold text-sm text-uniport-blue">12 - 24 Months</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-sm font-medium">Part-Time:</span>
                      <span className="font-bold text-sm text-indigo-600">24 - 36 Months</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* PHD CARD */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50/50 border border-gray-200 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-50 text-uniport-blue rounded-2xl">
                    <GraduationCap size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Doctor of Philosophy (PhD)</h3>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-bold  uppercase tracking-wider mb-3">Admission Criteria</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-uniport-blue mt-1 shrink-0" />
                      <p className=" text-xs md:text-lg leading-relaxed">
                        Master’s degree (M.Eng., M.Tech., or M.Sc.) in Engineering or Pure and Applied Science disciplines.
                      </p>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-uniport-blue mt-1 shrink-0" />
                      <p className=" text-xs md:text-lg leading-relaxed">
                        Or hold a degree from <span className="font-semibold text-gray-800">any METI programme</span> with a minimum CGPA of <span className="font-semibold text-gray-800">3.5 (on a 5.0 scale)</span>.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <div className="border-t border-gray-200/80 pt-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Clock size={14} /> Programme Duration
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-sm font-medium">Full-Time:</span>
                      <span className="font-bold text-sm text-uniport-blue">36 - 48 Months</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-sm font-medium">Part-Time:</span>
                      <span className="font-bold text-sm text-indigo-600">36 - 60 Months</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
