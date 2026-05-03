import { useAuth } from "@/context/AuthContext";
import { Bell, Home, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MobileBottomNav() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 px-6 py-2 backdrop-blur-md md:hidden">
      <div className="mx-auto flex max-w-sm items-center justify-between">
        <button
          onClick={() => navigate("/home")}
          className="flex flex-col items-center gap-1 rounded-2xl px-4 py-2 text-xs font-medium text-neutral-700"
        >
          <Home size={20} />
          Home
        </button>
        <button
          onClick={() => navigate("/notifications")}
          className="flex flex-col items-center gap-1 rounded-2xl px-4 py-2 text-xs font-medium text-neutral-700"
        >
          <Bell size={20} />
          Alerts
        </button>
        <button
          onClick={() => user?.user_name && navigate(`/profile/${user.user_name}`)}
          className="flex flex-col items-center gap-1 rounded-2xl px-4 py-2 text-xs font-medium text-neutral-700"
        >
          <User size={20} />
          Profile
        </button>
      </div>
    </nav>
  );
}
