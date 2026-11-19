import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import Icon from '../components/ui/Icon';
import StarRating from '../components/StarRating';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import studentService from '../services/studentService';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/date';

const CRITERIA = [
  ['technique_rating', 'Technique'],
  ['rhythm_rating', 'Rhythm'],
  ['creativity_rating', 'Creativity'],
  ['discipline_rating', 'Discipline'],
];
const periodKey = (r) => `${r.review_year}-${String(r.review_month).padStart(2, '0')}`;
const periodLabel = (r) => new Date(r.review_year, r.review_month - 1, 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' });

const StudentReviews = () => {
  const toast = useToast();
  const [reviews, setReviews] = useState([]);
  const [period, setPeriod] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const rows = await studentService.getReviews();
      setReviews(rows.map((r) => ({ ...r, id: r.review_id, overall_rating: Number(r.overall_rating) })));
    } catch (err) {
      setError(err.message || 'Could not load your reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markAsViewed = async (id) => {
    try {
      await studentService.markReviewViewed(id);
      setReviews((list) => list.map((r) => (r.id === id ? { ...r, is_viewed_by_student: true } : r)));
    } catch (err) {
      toast.error(err.message || 'Could not update the review.');
    }
  };

  const periods = useMemo(() => {
    const seen = new Map();
    reviews.forEach((r) => seen.set(periodKey(r), periodLabel(r)));
    return [...seen.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [reviews]);

  const shown = period === 'all' ? reviews : reviews.filter((r) => periodKey(r) === period);
  const unread = reviews.filter((r) => !r.is_viewed_by_student).length;
  const avg = (key) => (reviews.length ? reviews.reduce((s, r) => s + Number(r[key] || 0), 0) / reviews.length : 0);

  if (loading) return <PageSkeleton label="Loading reviews…" variant="cards" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="page">
      <PageHeader title="Teacher reviews" description="Monthly feedback from your teacher on your progress." />

      {unread > 0 && (
        <div className="callout-info mb-6 flex gap-3">
          <Icon name="info" className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            You have <strong>{unread}</strong> new review{unread > 1 ? 's' : ''} to read.
          </p>
        </div>
      )}

      {reviews.length > 0 && (
        <section className="card mb-6" aria-labelledby="avg-heading">
          <h2 id="avg-heading" className="section-title mb-4">
            Your averages
          </h2>
          <dl className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {CRITERIA.map(([key, label]) => (
              <div key={key}>
                <dt className="text-sm text-gray-600">{label}</dt>
                <dd className="mt-1 flex items-center gap-3">
                  <span className="font-heading text-2xl font-semibold tabular-nums text-accent">{avg(key).toFixed(1)}</span>
                  <StarRating rating={avg(key)} size="sm" label={label} />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {reviews.length === 0 ? (
        <div className="surface">
          <EmptyState icon="star" title="No reviews yet" description="Your teacher’s monthly reviews will appear here." size="lg" />
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600" aria-live="polite">
              Showing {shown.length} of {reviews.length} reviews
            </p>
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="input-field sm:w-56" aria-label="Filter by month">
              <option value="all">All months</option>
              {periods.map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <ul className="space-y-4">
            {shown.map((r) => (
              <li key={r.id}>
                <article className={`card ${r.is_viewed_by_student ? '' : 'ring-2 ring-sky-200'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-heading text-xl font-semibold text-accent">{periodLabel(r)}</h2>
                        {!r.is_viewed_by_student && <span className="badge-info">New</span>}
                      </div>
                      <p className="mt-0.5 text-sm text-gray-600">by {r.teacher_name}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-heading text-3xl font-semibold tabular-nums text-primary">{r.overall_rating.toFixed(1)}</p>
                      <p className="text-xs text-gray-500">overall</p>
                    </div>
                  </div>

                  <dl className="mt-5 grid grid-cols-2 gap-4 border-y border-sand-100 py-4 md:grid-cols-4">
                    {CRITERIA.map(([key, label]) => (
                      <div key={key}>
                        <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
                        <dd className="mt-1">
                          <StarRating rating={r[key]} size="sm" showNumber label={label} />
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <figure className="mt-4">
                    <figcaption className="text-sm font-medium text-gray-500">Teacher’s comments</figcaption>
                    <blockquote className="mt-1.5 border-l-2 border-secondary-400 pl-4 italic text-gray-700">
                      {r.review_text || 'No written comments.'}
                    </blockquote>
                  </figure>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-xs text-gray-500">Posted {formatDate(r.created_at)}</p>
                    {!r.is_viewed_by_student && (
                      <button type="button" onClick={() => markAsViewed(r.id)} className="btn-secondary btn-sm">
                        <Icon name="check" className="h-4 w-4" /> Mark as read
                      </button>
                    )}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default StudentReviews;
