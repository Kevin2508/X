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
import { isAxiosError } from "axios";

interface SignInResponse {
  user: {
    user_id: number;
    user_name: string;
    email: string;
    display_name: string;
    profile_image?: string;
    cover_image?: string;
    bio?: string;
  };
  token: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const  {login}  = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      identifier,
      password,
    };

    try {
      const res = await API.post<SignInResponse>("/auth/signin", formData);
      const { user, token } = res.data;
      if (!user || !token) {
        setError("Invalid response from server");
        return;
      }
      if (res) {
        setIdentifier("");
        setPassword("");
        login(user, token, rememberMe);
        navigate("/home");
      }
    } catch (err: unknown) {
      const errorMsg = isAxiosError(err)
        ? err.response?.data?.message ?? err.message
        : "Login failed";
      setError(errorMsg);
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-10">
      <div className="grid w-full max-w-5xl items-center gap-10 md:grid-cols-2">
        <div className="hidden flex-col justify-center md:flex">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-950 text-xl font-semibold text-white">
            X
          </div>
          <h1 className="mb-4 text-5xl font-semibold tracking-tight text-neutral-950">Welcome back</h1>
          <p className="max-w-sm text-lg leading-8 text-neutral-500">
            Sign in to follow conversations, share updates, and stay close to your network.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="w-full border-neutral-200 p-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold tracking-tight">Sign in</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label>Username or email</Label>
                <Input
                  type="text"
                  placeholder="Enter your username or email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <label className="flex cursor-pointer items-center gap-2 font-medium text-neutral-700">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 accent-black"
                  />
                  Remember me
                </label>
                <Link
                  to="/forgot-password"
                  className="font-medium text-neutral-950 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button type="submit" className="h-11 w-full">
                Log in
              </Button>

              <div className="border-t border-neutral-100 pt-4 text-center text-sm text-neutral-500">
                Don't have an account?{" "}
                <span className="cursor-pointer font-semibold text-neutral-950 hover:underline">
                  <Link to={"/register"}>Sign up</Link>
                </span>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
