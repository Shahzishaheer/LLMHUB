import { Link } from 'react-router-dom';
import { useState } from 'react';
 import { useUser } from '@clerk/clerk-react';

const Navbar = () => {
  const data =useUser();
  console.log("userdata",data);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side: Logo and Navigation Links */}
          <div className="flex items-center gap-4 sm:gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold bg-blue-300 bg-clip-text text-transparent my-2">
                LLMHUB
              </h1>
            </Link>

            {/* Desktop Navigation Links - Hidden on Mobile */}
            <div className="flex gap-8 lg:gap-10">
              <Link 
                to="/" 
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                About
              </Link>
            </div>
          </div>

          {/* Right Side: Desktop Auth Buttons - Hidden on Mobile */}
        <div className="items-end gap-3 lg:gap-4">
            <Link 
              to="/login"
              className="px-4 lg:px-6 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 
                       hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              Login
            </Link>
            <Link 
              to="/signup"
              className="px-4 lg:px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 
                       rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200
                       shadow-sm hover:shadow-md"
            >
              Sign Up
            </Link>
          </div>

        </div>
     </div>
    </nav>
  );
};

export default Navbar;
