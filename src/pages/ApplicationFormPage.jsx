// FILE: ApplicationFormPage.jsx
// DEPENDENCIES: react, react-router-dom, ../store/admissionsStore, lucide-react

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmissionsStore } from '../store/admissionsStore';
import {
  FileText, Save, CheckCircle2, AlertCircle, Loader2, ArrowRight, Camera, FileUp
} from 'lucide-react';

// ── Section tabs in correct regform.pdf order: A,B,C,D,F,E,Docs,G ──
const SECTIONS = [
  { id: 'A', name: 'Personal' },
  { id: 'B', name: 'Programme' },
  { id: 'C', name: 'Academic' },
  { id: 'D', name: 'Experience' },
  { id: 'F', name: 'Other Info' },
  { id: 'E', name: 'Referees' },
  { id: 'Docs', name: 'Documents' },
  { id: 'G', name: 'Declaration' },
];

const CLASS_OF_DEGREE_OPTIONS = [
  'First Class',
  'Second Class Upper',
  'Second Class Lower',
  'Third Class',
  'Pass',
];

export default function ApplicationFormPage() {
  const navigate = useNavigate();
  const { user, saveFormDraft, submitApplicationForm, submitDocuments } = useAdmissionsStore();

useEffect(() => {
    if (!user || user.role === 'admin') {
      navigate('/login');
      return;
    }
    // Block direct URL access before payment is verified — the form should
    // only unlock after the admin confirms payment (Payment tab → Confirm Payment).
    if (!user.paymentVerified) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const [activeSection, setActiveSection] = useState('A');
  const [saveStatus, setSaveStatus] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  // ── SECTION A: Personal Information ──
  const [personal, setPersonal] = useState({
    fullName: user?.applicationForm?.personal?.fullName || '',
    dob: user?.applicationForm?.personal?.dob || '',
    sex: user?.applicationForm?.personal?.sex || 'Male',
    nationality: user?.applicationForm?.personal?.nationality || '',
    state: user?.applicationForm?.personal?.state || '',
    lga: user?.applicationForm?.personal?.lga || '',
    contactAddress1: user?.applicationForm?.personal?.contactAddress1 || '',
    contactAddress2: user?.applicationForm?.personal?.contactAddress2 || '',
    phone: user?.applicationForm?.personal?.phone || '',
    whatsapp: user?.applicationForm?.personal?.whatsapp || '',
    email: user?.applicationForm?.personal?.email || user?.email || '',
    nextOfKinName: user?.applicationForm?.personal?.nextOfKinName || '',
    nextOfKinRelationship: user?.applicationForm?.personal?.nextOfKinRelationship || '',
    nextOfKinPhone: user?.applicationForm?.personal?.nextOfKinPhone || '',
  });

  // Passport photo (JPG only, max 2MB) — stored as data URL for preview
  const [passportPhoto, setPassportPhoto] = useState(user?.applicationForm?.passportPhoto || null);
  const [passportPhotoError, setPassportPhotoError] = useState('');
  const passportInputRef = useRef(null);

  const handlePassportUpload = (file) => {
    setPassportPhotoError('');
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['jpg', 'jpeg'].includes(ext)) {
      setPassportPhotoError('Passport photo must be a JPG/JPEG image only.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setPassportPhotoError('Passport photo must be under 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setPassportPhoto(e.target.result);
    reader.readAsDataURL(file);
  };

  // ── SECTION B: Programme Details (pre-filled, read-only + mode of study) ──
  const [modeOfStudy, setModeOfStudy] = useState(
    user?.applicationForm?.modeOfStudy || 'Full-Time'
  );
  const programmeLabel = {
    PGD: 'Post Graduate Diploma (PGD)',
    Masters: 'Master of Science (M.Sc)',
    PhD: 'Doctor of Philosophy (PhD)',
  }[user?.selectedProgram] || user?.selectedProgram || '—';

  // ── SECTION C: Academic Background ──
  const [academic, setAcademic] = useState({
    firstDegree: user?.applicationForm?.academic?.firstDegree || '',
    firstInstitution: user?.applicationForm?.academic?.firstInstitution || '',
    firstYear: user?.applicationForm?.academic?.firstYear || '',
    firstClass: user?.applicationForm?.academic?.firstClass || '',
    secondDegree: user?.applicationForm?.academic?.secondDegree || '',
    secondInstitution: user?.applicationForm?.academic?.secondInstitution || '',
    secondYear: user?.applicationForm?.academic?.secondYear || '',
    secondClass: user?.applicationForm?.academic?.secondClass || '',
    otherQualifications: user?.applicationForm?.academic?.otherQualifications || '',
    englishProficiency: user?.applicationForm?.academic?.englishProficiency || '',
  });

  // ── SECTION D: Work Experience ──
  const [work, setWork] = useState({
    employer: user?.applicationForm?.work?.employer || '',
    position: user?.applicationForm?.work?.position || '',
    duration: user?.applicationForm?.work?.duration || '',
  });

  // ── SECTION F: Any Other Information ──
  const [otherInfo, setOtherInfo] = useState(user?.applicationForm?.otherInfo || '');

  // ── SECTION E: Referees (TWO referee blocks) ──
  const [referee1, setReferee1] = useState({
    name: user?.applicationForm?.referees?.[0]?.name || '',
    address: user?.applicationForm?.referees?.[0]?.address || '',
    phone: user?.applicationForm?.referees?.[0]?.phone || '',
    email: user?.applicationForm?.referees?.[0]?.email || '',
  });
  const [referee2, setReferee2] = useState({
    name: user?.applicationForm?.referees?.[1]?.name || '',
    address: user?.applicationForm?.referees?.[1]?.address || '',
    phone: user?.applicationForm?.referees?.[1]?.phone || '',
    email: user?.applicationForm?.referees?.[1]?.email || '',
  });

  // ── SECTION Docs: Document Uploads ──
const [docs, setDocs] = useState({
    degreeCert: user?.uploadedDocs?.degreeCert || null,
    transcript: user?.uploadedDocs?.transcript || null,
    nysc: user?.uploadedDocs?.nysc || null,
    referenceLetter1: user?.uploadedDocs?.referenceLetter1 || null,
    birthCert: user?.uploadedDocs?.birthCert || null,
    referenceLetter2: user?.uploadedDocs?.referenceLetter2 || null,
    other: user?.uploadedDocs?.other || null,
    phdMasterCert: user?.uploadedDocs?.phdMasterCert || null,
    phdMasterTranscript: user?.uploadedDocs?.phdMasterTranscript || null,
  });

  const [uploadErrors, setUploadErrors] = useState({});

  // ── SECTION G: Declaration ──
  const [signature, setSignature] = useState(user?.applicationForm?.signature || null);
  const [declarationChecked, setDeclarationChecked] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureMode, setSignatureMode] = useState('draw'); // 'draw' | 'upload'
  const sigUploadRef = useRef(null);
  const [signatureError, setSignatureError] = useState('');

  const handleSignatureUpload = (file) => {
    setSignatureError('');
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['jpg', 'jpeg', 'png'].includes(ext)) {
      setSignatureError('Signature must be a JPG or PNG image.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setSignatureError('Signature image must be under 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setSignature(e.target.result);
    reader.readAsDataURL(file);
  };



  // Auto-save every 10 seconds
  // A ref holds the latest save function so the interval is created ONCE and
  // just keeps ticking — the old version re-created the interval on every
  // keystroke (it was in the effect's dependency array), which reset the
  // 10-second countdown and could prevent auto-save from firing while typing.
  const handleSaveDraftRef = useRef();
  useEffect(() => {
    handleSaveDraftRef.current = handleSaveDraft;
  });
  useEffect(() => {
    const timer = setInterval(() => handleSaveDraftRef.current(true), 10000);
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    if (activeSection === 'G' && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.strokeStyle = '#1e3a8a';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
    }
  }, [activeSection]);

  const handleSaveDraft = (isAuto = false) => {
    if (!user) return;
    const draft = {
      personal,
      passportPhoto,
      modeOfStudy,
      academic,
      work,
      otherInfo,
      referees: [referee1, referee2],
      signature,
    };
    saveFormDraft(draft);
    if (!isAuto) {
      setSaveStatus('Draft saved successfully.');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  // Document upload handler
 // Document upload handler — now stores the real file content, not just the name
  const handleDocUpload = (key, file) => {
    setUploadErrors((prev) => ({ ...prev, [key]: '' }));
    if (!file) return;
    const rejectedExtensions = ['exe', 'zip', 'rar', 'tar', 'gz', 'sh', 'bat'];
    const fileExt = file.name.split('.').pop().toLowerCase();
    if (rejectedExtensions.includes(fileExt)) {
      setUploadErrors((prev) => ({ ...prev, [key]: 'Invalid file type (EXE, ZIP, RAR rejected).' }));
      return;
    }
    const acceptedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
    if (!acceptedExtensions.includes(fileExt)) {
      setUploadErrors((prev) => ({ ...prev, [key]: 'Accepted formats: PDF, JPG, PNG only.' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadErrors((prev) => ({ ...prev, [key]: 'File size exceeds 5MB limit.' }));
      return;
    }
   const reader = new FileReader();
    reader.onload = (e) => {
      const fileData = { name: file.name, type: file.type, url: e.target.result };
      setDocs((prev) => {
        const updated = { ...prev, [key]: fileData };
        submitDocuments(updated, key);
        return updated;
      });
    };
    reader.readAsDataURL(file);
  };

  // Signature canvas handlers
  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      setSignature(canvasRef.current.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      setSignature(null);
    }
  };

  // Form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setUploadErrors({});

  const missingPersonal =
      !personal.fullName || !personal.dob || !personal.nationality || !personal.state ||
      !personal.lga || !personal.contactAddress1 || !personal.phone || !personal.whatsapp ||
      !personal.email || !personal.nextOfKinName || !personal.nextOfKinRelationship ||
      !personal.nextOfKinPhone || !passportPhoto;
    if (missingPersonal) {
      setActiveSection('A');
      setUploadErrors({ global: 'Please fill in all required personal information fields (marked *).' });
      return;
    }

    const missingAcademic =
      !academic.firstDegree || !academic.firstInstitution || !academic.firstYear ||
      !academic.firstClass || (user?.selectedProgram === 'PhD' && !academic.secondDegree);
    if (missingAcademic) {
      setActiveSection('C');
      setUploadErrors({
        global: user?.selectedProgram === 'PhD'
          ? 'Please fill in all required academic background fields, including Second Degree (required for PhD).'
          : 'Please fill in all required academic background fields (marked *).',
      });
      return;
    }

   const requiredDocs = ['degreeCert', 'nysc', 'birthCert'];
    if (user?.selectedProgram === 'PhD') {
      requiredDocs.push('phdMasterCert', 'phdMasterTranscript');
    }

    const missingDocs = requiredDocs.filter((d) => !docs[d]);
    if (missingDocs.length > 0) {
      setActiveSection('Docs');
      setUploadErrors({
        global: `Missing uploads: ${missingDocs.map((d) => d.replace(/([A-Z])/g, ' $1')).join(', ')}.`,
      });
      return;
    }

    if (!signature) {
      setActiveSection('G');
      setUploadErrors({ global: 'Signature is required to verify declaration.' });
      return;
    }

    if (!declarationChecked) {
      setActiveSection('G');
      setUploadErrors({ global: 'You must check the declaration box.' });
      return;
    }

    setSubmitLoading(true);
    setTimeout(() => {
      submitApplicationForm(
        { personal, passportPhoto, modeOfStudy, academic, work, otherInfo, referees: [referee1, referee2] },
        signature
      );
      setSubmitLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  const isFormLocked = user?.applicationFormSubmitted;

  // ── INPUT HELPERS ──
  const inputCls =
    'w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-uniport-blue disabled:opacity-60';
  const labelCls = 'block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2';

  return (
    <div className="pt-10 pb-24 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">

        {/* Header */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-150 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">
              Admissions Application Form
            </h1>
            <p className="text-xs text-gray-400">
              Complete all parts. Auto-saves draft every 10 seconds.
            </p>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {saveStatus && <span className="text-xs text-green-500 font-bold">{saveStatus}</span>}
            {!isFormLocked && (
              <button
                type="button"
                onClick={() => handleSaveDraft(false)}
                className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 cursor-pointer"
              >
                <Save size={14} />
                Save Draft
              </button>
            )}
          </div>
        </div>

        {/* Section Tabs — scrollable on mobile */}
        <div className="bg-white p-2 rounded-2xl border border-gray-150 shadow-sm mb-6 overflow-x-auto">
          <div className="flex gap-1 min-w-max sm:min-w-0 sm:flex-wrap">
            {SECTIONS.map((sect) => (
              <button
                key={sect.id}
                onClick={() => setActiveSection(sect.id)}
                className={`px-3 sm:flex-1 sm:min-w-15 text-center py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer whitespace-nowrap ${
                  activeSection === sect.id
                    ? 'bg-uniport-blue text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {sect.name}
              </button>
            ))}
          </div>
        </div>

        {/* Global Error Banner */}
        {uploadErrors.global && (
          <div className="p-4 mb-6 text-xs font-bold text-red-600 bg-red-50 rounded-xl border border-red-200 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{uploadErrors.global}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white p-5 sm:p-8 rounded-3xl border border-gray-150 shadow-lg relative">

          {isFormLocked && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-3xl z-30 flex items-center justify-center">
              <div className="bg-uniport-blue text-white p-6 rounded-2xl shadow-xl flex items-center gap-3">
                <CheckCircle2 size={24} className="text-green-300" />
                <div>
                  <h4 className="font-bold text-sm">Application Locked</h4>
                  <p className="text-xs text-blue-200">Submitted and locked for review.</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-6">

            {/* ═══════════════════════════════════════════
                SECTION A — PERSONAL INFORMATION
            ═══════════════════════════════════════════ */}
            {activeSection === 'A' && (
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">A – Personal Information</h3>

                {/* Full Name + Passport Photo row */}
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="flex-1">
                    <label className={labelCls}>Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. SURNAME Firstname Middlename"
                      value={personal.fullName}
                      onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
                      disabled={isFormLocked}
                      className={inputCls}
                    />
                  </div>

                  {/* Passport photo upload — top-right per regform.pdf */}
                  <div className="shrink-0">
                    <label className={labelCls}>Passport Photo * (JPG, max 2MB)</label>
                    <div
                    className={`w-28 h-32 border-2 border-dashed rounded-xl overflow-hidden cursor-pointer relative bg-gray-50 flex flex-col items-center justify-center text-center transition-colors ${
                                  uploadErrors.global && !passportPhoto ? 'border-red-400 bg-red-50/30' : 'border-gray-300 hover:border-uniport-blue'
                                }`}
                      // className="w-28 h-32 border-2 border-dashed border-gray-300 hover:border-uniport-blue rounded-xl overflow-hidden cursor-pointer relative bg-gray-50 flex flex-col items-center justify-center text-center transition-colors"
                      onClick={() => passportInputRef.current?.click()}
                    >
                      {passportPhoto ? (
                        <img src={passportPhoto} alt="Passport" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Camera size={24} className="text-gray-400 mb-1" />
                          <span className="text-[10px] text-gray-400 font-semibold px-1">Click to upload</span>
                        </>
                      )}
                      <input
                        ref={passportInputRef}
                        type="file"
                        required
                        accept=".jpg,.jpeg"
                        className="hidden"
                        disabled={isFormLocked}
                        onChange={(e) => handlePassportUpload(e.target.files[0])}
                      />
                    </div>
                    {passportPhotoError && (
                      <p className="text-[10px] text-red-500 font-bold mt-1 max-w-28">{passportPhotoError}</p>
                    )}
                    {passportPhoto && (
                      <button
                        type="button"
                        onClick={() => setPassportPhoto(null)}
                        className="text-[10px] text-red-500 font-bold mt-1 block"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* DOB + Sex */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Date of Birth *</label>
                    <input
                      type="date"
                      value={personal.dob}
                      onChange={(e) => setPersonal({ ...personal, dob: e.target.value })}
                      disabled={isFormLocked}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Sex *</label>
                    <div className="flex gap-6 items-center h-11.5 px-4 bg-gray-50 border border-gray-200 rounded-xl">
                      {['Male', 'Female'].map((s) => (
                        <label key={s} className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700">
                          <input
                            type="radio"
                            name="sex"
                            value={s}
                            checked={personal.sex === s}
                            onChange={() => setPersonal({ ...personal, sex: s })}
                            disabled={isFormLocked}
                            className="text-uniport-blue focus:ring-uniport-blue"
                          />
                          {s}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Nationality */}
                <div>
                  <label className={labelCls}>Nationality *</label>
                  <input
                    type="text"
                    value={personal.nationality}
                    onChange={(e) => setPersonal({ ...personal, nationality: e.target.value })}
                    disabled={isFormLocked}
                    className={inputCls}
                  />
                </div>

                {/* State + LGA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>State *</label>
                    <input
                      type="text"
                      value={personal.state}
                      onChange={(e) => setPersonal({ ...personal, state: e.target.value })}
                      disabled={isFormLocked}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>L.G.A. *</label>
                    <input
                      type="text"
                      value={personal.lga}
                      onChange={(e) => setPersonal({ ...personal, lga: e.target.value })}
                      disabled={isFormLocked}
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Contact Address */}
                <div>
                  <label className={labelCls}>Contact Address (Line 1) *</label>
                  <input
                    type="text"
                    value={personal.contactAddress1}
                    onChange={(e) => setPersonal({ ...personal, contactAddress1: e.target.value })}
                    disabled={isFormLocked}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Contact Address (Line 2) — optional</label>
                  <input
                    type="text"
                    value={personal.contactAddress2}
                    onChange={(e) => setPersonal({ ...personal, contactAddress2: e.target.value })}
                    disabled={isFormLocked}
                    className={inputCls}
                  />
                </div>

                {/* Phone + WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Phone Number(s) *</label>
                    <input
                      type="text"
                      value={personal.phone}
                      onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                      disabled={isFormLocked}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>WhatsApp Number *</label>
                    <input
                      type="text"
                      value={personal.whatsapp}
                      onChange={(e) => setPersonal({ ...personal, whatsapp: e.target.value })}
                      disabled={isFormLocked}
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className={labelCls}>Email(s) *</label>
                  <input
                    type="email"
                    value={personal.email}
                    onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                    disabled={isFormLocked}
                    className={inputCls}
                  />
                </div>

                {/* Next of Kin */}
                <div className="border-t pt-4 mt-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Next of Kin</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls}>Name of Next of Kin *</label>
                      <input
                        type="text"
                        value={personal.nextOfKinName}
                        onChange={(e) => setPersonal({ ...personal, nextOfKinName: e.target.value })}
                        disabled={isFormLocked}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Relationship *</label>
                      <input
                        type="text"
                        value={personal.nextOfKinRelationship}
                        onChange={(e) => setPersonal({ ...personal, nextOfKinRelationship: e.target.value })}
                        disabled={isFormLocked}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Phone Number *</label>
                      <input
                        type="text"
                        value={personal.nextOfKinPhone}
                        onChange={(e) => setPersonal({ ...personal, nextOfKinPhone: e.target.value })}
                        disabled={isFormLocked}
                        className={inputCls}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════
                SECTION B — PROGRAMME DETAILS (pre-filled)
            ═══════════════════════════════════════════ */}
            {activeSection === 'B' && (
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">B – Programme Details</h3>
                <p className="text-xs text-gray-400 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                  These fields are pre-filled from your programme selection and are read-only.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Degree Sought</label>
                    <div className="bg-gray-100 border border-gray-200 rounded-xl py-3 px-4 text-sm font-semibold text-gray-700">
                      {user?.selectedProgram === 'PGD' ? '☑ PGD' : user?.selectedProgram === 'Masters' ? '☑ MSc' : user?.selectedProgram === 'PhD' ? '☑ PhD' : '—'}
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Mode of Study *</label>
                    <div className="flex gap-6 items-center h-11.5 px-4 bg-gray-50 border border-gray-200 rounded-xl">
                      {['Full-Time', 'Part-Time'].map((m) => (
                        <label key={m} className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700">
                          <input
                            type="radio"
                            name="modeOfStudy"
                            value={m}
                            checked={modeOfStudy === m}
                            onChange={() => setModeOfStudy(m)}
                            disabled={isFormLocked}
                            className="text-uniport-blue focus:ring-uniport-blue"
                          />
                          {m}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Programme Specialization</label>
                  <div className="bg-gray-100 border border-gray-200 rounded-xl py-3 px-4 text-sm font-semibold text-gray-700">
                    {user?.specialization || '—'}
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════
                SECTION C — ACADEMIC BACKGROUND
            ═══════════════════════════════════════════ */}
            {activeSection === 'C' && (
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">C – Academic Background</h3>

                {/* First Degree */}
                <p className="text-xs font-bold text-uniport-blue uppercase tracking-wider">First Degree</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>First Degree (e.g. B.Sc, B.Eng) *</label>
                    <input
                      type="text"
                      value={academic.firstDegree}
                      onChange={(e) => setAcademic({ ...academic, firstDegree: e.target.value })}
                      disabled={isFormLocked}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Institution *</label>
                    <input
                      type="text"
                      value={academic.firstInstitution}
                      onChange={(e) => setAcademic({ ...academic, firstInstitution: e.target.value })}
                      disabled={isFormLocked}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Year *</label>
                    <input
                      type="number"
                      placeholder="e.g. 2018"
                      value={academic.firstYear}
                      onChange={(e) => setAcademic({ ...academic, firstYear: e.target.value })}
                      disabled={isFormLocked}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Class of Degree *</label>
                    <select
                      value={academic.firstClass}
                      onChange={(e) => setAcademic({ ...academic, firstClass: e.target.value })}
                      disabled={isFormLocked}
                      className={inputCls}
                    >
                      <option value="">Select class…</option>
                      {CLASS_OF_DEGREE_OPTIONS.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Second Degree — optional for PGD/MSc, required for PhD */}
                <div className="border-t pt-4">
                  <p className="text-xs font-bold text-uniport-blue uppercase tracking-wider mb-3">
                    Second Degree
                    {user?.selectedProgram === 'PhD'
                      ? <span className="text-red-500 ml-1">* Required for PhD</span>
                      : <span className="text-gray-400 ml-1">(If applicable)</span>
                    }
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Second Degree{user?.selectedProgram === 'PhD' ? ' *' : ''}</label>
                      <input
                        type="text"
                        value={academic.secondDegree}
                        onChange={(e) => setAcademic({ ...academic, secondDegree: e.target.value })}
                        disabled={isFormLocked}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Institution</label>
                      <input
                        type="text"
                        value={academic.secondInstitution}
                        onChange={(e) => setAcademic({ ...academic, secondInstitution: e.target.value })}
                        disabled={isFormLocked}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Year</label>
                      <input
                        type="number"
                        placeholder="e.g. 2021"
                        value={academic.secondYear}
                        onChange={(e) => setAcademic({ ...academic, secondYear: e.target.value })}
                        disabled={isFormLocked}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Class of Degree</label>
                      <select
                        value={academic.secondClass}
                        onChange={(e) => setAcademic({ ...academic, secondClass: e.target.value })}
                        disabled={isFormLocked}
                        className={inputCls}
                      >
                        <option value="">Select class…</option>
                        {CLASS_OF_DEGREE_OPTIONS.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Other Qualifications + English Proficiency */}
                <div className="border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Other Qualifications (optional)</label>
                    <textarea
                      rows={3}
                      value={academic.otherQualifications}
                      onChange={(e) => setAcademic({ ...academic, otherQualifications: e.target.value })}
                      disabled={isFormLocked}
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>English Language Proficiency (optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. IELTS 7.0, native speaker"
                      value={academic.englishProficiency}
                      onChange={(e) => setAcademic({ ...academic, englishProficiency: e.target.value })}
                      disabled={isFormLocked}
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════
                SECTION D — WORK EXPERIENCE
            ═══════════════════════════════════════════ */}
            {activeSection === 'D' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">D – Work Experience</h3>
                <p className="text-xs text-gray-400">All fields in this section are optional.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Employer</label>
                    <input
                      type="text"
                      value={work.employer}
                      onChange={(e) => setWork({ ...work, employer: e.target.value })}
                      disabled={isFormLocked}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Position / Designation</label>
                    <input
                      type="text"
                      value={work.position}
                      onChange={(e) => setWork({ ...work, position: e.target.value })}
                      disabled={isFormLocked}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Duration (e.g. 4 Years)</label>
                    <input
                      type="text"
                      value={work.duration}
                      onChange={(e) => setWork({ ...work, duration: e.target.value })}
                      disabled={isFormLocked}
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════
                SECTION F — ANY OTHER INFORMATION
            ═══════════════════════════════════════════ */}
            {activeSection === 'F' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">F – Any Other Information to Support Your Application</h3>
                <p className="text-xs text-gray-400">Optional. Maximum 1,000 characters.</p>
                <textarea
                  rows={8}
                  maxLength={1000}
                  placeholder="Include any other relevant information that may support your application..."
                  value={otherInfo}
                  onChange={(e) => setOtherInfo(e.target.value)}
                  disabled={isFormLocked}
                  className={`${inputCls} resize-none`}
                />
                <p className="text-xs text-gray-400 text-right">{otherInfo.length}/1000</p>
              </div>
            )}

            {/* ═══════════════════════════════════════════
                SECTION E — REFEREES (2 blocks)
            ═══════════════════════════════════════════ */}
            {activeSection === 'E' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">E – Referees</h3>

                {/* Referee 1 */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                  <p className="text-xs font-bold text-uniport-blue uppercase tracking-wider mb-4">Referee 1</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Name</label>
                      <input
                        type="text"
                        value={referee1.name}
                        onChange={(e) => setReferee1({ ...referee1, name: e.target.value })}
                        disabled={isFormLocked}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Phone Number</label>
                      <input
                        type="text"
                        value={referee1.phone}
                        onChange={(e) => setReferee1({ ...referee1, phone: e.target.value })}
                        disabled={isFormLocked}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Address</label>
                      <input
                        type="text"
                        value={referee1.address}
                        onChange={(e) => setReferee1({ ...referee1, address: e.target.value })}
                        disabled={isFormLocked}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Email</label>
                      <input
                        type="email"
                        value={referee1.email}
                        onChange={(e) => setReferee1({ ...referee1, email: e.target.value })}
                        disabled={isFormLocked}
                        className={inputCls}
                      />
                    </div>
                  </div>
                </div>

                {/* Referee 2 */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                  <p className="text-xs font-bold text-uniport-blue uppercase tracking-wider mb-4">Referee 2</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Name</label>
                      <input
                        type="text"
                        value={referee2.name}
                        onChange={(e) => setReferee2({ ...referee2, name: e.target.value })}
                        disabled={isFormLocked}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Phone Number</label>
                      <input
                        type="text"
                        value={referee2.phone}
                        onChange={(e) => setReferee2({ ...referee2, phone: e.target.value })}
                        disabled={isFormLocked}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Address</label>
                      <input
                        type="text"
                        value={referee2.address}
                        onChange={(e) => setReferee2({ ...referee2, address: e.target.value })}
                        disabled={isFormLocked}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Email</label>
                      <input
                        type="email"
                        value={referee2.email}
                        onChange={(e) => setReferee2({ ...referee2, email: e.target.value })}
                        disabled={isFormLocked}
                        className={inputCls}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════
                DOCS TAB — Supporting Documents Upload
            ═══════════════════════════════════════════ */}
            {activeSection === 'Docs' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Supporting Documents Upload</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Accepted formats: PDF, JPG, PNG only. Max file size: 5MB each.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {[
                    { key: 'degreeCert', label: '1. First Degree Certificates *' },
                    { key: 'transcript', label: '2. Academic Transcripts (Recommended)' },
                    { key: 'nysc', label: '3. NYSC Certificate or Certificate of Exemption *' },
                    { key: 'referenceLetter1', label: '4. Academic Reference Letters 1 (Recommended)' },
                    { key: 'birthCert', label: '5. Birth Certificate or Court-Affirmed Declaration of Age *' },
                    { key: 'referenceLetter2', label: '6. Academic Reference Letters 2 (Recommended)' },  
                    { key: 'other', label: '7. Any other relevant document', optional: true },
                  ].map((doc) => (
                    <DocUploadSlot
                      key={doc.key}
                      label={doc.label}
                      value={docs[doc.key]}
                      error={uploadErrors[doc.key]}
                      disabled={isFormLocked}
                      optional={doc.optional}
                      onUpload={(file) => handleDocUpload(doc.key, file)}
                    />
                  ))}

                  {user?.selectedProgram === 'PhD' && (
                    <>
                      <div className="sm:col-span-2">
                    
                      </div>
                      <DocUploadSlot
                        label="Master's Degree Certificate *"
                        value={docs.phdMasterCert}
                        error={uploadErrors.phdMasterCert}
                        disabled={isFormLocked}
                        onUpload={(file) => handleDocUpload('phdMasterCert', file)}
                      />
                      <DocUploadSlot
                        label="Master's Degree Transcript *"
                        value={docs.phdMasterTranscript}
                        error={uploadErrors.phdMasterTranscript}
                        disabled={isFormLocked}
                        onUpload={(file) => handleDocUpload('phdMasterTranscript', file)}
                      />
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════
                SECTION G — DECLARATION
            ═══════════════════════════════════════════ */}
            {activeSection === 'G' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">G – Applicant Declaration</h3>

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200/80 text-xs text-gray-600 space-y-3 leading-relaxed">
                  <p>
                    I, <strong>{personal.fullName || '[Full Name]'}</strong>, hereby declare that all the
                    information provided in this application form is true and correct to the best of my
                    knowledge and belief.
                  </p>
                  <p>
                    I understand that any false statement or forged credentials submitted will result in
                    immediate disqualification, nullification of admission, and legal prosecution. I authorize
                    METI Uniport to verify the authenticity of my diplomas, academic certificates, transcripts,
                    and NYSC discharge/exemption slip from the respective issuing bodies.
                  </p>
                </div>

                {/* Signature canvas + preview */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div>
                    <label className={labelCls}>Signature *</label>

                    {/* Draw / Upload toggle */}
                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        disabled={isFormLocked}
                        onClick={() => { setSignatureMode('draw'); clearCanvas(); }}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer ${signatureMode === 'draw' ? 'bg-uniport-blue text-white' : 'bg-gray-100 text-gray-500'}`}
                      >
                        Draw Signature
                      </button>
                      <button
                        type="button"
                        disabled={isFormLocked}
                        onClick={() => { setSignatureMode('upload'); setSignature(null); }}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer ${signatureMode === 'upload' ? 'bg-uniport-blue text-white' : 'bg-gray-100 text-gray-500'}`}
                      >
                        Upload Signature
                      </button>
                    </div>

                    {signatureMode === 'draw' ? (
                      <div className="border border-gray-200 rounded-2xl bg-gray-50 p-2">
                        <p className="text-[10px] text-gray-400 px-1 mb-1">Click and drag (or touch and drag) inside the box below.</p>
                        <canvas
                          ref={canvasRef}
                          width={340}
                          height={150}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          onTouchStart={startDrawing}
                          onTouchMove={draw}
                          onTouchEnd={stopDrawing}
                          className="w-full bg-white rounded-xl cursor-crosshair border border-gray-150"
                          style={{ height: '150px', touchAction: 'none' }}
                        />
                        <button
                          type="button"
                          onClick={clearCanvas}
                          disabled={isFormLocked}
                          className="text-[10px] font-bold text-red-500 hover:text-red-700 mt-2 block cursor-pointer"
                        >
                          Clear Canvas
                        </button>
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-2xl bg-gray-50 p-4">
                        <input
                          ref={sigUploadRef}
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          disabled={isFormLocked}
                          onChange={(e) => handleSignatureUpload(e.target.files[0])}
                          className="text-xs"
                        />
                        <p className="text-[10px] text-gray-400 mt-2">JPG or PNG, max 2MB.</p>
                        {signatureError && <p className="text-[10px] text-red-500 font-bold mt-1">{signatureError}</p>}
                      </div>
                    )}
                  </div>

                  {signature && (
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col items-center">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                        Saved Signature Preview
                      </label>
                      <img src={signature} alt="Signature Preview" className="h-24 bg-white border rounded-lg px-4" />
                    </div>
                  )}
                </div>

                {/* Auto-fill date */}
                <div>
                  <label className={labelCls}>Date</label>
                  <input
                    type="text"
                    value={new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                    readOnly
                    className={`${inputCls} bg-gray-100 cursor-not-allowed`}
                  />
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <label className="flex items-start gap-3 cursor-pointer mb-6">
                    <input
                      type="checkbox"
                      checked={declarationChecked}
                      onChange={() => setDeclarationChecked(!declarationChecked)}
                      disabled={isFormLocked}
                      className="mt-0.5 size-4 rounded border-gray-300 text-uniport-blue focus:ring-uniport-blue"
                    />
                    <span className="text-xs text-gray-500 font-semibold leading-relaxed">
                      I agree with the applicant declaration statements and sign of my own free will.
                    </span>
                  </label>

                  {!isFormLocked && (
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="w-full rounded-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 text-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {submitLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Submit Complete Application</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}

// ── Reusable Document Upload Slot ──
function DocUploadSlot({ label, value, error, disabled, onUpload }) {
  return (
    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs font-bold text-gray-700">{label}</label>
        {value && (
          <span className="text-[10px] text-green-600 font-extrabold bg-green-50 px-2 py-0.5 rounded-full">
            Uploaded
          </span>
        )}
      </div>
      <div className="relative border border-dashed border-gray-300 hover:border-uniport-blue rounded-xl p-4 text-center cursor-pointer transition-colors bg-white">
        <input
          type="file"
          disabled={disabled}
          onChange={(e) => onUpload(e.target.files[0])}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div className="flex items-center gap-2 justify-center text-xs text-gray-500 font-semibold pointer-events-none">
          <FileUp size={16} />
       <span className="truncate max-w-45">{value?.name || 'Select scan file'}</span>
        </div>
      </div>
      {error && <p className="text-[10px] text-red-500 font-bold mt-1">{error}</p>}
    </div>
  );
}
