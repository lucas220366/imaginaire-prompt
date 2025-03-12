
import { Link } from "react-router-dom";

export const NotFoundContent = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl text-gray-600 mb-4">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
        Return to Home
      </Link>
    </div>
  );
};
