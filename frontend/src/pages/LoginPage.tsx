import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useRouter } from '../context/routerContext';
import { useAuth } from '../context/authContext';
import { dummyUsers } from '../lib/dummyData';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { navigate } = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Demo: Accept any email/password, login with first dummy user
      if (email && password) {
        const user = {
          user_id: dummyUsers[0].user_id,
          user_name: dummyUsers[0].user_name,
          email: dummyUsers[0].email,
          display_name: dummyUsers[0].display_name,
          profile_image: dummyUsers[0].profile_image,
        };
        login(user);
        navigate('home');
      } else {
        setError('Please fill in all fields');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="text-4xl font-bold mb-2">𝕏</div>
          <h1 className="text-3xl font-bold">Welcome back</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <label className="block text-sm font-medium mb-2">Email</label>
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

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>

          {/* Forgot Password Link */}
          <button
            type="button"
            onClick={() => navigate('forgot-password')}
            className="text-blue-500 text-sm hover:underline"
          >
            Forgot password?
          </button>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-700" />
          <span className="text-gray-500 text-sm">Don't have an account?</span>
          <div className="flex-1 h-px bg-gray-700" />
        </div>

        {/* Sign Up Link */}
        <button
          onClick={() => navigate('signup')}
          className="w-full border border-gray-700 text-blue-500 font-bold py-3 rounded-full hover:bg-gray-900/50 transition-colors"
        >
          Create account
        </button>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-gray-900 rounded-lg text-center text-sm text-gray-400">
          <p>Demo: Use any email & password to login</p>
        </div>
      </div>
    </div>
  );
}
