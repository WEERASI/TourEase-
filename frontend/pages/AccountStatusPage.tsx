
import React, { useState } from 'react';
import { 
  Clock, CheckCircle, XCircle, Mail, Phone, 
  ArrowRight, LogOut, Edit3, ShieldCheck, 
  FileText, HelpCircle, LayoutDashboard, RefreshCw
} from 'lucide-react';
import Button from '../components/Button';

interface AccountStatusPageProps {
  onNavigate: (page: string) => void;
  initialStatus?: 'pending' | 'approved' | 'rejected';
}

const AccountStatusPage: React.FC<AccountStatusPageProps> = ({ onNavigate, initialStatus = 'pending' }) => {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>(initialStatus);

  const steps = [
    { id: 1, label: 'Registration', status: 'complete' },
    { id: 2, label: 'Email Verified', status: 'complete' },
    { id: 3, label: 'Review', status: status === 'pending' ? 'current' : status === 'approved' ? 'complete' : 'failed' },
    { id: 4, label: 'Activation', status: status === 'approved' ? 'complete' : 'pending' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 py-12">
      <div className="max-w-2xl w-full">
        {/* Status Card */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden animate-in zoom-in-95 duration-500">
          
          {/* Header Decoration */}
          <div className={`h-2 w-full ${
            status === 'pending' ? 'bg-amber-400' : 
            status === 'approved' ? 'bg-emerald-500' : 'bg-red-500'
          }`} />

          <div className="p-8 lg:p-12 text-center">
            
            {/* Status Icon */}
            <div className="mb-8 flex justify-center">
              {status === 'pending' && (
                <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center animate-pulse">
                  <Clock size={48} />
                </div>
              )}
              {status === 'approved' && (
                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center animate-bounce-short">
                  <CheckCircle size={48} />
                </div>
              )}
              {status === 'rejected' && (
                <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                  <XCircle size={48} />
                </div>
              )}
            </div>

            {/* Status Badge */}
            <div className="mb-4">
              <span className={`
                px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest
                ${status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                  status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                  'bg-red-100 text-red-700'}
              `}>
                {status === 'pending' ? 'Pending Approval' : 
                 status === 'approved' ? 'Account Active' : 
                 'Application Rejected'}
              </span>
            </div>

            {/* Title & Message */}
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              {status === 'pending' && "Your Account is Under Review"}
              {status === 'approved' && "Account Approved!"}
              {status === 'rejected' && "Application Not Approved"}
            </h1>
            
            <p className="text-slate-500 mb-10 leading-relaxed max-w-md mx-auto">
              {status === 'pending' && "Thank you for joining TourEase! Our compliance team is currently verifying your business credentials and documents."}
              {status === 'approved' && "Your account has been fully activated. You can now start listing your services and reaching international travelers."}
              {status === 'rejected' && "Unfortunately, we couldn't approve your application at this time due to inconsistencies in the provided business documents."}
            </p>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-12 max-w-lg mx-auto relative px-2">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-100 -z-10 mx-10" />
              {steps.map((step, idx) => (
                <div key={step.id} className="flex flex-col items-center gap-2 group">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2
                    ${step.status === 'complete' ? 'bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-200' : 
                      step.status === 'current' ? 'bg-white border-sky-500 text-sky-500 ring-4 ring-sky-50' : 
                      step.status === 'failed' ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-200' :
                      'bg-white border-slate-200 text-slate-400'}
                  `}>
                    {step.status === 'complete' ? <CheckCircle size={16} strokeWidth={3} /> : step.id}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    step.status === 'complete' ? 'text-sky-600' : 
                    step.status === 'current' ? 'text-sky-500' : 
                    step.status === 'failed' ? 'text-red-500' : 'text-slate-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Detail Box */}
            <div className="bg-slate-50 rounded-2xl p-6 text-left mb-10 space-y-4 border border-slate-100">
              {status === 'pending' && (
                <>
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <HelpCircle size={18} className="text-sky-500" />
                    What happens next?
                  </h4>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                      <span>Our team will review your submitted business license and tax information.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                      <span>We may contact you via phone or email if further clarification is needed.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                      <span>Verification typically takes <span className="font-bold text-slate-900">24-48 hours</span>.</span>
                    </li>
                  </ul>
                </>
              )}

              {status === 'rejected' && (
                <>
                  <h4 className="font-bold text-red-600 flex items-center gap-2">
                    <ShieldCheck size={18} />
                    Rejection Reason
                  </h4>
                  <p className="text-sm text-slate-600 italic border-l-2 border-red-200 pl-4 py-1">
                    "The business license image provided is blurry and the expiration date is not clearly visible. Please provide a high-resolution scan of your valid SLTDA license."
                  </p>
                </>
              )}

              {status === 'approved' && (
                <div className="flex items-center gap-4 py-2 text-emerald-700">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Verification Complete</p>
                    <p className="text-xs opacity-80">Your business identity has been verified by the TourEase Trust & Safety team.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {status === 'pending' && (
                <>
                  <Button variant="ghost" className="w-full sm:w-auto px-8 rounded-full" leftIcon={<Edit3 size={18} />}>
                    Update Application
                  </Button>
                  <Button variant="danger" className="w-full sm:w-auto px-8 rounded-full bg-slate-800 border-none hover:bg-slate-900" leftIcon={<LogOut size={18} />}>
                    Logout
                  </Button>
                </>
              )}
              {status === 'approved' && (
                <Button 
                  onClick={() => onNavigate('dashboard')}
                  variant="primary" 
                  size="lg" 
                  className="w-full sm:w-auto px-12 rounded-full shadow-lg shadow-sky-200"
                  rightIcon={<LayoutDashboard size={18} />}
                >
                  Go to Dashboard
                </Button>
              )}
              {status === 'rejected' && (
                <>
                  <Button variant="primary" className="w-full sm:w-auto px-8 rounded-full" leftIcon={<RefreshCw size={18} />}>
                    Reapply
                  </Button>
                  <Button variant="ghost" className="w-full sm:w-auto px-8 rounded-full">
                    Contact Support
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Footer Support Info */}
          <div className="bg-slate-50 p-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><Mail size={14} className="text-sky-400" /> support@tourease.lk</span>
              <span className="flex items-center gap-1.5"><Phone size={14} className="text-sky-400" /> +94 11 234 5678</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-emerald-500" /> Secure Business Verification
            </div>
          </div>
        </div>

        {/* Demo Switcher - ONLY FOR PREVIEW PURPOSES */}
        <div className="mt-8 flex justify-center gap-4 opacity-30 hover:opacity-100 transition-opacity">
          <button onClick={() => setStatus('pending')} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-amber-500 underline">Simulate: Pending</button>
          <button onClick={() => setStatus('approved')} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-emerald-500 underline">Simulate: Approved</button>
          <button onClick={() => setStatus('rejected')} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 underline">Simulate: Rejected</button>
        </div>
      </div>
    </div>
  );
};

export default AccountStatusPage;
