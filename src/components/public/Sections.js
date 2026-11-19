import React, { useEffect } from 'react';

/** Sets the browser tab title for public pages. */
export const usePageTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} · Roopak Nrityalaya` : 'Roopak Nrityalaya · Kathak Dance Academy';
  }, [title]);
};

/** Small gold diamond used as a section ornament. */
export const Ornament = ({ className = '' }) => (
  <div className={`ornament ${className}`} aria-hidden="true">
    <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
      <path d="M6 0l6 6-6 6-6-6z" />
    </svg>
  </div>
);

/** Interior page banner (About, Teachers, Gallery…). */
export const PageHero = ({ eyebrow, title, description, children }) => (
  <section className="relative overflow-hidden border-b border-sand-200 bg-sand-100">
    <div
      className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[28px] border-secondary-500/10"
      aria-hidden="true"
    />
    <div
      className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full border-[20px] border-primary/5"
      aria-hidden="true"
    />
    <div className="container-site relative py-14 text-center sm:py-20">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="display-title mx-auto mt-3 max-w-3xl">{title}</h1>
      <Ornament className="mt-5 justify-center" />
      {description && <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">{description}</p>}
      {children}
    </div>
  </section>
);

/** Centered section heading with eyebrow and ornament. */
export const SectionHeading = ({ eyebrow, title, description, align = 'center', className = 'mb-10 sm:mb-12' }) => (
  <div className={`${align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'} ${className}`}>
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    <h2 className="mt-2 font-heading text-3xl font-semibold leading-tight text-accent sm:text-4xl">{title}</h2>
    <Ornament className={`mt-4 ${align === 'center' ? 'justify-center' : ''}`} />
    {description && <p className="mt-4 text-base leading-relaxed text-gray-600">{description}</p>}
  </div>
);

/** Teacher portrait or, when no photo is on file, their initials. */
export const TeacherAvatar = ({ name = '', photoUrl, className = 'h-24 w-24 text-2xl' }) => {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
  return photoUrl ? (
    <img src={photoUrl} alt={name} className={`rounded-full object-cover ${className}`} loading="lazy" />
  ) : (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-primary-50 font-heading font-semibold text-primary-700 ring-1 ring-primary-100 ${className}`}
      aria-hidden="true"
    >
      {initials || '?'}
    </span>
  );
};
