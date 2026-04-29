import { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { useRouter } from '../context/routerContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { navigate, goBack } = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !email.includes('@')) {
        setError('Please enter a valid email');
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmitted(true);
      // Redirect to OTP verification after 2 seconds
      setTimeout(() => {
        navigate('verify-otp', { email });
      }, 1500);
    } catch {
      setError('Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold mb-4">Check your email</h1>
          <p className="text-gray-500 mb-6">
            We've sent a password reset code to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500">Redirecting to verification...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold mb-2">Find your account</h1>
          <p className="text-gray-500">Enter the email associated with your account.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? 'Sending...' : 'Send reset code'}
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <button onClick={() => navigate('login')} className="text-blue-500 hover:underline">
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}
