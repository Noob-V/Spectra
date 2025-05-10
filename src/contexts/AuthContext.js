import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Proper JSON parsing with error handling
    try {
      const storedUser = localStorage.getItem('movieUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  });

  // Function to log in the user
  // It takes a username and password, and if both are provided, it stores the username in localStorage
  const login = (username, password) => {
    if (username && password) {
      // Store username as JSON string
      localStorage.setItem('movieUser', JSON.stringify(username)); // Store username in localStorage
      setUser(username);
      return true;
    }
    return false;
  };

  // Function to log out the user
  // It removes the user data from localStorage and sets the user state to null
  const logout = () => {
    localStorage.removeItem('movieUser'); // Remove user from localStorage
    setUser(null);
  };

  // Provide the user state and login/logout functions to the context
  return (
    <AuthContext.Provider value={{ user, login, logout }}> 
      {children} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);