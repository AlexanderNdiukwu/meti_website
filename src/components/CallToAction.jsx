import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="py-24 bg-uniport-blue text-white">
      <div className="container mx-auto px-6 text-center max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-bounce">Start Your Journey Today</h2>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Take the next step in your career. Join a network of innovators and leaders shaping the future of engineering and technology management.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <span className="relative group">
            <Link to="/signup" className="bg-white animate-pulse text-uniport-blue px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg block">
              APPLY NOW 
            </Link>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs text-white bg-[#0d2a5e] rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
              Begin your application for this programme
            </span>
          </span>
          <Link to="/about" className="bg-transparent border border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
