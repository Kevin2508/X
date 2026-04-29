import { useEffect, useState } from "react";
import "./App.css";
import Splash from "./pages/Splash";
import { AuthProvider } from "./context/authContext";
import { RouterProvider, useRouter } from "./context/routerContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import PostDetailPage from "./pages/PostDetailPage";
import { useAuth } from "./context/authContext";

function AppContent() {
  const [loading, setLoading] = useState(true);
  const { currentPage } = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Simulate startup tasks
    const init = async () => {
      await new Promise(res => setTimeout(res, 1000));
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return <Splash />;
  }

  // If not authenticated, show auth pages
  if (!isAuthenticated) {
    switch (currentPage) {
      case 'signup':
        return <SignupPage />;
      case 'forgot-password':
        return <ForgotPasswordPage />;
      case 'verify-otp':
        return <VerifyOtpPage />;
      default:
        return <LoginPage />;
    }
  }

  // If authenticated, show main app pages
  switch (currentPage) {
    case 'profile':
      return <ProfilePage />;
    case 'notifications':
      return <NotificationsPage />;
    case 'post-detail':
      return <PostDetailPage />;
    case 'explore':
      return <ExplorePage />;
    case 'home':
    default:
      return <HomePage />;
  }
}

function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </RouterProvider>
  );
}

export default App;
