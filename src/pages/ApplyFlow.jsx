// FILE: ApplyFlow.jsx
// DEPENDENCIES: react, react-router-dom, framer-motion, ../store/admissionsStore, ../components/Stepper

import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdmissionsStore } from '../store/admissionsStore';
import Stepper, { Step } from '../components/Stepper';
import { ClipboardList, ShieldAlert, FileText } from 'lucide-react';

// SOURCE OF TRUTH: course data with programmes filter
// PGD only has 1 course (eitm). All others are msc+phd.
const COURSES = [
  {
    slug: 'eitm',
    name: 'Engineering Innovation & Technology Management',
    description: 'Technology strategy, innovation frameworks, and engineering project management.',
    programmes: ['pgd', 'msc', 'phd']
  },
  {
    slug: 'sctm',
    name: 'Supply Chain Technology Management',
    description: 'Technology-driven supply chain optimisation and digital logistics.',
    programmes: ['msc', 'phd']
  },
  {
    slug: 'isptm',
    name: 'Industrial Systems & Process Technology Management',
    description: 'Industrial automation, process engineering, and systems thinking.',
    programmes: ['msc', 'phd']
  },
  {
    slug: 'pmtm',
    name: 'Production & Manufacturing Technology Management',
    description: 'Lean systems, quality control, and production planning.',
    programmes: ['msc', 'phd']
  },
  {
    slug: 'aiam',
    name: 'Artificial Intelligence & Automation Management',
    description: 'AI systems deployment, automation strategy, and emerging technology governance.',
    programmes: ['msc', 'phd']
  },
  {
    slug: 'etm',
    name: 'Energy Technology Management',
    description: 'Energy systems, sustainable technology management, and energy policy frameworks.',
    programmes: ['msc', 'phd']
  },
];

const PROGRAM_DETAILS = {
  PGD: {
    name: 'Postgraduate Diploma (PGD)',
    duration: 'Full-Time: 12–24 months | Part-Time: 24–36 months',
    fee: '₦35,000',
    requirementsSummary: "Candidates shall possess a Higher National Diploma (HND) or a Third-Class Bachelor’s Degree B.Eng, B.Tech, or B.Sc. in an Engineering discipline or the Pure and Applied science from a recognised university.",
  },
  Masters: {
    name: 'Master of Science (MSc)',
    duration: 'Full-Time: 12–24 months | Part-Time: 24–36 months',
    fee: '₦35,000',
    requirementsSummary: "Bachelor's degree in engineering/science with a minimum of Second Class Lower, or PGD in engineering/METI with CGPA of 3.5/5.0.",
  },
  PhD: {
    name: 'Doctor of Philosophy (PhD)',
    duration: 'Full-Time: 36–48 months | Part-Time: 36–60 months',
    fee: '₦40,000',
    requirementsSummary: "Master's degree in engineering/science or hold a degree from any METI programme with a minimum CGPA of 3.5 (on a 5.0 scale).",
  },
};

// Pill button class helper — mirrors Stepper's own default button classes
// (flex/items-center/rounded-full/blue theme) since nextButtonProps.className
// fully REPLACES Stepper's className rather than merging with it.
const pillBtn = (disabled) =>
  `duration-350 flex items-center justify-center rounded-full py-2.5 px-6 font-semibold tracking-tight transition text-sm ${
    disabled
      ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70 pointer-events-none'
      : 'bg-uniport-blue hover:bg-blue-800 active:bg-blue-900 text-white cursor-pointer'
  }`;

export default function ApplyFlow() {
  const navigate = useNavigate();
  
const {
    user,
    selectedProgram,
    selectedSpecialization,
    selectProgram,
    setEligibility,
    setReadiness,
  } = useAdmissionsStore();

useEffect(() => {
    if (!user || user.role === 'admin') {
      navigate('/login');
      return;
    }
    useAdmissionsStore.getState().fetchExistingApplications();
  }, [user, navigate]);

  const [activeStep, setActiveStep] = useState(1);

  // Get filtered courses based on selected programme
  const getFilteredCourses = (prog) => {
    if (!prog) return COURSES;
    const key = prog.toLowerCase() === 'masters' ? 'msc' : prog.toLowerCase();
    return COURSES.filter((c) => c.programmes.includes(key));
  };

  const filteredCourses = getFilteredCourses(selectedProgram);
  const defaultSpec = filteredCourses[0]?.name || '';

  const [tempSpec, setTempSpec] = useState(selectedSpecialization || defaultSpec);

  // Eligibility state
  const [pgdChecks, setPgdChecks] = useState({ degree: false, class: false, truthful: false });
  const [mastersChecks, setMastersChecks] = useState({ degree: false, cgpa: false, truthful: false });
  const [phdChecks, setPhdChecks] = useState({ master: false, cgpa: false, truthful: false });

  // Document readiness state
  const [docChecks, setDocChecks] = useState({
    degreeCert: false,
    transcript: false,
    birth: false,
    passport: false,
    // id: false,
    referees: false,
    nysc: false,
    phdMasterCert: false,
    phdMasterTranscript: false,
  });

  // Validations
  const isStep1Valid = selectedProgram !== null && tempSpec !== '';

  const getStep2Validity = () => {
    if (selectedProgram === 'PGD') return pgdChecks.degree && pgdChecks.class && pgdChecks.truthful;
    if (selectedProgram === 'Masters') return mastersChecks.degree && mastersChecks.cgpa && mastersChecks.truthful;
    if (selectedProgram === 'PhD') return phdChecks.master && phdChecks.cgpa && phdChecks.truthful;
    return false;
  };
  const isStep2Valid = getStep2Validity();

  const getStep3Validity = () => {
    const common =
      docChecks.degreeCert &&
      docChecks.transcript &&
      docChecks.birth &&
      docChecks.passport &&
      // docChecks.id &&
      docChecks.referees &&
      docChecks.nysc;
    if (selectedProgram === 'PhD') {
      return common && docChecks.phdMasterCert && docChecks.phdMasterTranscript;
    }
    return common;
  };
  const isStep3Valid = getStep3Validity();

  const getNextBtnState = () => {
    if (activeStep === 1) return { disabled: !isStep1Valid, className: pillBtn(!isStep1Valid) };
    if (activeStep === 2) return { disabled: !isStep2Valid, className: pillBtn(!isStep2Valid) };
    if (activeStep === 3) return { disabled: !isStep3Valid, className: pillBtn(!isStep3Valid) };
    return {};
  };

const handleProgramClick = (progKey) => {
    const courses = getFilteredCourses(progKey);
    const firstSpec = courses[0]?.name || '';
    setTempSpec(firstSpec);
    selectProgram(progKey, firstSpec);
  };

  // Warns immediately if this exact programme+specialization combo is
  // already held — before the student invests time in eligibility/docs
  // steps, rather than letting the database reject it at the very end.
  const checkForDuplicate = (progKey, spec) => {
    const existing = (useAdmissionsStore.getState().existingApplications || [])
      .find(a => a.selectedProgram === progKey && a.specialization === spec);
    return existing || null;
  };

  const handleSpecChange = (e) => {
    const spec = e.target.value;
    setTempSpec(spec);
    if (selectedProgram) {
      selectProgram(selectedProgram, spec);
    }
  };

  const handleStep2CheckboxChange = (key) => {
    if (selectedProgram === 'PGD') {
      const updated = { ...pgdChecks, [key]: !pgdChecks[key] };
      setPgdChecks(updated);
      setEligibility(updated.degree && updated.class && updated.truthful);
    } else if (selectedProgram === 'Masters') {
      const updated = { ...mastersChecks, [key]: !mastersChecks[key] };
      setMastersChecks(updated);
      setEligibility(updated.degree && updated.cgpa && updated.truthful);
    } else if (selectedProgram === 'PhD') {
      const updated = { ...phdChecks, [key]: !phdChecks[key] };
      setPhdChecks(updated);
      setEligibility(updated.master && updated.cgpa && updated.truthful);
    }
  };

  const handleDocCheckboxChange = (key) => {
    const updated = { ...docChecks, [key]: !docChecks[key] };
    setDocChecks(updated);
    const common =
      updated.degreeCert &&
      updated.transcript &&
      updated.birth &&
      updated.passport &&
      // updated.id &&
      updated.referees &&
      updated.nysc;
    let complete = false;
    if (selectedProgram === 'PhD') {
      complete = common && updated.phdMasterCert && updated.phdMasterTranscript;
    } else {
      complete = common;
    }
    setReadiness(complete);
  };

  return (
    <div className="pt-4 pb-24 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
            Postgraduate Admissions
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
            Complete the eligibility checks below to begin your academic application.
          </p>
        </div>

        <Stepper
          initialStep={1}
          onStepChange={(step) => setActiveStep(step)}
       onFinalStepCompleted={async () => {
            try {
              await useAdmissionsStore.getState().commitApplyFlowToUser();
              navigate('/payment');
            } catch (err) {
              alert(err.message || 'Could not save your application details. Please try again.');
            }
          }}
nextButtonText={activeStep === 3 ? 'Continue to Payment' : 'Proceed'}
          backButtonText="Back"
          disableStepIndicators={true}
          nextButtonProps={getNextBtnState()}
          beforeStepChange={(fromStep) => {
            if (fromStep === 1) {
              const dup = checkForDuplicate(selectedProgram, tempSpec);
              if (dup) {
                const goToExisting = window.confirm(
                  `You already have an active ${selectedProgram} application in ${tempSpec}. Press OK to view it, or Cancel to pick a different programme.`
                );
                if (goToExisting) {
                  navigate('/dashboard');
                }
                return false; // block advancing either way — they must resolve this first
              }
            }
            return true;
          }}
          stepCircleContainerClassName="shadow-lg border border-gray-150 p-2"
        >
          {/* ── STEP 1: PROGRAMME SELECTION ── */}
          <Step>
            <div className="p-2">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <ClipboardList className="text-uniport-blue" />
                Select Academic Programme
              </h2>


              
              <p className="text-gray-500 text-sm mb-6">
                Choose the study track and engineering management specialization.
              </p>

              {/* Programme Cards — 1 col mobile, 3 col desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {Object.entries(PROGRAM_DETAILS).map(([key, details]) => {
                  const isSelected = selectedProgram === key;
                  return (
                    <div
                      key={key}
                      onClick={() => handleProgramClick(key)}
                      className={`cursor-pointer p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-uniport-blue bg-blue-50/20 shadow-md ring-2 ring-uniport-blue/30'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              isSelected ? 'bg-uniport-blue text-white' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {key}
                          </span>
                          <span className="text-sm font-extrabold text-gray-900">{details.fee}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-base mb-1">{details.name}</h3>
                        <p className="text-gray-400 text-xs line-clamp-3 mb-4">
                          {details.requirementsSummary}
                        </p>
                      </div>
                      <div className="text-[10px] font-semibold text-gray-500 border-t pt-3 border-gray-100">
                        {details.duration}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Specialization — filtered by selected programme */}
              {selectedProgram && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-4 rounded-2xl border border-gray-150 shadow-sm"
                >
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Choose Area of Specialization
                    {selectedProgram === 'PGD' && (
                      <span className="ml-2 text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        1 course available for PGD
                      </span>
                    )}
                  </label>
                  {filteredCourses.length === 1 ? (
                    // PGD: show as read-only badge, not a dropdown
                    <div className="w-full bg-blue-50 border border-uniport-blue/30 rounded-xl px-4 py-3 text-sm font-semibold text-uniport-blue">
                      {filteredCourses[0].name}
                      <p className="text-xs text-gray-500 font-normal mt-1">
                        {filteredCourses[0].description}
                      </p>
                    </div>
                  ) : (
                    <select
                      value={tempSpec}
                      onChange={handleSpecChange}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-uniport-blue"
                    >
                      {filteredCourses.map((c) => (
                        <option key={c.slug} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  )}
                </motion.div>
              )}

              {!selectedProgram && (
                <p className="text-center text-xs text-gray-400 mt-4">
                  ↑ Select a programme above to see available specializations
                </p>
              )}
            </div>
          </Step>

          {/* ── STEP 2: ELIGIBILITY ── */}
          <Step>
            <div className="p-2">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <ShieldAlert className="text-uniport-blue" />
                Eligibility Self-Verification
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Please verify that you meet the minimum academic credentials for the{' '}
                <span className="font-bold text-gray-900">{selectedProgram}</span> programme.
              </p>

              <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-4">
                {selectedProgram === 'PGD' && (
                  <>
                    <CheckItem
                      checked={pgdChecks.degree}
                      onChange={() => handleStep2CheckboxChange('degree')}
                      label="I possess a Bachelor's Degree (B.Eng., B.Tech., or B.Sc.) in an Engineering discipline or Pure and Applied Science discipline from an approved university."
                    />
                    <CheckItem
                      checked={pgdChecks.class}
                      onChange={() => handleStep2CheckboxChange('class')}
                      label="I have at least a Third Class degree, OR a minimum of Second Class Lower if my degree is from an unrelated science discipline."
                    />
                  </>
                )}

                {selectedProgram === 'Masters' && (
                  <>
                    <CheckItem
                      checked={mastersChecks.degree}
                      onChange={() => handleStep2CheckboxChange('degree')}
                      label="I possess a Bachelor's Degree in Engineering or Pure and Applied sciences with at least Second Class Lower Division, OR I hold a Postgraduate Diploma (PGD) in Engineering with a minimum CGPA of 3.5/5.0."
                    />
                    <CheckItem
                      checked={mastersChecks.cgpa}
                      onChange={() => handleStep2CheckboxChange('cgpa')}
                      label="My Cumulative Grade Point Average fits the minimum entry threshold."
                    />
                  </>
                )}

                {selectedProgram === 'PhD' && (
                  <>
                    <CheckItem
                      checked={phdChecks.master}
                      onChange={() => handleStep2CheckboxChange('master')}
                      label="I possess a Master's degree (M.Eng., M.Tech., or MSc.) in a relevant Engineering or Pure and Applied Science discipline."
                    />
                    <CheckItem
                      checked={phdChecks.cgpa}
                      onChange={() => handleStep2CheckboxChange('cgpa')}
                      label="I achieved a minimum Cumulative Grade Point Average of 3.5 on a 5.0 scale in my Master's programme."
                    />
                  </>
                )}

                <label className="flex items-start gap-3 cursor-pointer border-t pt-4 border-gray-100">
                  <input
                    type="checkbox"
                    checked={
                      selectedProgram === 'PGD'
                        ? pgdChecks.truthful
                        : selectedProgram === 'Masters'
                        ? mastersChecks.truthful
                        : phdChecks.truthful
                    }
                    onChange={() => handleStep2CheckboxChange('truthful')}
                    className="mt-1 size-4 rounded border-gray-300 text-uniport-blue focus:ring-uniport-blue"
                  />
                  <span className="text-sm text-red-600 font-medium">
                    I understand that providing false information during application self-checks will
                    result in automatic disqualification and forfeiture of application fees.
                  </span>
                </label>
              </div>
            </div>
          </Step>

          {/* ── STEP 3: DOCUMENT READINESS ── */}
          <Step>
            <div className="p-2">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FileText className="text-uniport-blue" />
                Document Readiness Check
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Verify that you have scans of the following credentials ready for upload during the
                final stage.
              </p>

              <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-4">
                {[
                  { key: 'degreeCert', label: "First Degree Certificate (or statement of results)." },
                  { key: 'transcript', label: 'First degree Official Academic Transcript (requested and sent to METI office).' },
                  { key: 'birth', label: 'Birth Certificate or Declaration of Age.' },
                  { key: 'passport', label: 'Recent Passport Photograph (with plain white background, JPG format).' },
                  // {
                  //   key: 'id',
                  //   label:
                  //     'Valid Identification (National ID card, Voter\'s Card, Driver\'s License or International Passport).',
                  // },
                  {
                    key: 'referees',
                    label: 'Two Academic Reference Letters from lecturers/professors.',
                  },
                  {
                    key: 'nysc',
                    label: 'NYSC Discharge Certificate or Exemption Letter.',
                  },
                ].map((item) => (
                  <CheckItem
                    key={item.key}
                    checked={docChecks[item.key]}
                    onChange={() => handleDocCheckboxChange(item.key)}
                    label={item.label}
                  />
                ))}

                {selectedProgram === 'PhD' && (
                  <div className="  space-y-4 ">
                    {/* <span className="text-xs font-bold text-[#1a4fa0] uppercase tracking-wider block">
                      PhD Additional Uploads
                    </span> */}
                    <CheckItem
                      checked={docChecks.phdMasterCert}
                      onChange={() => handleDocCheckboxChange('phdMasterCert')}
                      label="Master's Degree Certificate."
                    />
                    <CheckItem
                      checked={docChecks.phdMasterTranscript}
                      onChange={() => handleDocCheckboxChange('phdMasterTranscript')}
                      label="Master's Degree Academic Transcript."
                    />
                  </div>
                )}
              </div>
            </div>
          </Step>
        </Stepper>
      </div>
    </div>
  );
}

function CheckItem({ checked, onChange, label }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1 size-4 rounded border-gray-300 text-uniport-blue focus:ring-uniport-blue shrink-0"
      />
      <span className="text-sm text-gray-600">{label}</span>
    </label>
  );
}
