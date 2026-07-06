import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <ShieldAlert className="w-20 h-20 text-red-500 mb-6" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Access Denied</h1>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        You do not have the required permissions to access this page. Please contact your system administrator if you believe this is a mistake.
      </p>
      <Link
        to="/dashboard"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Return to Dashboard
      </Link>
    </div>
  );
};

export default Unauthorized;
