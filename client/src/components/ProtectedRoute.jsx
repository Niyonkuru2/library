import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn, isAdmin, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (isAdmin && !isLoggedIn) {
    
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
