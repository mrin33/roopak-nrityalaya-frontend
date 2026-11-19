import React, { useState } from 'react';
import Icon from '../ui/Icon';
import { LogoMark } from '../ui/Logo';
import { Ornament } from './Sections';

/** Two-panel layout for login / registration / password pages. */
export const AuthShell = ({ title, subtitle, children, aside, wide = false }) => (
  <section className="bg-sand-100">
    <div className="container-site py-10 sm:py-16">
      <div className={`mx-auto grid overflow-hidden rounded-3xl bg-white shadow-lift lg:grid-cols-5 ${wide ? 'max-w-6xl' : 'max-w-5xl'}`}>
        <div className="relative hidden flex-col justify-between overflow-hidden bg-accent p-10 text-sand-100 lg:col-span-2 lg:flex">
          <div
            className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full border-[36px] border-secondary-500/15"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -left-16 top-24 h-40 w-40 rounded-full border-[18px] border-primary-400/20"
            aria-hidden="true"
          />
          <LogoMark className="relative h-14 w-14" />
          <div className="relative">
            <Ornament />
            {aside || (
              <>
                <p className="mt-5 font-heading text-3xl font-semibold leading-snug text-sand-50">
                  Rhythm, grace and the art of storytelling.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-sand-300">
                  Your attendance, fees, schedule, reviews and learning resources — all in one place.
                </p>
              </>
            )}
          </div>
        </div>
        <div className="p-6 sm:p-10 lg:col-span-3 lg:p-12">
          <h1 className="font-heading text-3xl font-semibold text-accent">{title}</h1>
          {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  </section>
);

/** Password field with a show/hide toggle. */
export const PasswordInput = ({ id, value, onChange, autoComplete = 'current-password', ...rest }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className="input-field pr-11"
        {...rest}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-gray-500 hover:text-accent"
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
      >
        <Icon name={visible ? 'eyeOff' : 'eye'} className="h-5 w-5" />
      </button>
    </div>
  );
};

/** Live checklist for the password policy (≥ 8 chars, a letter, a number). */
export const PasswordRules = ({ password }) => {
  const rules = [
    [password.length >= 8, 'At least 8 characters'],
    [/[A-Za-z]/.test(password), 'Contains a letter'],
    [/\d/.test(password), 'Contains a number'],
  ];
  return (
    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs" aria-label="Password requirements">
      {rules.map(([ok, label]) => (
        <li key={label} className={`flex items-center gap-1 ${ok ? 'text-green-700' : 'text-gray-500'}`}>
          <Icon name={ok ? 'checkCircle' : 'info'} className="h-3.5 w-3.5" />
          {label}
          <span className="sr-only">{ok ? '(met)' : '(not met)'}</span>
        </li>
      ))}
    </ul>
  );
};

export const passwordValid = (p) => p.length >= 8 && /[A-Za-z]/.test(p) && /\d/.test(p);
