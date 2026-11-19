import React, { useState, useEffect, useCallback } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import StarRating from '../components/StarRating';
import RollNumberBadge from '../components/RollNumberBadge';
import PerformanceGraph from '../components/PerformanceGraph';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import adminService from '../services/adminService';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({ bestTeachers: [], bestStudents: [], enrollmentTrends: [], discontinuationReasons: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [bestTeachers, bestStudents, enrollmentTrends, discontinuationReasons] = await Promise.all([
        adminService.getBestTeachers(),
        adminService.getBestStudents(),
        adminService.getEnrollmentTrends(),
        adminService.getDiscontinuationReasons(),
      ]);
      setAnalytics({
        bestTeachers: bestTeachers.map((t) => ({ ...t, id: t.teacher_id, avg_rating: Number(t.avg_rating) || 0 })),
        bestStudents,
        enrollmentTrends,
        discontinuationReasons,
      });
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) return <PageSkeleton label="Loading analytics…" variant="cards" />;
  if (error) return <ErrorState message={error} onRetry={fetchAnalytics} />;

  const maxReason = Math.max(1, ...analytics.discontinuationReasons.map((r) => r.count));
  const totalDiscontinued = analytics.discontinuationReasons.reduce((s, r) => s + r.count, 0);
  const totalEnrolled = analytics.enrollmentTrends.reduce((s, t) => s + Number(t.enrolled || 0), 0);

  return (
    <div className="page">
      <PageHeader title="Analytics" description="Enrolment, teacher ratings and student performance, from academy records." />

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <section className="card" aria-labelledby="trend-heading">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 id="trend-heading" className="section-title">
              New enrolments by month
            </h2>
            <p className="text-sm text-gray-500">
              <span className="font-semibold tabular-nums text-accent">{totalEnrolled}</span> in this period
            </p>
          </div>
          {analytics.enrollmentTrends.length === 0 ? (
            <EmptyState icon="chart" size="sm" title="No enrolments recorded yet" />
          ) : (
            <PerformanceGraph
              data={analytics.enrollmentTrends.map((t) => ({ label: t.month, value: Number(t.enrolled) || 0 }))}
              maxValue={Math.max(5, ...analytics.enrollmentTrends.map((t) => Number(t.enrolled) || 0))}
              height={220}
            />
          )}
        </section>

        <section className="card" aria-labelledby="reasons-heading">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 id="reasons-heading" className="section-title">
              Why students discontinued
            </h2>
            <p className="text-sm text-gray-500">
              <span className="font-semibold tabular-nums text-accent">{totalDiscontinued}</span> in total
            </p>
          </div>
          {analytics.discontinuationReasons.length === 0 ? (
            <EmptyState icon="chart" size="sm" title="No discontinuations recorded" />
          ) : (
            <ul className="space-y-3">
              {analytics.discontinuationReasons.map((r) => (
                <li key={r.reason} title={`${r.reason}: ${r.count}`}>
                  <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                    <span className="text-gray-700">{r.reason}</span>
                    <span className="font-medium tabular-nums text-accent">{r.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-sand-200" aria-hidden="true">
                    <div className="h-full rounded-full bg-primary-500" style={{ width: `${(r.count / maxReason) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="card mb-6" aria-labelledby="teachers-heading">
        <h2 id="teachers-heading" className="section-title">
          Highest-rated teachers
        </h2>
        <p className="mb-4 mt-1 text-sm text-gray-500">Average rating from student feedback.</p>
        {analytics.bestTeachers.length === 0 ? (
          <EmptyState icon="teacher" size="sm" title="No active teachers yet" />
        ) : (
          <ol className="grid gap-3 md:grid-cols-3">
            {analytics.bestTeachers.map((t, i) => (
              <li key={t.id} className={`rounded-xl border p-5 ${i === 0 ? 'border-secondary-300 bg-secondary-50/60' : 'border-sand-200'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-heading text-2xl font-semibold text-secondary-700">#{i + 1}</span>
                  <StarRating rating={t.avg_rating} size="sm" label={`${t.name} rating`} />
                </div>
                <p className="mt-3 font-semibold text-accent">{t.name}</p>
                <p className="text-sm text-gray-600">
                  {t.avg_rating.toFixed(1)} / 5 · {t.total_students} students · {t.experience_years ?? 0} yrs
                </p>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="surface overflow-hidden" aria-labelledby="students-heading">
        <div className="border-b border-sand-200 px-5 py-4">
          <h2 id="students-heading" className="section-title">
            Top students
          </h2>
          <p className="mt-1 text-sm text-gray-500">Score = average teacher review × 20. Attendance covers the last 90 days.</p>
        </div>
        {analytics.bestStudents.length === 0 ? (
          <EmptyState icon="users" size="sm" title="No active students yet" />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col" className="w-12">
                    #
                  </th>
                  <th scope="col">Student</th>
                  <th scope="col">Score</th>
                  <th scope="col" className="text-right">
                    Attendance
                  </th>
                  <th scope="col" className="hidden text-right sm:table-cell">
                    Practice
                  </th>
                </tr>
              </thead>
              <tbody>
                {analytics.bestStudents.map((s, i) => (
                  <tr key={s.roll_number || i}>
                    <td className="font-heading font-semibold text-secondary-700">{i + 1}</td>
                    <td>
                      <p className="font-medium text-accent">{s.name}</p>
                      <RollNumberBadge rollNumber={s.roll_number} size="sm" />
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="w-8 font-medium tabular-nums text-accent">{s.performance_score}</span>
                        <div className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-sand-200 sm:block" aria-hidden="true">
                          <div className="h-full rounded-full bg-primary-500" style={{ width: `${Math.min(Number(s.performance_score) || 0, 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="text-right tabular-nums">{s.attendance}%</td>
                    <td className="hidden text-right tabular-nums sm:table-cell">{s.practice_hours}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminAnalytics;
