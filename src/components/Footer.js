import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-accent text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-heading font-bold mb-4 text-secondary">
              Roopak Nrityalaya
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              A premier Kathak dance academy dedicated to preserving and promoting
              the rich tradition of Indian classical dance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-heading font-bold mb-4 text-secondary">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-secondary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-secondary transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/teachers" className="text-gray-300 hover:text-secondary transition-colors text-sm">
                  Our Teachers
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-300 hover:text-secondary transition-colors text-sm">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-secondary transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-heading font-bold mb-4 text-secondary">
              Contact Us
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Pune, Maharashtra, India</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@roopaknrityalaya.com</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91 XXXXXXXXXX</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Roopak Nrityalaya. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
