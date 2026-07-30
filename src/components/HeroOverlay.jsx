import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowBigLeft } from 'lucide-react';

const Typewriter = ({ text, delay = 150, pause = 2500 }) => {
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    if (isDeleting) {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(prev => prev.slice(0, -1));
        }, delay / 2);
      } else {
        setIsDeleting(false);
      }
    } else {
      if (currentText.length < text.length) {
        timer = setTimeout(() => {
          setCurrentText(prev => prev + text[currentText.length]);
        }, delay);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pause);
      }
    }
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, text, delay, pause]);

  return (
    <span className="inline-block relative text-blue-600 font-black border-r-2 border-[#1a4fa0] pr-1 animate-pulse-fast">
      {currentText || "\u00A0"}
    </span>
  );
};

const HeroOverlay = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 px-6 pointer-events-none select-none">
      <motion.div 
        className="max-w-5xl text-center lg:mt- mt-30 flex flex-col items-center justify-center  p-7 md:p-12 lg:p-5 rounded-3xl  shadow-2xl pointer-events-auto"
        // className="max-w-5xl text-center flex flex-col items-center justify-center bg-white/70 md:bg-white/70 p-8 md:p-12 lg:p-10 rounded-3xl border border-white/40 shadow-2xl pointer-events-auto"
        // className="max-w-5xl text-center flex flex-col items-center justify-center bg-white/70 md:bg-white/20 backdrop-blur-sm p-8 md:p-12 lg:p-16 rounded-3xl border border-white/40 shadow-2xl pointer-events-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
      
        
        <h1 className="text-2xl lg:w-200  sm:text-3xl md:text-4xl lg:text-4xl font-black text-white leading-tight tracking-tight uppercase mb-6 max-w-4xl  drop-shadow-sm">
          {/* INSTITUTE OF ENGINEERING, TECHNOLOGY AND INNOVATION MANAGEMENT {''}
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-black  leading-tight text-blue-500 tracking-tight uppercase mb-6 max-w-4xl drop-shadow-sm">(METI)</span>
           */}
        </h1>
        
        {/* <div className="w-16 md:w-24 h-1 bg-[#1a4fa0] rounded-full mb-6" /> */}
        
        <p className="text-sm sm:text-base md:text-lg lg:text-4xl mb-4 italic font-extrabold text-white tracking-wide leading-relaxed font-serif max-w-3xl">
          DRIVING SUSTAINABLE DEVELOPMENT THROUGH <br></br> <Typewriter text="INNOVATION" />
        </p>

           <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <span className="relative group  ">
            <Link to="/signup" className="bg-white flex gap-4 items-center   hover:bg-blue-500 text-uniport-blue pl-8 pr-4 py-2 rounded-full font-bold text-lg transition-colors shadow-lg ">
              APPLY NOW 
            {/* <div className='size-2 bg-blue-700 animate-ping rounded-full'>

            </div> */}
            <ArrowBigLeft className='animate-ping'/>
            </Link>

          </span>
          <Link to="/about" className="bg-transparent border border-white text-white px-8 py-2 rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
            Learn More
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroOverlay;
