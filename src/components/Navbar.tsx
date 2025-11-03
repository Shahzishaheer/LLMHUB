import { useState } from 'react'
import { SignedOut, SignedIn, UserButton, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router';
import Accountsetting from './Accountsetting';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="navbar">
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
          <Link to="#services">Services</Link>
          <Link to="#about">About</Link>
          <Link to="#contact">Contact</Link>
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
          <Link to="/">Home</Link>
          <Link to="#services">Services</Link>
          <Link to="#about">About</Link>
          <Link to="#contact">Contact</Link>

          {/* Auth Buttons */}

          <div className="navbar-mobile-actions">
            <SignedOut> 
              <Link to="/login" className="navbar-btn navbar-btn-secondary">Login</Link>
              <Link to="/signup" className="navbar-btn navbar-btn-primary">Sign Up</Link>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
