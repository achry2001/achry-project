
import React from "react";

type AuthFooterProps = {
  view: "sign-in" | "sign-up" | "forgot-password" | "forgot-username";
  setView: (view: "sign-in" | "sign-up" | "forgot-password" | "forgot-username") => void;
};

const AuthFooter = ({ view, setView }: AuthFooterProps) => {
  return (
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
  );
};

export default AuthFooter;
