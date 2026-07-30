import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmissionsStore } from '../store/admissionsStore';
import { FileUp, Landmark, ShieldAlert, CheckCircle, FileText, Loader2, ArrowRight } from 'lucide-react';
import { getCurrentSession } from '../utils/pdfUtils';



const PROG_CODE_MAP = { PGD: 'PGD', Masters: 'MSC', PhD: 'PHD' };

export default function PaymentPage() {
  const navigate = useNavigate();
  const { user, submitPaymentReceipt, admissionCounters } = useAdmissionsStore();

  const [receiptFile, setReceiptFile] = useState(null);
  const [genuineChecked, setGenuineChecked] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

// If user is not logged in or is admin, redirect to login
  if (!user || user.role === 'admin') {
    return (
      <div className="pt-10 pb-24 text-center">
        <p className="text-red-500 font-semibold mb-4">You must be logged in as an applicant to access this page.</p>
        <button onClick={() => navigate('/login')} className="bg-uniport-blue text-white px-4 py-2 rounded-xl">Go to Login</button>
      </div>
    );
  }

  // Payment already verified — block resubmission, which would otherwise
  // silently reset an approved/under-review application back to "Payment Pending".
  if (user.paymentVerified) {
    return (
      <div className="pt-10 pb-24 text-center">
        <p className="text-gray-500 font-semibold mb-4">Your payment has already been verified.</p>
        <button onClick={() => navigate('/dashboard')} className="bg-uniport-blue text-white px-4 py-2 rounded-xl">Go to Dashboard</button>
      </div>
    );
  }

 // Determine program fee
  const program = user.selectedProgram || 'Masters';
  const feeMap = { PGD: '₦35,000', Masters: '₦35,000', PhD: '₦40,000' };
  const programFee = feeMap[program] || '₦35,000';

  // Session shown comes from the admin-set counter for this student's
  // programme — NOT a calendar calculation.
  const sessionCode = PROG_CODE_MAP[program] || 'MSC';
  const currentSession = admissionCounters?.[sessionCode]?.session || getCurrentSession();

  const handleFileChange = (e) => {
    setError('');
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit.');
      return;
    }

    // Validate type (PNG, JPG, PDF)
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only PNG, JPG, or PDF files are accepted.');
      return;
    }

    setReceiptFile(file);
  };

const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!receiptFile) {
      setError('Please upload your payment receipt.');
      return;
    }

    if (!genuineChecked) {
      setError('You must confirm that this payment evidence is genuine.');
      return;
    }

   setUploading(true);
    try {
      await submitPaymentReceipt(receiptFile);
      setUploading(false);
      navigate('/dashboard');
    } catch (err) {
      setUploading(false);
      setError('Upload failed. Please try again.');
    }
  };

  
  return (
    <div className="pt-10 pb-24 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-2 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Bank Details Card */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header info */}
            <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm">
              <span className="text-xs font-bold bg-blue-50 text-uniport-blue px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                Step 5: Payment Details
              </span>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Application Form Sale</h2>
          <p className="text-gray-500 text-lg">
                To purchase the application form for the {currentSession} session, please pay the prescribed fee below.
              </p>
            </div>

            {/* Official bank account details */}
            <div className="bg-uniport-blue text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
              {/* Subtle design block */}
              <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-48 h-48 bg-white/5 rounded-full blur-xl" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className=" ">
                <img src="/images/metilogo1.png" alt="" className={'w-11 bg-white h-11 rounded-full'}/>
                  {/* <Landmark size={24} className="text-blue-200" /> */}
                </div>
                <span className="font-extrabold uppercase text-xs tracking-widest text-blue-200">Official METI Account Details</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-blue-200 uppercase tracking-wider block font-bold">Bank Name</label>
                  <span className="text-lg font-bold">First Bank of Nigeria</span>
                </div>
                <div>
                  <label className="text-[10px] text-blue-200 uppercase tracking-wider block font-bold">Account Name</label>
                  <span className="text-base font-bold leading-tight block">Inst. Of Engineering Technology & Innovation Management (METI)</span>
                </div>
                <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-2">
                  <div>
                    <label className="text-[10px] text-blue-200 uppercase tracking-wider block font-bold">Account Number</label>
                    <span className="text-2xl font-extrabold tracking-wider text-green-300">2016040805</span>
                  </div>
                  <div className="text-right">
                    <label className="text-[10px] text-blue-200 uppercase tracking-wider block font-bold">Application Fee</label>
                    <span className="text-xl font-black">{programFee}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notices */}
            <div className="bg-red-50/50 border  border-red-200 p-6 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-red-700 font-bold text-xl">
                <ShieldAlert size={16} />
                <span>Important Safety Warning</span>
              </div>
              <ul className="list-disc list-inside text-lg font-bold text-red-600 space-y-2 leading-relaxed">
                <li>Input your <span className="font-bold">Full Legal Name</span> as the transaction narration.</li>
                <li>Do not pay twice. Payment validation takes 24–48 hours.</li>
                <li>Submitting false receipts or duplicate bank slips will result in <span className="font-bold">permanent disqualification</span> and report to security agencies.</li>
              </ul>
            </div>
          </div>

          {/* RIGHT: Dropzone Uploader */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-gray-150 shadow-md flex flex-col justify-between">
            <form onSubmit={handlePaymentSubmit} className="space-y-6 flex-1 flex flex-col justify-between">
              
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Upload Receipt</h3>
                <p className="text-xs text-gray-400 mb-6">Accepted formats: PNG, JPG, or PDF. Max file size limit: 5MB.</p>

                {error && <div className="p-3 mb-4 text-xs font-semibold text-red-600 bg-red-50 rounded-xl border border-red-200">{error}</div>}

                {/* Upload Picker Box */}
                <div className="relative border-2 border-dashed border-gray-300 hover:border-uniport-blue bg-gray-50/50 rounded-2xl p-6 text-center cursor-pointer transition-colors">
                  <input
                    type="file"
                    id="receiptInput"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center">
                    <div className="p-3 bg-white text-gray-400 rounded-full shadow-sm mb-3">
                      <FileUp size={24} />
                    </div>
                    <span className="text-xs font-bold text-gray-700">Choose File</span>
                    <span className="text-[10px] text-gray-400 mt-1">or drag & drop slip here</span>
                  </div>
                </div>

                {/* File Preview */}
                {receiptFile && (
                  <div className="mt-4 p-3.5 bg-blue-50/50 border border-blue-200/50 rounded-2xl flex items-center gap-3">
                    <div className="p-2 bg-white text-uniport-blue rounded-xl shadow-sm">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{receiptFile.name}</p>
                      <p className="text-[10px] text-gray-400">{(receiptFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <div className="text-green-500">
                      <CheckCircle size={16} />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirmation check */}
              <div className="mt-8 border-t border-gray-100 pt-6">
                <label className="flex items-start gap-3 cursor-pointer mb-6">
                  <input
                    type="checkbox"
                    checked={genuineChecked}
                    onChange={() => setGenuineChecked(!genuineChecked)}
                    className="mt-0.5 size-4 rounded border-gray-300 text-uniport-blue focus:ring-uniport-blue"
                  />
                  <span className="text-sm text-gray-500 font-medium leading-relaxed">
                    I confirm that this payment evidence is genuine, is for my personal application, and corresponds to the First Bank payment reference.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={uploading || !receiptFile || !genuineChecked}
                  className="w-full rounded-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold py-3.5 text-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Submit Payment Evidence</span><ArrowRight size={16} /></>}
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
