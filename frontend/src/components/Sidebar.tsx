import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { Button } from "./ui/button";

export default function Sidebar() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const currentUser = authContext?.user;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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
          if (currentUser?.user_name) {
            navigate(`/profile/${currentUser.user_name}`);
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
      <Button
        onClick={handleLogout}
        className="comic-btn justify-start bg-black text-white mt-4"
        variant="outline"
      >
        LOGOUT
      </Button>
    </div>
  );
}