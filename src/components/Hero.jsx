import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroOverlay from './HeroOverlay';
import ScrollVelocity from './ScrollVelocity';

// DYNAMICALLY SCAN ALL IMAGES INSIDE public/Metiheroimagesslides
const imageModules = import.meta.glob(
  '/src/assets/Metiheroimagesslides/*.{jpeg,jpg,png,PNG,JPG,JPEG}',
  { eager: true }
);

// Each module's default export is the built asset URL. This only works for
// files under src/ — files under public/ are copied as-is and invisible to
// import.meta.glob, which is why the slideshow always fell back to one
// static image regardless of how many photos were in the public folder.
const slideImages = Object.values(imageModules).map((mod) => mod.default);

const Hero = () => {
  const [currentIdx, setCurrentIdx] = useState(0);

  // If no images found, fallback to default hero images
  const imagesToUse = slideImages.length > 0 ? slideImages : ['/images/desktophero.jpeg'];

  useEffect(() => {
    if (imagesToUse.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % imagesToUse.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [imagesToUse.length]);

  return (
    <>
      {/* ── Hero image section with premium cinematic slideshow ─────── */}
      <div className="relative w-full h-screen md:h-[90vh] lg:h-screen bg-black overflow-hidden select-none">
        
        {/* Cinematic Zoom & Fade Background Loop */}
        <div className="absolute inset-0 w-full h-full">
          <AnimatePresence initial={false}>
            <motion.img
              key={currentIdx}
              src={imagesToUse[currentIdx]}
              alt={`METI Postgraduate Slide ${currentIdx + 1}`}
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1.08 }}
              exit={{ opacity: 0 }}
              transition={{ 
                opacity: { duration: 1.2, ease: "easeInOut" },
                scale: { duration: 6.2, ease: "linear" }
              }}
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
          </AnimatePresence>
          {/* Layer for overlay darkness / text contrast */}
          <div className="absolute inset-0 bg-black/45 z-10" />
        </div>

        {/* Centered Typography Overlay with Typewriter Looping */}
        <HeroOverlay />
      </div>

      {/* ── ScrollVelocity OUTSIDE the overflow-hidden container ───── */}
      <div className="w-full py-1 bg-black/80 ">
        <ScrollVelocity
          texts={['METI ·  INSTITUTE OF ENGINEERING, TECHNOLOGY AND INNOVATION MANAGEMENT ·', "Master's · PhD · PGD · Apply Now ·"]}
          velocity={10}
          className="text-gray-100/50 text-lg md:text-xl font-bold bg-black/20 uppercase tracking-widest"
          numCopies={6}
          damping={50}
          stiffness={400}
        />
      </div>
    </>
  );
};

export default Hero;