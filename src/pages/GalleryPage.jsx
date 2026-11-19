import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import Modal from '../components/ui/Modal';
import Icon from '../components/ui/Icon';
import { Skeleton } from '../components/ui/Skeleton';
import { PageHero, usePageTitle } from '../components/public/Sections';
import publicService from '../services/publicService';
import { useAuth } from '../context/AuthContext';

const MEDIA = [
  ['all', 'All'],
  ['photo', 'Photos'],
  ['video', 'Videos'],
];

const GalleryPage = () => {
  usePageTitle('Gallery');
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [year, setYear] = useState('all');
  const [category, setCategory] = useState('all');
  const [media, setMedia] = useState('all');
  const [active, setActive] = useState(null); // index into `shown`

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const rows = await publicService.getGallery();
      setItems(
        rows.map((g) => ({
          id: g.id,
          type: g.media_type,
          category: g.category || 'General',
          year: g.year,
          caption: g.title,
          description: g.description,
          url: publicService.mediaUrl(g.media_url),
        }))
      );
    } catch (err) {
      setError(err.message || 'Could not load the gallery');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const years = useMemo(() => [...new Set(items.map((i) => i.year).filter(Boolean))].sort((a, b) => b - a), [items]);
  const categories = useMemo(() => [...new Set(items.map((i) => i.category))].sort(), [items]);
  const shown = items.filter(
    (i) =>
      (year === 'all' || i.year === Number(year)) &&
      (category === 'all' || i.category === category) &&
      (media === 'all' || i.type === media)
  );
  const current = active !== null ? shown[active] : null;

  // Arrow keys move through the lightbox.
  useEffect(() => {
    if (active === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setActive((i) => (i + 1) % shown.length);
      if (e.key === 'ArrowLeft') setActive((i) => (i - 1 + shown.length) % shown.length);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active, shown.length]);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Performances, classes and celebrations"
        description="Photos and videos from performances, workshops and events at Roopak Nrityalaya."
      />

      <section className="section pt-10 sm:pt-12">
        <div className="container-site">
          {error ? (
            <ErrorState message={error} onRetry={load} />
          ) : loading ? (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className={`mb-4 w-full ${i % 2 ? 'h-56' : 'h-72'}`} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState icon="image" title="The gallery is being prepared" description="Photos from our classes and performances will appear here soon." size="lg" />
          ) : (
            <>
              {/* Filters */}
              <div className="mb-8 flex flex-col gap-4 rounded-xl border border-sand-200 bg-white p-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-wrap gap-1.5" role="group" aria-label="Media type">
                  {MEDIA.map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={media === key}
                      onClick={() => setMedia(key)}
                      className={media === key ? 'tab-active' : 'tab'}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3 sm:flex">
                  <label className="block">
                    <span className="sr-only">Event or category</span>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field sm:w-48">
                      <option value="all">All events</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="sr-only">Year</span>
                    <select value={year} onChange={(e) => setYear(e.target.value)} className="input-field sm:w-36">
                      <option value="all">All years</option>
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <p className="mb-4 text-sm text-gray-500" aria-live="polite">
                Showing {shown.length} of {items.length}
              </p>

              {shown.length === 0 ? (
                <EmptyState icon="image" title="Nothing matches these filters" description="Try another event, year or media type." />
              ) : (
                <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                  {shown.map((item, idx) => (
                    <li key={item.id} className="mb-4 break-inside-avoid">
                      <button
                        type="button"
                        onClick={() => setActive(idx)}
                        className="group relative block w-full overflow-hidden rounded-xl bg-sand-100 text-left"
                        aria-label={`Open ${item.type}: ${item.caption || item.category}`}
                      >
                        {item.type === 'video' ? (
                          <div className="relative">
                            <video src={item.url} className="aspect-video w-full object-cover" preload="metadata" muted />
                            <span className="absolute inset-0 flex items-center justify-center bg-accent-dark/20">
                              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-primary shadow-lift">
                                <svg className="ml-1 h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </span>
                            </span>
                          </div>
                        ) : (
                          <img
                            loading="lazy"
                            src={item.url}
                            alt={item.caption || item.category}
                            className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        )}
                        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-accent-dark/80 to-transparent p-4 pt-10 text-sand-50 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
                          <span className="block text-sm font-semibold">{item.caption}</span>
                          <span className="block text-xs text-sand-200">
                            {item.category}
                            {item.year ? ` · ${item.year}` : ''}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </section>

      <section className="border-t border-sand-200 bg-sand-100">
        <div className="container-site flex flex-col items-center gap-4 py-12 text-center">
          <h2 className="font-heading text-2xl font-semibold text-accent">Share your memories</h2>
          <p className="max-w-xl text-gray-600">
            Students can submit photos and videos from academy events through the student portal; they appear here once
            approved.
          </p>
          {user?.role === 'student' ? (
            <Link to="/student/gallery-upload" className="btn-primary">
              <Icon name="upload" className="h-4 w-4" /> Share photos
            </Link>
          ) : (
            <Link to="/contact" className="btn-secondary">
              Contact the academy
            </Link>
          )}
        </div>
      </section>

      {current && (
        <Modal open onClose={() => setActive(null)} title={current.caption || current.category} size="xl"
          description={`${current.category}${current.year ? ` · ${current.year}` : ''}`}>
          <div className="-mx-5 -mt-5 bg-accent-dark sm:-mx-6">
            {current.type === 'video' ? (
              <video key={current.id} src={current.url} controls autoPlay className="max-h-[70vh] w-full" />
            ) : (
              <img src={current.url} alt={current.caption || current.category} className="mx-auto max-h-[70vh] w-auto object-contain" />
            )}
          </div>
          {current.description && <p className="mt-4 text-sm text-gray-600">{current.description}</p>}
          {shown.length > 1 && (
            <div className="modal-actions sm:justify-between">
              <button type="button" className="btn-secondary" onClick={() => setActive((i) => (i - 1 + shown.length) % shown.length)}>
                <Icon name="chevronLeft" className="h-4 w-4" /> Previous
              </button>
              <span className="hidden self-center text-xs text-gray-500 sm:block">
                {active + 1} / {shown.length}
              </span>
              <button type="button" className="btn-secondary" onClick={() => setActive((i) => (i + 1) % shown.length)}>
                Next <Icon name="chevronRight" className="h-4 w-4" />
              </button>
            </div>
          )}
        </Modal>
      )}
    </>
  );
};

export default GalleryPage;
