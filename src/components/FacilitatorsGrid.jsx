import { motion } from 'framer-motion';

// AUTO IMPORT ALL IMAGES from public/assets/staff_of_meti/
const imageModules = import.meta.glob(
  '/src/assets/facilitators/*.{jpeg,jpg,png}',
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
    name: "Prof. Joseph A. Ajienka",
    role: "Emeritus Professor",
    special: "Petroleum and Gas Engineering",
    image: "fat1.jpeg"
  },
  {
    name: "Engr. Henry Imarhiagbe ",
    role: "Senior Consultant",
    special: "SPDC",
    image: "fat2.jpeg"
  },
  {
    name: "Barr. Eno-Obong Y. Usen ",
    role: "Deputy, Chief Registrar",
    special: "Federal Mininstry of Commerce",
    image: "fat3.jpeg"
  },
  {
    name: "Prof. E. O. Diemuodeke",
    role: "Professor of Mechanical engineering",
    special: "",
    image: "fat4.jpeg"
  },
  {
    name: "Prof. Tobinson Alasin Briggs",
    role: "Dean, Faculty of Engineering ",
    special: "Industrial and Systems Engineering; Mechanical Engineering",
    image: "fat5.jpeg"
  },
  {
    name: "Prof. Mary Paschal Iwundu",
    role: "Director of Information and Communications Technology Center (ICTC), UNIPORT.",
    special: "(Mathematics and Statistics)",
    image: "fat8.jpeg"
  },
    {
    name: "Prof. Budu Dennis Eme",
    role: "Professor of Civil Engineering",
    special: "Former Director of the Center for Geo-technical and Coastal Engineering Research (CGCER), Uniport.",
    image: "fat7.jpeg"
  },
    {
    name: "Prof. Ejikeme Ugwoha",
    role: "Professor of Civil and Environmental Engineering",
    special: "Deputy Director of the Centre for Occupational Health, Safety and Environment (COHSE), Uniport.",
    image: "fat9.jpeg"
  },
    {
    name: "Prof. Ifeoma Asianuba",
    role: "Associate Professor of Electrical/Electronic Engineering",
    special: "Assistant Director Emerald Energy Institute, Uniport.",
    image: "fat10.jpeg"
  },
    {
    name: "Dr Amieibibama Joseph ",
    role: "Associate Professor of Petroleum & Gas Engineering",
    special: "Immediate past Head of Department (HOD), Petroleum & Gas Engineering, Uniport.Deputy Director, the Institute of Petroleum and Energy Studies (IPES), Uniport.",
    image: "fat11.jpeg"
  }

];

const FacilitatorsGrid = () => {
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
          <p className="text-xs text-gray-500 leading-relaxed">{staff.special}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default FacilitatorsGrid;
