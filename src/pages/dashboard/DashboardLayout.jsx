import { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAdmissionsStore } from '../../store/admissionsStore';
import {
  LayoutDashboard, Megaphone, Settings, LogOut
} from 'lucide-react';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Overview', to: '/dashboard' },
  { icon: Megaphone, label: 'Announcements', to: '/dashboard/announcements' },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAdmissionsStore();
  const [expanded, setExpanded] = useState(false);

useEffect(() => {
    if (!user || user.role === 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || user.role === 'admin') return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className={`shrink-0 flex flex-col  bg-brand-primary text-white transition-all duration-300 ${
          expanded ? 'w-64' : 'w-16'
        }`}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <div className="flex items-center gap-3 px-3 py-5 border-b border-white/10">
          <div className="shrink-0 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center font-black text-sm">
            M
          </div>
          {expanded && (
            <div className="overflow-hidden whitespace-nowrap">
              <p className="font-black text-sm">METI Portal</p>
              <p className="text-[10px] text-white/50">Student Dashboard</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-2 py-4 space-y-0.5">
          {NAV_ITEMS.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              title={!expanded ? label : undefined}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all border-l-4 ${
                  isActive
                    ? 'bg-white/10 border-brand-accent text-white'
                    : 'border-transparent text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              {expanded && <span className="whitespace-nowrap">{label}</span>}
            </NavLink>
          ))}

          <div className="my-3 border-t border-white/10" />

          <NavLink
            to="/dashboard/settings"
            title={!expanded ? 'Settings' : undefined}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all border-l-4 ${
                isActive
                  ? 'bg-white/10 border-brand-accent text-white'
                  : 'border-transparent text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Settings size={18} className="shrink-0" />
            {expanded && <span>Settings</span>}
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            title={!expanded ? 'Logout' : undefined}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm text-red-300 hover:bg-red-500/10 transition-all cursor-pointer"
          >
            <LogOut size={18} className="shrink-0" />
            {expanded && <span>Logout</span>}
          </button>
        </nav>
      </aside>

      <div className="flex-1 overflow-y-auto bg-brand-neutral">
        <Outlet />
        
      </div>
    </div>
  );
}
