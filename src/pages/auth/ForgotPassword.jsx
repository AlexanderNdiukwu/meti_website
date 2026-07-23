import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, ArrowRight } from 'lucide-react';
import OTPInput from '../../components/OTPInput';
import { toast } from '../../utils/toast';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setStep(2);
    // TODO (Supabase): supabase.auth.resetPasswordForEmail(email)
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.join('').length < 6) {
      toast.error('Enter the 6-digit code.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setStep(3);
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    toast.success('Password updated');
    navigate('/login');
    // TODO (Supabase): supabase.auth.updateUser({ password: newPassword })
  };

  return (
    <div className="min-h-screen bg-black/5 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-3xl border border-black/10 shadow-lg">
          <h1 className="text-2xl font-black text-gray-900 mb-2">Reset Password</h1>
          <p className="text-sm text-gray-400 mb-6">
            {step === 1 && 'Enter your registered email to receive a reset code.'}
            {step === 2 && 'Enter the 6-digit code sent to your email.'}
            {step === 3 && 'Choose a new password for your account.'}
          </p>

          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  placeholder="name@domain.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-primary hover:bg-blue-900 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <>Send Reset Code <ArrowRight size={16} /></>}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <OTPInput value={otp} onChange={setOtp} disabled={loading} />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-primary hover:bg-blue-900 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Verify Code'}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-primary hover:bg-blue-900 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Set New Password'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-brand-primary hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
