import { useState } from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { useRouter } from '../context/routerContext';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'otp' | 'password'>('otp');

  const { navigate, goBack } = useRouter();

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!otp || otp.length < 6) {
        setError('Please enter a valid 6-digit code');
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStep('password');
    } catch {
      setError('Invalid OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!newPassword || !confirmPassword) {
        setError('Please fill in all fields');
        return;
      }

      if (newPassword.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Success - redirect to login
      setTimeout(() => {
        navigate('login');
      }, 1500);
    } catch {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={goBack}
            className="mb-4 p-2 hover:bg-gray-900 rounded-full transition-colors inline-block"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="text-4xl font-bold mb-2">𝕏</div>
          <h1 className="text-3xl font-bold mb-2">
            {step === 'otp' ? 'Verify your code' : 'Create new password'}
          </h1>
          <p className="text-gray-500">
            {step === 'otp'
              ? 'Enter the 6-digit code we sent to your email'
              : 'Enter your new password'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={step === 'otp' ? handleVerifyOtp : handleResetPassword} className="space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {step === 'otp' ? (
            <>
              {/* OTP Code */}
              <div>
                <label className="block text-sm font-medium mb-2">Verification Code</label>
                <input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="w-full text-center text-4xl tracking-widest bg-gray-900 border border-gray-700 rounded-lg px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Resend Button */}
              <button type="button" className="text-blue-500 text-sm hover:underline">
                Didn't receive a code? Resend
              </button>
            </>
          ) : (
            <>
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? 'Processing...' : step === 'otp' ? 'Verify code' : 'Reset password'}
          </button>
        </form>
      </div>
    </div>
  );
}
