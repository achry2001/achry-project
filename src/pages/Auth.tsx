
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { CircleInfo } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"sign-in" | "sign-up" | "forgot-password" | "forgot-username">("sign-in");
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
        // Special case for admin login
        if (email === "admin@admin" && password === "admin") {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) throw error;
          
          toast.success("Admin signed in successfully!");
          navigate("/");
          return;
        }

        // Regular sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast.success("Signed in successfully!");
        navigate("/");
      } else if (view === "sign-up") {
        // In a real app, this would be restricted to admin users
        toast.info("Only company admins can create new accounts.");
        setView("sign-in");
      } else if (view === "forgot-password") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });
        
        if (error) throw error;
        
        toast.success("Password reset instructions sent to your email!");
        setView("sign-in");
      } else if (view === "forgot-username") {
        // In a real app, this would look up the username by email
        toast.success("If this email exists in our system, the username will be sent to it.");
        setView("sign-in");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-1/2 flex items-center justify-start px-12">
        <div className="max-w-md space-y-8">
          <div>
            <img 
              src="/lovable-uploads/6ba42285-446f-44ff-bb3d-3e03ad6bade0.png" 
              alt="Cedar Rose Logo" 
              className="h-14 w-auto"
            />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-blue-800">
              {view === "sign-in" ? "Sign in to your account" : 
              view === "sign-up" ? "Create a new account" : 
              view === "forgot-password" ? "Reset your password" :
              "Recover your username"}
            </h2>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
            <div className="flex gap-2">
              <InfoCircle className="text-blue-700 h-5 w-5 mt-0.5" />
              <div>
                <p className="text-sm text-blue-700">Only employees with verified company email addresses can access the app.</p>
                <p className="text-xs mt-1 text-blue-600">Contact your administrator if you need an account.</p>
              </div>
            </div>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleAuth}>
            <div className="space-y-4 rounded-md shadow-sm">
              {view === "sign-up" && (
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required={view === "sign-up"}
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="relative block w-full mt-1"
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="relative block w-full mt-1"
                />
              </div>
              
              {(view === "sign-in" || view === "sign-up") && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={view === "sign-up" ? "new-password" : "current-password"}
                    required={view === "sign-in" || view === "sign-up"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="relative block w-full mt-1"
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
                view === "forgot-password" ? "Send reset instructions" :
                "Recover username"}
              </Button>
            </div>
          </form>
          
          <div className="text-center mt-4">
            {view === "sign-in" ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setView("forgot-password")}
                  className="text-sm text-blue-600 hover:text-blue-800 block w-full"
                >
                  Forgot your password?
                </button>
                <button
                  type="button"
                  onClick={() => setView("forgot-username")}
                  className="text-sm text-blue-600 hover:text-blue-800 block w-full"
                >
                  Forgot your username?
                </button>
                <p className="mt-2 text-sm text-gray-600">
                  Need an account?{" "}
                  <button
                    type="button"
                    onClick={() => setView("sign-up")}
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    Contact your administrator
                  </button>
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Remember your {view === "forgot-password" ? "password" : view === "forgot-username" ? "username" : "account"}?{" "}
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
      
      <div className="w-1/2 flex items-center justify-center">
        <img 
          src="/lovable-uploads/6ba42285-446f-44ff-bb3d-3e03ad6bade0.png" 
          alt="Company Logo" 
          className="w-[90%] h-auto"
        />
      </div>
    </div>
  );
};

export default Auth;
