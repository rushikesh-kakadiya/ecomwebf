import React, { useEffect, useState } from 'react';
import { API_ENDPOINT } from '../config/constants';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode; // Expect children to be passed to this component
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}/api/users/role`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setIsAdmin(data.isAdmin); // Set state based on role
      } catch (error) {
        console.error('Error fetching role:', error);
        setIsAdmin(false); // Default to non-admin if error occurs
      }
    };

    if (token) {
      checkAdminRole();
    } else {
      setIsAdmin(false); // If no token, assume user is not authenticated
    }
  }, [token]);

  if (isAdmin === null) {
    return <div>Loading...</div>; // Show loading while role is being determined
  }

  if (!isAdmin) {
    return <Navigate to="/signin" />; // Redirect if user is not an admin
  }

  return <>{children}</>; // Render children if user is an admin
};

export default PrivateRoute;
