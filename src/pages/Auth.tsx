
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
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-1/2 flex items-center justify-start px-12">
        <div className="max-w-md w-full mx-auto space-y-8 animate-fade-in">
          <div className="mt-10">
            <img 
              src="/lovable-uploads/6ba42285-446f-44ff-bb3d-3e03ad6bade0.png" 
              alt="Cedar Rose Logo" 
              className="h-16 w-auto mt-4"
            />
            <h2 className="mt-8 text-3xl font-bold tracking-tight text-blue-800">
              {view === "sign-in" ? "Welcome back" : 
              view === "sign-up" ? "Create your account" : 
              view === "forgot-password" ? "Reset your password" :
              "Recover your username"}
            </h2>
            <p className="mt-2 text-sm text-blue-600">
              {view === "sign-in" ? "Sign in to access your account" : 
              view === "sign-up" ? "Fill in your details to get started" : 
              view === "forgot-password" ? "Enter your email to reset your password" :
              "Enter your email to recover your username"}
            </p>
          </div>
          
          <AuthInfoBanner />
          
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md border border-blue-100">
            <AuthForm view={view} setView={setView} />
          </div>
          
          <AuthFooter view={view} setView={setView} />
        </div>
      </div>
      
      <div className="w-1/2 bg-blue-600 flex items-center justify-center">
        <div className="text-white p-12 max-w-md">
          <h3 className="text-2xl font-bold mb-4">Data-Driven Insights</h3>
          <p className="text-blue-100 mb-8">Access comprehensive analytics and visualizations to drive your business decisions.</p>
          <img 
            src="/lovable-uploads/3bff204d-b72f-4749-8064-f99ff167bc7e.png" 
            alt="Data Visualization" 
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
