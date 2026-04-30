import "./App.css";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import  RegisterPage  from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./routes/protectedRoutes";

function App() {
  return (
        <>
        <BrowserRouter>
        <AuthProvider>
      <Routes>
        <Route path="/" element={<ProtectedRoute><HomePage/></ProtectedRoute>}/>
        <Route path="/home" element={<ProtectedRoute><HomePage/></ProtectedRoute>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
        </>
     
  );
}

export default App;
