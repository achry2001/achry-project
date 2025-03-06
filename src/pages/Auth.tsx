
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"sign-in" | "sign-up" | "forgot-password">("sign-in");
  const navigate = useNavigate();
  
  const session = supabase.auth.getSession();

  // If user is already logged in, redirect to home page
  if (session) {
    return <Navigate to="/" />;
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (view === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast.success("Signed in successfully!");
        navigate("/");
      } else if (view === "sign-up") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast.success("Signup successful! Check your email for verification instructions.");
        setView("sign-in");
      } else if (view === "forgot-password") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });
        
        if (error) throw error;
        
        toast.success("Password reset instructions sent to your email!");
        setView("sign-in");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "An error occurred while signing in with Google");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <img 
            src="/lovable-uploads/6ba42285-446f-44ff-bb3d-3e03ad6bade0.png" 
            alt="Cedar Rose Logo" 
            className="mx-auto h-14 w-auto"
          />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-blue-800">
            {view === "sign-in" ? "Sign in to your account" : 
             view === "sign-up" ? "Create a new account" : 
             "Reset your password"}
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full"
              />
            </div>
            
            {view !== "forgot-password" && (
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={view === "sign-up" ? "new-password" : "current-password"}
                  required={view !== "forgot-password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="relative block w-full"
                />
              </div>
            )}
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800"
              disabled={loading}
            >
              {loading ? "Loading..." : 
               view === "sign-in" ? "Sign in" : 
               view === "sign-up" ? "Sign up" : 
               "Send reset instructions"}
            </Button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex w-full justify-center bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"/>
                <path d="M12.24 24.0008C15.4764 24.0008 18.2058 22.9382 20.1944 21.1039L16.3274 18.1055C15.2516 18.8375 13.8626 19.252 12.2444 19.252C9.11376 19.252 6.45934 17.1399 5.50693 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.24 24.0008Z" fill="#34A853"/>
                <path d="M5.50253 14.3003C4.99987 12.81 4.99987 11.1962 5.50253 9.70601V6.61523H1.51221C-0.18227 10.0055 -0.18227 14.0008 1.51221 17.3912L5.50253 14.3003Z" fill="#FBBC04"/>
                <path d="M12.24 4.74966C13.9508 4.7232 15.6043 5.36697 16.8433 6.54867L20.2694 3.12262C18.1 1.0855 15.2207 -0.034466 12.24 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61525L5.50692 9.70604C6.45052 6.86646 9.10494 4.74966 12.24 4.74966Z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </Button>
          </div>
        </div>
        
        <div className="text-center mt-4">
          {view === "sign-in" ? (
            <>
              <button
                type="button"
                onClick={() => setView("forgot-password")}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Forgot your password?
              </button>
              <p className="mt-2 text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setView("sign-up")}
                  className="font-medium text-blue-600 hover:text-blue-800"
                >
                  Sign up
                </button>
              </p>
            </>
          ) : view === "sign-up" ? (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setView("sign-in")}
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                Sign in
              </button>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => setView("sign-in")}
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
