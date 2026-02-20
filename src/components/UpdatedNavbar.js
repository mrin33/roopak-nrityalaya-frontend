import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary shadow-lg fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-2xl">💃</span>
            </div>
            <div>
              <h1 className="text-white font-heading font-bold text-xl">
                Roopak Nrityalaya
              </h1>
              <p className="text-secondary text-xs">Kathak Dance Academy</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-secondary transition-colors font-medium">
              Home
            </Link>
            <Link to="/about" className="text-white hover:text-secondary transition-colors font-medium">
              About
            </Link>
            <Link to="/teachers" className="text-white hover:text-secondary transition-colors font-medium">
              Teachers
            </Link>
            <Link to="/gallery" className="text-white hover:text-secondary transition-colors font-medium">
              Gallery
            </Link>
            <Link to="/notices" className="text-white hover:text-secondary transition-colors font-medium">
              Notices
            </Link>
            <Link to="/contact" className="text-white hover:text-secondary transition-colors font-medium">
              Contact
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-white font-medium hidden sm:block">
                    {user.profile?.full_name || user.email}
                  </span>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="font-semibold text-accent truncate">{user.email}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    
                    {user.role === 'student' && (
                      <Link
                        to="/student/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        📊 Dashboard
                      </Link>
                    )}
                    
                    {user.role === 'teacher' && (
                      <Link
                        to="/teacher/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        📊 Dashboard
                      </Link>
                    )}
                    
                    {user.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        📊 Dashboard
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-white hover:text-secondary transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-secondary text-primary px-4 py-2 rounded-lg hover:bg-secondary-dark transition-colors font-semibold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
