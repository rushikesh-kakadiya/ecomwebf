import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ? element : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
