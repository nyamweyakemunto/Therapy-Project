import React, { useState } from "react";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Login = ({ buttonClasses, buttonForGFT }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   if (!validateForm()) return;
    
  //   setIsSubmitting(true);
  //   setErrors({});
    
  //   try {
  //     // Determine API URL based on environment
  //     const apiUrl = import.meta.env.DEV 
  //       ? 'http://localhost:3500/api/login' 
  //       : 'https://yourbackend.com/api/login';

  //     const response = await fetch(apiUrl, {
  //       method: 'POST',
  //       headers: { 
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json'
  //       },
  //       credentials: 'include', // Essential for cookies
  //       body: JSON.stringify(formData)
  //     });
      
  //     const data = await response.json();
  //     console.log(data);
      
  //     // Handle backend response codes
  //     if (!response.ok) {
  //       // Map backend error messages to frontend
  //       const errorMessage = data.message || 'Login failed';
  //       throw new Error(
  //         errorMessage.includes('credentials') ? 'Invalid email or password' : 
  //         errorMessage.includes('pending approval') ? 'Account pending admin approval' :
  //         errorMessage
  //       );
  //     }

  //     // // Verify token was received in cookies
  //     // const token = Cookies.get('token');
  //     // if (!token) {
  //     //   throw new Error('Authentication token not received');
  //     // }
  //     // console.log(token);

  //     // Store user data in localStorage (optional)
  //     if (data.user) {
  //       localStorage.setItem('user', JSON.stringify(data.user));
  //     }

  //     // Redirect based on user role
  //     const redirectPath = data.user?.role === 'patient' ? '/' :
  //                       //  data.user?.role === 'therapist' ? '/therapist-dashboard' : 
  //                       //  '/booking';
      
  //     navigate(redirectPath);
      
  //   } catch (error) {
  //     console.error('Login error:', {
  //       error: error.message,
  //       timestamp: new Date().toISOString(),
  //       formData: { email: formData.email } // Don't log password
  //     });
      
  //     setErrors({ 
  //       submit: error.message || 'Login failed. Please try again.' 
  //     });
      
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const response = await fetch('http://localhost:3500/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
  
      const data = await response.json();
  
      if (!response.ok) throw new Error(data.message || 'Login failed');
  
      // Use the user data returned from login response
      const userRole = data.user.role;
      
      // Redirect based on actual role
      switch(userRole) {
        case 'admin':
          window.location.href = '/admin-dashboard';
          break;
        case 'therapist':
          window.location.href = '/';
          break;
        case 'patient':
          window.location.href = '/';
          break;
        default:
          window.location.href = '/';
      }
  
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0 border border-gray-100">
      <div className="p-6 space-y-6 md:space-y-7 sm:p-8">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-backgroundColor md:text-2xl text-center">
          Welcome Back
          <p className="text-sm font-normal text-gray-500 mt-1">
            Sign in to continue
          </p>
        </h1>

        {errors.submit && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {errors.submit}
          </div>
        )}

        <form className="space-y-5 md:space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5 md:space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`bg-[#d5f2ec] border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-brightColor focus:border-brightColor block w-full pl-10 p-3 transition-all duration-200 shadow-sm`}
                placeholder="Email address"
                required
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                </svg>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`bg-[#d5f2ec] border ${errors.password ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-brightColor focus:border-brightColor block w-full pl-10 p-3 transition-all duration-200 shadow-sm`}
                placeholder="Password"
                required
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="remember"
                  aria-describedby="remember"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-brightColor"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="remember" className="text-gray-500 hover:text-gray-700 cursor-pointer">
                  Remember me
                </label>
              </div>
            </div>
            <a href="#" className="text-sm font-medium text-brightColor hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className={`${buttonClasses} ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Social login buttons */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or sign in with</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Social login buttons remain the same */}
        </div>

        <p className="text-sm text-center text-gray-600 mt-4 border-t border-gray-100 pt-4">
          Don't have an account? Sign up
        </p>
      </div>
    </div>
  );
};

export default Login;