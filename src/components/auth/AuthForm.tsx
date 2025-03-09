
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";

type AuthFormProps = {
  view: "sign-in" | "sign-up" | "forgot-password" | "forgot-username";
  setView: (view: "sign-in" | "sign-up" | "forgot-password" | "forgot-username") => void;
};

const AuthForm = ({ view, setView }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getRedirectURL = () => {
    // Check if we're in a deployed environment vs development
    const isDeployed = window.location.hostname.includes("lovable.app");
    const baseURL = isDeployed ? 
      "https://achry-project.lovable.app" : 
      window.location.origin;
    
    return `${baseURL}/auth`;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (view === "sign-in") {
        // Special case for admin login
        if (email === "admin@admin" && password === "admin123") {
          // For admin login, we'll create a custom session
          const { data, error } = await supabase.auth.signInWithPassword({
            email: "achrefmsd5@gmail.com", // Use this email for Supabase
            password: "admin123",
          });
          
          if (error) {
            // If there's an error, check if it's due to email confirmation
            if (error.message.includes("Email not confirmed")) {
              // Try to sign up again (in case the user hasn't been created)
              const { error: signUpError } = await supabase.auth.signUp({
                email: "achrefmsd5@gmail.com",
                password: "admin123",
              });
              
              if (!signUpError) {
                toast.info("We've sent a confirmation email. Please check your inbox and confirm your email.");
                setLoading(false);
                return;
              }
            }
            
            // If the error is something else, throw it to be caught below
            throw error;
          }
          
          toast.success("Admin signed in successfully!");
          navigate("/");
          return;
        }

        // Regular sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          // If it's an email confirmation error
          if (error.message.includes("Email not confirmed")) {
            toast.info("Please confirm your email before signing in. Check your inbox for a confirmation link.");
            setLoading(false);
            return;
          }
          
          // For invalid credentials, we might want to check if the user exists
          if (error.message.includes("Invalid login credentials") && email === "achrefmsd5@gmail.com") {
            // Try to sign up the user
            const { error: signUpError } = await supabase.auth.signUp({
              email: "achrefmsd5@gmail.com",
              password: "admin123", 
            });
            
            if (!signUpError) {
              toast.info("We've sent a confirmation email. Please check your inbox and confirm your email.");
              setLoading(false);
              return;
            }
          }
          
          throw error;
        }
        
        toast.success("Signed in successfully!");
        navigate("/");
      } else if (view === "sign-up") {
        // Handle sign up with proper redirect URL
        const redirectTo = getRedirectURL();
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectTo
          }
        });
        
        if (error) throw error;
        
        toast.success("Signup successful! Please check your email for confirmation.");
        setView("sign-in");
      } else if (view === "forgot-password") {
        const redirectTo = getRedirectURL();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectTo,
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
      console.error("Authentication error:", error);
      toast.error(error.message || "An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleAuth}>
      <div className="space-y-4">
        {view === "sign-up" && (
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required={view === "sign-up"}
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>
        
        {(view === "sign-in" || view === "sign-up") && (
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={view === "sign-up" ? "new-password" : "current-password"}
                required={view === "sign-in" || view === "sign-up"}
                placeholder={view === "sign-up" ? "Create a password" : "Enter your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <Button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 transition-all duration-200"
          disabled={loading}
        >
          {loading ? "Processing..." : 
          view === "sign-in" ? "Sign in" : 
          view === "sign-up" ? "Create account" : 
          view === "forgot-password" ? "Send reset instructions" :
          "Recover username"}
        </Button>
      </div>
    </form>
  );
};

export default AuthForm;
