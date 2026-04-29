import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useRouter } from '../context/routerContext';
import { useAuth } from '../context/authContext';

type Page = 'login' | 'signup' | 'forgot-password' | 'verify-otp' | 'home' | 'profile' | 'notifications' | 'post-detail' | 'explore';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { navigate } = useRouter();
  const { logout } = useAuth();

  const handleNavigation = (page: Page) => {
    navigate(page);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleNavigation('login');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg z-50"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)}>
          <div
            className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-700 rounded-t-2xl p-4 max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-2">
              <button
                onClick={() => handleNavigation('home')}
                className="w-full text-left px-4 py-3 hover:bg-gray-900 rounded-lg transition-colors text-white font-medium"
              >
                🏠 Home
              </button>
              <button
                onClick={() => handleNavigation('explore')}
                className="w-full text-left px-4 py-3 hover:bg-gray-900 rounded-lg transition-colors text-white font-medium"
              >
                🔍 Explore
              </button>
              <button
                onClick={() => handleNavigation('notifications')}
                className="w-full text-left px-4 py-3 hover:bg-gray-900 rounded-lg transition-colors text-white font-medium"
              >
                🔔 Notifications
              </button>
              <button
                onClick={() => handleNavigation('profile')}
                className="w-full text-left px-4 py-3 hover:bg-gray-900 rounded-lg transition-colors text-white font-medium"
              >
                👤 Profile
              </button>
              <div className="border-t border-gray-700 my-2" />
              <button
                onClick={() => handleNavigation('login')}
                className="w-full text-left px-4 py-3 hover:bg-gray-900 rounded-lg transition-colors text-red-500 font-medium"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
