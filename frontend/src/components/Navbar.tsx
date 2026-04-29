import { useState } from 'react';
import { Bell, Mail, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  title?: string;
}

export default function Navbar({ title = 'Home' }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-gray-700">
      <div className="flex items-center justify-between px-4 py-3 h-16">
        {/* Left - Title */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>

        {/* Center - Search (hidden on mobile) */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search X"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 text-white rounded-full pl-10 pr-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Right - Icons */}
        <div className="flex-1 flex justify-end items-center gap-4">
          <button className="hover:bg-gray-900 rounded-full p-2 transition-colors">
            <Bell className="h-5 w-5 text-gray-500 hover:text-blue-500" />
          </button>
          <button className="hover:bg-gray-900 rounded-full p-2 transition-colors">
            <Mail className="h-5 w-5 text-gray-500 hover:text-blue-500" />
          </button>
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white border-0"
          >
            Post
          </Button>
        </div>
      </div>
    </nav>
  );
}
