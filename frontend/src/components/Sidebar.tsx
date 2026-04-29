import type React from 'react';
import { Heart, Home, Mail, Bookmark, Users } from 'lucide-react';
import { useRouter } from '../context/routerContext';
import { useAuth } from '../context/authContext';

const SidebarIcon = ({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ size: number }>;
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-4 px-4 py-3 text-xl rounded-full hover:bg-gray-900 transition-colors w-full"
  >
    <Icon size={24} />
    <span className="hidden lg:inline">{label}</span>
  </button>
);

export default function Sidebar() {
  const { navigate } = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('login');
  };

  return (
    <aside className="w-64 hidden md:flex flex-col border-r border-gray-700 px-2 py-4">
      {/* Logo */}
      <div className="mb-8 px-4">
        <button
          onClick={() => navigate('home')}
          className="text-2xl font-bold hover:opacity-80 transition-opacity"
        >
          𝕏
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <SidebarIcon icon={Home} label="Home" onClick={() => navigate('home')} />
        <SidebarIcon icon={Users} label="Explore" onClick={() => navigate('explore')} />
        <SidebarIcon icon={Mail} label="Messages" />
        <SidebarIcon icon={Bookmark} label="Bookmarks" />
        <SidebarIcon icon={Heart} label="Notifications" onClick={() => navigate('notifications')} />
      </nav>

      {/* Post Button and User Menu */}
      <div className="space-y-4 border-t border-gray-700 pt-4">
        <button className="w-full bg-blue-600 text-white rounded-full py-3 text-lg font-bold hover:bg-blue-700 transition-colors">
          Post
        </button>

        <div
          onClick={handleLogout}
          className="p-3 rounded-full hover:bg-gray-900 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="hidden lg:flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-700 rounded-full" />
              <div className="text-sm">
                <p className="font-bold">Your Name</p>
                <p className="text-gray-500">@yourhandle</p>
              </div>
            </div>
            <div className="text-red-500 text-sm font-bold">Logout</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
