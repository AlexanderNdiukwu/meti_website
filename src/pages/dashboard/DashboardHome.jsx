// FILE: DashboardHome.jsx
// Place at: src/pages/dashboard/DashboardHome.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock, CheckCircle2, Circle, FileText,
  FileSignature, Download, Loader2, Mail, Star
} from 'lucide-react';
import { useAdmissionsStore } from '../../store/admissionsStore';
import { fetchPdfLogos, getCurrentSession } from '../../utils/pdfUtils';

// ── Application number format: APPL/METI/CETM/[PROG]/[YEAR]/[SEQ] ──
// e.g. APPL/METI/CETM/MSC/2026/001
// Year = current year. Resets to 001 each new year per programme.

// ── Progress steps definition ──
const STEPS = [
  { id: 'payment',     label: 'Payment',          description: 'Application fee paid and verified' },
  { id: 'form',        label: 'Application Form',  description: 'Form filled and submitted'         },
  { id: 'review',      label: 'Under Review',      description: 'Admissions team reviewing'         },
  { id: 'approved',    label: 'Approved',           description: 'Application approved'              },
  { id: 'enrolled',    label: 'Active Student',     description: 'Enrollment confirmed'              },
];

// Maps application status → which step is currently active
function getActiveStep(user) {
  const s = user?.status || '';
  const paymentDone = user?.paymentVerified;
  const formDone    = user?.applicationFormSubmitted;


if (s === 'active_student')                         return 'enrolled';
  if (s === 'Approved')                               return 'approved';
  if (s === 'Rejected')                                return 'form';
  if (s === 'Under Review')                           return 'review';
  if (s === 'Application Incomplete' && formDone)     return 'review';
  if (s === 'Application Incomplete' && paymentDone)  return 'form';

  return 'payment';
}

// Which steps are fully DONE (green)
function getDoneSteps(activeStep) {
  const order = STEPS.map(s => s.id);
  const idx   = order.indexOf(activeStep);
  return new Set(order.slice(0, idx));
}

// ── Progress bar component ──
function ProgressBar({ user }) {
  const activeStep = getActiveStep(user);
  const doneSteps  = getDoneSteps(activeStep);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">Application Progress</p>
      <div className="flex items-start">
        {STEPS.map((step, i) => {
          const isDone   = doneSteps.has(step.id);
          const isActive = step.id === activeStep;
          const isLast   = i === STEPS.length - 1;

          return (
            <div key={step.id} className="flex items-start flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all shrink-0 ${
                  isDone   ? 'bg-green-500 border-green-500'      :
                  isActive ? 'bg-brand-primary border-brand-primary'     :
                             'bg-white border-gray-200'
                }`}>
                  {isDone
                    ? <CheckCircle2 size={16} className="text-white" />
                    : isActive
                    ? <div className="w-3 h-3 rounded-full bg-white" />
                    : <Circle size={14} className="text-gray-300" />
                  }
                </div>
                {/* Label */}
                <p className={`text-[9px] font-bold mt-1.5 text-center leading-tight w-14 ${
                  isDone   ? 'text-green-600'   :
                  isActive ? 'text-brand-primary'   :
                             'text-gray-300'
                }`}>{step.label}</p>
              </div>
              {/* Connector line */}
              {!isLast && (
                <div className={`flex-1 h-0.5 mt-4 mx-0.5 transition-all ${
                  isDone ? 'bg-green-400' : 'bg-gray-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Friendly labels for document types (student-facing) ──
const DOC_LABELS_STUDENT = {
  degreeCert: 'Degree Certificate', transcript: 'Academic Transcript',
  nysc: 'NYSC Certificate / Exemption', referenceLetter1: 'Reference Letter 1',
  referenceLetter2: 'Reference Letter 2', birthCert: 'Birth Certificate',
  other: 'Other Document', phdMasterCert: "Master's Certificate",
  phdMasterTranscript: "Master's Transcript",
};

// ── Status message card ──
function StatusMessage({ user }) {
  const s           = user?.status || '';
  const email       = user?.email  || '';
  const appNum      = user?.applicationNum || user?.application_number || '';
  const paymentDone = user?.paymentVerified;
  const formDone    = user?.applicationFormSubmitted;

  // Payment rejected — receipt could not be verified, needs re-upload
  // (paymentSubmitted is reset to false on rejection, so this is
  // distinguishable from a brand-new signup by the presence of `notes`)
  if (s === 'Payment Pending' && !user?.paymentSubmitted && user?.notes) {
    return (
      <Card colour="red" icon={<Clock size={20} />} title="Payment Not Verified">
        <p>
          Your submitted payment evidence could not be verified.
          <br /><strong>Reason:</strong> {user.notes}
        </p>
        <p className="mt-2">Please review the payment details and upload a new receipt.</p>
        <Link
          to="/payment"
          className="inline-flex items-center gap-2 mt-3 px-6 py-2.5 rounded-full bg-brand-primary text-white font-bold text-sm hover:bg-blue-900 transition-colors"
        >
          <FileText size={15} /> Re-submit Payment →
        </Link>
      </Card>
    );
  }


  // Payment pending — submitted but not yet verified
  if (
    ['Payment Pending','payment_pending','Payment Verification'].includes(s) &&
    user?.paymentSubmitted
  )  {
    return (
      <Card colour="amber" icon={<Clock size={20} />} title="Payment Under Review">
        <p>
          We have received your payment receipt. Our admin team is verifying it.
          This typically takes <strong>24–48 working hours</strong>.
        </p>
        <p className="flex relative items-center gap-1.5 mt-2">
          <div className='w-5 pr-3'>
          <Mail size={15} className="shrink-0 absolute top-1  " />

          </div>
          <p>

          An email will be sent to <strong className="mx-1">{email}</strong> once confirmed.
          No action needed right now.

          </p>
        </p>
      </Card>
    );
  }

  // Payment confirmed but form not yet filled
// Docs rejected — form returned to student for correction
  // (checked BEFORE the generic "fill your form" message, and keyed on
  // rejected_doc_types rather than formDone — formDone gets reset to
  // false when the form is unlocked, so it can't be the signal here)
  if (s === 'Application Incomplete' && (user?.rejected_doc_types || []).length > 0) {
    const rejectedDocs = user.rejected_doc_types;
    return (
      <Card colour="amber" icon={<FileText size={20} />} title="Documents Need Correction">
        <p>
          Some of your submitted documents were not approved, and your application has been
          returned for correction.
          {user?.rejection_reason ? <><br /><strong>Reason:</strong> {user.rejection_reason}</> : ''}
        </p>
        <p className="mt-2">
          <strong>Documents to resubmit:</strong>{' '}
          {rejectedDocs.map(k => DOC_LABELS_STUDENT[k] || k).join(', ')}
        </p>
        <Link
          to="/application-form"
          className="inline-flex items-center gap-2 mt-3 px-6 py-2.5 rounded-full bg-brand-primary text-white font-bold text-sm hover:bg-blue-900 transition-colors"
        >
          <FileText size={15} /> Correct and Resubmit →
        </Link>
      </Card>
    );
  }

  // Payment confirmed but form not yet filled
  if (paymentDone && !formDone && s === 'Application Incomplete') {
    return (
      <Card colour="blue" icon={<FileText size={20} />} title="Payment Confirmed — Fill Your Application Form">
        <p>
          Your payment has been verified. You can now complete your application form.
          Click the link sent to <strong>{email}</strong> or use the button below.
        </p>
        <Link
          to="/application-form"
          className="inline-flex items-center gap-2 mt-3 px-6 py-2.5 rounded-full bg-brand-primary text-white font-bold text-sm hover:bg-blue-900 transition-colors"
        >
          <FileText size={15} /> Complete Application Form →
        </Link>
      </Card>
    );
  }

  // Form submitted — under review

  // Form submitted — under review
  if (s === 'Under Review') {
    return (
      <Card colour="indigo" icon={<Clock size={20} />} title="Application Being Reviewed">
        <p>
          Your application form has been submitted successfully. The METI admissions team is
          currently reviewing your application and documents.
        </p>
        <p className="flex items-center gap-1.5 mt-2">
          <Mail size={13} className="shrink-0" />
          You will receive an email at <strong className="mx-1">{email}</strong> with our decision.
          Please check your inbox and spam folder regularly.
        </p>
      </Card>
    );
  }

  // Approved — show application number, direct to sign documents
 // Approved — show application number, waiting for admission letter
  if (s === 'Approved') {
    return (
      <Card colour="green" icon={<Star size={20} />} title="🎉 Application Approved!">
        <p>Congratulations! Your application has been approved by the METI admissions team.</p>
        {appNum && (
          <div className="mt-3 bg-white/60 rounded-xl px-4 py-2 inline-block">
            <p className="text-xs text-gray-500 font-semibold">Application Number</p>
            <p className="font-mono font-black text-brand-primary text-base">{appNum}</p>
          </div>
        )}
        <p className="mt-3">
          Your admission letter is being prepared. An email will be sent to <strong>{email}</strong> once
          it's ready — you'll then be able to download it below.
        </p>
      </Card>
    );
  }

  // Awaiting signature confirmation 
  // i am no longer using the signing process of student signing on the acceptance , rather , they get the admission from the application form 
  // if (s === 'awaiting_signature') {
  //   return (
  //     <Card colour="teal" icon={<FileSignature size={20} />} title="Documents Submitted — Awaiting Confirmation">
  //       <p>
  //         Your signed acceptance letter has been submitted to METI. Admin is reviewing it.
  //         You will receive an email at <strong>{email}</strong> once your enrollment is confirmed.
  //       </p>
  //     </Card>
  //   );
  // }

  // Active student
  if (s === 'active_student') {
    return (
      <Card colour="green" icon={<CheckCircle2 size={20} />} title="🎓 Welcome to METI!">
        <p>
        You are now a fully enrolled student of the Institute of Engineering, Technology
          and Innovation Management (METI), University of Port Harcourt for the {user?.admissionLetterSession || getCurrentSession()}
          academic session.
        </p>
        {appNum && (
          <div className="mt-3 bg-white/60 rounded-xl px-4 py-2 inline-block">
            <p className="text-xs text-gray-500 font-semibold">Application Number</p>
            <p className="font-mono font-black text-brand-primary text-base">{appNum}</p>
          </div>
        )}
      </Card>
    );
  }

  // Rejected
// Rejected — student can correct and resubmit
  if (s === 'Rejected') {
    return (
      <Card colour="red" icon={<Clock size={20} />} title="Application Not Approved">
        <p>
          We regret to inform you that your application was not approved at this time.
          {user?.notes ? <><br /><strong>Reason:</strong> {user.notes}</> : ''}
        </p>
        <p className="mt-2">
          You can correct the issue and resubmit your application below.
        </p>
        <Link
          to="/application-form"
          className="inline-flex items-center gap-2 mt-3 px-6 py-2.5 rounded-full bg-brand-primary text-white font-bold text-sm hover:bg-blue-900 transition-colors"
        >
          <FileText size={15} /> Correct and Resubmit →
        </Link>
        <p className="mt-3">
          Questions? Contact: <a href="mailto:meti@uniport.edu.ng" className="underline font-bold">meti@uniport.edu.ng</a>
        </p>
      </Card>
    );
  }

  return null;
}

// ── Document tabs (Admission Letter + Acceptance Letter) ──
// Only shown when status is Approved or awaiting_signature or active_student
function DocumentTabs({ user }) {
  const [activeTab,  setActiveTab]  = useState('admission');
  const [downloading, setDownloading] = useState(null);

  const s           = user?.status || '';
  const visible     = ['Approved','active_student'].includes(s);
  if (!visible) return null;

  const admissionSent  = !!user?.admissionLetterSent;
  const fullName       = user?.applicationForm?.personal?.fullName || user?.name || '';

const handleDownload = async (type) => {
    setDownloading(type);
    try {
      const { uniportLogo, metiLogo } = await fetchPdfLogos();
      const { pdf } = await import('@react-pdf/renderer');
      let blob;
      if (type === 'admission') {
        const { AdmissionLetterPDF } = await import('../../components/pdf/AdmissionLetterPDF');
        blob = await pdf(
          <AdmissionLetterPDF
            application={user}
            letterTitle={user?.admissionLetterTitle}
            acceptanceFee={user?.admissionLetterAcceptance}
            tuitionFee={user?.admissionLetterTuition}
            scholarshipDiscount={user?.admissionLetterScholarship}
            netTuition={user?.admissionLetterNetTuition}
            directorName={user?.admissionLetterDirector}
            directorTitle={user?.admissionLetterDirectorTitle}
            extraNotes={user?.admissionLetterExtraNotes}
        academicSession={user?.admissionLetterSession ?? getCurrentSession()}
            bankName={user?.admissionLetterBank ?? 'First Bank of Nigeria'}
            accountName={user?.admissionLetterAccName ?? 'Institute of Engineering, Technology and Innovation Management (METI)'}
            accountNumber={user?.admissionLetterAccNumber ?? '2016040805'}
            uniportLogo={uniportLogo}
            metiLogo={metiLogo}
          />
        ).toBlob();
      } else {
     const { default: AcceptanceLetterPDF } = await import('../../components/pdf/AcceptanceLetterPDF');
        blob = await pdf(
          <AcceptanceLetterPDF
            application={user}
            academicSession={user?.admissionLetterSession}
            uniportLogo={uniportLogo}
            metiLogo={metiLogo}
          />
        ).toBlob();
      }
      const url  = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href     = url;
      link.download = `METI_${type === 'admission' ? 'Admission' : 'Acceptance'}_Letter_${(user?.name||'').replace(/\s+/g,'_')}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download error:', err);
      alert('Could not generate the PDF. Please try again, or contact METI support if this continues.');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Tab headers */}
      <div className="flex border-b border-gray-100">
        {[
          { id: 'admission',  label: 'Tab 1 — Admission Letter'  },
          { id: 'acceptance', label: 'Tab 2 — Acceptance Letter' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-xs font-bold transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-brand-primary text-brand-primary bg-blue-50/50'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-5">
        {/* Admission Letter tab */}
        {activeTab === 'admission' && (
          <div className="space-y-4">
            {!admissionSent ? (
              <div className="text-center py-8 text-gray-400 space-y-2">
                <Clock size={28} className="mx-auto" />
                <p className="text-sm font-semibold">Admission Letter Not Yet Sent</p>
                <p className="text-xs">
                  The admin is preparing your admission letter. You will receive an email at{' '}
                  <strong>{user?.email}</strong> when it is ready.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
                  <CheckCircle2 size={15} />
                  <p className="text-xs font-bold">Your admission letter is ready to download.</p>
                </div>
                <p className="text-xs text-gray-500">
                  This letter confirms your provisional offer of admission into the METI postgraduate programme.
                  Download it, keep a copy for your records.
                </p>
                <button onClick={() => handleDownload('admission')} disabled={downloading === 'admission'}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-primary text-white font-bold text-sm hover:bg-blue-900 disabled:opacity-50">
                  {downloading === 'admission'
                    ? <Loader2 size={15} className="animate-spin" />
                    : <Download size={15} />}
                  Download Admission Letter PDF
                </button>
              </div>
            )}
          </div>
        )}

        {/* Acceptance Letter tab */}
       {/* Acceptance Letter tab */}
        {activeTab === 'acceptance' && (
          <div className="space-y-4">
            {!admissionSent ? (
              <div className="text-center py-8 text-gray-400 space-y-2">
                <Clock size={28} className="mx-auto" />
                <p className="text-sm font-semibold">Not Available Yet</p>
                <p className="text-xs">The acceptance letter becomes available once your admission letter is sent.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
                  <CheckCircle2 size={15} />
                  <p className="text-xs font-bold">Your acceptance letter is ready to download.</p>
                </div>
                <p className="text-xs text-gray-500">
                  This confirms your enrollment into the METI postgraduate programme. Download it, keep a copy for your records.
                </p>
                <button onClick={() => handleDownload('acceptance')} disabled={downloading === 'acceptance'}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-brand-primary text-brand-primary font-bold text-sm hover:bg-brand-primary/5 disabled:opacity-50">
                  {downloading === 'acceptance'
                    ? <Loader2 size={15} className="animate-spin" />
                    : <Download size={15} />}
                  Download Acceptance Letter PDF
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Announcement preview ──
function AnnouncementPreview({ user, announcements }) {
  const studentProgramme = user?.selectedProgram === 'Masters' ? 'msc'
    : user?.selectedProgram === 'PhD' ? 'phd'
    : user?.selectedProgram === 'PGD' ? 'pgd' : null;

  const items = (announcements || [])
    .filter(a => !a.programme_filter || a.programme_filter === studentProgramme)
    .slice(0, 2);

  if (!items.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-gray-900">Latest Announcements</p>
        <Link to="/dashboard/announcements" className="text-xs text-brand-primary font-semibold hover:underline">
          View All →
        </Link>
      </div>
      <div className="space-y-2">
        {items.map(ann => (
          <div key={ann.id} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex flex-wrap gap-2 mb-1.5">
              <span className="text-[10px] bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full">
                {(ann.created_at || ann.createdAt || '').slice(0, 10)}
              </span>
              <span className="text-[10px] bg-brand-primary/10 text-brand-primary font-semibold px-2 py-0.5 rounded-full">
                {ann.programme_filter ? ann.programme_filter.toUpperCase() : 'All Students'}
              </span>
            </div>
            {ann.title && <p className="text-sm font-bold text-gray-900 mb-0.5">{ann.title}</p>}
            <p className="text-sm text-gray-600 leading-relaxed">{ann.message}</p>
            {(ann.attachment_url || ann.attachmentUrl) && (
              <a href={ann.attachment_url || ann.attachmentUrl}
                download={ann.attachment_name || ann.attachmentName}
                className="inline-flex items-center gap-1 text-xs text-brand-primary underline mt-2">
                📎 {ann.attachment_name || ann.attachmentName}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Reusable coloured card ──
const CARD_COLOURS = {
  amber:  'bg-amber-50 border-amber-200 text-amber-900',
  blue:   'bg-blue-50 border-blue-200 text-blue-900',
  indigo: 'bg-indigo-50 border-indigo-200 text-indigo-900',
  green:  'bg-green-50 border-green-200 text-green-900',
  teal:   'bg-teal-50 border-teal-200 text-teal-900',
  red:    'bg-red-50 border-red-200 text-red-900',
};
function Card({ colour, icon, title, children }) {
  return (
    <div className={`rounded-2xl border-2 p-5 ${CARD_COLOURS[colour] || CARD_COLOURS.blue}`}>
      <div className="flex items-start gap-3">
        <span className="shrink-0 mt-0.5">{icon}</span>
        <div className="space-y-1 text-sm leading-relaxed flex-1">
          <p className="font-black text-base mb-2">{title}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════
export default function DashboardHome() {
  const { user, announcements } = useAdmissionsStore();

  const fullName = user?.applicationForm?.personal?.fullName || user?.name || 'Student';
  const today    = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  });

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">

      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Welcome, {fullName}</h1>
        <p className="text-sm text-gray-400 mt-0.5">{today}</p>
      </div>

      {/* Progress bar */}
      <ProgressBar user={user} />

      {/* Status message */}
      <StatusMessage user={user} />

      {/* Document tabs (Admission + Acceptance) */}
      <DocumentTabs user={user} />

      {/* Announcements preview */}
      <AnnouncementPreview user={user} announcements={announcements} />

    </div>
  );
}