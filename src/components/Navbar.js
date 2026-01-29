import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Name */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">RN</span>
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-primary">
                Roopak Nrityalaya
              </h1>
              <p className="text-xs text-gray-600">Kathak Dance Academy</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-accent hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <Link to="/about" className="text-accent hover:text-primary transition-colors font-medium">
              About
            </Link>
            <Link to="/teachers" className="text-accent hover:text-primary transition-colors font-medium">
              Teachers
            </Link>
            <Link to="/gallery" className="text-accent hover:text-primary transition-colors font-medium">
              Gallery
            </Link>
            <Link to="/notices" className="text-accent hover:text-primary transition-colors font-medium">
              Notices
            </Link>
            <Link to="/contact" className="text-accent hover:text-primary transition-colors font-medium">
              Contact
            </Link>
            <Link to="/login" className="btn-primary">
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-6 h-6 text-accent"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              className="block px-4 py-2 text-accent hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-4 py-2 text-accent hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/teachers"
              className="block px-4 py-2 text-accent hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Teachers
            </Link>
            <Link
              to="/gallery"
              className="block px-4 py-2 text-accent hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link
              to="/notices"
              className="block px-4 py-2 text-accent hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Notices
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-2 text-accent hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/login"
              className="block px-4 py-2 bg-primary text-white rounded-lg text-center font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
