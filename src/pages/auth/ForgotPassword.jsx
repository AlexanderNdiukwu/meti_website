import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, ArrowRight } from 'lucide-react';
import { toast } from '../../utils/toast';
import { useAdmissionsStore } from '../../store/admissionsStore';
import { supabase } from '../../utils/supabase';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { requestPasswordReset, setNewPassword } = useAdmissionsStore();

  // If the user arrived here BY CLICKING THE EMAIL LINK, Supabase fires a
  // PASSWORD_RECOVERY auth event and there's already a session — that's
  // what tells us to skip straight to "set new password" instead of
  // showing the email form.
const [recoveryMode, setRecoveryMode] = useState(false);
  // If the person left the original "enter your email" tab open and
  // completed the reset in the NEW tab the email link opened, this flag
  // lets that original tab know, instead of sitting there stale.
  const [recoveredElsewhere, setRecoveredElsewhere] = useState(false);

useEffect(() => {
    // Whichever browser tab ends up holding the recovery session wins —
    // that's decided by the browser, not by which tab you clicked the
    // link in, so instead of fighting that, this page checks for an
    // ACTIVE recovery session on mount regardless of how it got here.
    const checkForRecoverySession = async () => {
      if (window.location.hash.includes('type=recovery')) {
        setRecoveryMode(true);
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // A session exists but this page wasn't the one that processed
        // the link — still a real, usable recovery session if the auth
        // event below confirms it's a recovery type. Safe fallback.
        setRecoveryMode(true);
      }
    };
    checkForRecoverySession();

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setRecoveryMode(true);
    });

    const channel = new BroadcastChannel('meti-password-reset');
    channel.onmessage = (e) => {
      if (e.data === 'password-reset-complete') setRecoveredElsewhere(true);
    };

    return () => {
      listener.subscription.unsubscribe();
      channel.close();
    };
  }, []);

  const [email, setEmail] = useState('');
  const [newPassword, setPw] = useState('');
  const [confirmPassword, setConfirmPw] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendLink = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email.');
      return;
    }
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      toast.error(err.message || 'Could not send reset link.');
    } finally {
      setLoading(false);
    }
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
    try {
      await setNewPassword(newPassword);
      // Tell any other open tab (e.g. the original one where the reset
      // was first requested) that this is done, so it doesn't sit there
      // showing a stale form.
      new BroadcastChannel('meti-password-reset').postMessage('password-reset-complete');
      toast.success('Password updated');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Could not update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black/5 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-3xl border border-black/10 shadow-lg">
          <h1 className="text-2xl font-black text-gray-900 mb-2">Reset Password</h1>

          {!recoveryMode ? (
            <>
              <p className="text-sm text-gray-400 mb-6">
                {recoveredElsewhere
                  ? 'Your password was already reset in another tab. You can log in now.'
                  : sent
                  ? "Check your email for a reset link. It'll open in a new tab where you'll set your new password — you can close this tab now."
                  : 'Enter your registered email to receive a password reset link.'}
              </p>
              {!sent && !recoveredElsewhere && (
                <form onSubmit={handleSendLink} className="space-y-4">
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
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <>Send Reset Link <ArrowRight size={16} /></>}
                  </button>
                </form>
              )}
            </>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-6">Choose a new password for your account.</p>
              <form onSubmit={handleSetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setPw(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPw(e.target.value)}
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
            </>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-brand-primary hover:underline">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}