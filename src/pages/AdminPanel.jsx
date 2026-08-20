// FILE: AdminPanel.jsx
// Place at: src/pages/admin/AdminPanel.jsx
// DEPENDENCIES: react, react-router-dom, lucide-react, @react-pdf/renderer
// ../store/admissionsStore, ../components/pdf/AdmissionLetterPDF, ../components/pdf/AcceptanceLetterPDF

import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { useAdmissionsStore } from '../components/pdf/Admissionletterpdf';
import { useAdmissionsStore } from '../store/admissionsStore';
import AdminReports from './AdminReports';
import { fetchPdfLogos, getCurrentSession, getSessionOptions } from '../utils/pdfUtils';
import {
  LayoutDashboard, Users, Megaphone, BarChart2, Settings, LogOut,
  Search, ChevronRight, CheckCircle, XCircle, FileText, CreditCard,
  ClipboardCheck, AlertCircle, Download, Eye, X, Menu, Paperclip,
  CheckCircle2, Clock, FileSignature, Printer, Upload, RefreshCw,
  ThumbsUp, ThumbsDown, Send, Trash2, RotateCcw ,Loader2
} from 'lucide-react';



// ──────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────

const PROG_CODE = { PGD: 'PGD', Masters: 'MSC', PhD: 'PHD' };


// Preview-only — mirrors the store's real generation logic, reading from the
// SAME admin-controlled counters (not the calendar), so the confirm modal
// shows an accurate preview of the number that will actually be generated.
function previewAppNumber(programme, admissionCounters) {
  const code = PROG_CODE[programme] || 'MSC';
  const counter = admissionCounters?.[code] || { session: '2026/2027', lastSeq: 0 };
  const nextSeq = counter.lastSeq + 1;
  const startYear = (counter.session || '').split('/')[0] || new Date().getFullYear().toString();
  return `APPL/${startYear}/METI/CETM/${code}/${String(nextSeq).padStart(3, '0')}`;
}

// Forces a real file download regardless of signed-URL cross-origin
// restrictions or async popup-blocking — window.open()/<a download> both
// silently fail here since the URL only exists after an async network call.
async function downloadFile(url, filename) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch {
    alert('Could not download the file — it may have been removed.');
  }
}

const STATUS_COLOURS = {
  'Approved':             'bg-green-50 text-green-700 border-green-200',
  'active_student':       'bg-emerald-50 text-emerald-700 border-emerald-200',
  // 'awaiting_signature':   'bg-teal-50 text-teal-700 border-teal-200',
  'Payment Pending':      'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Payment Verification': 'bg-amber-50 text-amber-700 border-amber-200',
  'Under Review':         'bg-blue-50 text-blue-700 border-blue-200',
  'Rejected':             'bg-red-50 text-red-700 border-red-200',
  'Application Incomplete':'bg-gray-100 text-gray-600 border-gray-200',
  
};
const StatusBadge = ({ status }) => (
  <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] border ${STATUS_COLOURS[status] || 'bg-gray-100 text-gray-500 border-gray-200'}`}>
    {status}
  </span>
);


function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-start py-1.5 border-b border-gray-50 gap-2">
      <span className="text-gray-400 font-semibold shrink-0 text-xs w-44">{label}</span>
      <span className="font-semibold text-gray-800 break-all text-right text-xs">{value || '—'}</span>
    </div>
  );
}

const DOC_LABELS = {
  degreeCert:'Degree Certificates', transcript:'Academic Transcripts',
  nysc:'NYSC Certificate / Exemption', referenceLetter1:'Reference Letter 1',
  referenceLetter2:'Reference Letter 2', birthCert:'Birth Certificate',
  other:'Other Document', phdMasterCert:"Master's Certificate",
  phdMasterTranscript:"Master's Transcript",
};



// File viewer modal
function FileViewerModal({ fileUrl, fileName, onClose, onDownload }) {
  const isImg = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName || '');
  const isPdf = /\.pdf$/i.test(fileName || '');
  return (
    <div className="fixed inset-0 bg-black/70 z-100 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <span className="font-bold text-sm truncate">{fileName}</span>
          <div className="flex items-center gap-2">
           <button onClick={onDownload} className="px-3 py-1.5 bg-brand-primary text-white rounded-lg text-xs font-bold flex items-center gap-1">
              <Download size={12} /> Download
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={16} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 bg-gray-50 flex items-center justify-center">
          {isImg && <img src={fileUrl} alt={fileName} className="max-w-full max-h-[70vh] object-contain rounded-xl shadow" />}
          {isPdf && <iframe src={fileUrl} title={fileName} className="w-full h-[70vh] border-0 rounded-xl" />}
          {!isImg && !isPdf && (
            <div className="text-center text-gray-400 space-y-3">
              <FileText size={40} className="mx-auto" />
              <p className="text-sm font-semibold">{fileName}</p>
           <button onClick={onDownload} className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-full text-xs font-bold">
                <Download size={12} /> Download to view
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sidebar
const SIDEBAR_ITEMS = [
  { id: 'Overview',      label: 'Overview',      icon: LayoutDashboard },
  { id: 'Applications',  label: 'Applications',  icon: Users           },
  { id: 'Announcements', label: 'Announcements', icon: Megaphone       },
  { id: 'Reports',       label: 'Reports',       icon: BarChart2       },
];

// ──────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────
export default function AdminPanel() {
  const navigate = useNavigate();
  const location = useLocation();
  const params   = useParams();

const {
    user, applicants, announcements, admissionCounters,
    adminApprovePayment, adminRejectPayment,
    adminApproveDoc, adminRejectDoc,
    adminConfirmApplicationForm, adminRejectApplication,
    adminReturnFormToStudent, adminSaveAdmissionLetter,
adminAddNote, adminResetProgrammeSession, adminSetNextApplicationNumber,
    adminDeleteApplicant, adminRevertDocApproval,
sendAnnouncement, deleteAnnouncement, clearAllAnnouncements,
    resetAllData, logout, getFileSignedUrl, updatePassword,
    subscribeToApplicantChanges, getAnnouncementAttachmentUrl,
  } = useAdmissionsStore();

  const [sidebarExpanded,   setSidebarExpanded]   = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeView,        setActiveView]        = useState('Overview');
const [searchTerm,        setSearchTerm]        = useState('');
  // Purely a VIEW filter — never deletes or archives anything. Switching
  // back to "All Time" always shows every applicant again; admission
  // number counters are completely untouched by this.
const [dateRangeFilter,   setDateRangeFilter]   = useState('all');
  const [programmeFilter,   setProgrammeFilter]   = useState('all');
  // Free-text year search — separate from the Today/Month/Year/All Time
  // dropdown, lets the admin type any specific year directly (e.g. 2026).
  const [yearSearch,        setYearSearch]        = useState('');
  const [selectedAppId,     setSelectedAppId]     = useState(null);
  const [activeDetailTab,   setActiveDetailTab]   = useState('Print');
  const [viewerFile,        setViewerFile]        = useState(null);

  // Payment rejection
  const [payRejectOpen,    setPayRejectOpen]    = useState(false);
  const [payRejectComment, setPayRejectComment] = useState('');
  // Doc rejection
const [rejectingDocKey,  setRejectingDocKey]  = useState(null);
  const [docRejectReason,  setDocRejectReason]  = useState('');
  const [approvingDocKey,  setApprovingDocKey]  = useState(null);
  // App rejection
  const [appRejectOpen,    setAppRejectOpen]    = useState(false);
  const [appRejectComment, setAppRejectComment] = useState('');
  // Return form
  const [returnFormOpen,   setReturnFormOpen]   = useState(false);
  const [returnFormReason, setReturnFormReason] = useState('');
  // Confirm modal
  const [confirmOpen,      setConfirmOpen]      = useState(false);
  const [isApproving,      setIsApproving]      = useState(false);
  // Notes
  const [noteText,         setNoteText]         = useState('');
  // Settings
  const [settingsForm,     setSettingsForm]     = useState({ currentPassword:'', newPassword:'', confirmPassword:'' });
  const [settingsMsg,      setSettingsMsg]      = useState('');
  // New admission session reset
// New admission session reset
  const [resetProgramme,   setResetProgramme]   = useState('PGD');
  const [resetSession,     setResetSession]     = useState(() => getSessionOptions()[1]);
  const [sessionResetMsg,  setSessionResetMsg]  = useState('');
  // Manual application-number override
  const [manualProgramme,  setManualProgramme]  = useState('PGD');
  const [manualNextNum,    setManualNextNum]    = useState('');
  const [manualMsg,        setManualMsg]        = useState('');
  // Announcement
  const [annTitle,   setAnnTitle]   = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [annFile,    setAnnFile]    = useState(null);
  const [annTarget,  setAnnTarget]  = useState('all');
const [annAudience, setAnnAudience] = useState('all_applicants');
  const [annSearchTerm, setAnnSearchTerm] = useState('');
  const [annDateFilter, setAnnDateFilter] = useState('all');
  const [annProgFilter, setAnnProgFilter] = useState('all');
  const annFileRef = useRef(null);
  // Dev test upload
  // const testUploadRef  = useRef(null);
  // const [testUrl,  setTestUrl]  = useState(null);
  // const [testName, setTestName] = useState(null);
  // PDF loading
// PDF loading
  const [pdfLoading, setPdfLoading] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    const p = location.pathname;
    if      (p.startsWith('/admin/announcements')) setActiveView('Announcements');
    else if (p.startsWith('/admin/reports'))       setActiveView('Reports');
    else if (p.startsWith('/admin/settings'))      setActiveView('Settings');
    else if (p.startsWith('/admin/applications'))  setActiveView('Applications');
    else                                            setActiveView('Overview');
  }, [location.pathname]);

useEffect(() => {
    if (params.id) { setSelectedAppId(params.id); setActiveDetailTab('Print'); }
    else            setSelectedAppId(null);
  }, [params.id]);

  // Live dashboard updates — subscribes once the admin is authenticated,
  // cleans up the channel on unmount or logout so it can never double-subscribe.
  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    const channel = subscribeToApplicantChanges();
    return () => {
      if (channel) channel.unsubscribe();
    };
  }, [user?.id]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <AlertCircle size={40} className="text-red-500 mx-auto" />
          <p className="font-semibold text-red-600">Unauthorized. Admin access only.</p>
        <button onClick={() => navigate('/login')} className="bg-brand-primary text-white px-6 py-2 rounded-full text-sm font-semibold">Go to Admin Login</button>
        </div>
      </div>
    );
  }

  const handleLogout = () => { logout(); navigate('/login'); };

  const goToView = (view) => {
    setActiveView(view);
    setSelectedAppId(null);
    const routes = { Overview:'/admin', Applications:'/admin/applications', Announcements:'/admin/announcements', Reports:'/admin/reports', Settings:'/admin/settings' };
    if (routes[view]) navigate(routes[view]);
  };

  const selectedApp = applicants.find(a => a.id === selectedAppId);
const isWithinDateRange = (createdAt) => {
    if (dateRangeFilter === 'all' || !createdAt) return true;
    const created = new Date(createdAt);
    const now = new Date();
    if (dateRangeFilter === 'today') return created.toDateString() === now.toDateString();
    if (dateRangeFilter === 'month') return created.getFullYear() === now.getFullYear() && created.getMonth() === now.getMonth();
    if (dateRangeFilter === 'year')  return created.getFullYear() === now.getFullYear();
    return true;
  };

const filteredApplicants = applicants.filter(a => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = a.name?.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q) || a.selectedProgram?.toLowerCase().includes(q) || a.status?.toLowerCase().includes(q);
    const matchesProgramme = programmeFilter === 'all' || a.selectedProgram === programmeFilter;
    const matchesYear = !yearSearch.trim() || (a.createdAt && new Date(a.createdAt).getFullYear() === parseInt(yearSearch, 10));
    return matchesSearch && matchesProgramme && matchesYear && isWithinDateRange(a.createdAt);
  });

  const today = new Date().toLocaleDateString('en-GB', { weekday:'long', day:'2-digit', month:'long', year:'numeric' });

  const stats = [
    { label:'Total Applicants',   value: applicants.length,                                                        col:'border-l-4 border-blue-500'   },
    { label:'Payment Pending',    value: applicants.filter(a => !a.paymentVerified).length,                        col:'border-l-4 border-amber-400'  },
    { label:'Under Review',       value: applicants.filter(a => a.status==='Under Review').length,                 col:'border-l-4 border-indigo-500' },
    { label:'Approved / Active',  value: applicants.filter(a => ['Approved','active_student'].includes(a.status)).length, col:'border-l-4 border-green-500' },
  ];

  // All docs must be individually approved before confirm button is green
  const allDocsApproved = (app) => {
    if (!app?.uploadedDocs) return false;
    const keys = Object.keys(app.uploadedDocs).filter(k => app.uploadedDocs[k]);
    if (!keys.length) return false;
    return keys.every(k => (app.docApprovals || {})[k] === 'approved');
  };

  const canConfirm = (app) =>
    app &&
    app.paymentVerified &&
    app.applicationFormSubmitted &&
    app.status === 'Under Review' &&
    allDocsApproved(app);

  
// Generate PDF — mode 'download' saves the file, mode 'preview' opens
  // it in-page instead so the admin can check formatting without a
  // download round-trip every single time they tweak a field.
 const handleDownloadPDF = async (type, overrides = {}, mode = 'download') => {
    if (!selectedApp) return;
    setPdfLoading(type);
    try {
      const { uniportLogo, metiLogo } = await fetchPdfLogos();
      const { pdf } = await import('@react-pdf/renderer');

      let blob;
      if (type === 'admission') {
        // const { ApplicationFormPDF } = await import('../components/pdf/ApplicationFormPDF');
        const { AdmissionLetterPDF } = await import('../components/pdf/AdmissionLetterPDF');
        blob = await pdf(
         <AdmissionLetterPDF
            application={selectedApp}
            letterTitle={overrides.letterTitle ?? selectedApp.admissionLetterTitle}
            acceptanceFee={overrides.acceptanceFee ?? selectedApp.admissionLetterAcceptance}
            tuitionFee={overrides.tuitionFee ?? selectedApp.admissionLetterTuition}
            scholarshipDiscount={overrides.scholarshipDiscount ?? selectedApp.admissionLetterScholarship}
            netTuition={overrides.netTuition ?? selectedApp.admissionLetterNetTuition}
            directorName={overrides.directorName ?? selectedApp.admissionLetterDirector}
            directorTitle={overrides.directorTitle ?? selectedApp.admissionLetterDirectorTitle}
            extraNotes={overrides.extraNotes ?? selectedApp.admissionLetterExtraNotes}
        academicSession={overrides.academicSession ?? selectedApp.admissionLetterSession ?? getCurrentSession()}
            bankName={overrides.bankName ?? selectedApp.admissionLetterBank ?? 'First Bank of Nigeria'}
            accountName={overrides.accountName ?? selectedApp.admissionLetterAccName ?? 'Institute of Engineering, Technology and Innovation Management (METI)'}
            accountNumber={overrides.accountNumber ?? selectedApp.admissionLetterAccNumber ?? '2016040805'}
            uniportLogo={uniportLogo}
            metiLogo={metiLogo}
          />
          
        ).toBlob();
      } else {
      const { default: AcceptanceLetterPDF } = await import('../components/pdf/AcceptanceLetterPDF');
        blob = await pdf(
          <AcceptanceLetterPDF
            application={selectedApp}
            academicSession={selectedApp.admissionLetterSession}
            uniportLogo={uniportLogo}
            metiLogo={metiLogo}
          />
        ).toBlob();
      }

    const url  = URL.createObjectURL(blob);
      const fileName = `METI_${type === 'admission' ? 'Admission' : 'Acceptance'}_Letter_${(selectedApp.name||'').replace(/\s+/g,'_')}.pdf`;
      if (mode === 'preview') {
        setPreviewFile({ url, name: fileName });
      } else {
        const link = document.createElement('a');
        link.href     = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('PDF error:', err);
      alert('PDF generation failed. Ensure @react-pdf/renderer is installed and the PDF component file exists.');
    } finally {
      setPdfLoading(null);
    }
  };

  // Downloads the APPLICATION FORM PDF (Print View tab)
// Separate from handleDownloadPDF which handles Admission/Acceptance letters
const handleDownloadApplicationFormPDF = async () => {
  if (!selectedApp) return;
  setPdfLoading('form');
  try {
   const { uniportLogo, metiLogo } = await fetchPdfLogos();
    const { pdf } = await import('@react-pdf/renderer');
    const { default: ApplicationFormPDF } = await import('../components/pdf/ApplicationFormPDF');
    const blob = await pdf(
      <ApplicationFormPDF
        application={selectedApp}
        uniportLogo={uniportLogo}
        metiLogo={metiLogo}
      />
    ).toBlob();
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = `METI_Application_Form_${(selectedApp.name || '').replace(/\s+/g, '_')}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Application form PDF error:', err);
    alert('Could not generate PDF. Check that ApplicationFormPDF.jsx exists at src/components/pdf/ApplicationFormPDF.jsx');
  } finally {
    setPdfLoading(null);
  }
};

  // Handle confirm application
const handleConfirmApp = async () => {
    setIsApproving(true);
    try {
      const num = await adminConfirmApplicationForm(selectedApp.id);
      setIsApproving(false);
      setConfirmOpen(false);
      console.log('[EMAIL SIMULATED] Application approved →', num, '→', selectedApp.email);
    } catch (err) {
      setIsApproving(false);
      // adminConfirmApplicationForm already alerts the specific reason
      // (e.g. "Payment has not been verified") — just close the modal here.
      setConfirmOpen(false);
    }
  };

  // ──────────────────────────────────────────
  // SIDEBAR
  // ──────────────────────────────────────────
  const SidebarContent = ({ mobile = false }) => (
    <aside
      className={`flex flex-col bg-brand-primary text-white transition-all duration-300 z-40 ${
        mobile ? 'fixed inset-y-0 left-0 w-64 shadow-2xl' : `relative hidden lg:flex ${sidebarExpanded ? 'w-64' : 'w-16'}`
      }`}
      onMouseEnter={() => !mobile && setSidebarExpanded(true)}
      onMouseLeave={() => !mobile && setSidebarExpanded(false)}
    >
      <div className="flex items-center gap-3 px-3 py-5 border-b border-white/10">
        <div className="shrink-0 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center font-black text-sm">M</div>
        {(sidebarExpanded || mobile) && <div><p className="font-black text-sm">METI Admin</p><p className="text-[10px] text-white/50">Registrar Console</p></div>}
        {mobile && <button onClick={() => setMobileSidebarOpen(false)} className="ml-auto"><X size={18} className="text-white/60" /></button>}
      </div>
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {SIDEBAR_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = activeView === id;
          return (
            <button key={id} onClick={() => { goToView(id); if (mobile) setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                active ? 'bg-white/15 border-l-4 border-yellow-400 pl-2.5' : 'text-white/70 hover:bg-white/10 border-l-4 border-transparent'
              }`}
              title={!sidebarExpanded && !mobile ? label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {(sidebarExpanded || mobile) && <span>{label}</span>}
            </button>
          );
        })}
      </nav>
      <div className="px-2 pb-4 border-t border-white/10 pt-3 space-y-0.5">
        <button onClick={() => { goToView('Settings'); if (mobile) setMobileSidebarOpen(false); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/10 hover:text-white cursor-pointer"
          title={!sidebarExpanded && !mobile ? 'Settings' : undefined}
        >
          <Settings size={18} className="shrink-0" />
          {(sidebarExpanded || mobile) && <span>Settings</span>}
        </button>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 cursor-pointer"
          title={!sidebarExpanded && !mobile ? 'Logout' : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          {(sidebarExpanded || mobile) && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );

  // ──────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SidebarContent />
      {mobileSidebarOpen && (
        <><div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setMobileSidebarOpen(false)} /><SidebarContent mobile /></>
      )}
  {viewerFile && <FileViewerModal fileUrl={viewerFile.url} fileName={viewerFile.name} onClose={() => setViewerFile(null)} onDownload={() => downloadFile(viewerFile.url, viewerFile.name)} />}
     {previewFile && <FileViewerModal fileUrl={previewFile.url} fileName={previewFile.name} onClose={() => setPreviewFile(null)} onDownload={() => downloadFile(previewFile.url, previewFile.name)} />}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center gap-3">
          <button onClick={() => setMobileSidebarOpen(true)}><Menu size={22} className="text-gray-600" /></button>
          <h1 className="font-black text-gray-900">METI Admin</h1>
          <button onClick={handleLogout} className="ml-auto text-xs text-red-600 font-bold bg-red-50 px-3 py-1.5 rounded-full">Logout</button>
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

          {/* ════ OVERVIEW ════ */}
          {activeView === 'Overview' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
             <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-1 break-all sm:break-normal">Welcome, {user.name}</h1>
                <p className="text-sm text-gray-400">{today}</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(s => (
                  <div key={s.label} className={`p-5 rounded-2xl border border-gray-100 shadow-sm bg-white ${s.col}`}>
                    <p className="text-2xl font-black text-gray-900">{s.value}</p>
                    <p className="text-xs font-semibold text-gray-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b flex justify-between items-center">
                  <h2 className="font-bold text-gray-900">Recent Applications</h2>
                  <button onClick={() => goToView('Applications')} className="text-xs text-brand-primary font-bold flex items-center gap-1">View all <ChevronRight size={14} /></button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 border-b text-gray-500 font-bold">
                      <tr><th className="p-4">Name</th><th className="p-4 hidden sm:table-cell">Programme</th><th className="p-4">Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {applicants.slice(0,5).map(app => (
                        <tr key={app.id} className="hover:bg-gray-50/50 cursor-pointer"
                          onClick={() => { goToView('Applications'); setSelectedAppId(app.id); navigate(`/admin/applications/${app.id}`); }}>
                          <td className="p-4"><p className="font-bold text-gray-900 text-sm">{app.name}</p><p className="text-[10px] text-gray-400">{app.email}</p></td>
                          <td className="p-4 hidden sm:table-cell text-gray-700 font-medium">{app.selectedProgram}</td>
                          <td className="p-4"><StatusBadge status={app.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════ APPLICATIONS ════ */}
          {activeView === 'Applications' && (
            <div className="space-y-6">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-black text-gray-900">Applications</h1>
               <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <select value={programmeFilter} onChange={e => setProgrammeFilter(e.target.value)}
                    className="bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-xs font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-sm">
                    <option value="all">All Programmes</option>
                    <option value="PGD">PGD</option>
                    <option value="Masters">Masters (MSc)</option>
                    <option value="PhD">PhD</option>
                  </select>
                <select value={dateRangeFilter} onChange={e => setDateRangeFilter(e.target.value)}
                    className="bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-xs font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-sm">
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                  <input type="number" placeholder="Search year e.g. 2026" value={yearSearch} onChange={e => setYearSearch(e.target.value)}
                    className="bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-xs font-semibold text-gray-600 w-40 focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-sm" />
                  <div className="relative w-full sm:w-72">
                    <Search size={14} className="absolute left-3 top-3 text-gray-400" />
                    <input type="text" placeholder="Search name, email, programme…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-8 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-sm" />
                  </div>
                </div>
              </div>

              <div className={`grid gap-6 ${selectedAppId ? 'grid-cols-1 xl:grid-cols-12' : 'grid-cols-1'}`}>
                {/* List */}
                <div className={`${selectedAppId ? 'xl:col-span-4' : 'xl:col-span-12'} bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden`}>
                  <div className="p-5 border-b flex justify-between items-center">
                    <h2 className="font-bold text-gray-900">All Candidates</h2>
                    <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-bold">{filteredApplicants.length}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-gray-50 border-b text-gray-500 font-bold">
                        <tr><th className="p-4">Name</th><th className="p-4 hidden sm:table-cell">Programme</th><th className="p-4">Status</th><th className="p-4 text-center">View</th></tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 text-gray-700">
                        {filteredApplicants.map(app => (
                          <tr key={app.id} onClick={() => { setSelectedAppId(app.id); setActiveDetailTab('Print'); navigate(`/admin/applications/${app.id}`); }}
                            className={`hover:bg-blue-50/10 cursor-pointer ${selectedAppId===app.id ? 'bg-blue-50/20' : ''}`}>
                         <td className="p-4">
                              <p className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                                {app.name}
                                {app.correctionRequested && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" title="Requested form back" />}
                              </p>
                              <p className="text-[10px] text-gray-400 hidden sm:block">{app.email}</p>
                            </td>
                            <td className="p-4 hidden sm:table-cell font-bold">{app.selectedProgram}</td>
                            <td className="p-4"><StatusBadge status={app.status} /></td>
                            <td className="p-4 text-center"><button className="text-brand-primary font-bold text-xs px-2 py-1 rounded-lg hover:bg-blue-50">View</button></td>
                          </tr>
                        ))}
                        {!filteredApplicants.length && <tr><td colSpan={4} className="p-8 text-center text-gray-400">No candidates found.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ── Detail panel ── */}
                {selectedAppId && selectedApp && (
                  <div className="xl:col-span-8 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="p-5 border-b flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-black text-gray-900 text-lg">{selectedApp.name}</h3>
                          <span className="text-xs bg-blue-50 text-brand-primary font-bold px-2 py-0.5 rounded-full">{selectedApp.selectedProgram}</span>
                          <StatusBadge status={selectedApp.status} />
                        </div>
                        <p className="text-[11px] text-gray-400">App No: <span className="font-mono font-bold text-brand-primary">{selectedApp.applicationNum || 'Not yet assigned'}</span></p>
                        <p className="text-[11px] text-gray-400">{selectedApp.email}</p>
                      </div>
                    <div className="flex flex-col items-end gap-2">
                        <button onClick={() => { setSelectedAppId(null); navigate('/admin/applications'); }} className="self-start text-xs text-gray-400 hover:text-gray-900 font-bold flex items-center gap-1">
                          <X size={14} /> Close
                        </button>
                        <button
                          onClick={() => {
                            const typed = window.prompt(`This permanently deletes ${selectedApp.name}'s application data. This cannot be undone.\n\nType the applicant's exact name to confirm:`);
                            if (typed === selectedApp.name) {
                              adminDeleteApplicant(selectedApp.id);
                              setSelectedAppId(null);
                              navigate('/admin/applications');
                            } else if (typed !== null) {
                              alert("Name didn't match — nothing was deleted.");
                            }
                          }}
                          className="text-[10px] text-red-400 hover:text-red-600 font-bold flex items-center gap-1"
                        >
                          <Trash2 size={11} /> Delete Applicant
                        </button>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-gray-50 border-b px-5 flex gap-1 overflow-x-auto shrink-0">
                      {[
                        { id:'Print',      label:'Print View',        icon:Printer        },
                        { id:'Documents',  label:'Documents',         icon:ClipboardCheck },
                        { id:'Payment',    label:'Payment',           icon:CreditCard     },
                        { id:'Decision',   label:'Decision',          icon:CheckCircle    },
                        { id:'Letters',    label:'Letters',           icon:FileSignature  },
                      ].map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => setActiveDetailTab(id)}
                          className={`flex items-center gap-1.5 px-3 py-3 text-xs font-bold whitespace-nowrap border-b-2 cursor-pointer transition-colors ${
                            activeDetailTab===id ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
                          }`}>
                          <Icon size={13} />{label}
                        </button>
                      ))}
                    </div>

                    {/* Tab content */}
                    <div className="flex-1 overflow-y-auto p-3">

                      {/* ══ PRINT VIEW ══ */}
                      {activeDetailTab === 'Print' && (
                        <div className="space-y-4">
                      {selectedApp.correctionRequested && (
                            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 flex items-center justify-between gap-3 flex-wrap">
                              <p className="text-xs font-bold text-red-700">
                                ⚠ {selectedApp.name} has requested their form back for correction.
                              </p>
                              <button onClick={() => setReturnFormOpen(true)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shrink-0">
                                <RotateCcw size={13} /> Return Form to Student
                              </button>
                            </div>
                          )}
                          <div className="flex gap-2 flex-wrap no-print">
                           <button onClick={() => handleDownloadApplicationFormPDF()} disabled={!!pdfLoading}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-blue-900 disabled:opacity-50">
                              <Download size={13} />{pdfLoading === 'form' ? 'Generating…' : 'Download Application Form PDF'}
                            </button>
                            {selectedApp.applicationFormSubmitted && selectedApp.status !== 'Rejected' && selectedApp.status !== 'active_student' && !selectedApp.correctionRequested && (
                              <button onClick={() => setReturnFormOpen(true)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-orange-400 text-orange-600 text-xs font-bold hover:bg-orange-50">
                                <RotateCcw size={13} /> Return Form to Student
                              </button>
                            )}
                          </div>

                          {/* Form preview */}
                       <div className="print-root border border-gray-200 rounded-2xl p-4 sm:p-6 space-y-5 text-xs bg-white">
                            <div className="text-center border-b border-brand-primary pb-3">
                              <p className="font-black text-brand-primary text-base">UNIVERSITY OF PORT HARCOURT</p>
                              <p className="font-bold text-brand-primary text-[10px]">INSTITUTE OF ENGINEERING, TECHNOLOGY AND INNOVATION
MANAGEMENT (METI)
</p>
                              <p className="text-brand-primary text-[10px]">CENTRE FOR ENGINEERING AND TECHNOLOGY MANAGEMENT (CETM)</p>
                            </div>

                          <div className="flex justify-between items-start gap-3">
                              <div className="min-w-0">
                                <p className="font-bold text-[11px] break-all">APPLICATION NUMBER: <span className="font-mono text-brand-primary">{selectedApp.applicationNum || '______________________________'}</span></p>
                                <p className="text-[10px] italic text-gray-500 mt-1">*Please carefully fill out this application form and ensure all fields are completed accurately.</p>
                              </div>
                              {/* Passport photo — checks all possible data paths */}
                              <div className="w-20 h-24 border border-gray-400 flex items-center justify-center bg-gray-50 rounded shrink-0 ml-4 overflow-hidden">
                                {(selectedApp.applicationForm?.passportPhoto || selectedApp.applicationForm?.personal?.passportPhoto || selectedApp.passportPhoto)
                                  ? <img src={selectedApp.applicationForm?.passportPhoto || selectedApp.applicationForm?.personal?.passportPhoto || selectedApp.passportPhoto} alt="Passport" className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; }} />
                                  : <span className="text-[9px] text-gray-400 text-center leading-tight px-1">PASSPORT<br/>PHOTO</span>
                                }
                              </div>
                            </div>

                            {/* Section A */}
                            <div>
                              <p className="font-bold text-brand-primary     text-[11px] uppercase border-b border-gray-200 pb-1 mb-2">Section A – Personal Information</p>
                              {[
                                ['Full Name',                     selectedApp.applicationForm?.personal?.fullName],
                                ['Date of Birth',                 selectedApp.applicationForm?.personal?.dob],
                                ['Sex',                           selectedApp.applicationForm?.personal?.sex],
                                ['Nationality',                   selectedApp.applicationForm?.personal?.nationality],
                                ['State',                         selectedApp.applicationForm?.personal?.state],
                                ['L.G.A.',                        selectedApp.applicationForm?.personal?.lga],
                                ['Contact Address',               selectedApp.applicationForm?.personal?.contactAddress1],
                                ['Address Line 2',                selectedApp.applicationForm?.personal?.contactAddress2],
                                ['Phone Number(s)',               selectedApp.applicationForm?.personal?.phone],
                                ['WhatsApp Number',              selectedApp.applicationForm?.personal?.whatsapp],
                                ['Email(s)',                      selectedApp.applicationForm?.personal?.email],
                                ['Name of Next of Kin',          selectedApp.applicationForm?.personal?.nextOfKinName],
                                ['Relationship with Next of Kin',selectedApp.applicationForm?.personal?.nextOfKinRelationship],
                                ['Phone Number of Next of Kin',  selectedApp.applicationForm?.personal?.nextOfKinPhone],
                              ].map(([l,v]) => <InfoRow key={l} label={l} value={v} />)}
                            </div>

                            {/* Section B */}
                            <div>
                              <p className="font-bold text-brand-primary text-[11px] uppercase border-b border-gray-200 pb-1 mb-2">Section B – Programme Details</p>
                              <InfoRow label="Degree Sought"           value={selectedApp.selectedProgram} />
                              <InfoRow label="Programme Specialization" value={selectedApp.specialization} />
                              <InfoRow label="Mode of Study"           value={selectedApp.applicationForm?.modeOfStudy} />
                            </div>

                            {/* Section C */}
                            <div>
                              <p className="font-bold text-brand-primary text-[11px] uppercase border-b border-gray-200 pb-1 mb-2">Section C – Academic Background</p>
                           {[
                                ['First Degree',    selectedApp.applicationForm?.academic?.firstDegree],
                                ['Institution',     selectedApp.applicationForm?.academic?.firstInstitution],
                                ['Year',            selectedApp.applicationForm?.academic?.firstYear],
                                ['Class of Degree', selectedApp.applicationForm?.academic?.firstClass],
                                ['Second Degree',   selectedApp.applicationForm?.academic?.secondDegree],
                                ['Institution',     selectedApp.applicationForm?.academic?.secondInstitution],
                                ['Year',            selectedApp.applicationForm?.academic?.secondYear],
                                ['Class of Degree', selectedApp.applicationForm?.academic?.secondClass],
                                ['Other Qualifications',         selectedApp.applicationForm?.academic?.otherQualifications],
                                ['English Language Proficiency', selectedApp.applicationForm?.academic?.englishProficiency],
                              ].map(([l,v], i) => <InfoRow key={`${l}-${i}`} label={l} value={v} />)}
                            </div>

                            {/* Section D */}
                            <div>
                              <p className="font-bold text-brand-primary text-[11px] uppercase border-b border-gray-200 pb-1 mb-2">Section D – Work Experience</p>
                              <InfoRow label="Employer" value={selectedApp.applicationForm?.work?.employer} />
                              <InfoRow label="Position" value={selectedApp.applicationForm?.work?.position} />
                              <InfoRow label="Duration" value={selectedApp.applicationForm?.work?.duration} />
                            </div>

                            {/* Section F — F before E, matches official form */}
                            <div>
                              <p className="font-bold text-brand-primary text-[11px] uppercase border-b border-gray-200 pb-1 mb-2">Section F – Any Other Information</p>
                              <p className="text-xs text-gray-700 leading-relaxed min-h-8">{selectedApp.applicationForm?.otherInfo || '—'}</p>
                            </div>

                            {/* Section E */}
                            {(selectedApp.applicationForm?.referees||[]).length > 0 && (
                              <div>
                                <p className="font-bold text-brand-primary text-[11px] uppercase border-b border-gray-200 pb-1 mb-2">Section E – Referees</p>
                                {selectedApp.applicationForm.referees.map((r,i) => (
                                  <div key={i} className="mb-3">
                                    <p className="font-bold text-[10px] text-gray-500 mb-1">Referee {i+1}</p>
                                    <InfoRow label="Name"         value={r.name} />
                                    <InfoRow label="Address"      value={r.address} />
                                    <InfoRow label="Phone Number" value={r.phone} />
                                    <InfoRow label="Email"        value={r.email} />
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Section G */}
                            <div>
                              <p className="font-bold text-brand-primary text-[11px] uppercase border-b border-gray-200 pb-1 mb-2">Section G – Declaration</p>
                              <p className="text-xs text-gray-700 mb-3">
                                I, <span className="font-bold">{selectedApp.applicationForm?.personal?.fullName || selectedApp.name || '________________________'}</span>, hereby declare that all the information provided is correct.
                              </p>
                              <div className="flex items-end gap-8">
                                <div>
                                  <p className="text-[10px] text-gray-400 mb-1">Signature:</p>
                                  {(selectedApp.applicationForm?.signature || selectedApp.applicationForm?.personal?.signature || selectedApp.signature)
                                    ? <img src={selectedApp.applicationForm?.signature || selectedApp.applicationForm?.personal?.signature || selectedApp.signature} alt="Signature" className="h-10 border-b border-gray-400 max-w-40" onError={e => { e.target.style.display='none'; }} />
                                    : <div className="w-40 border-b border-gray-400 h-10 flex items-end pb-1"><span className="text-[9px] text-gray-300 italic">No signature on file</span></div>
                                  }
                                </div>
                                <div>
                                  <p className="text-[10px] text-gray-400 mb-1">Date:</p>
                                  <p className="text-xs border-b border-gray-400 w-28 pb-1">{selectedApp.approved_at ? new Date(selectedApp.approved_at).toLocaleDateString('en-GB') : ''}</p>
                                </div>
                              </div>
                            </div>

                            {/* Supporting docs text list */}
                            <div className="border-t border-gray-200 pt-3">
                              <p className="text-[10px] text-gray-500 leading-relaxed">Soft copies: <span className="font-bold">meti@uniport.edu.ng</span> or Room 321 (Second Floor), ETF Gas Building, Faculty of Engineering, Abuja Park Campus, University of Port Harcourt.</p>
                              <p className="text-[10px] font-bold text-gray-700 mt-2 mb-1">Supporting Documents:</p>
                              {['1. Degree Certificates','2. Academic Transcripts','3. NYSC Certificate or Certificate of Exemption','4. Two (2) Academic Reference Letters','5. Birth Certificate or Court-Affirmed Declaration of Age','6. Any other relevant document.'].map(i => (
                                <p key={i} className="text-[10px] text-gray-600">{i}</p>
                              ))}
                              <p className="text-[9px] text-gray-400 mt-3 border-t pt-2 flex justify-between"><span>©METI@UNIPORT.</span><span>Application For Admission Form</span></p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ══ DOCUMENTS ══ */}
                      {activeDetailTab === 'Documents' && (
                        <div className="space-y-4">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Uploaded Documents</p>
                          <p className="text-[11px] text-gray-500">Approve or reject each document. The Confirm button in the Decision tab only activates when <strong>all documents are approved</strong>.</p>

                          {/* Dev test upload */}
                          {/* <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
                            <p className="text-[10px] font-bold text-amber-700 uppercase">🛠 Dev Test Upload — remove before go-live</p>
                            <p className="text-[10px] text-amber-600">Upload any file here to test the viewer in all document slots below.</p>
                            <div className="flex items-center gap-2">
                              <input type="file" ref={testUploadRef} className="hidden" onChange={e => { const f = e.target.files[0]; if (f) { setTestUrl(URL.createObjectURL(f)); setTestName(f.name); } }} />
                              <button onClick={() => testUploadRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-lg">
                                <Upload size={12} /> Upload Test File
                              </button>
                              {testName && <span className="text-[10px] text-amber-700 font-semibold">{testName}</span>}
                              {testUrl && <button onClick={() => { setTestUrl(null); setTestName(null); if(testUploadRef.current) testUploadRef.current.value=''; }} className="text-[10px] text-red-500 font-bold">Clear</button>}
                            </div>
                          </div> */}

                         {selectedApp.uploadedDocs
                            ? Object.entries(selectedApp.uploadedDocs).map(([key, fileName]) => {
                                if (!fileName) return null;
                                const approval  = (selectedApp.docApprovals||{})[key];
                                const rejReason = (selectedApp.docApprovals||{})[`${key}_reason`];
                                const docPath   = (selectedApp.docPaths||{})[key];
                                const dispName  = fileName;
                                const openDoc = async () => {
                                  const url = await getFileSignedUrl('documents', docPath);
                                  if (url) setViewerFile({ url, name: dispName });
                                  else alert('Could not load this file — it may have been removed.');
                                };
                               const downloadDoc = async () => {
                                  const url = await getFileSignedUrl('documents', docPath);
                                  if (url) await downloadFile(url, dispName);
                                  else alert('Could not load this file — it may have been removed.');
                                };
                                return (
                                  <div key={key} className="border border-gray-100 rounded-2xl p-4 bg-gray-50 space-y-2">
                                    <div className="flex items-center justify-between gap-2 flex-wrap">
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-gray-800 text-xs">{DOC_LABELS[key] || key}</p>
                                        <p className="text-[10px] text-gray-400 font-mono break-all">{dispName}</p>
                                      </div>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <button onClick={openDoc} className="flex items-center gap-1 px-2.5 py-1.5 border border-gray-200 bg-white rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"><Eye size={12} /> View</button>
                                        <button onClick={downloadDoc} className="flex items-center gap-1 px-2.5 py-1.5 border border-gray-200 bg-white rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"><Download size={12} /> Download</button>
                                        {approval === 'approved' ? (
                                          <>
                                            <span className="flex items-center justify-center gap-1 min-w-23 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold border border-green-200"><CheckCircle2 size={11} /> Approved</span>
                                            <button onClick={async () => {
                                              if (!window.confirm(`Revert ${DOC_LABELS[key] || key} back to pending? This undoes the approval.`)) return;
                                              setApprovingDocKey(key);
                                              try { await adminRevertDocApproval(selectedApp.id, key); }
                                              finally { setApprovingDocKey(null); }
                                            }} className="text-[10px] text-gray-400 hover:text-gray-700 font-bold underline">Revert</button>
                                          </>
                                        ) : (
                                          <button onClick={async () => {
                                              if (!window.confirm(`Approve ${DOC_LABELS[key] || key}?`)) return;
                                              setApprovingDocKey(key);
                                              setRejectingDocKey(null);
                                              try { await adminApproveDoc(selectedApp.id, key); }
                                              finally { setApprovingDocKey(null); }
                                            }} disabled={approvingDocKey === key} className="flex items-center justify-center gap-1 min-w-23 px-2.5 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 disabled:opacity-60">
                                              {approvingDocKey === key ? <Loader2 size={12} className="animate-spin" /> : <ThumbsUp size={12} />}
                                              {approvingDocKey === key ? 'Approving…' : 'Approve'}
                                            </button>
                                        )}
                                        {approval === 'rejected' ? (
                                          <>
                                            <span className="flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold border border-red-200"><XCircle size={11} /> Rejected</span>
                                            <button onClick={() => { setRejectingDocKey(rejectingDocKey===key ? null : key); setDocRejectReason(rejReason || ''); }} className="text-[10px] text-gray-400 hover:text-gray-700 font-bold underline">Edit Reason</button>
                                          </>
                                        ) : (
                                          <button onClick={() => { setRejectingDocKey(rejectingDocKey===key ? null : key); setDocRejectReason(''); }} className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100"><ThumbsDown size={12} /> Reject</button>
                                        )}
                                      </div>
                                    </div>
                                    {rejectingDocKey === key && (
                                      <div className="flex gap-2 mt-2 items-start">
                                        <textarea rows={2} value={docRejectReason} onChange={e => setDocRejectReason(e.target.value)} placeholder="Reason (min 10 chars)" className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none resize-none" />
                                        <div className="flex flex-col gap-1">
                                       <button onClick={() => {
                                            if (docRejectReason.trim().length < 10) return;
                                            if (!window.confirm(`Reject ${DOC_LABELS[key] || key} with this reason?`)) return;
                                            adminRejectDoc(selectedApp.id, key, docRejectReason);
                                            setRejectingDocKey(null);
                                            setDocRejectReason('');
                                          }} disabled={docRejectReason.trim().length<10} className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg disabled:opacity-40">Confirm</button>
                                          <button onClick={() => setRejectingDocKey(null)} className="px-3 py-1 border border-gray-200 text-gray-600 text-xs rounded-lg">Cancel</button>
                                        </div>
                                      </div>
                                    )}
                                    {approval === 'rejected' && rejReason && <p className="text-[10px] text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">Reason: {rejReason}</p>}
                                  </div>
                                );
                              })
                            : <p className="text-gray-400 italic text-sm">No documents submitted yet.</p>
                          }

                          {/* Return form from Documents tab */}
                          {selectedApp.applicationFormSubmitted && selectedApp.status !== 'Rejected' && (
                            <div className="border-t pt-4">
                              <button onClick={() => setReturnFormOpen(true)} className="w-full py-2.5 border-2 border-orange-400 text-orange-600 font-bold rounded-xl text-xs hover:bg-orange-50">
                                ↩ Return Form to Student (rejected docs or written errors)
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* ══ PAYMENT ══ */}
                      {activeDetailTab === 'Payment' && (
                        <div className="space-y-4">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Payment Receipt</p>
                          {selectedApp.paymentSubmitted ? (
                            <>
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between gap-3">
                                <div><p className="font-bold text-gray-800 text-sm">{selectedApp.receiptName}</p><p className="text-[10px] text-gray-400">{selectedApp.receiptSize}</p></div>
                                <div className="flex items-center gap-2">
                              <button onClick={async () => {
                                    const url = await getFileSignedUrl('receipts', selectedApp.receiptUrl);
                                    if (url) await downloadFile(url, selectedApp.receiptName);
                                    else alert('Could not load the receipt — it may have been removed.');
                                  }} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-brand-primary"><Download size={14} /></button>
                                  {/* <button onClick={async () => {
                                    const url = await getFileSignedUrl('receipts', selectedApp.receiptUrl);
                                    if (url) window.open(url, '_blank');
                                    else alert('Could not load the receipt — it may have been removed.');
                                  }} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-brand-primary"><Download size={14} /></button> */}
                                  <StatusBadge status={selectedApp.paymentVerified ? 'Approved' : 'Payment Verification'} />
                                </div>
                              </div>
                              {selectedApp.receiptUrl && (
                                <div className="rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 cursor-pointer p-2" onClick={async () => {
                                  const url = await getFileSignedUrl('receipts', selectedApp.receiptUrl);
                                  if (url) setViewerFile({ url, name: selectedApp.receiptName });
                                  else alert('Could not load the receipt — it may have been removed.');
                                }}>
                                  <div className="flex items-center justify-center h-32 gap-2 text-gray-400"><FileText size={28} /><span className="text-sm font-semibold">Click to view {selectedApp.receiptName}</span></div>
                                </div>
                              )}
                              {!selectedApp.paymentVerified && (
                                <div className="space-y-3 pt-2">
                                 <button onClick={async () => {
                                    if (!window.confirm(`Approve payment for ${selectedApp.name} and generate their application number?`)) return;
                                    const num = await adminApprovePayment(selectedApp.id);
                                    if (num) alert(`Payment approved. Application number generated: ${num}`);
                                  }}
                                    className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs">
                                    ✓ Approve Payment — Generate Application Number
                                  </button>
                                  {!payRejectOpen
                                    ? <button onClick={() => setPayRejectOpen(true)} className="w-full py-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl text-xs border border-red-200">✕ Reject Payment</button>
                                    : (
                                      <div className="space-y-2">
                                        <textarea rows={3} value={payRejectComment} onChange={e => setPayRejectComment(e.target.value)} placeholder="Reason for rejection (min 10 chars)" className="w-full border border-gray-200 rounded-xl p-3 text-xs resize-none focus:outline-none" />
                                        <div className="flex gap-2">
                                      <button onClick={() => {
                                            if(payRejectComment.trim().length<10) return;
                                            if (!window.confirm(`Reject this payment for ${selectedApp.name}?`)) return;
                                            adminRejectPayment(selectedApp.id, payRejectComment); setPayRejectOpen(false); setPayRejectComment('');
                                          }} disabled={payRejectComment.trim().length<10} className="flex-1 py-2 bg-red-600 text-white font-bold rounded-xl text-xs disabled:opacity-40">Confirm Rejection</button>
                                          <button onClick={() => { setPayRejectOpen(false); setPayRejectComment(''); }} className="px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-xl text-xs">Cancel</button>
                                        </div>
                                        <p className="text-[10px] text-gray-400">Min 10 chars. Reason sent to student by email.</p>
                                      </div>
                                    )
                                  }
                                </div>
                              )}
                              {selectedApp.paymentVerified && <p className="text-green-600 font-bold text-xs flex items-center gap-1"><CheckCircle2 size={14} /> Payment verified and confirmed</p>}
                            </>
                          ) : <p className="text-gray-400 italic">No payment receipt submitted yet.</p>}
                        </div>
                      )}

                      {/* ══ DECISION ══ */}
                   {activeDetailTab === 'Decision' && (
                        <div className="space-y-4">
                          {/* ⚠️ TEMP DEBUG — remove once the confirm-button issue is solved */}
                         {/* <div className="bg-black text-green-400 font-mono text-[10px] rounded-xl p-3 space-y-1 break-all">
                            <p>status: "{selectedApp.status}"</p>
                            <p>paymentVerified: {String(selectedApp.paymentVerified)}</p>
                            <p>applicationFormSubmitted: {String(selectedApp.applicationFormSubmitted)}</p>
                            <p>uploadedDocs keys: {JSON.stringify(Object.keys(selectedApp.uploadedDocs || {}))}</p>
                            <p>docApprovals: {JSON.stringify(selectedApp.docApprovals || {})}</p>
                            <p>allDocsApproved(): {String(allDocsApproved(selectedApp))}</p>
                            <p>canConfirm(): {String(canConfirm(selectedApp))}</p>
                          </div> */}

                          {/* Timeline */}
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-3">Application Timeline</p>
                            {(selectedApp.timeline||[]).map((ev,i) => (
                              <div key={i} className="flex gap-3 items-start mb-2">
                                <div className="w-2 h-2 rounded-full bg-brand-primary shrink-0 mt-1.5" />
                                <div><p className="font-semibold text-gray-800 text-xs">{ev.title}</p><p className="text-[10px] text-gray-400">{ev.date}</p></div>
                              </div>
                            ))}
                          </div>

                          {/* Confirm button — grey unless all conditions met */}
                          {selectedApp.status === 'Under Review' && (
                            <div className="border-t pt-4 space-y-3">
                              <p className="text-[10px] text-brand-primary uppercase tracking-wider font-extrabold">Committee Decision</p>
                              <div>
                                {/* Always VISIBLE — green only when canConfirm */}
                               <button
                                  onClick={() => canConfirm(selectedApp) && setConfirmOpen(true)}
                                  className={`w-full py-3 font-bold rounded-xl text-xs transition-all ${
                                    canConfirm(selectedApp)
                                      ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                  }`}
                                >
                                  ✓ Approve Student — Welcome to METI
                                </button>
                                {/* Show what's blocking */}
                                {!canConfirm(selectedApp) && (
                                  <div className="mt-2 space-y-0.5">
                                    {!selectedApp.paymentVerified      && <p className="text-[10px] text-amber-600">• Payment must be confirmed (Payment tab)</p>}
                                    {!selectedApp.applicationFormSubmitted && <p className="text-[10px] text-amber-600">• Application form not yet submitted</p>}
                                    {selectedApp.paymentVerified && selectedApp.applicationFormSubmitted && !allDocsApproved(selectedApp) && <p className="text-[10px] text-amber-600">• All documents must be approved individually (Documents tab)</p>}
                                  </div>
                                )}
                              </div>

                              {/* App rejection */}
                              {!appRejectOpen
                                ? <button onClick={() => setAppRejectOpen(true)} className="w-full py-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl text-xs border border-red-200">✕ Reject Application</button>
                                : (
                                  <div className="space-y-2">
                                    <textarea rows={3} value={appRejectComment} onChange={e => setAppRejectComment(e.target.value)} placeholder="Reason (min 20 chars)…" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none resize-none" />
                                    <div className="flex gap-2">
                                  <button onClick={() => {
                                        if(appRejectComment.trim().length<20) return;
                                        if (!window.confirm(`Reject ${selectedApp.name}'s entire application?`)) return;
                                        adminRejectApplication(selectedApp.id, appRejectComment); setAppRejectOpen(false); setAppRejectComment('');
                                      }} disabled={appRejectComment.trim().length<20} className="flex-1 py-2 bg-red-600 text-white font-bold rounded-xl text-xs disabled:opacity-40">Confirm Rejection</button>
                                      <button onClick={() => { setAppRejectOpen(false); setAppRejectComment(''); }} className="px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-xl text-xs">Cancel</button>
                                    </div>
                                    <p className="text-[10px] text-gray-400">Min 20 chars. Emailed to student.</p>
                                  </div>
                                )
                              }
                            </div>
                          )}

                          {/* After approval */}
                       
                          {['Approved','active_student'].includes(selectedApp.status) && (
                            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-xs text-green-800">
                              <p className="font-bold mb-1">✓ Application Approved</p>
                              <p>Application Number: <span className="font-mono font-black text-brand-primary">{selectedApp.applicationNum}</span></p>
                            </div>
                          )}
                          {selectedApp.status === 'Rejected' && (
                            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs text-red-700 font-semibold">✕ Application was rejected.</div>
                          )}

                         {/* Notes */}
                          <div className="border-t pt-4 space-y-2">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Registrar Notes</p>
                            <p className="text-xs text-gray-600 italic bg-gray-50 p-3 rounded-xl border">{selectedApp.notes || 'No notes recorded.'}</p>
                            <div className="flex gap-2">
                              <input type="text" placeholder="Add note…" value={noteText} onChange={e => setNoteText(e.target.value)} className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                              <button onClick={() => { if(noteText.trim()) { adminAddNote(selectedApp.id, noteText); setNoteText(''); } }} className="px-4 bg-brand-primary text-white rounded-xl text-xs font-bold hover:bg-blue-900">Save</button>
                            </div>
                           </div>
                        </div>
                      )}

                      {/* ══ LETTERS TAB ══ */}
                      {activeDetailTab === 'Letters' && (
                    <LettersTab
                          app={selectedApp}
                          pdfLoading={pdfLoading}
                          onDownloadAdmission={(liveFields) => handleDownloadPDF('admission', liveFields)}
                          onDownloadAcceptance={() => handleDownloadPDF('acceptance')}
                          onPreviewAdmission={(liveFields) => handleDownloadPDF('admission', liveFields, 'preview')}
                          onPreviewAcceptance={() => handleDownloadPDF('acceptance', {}, 'preview')}
                          onSaveAdmissionLetter={(data) => adminSaveAdmissionLetter(selectedApp.id, data)}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ════ ANNOUNCEMENTS ════ */}
      {activeView === 'Announcements' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-gray-900">Announcements</h1>
                {announcements.length > 0 && (
                  <button
                    onClick={() => {
                      const t = window.prompt(`Type CLEAR to permanently delete all ${announcements.length} announcements. This removes them from every student's dashboard too.`);
                      if (t === 'CLEAR') clearAllAnnouncements();
                    }}
                    className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Clear All
                  </button>
                )}
              </div>
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input type="text" placeholder="Search title or message…" value={annSearchTerm} onChange={e => setAnnSearchTerm(e.target.value)}
                      className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                    <select value={annProgFilter} onChange={e => setAnnProgFilter(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600">
                      <option value="all">All Programmes</option>
                      <option value="pgd">PGD</option>
                      <option value="msc">Masters</option>
                      <option value="phd">PhD</option>
                    </select>
                    <select value={annDateFilter} onChange={e => setAnnDateFilter(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600">
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="month">This Month</option>
                      <option value="year">This Year</option>
                    </select>
                  </div>
                  {!announcements.length && <p className="text-gray-400 italic text-sm">No announcements yet.</p>}
                  {announcements.filter(item => {
                    const q = annSearchTerm.toLowerCase();
                    const matchesSearch = !q || item.title?.toLowerCase().includes(q) || item.message?.toLowerCase().includes(q);
                    const matchesProg = annProgFilter === 'all' || item.programme_filter === annProgFilter;
                    let matchesDate = true;
                    if (annDateFilter !== 'all' && item.createdAt) {
                      const created = new Date(item.createdAt);
                      const now = new Date();
                      if (annDateFilter === 'today') matchesDate = created.toDateString() === now.toDateString();
                      else if (annDateFilter === 'month') matchesDate = created.getFullYear() === now.getFullYear() && created.getMonth() === now.getMonth();
                      else if (annDateFilter === 'year') matchesDate = created.getFullYear() === now.getFullYear();
                    }
                    return matchesSearch && matchesProg && matchesDate;
                  }).map(item => (
                    <div key={item.id} className="border border-gray-100 rounded-2xl p-4 bg-white shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                            {item.createdAt} {item.programme_filter ? `· ${item.programme_filter.toUpperCase()} only` : '· All programmes'}
                            {item.audience === 'paid_only' && <span className="ml-1 text-orange-600 font-bold">· Paid Students Only</span>}
                            {item.audience === 'public' && <span className="ml-1 text-blue-600 font-bold">· Public</span>}
                          </p>
                        </div>
                        <button onClick={() => deleteAnnouncement(item.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={13} /></button>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{item.message}</p>
                    {item.attachmentName && (item.attachmentUrl
                        ? <button onClick={async () => {
                            const url = await getAnnouncementAttachmentUrl(item.attachmentUrl);
                            if (url) await downloadFile(url, item.attachmentName);
                            else alert('Could not load this attachment — it may have been removed.');
                          }} className="inline-flex items-center gap-1 text-[11px] text-brand-primary underline mt-2"><Paperclip size={11} />{item.attachmentName}</button>
                        : <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 mt-2"><Paperclip size={11} />{item.attachmentName}</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 shadow-sm h-fit sticky top-0">
                  <h3 className="font-bold text-gray-900">Create Announcement</h3>
                  <input value={annTitle} onChange={e => setAnnTitle(e.target.value)} placeholder="Title" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
                  <textarea value={annMessage} onChange={e => setAnnMessage(e.target.value)} rows={4} placeholder="Message *" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none" />
                <select value={annTarget} onChange={e => setAnnTarget(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm">
                    <option value="all">All Active Students</option>
                    <option value="pgd">PGD Students Only</option>
                    <option value="msc">MSc Students Only</option>
                    <option value="phd">PhD Students Only</option>
                  </select>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Audience</label>
                    <select value={annAudience} onChange={e => setAnnAudience(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm">
                      <option value="public">Public — anyone, even before paying (recruitment)</option>
                      <option value="all_applicants">All Applicants — anyone signed up, paid or not</option>
                      <option value="paid_only">Paid Students Only — operational/sensitive notices</option>
                    </select>
                  </div>
                  <input type="file" ref={annFileRef} className="hidden" accept=".pdf,.jpg,.jpeg,.png,.docx" onChange={e => setAnnFile(e.target.files[0])} />
                  {!annFile
                    ? <button onClick={() => annFileRef.current?.click()} className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3 text-xs text-gray-400 font-semibold hover:border-brand-primary flex items-center justify-center gap-1"><Paperclip size={13} /> Attach file (optional)</button>
                    : <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"><span className="text-xs font-semibold truncate">{annFile.name}</span><button onClick={() => { setAnnFile(null); if(annFileRef.current) annFileRef.current.value=''; }} className="text-red-500 text-xs font-bold ml-2 shrink-0">Remove</button></div>
                  }
              <button onClick={async () => {
                    if (!annMessage.trim()) return;
                    try {
                      await sendAnnouncement({ title: annTitle||'Announcement', message: annMessage, file: annFile, programme_filter: annTarget==='all'?null:annTarget, audience: annAudience });
                      setAnnTitle(''); setAnnMessage(''); setAnnFile(null); setAnnTarget('all'); setAnnAudience('all_applicants');
                    } catch (err) {
                      console.error('Announcement publish error:', err);
                      alert(`Failed to publish announcement: ${err.message || 'Unknown error — check the console for details.'}`);
                    }
                  }} disabled={!annMessage.trim()} className="w-full rounded-full bg-brand-primary                                                                           text-white font-bold py-2.5 text-sm disabled:opacity-40 flex items-center justify-center gap-2">
                    <Send size={14} /> Publish Announcement
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ════ REPORTS ════ */}

          {activeView === 'Reports' && <AdminReports />}

          {/* ════ SETTINGS ════ */}
          {activeView === 'Settings' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-black text-gray-900">Settings</h1>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-gray-100 p-4 bg-gray-50">
                    <p className="font-bold text-gray-900 text-sm">Admin Email Aliases</p>
                    <p className="text-xs text-gray-500 mt-1">meti@uniport.edu.ng </p>
                  </div>
                 <div className="rounded-2xl border border-gray-100 p-4 bg-gray-50">
                    <p className="font-bold text-gray-900 text-sm">Workflow Mode</p>
                    <p className="text-xs text-gray-500 mt-1">Connected to live Supabase backend.</p>
                  </div>
                </div>

                {/* Start New Admission Session — admin-controlled, per programme */}
                <div className="rounded-2xl border border-gray-100 p-5 space-y-3">
                  <p className="font-bold text-gray-900 text-sm">Start New Admission Session</p>
                  <p className="text-xs text-gray-500">
                    Resets the application number sequence back to 000 for the selected programme only,
                    and sets the session label stamped on every new application approved from that point
                    forward. Already-approved students are never affected.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Programme</label>
                      <select value={resetProgramme} onChange={e => setResetProgramme(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm">
                        <option value="PGD">PGD</option>
                        <option value="Masters">Masters (MSc)</option>
                        <option value="PhD">PhD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">New Session</label>
                      <select value={resetSession} onChange={e => setResetSession(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm">
                        {getSessionOptions().map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => {
                          const t = window.prompt(
                            `Type RESET to confirm: this restarts ${resetProgramme} application numbers at 000 for the ${resetSession} session.`
                          );
                          if (t === 'RESET') {
                            adminResetProgrammeSession(resetProgramme, resetSession);
                            setSessionResetMsg(`${resetProgramme} counter reset — next application will be ${previewAppNumber(resetProgramme, { ...admissionCounters, [PROG_CODE[resetProgramme]]: { session: resetSession, lastSeq: 0 } })}.`);
                          }
                        }}
                        className="w-full rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 text-sm flex items-center justify-center gap-2"
                      >
                        <RefreshCw size={14} /> Reset
                      </button>
                    </div>
                  </div>
                  
                 {sessionResetMsg && <p className="text-xs text-green-600 font-semibold">{sessionResetMsg}</p>}
                  <div className="text-[11px] text-gray-400 pt-1 border-t border-gray-100 grid grid-cols-3 gap-2">
                    {['PGD','MSC','PHD'].map(code => (
                      <div key={code}>
                        <span className="font-bold">{code}:</span>{' '}
                        {admissionCounters?.[code]?.session || '—'} · next {String((admissionCounters?.[code]?.lastSeq||0)+1).padStart(3,'0')}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nudges the counter without wiping the whole session —
                    distinct from the full reset above. */}
                <div className="rounded-2xl border border-gray-100 p-5 space-y-3">
                  <p className="font-bold text-gray-900 text-sm">Set Next Application Number Manually</p>
                  <p className="text-xs text-gray-500">
                    Only changes the counter going forward — it never renames a number already
                    issued to a student. If the number you set has already been used, generation
                    will fail with a clear error instead of creating a duplicate.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Programme</label>
                      <select value={manualProgramme} onChange={e => setManualProgramme(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm">
                        <option value="PGD">PGD</option>
                        <option value="Masters">Masters (MSc)</option>
                        <option value="PhD">PhD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Next Number Should Be</label>
                      <input type="number" min="1" value={manualNextNum} onChange={e => setManualNextNum(e.target.value)}
                        placeholder="e.g. 5" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => {
                          const n = parseInt(manualNextNum, 10);
                          if (!n || n < 1) { setManualMsg('Enter a valid number.'); return; }
                          const currentSession = admissionCounters?.[PROG_CODE[manualProgramme]]?.session || getSessionOptions()[1];
                          const t = window.prompt(
                            `Type CONFIRM: the next ${manualProgramme} application generated will be numbered ${String(n).padStart(3,'0')} (session ${currentSession}).`
                          );
                          if (t === 'CONFIRM') {
                            adminSetNextApplicationNumber(manualProgramme, currentSession, n);
                            setManualMsg(`${manualProgramme} counter updated — next application will be ${previewAppNumber(manualProgramme, { ...admissionCounters, [PROG_CODE[manualProgramme]]: { session: currentSession, lastSeq: n - 1 } })}.`);
                            setManualNextNum('');
                          }
                        }}
                        className="w-full rounded-full bg-brand-primary hover:bg-blue-900 text-white font-bold px-4 py-2 text-sm"
                      >
                        Set Number
                      </button>
                    </div>
                  </div>
                  {manualMsg && <p className="text-xs text-green-600 font-semibold">{manualMsg}</p>}
                </div>

             <form onSubmit={async e => {
                  e.preventDefault();
                  if (!settingsForm.newPassword || settingsForm.newPassword !== settingsForm.confirmPassword) {
                    setSettingsMsg('Passwords do not match.');
                    return;
                  }
                  try {
                    await updatePassword(settingsForm.newPassword);
                    setSettingsMsg('Password updated successfully.');
                    setSettingsForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  } catch (err) {
                    setSettingsMsg(err.message || 'Could not update password.');
                  }
                }} className="rounded-2xl border border-gray-100 p-5 space-y-3">
                  <p className="font-bold text-gray-900 text-sm">Change Password</p>
                  <input type="password" placeholder="Current password" value={settingsForm.currentPassword} onChange={e => setSettingsForm({...settingsForm,currentPassword:e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
                  <input type="password" placeholder="New password (min 8 chars)" value={settingsForm.newPassword} onChange={e => setSettingsForm({...settingsForm,newPassword:e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
                  <input type="password" placeholder="Confirm new password" value={settingsForm.confirmPassword} onChange={e => setSettingsForm({...settingsForm,confirmPassword:e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
                  {settingsMsg && <p className="text-xs text-amber-600">{settingsMsg}</p>}
                  <button type="submit" className="rounded-full bg-brand-primary text-white px-5 py-2 text-sm font-semibold">Save Password</button>
                </form>
                {/* Reset — dev only */}
                {import.meta.env.VITE_APP_ENV === 'development' && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                    <p className="font-bold text-red-700 text-sm mb-1">⚠️ Reset Demo Data (Development Only)</p>
                    <p className="text-xs text-red-600 mb-3">Deletes all applications. Application numbers restart from 001. Remove before go-live.</p>
                    <button onClick={() => { const t = window.prompt('Type RESET to confirm:'); if(t==='RESET'){resetAllData(); setSettingsMsg('All data reset. Numbers restart from 001.');} }} className="rounded-full border border-red-400 text-red-600 px-5 py-2 text-sm font-semibold hover:bg-red-100 flex items-center gap-2">
                      <RefreshCw size={14} /> Reset All Data
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Return form modal */}
      {returnFormOpen && selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-bold text-lg mb-2">Return Form to Student</h3>
            <p className="text-sm text-gray-500 mb-3">Student will receive an email explaining why the form was returned and a link to correct and resubmit.</p>
            <textarea rows={3} value={returnFormReason} onChange={e => setReturnFormReason(e.target.value)} placeholder="Reason for returning form (required)" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none mb-3" />
            <div className="flex gap-2">
              <button onClick={() => setReturnFormOpen(false)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm font-semibold">Cancel</button>
              <button onClick={() => { const rejDocs = Object.keys(selectedApp.docApprovals||{}).filter(k => !k.endsWith('_reason') && selectedApp.docApprovals[k]==='rejected'); adminReturnFormToStudent(selectedApp.id, rejDocs, returnFormReason); setReturnFormOpen(false); setReturnFormReason(''); }} disabled={!returnFormReason.trim()} className="flex-1 py-2 bg-orange-500 text-white rounded-xl text-sm font-bold disabled:opacity-40">Return to Student</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm application number modal */}
{confirmOpen && selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-bold text-lg mb-2">Approve Student</h3>
            <p className="text-sm text-gray-600 mb-3">This marks {selectedApp.name} as admitted into METI and is <strong>irreversible</strong>.</p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
              <p className="text-xs text-gray-500 mb-1">Application Number:</p>
             <p className="font-mono font-black text-lg text-brand-primary  ">
                {selectedApp.applicationNum || '—'}
              </p>
            </div>
            <p className="text-xs text-gray-400 mb-4">Student will receive an email confirming their admission. You'll still need to prepare and send their admission letter separately, from the Letters tab.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmOpen(false)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm font-semibold">Cancel</button>
              <button onClick={handleConfirmApp} disabled={isApproving} className="flex-1 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 disabled:opacity-50">
                {isApproving ? 'Approving…' : 'Yes, Approve Student'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────
// LETTERS TAB COMPONENT
// Admission Letter editor + Acceptance Letter preview
// Both letters auto-fill from application data.
// Signature auto-fills from Section G of application form.
// Student just downloads — no re-signing needed.
// ──────────────────────────────────────────
function LettersTab({ app, pdfLoading, onDownloadAdmission, onDownloadAcceptance, onPreviewAdmission, onPreviewAcceptance, onSaveAdmissionLetter }) {
  const [section, setSection] = useState('admission'); // 'admission' | 'acceptance'

  // Admission letter editable fields
  const [letterTitle,         setLetterTitle]        = useState(app?.admissionLetterTitle || 'PROVISIONAL OFFER OF ADMISSION INTO THE UNIPORT–METI POSTGRADUATE PROGRAMME');
  const [acceptanceFee,       setAcceptanceFee]      = useState(app?.admissionLetterAcceptance || 'N150,000');
  const [tuitionFee,          setTuitionFee]         = useState(app?.admissionLetterTuition || 'One Million, Two Hundred Thousand Naira Only (N1,200,000)');
  const [scholarshipDiscount, setScholarshipDiscount]= useState(app?.admissionLetterScholarship || 'N200,000');
  const [netTuition,          setNetTuition]         = useState(app?.admissionLetterNetTuition || 'One Million Naira (N1,000,000)');
  const [directorName,        setDirectorName]       = useState(app?.admissionLetterDirector || 'Dr. A. Big-Alabo');
  const [directorTitle,       setDirectorTitle]      = useState(app?.admissionLetterDirectorTitle || 'Ag Director (METI)');
  const [extraNotes,          setExtraNotes]         = useState(app?.admissionLetterExtraNotes || '');
const [academicSession, setAcademicSession] = useState(app?.admissionLetterSession   || getCurrentSession());
const [bankName,        setBankName]        = useState(app?.admissionLetterBank       || 'First Bank of Nigeria');
const [accountName,     setAccountName]     = useState(app?.admissionLetterAccName   || 'Institute of Engineering, Technology and Innovation Management (METI)');
const [accountNumber,   setAccountNumber]   = useState(app?.admissionLetterAccNumber || '2016040805');
  const [sent,                setSent]               = useState(app?.admissionLetterSent || false);

  const inputCls = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]';
  const labelCls = 'block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1';

  const p        = app?.applicationForm?.personal || {};
  const fullName = p.fullName || app?.name || '';
  const appNum   = app?.applicationNum || '';
  const prog     = app?.selectedProgram || '';
  const spec     = app?.specialization  || '';
  const durMap   = { PGD:'12 months', Masters:'18 months', PhD:'3 years' };
  const duration = durMap[prog] || '18 months';
  const sig      = app?.applicationForm?.signature || app?.applicationForm?.personal?.signature || app?.signature || null;

if (!['Approved','active_student'].includes(app?.status)) {
    return (
      <div className="text-center py-12 text-gray-400 space-y-2">
        <FileSignature size={36} className="mx-auto" />
        <p className="text-sm font-semibold">Not yet available</p>
        <p className="text-xs">Admission and acceptance letters become available after the application is approved in the Decision tab.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sub-tabs */}
      <div className="flex gap-1 border-b border-gray-100">
        {[
          { id:'admission',  label:'Admission Letter'  },
          { id:'acceptance', label:'Acceptance Letter' },
        ].map(t => (
          <button key={t.id} onClick={() => setSection(t.id)}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${section===t.id ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Admission Letter ── */}
      {section === 'admission' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <p className="text-xs font-bold text-blue-800 mb-1">How this works</p>
            <p className="text-xs text-blue-700">Auto-filled fields (name, address, programme, app number, duration, signature) come from the student's application. Edit fees, title, and director details below. Download PDF to verify, then click <strong>Mark as Sent</strong> to notify the student. The student downloads the letter from their dashboard.</p>
          </div>

          {/* Auto-filled preview */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-1.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Auto-filled (from application)</p>
            {[
              ['Student Name',   fullName],
              ['Address',       [p.contactAddress1, p.contactAddress2, p.state].filter(Boolean).join(', ')],
              ['Programme',     `${prog}${spec ? ' — ' + spec : ''}`],
              ['App Number',    appNum],
              ['Duration',      duration],
              ['Mode of Study', app?.applicationForm?.modeOfStudy || '—'],
              ['Signature',     sig ? '✅ From application form (Section G)' : '⚠️ No signature found — student may not have signed yet'],
            ].map(([l,v]) => (
              <div key={l} className="flex gap-2 text-xs border-b border-gray-100 pb-1">
                <span className="text-gray-400 font-semibold w-36 shrink-0">{l}:</span>
                <span className={`font-bold ${l==='Signature' && !sig ? 'text-amber-600' : 'text-gray-800'}`}>{v||'—'}</span>
              </div>
            ))}
          </div>

          {/* Editable fields */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Editable Fields</p>
            <div><label className={labelCls}>Letter Title</label><input type="text" value={letterTitle} onChange={e => setLetterTitle(e.target.value)} className={inputCls} /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className={labelCls}>Acceptance Fee</label><input type="text" value={acceptanceFee} onChange={e => setAcceptanceFee(e.target.value)} placeholder="e.g. N150,000" className={inputCls} /></div>
              <div><label className={labelCls}>Tuition Fee (full amount)</label><input type="text" value={tuitionFee} onChange={e => setTuitionFee(e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Scholarship Discount</label><input type="text" value={scholarshipDiscount} onChange={e => setScholarshipDiscount(e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Net Tuition to Pay</label><input type="text" value={netTuition} onChange={e => setNetTuition(e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Director's Name</label><input type="text" value={directorName} onChange={e => setDirectorName(e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Director's Title</label><input type="text" value={directorTitle} onChange={e => setDirectorTitle(e.target.value)} className={inputCls} /></div>
              {/* Add these 4 fields to the editable fields section */}
<div><label className={labelCls}>Academic Session</label>
  <input type="text" value={academicSession} onChange={e => setAcademicSession(e.target.value)}
    placeholder="e.g. 2026/2027" className={inputCls} />
</div>
<div><label className={labelCls}>Bank Name</label>
  <input type="text" value={bankName} onChange={e => setBankName(e.target.value)} className={inputCls} />
</div>
<div><label className={labelCls}>Account Name</label>
  <input type="text" value={accountName} onChange={e => setAccountName(e.target.value)} className={inputCls} />
</div>
<div><label className={labelCls}>Account Number</label>
  <input type="text" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} className={inputCls} />
</div>
            </div>
            <div><label className={labelCls}>Extra Notes / Additional Conditions</label><textarea rows={3} value={extraNotes} onChange={e => setExtraNotes(e.target.value)} placeholder="Any extra conditions before the congratulations line…" className={`${inputCls} resize-none`} /></div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap pt-2">
          <button
              onClick={() => onPreviewAdmission({ letterTitle, acceptanceFee, tuitionFee, scholarshipDiscount, netTuition, directorName, directorTitle, extraNotes, academicSession, bankName, accountName, accountNumber })}
              disabled={!!pdfLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-brand-primary text-brand-primary font-bold text-sm hover:bg-brand-primary/5 disabled:opacity-50">
              <FileSignature size={14} />{pdfLoading==='admission' ? 'Generating…' : 'Preview'}
            </button>
           <button
              onClick={() => onDownloadAdmission({ letterTitle, acceptanceFee, tuitionFee, scholarshipDiscount, netTuition, directorName, directorTitle, extraNotes, academicSession, bankName, accountName, accountNumber })}
              disabled={!!pdfLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-primary text-white font-bold text-sm hover:bg-blue-900 disabled:opacity-50">
              <Download size={14} />{pdfLoading==='admission' ? 'Generating…' : 'Download Admission Letter PDF'}
            </button>
            {/* Add this BEFORE the "Mark as Sent" button */}
          <button
              onClick={() => {
                onSaveAdmissionLetter({
                  letterTitle, acceptanceFee, tuitionFee, scholarshipDiscount,
                  netTuition, directorName, directorTitle, extraNotes,
                  academicSession, bankName, accountName, accountNumber,
                  sent: false,
                });
                alert('Letter saved. You can continue editing and send later.');
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-brand-primary text-brand-primary font-bold text-sm hover:bg-brand-primary/5"
            >
              💾 Save Letter
            </button>
          {!sent ? (
              <button onClick={() => {
                  setSent(true);
                  onSaveAdmissionLetter({
                    letterTitle, acceptanceFee, tuitionFee, scholarshipDiscount,
                    netTuition, directorName, directorTitle, extraNotes,
                    academicSession, bankName, accountName, accountNumber,
                    sent: true,
                  });
                  console.log('[EMAIL SIMULATED] Admission letter sent to:', app?.email, '→ student is now Active/Enrolled');
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-600 text-white font-bold text-sm hover:bg-green-700">
                <Send size={14} /> Send Letter — Confirm Enrollment
              </button>
            ) : (
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-50 border border-green-200 text-green-700 font-bold text-sm">
                <CheckCircle2 size={14} /> Sent — Student is Active
              </div>
            )}
          </div>
{sent && (    
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-700">
              <p className="font-bold mb-0.5">✅ Done:</p>
              <p>An email has been sent to <strong>{app?.email}</strong>. The student is now an <strong>active/enrolled student</strong> and can log in to their dashboard to download both letters. No further action needed.</p>
            </div>
          )}
        </div>
      )}

      {/* ── Acceptance Letter ── */}
      {section === 'acceptance' && (
        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Auto-filled from application</p>
            {[
              ['Full Name',    fullName],
              ['Programme',   `${prog}${spec ? ' — ' + spec : ''}`],
              ['App Number',  appNum],
           ['Session',     app?.admissionLetterSession || getCurrentSession()],
              ['Signature',   sig ? '✅ From application form (Section G)' : '⚠️ No signature found'],
            ].map(([l,v]) => (
              <div key={l} className="flex gap-2 text-xs border-b border-gray-100 pb-1">
                <span className="text-gray-400 font-semibold w-36 shrink-0">{l}:</span>
                <span className={`font-bold ${l==='Signature' && !sig ? 'text-amber-600' : 'text-gray-800'}`}>{v||'—'}</span>
              </div>
            ))}
          </div>

          {/* Preview */}
          <div className="border border-gray-200 rounded-2xl p-5 bg-white text-xs space-y-3">
            <div className="text-center border-b border-brand-primary pb-3">
              <p className="font-black text-brand-primary text-sm">UNIVERSITY OF PORT HARCOURT</p>
              <p className="font-bold text-brand-primary text-[10px]">INSTITUTE OF ENGINEERING, TECHNOLOGY AND INNOVATION MANAGEMENT (METI)</p>
              <p className="font-bold text-brand-primary text-[10px]">CENTRE FOR ENGINEERING AND TECHNOLOGY MANAGEMENT (CETM)</p>
            </div>
            <p className="text-center font-black text-base underline">ADMISSION ACCEPTANCE LETTER</p>
     {[['Full Name', fullName],['Programme', prog],['Session/Year', app?.admissionLetterSession || getCurrentSession()],['Contact Info', `${p.email||''} / ${p.phone||''}`]].map(([l,v]) => (
              <div key={l} className="flex gap-2 border-b border-gray-100 pb-1.5"><span className="font-bold w-48 shrink-0">{l}:</span><span>{v||'—'}</span></div>
            ))}
            <p className="font-bold">ACCEPTANCE DECLARATION</p>
            <p className="leading-relaxed text-gray-700">
              I, <strong>{fullName}</strong> (Surname first), hereby accept the offer of admission into the <strong>{prog === 'Masters' ? 'Masters' : prog === 'PhD' ? 'Doctor of Philosophy' : 'Post Graduate Diploma'}{spec ? ' in ' + spec : ''}</strong> programme for the above-stated academic session, under the terms and conditions stated in my admission letter.
            </p>
            <p className="leading-relaxed text-gray-700">I understand that this admission is subject to fulfilling all academic and financial requirements of the Institute and University, and that failure to do so may result in the appropriate disciplinary action.</p>
            <p className="leading-relaxed text-gray-700">I also agree to abide by all the rules and regulations governing the University of Port Harcourt.</p>
            <div>
              <p className="font-bold mb-1">Signature of Student:</p>
              {sig
                ? <img src={sig} alt="Signature" className="h-10 border-b border-gray-400 max-w-45" />
                : <div className="w-48 border-b border-gray-400 h-10 flex items-end pb-1"><span className="text-[9px] text-gray-300 italic">No signature on file</span></div>
              }
              <p className="text-xs mt-2"><span className="font-bold">Date:</span> {new Date().toLocaleDateString('en-GB')}</p>
            </div>
            <div className="border-t border-gray-300 pt-3">
              <p className="font-bold mb-2 text-xs">For Official Use Only</p>
              {['Verified by','Designation','Signature','Date'].map(l => (
                <div key={l} className="flex gap-2 mb-2"><span className="font-semibold text-xs w-28 shrink-0">{l}:</span><div className="flex-1 border-b border-gray-400 h-5" /></div>
              ))}
            </div>
          </div>

          {/* Download + Confirm enrollment */}
      <div className="flex gap-3 flex-wrap">
          <button onClick={onPreviewAcceptance} disabled={!!pdfLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-brand-primary text-brand-primary font-bold text-sm hover:bg-brand-primary/5 disabled:opacity-50">
              <FileSignature size={14} />{pdfLoading==='acceptance' ? 'Generating…' : 'Preview'}
            </button>
            <button onClick={onDownloadAcceptance} disabled={!!pdfLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-primary text-white font-bold text-sm hover:bg-blue-900 disabled:opacity-50">
              <Download size={14} />{pdfLoading==='acceptance' ? 'Generating…' : 'Download Acceptance Letter PDF'}
            </button>
            {app?.status === 'active_student' && (
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm">
                <CheckCircle2 size={14} /> Student is enrolled and active
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}