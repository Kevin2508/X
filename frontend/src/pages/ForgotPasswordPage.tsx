import API from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isAxiosError } from "axios";
import { ArrowLeft, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

interface ForgotPasswordResponse {
  message: string;
  resetToken: string;
  otp: string;
  expiresAt: number;
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await API.post<ForgotPasswordResponse>(
        "/auth/forgot-password",
        { email },
      );

      navigate("/verify-otp", {
        state: {
          email,
          resetToken: response.data.resetToken,
          otp: response.data.otp,
          expiresAt: response.data.expiresAt,
        },
      });
    } catch (err: unknown) {
      const message = isAxiosError(err)
        ? err.response?.data?.message ?? err.message
        : "Unable to start password reset";
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
            Reset Password
          </h1>
          <p className="max-w-sm text-lg leading-8 text-neutral-500">
            Enter your email.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="w-full border-neutral-200 p-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Email
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="h-11 w-full"
                disabled={isLoading}
              >
                {isLoading ? "Checking..." : "Get OTP"}
              </Button>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 border-t border-neutral-100 pt-4 text-sm font-medium text-neutral-950 hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                login
              </Link>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
