import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmissionsStore } from '../store/admissionsStore';
import { Lock, Mail, User, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import OTPInput from '../components/OTPInput';

export default function AdmissionsSignUp() {
  const navigate = useNavigate();
  const { signup, verifyOTP, user } = useAdmissionsStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  // OTP State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(120); // 2 minutes
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  // const otpRefs = useRef([]);

  // Timer countdown
  useEffect(() => {
    let timer;
    if (showOtpModal && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showOtpModal, otpTimer]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
   if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all registration fields.');
      return;
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      setError('Password must be at least 8 characters with 1 uppercase letter and 1 number.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    // Simulate API registration delay
    setTimeout(() => {
      const res = signup(name, email, password);
      setLoading(false);
      if (res.success) {
        setShowOtpModal(true);
      } else {
        setError(res.message);
      }
    }, 1200);
  };

  // OTP Paste split handler


  const handleVerifyOtpSubmit = (e) => {
    e.preventDefault();
    setOtpError('');
    const code = otp.join('');
    
    if (code.length < 6) {
      setOtpError('Please input all 6 code digits.');
      return;
    }

    setOtpLoading(true);
    setTimeout(() => {
      const res = verifyOTP(code);
      setOtpLoading(false);
      if (res.success) {
        setShowOtpModal(false);
        navigate('/apply');
      } else {
        setOtpError(res.message || 'OTP validation failed.');
      }
    }, 1200);
  };

const resendOtp = () => {
    setOtpTimer(120);
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <div className='bg-black/5'>

      <div className='pt-5 pl-8'>

        <Link to={'/'} className='text-blue-500    '>
                {"< "}
                Back
             
             </Link>
      </div>



    <div className="pt-10 pb-24  min-h-screen flex items-center justify-center">
       
      <div className="">

         
        
        {/* TAB TOGGLE SELECTOR */}
        <div className="bg-white p-2 rounded-2xl border border-black/10 shadow-sm flex mb-6 container mx-auto px-6 max-w-md">
          <div className="w-1/2 text-center py-2.5 font-bold text-sm bg-uniport-blue text-white rounded-xl shadow-inner">
            Create Account
          </div>
          <Link to="/login" className="w-1/2 text-center py-2.5 font-bold text-sm text-gray-500 hover:text-gray-900 rounded-xl transition-colors">
            Already Applied
          </Link>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-black/10 shadow-lg">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-400 text-sm mb-6">Create your admissions account to track and complete your program registration.</p>

          {error && <div className="p-4 mb-4 text-xs font-bold text-red-600 bg-red-50 rounded-xl border border-red-200">{error}</div>}

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Legal Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 size-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-uniport-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 size-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-uniport-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Choose Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 size-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-uniport-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 size-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-uniport-blue"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-uniport-blue hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Continue to Verification</span><ArrowRight size={16} /></>}
            </button>
          </form>
        </div>

        {/* OTP VERIFICATION MODAL OVERLAY */}
        <AnimatePresence>
          {showOtpModal && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white w-full max-w-sm rounded-3xl border border-gray-100 shadow-2xl p-8"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-blue-50 text-uniport-blue rounded-full mb-4">
                    <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Verify Email</h3>
                  <p className="text-gray-400 text-xs px-2 mb-6">
                    A mock 6-digit confirmation code has been generated. Enter any 6 digits to verify.
                  </p>

                  {otpError && <div className="w-full p-3 mb-4 text-xs font-semibold text-red-600 bg-red-50 rounded-xl border border-red-200">{otpError}</div>}

                  <form onSubmit={handleVerifyOtpSubmit} className="w-full space-y-6">
                    {/* Digits row */}
                  {/* Digits row */}
                    <OTPInput value={otp} onChange={setOtp} disabled={otpLoading} />

                    {/* Timer row */}
                    <div className="flex justify-between items-center text-xs font-semibold px-2">
                      <span className="text-gray-400">
                        {otpTimer > 0 ? (
                          <span>Resend in {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}</span>
                        ) : (
                          <span className="text-uniport-blue cursor-pointer" onClick={resendOtp}>Resend Code</span>
                        )}
                      </span>
                      <span className="text-[#1a4fa0]">Verification Required</span>
                    </div>

                    <button
                      type="submit"
                      disabled={otpLoading}
                      className="w-full bg-uniport-blue hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {otpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Code"}
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>

    </div>
  );
}
