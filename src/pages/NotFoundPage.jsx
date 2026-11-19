import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  useEffect(() => {
    document.title = 'Page not found · Roopak Nrityalaya';
  }, []);

  return (
    <section className="container-site flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="display-title mt-3">This page could not be found</h1>
      <p className="mt-4 max-w-md text-gray-600">The link may be out of date, or the page may have moved.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary">
          Back to home
        </Link>
        <Link to="/contact" className="btn-secondary">
          Contact us
        </Link>
      </div>
    </section>
  );
};

export default NotFoundPage;
