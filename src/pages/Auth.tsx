
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AuthForm from "@/components/auth/AuthForm";
import AuthFooter from "@/components/auth/AuthFooter";
import AuthInfoBanner from "@/components/auth/AuthInfoBanner";

const Auth = () => {
  const [view, setView] = useState<"sign-in" | "sign-up" | "forgot-password" | "forgot-username">("sign-in");
  const { user } = useAuth();

  // If user is already logged in, redirect to home page
  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-1/2 flex items-center justify-start px-12">
        <div className="max-w-md space-y-8">
          <div className="mt-8">
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
          
          <AuthInfoBanner />
          
          <AuthForm view={view} setView={setView} />
          
          <AuthFooter view={view} setView={setView} />
        </div>
      </div>
      
      <div className="w-1/2 flex items-center justify-center">
        <img 
          src="/lovable-uploads/fa66c7fb-df57-4008-b935-d09036cd3d9f.png" 
          alt="Data Visualization" 
          className="w-[90%] h-auto"
        />
      </div>
    </div>
  );
};

export default Auth;
