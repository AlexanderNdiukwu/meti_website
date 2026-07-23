import ScrollFloat from './ScrollFloat';

const marqueeItems = [
  "STUDY WITH METI",
  "ENGINEERING",
  "ARTIFICIAL INTELLIGENCE",
  "TECHNOLOGY",
  "INNOVATION",
  "SUSTAINABLE DEVELOPMENT",
  "MANAGEMENT",
  "FUTURE LEADERS",
  "DIGITAL TRANSFORMATION",
  "ADVANCED RESEARCH"
];

const HeroMarquee = () => {
  return (
    <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-200/60 py-5 overflow-hidden z-30 select-none">
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-container {
          display: flex;
          width: max-content;
          animation: marquee-left 40s linear infinite;
        }
        .marquee-container:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="marquee-container flex items-center gap-16 pr-16">
        {/* Double the list to make the loop seamless */}
        {[...marqueeItems, ...marqueeItems].map((item, idx) => (
          <span key={idx} className="flex items-center gap-16">
            <span className="text-xl md:text-2xl font-black tracking-widest text-[#1a4fa0] uppercase">
              <ScrollFloat
                scrollStart="top bottom"
                scrollEnd="bottom top"
                stagger={0.03}
                textClassName="font-black"
              >
                {item}
              </ScrollFloat>
            </span>
            <span className="text-[#1a4fa0]/30 text-2xl">•</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default HeroMarquee;
