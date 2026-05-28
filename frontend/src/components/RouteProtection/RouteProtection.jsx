
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    
    
    if (!token || !user) {
   
      navigate('/login', { 
        replace: true,
        state: { from: window.location.pathname }
      });
    }
  }, [navigate]);

  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthGuard;