import React, { useCallback, useEffect, useMemo, useState } from 'react';
import noticeService from '../services/noticeService';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { PageHero, usePageTitle } from '../components/public/Sections';
import { toDate, formatDate } from '../utils/date';
import { useAuth } from '../context/AuthContext';

const AUDIENCE = { all: 'Everyone', students: 'Students', teachers: 'Teachers', parents: 'Parents' };

/** Date tile shown beside each notice. */
const DateTile = ({ value }) => {
  const d = toDate(value);
  if (!d || Number.isNaN(d.getTime())) return null;
  return (
    <div className="flex w-16 shrink-0 flex-col items-center rounded-lg border border-sand-200 bg-sand-50 py-2 text-center" aria-hidden="true">
      <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-secondary-700">
        {d.toLocaleDateString('en-IN', { month: 'short' })}
      </span>
      <span className="font-heading text-2xl font-semibold leading-none text-accent">{d.getDate()}</span>
      <span className="mt-0.5 text-[0.65rem] text-gray-500">{d.getFullYear()}</span>
    </div>
  );
};

const NoticesPage = () => {
  usePageTitle('Notices');
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('all');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setNotices(await noticeService.getNotices());
    } catch (err) {
      setError(err.message || 'Could not load notices.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Only offer categories that actually have notices.
  const categories = useMemo(() => [...new Set(notices.map((n) => n.category || 'general'))].sort(), [notices]);
  const shown = notices.filter((n) => category === 'all' || (n.category || 'general') === category);

  return (
    <>
      <PageHero
        eyebrow="Notice board"
        title="Notices & announcements"
        description="News, schedules and important information from Roopak Nrityalaya."
      >
        {!user && (
          <p className="mx-auto mt-4 max-w-xl text-sm text-gray-500">Students and teachers see additional notices after logging in.</p>
        )}
      </PageHero>

      <section className="section pt-10 sm:pt-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {error ? (
            <ErrorState message={error} onRetry={load} />
          ) : loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card flex gap-4">
                  <Skeleton className="h-20 w-16" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : notices.length === 0 ? (
            <EmptyState icon="megaphone" title="No notices at the moment" description="New announcements will be posted here." size="lg" />
          ) : (
            <>
              {categories.length > 1 && (
                <div className="mb-8 flex flex-wrap gap-1.5" role="group" aria-label="Filter by category">
                  {['all', ...categories].map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={category === c}
                      onClick={() => setCategory(c)}
                      className={`${category === c ? 'tab-active' : 'tab border border-sand-200 bg-white'} capitalize`}
                    >
                      {c === 'all' ? 'All' : c}
                    </button>
                  ))}
                </div>
              )}
              <ul className="space-y-4">
                {shown.map((n) => (
                  <li key={n.id}>
                    <article className={`card flex gap-4 sm:gap-5 ${n.is_important ? 'border-l-4 border-l-primary' : ''}`}>
                      <DateTile value={n.created_at} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="badge-gold capitalize">{n.category || 'general'}</span>
                          {n.is_important && <span className="badge-danger">Important</span>}
                          {n.target_audience && n.target_audience !== 'all' && (
                            <span className="badge-neutral">For {AUDIENCE[n.target_audience] || n.target_audience}</span>
                          )}
                        </div>
                        <h2 className="mt-2 font-heading text-xl font-semibold leading-snug text-accent">{n.title}</h2>
                        <p className="mt-2 whitespace-pre-wrap leading-relaxed text-gray-700">{n.content}</p>
                        <p className="mt-3 text-xs text-gray-500">
                          Posted {formatDate(n.created_at)}
                          {n.expiry_date && ` · Valid until ${formatDate(n.expiry_date)}`}
                        </p>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default NoticesPage;
