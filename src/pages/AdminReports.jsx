// FILE: AdminReports.jsx
// DEPENDENCIES: react, react-router-dom, recharts, ../store/admissionsStore

import { useNavigate } from 'react-router-dom';
import { useAdmissionsStore } from '../store/admissionsStore';
import { Download, ArrowLeft, BarChart2 } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts';
import { useEffect } from 'react';

// ── Mock data (UI-only phase) ──
// ── Real data derived from the applicants store ──
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function deriveMonthlyApplications(applicants) {
  // Full calendar year, Jan–Dec — uses createdAt (always reliably set on
  // every applicant row), not timeline[0].date which isn't a dependable source.
  const year = new Date().getFullYear();
  const months = MONTH_NAMES.map((month) => ({ month, count: 0 }));
  applicants.forEach(a => {
    if (!a.createdAt) return;
    const d = new Date(a.createdAt);
    if (d.getFullYear() !== year) return;
    months[d.getMonth()].count += 1;
  });
  return months;
}

function deriveByProgramme(applicants) {
  const counts = { PGD: 0, MSc: 0, PhD: 0 };
  applicants.forEach(a => {
    if (a.selectedProgram === 'PGD') counts.PGD += 1;
    else if (a.selectedProgram === 'Masters') counts.MSc += 1;
    else if (a.selectedProgram === 'PhD') counts.PhD += 1;
  });
  return Object.entries(counts).map(([programme, count]) => ({ programme, count }));
}

function deriveByCourse(applicants) {
  const counts = {};
  applicants.forEach(a => {
    const c = a.specialization || 'Unspecified';
    counts[c] = (counts[c] || 0) + 1;
  });
  return Object.entries(counts).map(([course, count]) => ({ course, count }));
}

function deriveStatusPipeline(applicants) {
  const labels = {
    'Payment Pending': 'Payment Pending',
    'Application Incomplete': 'Application Incomplete',
    'Under Review': 'Under Review',
    'Approved': 'Approved',
    'active_student': 'Active Student',
    'Rejected': 'Rejected',
  };
  const counts = {};
  Object.values(labels).forEach(l => { counts[l] = 0; });
  applicants.forEach(a => {
    const label = labels[a.status] || a.status || 'Unknown';
    counts[label] = (counts[label] || 0) + 1;
  });
  return Object.entries(counts).map(([status, count]) => ({ status, count }));
}

const PROGRAMME_COLORS = { PGD: '#f59e0b', MSc: '#3b82f6', PhD: '#8b5cf6' };
const STATUS_COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#22c55e', '#14b8a6', '#059669', '#ef4444'];
const BRAND_BLUE = '#003366';

// CSV export helper
const exportCSV = (applicants) => {
  const headers = ['Name', 'Email', 'Programme', 'Course', 'Status', 'Payment Verified', 'Form Submitted'];
  const rows = applicants.map((a) => [
    a.name || '',
    a.email || '',
    a.selectedProgram || '',
    a.specialization || '',
    a.status || '',
    a.paymentVerified ? 'Yes' : 'No',
    a.applicationFormSubmitted ? 'Yes' : 'No',
  ]);
  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `meti_applications_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Shared chart card wrapper
function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <div className="mb-5">
        <h3 className="font-black text-gray-900 text-base">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// Custom tooltip
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-xs">
        <p className="font-bold text-gray-700 mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }} className="font-semibold">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function AdminReports() {
  const navigate = useNavigate();
  const { user, applicants, totalApplicantsEver, fetchTotalApplicantsEver } = useAdmissionsStore();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchTotalApplicantsEver();
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  const monthlyApplications = deriveMonthlyApplications(applicants);
  const byProgramme         = deriveByProgramme(applicants);
  const byCourse            = deriveByCourse(applicants);
  const statusPipeline      = deriveStatusPipeline(applicants);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm px-4 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin')}
            className="text-gray-400 hover:text-gray-700 cursor-pointer"
            title="Back to Admin"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
              <BarChart2 size={22} className="text-uniport-blue" />
              Reports & Analytics
            </h1>
         <p className="text-xs text-gray-400 mt-0.5">Live data from current applicants</p>
          </div>
        </div>
        <button
          onClick={() => exportCSV(applicants)}
          className="flex items-center gap-2 bg-uniport-blue hover:bg-blue-800 text-white font-bold px-5 py-2.5 rounded-full text-sm transition-all duration-300 shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Charts grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Chart 1: Line — Applications last 6 months */}
        <ChartCard
          title="Applications Received"
          subtitle="Last 6 months"
        >
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyApplications} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="count"
                name="Applications"
                stroke={BRAND_BLUE}
                strokeWidth={3}
                dot={{ fill: BRAND_BLUE, r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 2: Bar — By Programme */}
        <ChartCard
          title="Applications by Programme"
          subtitle="PGD · MSc · PhD breakdown"
        >
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={byProgramme} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="programme" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Applications" radius={[8, 8, 0, 0]}>
                {byProgramme.map((entry) => (
                  <Cell key={entry.programme} fill={PROGRAMME_COLORS[entry.programme] || BRAND_BLUE} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3 justify-center flex-wrap">
            {byProgramme.map((p) => (
              <div key={p.programme} className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PROGRAMME_COLORS[p.programme] }} />
                {p.programme}
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Chart 3: Bar — By Course */}
        <ChartCard
          title="Applications by Course"
          subtitle="All specialization tracks"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={byCourse}
              layout="vertical"
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="course"
                width={140}
                tick={{ fontSize: 10, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Applications" fill="#3b82f6" radius={[0, 8, 8, 0]}>
                {byCourse.map((_, i) => (
                  <Cell
                    key={i}
                    fill={`hsl(${210 + i * 15}, 70%, ${55 - i * 3}%)`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 4: Bar — Status Pipeline */}
        <ChartCard
          title="Application Status Pipeline"
          subtitle="Count at each stage"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={statusPipeline} margin={{ top: 5, right: 10, left: -10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="status"
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Count" radius={[8, 8, 0, 0]}>
                {statusPipeline.map((_, i) => (
                  <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

      {/* Summary stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
       {[
            { label: 'Total Applications (all-time)', value: totalApplicantsEver ?? applicants.length },
            { label: 'Active Students', value: statusPipeline.find(s => s.status === 'Active Student')?.count || 0 },
            { label: 'Rejected', value: statusPipeline.find(s => s.status === 'Rejected')?.count || 0 },
            { label: 'Under Review', value: statusPipeline.find(s => s.status === 'Under Review')?.count || 0 },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
              <p className="text-3xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 font-semibold mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
