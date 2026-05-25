import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Phone, Building2, FileCheck, MapPin, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import { SocialAuthBlock, SocialDivider } from '../components/SocialLoginButtons';
import { registerUser } from '../services/api';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
  initialRole?: 'tourist' | 'operator' | 'hotel';
  onAuthChange?: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, initialRole = 'tourist', onAuthChange }) => {
  const [userType, setUserType] = useState<'tourist' | 'operator' | 'hotel'>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    setUserType(initialRole);
  }, [initialRole]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      // Map frontend role names to backend role values
      const roleMap: Record<string, string> = {
        tourist: 'tourist',
        operator: 'tour_operator',
        hotel: 'hotel_partner',
      };

      await registerUser({
        name,
        email,
        password,
        role: roleMap[userType],
        phone: phone || undefined,
      });

      onAuthChange?.();
      onNavigate('home');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStrength = (pw: string) => {
    if (pw.length === 0) return 0;
    let s = 0;
    if (pw.length >= 8) s += 25;
    if (/[A-Z]/.test(pw)) s += 25;
    if (/[0-9]/.test(pw)) s += 25;
    if (/[^A-Za-z0-9]/.test(pw)) s += 25;
    return s;
  };

  const strength = getStrength(password);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white animate-in slide-in-from-right duration-500">
      {/* Left side: Visuals - Tea Plantation */}
      <div className="lg:w-1/3 relative bg-emerald-900 overflow-hidden min-h-[200px] lg:min-h-screen">
        <img
          src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=2070"
          alt="Tea Plantation, Sri Lanka"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 to-sky-900/40" />
        <div className="relative z-10 p-10 flex flex-col justify-center h-full text-white">
          <h1 className="text-4xl font-bold mb-4">Start Your Sri Lankan Adventure</h1>
          <p className="text-lg text-emerald-50 font-light mb-8">Join thousands of travelers and businesses across the lush island.</p>

          <div className="space-y-6 hidden lg:block">
            <FeatureItem title="Discover Curated Tours" desc="Handpicked experiences across the emerald tea plantations." />
            <FeatureItem title="Seamless Booking" desc="Plan your entire itinerary in one place with local partners." />
            <FeatureItem title="Safe & Secure" desc="Certified tour operators and verified hotel partners." />
          </div>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="lg:w-2/3 flex items-center justify-center p-8 lg:p-16">
        <div className="max-w-2xl w-full">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Your Account</h2>
            <p className="text-slate-500">Choose your account type and fill in the details</p>
          </div>

          <div className="flex flex-wrap gap-4 p-1 bg-slate-100 rounded-xl mb-10">
            {(['tourist', 'operator', 'hotel'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setUserType(type)}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${userType === type
                  ? 'bg-white text-sky-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                {type === 'tourist' ? 'Tourist' : type === 'operator' ? 'Tour Operator' : 'Hotel Partner'}
              </button>
            ))}
          </div>

          {userType === 'tourist' && (
            <>
              <SocialAuthBlock stacked={false} onSuccess={() => { onAuthChange?.(); onNavigate('home'); }} />
              <SocialDivider />
            </>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-xl flex items-center gap-3 animate-shake">
              <AlertCircle size={18} className="shrink-0" />
              <span className="font-bold">{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              placeholder="John Perera"
              leftIcon={<User size={18} />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              leftIcon={<Mail size={18} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              helperText="We'll send you a verification email"
            />
            <Input
              label="Phone Number"
              placeholder="+94 7X XXX XXXX"
              leftIcon={<Phone size={18} />}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            {/* Role specific fields */}
            {userType !== 'tourist' && (
              <>
                <Input
                  label={userType === 'operator' ? 'Company Name' : 'Hotel Name'}
                  placeholder="The Paradise Tours"
                  leftIcon={<Building2 size={18} />}
                  required
                />
                <Input
                  label="Business License Number"
                  placeholder="BR-XXXXXX"
                  leftIcon={<FileCheck size={18} />}
                  required
                />
                <Input
                  label="Business Address"
                  placeholder="No. 123, Galle Road, Colombo"
                  leftIcon={<MapPin size={18} />}
                  className="md:col-span-2"
                  required
                />
              </>
            )}

            <div className="space-y-3 md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  leftIcon={<Lock size={18} />}
                  rightElement={
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                  required
                />
                <Input
                  label="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  leftIcon={<Lock size={18} />}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                  <span>Password Strength</span>
                  <span>{strength}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strength < 50 ? 'bg-red-500' : strength < 100 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                    style={{ width: `${strength}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <Checkbox
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                label={
                  <span>I agree to the <a href="#" className="text-sky-600 font-bold hover:underline" onClick={e => e.stopPropagation()}>Terms of Service</a> and <a href="#" className="text-sky-600 font-bold hover:underline" onClick={e => e.stopPropagation()}>Privacy Policy</a></span>
                }
              />
            </div>

            <div className="md:col-span-2 flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
              <Button type="submit" size="lg" className="w-full md:w-auto min-w-[200px]" isLoading={isLoading}>
                Create Account
              </Button>
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <button type="button" onClick={() => onNavigate('login')} className="text-sky-600 font-semibold hover:underline">
                  Sign In
                </button>
              </p>
            </div>
          </form>

          {userType !== 'tourist' && (
            <div className="mt-8 p-4 bg-sky-50 rounded-lg border border-sky-100 flex gap-3">
              <span className="text-sky-600">ℹ️</span>
              <p className="text-xs text-sky-800 leading-relaxed">
                As an Operator/Partner, your account will be reviewed by our admin team before you can list services. We typically approve verified businesses within 24-48 hours.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ title, desc }: { title: string; desc: string }) => (
  <div className="flex gap-4">
    <div className="mt-1 w-5 h-5 rounded-full bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
    </div>
    <div>
      <h3 className="font-semibold text-white text-base">{title}</h3>
      <p className="text-sm text-emerald-200">{desc}</p>
    </div>
  </div>
);

export default RegisterPage;