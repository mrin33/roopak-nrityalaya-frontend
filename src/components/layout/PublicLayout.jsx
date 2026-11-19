import React, { useEffect } from 'react';
import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PageSkeleton } from '../ui/Skeleton';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';

/** Public website shell: header, page, footer. No portal sidebar here. */
const PublicLayout = () => {
  const { pathname, hash } = useLocation();

  // New page → top; "#section" links → scroll to it once it has rendered
  // (some sections appear only after their data loads).
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return undefined;
    }
    let tries = 0;
    const timer = setInterval(() => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el || ++tries > 20) {
        clearInterval(timer);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
    return () => clearInterval(timer);
  }, [pathname, hash]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicNavbar />
      <main id="main" className="flex-1 outline-none" tabIndex={-1}>
        <Suspense fallback={<PageSkeleton label="Loading…" stats={false} />}>
          <Outlet />
        </Suspense>
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
