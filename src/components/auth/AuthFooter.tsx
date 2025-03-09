
import React from "react";

type AuthFooterProps = {
  view: "sign-in" | "sign-up" | "forgot-password" | "forgot-username";
  setView: (view: "sign-in" | "sign-up" | "forgot-password" | "forgot-username") => void;
};

const AuthFooter = ({ view, setView }: AuthFooterProps) => {
  return (
    <div className="text-center mt-6">
      {view === "sign-in" ? (
        <div className="space-y-3">
          <div className="flex justify-center gap-4 text-sm">
            <button
              type="button"
              onClick={() => setView("forgot-password")}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Forgot password?
            </button>
            <div className="border-r border-gray-300"></div>
            <button
              type="button"
              onClick={() => setView("forgot-username")}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Forgot username?
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Need an account?{" "}
            <button
              type="button"
              onClick={() => setView("sign-up")}
              className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
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
            className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Back to sign in
          </button>
        </p>
      )}
    </div>
  );
};

export default AuthFooter;
