import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  // Ambil user dari localStorage
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  // Jika tidak ada user yang login, redirect ke login
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  // Jika ada allowedRoles dan user role tidak termasuk, redirect sesuai role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect berdasarkan role
    if (user.role === 'Admin') {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/joblist" replace />;
    }
  }
  
  return children;
}