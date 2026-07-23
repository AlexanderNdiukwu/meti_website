import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Engr. Sarah O.",
      role: "M.Eng Graduate",
      company: "Leading Tech Firm",
      quote: "The combination of deep engineering knowledge and business strategy completely transformed my career trajectory. I moved into a senior management role just months after graduating."
    },
    {
      name: "Dr. Ahmed M.",
      role: "PhD Candidate",
      company: "Research Institute",
      quote: "The faculty's support and the cutting-edge facilities available for research are unparalleled. It's the perfect environment for pushing the boundaries of technology management."
    },
    {
      name: "Michael T.",
      role: "PGD Student",
      company: "Manufacturing Sector",
      quote: "Coming from a non-engineering background, the PGD program provided the perfect bridge. The curriculum is incredibly practical and aligned with Industry 4.0 standards."
    }
  ];

  return (
    <section className="py-20  border-t border-gray-100 overflow-hidden select-none">
      <div className="container mx-auto px-6 mb-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">What Our Students Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Hear from our alumni and current students about their experience at METI.</p>
        </div>

        
      </div>

      <div className="w-full overflow-hidden relative py-4">
        {/* Infinite CSS Ticker loop with smooth Framer Motion interactions inside */}
        <style>{`
          @keyframes testimonials-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .testimonials-marquee-container {
            display: flex;
            width: max-content;
            animation: testimonials-marquee 30s linear infinite;
          }
          .testimonials-marquee-container:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="testimonials-marquee-container flex gap-8 px-4">
          {/* Triple the list to make the loop seamless */}
          {[...testimonials, ...testimonials, ...testimonials].map((test, idx) => (
            <motion.div 
              key={idx} 
              className="bg-gray-50/50 p-8 rounded-2xl border border-gray-200 shadow-sm relative w-[300px] md:w-[420px] shrink-0"
              whileHover={{ y: -6, borderColor: "#1a4fa0", scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-blue-100" />
              <p className="text-gray-600 mb-8 relative z-10 text-sm md:text-base leading-relaxed">
                "{test.quote}"
              </p>
              <div>
                <h4 className="font-bold text-gray-900">{test.name}</h4>
                <p className="text-sm text-[#1a4fa0] font-semibold">{test.role}</p>
                <p className="text-xs text-gray-500">{test.company}</p>
              </div>
            </motion.div>
          ))}

      
        </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-5">
          <span className="relative group">
            <Link to="/signup" className="bg-white text-center border border-black/10 text-uniport-blue lg:px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg block">
              Apply Now
            </Link>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs text-white bg-[#0d2a5e] rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
              Begin your application for this programme
            </span>
          </span>
          {/* <Link to="/about" className="bg-white border border-black/20 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
            Learn More
          </Link> */}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
