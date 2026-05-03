import { useAuth } from '@/context/AuthContext';
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Bell, Home, LogOut, User } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Use the hook instead

  const handleLogout = () => {
    logout();
    // Redirect to login happens automatically via ProtectedRoute
  };

  return (
    <aside className="sticky top-0 flex h-screen flex-col gap-2 border-r border-neutral-200 bg-white p-4">
      <button
        onClick={() => navigate("/home")}
        className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-950 text-lg font-semibold text-white"
        aria-label="Go home"
      >
        X
      </button>
      <Button
        onClick={() => navigate("/home")}
        className="h-11 justify-start gap-3 px-4"
        variant="ghost"
      >
        <Home size={18} />
        Home
      </Button>
      <Button
        onClick={() => {
          if (user?.user_name) {
            navigate(`/profile/${user.user_name}`);
          }
        }}
        className="h-11 justify-start gap-3 px-4"
        variant="ghost"
      >
        <User size={18} />
        Profile
      </Button>
      <Button
        onClick={() => navigate("/notifications")}
        className="h-11 justify-start gap-3 px-4"
        variant="ghost"
      >
        <Bell size={18} />
        Notifications
      </Button>
      <div className="mt-auto space-y-3">
        {user && (
          <div className="rounded-2xl border border-neutral-200 p-3">
            <p className="truncate text-sm font-semibold">{user.display_name || user.user_name}</p>
            <p className="truncate text-xs text-neutral-500">@{user.user_name}</p>
          </div>
        )}
        <Button
          onClick={handleLogout}
          className="w-full justify-start gap-3 px-4"
          variant="outline"
        >
          <LogOut size={18} />
          Log out
        </Button>
      </div>
    </aside>
  );
}
