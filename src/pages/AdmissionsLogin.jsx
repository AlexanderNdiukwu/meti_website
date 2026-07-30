import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmissionsStore } from '../store/admissionsStore';
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react';

export default function AdmissionsLogin() {
  const navigate = useNavigate();
  const { login } = useAdmissionsStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both credentials.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      setLoading(false);

      if (res.success) {
        if (res.role === 'admin') {
          navigate('/admin');
        } else {
          const currentUser = useAdmissionsStore.getState().user;
          if (!currentUser?.selectedProgram || !currentUser?.eligibilityChecked || !currentUser?.readinessChecked) {
            navigate('/apply');
          } else if (!currentUser.paymentSubmitted) {
            navigate('/payment');
          } else {
            navigate('/dashboard');
          }
        }
      } else {
        setError(res.message || 'Authentication failed.');
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Authentication failed.');
    }
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
        <div className='mx-6 lg:mx-0'>
        <div className="bg-white p-2 rounded-2xl border border-black/10 shadow-sm flex mb-6 container mx-auto px-6 max-w-md">
          <Link to="/signup" className="w-1/2 text-center py-2.5 font-bold text-sm text-gray-500 hover:text-gray-900 rounded-xl transition-colors">
            Create Account
          </Link>
          <div className="w-1/2 text-center py-2.5 font-bold text-sm bg-uniport-blue text-white rounded-xl shadow-inner">
            Already Applied
          </div>
        </div>


        </div>

        <div className="bg-white p-8 rounded-3xl border border-black/10 shadow-lg">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Already Applied</h2>
          <p className="text-gray-400 text-sm mb-6">Log in to your application dashboard to upload receipts, forms, or view admission status.</p>

          {error && <div className="p-4 mb-4 text-xs font-bold text-red-600 bg-red-50 rounded-xl border border-red-200">{error}</div>}

          <form onSubmit={handleLoginSubmit} className="space-y-4">      
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
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
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

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-brand-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>


        

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-uniport-blue hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Sign In</span><ArrowRight size={16} /></>}
            </button>
          </form>
        </div>

      </div>
    </div>

    </div>
  );
}
