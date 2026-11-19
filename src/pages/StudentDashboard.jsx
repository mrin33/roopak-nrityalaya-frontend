import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Icon from '../components/ui/Icon';
import RollNumberBadge from '../components/RollNumberBadge';
import PaymentWindowBadge from '../components/PaymentWindowBadge';
import LateFeeWarning from '../components/LateFeeWarning';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import useLevels from '../hooks/useLevels';
import { formatDate, toDate } from '../utils/date';
import studentService from '../services/studentService';

const QUICK_LINKS = [
  { to: '/student/schedule', icon: 'calendar', label: 'Class schedule' },
  { to: '/student/attendance', icon: 'clipboardCheck', label: 'Attendance' },
  { to: '/student/activity-log', icon: 'clipboardList', label: 'Log practice' },
  { to: '/student/resources', icon: 'book', label: 'Resources' },
  { to: '/student/makeup-classes', icon: 'refresh', label: 'Makeup class' },
  { to: '/student/reviews', icon: 'star', label: 'Reviews' },
];

const daysUntil = (date) => {
  const d = toDate(date);
  if (!d) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((d - today) / 86400000);
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const { levels } = useLevels();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setData(await studentService.getDashboard());
    } catch (err) {
      // No fabricated fallback data: show the error with a retry instead.
      setData(null);
      setError(err.message || 'Failed to load your dashboard. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <PageSkeleton label="Loading your dashboard…" variant="cards" />;
  if (!data) return <ErrorState message={error} onRetry={load} />;

  const levelId = data.current_level_id || user?.profile?.current_level_id;
  const level = levels.find((l) => l.level_id === levelId);
  const levelNumber = level?.level_number || levelId || 1;
  const totalLevels = levels.length || 8;
  const progress = Math.round((levelNumber / totalLevels) * 100);
  const firstName = (data.full_name || user?.profile?.full_name || '').split(' ')[0];
  const batch = data.batchInfo;
  const paid = data.feeStatus === 'paid';

  return (
    <div className="page">
      <PageHeader
        eyebrow="Student portal"
        title={firstName ? `Namaste, ${firstName}` : 'Welcome'}
        description="Your classes, progress and fees at a glance."
        actions={data.roll_number && <RollNumberBadge rollNumber={data.roll_number} size="lg" showFull />}
      />

      {data.has_late_fee && (
        <div className="mb-6">
          <LateFeeWarning
            hasLateFee={data.has_late_fee}
            lateFeeAmount={data.late_fee_amount}
            daysUntilLateFee={daysUntil(data.next_due_date)}
            nextDueDate={data.next_due_date}
          />
        </div>
      )}

      {/* Level progress + key stats */}
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-xl bg-accent p-6 text-sand-100 lg:col-span-1">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border-[18px] border-secondary-500/15" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-300">Current level</p>
          <p className="mt-3 font-heading text-2xl font-semibold text-sand-50">{level?.level_name || `Level ${levelNumber}`}</p>
          <p className="mt-1 text-sm text-sand-300">
            Level {levelNumber} of {totalLevels}
          </p>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Curriculum progress">
            <div className="h-full rounded-full bg-secondary-400" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs text-sand-400">{progress}% of the curriculum</p>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          <StatCard label="Attendance" value={`${data.attendancePercentage || 0}%`} hint="Last 30 days" icon="clipboardCheck" tone="success" to="/student/attendance" />
          <StatCard label="Performance" value={data.performance_score || '—'} hint="Out of 100 · attendance, practice &amp; exams" icon="star" tone="gold" to="/student/reviews" />
          <div className="card col-span-2 sm:col-span-1">
            <p className="text-sm font-medium text-gray-600">Fee plan</p>
            <div className="mt-3">
              <PaymentWindowBadge paymentWindow={data.payment_window} discount={data.discount} />
            </div>
            <p className="mt-3 text-xs text-gray-500">
              {data.next_due_date ? `Next due ${formatDate(data.next_due_date, { day: 'numeric', month: 'short', year: 'numeric' })}` : 'No upcoming due date'}
            </p>
          </div>
          <Link to="/student/fees" className={`card card-interactive col-span-2 flex items-center gap-4 sm:col-span-1 ${paid ? '' : 'border-amber-200 bg-amber-50/60'}`}>
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${paid ? 'bg-green-50 text-green-700' : 'bg-amber-100 text-amber-800'}`}>
              <Icon name={paid ? 'checkCircle' : 'clock'} className="h-6 w-6" />
            </span>
            <span>
              <span className="block font-semibold text-accent">{paid ? 'Fees up to date' : 'Payment pending'}</span>
              <span className="block text-xs text-gray-500">{paid ? 'Nothing due right now' : 'Pay at the academy office'}</span>
            </span>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Batch */}
          <section className="card" aria-labelledby="batch-heading">
            <div className="mb-4 flex items-center justify-between">
              <h2 id="batch-heading" className="section-title">
                Your batch
              </h2>
              {batch && (
                <Link to="/student/schedule" className="text-sm font-semibold text-primary hover:text-primary-700">
                  Full schedule
                </Link>
              )}
            </div>
            {batch ? (
              <>
                <div className="flex items-start gap-4 rounded-lg bg-sand-50 p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
                    <Icon name="collection" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-accent">{batch.batchName || batch.batch_name}</p>
                    {batch.schedule && <p className="text-sm text-gray-600">{batch.schedule}</p>}
                    <p className="mt-1 text-sm text-gray-500">
                      Teacher: <span className="font-medium text-accent">{batch.teacherName || batch.teacher_name || '—'}</span>
                    </p>
                  </div>
                </div>
                {data.upcomingClasses?.length > 0 && (
                  <div className="mt-5">
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Upcoming classes</h3>
                    <ul className="divide-y divide-sand-100">
                      {data.upcomingClasses.map((c, i) => (
                        <li key={i} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                          <span className="font-medium text-accent">
                            {formatDate(c.date, { weekday: 'short', day: 'numeric', month: 'short' })}
                          </span>
                          <span className="text-gray-600">{c.time}</span>
                          {c.type && <span className="badge-brand">{c.type}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <EmptyState icon="calendar" size="sm" title="No batch assigned yet" description="The academy will place you in a batch soon; it will appear here." />
            )}
          </section>

          {/* Notices */}
          <section className="card" aria-labelledby="notices-heading">
            <div className="mb-4 flex items-center justify-between">
              <h2 id="notices-heading" className="section-title">
                Recent notices
              </h2>
              <Link to="/notices" className="text-sm font-semibold text-primary hover:text-primary-700">
                View all
              </Link>
            </div>
            {data.recentNotices?.length ? (
              <ul className="divide-y divide-sand-100">
                {data.recentNotices.map((n) => (
                  <li key={n.id} className="flex items-start gap-3 py-3">
                    <Icon name="megaphone" className="mt-0.5 h-5 w-5 shrink-0 text-secondary-600" />
                    <div className="min-w-0">
                      <p className="font-medium text-accent">{n.title}</p>
                      <p className="text-xs text-gray-500">{formatDate(n.date)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState icon="megaphone" size="sm" title="No recent notices" />
            )}
          </section>
        </div>

        {/* Quick links */}
        <aside className="card h-fit" aria-labelledby="quick-heading">
          <h2 id="quick-heading" className="section-title mb-4">
            Quick links
          </h2>
          <ul className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {QUICK_LINKS.map((q) => (
              <li key={q.to}>
                <Link to={q.to} className="flex items-center gap-3 rounded-lg border border-sand-200 px-3 py-2.5 text-sm font-medium text-accent transition-colors hover:border-primary-200 hover:bg-primary-50/50">
                  <Icon name={q.icon} className="h-5 w-5 text-primary" />
                  {q.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default StudentDashboard;
