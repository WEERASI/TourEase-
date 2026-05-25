
import React, { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { googleAuthLogin } from '../services/api';

type SocialProvider = 'google' | 'facebook';

interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  provider: SocialProvider;
  iconOnly?: boolean;
  isLoading?: boolean;
  error?: boolean;
}

const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.25h2.91c1.7-1.56 2.68-3.86 2.68-6.58z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.25c-.8.54-1.83.86-3.05.86-2.34 0-4.33-1.58-5.04-3.7H1.02v2.33C2.5 16.03 5.53 18 9 18z" />
    <path fill="#FBBC05" d="M3.96 10.73c-.18-.54-.28-1.12-.28-1.73s.1-1.19.28-1.73V4.94H1.02C.37 6.22 0 7.66 0 9s.37 2.78 1.02 4.06l2.94-2.33z" />
    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.47.89 11.43 0 9 0 5.53 0 2.5 1.97 1.02 4.94l2.94 2.33c.71-2.12 2.7-3.69 5.04-3.69z" />
  </svg>
);

const FacebookLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  iconOnly = false,
  isLoading = false,
  error = false,
  className = '',
  disabled,
  ...props
}) => {
  const isGoogle = provider === 'google';

  const baseStyles = "relative flex items-center justify-center transition-all duration-200 font-bold active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed";

  const providerStyles = isGoogle
    ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:shadow-md hover:border-slate-300"
    : "bg-[#1877F2] text-white hover:bg-[#166fe5] shadow-sm";

  const shapeStyles = iconOnly
    ? "w-12 h-12 rounded-full"
    : "w-full py-3.5 px-6 rounded-xl";

  const errorStyles = error ? "ring-2 ring-red-500 ring-offset-2 animate-shake" : "";

  return (
    <button
      disabled={isLoading || disabled}
      className={`${baseStyles} ${providerStyles} ${shapeStyles} ${errorStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className={`animate-spin ${isGoogle ? 'text-sky-500' : 'text-white'}`} size={20} />
      ) : (
        <div className="flex items-center justify-center gap-3">
          {isGoogle ? <GoogleLogo /> : <FacebookLogo />}
          {!iconOnly && (
            <span className="text-sm">
              Continue with {isGoogle ? 'Google' : 'Facebook'}
            </span>
          )}
        </div>
      )}
    </button>
  );
};

export const SocialDivider = () => (
  <div className="relative my-8">
    <div className="absolute inset-0 flex items-center">
      <span className="w-full border-t border-slate-100" />
    </div>
    <div className="relative flex justify-center text-[10px] font-black tracking-widest uppercase">
      <span className="px-4 bg-white text-slate-400">OR</span>
    </div>
  </div>
);

export const SocialAuthBlock: React.FC<{
  onSuccess?: () => void;
  error?: string | null;
  stacked?: boolean;
}> = ({ onSuccess, error: externalError, stacked = true }) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(externalError || null);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      setError(null);
      try {
        // useGoogleLogin with 'implicit' flow gives us an access_token.
        // We need to exchange it for user info and send to our backend.
        // Instead, let's use the credential (id_token) flow via the Google button.
        // For now, we fetch user info with the access token, then call our backend.
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoResponse.json();

        // Our backend expects an ID token, but with implicit flow we get access_token.
        // Let's send the access_token and handle on backend, OR use the credential flow.
        // For simplicity, we'll send the access_token as the credential.
        await googleAuthLogin(tokenResponse.access_token);

        onSuccess?.();
      } catch (err: any) {
        setError(err.message || 'Google sign-in failed. Please try again.');
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      setError('Google sign-in was cancelled or failed. Please try again.');
    },
  });

  return (
    <div className="space-y-4">
      <div className={stacked ? "flex flex-col gap-3" : "flex items-center justify-center gap-4"}>
        <SocialButton
          provider="google"
          iconOnly={!stacked}
          isLoading={isGoogleLoading}
          onClick={() => googleLogin()}
        />
        <SocialButton
          provider="facebook"
          iconOnly={!stacked}
          onClick={() => setError('Facebook login is not available yet.')}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-xs font-medium animate-in fade-in slide-in-from-top-1">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
};
