import React, { createContext, useContext, useState, useEffect } from 'react';


const AuthContext = createContext();

export const useAuth = () => {
 
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);


  const fetchUserData = async (token) => {
    try {
      console.log('Fetching user data...');
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
       
        setCurrentUser(userData);
      } else {
        console.log('Invalid token, removing from storage');
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

 
  const getUserDashboardPath = () => {
    if (!currentUser) {
      
      return '/login';
    }

   
   
    if (!currentUser.hasSelectedRole) {
   
      return '/role';
    }


    if (currentUser.role === 'restaurant_pending') {
    if (!currentUser.hasSubmittedForm) {
    
      return '/restaurant_form';
    } else {
     
      return '/restaurant-pending'; 
    }
  }

    if (currentUser.restaurantStatus === 'rejected') {
   
      return '/rejected';
    }

    if (currentUser.role === 'restaurant_owner') {
    
      return '/restaurant';
    }


    if (currentUser.role === 'customer') {
      
      return '/customer';
    }


   
    return '/role';
  };


  const getUserDashboardPathForUser = (user) => {
    if (!user) return '/login';
    
    if (!user.hasSelectedRole) return '/role';
     if (user.role === 'restaurant_pending') {
    if (!user.hasSubmittedForm) {
      return '/restaurant_form'; 
    } else {
      return '/restaurant-pending'; 
    }
  }
    if (user.restaurantStatus === 'rejected') return '/rejected';
    if (user.role === 'restaurant_owner') return '/restaurant';
    if (user.role === 'customer') return '/customer';
    
    return '/role';
  };

 
  const login = async (email, password) => {
    try {
      console.log('🔄 Attempting login for:', email);
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
     

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setCurrentUser(data.user);
        
        const redirectPath = getUserDashboardPathForUser(data.user);
       
        
        return { 
          success: true, 
          message: data.message,
          user: data.user,
          redirectTo: redirectPath
        };
      } else {
       
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Login network error:', error);
      return { success: false, error: 'Network error' };
    }
  };


  const register = async (userData) => {
    try {
     
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
     

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setCurrentUser(data.user);
        
        console.log('Registration successful, redirect to role selection');
        
        return { 
          success: true, 
          message: data.message,
          user: data.user,
          redirectTo: '/role' 
        };
      } else {
       
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Registration network error:', error);
      return { success: false, error: 'Network error' };
    }
  };


  const selectRole = async (userId, role) => {
    try {
     
      const response = await fetch('http://localhost:5000/api/auth/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId, role })
      });

      const data = await response.json();
     

      if (response.ok) {
       
        setCurrentUser(data.user);
        
      
        const redirectTo = role === 'customer' ? '/customer' : '/restaurant_form';
     
        
        return { 
          success: true, 
          message: data.message,
          user: data.user,
          redirectTo: redirectTo
        };
      } else {
        console.log('Role selection failed:', data.message);
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Role selection network error:', error);
      return { success: false, error: 'Network error' };
    }
  };


  const submitRestaurantApplication = async (applicationData) => {
    try {
      console.log('🔄 Submitting restaurant application...');
      const response = await fetch('http://localhost:5000/api/restaurant/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(applicationData)
      });

      const data = await response.json();
    

      if (response.ok) {
       
        if (data.user) {
          setCurrentUser(data.user);
        }
        
        return { 
          success: true, 
          message: data.message,
          data: data
        };
      } else {
       
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Restaurant application network error:', error);
      return { success: false, error: 'Network error' };
    }
  };

 
  const canAccessRoleSelection = () => {
    const canAccess = !currentUser?.hasSelectedRole;
   
    return canAccess;
  };

  
  const isRestaurantOwner = () => {
    const isOwner = currentUser?.role === 'restaurant_owner';
   
    return isOwner;
  };

   const hasPendingRestaurant = () => {
    const isPending = currentUser?.role === 'restaurant_pending';
   
    return isPending;
  };

 
  const hasRejectedRestaurant = () => {
    const isRejected = currentUser?.restaurantStatus === 'rejected';
  
    return isRejected;
  };

 
  const isCustomer = () => {
    const isCustomer = currentUser?.role === 'customer';
  
    return isCustomer;
  };


  const isAdmin = () => {

    return false; 
  };

 
  const refreshUserData = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      await fetchUserData(token);
    }
  };


 
const logout = () => {
 
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setCurrentUser(null);
  

  window.location.href = '/homepage'; 
};

  
  const googleLogin = () => {
   
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

 
   const updateUserData = (newUserData) => {
   
    setCurrentUser(prevUser => ({
      ...prevUser,
      ...newUserData
    }));
  };

  
  const value = {
    
    currentUser,
    setCurrentUser: updateUserData,
    loading,
    
   
    login,
    register,
    selectRole,
    logout,
    googleLogin,
    updateUserData,
   
    submitRestaurantApplication,
    
    
    canAccessRoleSelection,
    isRestaurantOwner,
    hasPendingRestaurant,
    hasRejectedRestaurant,
    isCustomer,
    isAdmin,
    getUserDashboardPath,
    getUserDashboardPathForUser,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};


export const useAuthHelpers = () => {
  const { currentUser } = useAuth();

  const getUserStatus = () => {
    if (!currentUser) return 'logged_out';
    if (!currentUser.hasSelectedRole) return 'needs_role_selection';
    if (currentUser.role === 'restaurant_pending') return 'restaurant_pending';
    if (currentUser.restaurantStatus === 'rejected') return 'restaurant_rejected';
    if (currentUser.role === 'restaurant_owner') return 'restaurant_approved';
    if (currentUser.role === 'customer') return 'customer';
    return 'unknown';
  };

  const getWelcomeMessage = () => {
    const status = getUserStatus();
    switch (status) {
      case 'needs_role_selection':
        return 'Welcome! Please choose how you want to use our platform.';
      case 'restaurant_pending':
        return 'Your restaurant application is under review.';
      case 'restaurant_rejected':
        return 'Your restaurant application was not approved.';
      case 'restaurant_approved':
        return 'Welcome to your restaurant dashboard!';
      case 'customer':
        return 'Welcome to Foodie! Browse restaurants and order food.';
      default:
        return 'Welcome!';
    }
  };

  return {
    getUserStatus,
    getWelcomeMessage
  };
};