
import { Info } from "lucide-react";

const AuthInfoBanner = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
      <div className="flex gap-2">
        <Info className="text-blue-700 h-5 w-5 mt-0.5" />
        <div>
          <p className="text-sm text-blue-700">Only employees with verified company email addresses can access the app.</p>
          <p className="text-xs mt-1 text-blue-600">Contact your administrator if you need an account.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthInfoBanner;
