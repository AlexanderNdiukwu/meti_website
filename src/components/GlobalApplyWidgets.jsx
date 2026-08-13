import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, GraduationCap } from 'lucide-react';
import metilogo from '../../src/assets/unilogos/metilogo1.png'

const GlobalApplyWidgets = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Show first popup 12 seconds after mount to capture initial attention gently
    const initialDelay = setTimeout(() => {
      setShowPopup(true);
    }, 12000);

    // Repeat popup once every 60 seconds (1 minute)
    const interval = setInterval(() => {
      setShowPopup(true);
   
    }, 300000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  // Auto-close the popup after 8 seconds
  useEffect(() => {
    if (showPopup) {
      const dismissTimer = setTimeout(() => {
        setShowPopup(false);
      }, 8000);
      return () => clearTimeout(dismissTimer);
    }
  }, [showPopup]);

  return (
    <>
      {/* 1. STICKY PULSING "APPLY NOW" BUTTON (BOTTOM-LEFT) */}
      <motion.div
        className="fixed bottom-24 left-6 z-40 select-none pointer-events-auto"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <Link to="/signup" className="block">
          <motion.div
            className="flex items-center gap-2.5 bg-uniport-blue text-white px-6 py-2 rounded-full font-bold text-sm md:text-base uppercase tracking-wider shadow-xl border border-white/20 hover:bg-[#1a4fa0] transition-colors cursor-pointer"
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 10px 15px -3px rgba(0, 51, 102, 0.3), 0 4px 6px -4px rgba(0, 51, 102, 0.3)",
                "0 20px 25px -5px rgba(0, 51, 102, 0.5), 0 10px 10px -5px rgba(0, 51, 102, 0.4)",
                "0 10px 15px -3px rgba(0, 51, 102, 0.3), 0 4px 6px -4px rgba(0, 51, 102, 0.3)"
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
                 <img 
                  src="/images/metilogo1.png" 
                  alt="METI Logo" 
                  className="size-5 md:size-9 object-cover bg-white rounded-full shadow-sm" 
                />
            <span>Apply Now</span>
          </motion.div>
        </Link>
      </motion.div>

      {/* 2. RECURRING POPUP MODAL (BOTTOM-RIGHT / CENTERED OVERLAY) */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-[90%] md:w-96 bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-gray-100 shadow-2xl pointer-events-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Popup Header & Icon */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5   rounded-2xl shrink-0">
                {/* <Sparkles className="w-5 h-5 animate-pulse" /> */}
                <img src={metilogo} alt='metilogo' className='w-12 h-10 '/>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">METI Uniport</h4>
                <h3 className="font-extrabold text-gray-900 text-lg">Admissions Are Open!</h3>
              </div>
            </div>

            {/* Popup Content */}
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Unlock your potential in technology leadership. Apply for our <span className="font-semibold text-gray-800">PGD, M.Sc, or PhD</span> programs today and secure your enrollment.
            </p>

            {/* CTA Button */}
            <div className="flex gap-3">
              <Link 
                to="/signup" 
                onClick={() => setShowPopup(false)}
                className="flex-1 py-3 text-center bg-uniport-blue text-white font-bold text-sm rounded-2xl hover:bg-[#1a4fa0] transition-colors shadow-md shadow-blue-900/10"
              >
                APPLY NOW
              </Link>
              <button 
                onClick={() => setShowPopup(false)}
                className="px-4 py-3 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-2xl transition-colors"
              >
                Later
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalApplyWidgets;
