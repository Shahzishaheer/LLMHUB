import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo/Brand */}
        <Link to="/" className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LLMHUB
          </h1>
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex items-center space-x-8">
          <li>
            <Link 
              to="/home" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 
                       font-medium transition-colors duration-200"
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 
                       font-medium transition-colors duration-200"
            >
              About
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 
                       font-medium transition-colors duration-200"
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link 
            to="/login"
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 
                     hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
          >
            Login
          </Link>
          <Link 
            to="/signup"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 
                     rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200
                     shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
