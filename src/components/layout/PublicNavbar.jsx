import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PUBLIC_NAV, dashboardPath } from '../../config/navigation';
import Logo from '../ui/Logo';
import Icon from '../ui/Icon';

const linkClass = ({ isActive }) =>
  `relative px-1 py-2 text-[0.95rem] font-medium transition-colors after:absolute after:inset-x-1 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-secondary-500 after:transition-transform after:duration-200 ${
    isActive ? 'text-primary-700 after:scale-x-100' : 'text-accent-light hover:text-primary-700 after:scale-x-0 hover:after:scale-x-100'
  }`;

/** Public website header with a right-hand slide-in drawer on small screens. */
const PublicNavbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    drawerRef.current?.querySelector('a, button')?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
        scrolled ? 'border-sand-200 bg-background/95 shadow-card backdrop-blur' : 'border-transparent bg-background'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:shadow">
        Skip to content
      </a>
      <div className="container-site flex h-16 items-center justify-between gap-6 sm:h-20">
        <Link to="/" className="shrink-0 rounded-md" aria-label="Roopak Nrityalaya — home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Main">
          {PUBLIC_NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <Link to={dashboardPath(user.role)} className="btn-primary">
              <Icon name="home" className="h-4 w-4" />
              My portal
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Log in
              </Link>
              <Link to="/register" className="btn-primary">
                Enrol now
              </Link>
            </>
          )}
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="icon-btn lg:hidden"
          aria-expanded={open}
          aria-controls="public-drawer"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'x' : 'menu'} className="h-6 w-6" />
        </button>
      </div>
    </header>

      {/* Mobile drawer (outside the header: backdrop-filter would trap fixed children) */}
      <div className={`fixed inset-0 z-[70] lg:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
        <div
          className={`absolute inset-0 bg-accent-dark/50 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
        />
        <div
          id="public-drawer"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className={`absolute inset-y-0 right-0 flex w-[min(20rem,85vw)] flex-col bg-background shadow-drawer transition-transform duration-200 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="flex h-16 items-center justify-between border-b border-sand-200 px-4">
            <Logo compact />
            <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label="Close menu" tabIndex={open ? 0 : -1}>
              <Icon name="x" className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main">
            {PUBLIC_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                tabIndex={open ? 0 : -1}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium ${
                    isActive ? 'bg-primary-50 text-primary-700' : 'text-accent hover:bg-sand-100'
                  }`
                }
              >
                {item.label}
                <Icon name="chevronRight" className="h-4 w-4 opacity-40" />
              </NavLink>
            ))}
          </nav>
          <div className="space-y-2 border-t border-sand-200 p-4">
            {user ? (
              <Link to={dashboardPath(user.role)} className="btn-primary w-full" tabIndex={open ? 0 : -1}>
                Go to my portal
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary w-full" tabIndex={open ? 0 : -1}>
                  Enrol now
                </Link>
                <Link to="/login" className="btn-secondary w-full" tabIndex={open ? 0 : -1}>
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicNavbar;
