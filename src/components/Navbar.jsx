import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, GraduationCap, ChevronRight, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const mainNavLinks = [
    { name: 'Home', path: '/', tooltip: 'Go to home page' },
  ];

  const programLinks = [
    { name: 'Postgraduate Diploma (PGD)', path: '/pgd', desc: 'Foundational bridge for various academic backgrounds' },
    { name: 'Masters Programs (M.Sc)', path: '/masters', desc: 'Advanced technical acumen and strategic business leadership' },
    { name: 'PhD Programs', path: '/phd', desc: 'Deep, independent doctoral research and innovation' }
  ];  

  const aboutLinks = [
    { name: 'Historical Background', path: '/about/history', desc: 'Discover METI creation origins and evolution' },
    { name: 'Director\'s Profile', path: '/about/director', desc: 'Profile details of Dr. Akuro Big-Alabo' },
    { name: 'Programme Duration', path: '/about/duration', desc: 'Calendar timeline and academic schedules' },
    { name: 'Principal Officers of the University', path: '/about/officers', desc: 'Meet our senior administrative leaders' },
    { name: 'METI at a Glance', path: '/about', desc: ' What METI is all about' },

    
  ];

  const sideMenuLinks = [
    { name: 'Home', path: '/', tooltip: 'Go to home page' },
    { name: 'Postgraduate Diploma (PGD)', path: '/pgd', tooltip: 'View postgraduate diploma programme' },
    { name: 'Masters Programs', path: '/masters', tooltip: 'View masters programmes' },
    { name: 'PhD Programs', path: '/phd', tooltip: 'View doctoral programmes' },
    { name: 'All Courses', path: '/courses', tooltip: 'View all postgraduate courses' },
    // { name: 'Principal Officers', path: '/about/officers', tooltip: 'Meet our senior administrative leaders' },
    { name: 'Historical Background', path: '/about/history', tooltip: 'Discover METI creation origins and evolution' },
    { name: 'Director\'s Profile', path: '/about/director', tooltip: 'Profile details of Dr. Akuro Big-Alabo' },
    { name: 'Programme Duration', path: '/about/duration', tooltip: 'Calendar timeline and academic schedules' },
    { name: 'Staffs & Facilitators', path: '/lecturers', tooltip: 'Meet our faculty' },
    { name: 'Support METI', path: '/support', tooltip: 'Support the institute with your donation' },
    { name: 'FAQ', path: '/faq', tooltip: 'Frequently asked questions' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 30 },
    show: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 24 
      } 
    }
  };

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass-nav py-3' : 'bg-white/80 lg:py-2 py-5'}`}>
        <div className="container mx-auto px-3 flex justify-between items-center">
          
          {/* LEFT: Logos & Name */}
          <div className="flex items-center md:gap-4 gap-2">
            {/* <button 
              onClick={() => setMenuOpen(true)}
              className=" lg:p-2 py-5 text-gray-800 hover:text-uniport-blue"
              // className="lg:hidden p-2 text-gray-800 hover:text-uniport-blue"
            >
              <Menu size={24} />
            </button> */}
            
            <Link to="/" className="flex items-center gap-3">
              <div className="flex items-center gap-1 md:gap-2">
                <img 
                  src="/images/uniportlogo1.png" 
                  alt="Uniport Logo" 
                  className="size-13 md:size-27 object-cover rounded-full shadow-sm" 
                />
                <img 
                  src="/images/metilogo1.png" 
                  alt="METI Logo" 
                  className="size-15 md:size-30 object-cover rounded-full shadow-sm" 
                />
              <div>

              <p className="lg:text-xl text-sm hidden lg:block font-extrabold tracking-tight text-gray-700 drop-shadow-sm">
                Institute of Engineering, <br/>Technology and Innovation <br/>Management (METI)
              </p>
              <p className="lg:hidden text-2xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm">
                METI
              </p>

              {/* <span className="lg:text-3xl text-2xl  font-extrabold tracking-tight text-gray-900 drop-shadow-sm">
                METI
              </span> */}

              </div>
              </div>

            </Link>
          </div>

          {/* CENTER: Links */}
          <div className="hidden lg:flex items-center gap-17">
            {/* Home link */}
            <span className="relative group">
              <Link 
                to={mainNavLinks[0].path}
                className="text-sm md:text-lg  font-bold transition-colors text-gray-700 hover:text-uniport-blue drop-shadow-sm"
              >
                {mainNavLinks[0].name}
              </Link>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs text-white bg-[#0d2a5e] rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
                {mainNavLinks[0].tooltip}
              </span>
            </span>

            {/* Programs dropdown */}
            <span 
              className="relative py-2"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button 
                className="flex items-center gap-1.5 text-sm md:text-lg font-bold transition-colors text-gray-700 hover:text-uniport-blue cursor-pointer drop-shadow-sm"
              >
                Programs
                <ChevronDown size={16} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-2 z-50 overflow-hidden"
                  >
                    {programLinks.map((prog) => (
                      <Link
                        key={prog.name}
                        to={prog.path}
                        onClick={() => setDropdownOpen(false)}
                        className="block p-3.5 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-bold text-gray-900 text-sm lg:text-lg hover:text-uniport-blue transition-colors">
                          {prog.name}
                        </div>
                        <div className="text-xs text-gray-500 font-medium mt-0.5 leading-relaxed">
                          {prog.desc}
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </span>

            {/* About METI dropdown */}
            <span 
              className="relative py-2"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <button 
                className="flex items-center gap-1.5 text-sm md:text-lg font-bold transition-colors text-gray-700 hover:text-uniport-blue cursor-pointer drop-shadow-sm"
              >
                About METI
                <ChevronDown size={16} className={`transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {aboutDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-2 z-50 overflow-hidden"
                  >
                    {aboutLinks.map((ab) => (
                      <Link
                        key={ab.name}
                        to={ab.path}
                        onClick={() => setAboutDropdownOpen(false)}
                        className="block p-3.5 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-bold text-gray-900 text-sm lg:text-lg hover:text-uniport-blue transition-colors">
                          {ab.name}
                        </div>
                        <div className="text-xs text-gray-500 font-medium mt-0.5 leading-relaxed">
                          {ab.desc}
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </span>
          </div>

          {/* RIGHT: Auth */}
          <div className="hidden lg:flex items-center gap-4">
            <span className="relative group">
              <Link to="/login" className="text-sm bg-uniport-blue px-5 py-1.5 rounded-full text-white md:text-lg font-bold transition-colors hover:bg-blue-800 drop-shadow-sm">
                Login
              </Link>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs text-white bg-[#0d2a5e] rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
                Access your student portal
              </span>
            </span>
            <button 
              onClick={() => setMenuOpen(true)}
              className="lg:p-2 py-5 text-gray-800 hover:text-uniport-blue cursor-pointer"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Mobile Right: Small Menu Button and Login */}
          <div className="lg:hidden flex items-center gap-4">
            <span className="relative group">
              <Link to="/login" className="text-uniport-blue font-bold drop-shadow-sm">Login</Link>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs text-white bg-[#0d2a5e] rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
                Access your student portal
              </span>
            </span>
            <button 
              onClick={() => setMenuOpen(true)}
              className="p-2 text-gray-800 hover:text-uniport-blue bg-gray-100 rounded-full cursor-pointer"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* LEFT OVERLAY MENU */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full lg:w-110  w-80 sm:w-100 bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 flex justify-between items-center border-b border-gray-100">
                <div className="flex items-center gap-2">
                   <img 
                  src="/images/metilogo1.png" 
                  alt="METI Logo" 
                  className="size-12 object-cover rounded-full shadow-sm" 
                />
                  <span className="text-xl font-bold text-gray-900 ">METI</span>
                </div>
                <button onClick={() => setMenuOpen(false)} className="p-2 text-gray-500 hover:text-gray-900 bg-gray-100 rounded-full cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex-1 overflow-y-auto mt-1 py-6 px-4"
              >
                <div className="space-y-1">
                  {sideMenuLinks.map((link) => (
                    <motion.span 
                      key={link.name} 
                      variants={itemVariants}
                      className="relative group w-full block animate-duration-150"
                    >
                      <Link
                        to={link.path}
                        className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-uniport-blue font-bold transition-colors"
                      >
                        {link.name}
                        <ChevronRight size={16} className="opacity-50" />
                      </Link>
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs text-white bg-[#0d2a5e] rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
                        {link.tooltip}
                      </span>
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="p-6 border-t border-gray-100"
              >
                <div className="grid grid-cols-2 gap-4">
                  <motion.span variants={itemVariants} className="relative group">
                    <Link to="/login" className="px-4 py-3 text-center border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 block w-full">
                      Login
                    </Link>
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs text-white bg-[#0d2a5e] rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
                      Access your student portal
                    </span>
                  </motion.span>
                  <motion.span variants={itemVariants} className="relative group">
                    <Link to="/signup" className="px-4 py-3 text-center bg-uniport-blue text-white rounded-xl font-bold hover:bg-blue-800 block w-full">
                      Sign Up
                    </Link>
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs text-white bg-[#0d2a5e] rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
                      Create your METI student account
                    </span>
                  </motion.span>
                </div>
              </motion.div>

       
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
