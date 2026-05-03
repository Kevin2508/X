import { useAuth } from '@/context/AuthContext';
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Use the hook instead

  const handleLogout = () => {
    logout();
    // Redirect to login happens automatically via ProtectedRoute
  };

  return (
    <div className="flex flex-col gap-2 p-4 border-r-2 border-black sticky top-0 h-screen">
      <h1 className="text-3xl font-black uppercase tracking-wider border-b-2 border-black pb-3 mb-2">
        X
      </h1>
      <Button
        onClick={() => navigate("/")}
        className="comic-btn justify-start"
        variant="outline"
      >
        HOME
      </Button>
      <Button
        onClick={() => {
          if (user?.user_name) {
            navigate(`/profile/${user.user_name}`);
          }
        }}
        className="comic-btn justify-start"
        variant="outline"
      >
        PROFILE
      </Button>
      <Button className="comic-btn justify-start" variant="outline">
        NOTIFICATIONS
      </Button>
      <div className="mt-auto">
        <Button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
          variant="outline"
        >
          LOGOUT
        </Button>
      </div>
    </div>
  );
}