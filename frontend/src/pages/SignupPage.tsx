import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useRouter } from '../context/routerContext';
import { useAuth } from '../context/authContext';

export default function SignupPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { navigate } = useRouter();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.displayName) {
      setError('Please fill in all fields');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setStep(2);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate
      if (!formData.username || !formData.password) {
        setError('Please fill in all fields');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Login user
      const user = {
        user_id: Math.floor(Math.random() * 10000),
        user_name: formData.username,
        email: formData.email,
        display_name: formData.displayName,
        profile_image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`,
      };
      login(user);
      navigate('home');
    } catch {
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="mb-4 p-2 hover:bg-gray-900 rounded-full transition-colors inline-block"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="text-4xl font-bold mb-2">𝕏</div>
          <h1 className="text-3xl font-bold">
            {step === 1 ? 'Create your account' : 'Set your password'}
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={step === 1 ? handleStep1 : handleSignup} className="space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            <>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-500" size={20} />
                  <input
                    type="text"
                    name="displayName"
                    placeholder="John Doe"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Username */}
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">@</span>
                  <input
                    type="text"
                    name="username"
                    placeholder="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-8 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-10 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-400"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-10 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-400"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? 'Creating account...' : step === 1 ? 'Next' : 'Create account'}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-500">
            Already have an account?{' '}
            <button onClick={() => navigate('login')} className="text-blue-500 hover:underline">
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
