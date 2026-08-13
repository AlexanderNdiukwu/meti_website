import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight, Loader2, MailCheck } from 'lucide-react';
import { useAdmissionsStore } from '../store/admissionsStore';

export default function AdmissionsSignUp() {
  const navigate = useNavigate();
  const { signup } = useAdmissionsStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

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
    try {
      const res = await signup(name, email, password);
      setLoading(false);
      if (res.success) {
        setSent(true);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Registration failed.');
    }
  };

  return (
    <div className='bg-black/5'>
     <div className='  hover:text-black  ' >
          
         <Link to={'/'} className='text-black hover:text-uniport-blue absolute ml-5 mt-5 bg-white px-2 rounded-lg '>
            {"< "}
            Back
         
         </Link>
           </div>

      <div className="pt-21 pb-24 min-h-screen flex items-center justify-center">
        <div className="">
          {/* TAB TOGGLE SELECTOR */}
          <div className='mx-7'>
          <div className="bg-white p-2 rounded-2xl border border-black/10 shadow-sm flex mb-6 container mx-auto px-6 max-w-md">
            <div className="w-1/2 text-center py-2.5 font-bold text-sm bg-uniport-blue text-white rounded-xl shadow-inner">
              Create Account
            </div>
            <Link to="/login" className="w-1/2 text-center py-2.5 font-bold text-sm text-gray-500 hover:text-gray-900 rounded-xl transition-colors">
              Already Applied
            </Link>
          </div>


          </div>

          <div className="bg-white lg:mx-0 mx-2  p-8 rounded-3xl border border-black/20 shadow-lg">
            {sent ? (
              <div className="flex flex-col items-center text-center py-4">
                <div className="p-3 bg-blue-50 text-uniport-blue rounded-full mb-4">
                  <MailCheck size={32} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Check Your Email</h2>
                <p className="text-gray-400 text-sm mb-2">
                  We've sent a confirmation link to <strong className="text-gray-700">{email}</strong>.
                </p>
                <p className="text-gray-400 text-xs">
                  Click the link in that email to activate your account, then come back and log in.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 rounded-full bg-uniport-blue text-white font-bold text-sm hover:bg-blue-800 transition-colors"
                >
                  Go to Login →
                </Link>
              </div>
            ) : (
              <div className="">
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
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Create Account</span><ArrowRight size={16} /></>}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}