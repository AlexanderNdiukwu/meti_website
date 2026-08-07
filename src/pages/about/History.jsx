import { motion } from 'framer-motion';
import { Calendar, Award, BookOpen, Clock, Users } from 'lucide-react';
import About from '../About';
import metilogo from '../../assets/unilogos/metilogo1.png';

const TIMELINE_EVENTS = [
  {
    year: "2009",
    title: "The Beginning",
    desc: "The Center for Engineering and Technology Management (CETM) in the Institute of Engineering, Technology and Innovation Management (METI), under the Faculty of Engineering, was approved at the 353rd extra-ordinary meeting of the Senate on December 3, 2009. MEM programmes were upgraded to Management of Engineering (MOE) and Management of Technology (MOT) in line with IAMOT, PICMET, and IEEE-IEMS international standards. This was done in collaboration with the Graduate School of Technology Management (GSTM) at the University of Pretoria, South Africa.",
    icon: <Calendar className="w-5 h-5 text-white" />,
    color: "bg-[#003366]"
  },
  {
    year: "2010 - 2024",
    title: "Academic Program Commencement and Progression",
    desc: "Between 2010 and 2024, CETM offered postgraduate certificate/diploma programmes in Project Management, ICT Networks, Maintenance Management, and Business Information Systems, as well as Master and PhD programmes in Engineering Management, Technology Management, and ICT Management.",
    icon: <BookOpen className="w-5 h-5 text-white" />,
    color: "bg-blue-600"
  },
  {
    year: "2025",
    title: "Program Restructuring",
    desc: "In 2025, CETM launched new programmes matching current technological developments and labour market demands. New postgraduate programmes were introduced leading to a Post Graduate Diploma (PGD) in Engineering Innovation and Technology Management, Master of Science (MSc), and Doctor of Philosophy (PhD) in specialties such as Engineering Innovation and Technology Management , Supply Chain Technology Management, Industrial Systems & Process Technology Management, Production & Manufacturing Technology Management , Artificial Intelligence & Automation Management, and Energy Technology Management.",
    icon: <Award className="w-5 h-5 text-white" />,
    color: "bg-emerald-600"
  }
];

const PAST_DIRECTORS = [
  { name: "Prof. J. Amadi-Echendu", tenure: "2009 - 2013" },
  { name: "Prof. O.M.O. Efebu", tenure: "2013 - 2015" },
  { name: "Prof. S.U. Ejezie", tenure: "2015 - 2017" },
  { name: "Dr. U.A. Kamalu", tenure: "2017 - 2021" },
  { name: "Dr. E. Omorogiuwa", tenure: "2021 - 2025" }
];

export default function History() {
  return (
    <div className="pt-10 pb-24 bg-black/5 min-h-screen">
        {/* <About/> */}
      <div className="container  px-5  space-y-16">
        
        {/* Page Header */}
        <div className="flex justify-center gap-3 mb-6">

            <img src={metilogo} alt="METI Logo" className="w-39 h-30" />

        </div>

        <div className="text-center">
          <span className="text-xl border font-bold bg-blue-50 text-uniport-blue px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
            Our Legacy
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Historical Background</h1>
          <p className=" text-xl max-w-xl mx-auto">
            Discover the evolution of the Institute of Engineering, Technology and Innovation Management (METI).
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative  border-gray-200 pl-6 ml-2 md:ml-6 space-y-12">
          {TIMELINE_EVENTS.map((evt, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative bg-white p-4 md:p-8 rounded-3xl border border-black/10 shadow-sm"
            >
              {/* Event Circle Dot Icon */}
              <div className={`absolute -left-12.5 top-8 size-10 rounded-full flex items-center justify-center shadow-md ${evt.color}`}>
                {evt.icon}
              </div>

              <span className="text-xl font-black text-uniport-blue mb-1 block">{evt.year}</span>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-4">{evt.title}</h3>
              <p className=" text-xl leading-relaxed">{evt.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Photo Gallery Placeholder */}
        <div className=" p-3 rounded-3xl border border-black/10 shadow-sm">
        

             <img 
               
                  src="/images/metibuilding.jpeg" 
                  alt="Uniport Logo" 
                  className="w-full object-contain h-140  " 
                />
          {/* <h3 className="text-xl font-bold text-gray-900 mb-6">Institute Archives</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="aspect-video bg-gray-100 rounded-2xl flex flex-col items-center justify-center border border-gray-200">
              <span className="text-xs font-bold text-gray-400">METI Gas Engineering Complex</span>
              <span className="text-[10px] text-gray-400 mt-1">Image Placeholder</span>
            </div>
            <div className="aspect-video bg-gray-100 rounded-2xl flex flex-col items-center justify-center border border-gray-200">
              <span className="text-xs font-bold text-gray-400">Collaborating GSTM Pretoria Boardroom</span>
              <span className="text-[10px] text-gray-400 mt-1">Image Placeholder</span>
            </div>
          </div> */}
        </div>

        {/* Past Directors Grid */}
        <div className="bg-white p-3 rounded-3xl border border-black/10 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-blue-50 text-uniport-blue rounded-xl">
              <Users size={20} />
            </div>
            <h3 className="text-2xl font-bold ">Past Directors of METI</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {PAST_DIRECTORS.map((dir, idx) => (
              <div key={idx} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                <h4 className="font-bold text-gray-900 text-xl leading-snug">{dir.name}</h4>
                <span className="text-xl font-semibold text-uniport-blue mt-1 block uppercase tracking-wider">{dir.tenure}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
