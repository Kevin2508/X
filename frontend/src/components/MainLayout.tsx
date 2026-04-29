import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MobileMenu from './MobileMenu';

interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export default function MainLayout({ children, showSidebar = true }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      {showSidebar && <Sidebar />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col border-l border-gray-700">
        {/* Navbar */}
        <Navbar />

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {children}
        </div>
      </div>

      {/* Right Sidebar (Placeholder for future features) */}
      <div className="hidden lg:block w-72 border-l border-gray-700 p-4">
        <div className="bg-gray-900 rounded-2xl p-4">
          <input
            type="text"
            placeholder="Search X"
            className="w-full bg-gray-800 text-white rounded-full px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu />
    </div>
  );
}
