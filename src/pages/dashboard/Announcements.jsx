// FILE: src/pages/dashboard/Announcements.jsx
import { useAdmissionsStore } from '../../store/admissionsStore';

export default function DashboardAnnouncements() {
  const { user, announcements } = useAdmissionsStore();

  const studentProg = user?.selectedProgram === 'Masters' ? 'msc'
    : user?.selectedProgram === 'PhD' ? 'phd'
    : user?.selectedProgram === 'PGD' ? 'pgd' : null;

  const filtered = (announcements || [])
    .filter(a => !a.programme_filter || a.programme_filter === studentProg)
    .sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt));

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-black text-gray-900">Announcements</h1>
      <p className="text-sm text-gray-400">Messages from the METI admissions office.</p>

      {!filtered.length && (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
          <p className="font-semibold text-sm">No announcements yet.</p>
          <p className="text-xs mt-1">Check back later for updates from METI.</p>
        </div>
      )}

      {filtered.map(ann => {
        const date        = (ann.created_at || ann.createdAt || '').slice(0, 10);
        const filterLabel = ann.programme_filter
          ? ann.programme_filter.toUpperCase() + ' Students'
          : 'All Students';
        const attachUrl  = ann.attachment_url  || ann.attachmentUrl;
        const attachName = ann.attachment_name || ann.attachmentName;

        return (
          <div key={ann.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2">
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full">{date}</span>
              <span className="text-[10px] bg-brand-primary/10 text-brand-primary font-semibold px-2 py-0.5 rounded-full">{filterLabel}</span>
            </div>
            {ann.title && <p className="font-bold text-gray-900 text-sm">{ann.title}</p>}
            <p className="text-sm text-gray-700 leading-relaxed">{ann.message}</p>
            {attachUrl && (
              <a href={attachUrl} download={attachName}
                className="inline-flex items-center gap-1.5 text-sm text-brand-primary underline font-semibold mt-1">
                📎 {attachName}
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}