
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (view === "sign-in") {
        // Special case for admin login
        if (email === "admin@admin" && password === "admin123") {
          // For admin login, we'll create a custom session
          const { data, error } = await supabase.auth.signInWithPassword({
            email: "achrefmsd5@gmail.com", // Updated email for Supabase
            password: "admin123",
          });
          
          if (error) {
            // If login fails, try to sign up the admin account first
            const { error: signUpError } = await supabase.auth.signUp({
              email: "achrefmsd5@gmail.com",
              password: "admin123",
            });
            
            if (signUpError) throw signUpError;
            
            // Try login again after signup
            const { error: retryError } = await supabase.auth.signInWithPassword({
              email: "achrefmsd5@gmail.com",
              password: "admin123",
            });
            
            if (retryError) throw retryError;
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
  );
};

export default AuthForm;
