import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { PageHero, TeacherAvatar, usePageTitle } from '../components/public/Sections';
import publicService from '../services/publicService';

const FILTERS = [
  ['all', 'All teachers'],
  ['senior', 'Senior faculty'],
  ['regular', 'Teaching faculty'],
];

const TeachersPage = () => {
  usePageTitle('Teachers');
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const rows = await publicService.getTeachers();
      setTeachers(
        rows.map((t) => ({
          id: t.id,
          name: t.full_name,
          specialization: t.specialization || 'Kathak',
          experience: Number(t.experience_years) || 0,
          qualification: t.qualifications,
          bio: t.bio,
          isSenior: t.is_senior,
          // Only absolute photo URLs are publicly reachable.
          photoUrl: t.photo_url && /^https?:\/\//.test(t.photo_url) ? t.photo_url : null,
        }))
      );
    } catch (err) {
      setError(err.message || 'Could not load our teachers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = {
    all: teachers.length,
    senior: teachers.filter((t) => t.isSenior).length,
    regular: teachers.filter((t) => !t.isSenior).length,
  };
  const shown = teachers.filter((t) => (filter === 'senior' ? t.isSenior : filter === 'regular' ? !t.isSenior : true));

  return (
    <>
      <PageHero
        eyebrow="Faculty"
        title="Our teachers"
        description="Meet the teachers who guide our students through every level of Kathak training."
      />

      <section className="section">
        <div className="container-site">
          {error ? (
            <ErrorState message={error} onRetry={load} />
          ) : (
            <>
              {!loading && counts.senior > 0 && counts.regular > 0 && (
                <div className="mb-10 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter teachers">
                  {FILTERS.map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={filter === key}
                      onClick={() => setFilter(key)}
                      className={filter === key ? 'tab-active' : 'tab border border-sand-200 bg-white'}
                    >
                      {label} <span className="ml-1 opacity-70">({counts[key]})</span>
                    </button>
                  ))}
                </div>
              )}

              {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="card space-y-3 text-center">
                      <Skeleton className="mx-auto h-28 w-28 rounded-full" />
                      <Skeleton className="mx-auto h-5 w-40" />
                      <Skeleton className="mx-auto h-3 w-24" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  ))}
                </div>
              ) : shown.length === 0 ? (
                <EmptyState icon="user" title="Teacher profiles will appear here soon" description="Our faculty listing is being updated." />
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {shown.map((t) => (
                    <article key={t.id} className="card flex flex-col items-center text-center animate-rise-in">
                      <div className="relative">
                        <TeacherAvatar name={t.name} photoUrl={t.photoUrl} className="h-28 w-28 text-3xl" />
                        {t.isSenior && (
                          <span className="badge-gold absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white shadow-sm">Senior faculty</span>
                        )}
                      </div>
                      <h2 className="mt-6 font-heading text-xl font-semibold text-accent">{t.name}</h2>
                      <p className="text-sm font-medium text-secondary-700">{t.specialization}</p>
                      {t.experience > 0 && (
                        <p className="mt-1 text-xs text-gray-500">
                          {t.experience} year{t.experience === 1 ? '' : 's'} of experience
                        </p>
                      )}
                      {t.qualification && (
                        <p className="mt-4 w-full border-t border-sand-200 pt-4 text-sm text-gray-600">
                          <span className="font-medium text-accent">Qualifications: </span>
                          {t.qualification}
                        </p>
                      )}
                      {t.bio && <p className="mt-3 text-sm leading-relaxed text-gray-600">{t.bio}</p>}
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="border-t border-sand-200 bg-sand-100">
        <div className="container-site flex flex-col items-center gap-5 py-14 text-center">
          <h2 className="font-heading text-2xl font-semibold text-accent sm:text-3xl">Interested in teaching with us?</h2>
          <p className="max-w-2xl text-gray-600">
            If you are a trained Kathak dancer who would like to teach, send us a message with your background and experience.
          </p>
          <Link to="/contact" className="btn-primary">
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
};

export default TeachersPage;
