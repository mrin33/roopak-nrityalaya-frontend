import React from 'react';

/** Consistent page heading for portal pages: title, description and actions. */
const PageHeader = ({ title, description, actions, eyebrow, className = 'mb-6' }) => (
  <header className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${className}`}>
    <div className="min-w-0">
      {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
      <h1 className="page-title">{title}</h1>
      {description && <p className="page-subtitle">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </header>
);

export default PageHeader;
