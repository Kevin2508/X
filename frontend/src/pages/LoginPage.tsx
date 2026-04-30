import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "@/api/axios";
import { useAuth } from "@/context/AuthContext";

interface SignInBody {
  identifier: string;
  password: string;

  user: any;
  token: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      identifier,
      password,
    };

    try {
      const res = await API.post<SignInBody>("/auth/signin", formData);
      const { user, token } = res.data;
      if (!user || !token) {
        setError("Invalid response from server");
        return;
      }
      const result = res;
      console.log(result);
      if (result) {
        setIdentifier("");

        setPassword("");

        login(user, token);
        navigate("/home");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed";
      setError(errorMsg);
      console.error("Login error:", err);
    }
    // const result = await registerUser({user_name:user_name, email:email, password:password});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full items-center">
        {/* Left Section */}
        <div className="hidden md:flex flex-col justify-center">
          <h1 className="text-6xl font-black text-black mb-4 uppercase tracking-wider border-b-4 border-black pb-4">Twitter</h1>
          <p className="text-black text-lg font-bold mt-4">
            💬 Connect with friends and<br/>the world around you.
          </p>
        </div>

        {/* Right Section */}
        <form>
          <Card className="w-full comic-shadow border-2 border-black">
            <CardHeader>
              <CardTitle className="text-2xl uppercase font-black tracking-wider">🔐 SIGN IN</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="font-black uppercase">📧 Enter username or email</Label>
                <Input
                  type="email"
                  placeholder="Enter your username or email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="font-black uppercase">🔒 Password</Label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Forgot Password */}
              <div className="text-right text-sm text-black font-black cursor-pointer hover:underline">
                ❓ Forgot Password?
              </div>

              <Button onClick={handleSubmit} className="w-full comic-btn uppercase font-black">
                LOGIN
              </Button>

              <div className="text-center text-sm text-black font-bold border-t-2 border-black pt-4">
                Don't have an account?{" "}
                <span className="text-black cursor-pointer font-black hover:underline">
                  <Link to={"/register"}>SIGN UP</Link>
                </span>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
