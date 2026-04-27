import React from "react";
import { cn } from "@/lib/utils";
import { Home, LayoutDashboard, Link, Settings } from "lucide-react";

type NavItem = { href: string; label: string; icon?: React.ReactNode };

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { href: "/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
];

export function Sidebar({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        aria-label="Toggle menu"
        onClick={() => setOpen((v) => !v)}
        className="md:hidden p-2 m-2 rounded bg-black text-white"
      >
        {open ? "Close" : "Menu"}
      </button>

      {/* Overlay for mobile when open */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-20 transition-opacity md:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      <aside
        className={cn(
          "fixed top-0 left-0 h-full z-30 w-64 bg-black text-white transform transition-transform",
          // visible on md and up; slide in/out on mobile
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className
        )}
      >
        <div className="h-16 flex items-center px-4 border-b border-white/10">
          <span className="font-semibold text-lg">App Name</span>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/10 transition-colors"
              onClick={() => setOpen(false)}
            >
              {item.icon && <span className="w-5 h-5 text-white">{item.icon}</span>}
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto p-4 border-t border-white/10">
          <button className="w-full text-left px-3 py-2 rounded hover:bg-white/10">
            Log out
          </button>
        </div>
      </aside>

      {/* Page content spacer for md+ so content isn't hidden */}
      <div className="md:pl-64" />
    </>
  );
}

export default Sidebar;
