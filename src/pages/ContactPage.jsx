import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import publicService from '../services/publicService';
import academy from '../config/academy';
import Icon from '../components/ui/Icon';
import { PageHero, SectionHeading, usePageTitle } from '../components/public/Sections';

const SUBJECTS = ['Admission enquiry', 'Batches & timings', 'Fees', 'General enquiry', 'Feedback', 'Collaboration', 'Other'];

// Answers describe how the academy's system actually works.
const FAQS = [
  {
    q: 'How do I enrol?',
    a: (
      <>
        Create an account on the <Link to="/register" className="font-medium text-primary underline-offset-2 hover:underline">registration page</Link>,
        choosing your level and payment plan. The academy then places you in a suitable batch, which appears in your
        student portal.
      </>
    ),
  },
  {
    q: 'How many levels are there?',
    a: (
      <>
        Eight, from Praveshika Pratham to Alankar Purna. Each level is described on the{' '}
        <Link to="/about#levels" className="font-medium text-primary underline-offset-2 hover:underline">About page</Link>.
      </>
    ),
  },
  {
    q: 'What are the fees?',
    a: (
      <>
        Fees depend on your level and on the payment plan (monthly, quarterly, half-yearly or yearly; longer plans are
        discounted). The current fee table is on the{' '}
        <Link to="/about#fees" className="font-medium text-primary underline-offset-2 hover:underline">About page</Link>.
      </>
    ),
  },
  {
    q: 'How are fees paid?',
    a: 'Fees are paid at the academy office, and each payment is recorded in your student portal. Online payment is not available yet.',
  },
  {
    q: 'What if I miss a class?',
    a: 'Students can request a makeup class from the student portal; your teacher reviews the request and schedules it.',
  },
];

const ContactCard = ({ icon, title, children }) => (
  <div className="flex gap-4">
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
      <Icon name={icon} className="h-5 w-5" />
    </span>
    <div className="min-w-0 text-sm">
      <h3 className="font-body text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h3>
      <div className="mt-1 text-base text-accent">{children}</div>
    </div>
  </div>
);

const EMPTY = { name: '', email: '', phone: '', subject: '', message: '' };

const ContactPage = () => {
  usePageTitle('Contact');
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [error, setError] = useState('');
  const socials = Object.entries(academy.social).filter(([, url]) => url);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await publicService.sendContactMessage(form);
      setStatus('success');
      setForm(EMPTY);
    } catch (err) {
      setError(err.message || 'Your message could not be sent. Please try again.');
      setStatus('error');
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We’d love to hear from you"
        description="Questions about admissions, batches or fees? Send us a message and the academy will get back to you."
      />

      <section className="section">
        <div className="container-site grid gap-10 lg:grid-cols-5 lg:gap-16">
          {/* Details */}
          <div className="space-y-8 lg:col-span-2">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-accent">Get in touch</h2>
              <p className="mt-2 text-gray-600">
                The quickest way to reach us is the form on this page — messages go straight to the academy’s inbox.
              </p>
            </div>
            <ContactCard icon="mapPin" title="Location">
              <address className="not-italic">
                {academy.name}
                <br />
                {academy.address || academy.city}
              </address>
            </ContactCard>
            {academy.phones.length > 0 && (
              <ContactCard icon="phone" title="Phone">
                {academy.phones.map((p) => (
                  <a key={p} href={`tel:${p.replace(/\s+/g, '')}`} className="block hover:text-primary">
                    {p}
                  </a>
                ))}
                {academy.hours && <p className="mt-1 text-sm text-gray-500">{academy.hours}</p>}
              </ContactCard>
            )}
            {academy.emails.length > 0 && (
              <ContactCard icon="mail" title="Email">
                {academy.emails.map((e) => (
                  <a key={e} href={`mailto:${e}`} className="block break-all hover:text-primary">
                    {e}
                  </a>
                ))}
              </ContactCard>
            )}
            {socials.length > 0 && (
              <ContactCard icon="globe" title="Follow us">
                <div className="flex flex-wrap gap-2">
                  {socials.map(([key, url]) => (
                    <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="badge-neutral capitalize hover:bg-sand-200">
                      {key}
                    </a>
                  ))}
                </div>
              </ContactCard>
            )}
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="card sm:p-8">
              <h2 className="font-heading text-2xl font-semibold text-accent">Send a message</h2>
              {status === 'success' ? (
                <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-6 text-center" role="status">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <Icon name="check" className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-body text-lg font-semibold text-green-900">Message received</h3>
                  <p className="mt-1 text-sm text-green-800">Thank you for writing to us. The academy will reply to the email address you provided.</p>
                  <button type="button" className="btn-secondary mt-5" onClick={() => setStatus('idle')}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 grid gap-5 sm:grid-cols-2" noValidate={false}>
                  <div>
                    <label htmlFor="name" className="form-label">
                      Full name <span className="text-primary">*</span>
                    </label>
                    <input id="name" name="name" value={form.name} onChange={handleChange} required maxLength={100} autoComplete="name" className="input-field" />
                  </div>
                  <div>
                    <label htmlFor="email" className="form-label">
                      Email <span className="text-primary">*</span>
                    </label>
                    <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required maxLength={255} autoComplete="email" className="input-field" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="form-label">
                      Phone <span className="font-normal text-gray-500">(optional)</span>
                    </label>
                    <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} maxLength={20} autoComplete="tel" className="input-field" />
                  </div>
                  <div>
                    <label htmlFor="subject" className="form-label">
                      Subject <span className="text-primary">*</span>
                    </label>
                    <select id="subject" name="subject" value={form.subject} onChange={handleChange} required className="input-field">
                      <option value="">Choose a subject</option>
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="message" className="form-label">
                      Message <span className="text-primary">*</span>
                    </label>
                    <textarea id="message" name="message" value={form.message} onChange={handleChange} required rows={6} maxLength={5000} className="input-field resize-y" placeholder="How can we help?" />
                  </div>
                  {status === 'error' && (
                    <div className="callout-danger sm:col-span-2" role="alert">
                      {error}
                    </div>
                  )}
                  <div className="sm:col-span-2">
                    <button type="submit" disabled={status === 'sending'} className="btn-primary btn-lg w-full sm:w-auto">
                      {status === 'sending' ? 'Sending…' : 'Send message'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {academy.mapEmbedUrl && (
        <section className="border-t border-sand-200">
          <iframe
            title={`Map showing ${academy.name}`}
            src={academy.mapEmbedUrl}
            className="h-80 w-full border-0 sm:h-96"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
      )}

      <section className="section border-t border-sand-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
          <div className="divide-y divide-sand-200 rounded-xl border border-sand-200 bg-sand-50">
            {FAQS.map((f) => (
              <details key={f.q} className="group px-5 py-4 sm:px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-accent [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Icon name="chevronDown" className="h-5 w-5 shrink-0 text-primary transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 leading-relaxed text-gray-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
