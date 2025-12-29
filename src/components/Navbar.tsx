import { useState, useRef, useEffect } from 'react'
import { SignedOut, SignedIn, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router';
import Accountsetting from './Accountsetting';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navbarRef = useRef<HTMLElement>(null);
  const { isSignedIn } = useUser();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target as Node))
         {
        setIsMenuOpen(false);
      }
    };

    // Only add listener when menu is open
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close menu when clicking on navigation links
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="navbar-container">
        {/* Logo/Brand */}
        <div>
          <a href="#" className="navbar-brand">
            LLM-HUB
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <div className="navbar-nav">
         <Link to="/">Home</Link>
         
          {isSignedIn ? (
            <Link to="/imagegenerate">Image Model</Link>
          ) : (
            <span className="navbar-link-disabled text-gray-400 cursor-not-allowed " title="Login to access Image Model">
              Image Model
            </span>
          )}
          
        </div>

        {/* Desktop Login/Signup Buttons */}
        <div className="navbar-actions">
          <SignedOut>
              <Link to="/login" className="navbar-btn navbar-btn-primary">Login</Link>
              <Link to="/signup" className="navbar-btn navbar-btn-primary">Sign Up</Link>
            </SignedOut>
             <SignedIn>
              {/* <UserButton /> */}
              <Accountsetting />
            </SignedIn>
        </div>

        {/* Mobile/Tablet Hamburger Button */}
        <button
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {!isMenuOpen ? (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          ) : (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile/Tablet Dropdown Menu */}
      {isMenuOpen && (
        <div className="navbar-mobile-menu">
          {/* Navigation Links */}
          <Link to="/" onClick={handleLinkClick}>Home</Link>
          {isSignedIn ? (
            <Link to="/imagegenerate" onClick={handleLinkClick}>Image Model</Link>
          ) : (
            <span className="navbar-link-disabled text-gray-400 cursor-not-allowed " title="Login to access Image Model">
              Image Model
            </span>
          )}
          

          {/* Auth Buttons */}
          <div className="navbar-mobile-actions">
            <SignedOut> 
              <Link to="/login" className="navbar-btn navbar-btn-primary" onClick={handleLinkClick}>Login</Link>
              <Link to="/signup" className="navbar-btn navbar-btn-primary" onClick={handleLinkClick}>Sign Up</Link>
            </SignedOut>
            <SignedIn>
             <Accountsetting />
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
