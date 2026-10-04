import React, { useState } from 'react';
import { BLANK_FORM_URL } from '../utils/blankForm';
import { CbbcLogo } from './CbbcLogo';
import { OtpService } from '../services/otpService';

interface EmailGateProps {
  onVerified: (email: string, token: string) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EmailGate: React.FC<EmailGateProps> = ({ onVerified }) => {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [ticket, setTicket] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!EMAIL_REGEX.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    const result = await OtpService.requestCode(email.trim(), ticket || undefined);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Failed to send verification code.');
      return;
    }

    setTicket(result.ticket || null);
    setStep('code');
    setInfo(
      result.devCode
        ? `Development mode: your code is ${result.devCode} (Resend is not configured on this server).`
        : `A 6-digit verification code has been sent to ${email.trim()}.`
    );
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!/^\d{6}$/.test(code.trim())) {
      setError('Please enter the 6-digit code from your email.');
      return;
    }

    if (!ticket) {
      setError('No verification code was requested for this email. Please request a new code.');
      setStep('email');
      return;
    }

    setIsSubmitting(true);
    const result = await OtpService.verifyCode(email.trim(), code.trim(), ticket);
    setIsSubmitting(false);

    if (!result.success || !result.token) {
      if (result.ticket) setTicket(result.ticket);
      setError(result.error || 'Verification failed.');
      return;
    }

    onVerified(result.email || email.trim(), result.token);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e8e8e8] px-4">
      <div className="w-full max-w-md bg-white border border-[#1a2744]/20 rounded-lg shadow-xl overflow-hidden">
        <div className="bg-[#1a2744] border-b-2 border-[#c4a56a] px-6 py-6 flex flex-col items-center text-center">
          <CbbcLogo className="w-14 h-14 mb-2" />
          <h1 className="font-['Montserrat'] text-[#c4a56a] text-sm font-bold tracking-[1px]">
            COX'S BAZAR BOAT CLUB LTD.
          </h1>
          <p className="text-white/80 text-[11px] uppercase tracking-wider mt-1">Member Registration Portal</p>
        </div>

        <div className="px-6 py-8">
          {step === 'email' ? (
            <form onSubmit={handleRequestCode}>
              <h2 className="text-[#1a2744] font-bold text-base mb-1">Verify Your Email</h2>
              <p className="text-gray-600 text-[13px] mb-5">
                Enter your email address to receive a one-time verification code before filling out the membership
                application.
              </p>

              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1a2744] mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1a2744] focus:ring-1 focus:ring-[#1a2744]"
              />

              {error && <p className="text-red-600 text-[12px] mt-2">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-5 w-full bg-[#1a2744] hover:bg-[#243a63] disabled:opacity-60 text-white font-bold uppercase tracking-wider text-[12px] py-2.5 rounded cursor-pointer transition-colors"
              >
                {isSubmitting ? 'Sending Code…' : 'Send Verification Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode}>
              <h2 className="text-[#1a2744] font-bold text-base mb-1">Enter Verification Code</h2>
              <p className="text-gray-600 text-[13px] mb-5">
                We've sent a 6-digit code to <strong>{email.trim()}</strong>. Enter it below to continue.
              </p>

              {info && <p className="text-[#0f5132] text-[12px] mb-3 bg-[#e7f5ec] border border-[#0f5132]/20 rounded px-3 py-2">{info}</p>}

              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1a2744] mb-1">
                Verification Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                required
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm tracking-[6px] text-center font-bold focus:outline-none focus:border-[#1a2744] focus:ring-1 focus:ring-[#1a2744]"
              />

              {error && <p className="text-red-600 text-[12px] mt-2">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-5 w-full bg-[#1a2744] hover:bg-[#243a63] disabled:opacity-60 text-white font-bold uppercase tracking-wider text-[12px] py-2.5 rounded cursor-pointer transition-colors"
              >
                {isSubmitting ? 'Verifying…' : 'Verify & Continue'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setCode('');
                  setTicket(null);
                  setError(null);
                  setInfo(null);
                }}
                className="mt-3 w-full text-[#1a2744] text-[11px] uppercase tracking-wider underline cursor-pointer"
              >
                Use a different email
              </button>
            </form>
          )}

          {/* Paper option: no verification needed */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-[11px] text-gray-600 mb-1">Prefer to fill in the form by hand?</p>
            <a
              href={BLANK_FORM_URL}
              download
              className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#1a2744] hover:text-[#9d7f46] underline"
            >
              Download the blank application form (PDF)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
