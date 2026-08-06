// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Search, ArrowRight, Lightbulb } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const CourseRecommender = () => {
//   const [keyword, setKeyword] = useState('');
//   const [suggestion, setSuggestion] = useState(null);

//   const keywordsToProgram = {
//     'business': 'Engineering Innovation & Technology Management',
//     'manage': 'Engineering Innovation & Technology Management',
//     'lead': 'Engineering Innovation & Technology Management',
//     'supply': 'Supply Chain Technology Management',
//     'logistics': 'Supply Chain Technology Management',
//     'blockchain': 'Supply Chain Technology Management',
//     'process': 'Industrial Systems & Process Technology Management',
//     'system': 'Industrial Systems & Process Technology Management',
//     'manufactur': 'Production & Manufacturing Technology Management',
//     'product': 'Production & Manufacturing Technology Management',
//     'ai': 'Artificial Intelligence & Automation Management',
//     'artificial': 'Artificial Intelligence & Automation Management',
//     'robot': 'Artificial Intelligence & Automation Management',
//     'energy': 'Energy Technology Management',
//     'power': 'Energy Technology Management',
//     'oil': 'Energy Technology Management'
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     const query = keyword.toLowerCase();
    
//     let matchedProgram = null;
//     for (const [key, program] of Object.entries(keywordsToProgram)) {
//       if (query.includes(key)) {
//         matchedProgram = program;
//         break;
//       }
//     }

//     if (matchedProgram) {
//       setSuggestion({
//         title: matchedProgram,
//         desc: "Based on your background, this program aligns perfectly with your goals.",
//         link: "/masters"
//       });
//     } else {
//       setSuggestion({
//         title: "Engineering Innovation & Technology Management",
//         desc: "A great foundational program that bridges all disciplines. Or, browse our full catalog.",
//         link: "/courses"
//       });
//     }
//   };

//   return (
//     <section className="py-20 bg-white border-t border-gray-100">
//       <div className="container mx-auto px-6 max-w-4xl">
//         <div className="bg-gray-50 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-200">
//           <div className="text-center mb-10">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">Find the Best Program for You</h2>
//             <p className="text-gray-600">Tell us your background or interests (e.g., "AI", "Manufacturing", "Business") and we'll recommend the perfect fit.</p>
//           </div>

//           <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-10">
//             <input 
//               type="text"
//               placeholder="e.g. I work in logistics and supply chain..."
//               className="w-full bg-white text-gray-900 border border-gray-300 rounded-full py-4 pl-6 pr-32 focus:outline-none focus:ring-2 focus:ring-uniport-blue shadow-sm"
//               value={keyword}
//               onChange={(e) => setKeyword(e.target.value)}
//             />
//             <button 
//               type="submit"
//               className="absolute right-2 top-2 bg-uniport-blue text-white p-2 rounded-full hover:bg-blue-800 transition-colors w-24 flex justify-center items-center font-bold shadow-md"
//             >
//               Search
//             </button>
//           </form>

//           {suggestion && (
//             <motion.div 
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-white rounded-2xl p-6 border border-uniport-blue/30 shadow-md max-w-2xl mx-auto"
//             >
//               <div className="flex items-start gap-4">
//                 <div className="p-3 bg-blue-50 rounded-xl text-uniport-blue shrink-0">
//                   <Lightbulb size={24} />
//                 </div>
//                 <div>
//                   <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Recommended Match</h4>
//                   <h3 className="text-xl font-bold text-gray-900 mb-2">{suggestion.title}</h3>
//                   <p className="text-gray-600 mb-4">{suggestion.desc}</p>
//                   <Link to={suggestion.link} className="inline-flex items-center text-uniport-blue font-bold hover:text-blue-800">
//                     Explore Program <ArrowRight className="ml-2 w-4 h-4" />
//                   </Link>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CourseRecommender;


import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { useAdmissionsStore } from '../store/admissionsStore';

const CourseRecommender = () => {
  const navigate = useNavigate();
  const { selectProgram } = useAdmissionsStore();
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState(null);

  const programs = [
    {
      title: 'Engineering Innovation & Technology Management',
      desc: 'Bridge the gap between engineering excellence and strategic business leadership.',
      keywords: ['business', 'management', 'leadership', 'innovation', 'commercialization', 'strategy']
    },
    {
      title: 'Supply Chain Technology Management',
      desc: 'Advanced knowledge in logistics, global supply chain management, and emerging technologies.',
      keywords: ['supply', 'logistics', 'blockchain', 'transport', 'iot', 'operations']
    },
    {
      title: 'Industrial Systems & Process Technology Management',
      desc: 'Optimization and management of complex industrial processes and systems.',
      keywords: ['process', 'systems', 'industrial', 'optimization', 'engineering']
    },
    {
      title: 'Production & Manufacturing Technology Management',
      desc: 'Focuses on advanced modern manufacturing techniques and production management research.',
      keywords: ['manufacturing', 'production', 'factory', 'plant', 'industry 4.0', 'automation']
    },
    {
      title: 'Artificial Intelligence & Automation Management',
      desc: 'Deep research into the application of AI and automation in engineering and business environments.',
      keywords: ['ai', 'artificial', 'robotics', 'automation', 'control', 'intelligence']
    },
    {
      title: 'Energy Technology Management',
      desc: 'Research in management of energy resources, transition, and global decarbonization strategies.',
      keywords: ['energy', 'power', 'oil', 'gas', 'renewable', 'solar', 'sustainability']
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    
    const query = keyword.trim();

    const fuseOptions = {
      keys: ['title', 'keywords', 'desc'],
      threshold: 0.6,
      includeScore: true
    };

    const fuse = new Fuse(programs, fuseOptions);
    const searchResults = fuse.search(query);

    let matches = [];

    if (searchResults.length > 0) {
      matches = searchResults.map(res => ({
        ...res.item,
        matchPercentage: Math.round((1 - res.score) * 100)
      }));
    } else {
      // Default fallback if no search matches
      matches = [
        { ...programs[0], matchPercentage: 85 },
        { ...programs[2], matchPercentage: 72 },
        { ...programs[4], matchPercentage: 60 }
      ];
    }

    if (matches.length > 3) {
      matches = matches.slice(0, 3);
    }

    setSuggestions(matches);
  };

  const handleApplyNow = (progTitle) => {
    // Save selections to Zustand store and navigate to apply flow
    selectProgram('Masters', progTitle);
    navigate('/signup');
  };

  return (
    <section className="py-20 border-t border-gray-100">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="bg-gray-50 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-200">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find the Best Program for You</h2>
            <p className="text-gray-600">Tell us your background or interests (e.g., "AI", "Manufacturing", "Business") and we'll recommend the perfect fit.</p>
          </div>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-10">
            <input 
              type="text"
              placeholder="e.g. I work in logistics and supply chain..."
              className="w-full bg-white text-gray-900 border border-gray-300 rounded-full py-4 pl-6 pr-32 focus:outline-none focus:ring-2 focus:ring-uniport-blue shadow-sm text-sm"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button 
              type="submit"
              className="absolute right-2 top-2 bg-uniport-blue text-white p-2 rounded-full hover:bg-blue-800 transition-colors w-24 flex justify-center items-center font-bold shadow-md text-xs cursor-pointer"
            >
              Search
            </button>
          </form>

          {suggestions && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 text-center">Top Recommendations</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestions.map((suggestion, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-6 border border-uniport-blue/20 shadow-md flex flex-col justify-between h-full hover:border-uniport-blue/40 transition-colors">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 text-uniport-blue rounded-xl">
                          <Lightbulb size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          {suggestion.matchPercentage}% Match
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">M.Sc / PGD / PhD</span>
                      <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight">{suggestion.title}</h3>
                      <p className="text-gray-500 mb-6 text-xs leading-relaxed">{suggestion.desc}</p>
                    </div>
                    
                    <button
                      onClick={() => handleApplyNow(suggestion.title)}
                      className="w-full bg-uniport-blue hover:bg-blue-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Apply Now</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CourseRecommender;
