import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PORTAL_NAV, portalPageTitle } from '../../config/navigation';
import academy from '../../config/academy';
import { LogoMark } from '../ui/Logo';
import Icon from '../ui/Icon';

const ROLE_LABEL = { admin: 'Administrator', teacher: 'Teacher', student: 'Student' };

const initials = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('') || '?';

const SidebarContent = ({ role, onNavigate, userName }) => {
  const nav = PORTAL_NAV[role];
  return (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-3 px-5 py-5" onClick={onNavigate}>
        <LogoMark className="h-9 w-9" />
        <span className="leading-tight">
          <span className="block font-heading text-base font-semibold text-sand-50">{academy.name}</span>
          <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-secondary-400">{nav.label}</span>
        </span>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label={nav.label}>
        {nav.sections.map((section, i) => (
          <div key={section.title || i} className={i ? 'mt-5' : 'mt-1'}>
            {section.title && (
              <p className="mb-1.5 px-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-sand-400/80">{section.title}</p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive ? 'bg-white/10 text-white' : 'text-sand-300 hover:bg-white/5 hover:text-sand-50'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`absolute inset-y-2 left-0 w-0.5 rounded-full bg-secondary-400 transition-opacity ${
                            isActive ? 'opacity-100' : 'opacity-0'
                          }`}
                          aria-hidden="true"
                        />
                        <Icon name={item.icon} className={`h-5 w-5 ${isActive ? 'text-secondary-400' : 'text-sand-400 group-hover:text-sand-200'}`} />
                        {item.label}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary-500/20 text-sm font-semibold text-secondary-300">
            {initials(userName)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-sand-50">{userName}</p>
            <p className="text-xs text-sand-400">{ROLE_LABEL[role]}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Shell for the student, teacher and admin portals: fixed sidebar on large
 * screens, an off-canvas drawer below `lg`, and a top bar with the page
 * title and account actions.
 */
const PortalLayout = ({ role }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const drawerRef = useRef(null);

  const userName = user?.profile?.full_name || user?.profile?.fullName || user?.email?.split('@')[0] || '';
  const title = portalPageTitle(role, pathname);

  useEffect(() => {
    setDrawerOpen(false);
    window.scrollTo(0, 0);
    document.title = title ? `${title} · ${academy.name}` : academy.name;
  }, [pathname, title]);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    document.body.style.overflow = 'hidden';
    drawerRef.current?.querySelector('a')?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [drawerOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <a href="#portal-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[80] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:shadow">
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-accent lg:block">
        <SidebarContent role={role} userName={userName} />
      </aside>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-[70] lg:hidden ${drawerOpen ? '' : 'pointer-events-none'}`} aria-hidden={!drawerOpen}>
        <div
          className={`absolute inset-0 bg-accent-dark/60 transition-opacity duration-200 ${drawerOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setDrawerOpen(false)}
        />
        <aside
          id="portal-drawer"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Portal navigation"
          className={`absolute inset-y-0 left-0 w-[min(18rem,85vw)] bg-accent shadow-drawer transition-transform duration-200 ${
            drawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="absolute right-3 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg text-sand-300 hover:bg-white/10 hover:text-white"
            aria-label="Close navigation"
            tabIndex={drawerOpen ? 0 : -1}
          >
            <Icon name="x" />
          </button>
          {drawerOpen && <SidebarContent role={role} userName={userName} onNavigate={() => setDrawerOpen(false)} />}
        </aside>
      </div>

      <div className="lg:pl-64">
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 border-b border-sand-200 bg-white/95 backdrop-blur"
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
        >
          <div className="flex h-14 items-center gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
            <button
              ref={menuButtonRef}
              type="button"
              className="icon-btn -ml-2 lg:hidden"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation"
              aria-expanded={drawerOpen}
              aria-controls="portal-drawer"
            >
              <Icon name="menu" className="h-6 w-6" />
            </button>
            <p className="min-w-0 flex-1 truncate text-sm font-medium text-gray-500">
              <span className="hidden sm:inline">{PORTAL_NAV[role].label}</span>
              {title && (
                <>
                  <span className="mx-2 hidden text-sand-400 sm:inline" aria-hidden="true">
                    /
                  </span>
                  <span className="text-accent">{title}</span>
                </>
              )}
            </p>
            <Link to="/" className="btn-ghost btn-sm hidden sm:inline-flex">
              <Icon name="globe" className="h-4 w-4" />
              Website
            </Link>
            <button type="button" onClick={handleLogout} className="btn-ghost btn-sm">
              <Icon name="logout" className="h-4 w-4" />
              <span className="hidden sm:inline">Log out</span>
              <span className="sr-only sm:hidden">Log out</span>
            </button>
          </div>
        </header>

        <main id="portal-main" tabIndex={-1} className="outline-none" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PortalLayout;
