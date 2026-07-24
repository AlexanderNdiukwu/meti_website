import { motion } from 'framer-motion';
import { Heart, Landmark, GraduationCap, Users, BookOpen, TrendingUp, Shield, Globe, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const IMPACT_POINTS = [
  {
    icon: <GraduationCap className="w-6 h-6 text-white" />,
    title: "Scholarships & Bursaries",
    desc: "Your contributions fund scholarships for deserving but financially disadvantaged students, ensuring no talented candidate is left behind."
  },
  {
    icon: <BookOpen className="w-6 h-6 text-white" />,
    title: "Research & Innovation",
    desc: "Support cutting-edge research in engineering, technology, and innovation management that addresses real-world challenges in Nigeria and beyond."
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-white" />,
    title: "Modern Laboratories & Equipment",
    desc: "Funds go toward equipping our labs with state-of-the-art tools, software, and equipment to provide hands-on training for students."
  },
  {
    icon: <Users className="w-6 h-6 text-white" />,
    title: "Faculty Development",
    desc: "Enable our world-class facilitators to attend international conferences, workshops, and training programs to stay at the forefront of their fields."
  },
  {
    icon: <Globe className="w-6 h-6 text-white" />,
    title: "Community Outreach",
    desc: "Expand our community engagement programmes that bring engineering and technology education to underserved communities."
  },
  {
    icon: <Shield className="w-6 h-6 text-white" />,
    title: "Infrastructure Upgrade",
    desc: "Improve learning environments, upgrade ICT infrastructure, and expand our facilities to accommodate more students."
  }
];

const SUPPORT_REASONS = [
  {
    title: "Shape the Future of Engineering",
    desc: "By investing in METI, you are directly contributing to the development of the next generation of engineers, technologists, and innovation leaders who will drive Nigeria's industrial transformation."
  },
  {
    title: "Bridge the Skills Gap",
    desc: "Your support helps us produce industry-ready graduates equipped with modern skills in AI, automation, supply chain management, and energy technology — filling critical gaps in the labour market."
  },
  {
    title: "Advance Research with Global Impact",
    desc: "METI's research collaborations with international institutions like the University of Pretoria (GSTM) ensure that your contributions have a far-reaching global impact."
  },
  {
    title: "Tax-Advantaged Giving",
    desc: "Contributions to educational institutions are often eligible for tax deductions. Consult your tax advisor to learn how your donation can benefit both METI and your tax planning."
  },
  {
    title: "Leave a Lasting Legacy",
    desc: "Your name or organisation can be permanently recognised as a benefactor of the institute — a testament to your commitment to education and national development."
  },
  {
    title: "Transparent Accountability",
    desc: "METI operates with full transparency. Every contribution is tracked, reported, and applied directly to the programmes and initiatives you choose to support."
  }
];

export default function Support() {
  return (

    <div>
        <div className='   pt-3 ' >
         <Link to={'/'} className='text-blue-500 hover:text-black  pt-5  ml-5 '>
                {"< "}
                Back
             
             </Link>

        </div>

    <div className="pt-10 pb-24 bg-black/5 min-h-screen">
      <div className="container mx-auto px-6 max-w-7xl  space-y-16">


        {/* ── Hero Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-lg border font-bold bg-red-50 text-red-600 px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
            Your Support Matters
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Support the Institute of <br/>Engineering, Technology & Innovation Management</h1>
          <p className=" text-sm max-w-2xl mx-auto leading-relaxed">
            Your generous contribution helps METI continue its mission of producing world-class engineers, 
            advancing cutting-edge research, and driving technological innovation in Nigeria and beyond.
          </p>
        </motion.div>

        {/* ── What is METI? ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 md:p-10 rounded-3xl border border-black/10 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-blue-50 text-uniport-blue rounded-xl">
              <GraduationCap size={22} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">What is METI?</h2>
          </div>
          <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
            <p>
              The <strong>Institute of Engineering, Technology and Innovation Management (METI)</strong> — formerly the 
              Center for Engineering and Technology Management (CETM) — is a premier postgraduate institute under the 
              <strong> Faculty of Engineering, University of Port Harcourt</strong>.
            </p>
            <p>
              Established in 2009 by Senate approval, METI was created in collaboration with the 
              <strong> Graduate School of Technology Management (GSTM) at the University of Pretoria, South Africa</strong>, 
              aligning its programmes with international standards set by IAMOT, PICMET, and IEEE-IEMS.
            </p>
            <p>
              METI offers <strong>Postgraduate Diploma (PGD)</strong>, <strong>Master of Engineering (M.Eng)</strong>, and 
              <strong> Doctor of Philosophy (PhD)</strong> programmes in specialisations such as Supply Chain Technology 
              Management, Industrial Systems & Process, Production & Manufacturing, Artificial Intelligence & Automation, 
              and Energy Technology Management — equipping students with the skills needed for Industry 4.0 and beyond.
            </p>
          </div>
        </motion.div>

        {/* ── Why Support METI ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <span className="text-lg border font-bold bg-blue-50 text-uniport-blue px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
              Why Contribute?
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Why You Should Support METI</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Your partnership with METI is an investment in the future of engineering education and technological advancement in Nigeria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SUPPORT_REASONS.map((reason, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-50 text-red-500 rounded-lg shrink-0 mt-0.5">
                    <Heart size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{reason.title}</h3>
                    <p className=" text-sm leading-relaxed">{reason.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Payment / Account Details ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <span className="text-xs border font-bold bg-green-50 text-green-600 px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
              Donate Now
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Account Details for Donations</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Your contributions can be made via bank transfer to the official METI account below.
            </p>
          </div>

          <div className="bg-uniport-blue text-white p-8 md:p-10 rounded-3xl shadow-lg relative overflow-hidden max-w-7xl mx-auto">
            <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-48 h-48 bg-white/5 rounded-full blur-xl" />

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5  rounded-2xl">
                <img src="/src/assets/unilogos/metilogo1.png" alt="METI Logo" className="w-14 h-14 object-contain bg-white rounded-full" />
                {/* <Landmark size={24} className="text-blue-200" /> */}
              </div>
              <span className="font-extrabold uppercase text-lg tracking-widest text-blue-200">Official METI Account Details</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-lg text-blue-200 uppercase tracking-wider block font-bold">Bank Name</label>
                <span className="text-lg font-bold">First Bank of Nigeria</span>
              </div>
              <div>
                <label className="text-lg text-blue-200 uppercase tracking-wider block font-bold">Account Name</label>
                <span className="text-lg font-bold leading-tight block">Inst. Of Engineering Technology & Innovation Management (METI)</span>
              </div>
              <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-2">
                <div>
                  <label className="text-lg text-blue-200 uppercase tracking-wider block font-bold">Account Number</label>
                  <span className="text-2xl font-extrabold tracking-wider text-green-300">2016040805</span>
                </div>
                <div className="text-right">
                  <label className="text-lg text-blue-200 uppercase tracking-wider block font-bold">Currency</label>
                  <span className="text-xl font-black">NGN</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-lg text-blue-200 leading-relaxed">
                <strong className="text-white">Important:</strong> Please use <strong>"Donation — [Your Full Name]"</strong> as the transaction narration to enable proper identification and acknowledgement.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Impact of Your Support ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <span className="text-lg border font-bold bg-purple-50 text-purple-600 px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
              Making a Difference
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">How Your Support Impacts & Improves METI</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Every contribution — no matter the size — directly fuels the growth and excellence of the institute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {IMPACT_POINTS.map((point, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                <div className="p-3 bg-uniport-blue rounded-xl inline-flex mb-4 group-hover:scale-110 transition-transform duration-300">
                  {point.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{point.title}</h3>
                <p className="text-gray-500 text-lg leading-relaxed">{point.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Call to Action ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-linear-to-r from-uniport-blue to-blue-700 text-white p-8 md:p-12 rounded-3xl shadow-xl text-center"
        >
          <Heart size={40} className="mx-auto mb-4 text-red-300" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Us in Building a Brighter Future</h2>
          <p className="text-blue-200 text-sm max-w-2xl mx-auto mb-6 leading-relaxed">
            Whether you are an individual, a corporate organisation, or a philanthropic foundation, 
            your partnership with METI will create lasting change. Together, we can produce the 
            engineering and technology leaders of tomorrow.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/about"
              className="px-6 py-3 bg-white text-uniport-blue rounded-full font-bold text-sm hover:bg-blue-50 transition-colors shadow-md"
            >
              Learn More About METI
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 border border-white/30 text-white rounded-full font-bold text-sm hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>

      </div>
    </div>

    </div>



  );
}

