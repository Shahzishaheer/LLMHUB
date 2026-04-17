import { useState, useRef, useEffect } from 'react'
import { SignedOut, SignedIn, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router';
import { Zap, Menu, X, Image as ImageIcon } from 'lucide-react';
import Accountsetting from './Accountsetting';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navbarRef = useRef<HTMLElement>(null);
  const { isSignedIn } = useUser();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass-dark border-b border-white/5" ref={navbarRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <div className="bg-cobalt p-2 rounded-xl shadow-[0_0_15px_rgba(3,40,184,0.3)]">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <Link to="/" className="text-2xl font-bold text-silver tracking-tight">
              LLM<span className="text-cobalt">HUB</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-silver hover:text-cobalt font-medium transition-colors duration-200">
              Home
            </Link>
            
            {isSignedIn ? (
              <Link to="/imagegenerate" className="flex items-center gap-2 text-silver hover:text-cobalt font-medium transition-colors duration-200">
                <ImageIcon className="w-4 h-4" />
                Image Model
              </Link>
            ) : (
              <span className="flex items-center gap-2 text-slate/50 cursor-not-allowed font-medium" title="Login to access Image Model">
                <ImageIcon className="w-4 h-4" />
                Image Model
              </span>
            )}
          </div>

          {/* Desktop Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            <SignedOut>
              <Link to="/login" className="px-5 py-2.5 text-silver hover:text-white font-semibold transition-all">
                Login
              </Link>
              <Link 
                to="/signup" 
                className="bg-cobalt px-6 py-2.5 rounded-xl text-white font-semibold shadow-[0_0_20px_rgba(3,40,184,0.2)] hover:shadow-[0_0_25px_rgba(3,40,184,0.4)] transition-all duration-300"
              >
                Sign Up
              </Link>
            </SignedOut>
            <SignedIn>
              <Accountsetting />
            </SignedIn>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-silver hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-dark border-t border-white/5 animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link 
              to="/" 
              onClick={handleLinkClick}
              className="block px-4 py-3 text-silver hover:bg-white/5 rounded-xl transition-all"
            >
              Home
            </Link>
            {isSignedIn ? (
              <Link 
                to="/imagegenerate" 
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 py-3 text-silver hover:bg-white/5 rounded-xl transition-all"
              >
                <ImageIcon className="w-5 h-5" />
                Image Model
              </Link>
            ) : (
              <div className="flex items-center gap-3 px-4 py-3 text-slate/50 cursor-not-allowed">
                <ImageIcon className="w-5 h-5" />
                Image Model
              </div>
            )}
            
            <div className="pt-4 border-t border-white/5 space-y-3">
              <SignedOut> 
                <Link 
                  to="/login" 
                  className="block w-full text-center px-4 py-3 text-silver font-semibold hover:bg-white/5 rounded-xl"
                  onClick={handleLinkClick}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="block w-full text-center bg-cobalt px-4 py-3 text-white font-semibold rounded-xl shadow-lg"
                  onClick={handleLinkClick}
                >
                  Sign Up
                </Link>
              </SignedOut>
              <SignedIn>
                <div className="flex justify-center py-2">
                  <Accountsetting />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
