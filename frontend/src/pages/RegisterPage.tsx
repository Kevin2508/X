import API from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { RefreshCw } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

interface SignUpResponse {
  user: any;
  token: string;
}

export default function RegisterPage() {
  const [display_name, setdisplay_name] = useState("");
  const [user_name, setuser_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imageCaptcha, setImageCaptcha] = useState("");
  const [textCaptcha, setTextCaptcha] = useState("");
  const [captchaFetchTime, setCaptchaFetchTime] = useState<number>(0);
  const navigate = useNavigate();
  const { login } = useAuth();

  const fetchCaptcha = async (refresh = false) => {
    try {
      const url = refresh
        ? "http://localhost:3000/api/auth/captcha?refresh=true"
        : "http://localhost:3000/api/auth/captcha";
      const res = await API.get<string>(url);
      setImageCaptcha(res.data);
      setCaptchaFetchTime(Date.now());
    } catch (error) {
      console.error("Error fetching captcha:", error);
    }
  };

  useEffect(() => {
    fetchCaptcha(true);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const elapsedTime = (Date.now() - captchaFetchTime) / 1000;
    if (elapsedTime < 3) {
      fetchCaptcha();
      setTextCaptcha("");
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    try {
      const res = await API.post<SignUpResponse>("/auth/signup", {
        display_name,
        user_name,
        email,
        password,
        captcha: textCaptcha,
      });

      setEmail("");
      setuser_name("");
      setdisplay_name("");
      setPassword("");
      setTextCaptcha("");
      login(res.data.user, res.data.token);
      navigate("/login");
    } catch (error) {
      console.log(error);
      fetchCaptcha();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-10">
      <div className="grid w-full max-w-5xl items-center gap-10 md:grid-cols-2">
        <div className="hidden flex-col justify-center md:flex">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-950 text-xl font-semibold text-white">
            X
          </div>
          <h1 className="mb-4 text-5xl font-semibold tracking-tight text-neutral-950">
            Create your account
          </h1>
          <p className="max-w-sm text-lg leading-8 text-neutral-500">
            Start posting, following people, and building your own timeline.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="w-full border-neutral-200 p-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Sign up
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Display name</Label>
                  <Input value={display_name} onChange={(e) => setdisplay_name(e.target.value)} placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input value={user_name} onChange={(e) => setuser_name(e.target.value)} placeholder="username" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create password" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm password</Label>
                  <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat password" />
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-neutral-200 p-3">
                <div className="overflow-hidden rounded-xl bg-neutral-50" dangerouslySetInnerHTML={{ __html: imageCaptcha }} />
                <button
                  type="button"
                  onClick={() => fetchCaptcha(true)}
                  className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
                >
                  <RefreshCw size={16} />
                  Refresh captcha
                </button>
                <div className="space-y-2">
                  <Label>Captcha</Label>
                  <Input
                    value={textCaptcha}
                    onChange={(e) => setTextCaptcha(e.target.value)}
                    placeholder="Enter captcha"
                  />
                </div>
              </div>

              <Button type="submit" className="h-11 w-full">
                Register
              </Button>

              <div className="border-t border-neutral-100 pt-4 text-center text-sm text-neutral-500">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-neutral-950 hover:underline">
                  Log in
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
