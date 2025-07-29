// AuthProvider.jsx
import React, { useState, useEffect, createContext } from 'react';
import {
  userSignup,
  userLogin,
  userLogout,
  checkLogin
} from '../apis';

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState( null);

  const [error, setError]  = useState('');

const signup = async (creds) => {
  setError("");
  const result = await userSignup(creds);
  console.log(result);

  if (result.success) {
    setUser(result.user);
    return true;
  } else {
    // Convert errors object to string
    const errorMessage = result.errors
      ? Object.values(result.errors).join(", ")
      : "Signup failed from authprovider";

    setError(errorMessage);
    return false;
  }
  };
  

  
const login = async (creds) => {
  setError("");
  const result = await userLogin(creds);

  if (result.success) {
     return { success: true, user: result.user };
  } else {
    // Show specific field errors or general message
    const errorMessage = result.errors
      ? Object.values(result.errors).join(", ")
      : result.message || "Login failed";

    setError(errorMessage);
    return false;
  }
};
  const logout = () => {
    userLogout();
      setUser(null);
  };

  useEffect(() => {
    // on mount, if there's a token, you could fetch /me to rehydrate the user:
    const {token,user} = checkLogin();
    if (token) {
      setUser(user);

    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, error,setUser, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
