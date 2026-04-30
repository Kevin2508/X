import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useState } from "react";
import API from "@/api/axios";

interface SignInBody {
  identifier: string;
  password: string;
  
}

export default function LoginPage() {

  const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
  
    const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    const formData = {
      identifier,
      password,
      
    };

    try {
      const res = await API.post<SignInBody>("/auth/signin", formData);
      const result = res;
      console.log(result);
      if (result) {
        setIdentifier("");
        
        
        setPassword("");

   
      }
    } catch (error) {
      console.log(error);
    }
    // const result = await registerUser({user_name:user_name, email:email, password:password});
  };
  
    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full items-center">
        {/* Left Section */}
        <div className="hidden md:flex flex-col justify-center">
          <h1 className="text-5xl font-bold text-blue-500 mb-4">Twitter</h1>
          <p className="text-gray-600 text-lg">
            Connect with friends and the world around you.
          </p>
        </div>

        {/* Right Section */}
        <Card className="w-full shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="Enter your email" />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" placeholder="Enter your password" />
            </div>

            {/* Forgot Password */}
            <div className="text-right text-sm text-blue-500 cursor-pointer">
              Forgot Password?
            </div>

            <Button className="w-full">Login</Button>

            <div className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <span className="text-blue-500 cursor-pointer"><Link to={"/register"}>Sign Up</Link></span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

