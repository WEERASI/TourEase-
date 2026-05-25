import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import { SocialAuthBlock, SocialDivider } from '../components/SocialLoginButtons';
import { loginUser } from '../services/api';

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onAuthChange?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onAuthChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email || !password) {
      setIsLoading(false);
      setError('Please fill in both email and password fields.');
      return;
    }

    try {
      const response = await loginUser(email, password);

      if (rememberMe) {
        localStorage.setItem('rememberUser', 'true');
      }

      onAuthChange?.();

      // Role-based routing
      const userRole = response?.user?.role;
      switch (userRole) {
        case 'tour_operator':
          onNavigate('operator-dashboard');
          break;
        case 'hotel_partner':
          onNavigate('hotel-dashboard');
          break;
        case 'admin':
          onNavigate('admin-dashboard');
          break;
        default:
          onNavigate('home');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left side: Visuals - Nine Arch Bridge */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-900">
        <img
          src="https://images.unsplash.com/photo-1578519050142-afb511e518de?q=80&w=1200&auto=format&fit=crop"
          alt="Nine Arch Bridge, Ella"
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 transition-transform duration-[10s] hover:scale-100"
        />
        {/* Lighter, more transparent gradient to show forest and bridge details */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent" />

        <div className="relative z-10 p-16 flex flex-col justify-end h-full text-white max-w-2xl">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
            <h1
              className="text-5xl font-black mb-6 leading-tight tracking-tight"
              style={{ textShadow: '2px 2px 12px rgba(0,0,0,0.4)' }}
            >
              Journey Through <br />
              <span className="text-sky-300">Ceylon's Tea Country</span>
            </h1>
            <p className="text-xl text-white font-medium opacity-90 leading-relaxed max-w-lg">
              Experience the world's most scenic railway through misty mountains with TourEase.
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white">
        <div className="max-w-md w-full animate-in fade-in zoom-in-95 duration-700">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome Back!</h2>
            <p className="text-slate-500 font-medium">Sign in to continue your island journey</p>
          </div>

          <SocialAuthBlock onSuccess={() => {
            onAuthChange?.();
            // Role-based routing for Google OAuth
            try {
              const stored = localStorage.getItem('user');
              const user = stored ? JSON.parse(stored) : null;
              const role = user?.role;
              switch (role) {
                case 'tour_operator': onNavigate('operator-dashboard'); break;
                case 'hotel_partner': onNavigate('hotel-dashboard'); break;
                case 'admin': onNavigate('admin-dashboard'); break;
                default: onNavigate('home');
              }
            } catch {
              onNavigate('home');
            }
          }} />
          <SocialDivider />

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-xl flex items-center gap-3 animate-shake">
              <AlertCircle size={18} className="shrink-0" />
              <span className="font-bold">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Email Address"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              leftIcon={<Mail size={18} className="text-slate-400" />}
              autoFocus
              className="group"
            />

            <div className="space-y-1">
              <Input
                label="Password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                leftIcon={<Lock size={18} className="text-slate-400" />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-sky-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
              <div className="flex justify-between items-center mt-4 px-1">
                <Checkbox
                  label="Remember Me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <button type="button" className="text-sm font-bold text-sky-600 hover:underline hover:text-sky-700 transition-colors">Forgot Password?</button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl text-lg font-black" size="lg" isLoading={isLoading}>
              Sign In to Your Account
            </Button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-10 font-medium">
            Don't have an account?{' '}
            <button onClick={() => onNavigate('role-selection')} className="text-sky-600 font-bold hover:underline hover:text-sky-700 transition-colors">
              Sign Up Now
            </button>
          </p>

          <div className="mt-12 flex items-center justify-center gap-4 text-slate-300">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Secure 256-bit SSL Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;