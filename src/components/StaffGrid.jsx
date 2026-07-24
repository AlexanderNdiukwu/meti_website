import { motion } from 'framer-motion';

// AUTO IMPORT ALL IMAGES from public/assets/staff_of_meti/
const imageModules = import.meta.glob(
  '/src/assets/staff_of_meti/*.{jpeg,jpg,png}',
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
  {
    name: "Dr. A. Big-Alabo",
    role: "Director",
    special: "B.ENG , M,SC , PH.D , MIOP(UK) , MIAENG , MNSE , R.ENG",
    image: "staff_of_meti7.jpeg"
  },
  {
    name: "Mrs Helen Ezekiel",
    role: "P.A.R (ADMIN HEAD)",
    special: "",
    image: "staff_of_meti1.jpeg"
  },
  {
    name: "Mrs Rose Ugari",
    role: "Deputy Bursar (Finance)",
    special: "",
    image: "staff_of_meti3.jpeg"
  },
  {
    name: "Mrs Ronke A. Rotimi",
    role: "P.A.R (Admin)",
    special: "",
    image: "staff_of_meti2.jpeg"
  },
  {
    name: "Ibisotonte A. Ekine",
    role: "Director's Personal Assistant",
    special: "",
    image: "staff_of_meti4.jpeg"
  },
  {
    name: "Mrs Florence Ogbegbe",
    role: "Care-Taker",
    special: "",
    image: "staff_of_meti5.jpeg"
  },
  {
    name: "Mrs Beauty Ichechukwu",
    role: "Cleaner",
    special: "",
    image: "staff_of_meti6.jpeg"
  }
];

const StaffGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {facilitators.map((staff, idx) => (
        <motion.div
          key={idx}
          className="bg-gray-50/50 p-6 rounded-2xl border border-gray-200 text-center hover:shadow-lg transition-all duration-300"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: idx * 0.08 }}
          whileHover={{ y: -6 }}
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
          <p className="text-sm font-bold leading-relaxed">{staff.special}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default StaffGrid;
