import { Link } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side: Logo and Navigation Links */}
          <div className="flex items-center gap-4 sm:gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LLMHUB
              </h1>
            </Link>

            {/* Desktop Navigation Links - Hidden on Mobile */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
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
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
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

          {/* Mobile Hamburger Button - Only visible on mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-1 mb-4">
              <Link 
                to="/" 
                className="px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col space-y-3 px-4">
              <Link 
                to="/login"
                className="w-full px-5 py-2.5 text-sm text-center font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-all duration-200
                     shadow-md hover:shadow-lg transform cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/signup"
                className=" px-5 py-2.5 text-sm font-semibold text-white text-center bg-blue-500 rounded-xl hover:bg-blue-600 transition-all duration-200
                     shadow-md hover:shadow-lg transform cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
