
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"sign-in" | "sign-up" | "forgot-password">("sign-in");
  const navigate = useNavigate();
  
  const { user } = useAuth();

  // If user is already logged in, redirect to home page
  if (user) {
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

  return (
    <div className="flex min-h-screen">
      {/* Left side - Authentication Form */}
      <div className="w-1/2 flex items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
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
      
      {/* Right side - Image */}
      <div className="w-1/2 hidden md:flex md:items-center md:justify-center bg-blue-900">
        <img 
          src="/lovable-uploads/afa682ab-3c12-4f4d-9952-37e1f459104e.png" 
          alt="Cedar Rose AI" 
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default Auth;
