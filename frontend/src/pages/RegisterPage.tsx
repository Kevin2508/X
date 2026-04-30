import API from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
interface signUpBody {
  display_name: string;
  user_name: string;
  email: string;
  password: string;
  captcha: unknown;
}
export default function RegisterPage() {
  const [display_name, setdisplay_name] = useState("");
  const [user_name, setuser_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [imageCaptcha, setImageCaptcha] = useState("");
  const [textCaptcha, setTextCaptcha] = useState("");
  const [captchaFetchTime, setCaptchaFetchTime] = useState<number>(0);
  const navigate = useNavigate();

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
  const refreshCaptcha = function () {
    fetchCaptcha(true);
  };
  useEffect(() => {
    fetchCaptcha(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const elapsedTime = (Date.now() - captchaFetchTime) / 1000;
    if (elapsedTime < 3) {
      setError("Please verify again");
      fetchCaptcha();
      setTextCaptcha("");
      return;
    }
    const correctCaptcha = sessionStorage.getItem("captcha_answer");
    if (textCaptcha === correctCaptcha) {
      console.log("Login successs");
    } else {
      setError("Incorrect captcha, please try again.");
      fetchCaptcha();
    }
    const formData = {
      display_name,
      user_name,
      email,
      password,
      captcha: textCaptcha,
    };

    try {
      const res = await API.post<signUpBody>("/auth/signup", formData);
      const result = res;
      console.log(result);
      if (result) {
        setSuccess(true);
        setEmail("");
        setuser_name("");
        setdisplay_name("");
        
        setPassword("");
        setTextCaptcha("");

        navigate("/login");
      } else {
        fetchCaptcha();
      }
    } catch (error) {
      console.log(error);
    }
    // const result = await registerUser({user_name:user_name, email:email, password:password});
  };
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full items-center">
          {/* Left Section */}
          <div className="hidden md:flex flex-col justify-center">
            <h1 className="text-5xl font-bold text-blue-500 mb-4">
              Join Twitter Clone
            </h1>
            <p className="text-gray-600 text-lg">
              Create an account and start sharing your thoughts.
            </p>
          </div>
          <form>
            {/* Right Section */}
            <Card className="w-full shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-2xl">Create account</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input type="text" placeholder="Enter your display name" value={display_name} onChange={(e) => setdisplay_name(e.target.value)}/>
                </div>
                <div className="space-y-2">
                  <Label>user_name</Label>
                  <Input type="text" placeholder="Enter your user_name" onChange={(e) => setuser_name(e.target.value)} value={user_name}/>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" placeholder="Create password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>

                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                </div>

                {/* Captcha */}
                <div className="space-y-2">
                  <div dangerouslySetInnerHTML={{ __html: imageCaptcha }} />
                  <span onClick={refreshCaptcha}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="30"
                      height="30"
                      viewBox="0,0,256,256"
                    >
                      <g
                        fill="#ffffff"
                        fill-rule="nonzero"
                        stroke="none"
                        stroke-width="1"
                        stroke-linecap="butt"
                        stroke-linejoin="miter"
                        stroke-miterlimit="10"
                        stroke-dasharray=""
                        stroke-dashoffset="0"
                        font-family="none"
                        font-weight="none"
                        font-size="none"
                        text-anchor="none"
                      >
                        <g transform="scale(8.53333,8.53333)">
                          <path d="M15,3c-2.94691,0 -5.67058,1.08978 -7.74414,2.83594c-0.27716,0.2291 -0.40998,0.58936 -0.34789,0.94355c0.0621,0.35419 0.30956,0.64777 0.64813,0.76892c0.33857,0.12115 0.71611,0.05121 0.98882,-0.18317c1.72644,-1.45384 4.00199,-2.36523 6.45508,-2.36523c5.22661,0 9.45668,3.91362 9.95117,9h-2.95117l4,6l4,-6h-3.05078c-0.508,-6.16514 -5.65128,-11 -11.94922,-11zM4.30078,9l-4,6h2.69922c0,6.63552 5.36448,12 12,12c2.94691,0 5.67058,-1.08978 7.74414,-2.83594c0.27717,-0.2291 0.41,-0.58936 0.3479,-0.94356c-0.0621,-0.35419 -0.30957,-0.64778 -0.64814,-0.76893c-0.33857,-0.12115 -0.71612,-0.0512 -0.98883,0.18319c-1.72644,1.45384 -4.00199,2.36523 -6.45508,2.36523c-5.56448,0 -10,-4.43552 -10,-10h3.30078z"></path>
                        </g>
                      </g>
                    </svg>
                  </span>
                  <Label>Captcha</Label>
                  <Input
                    onChange={(e) => {
                      setTextCaptcha(e.target.value);
                    }}
                    placeholder="Enter captcha"
                  />
                  <div className="bg-gray-200 text-center py-2 rounded-md text-sm">
                    8K2L4
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="text-right text-sm text-blue-500 cursor-pointer">
                  Forgot Password?
                </div>

                <Button onClick={handleSubmit} className="w-full">
                  Register
                </Button>

                <div className="text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <span className="text-blue-500 cursor-pointer">
                    <Link to="/login">Login</Link>
                  </span>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </>
  );
}
