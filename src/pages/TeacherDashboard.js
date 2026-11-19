import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PageSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Icon from '../components/ui/Icon';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import teacherService from '../services/teacherService';
import noticeService from '../services/noticeService';
import { formatDate } from '../utils/date';

const QUICK_LINKS = [
  { to: '/teacher/attendance', icon: 'clipboardCheck', label: 'Mark attendance' },
  { to: '/teacher/review-students', icon: 'star', label: 'Monthly reviews' },
  { to: '/teacher/makeup-requests', icon: 'refresh', label: 'Makeup requests' },
  { to: '/teacher/resources', icon: 'upload', label: 'Share resources' },
];

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [stats, batches, profile, notices] = await Promise.all([
        teacherService.getDashboard(),
        teacherService.getBatches(),
        teacherService.getProfile(),
        noticeService.getNotices(),
      ]);
      setData({
        batches: batches.map((b) => ({
          id: b.batch_id,
          name: b.batch_name,
          level: b.level_name,
          students: b.active_students,
          schedule: [b.schedule, b.time].filter(Boolean).join(' · '),
        })),
        totalStudents: stats.total_students,
        classesToday: stats.classes_today,
        pendingAttendance: stats.pending_attendance,
        notices: notices.slice(0, 4),
        today: stats.today_batches.map((b) => ({
          id: b.batch_id,
          batch: b.batch_name,
          time: b.time,
          students: b.students,
          marked: b.attendance_marked,
        })),
        profile,
      });
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <PageSkeleton label="Loading dashboard…" variant="cards" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const name = data.profile?.full_name || user?.profile?.full_name || '';

  return (
    <div className="page">
      <PageHeader
        eyebrow="Teacher portal"
        title={name ? `Namaste, ${name.split(' ')[0]}` : 'Welcome'}
        description={formatDate(new Date(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        actions={
          <Link to="/teacher/attendance" className="btn-primary">
            <Icon name="clipboardCheck" className="h-4 w-4" /> Mark attendance
          </Link>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="My batches" value={data.batches.length} icon="collection" tone="brand" to="/teacher/batches" />
        <StatCard label="Active students" value={data.totalStudents} icon="users" tone="gold" to="/teacher/students" />
        <StatCard label="Classes today" value={data.classesToday} icon="calendar" tone="info" />
        <StatCard
          label="Attendance to mark"
          value={data.pendingAttendance}
          hint={data.pendingAttendance ? 'For today’s classes' : 'All caught up'}
          icon="clock"
          tone={data.pendingAttendance ? 'warning' : 'success'}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="card" aria-labelledby="today-heading">
            <h2 id="today-heading" className="section-title mb-4">
              Today’s classes
            </h2>
            {data.today.length === 0 ? (
              <EmptyState icon="calendar" size="sm" title="No classes scheduled for today" />
            ) : (
              <ul className="divide-y divide-sand-100">
                {data.today.map((c) => (
                  <li key={c.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-accent">{c.batch}</p>
                      <p className="text-sm text-gray-600">
                        {c.time || 'Time not set'} · {c.students} student{c.students === 1 ? '' : 's'}
                      </p>
                    </div>
                    {c.marked ? (
                      <Link to={`/teacher/attendance?batch=${c.id}`} className="btn-secondary btn-sm">
                        <Icon name="check" className="h-4 w-4 text-green-700" /> Saved — review
                      </Link>
                    ) : (
                      <Link to={`/teacher/attendance?batch=${c.id}`} className="btn-primary btn-sm">
                        Mark attendance
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card" aria-labelledby="batches-heading">
            <div className="mb-4 flex items-center justify-between">
              <h2 id="batches-heading" className="section-title">
                My batches
              </h2>
              <Link to="/teacher/batches" className="text-sm font-semibold text-primary hover:text-primary-700">
                View all
              </Link>
            </div>
            {data.batches.length === 0 ? (
              <EmptyState icon="collection" size="sm" title="No batches assigned yet" description="The academy office assigns batches to teachers." />
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {data.batches.map((b) => (
                  <li key={b.id} className="rounded-lg border border-sand-200 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-accent">{b.name}</p>
                        <p className="text-xs text-gray-500">{b.level}</p>
                      </div>
                      <span className="badge-brand shrink-0">{b.students} students</span>
                    </div>
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-600">
                      <Icon name="clock" className="h-4 w-4 text-gray-400" />
                      {b.schedule || '—'}
                    </p>
                    <div className="mt-3 flex gap-3 text-sm font-semibold">
                      <Link to={`/teacher/attendance?batch=${b.id}`} className="text-primary hover:text-primary-700">
                        Attendance
                      </Link>
                      <Link to="/teacher/students" className="text-primary hover:text-primary-700">
                        Students
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="card" aria-labelledby="quick-heading">
            <h2 id="quick-heading" className="section-title mb-4">
              Quick links
            </h2>
            <ul className="space-y-2">
              {QUICK_LINKS.map((q) => (
                <li key={q.to}>
                  <Link to={q.to} className="flex items-center gap-3 rounded-lg border border-sand-200 px-3 py-2.5 text-sm font-medium text-accent hover:border-primary-200 hover:bg-primary-50/50">
                    <Icon name={q.icon} className="h-5 w-5 text-primary" />
                    {q.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="card" aria-labelledby="notices-heading">
            <div className="mb-3 flex items-center justify-between">
              <h2 id="notices-heading" className="section-title">
                Notices
              </h2>
              <Link to="/notices" className="text-sm font-semibold text-primary hover:text-primary-700">
                All
              </Link>
            </div>
            {data.notices.length === 0 ? (
              <p className="text-sm text-gray-500">No current notices.</p>
            ) : (
              <ul className="divide-y divide-sand-100">
                {data.notices.map((n) => (
                  <li key={n.id} className="py-2.5">
                    <p className="text-sm font-medium text-accent">{n.title}</p>
                    <p className="text-xs text-gray-500">{formatDate(n.created_at)}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-xl bg-accent p-5 text-sand-100" aria-labelledby="profile-heading">
            <h2 id="profile-heading" className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-secondary-300">
              My profile
            </h2>
            <p className="mt-2 font-heading text-lg font-semibold text-sand-50">{name || '—'}</p>
            <p className="text-sm text-sand-300">{data.profile?.specialization || 'Kathak'}</p>
            <p className="mt-1 text-xs text-sand-400">{data.profile?.experience_years ?? 0} years of experience</p>
            <Link to="/teacher/profile" className="btn btn-sm mt-4 border border-sand-300/30 text-sand-50 hover:bg-white/10">
              <Icon name="pencil" className="h-4 w-4" /> Edit profile
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default TeacherDashboard;
