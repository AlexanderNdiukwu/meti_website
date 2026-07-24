import { motion } from 'framer-motion';

// AUTO IMPORT ALL IMAGES from public/assets/staff_of_meti/
const imageModules = import.meta.glob(
  '/src/assets/principalofficers/*.{jpeg,jpg,png}',
  { eager: true }
);

// BUILD IMAGE MAP: filename -> resolved URL
const imageMap = {};
Object.entries(imageModules).forEach(([path, mod]) => {
  const fileName = path.split('/').pop();
  imageMap[fileName] = mod.default || mod;
});

// STAFF DATA — each image key matches the filename in public/assets/staff_of_meti/
const facilitators = [
  //  {
  //   name: "Prof. CHIKE PRINCEWILL REWHUAMWHU CHIKE",
  //   role: "10th Vice-Chancellor , University of Port Harcourt",
  //   special: "MD , DMP ,DSSRS",
  //   image: "pal7.png"
  // },
  {
    
    name: "PROFESSOR CHUKWUDI O. ONYEASO",
    role: "Deputy Vice-Chancellor",
    special: "BDS [IB], FWACS, FWFO, MSIL, MICS,FICOI, D.Sc, FIMC, CMC",
    image: "pal1.jpeg"
  },
  {
    name: "PROFESSOR ROSEMARY N. OGU",
    role: "Deputy Vice-Chancellor",
    special: "MBBS, MScRH, FWACS, FICS, MScRH[UNIBEN], FMCOG",
    image: "pal2.jpeg"
  },
  {
    name: "PROFESSOR ANGELA I. FRANK-BRIGGS",
    role: "Deputy Vice-Chancellor",
    special: "MBBch [UPH], FMC",
    image: "pal3.jpeg"
  },
  {
    name: "MRS. GLORIA OBIAGERI CHINDAH",
    role: "REGISTRAR",
    special: "B.Ed. (Ibadan), M.Ed., Ph.D (UPH) FCIA",
    image: "pal4.jpeg"
  },
  {
    name: "DR. GODPOWER WOBIARAERI OBAH",
    role: "BURSAR",
    special: "FCNA, ACTI, AMNAA, B.SC [UPH],M.SC, PhD",
    image: "pal6.jpeg"
  },
  {
    name: "PROF. HELEN UZOEZI EMASEALU",
    role: "B.A, MLS, Ph.D. [Ibadan] CLN.",
    special: "University Librarian",
    image: "pal5.jpeg"
  },
 
];

const Principalsgrid = () => {
  return (
    <div>

      <div className=' pt-5 gap-4'>
        <div className='flex justify-center'>
      <img src="/src/assets/principalofficers/pal7.png" alt="" className={'w-70 h-90'}/>


        </div>
       <div className='flex-col justify-start'>
        <p className='font-bold text-2xl '>Prof. CHIKE PRINCEWILL REWHUAMWHU CHIKE</p>
        <p className='font-bold text-uniport-blue'>10th Vice-Chancellor , University of Port Harcourt</p>
        <p className='font-bold'>MD , DMP ,DSSRS</p>
       </div>

      </div>



    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-6 pt-10">
      
    
      {facilitators.map((staff, idx) => (
        <motion.div
          key={idx}
          className="bg-gray-50/50 p-6 rounded-2xl hover:scale-120 border border-gray-200 text-center hover:shadow-lg transition-all duration-300"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: idx * 0.08 }}
          whileHover={{ y: -7 }}
        >
          {/* CIRCULAR IMAGE */}
          <div className="flex justify-center mb-4">
            <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden ring-2 ring-white bg-gray-100">
              <img
                src={imageMap[staff.image]}
                alt={staff.name}
                className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>

          {/* TEXT */}
          <h3 className="font-bold text-lg text-gray-900 mb-1">{staff.name}</h3>
          <p className="text-sm font-semibold text-[#1a4fa0] mb-2">{staff.role}</p>
          <p className="text-xs text-gray-500 leading-relaxed">{staff.special}</p>
        </motion.div>
      ))}
    </div>

    </div>




  );
};

export default Principalsgrid;
