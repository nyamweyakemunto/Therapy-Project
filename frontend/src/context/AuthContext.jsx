// src/context/AuthContext.js
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Check if the user is authenticated by verifying the token with the server
   */
  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try both endpoints for compatibility
      let response = await fetch('http://localhost:3500/auth/check', {
        credentials: 'include'
      }).catch(() => {
        // If the first endpoint fails, try the alternative
        return fetch('http://localhost:3500/user', {
          credentials: 'include'
        });
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setError('Authentication check failed');
    } finally {
      setLoading(false);
    }
  };

  // Check authentication status when the component mounts
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Log in a user with email and password
   * @param {Object} formData - User credentials (email, password)
   * @returns {Promise} - Login result
   */
  const login = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3500/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log out the current user
   * @returns {Promise} - Logout result
   */
  const logout = async () => {
    try {
      setLoading(true);

      // Try both endpoints for compatibility
      let response = await fetch('http://localhost:3500/api/logout', {
        method: 'POST',
        credentials: 'include'
      }).catch(() => {
        // If the first endpoint fails, try the alternative
        return fetch('http://localhost:3500/logout', {
          method: 'POST',
          credentials: 'include'
        });
      });

      // Clear user state regardless of server response
      setUser(null);

      // Return the response data if needed
      if (response && response.ok) {
        return await response.json();
      }

      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear the user even if there's an error
      setUser(null);
      setError('Logout failed, but session was cleared');
      return { success: true, message: 'Logged out with errors' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Registration result
   */
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3500/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      logout,
      register,
      checkAuth // Expose this so components can refresh auth state
    }}>
      {children}
    </AuthContext.Provider>
  );
};