import React from 'react';
import { Link } from 'react-router-dom';
import academy from '../../config/academy';
import { PUBLIC_NAV } from '../../config/navigation';
import Logo from '../ui/Logo';
import Icon from '../ui/Icon';

const SOCIAL_LABELS = { instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube' };

const PublicFooter = () => {
  const year = new Date().getFullYear();
  const socials = Object.entries(academy.social).filter(([, url]) => url);

  return (
    <footer className="bg-accent text-sand-200" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="h-1 bg-gradient-to-r from-primary via-secondary-500 to-primary" aria-hidden="true" />
      <div className="container-site grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-sand-300">
            Training in Kathak, the classical dance of North India, through a structured eight-level curriculum rooted in
            the guru–shishya tradition.
          </p>
          {socials.length > 0 && (
            <ul className="mt-5 flex gap-3">
              {socials.map(([key, url]) => (
                <li key={key}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full border border-sand-300/30 px-3 py-1.5 text-xs font-medium text-sand-100 hover:border-secondary-400 hover:text-secondary-300"
                  >
                    {SOCIAL_LABELS[key]}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Footer">
          <h2 className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-secondary-300">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {PUBLIC_NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-sand-200 transition-colors hover:text-secondary-300">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/register" className="text-sand-200 transition-colors hover:text-secondary-300">
                Enrol
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-secondary-300">Visit &amp; contact</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2.5">
              <Icon name="mapPin" className="mt-0.5 h-4 w-4 shrink-0 text-secondary-400" />
              <span>{academy.address || academy.city}</span>
            </li>
            {academy.phones.map((p) => (
              <li key={p} className="flex gap-2.5">
                <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-secondary-400" />
                <a href={`tel:${p.replace(/\s+/g, '')}`} className="hover:text-secondary-300">
                  {p}
                </a>
              </li>
            ))}
            {academy.emails.map((e) => (
              <li key={e} className="flex gap-2.5">
                <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-secondary-400" />
                <a href={`mailto:${e}`} className="break-all hover:text-secondary-300">
                  {e}
                </a>
              </li>
            ))}
            {academy.hours && (
              <li className="flex gap-2.5">
                <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-secondary-400" />
                <span>{academy.hours}</span>
              </li>
            )}
            <li>
              <Link to="/contact" className="inline-flex items-center gap-1 font-medium text-secondary-300 hover:text-secondary-200">
                Send us a message <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sand-300/15">
        <div className="container-site flex flex-col gap-2 py-5 text-xs text-sand-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {academy.name}. All rights reserved.
          </p>
          <Link to="/login" className="hover:text-secondary-300">
            Student, teacher &amp; staff login
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
