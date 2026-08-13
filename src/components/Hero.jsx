import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroOverlay from './HeroOverlay';
import HeroHighlights from './HeroHighlights';
// import ScrollVelocity from './ScrollVelocity';

// DYNAMICALLY SCAN ALL IMAGES INSIDE public/Metiheroimagesslides
const imageModules = import.meta.glob(
  '/src/assets/Metiheroimagesslides/*.{jpeg,jpg,png,PNG,JPG,JPEG}',
  { eager: true }
);

// Mobile-specific slideshow images — drop your mobile-cropped/generated
// versions into this folder. Falls back to the desktop set automatically
// if this folder is empty or doesn't exist yet.
const mobileImageModules = import.meta.glob(
  '/src/assets/Metiheroimagesslides-mobile/*.{jpeg,jpg,png,PNG,JPG,JPEG,webp}',
  { eager: true }
);

const slideImages = Object.values(imageModules).map((mod) => mod.default);
const mobileSlideImages = Object.values(mobileImageModules).map((mod) => mod.default);

const Hero = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport, stays in sync if the window is resized
  // or the device rotates.
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    setIsMobile(mql.matches);
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Pick the right image set — mobile set if we're on mobile AND it
  // actually has images, otherwise fall back to desktop.
  const baseImages = isMobile && mobileSlideImages.length > 0 ? mobileSlideImages : slideImages;
  const imagesToUse = baseImages.length > 0 ? baseImages : ['/images/desktophero.jpeg'];

  // Reset to slide 0 when switching image sets (e.g. resizing across
  // the mobile breakpoint) so we never point at an index that doesn't
  // exist in the new array.
  useEffect(() => {
    setCurrentIdx(0);
  }, [isMobile]);

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
          <div className="absolute bottom-6 lg:mt-8 md:bottom-8 lg:-bottom-9 left-0 right-0">
      <HeroHighlights/>
    </div>
    </>
  );
};

export default Hero;