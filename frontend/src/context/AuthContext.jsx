


// import React, { createContext, useState, useContext } from 'react';
// import { loginUser } from '../api/api'; // make sure this API function is correct

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem('token') || null);
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

//   // Login using backend API
//   const login = async (userId, password) => {
//     try {
//       const res = await loginUser(userId, password); // API call to /auth/login
//       const { token, user } = res.data;

//       // Save token & user to state and localStorage
//       setToken(token);
//       setUser(user);
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(user));
//       return true;
//     } catch (err) {
//       console.error('Login failed:', err);
//       return false;
//     }
//   };

//   const logout = () => {
//     setToken(null);
//     setUser(null);
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     window.location.href = '/'; 
//   };

//   return (
//     <AuthContext.Provider value={{ token, user, setUser, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


import React, { createContext, useEffect, useState, useContext } from 'react';
import { loginUser } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // NEW

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setAuthLoading(false); // after loading from localStorage
  }, []);

  const login = async (email, password) => {
    try {
      const res = await loginUser(email, password);
      const { token, user } = res.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, setUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
