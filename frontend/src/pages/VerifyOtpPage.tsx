import API from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { isAxiosError } from "axios";
import { ArrowLeft, KeyRound, ShieldCheck, TimerReset } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

interface ResetLocationState {
  email: string;
  resetToken: string;
  otp: string;
  expiresAt: number;
}

interface ResetPasswordResponse {
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
  message: string;
}

const getSecondsLeft = (expiresAt: number) =>
  Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));

const formatSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
};

export default function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const resetState = location.state as ResetLocationState | null;
  const [secondsLeft, setSecondsLeft] = useState(
    resetState ? getSecondsLeft(resetState.expiresAt) : 0,
  );
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isExpired = secondsLeft <= 0;
  const timerLabel = useMemo(() => formatSeconds(secondsLeft), [secondsLeft]);

  useEffect(() => {
    if (!resetState) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft(getSecondsLeft(resetState.expiresAt));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resetState]);

  if (!resetState) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (isExpired) {
      setError("This reset session expired. Please request a new OTP.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await API.post<ResetPasswordResponse>(
        "/auth/reset-password",
        {
          resetToken: resetState.resetToken,
          otp,
          password,
        },
      );

      login(response.data.user, response.data.token, true);
      navigate("/home");
    } catch (err: unknown) {
      const message = isAxiosError(err)
        ? err.response?.data?.message ?? err.message
        : "Unable to reset password";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-10">
      <div className="grid w-full max-w-5xl items-center gap-10 md:grid-cols-2">
        <div className="hidden flex-col justify-center md:flex">
          <h1 className="mb-4 text-5xl font-semibold tracking-tight text-neutral-950">
            Verify OTP
          </h1>
          <p className="max-w-sm text-lg leading-8 text-neutral-500">
            Complete the reset before the timer reaches zero.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="w-full border-neutral-200 p-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold tracking-tight">
                New Password
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-neutral-200 p-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-neutral-500">
                    <ShieldCheck className="h-4 w-4" />
                    Demo OTP
                  </div>
                  <div className="mt-2 text-3xl font-semibold tracking-widest">
                    {resetState.otp}
                  </div>
                </div>
                <div className="rounded-2xl border border-neutral-200 p-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-neutral-500">
                    <TimerReset className="h-4 w-4" />
                    Time Left
                  </div>
                  <div className="mt-2 text-3xl font-semibold tracking-widest">
                    {timerLabel}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 p-3 text-sm text-neutral-600">
                Resetting password for {resetState.email}
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {isExpired && (
                <div className="rounded-xl border border-neutral-950 bg-neutral-950 p-3 text-sm font-semibold text-white">
                  Reset expired. Request forgot password again.
                </div>
              )}

              <div className="space-y-2">
                <Label>OTP</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  maxLength={6}
                  disabled={isExpired}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>New Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="pl-9"
                    disabled={isExpired}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  disabled={isExpired}
                  required
                />
              </div>

              <Button
                type="submit"
                className="h-11 w-full"
                disabled={isExpired || isLoading}
              >
                {isLoading ? "Saving..." : "Reset Password"}
              </Button>

              <Link
                to="/forgot-password"
                className="flex items-center justify-center gap-2 border-t border-neutral-100 pt-4 text-sm font-medium text-neutral-950 hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Request new OTP
              </Link>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
