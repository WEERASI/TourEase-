
import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, ShieldAlert, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

interface ForgotPasswordFlowProps {
  onNavigate: (page: string) => void;
}

const ForgotPasswordFlow: React.FC<ForgotPasswordFlowProps> = ({ onNavigate }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Password successfully changed! Redirecting to login...");
      onNavigate('login');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 overflow-hidden relative">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
          <div 
            className="h-full bg-sky-500 transition-all duration-500" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {step === 1 && (
          <div className="animate-in fade-in duration-500">
            <button 
              onClick={() => onNavigate('login')}
              className="flex items-center gap-2 text-slate-500 hover:text-sky-600 mb-8 transition-colors text-sm font-medium"
            >
              <ArrowLeft size={16} /> Back to Login
            </button>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Forgot Your Password?</h2>
              <p className="text-slate-500">Enter your email and we'll send you a link to reset your password.</p>
            </div>
            <form onSubmit={handleSendLink} className="space-y-6">
              <Input 
                label="Email Address" 
                placeholder="you@example.com" 
                type="email" 
                leftIcon={<Mail size={18} />} 
                required 
                autoFocus
              />
              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Send Reset Link
              </Button>
            </form>
            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <button onClick={() => setStep(3)} className="text-xs text-slate-400 hover:underline">
                Simulation: Skip to Reset Step
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center animate-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Check Your Email</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              We've sent a password reset link to <span className="font-semibold text-slate-900">john@example.com</span>. Please check your inbox and spam folder.
            </p>
            <div className="space-y-4">
              <Button 
                variant="ghost" 
                className="w-full" 
                onClick={() => setStep(1)}
              >
                Resend Email
              </Button>
              <button 
                onClick={() => onNavigate('login')}
                className="text-slate-500 hover:text-slate-900 font-semibold text-sm"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in slide-in-from-right-4 duration-500">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Reset Your Password</h2>
              <p className="text-slate-500">Please enter a new strong password for your account.</p>
            </div>
            <form onSubmit={handleResetPassword} className="space-y-6">
              <Input 
                label="New Password" 
                placeholder="••••••••" 
                type={showPassword ? "text" : "password"} 
                leftIcon={<Lock size={18} />} 
                required
                rightElement={
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
              <Input 
                label="Confirm New Password" 
                placeholder="••••••••" 
                type={showPassword ? "text" : "password"} 
                leftIcon={<Lock size={18} />} 
                required 
              />
              
              <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Requirements</p>
                <div className="space-y-2">
                  <Requirement met={true} text="At least 8 characters" />
                  <Requirement met={true} text="One uppercase letter" />
                  <Requirement met={false} text="One number" />
                  <Requirement met={false} text="One special character" />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Reset Password
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const Requirement = ({ met, text }: { met: boolean; text: string }) => (
  <div className={`flex items-center gap-2 text-xs font-medium ${met ? 'text-green-600' : 'text-slate-400'}`}>
    <div className={`w-1.5 h-1.5 rounded-full ${met ? 'bg-green-500' : 'bg-slate-300'}`} />
    {text}
  </div>
);

export default ForgotPasswordFlow;
