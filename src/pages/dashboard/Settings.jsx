import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAdmissionsStore } from '../../store/admissionsStore';
import { toast } from '../../utils/toast';

export default function DashboardSettings() {
  const navigate = useNavigate();
  const { logout } = useAdmissionsStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updating, setUpdating] = useState(false);

  const passwordValid = (pw) => pw.length >= 8 && /[A-Z]/.test(pw) && /\d/.test(pw);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields.');
      return;
    }
    if (!passwordValid(newPassword)) {
      toast.error('New password must be at least 8 characters with 1 uppercase and 1 number.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setUpdating(true);
    await new Promise((r) => setTimeout(r, 700));
    setUpdating(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast.success('Password updated successfully.');
    // TODO (Supabase): supabase.auth.updateUser({ password: newPassword })
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-6 lg:p-8 max-w-lg">
      <h1 className="text-2xl font-black text-gray-900 mb-8">Settings</h1>

      <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Change Password</h2>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
            <p className="text-[10px] text-gray-400 mt-1">Min 8 chars, 1 uppercase, 1 number</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <button
            type="submit"
            disabled={updating}
            className="w-full py-3 rounded-full bg-brand-primary text-white font-semibold text-sm hover:bg-blue-900 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {updating && <Loader2 size={16} className="animate-spin" />}
            Update Password
          </button>
        </form>
      </section>

      {/* <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-4">Logout</h2>
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full py-3 rounded-full border-2 border-red-400 text-red-600 font-semibold text-sm hover:bg-red-50 cursor-pointer"
        >
          Sign Out
        </button>
      </section> */}
    </div>
  );
}
