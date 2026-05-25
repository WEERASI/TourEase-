
import React, { useState } from 'react';
import { Mail, CheckCircle, XCircle, ArrowRight, RefreshCw, LogIn } from 'lucide-react';
import Button from '../components/Button';

interface VerificationPageProps {
  onNavigate: (page: string) => void;
}

const VerificationPage: React.FC<VerificationPageProps> = ({ onNavigate }) => {
  const [state, setState] = useState<'sent' | 'success' | 'failed'>('sent');
  const [resendTimer, setResendTimer] = useState(0);

  const handleResend = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-neutral-50)]">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 lg:p-12 text-center border border-slate-100">
        {state === 'sent' && (
          <>
            <div className="w-20 h-20 bg-sky-50 text-sky-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
              <Mail size={40} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Verify Your Email</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              We've sent a verification link to <span className="font-semibold text-slate-900">john@example.com</span>. Please check your inbox and click the link to activate your account.
            </p>
            <div className="space-y-4">
              <Button 
                variant="primary" 
                className="w-full" 
                onClick={() => setState('success')}
                rightIcon={<ArrowRight size={18} />}
              >
                Simulation: Mark as Verified
              </Button>
              <div className="pt-6 border-t border-slate-100">
                <p className="text-sm text-slate-500 mb-3">Didn't receive the email?</p>
                <button 
                  onClick={handleResend}
                  disabled={resendTimer > 0}
                  className="flex items-center justify-center gap-2 mx-auto text-sky-600 font-semibold hover:text-sky-700 disabled:text-slate-400 transition-colors"
                >
                  <RefreshCw size={16} className={resendTimer > 0 ? '' : 'animate-spin-once'} />
                  {resendTimer > 0 ? `Resend available in ${resendTimer}s` : 'Resend Verification Email'}
                </button>
              </div>
              <button 
                onClick={() => setState('failed')}
                className="text-xs text-slate-400 hover:text-slate-600 mt-2"
              >
                Simulation: Failed Link
              </button>
            </div>
          </>
        )}

        {state === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-short">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Email Verified!</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Congratulations! Your account has been successfully activated. You can now explore tours and book your next trip.
            </p>
            <div className="p-4 bg-sky-50 rounded-xl mb-8 border border-sky-100 text-left">
              <p className="text-sm text-sky-800 flex gap-3">
                <span className="shrink-0">✨</span>
                <span>Wait list: You're now a TourEase premium member. Welcome to the family!</span>
              </p>
            </div>
            <Button 
              className="w-full" 
              size="lg" 
              onClick={() => onNavigate('login')}
              leftIcon={<LogIn size={18} />}
            >
              Go to Dashboard
            </Button>
          </>
        )}

        {state === 'failed' && (
          <>
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <XCircle size={40} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Verification Failed</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Oops! This verification link is either invalid or has expired. Please request a new link to continue.
            </p>
            <Button 
              className="w-full mb-4" 
              variant="primary"
              onClick={() => setState('sent')}
            >
              Request New Link
            </Button>
            <button 
              onClick={() => onNavigate('register')}
              className="text-slate-500 hover:text-slate-700 text-sm font-medium"
            >
              Back to Registration
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerificationPage;
