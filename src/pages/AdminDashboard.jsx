import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PageSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Icon from '../components/ui/Icon';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import adminService from '../services/adminService';
import { formatDate, toDate } from '../utils/date';

const inr = (n) => `₹${Math.round(Number(n) || 0).toLocaleString('en-IN')}`;
const sameMonth = (value, ref) => {
  const d = toDate(value);
  return !!d && d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
};

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [stats, students, fees, attendance] = await Promise.all([
        adminService.getDashboard(),
        adminService.getAllStudents(),
        adminService.getAllFees(),
        adminService.getAttendanceSummary(),
      ]);

      const now = new Date();
      const lastMonthRef = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const paid = fees.filter((f) => f.payment_status === 'paid');
      const outstanding = fees.filter((f) => f.payment_status === 'pending' || f.payment_status === 'overdue');
      const att = attendance.reduce(
        (acc, b) => ({ present: acc.present + b.total_present, marked: acc.marked + b.total_present + b.total_absent + b.total_late }),
        { present: 0, marked: 0 }
      );
      const levelCounts = {};
      students.forEach((s) => {
        if (s.level_name) levelCounts[s.level_name] = (levelCounts[s.level_name] || 0) + 1;
      });

      setData({
        totalStudents: stats.total_students || 0,
        totalTeachers: stats.total_teachers || 0,
        totalBatches: stats.total_batches || 0,
        newThisMonth: students.filter((s) => sameMonth(s.enrollment_date, now)).length,
        pendingFees: outstanding.length,
        overduePayments: stats.overdue_payments || 0,
        pendingGalleryRequests: stats.pending_gallery_requests || 0,
        unreadMessages: stats.unread_messages || 0,
        recent: [...students]
          .sort((a, b) => (toDate(b.enrollment_date) || 0) - (toDate(a.enrollment_date) || 0))
          .slice(0, 5)
          .map((s) => ({ id: s.student_id, name: s.full_name, level: s.level_name || 'Unassigned', date: s.enrollment_date })),
        thisMonth: stats.monthly_revenue || 0,
        lastMonth: paid.filter((f) => sameMonth(f.payment_date, lastMonthRef)).reduce((s, f) => s + Number(f.total_amount || 0), 0),
        pendingAmount: outstanding.reduce((s, f) => s + Number(f.total_amount || 0), 0),
        attendanceRate: att.marked ? Math.round((att.present / att.marked) * 100) : null,
        feeCollectionRate: fees.length ? Math.round((paid.length / fees.length) * 100) : null,
        levels: Object.entries(levelCounts)
          .map(([level, count]) => ({ level, count }))
          .sort((a, b) => b.count - a.count),
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

  const attention = [
    { to: '/admin/gallery-requests', icon: 'inbox', label: 'Gallery uploads awaiting review', count: data.pendingGalleryRequests },
    { to: '/admin/messages', icon: 'mail', label: 'Unread contact messages', count: data.unreadMessages },
    { to: '/admin/fees', icon: 'warning', label: 'Overdue fee payments', count: data.overduePayments },
  ];
  const maxLevel = Math.max(1, ...data.levels.map((l) => l.count));

  return (
    <div className="page">
      <PageHeader
        eyebrow="Administration"
        title="Dashboard"
        description={formatDate(new Date(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        actions={
          <>
            <Link to="/admin/students" className="btn-primary">
              <Icon name="plus" className="h-4 w-4" /> Add student
            </Link>
            <Link to="/admin/notices" className="btn-secondary">
              <Icon name="megaphone" className="h-4 w-4" /> Post notice
            </Link>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Active students"
          value={data.totalStudents}
          hint={data.newThisMonth ? `${data.newThisMonth} enrolled this month` : 'No new enrolments this month'}
          icon="users"
          tone="brand"
          to="/admin/students"
        />
        <StatCard label="Active teachers" value={data.totalTeachers} icon="teacher" tone="gold" to="/admin/teachers" />
        <StatCard label="Active batches" value={data.totalBatches} icon="collection" tone="info" to="/admin/batches" />
        <StatCard
          label="Outstanding fees"
          value={data.pendingFees}
          hint={data.overduePayments ? `${data.overduePayments} overdue` : 'None overdue'}
          icon="cash"
          tone={data.overduePayments ? 'danger' : 'warning'}
          to="/admin/fees"
        />
      </div>

      <section className="relative mb-6 overflow-hidden rounded-xl bg-accent p-6 text-sand-100 sm:p-8" aria-labelledby="fees-heading">
        <div className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full border-[24px] border-secondary-500/15" aria-hidden="true" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="fees-heading" className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-secondary-300">
            Fee collection
          </h2>
          <Link to="/admin/fees" className="text-sm font-semibold text-secondary-300 hover:text-secondary-200">
            Open fees
          </Link>
        </div>
        <dl className="relative mt-4 grid gap-6 sm:grid-cols-4">
          {[
            ['This month', inr(data.thisMonth), 'text-sand-50'],
            ['Last month', inr(data.lastMonth), 'text-sand-50'],
            ['Outstanding', inr(data.pendingAmount), 'text-amber-200'],
            ['Collection rate', data.feeCollectionRate === null ? '—' : `${data.feeCollectionRate}%`, 'text-sand-50'],
          ].map(([k, v, tone]) => (
            <div key={k} className="flex flex-col-reverse">
              <dt className="text-sm text-sand-300">{k}</dt>
              <dd className={`font-heading text-3xl font-semibold tabular-nums ${tone}`}>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="card" aria-labelledby="attention-heading">
            <h2 id="attention-heading" className="section-title mb-4">
              Needs attention
            </h2>
            <ul className="grid gap-3 sm:grid-cols-3">
              {attention.map((a) => (
                <li key={a.to}>
                  <Link
                    to={a.to}
                    className={`flex h-full flex-col rounded-lg border p-4 transition-colors hover:border-primary-200 hover:bg-primary-50/40 ${
                      a.count ? 'border-amber-200 bg-amber-50/50' : 'border-sand-200'
                    }`}
                  >
                    <Icon name={a.icon} className={`h-5 w-5 ${a.count ? 'text-amber-700' : 'text-gray-400'}`} />
                    <span className="mt-2 font-heading text-2xl font-semibold tabular-nums text-accent">{a.count}</span>
                    <span className="text-sm text-gray-600">{a.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="card" aria-labelledby="recent-heading">
            <div className="mb-4 flex items-center justify-between">
              <h2 id="recent-heading" className="section-title">
                Recent enrolments
              </h2>
              <Link to="/admin/students" className="text-sm font-semibold text-primary hover:text-primary-700">
                All students
              </Link>
            </div>
            {data.recent.length === 0 ? (
              <EmptyState icon="users" size="sm" title="No students enrolled yet" />
            ) : (
              <ul className="divide-y divide-sand-100">
                {data.recent.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-700">
                        {s.name.charAt(0)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-accent">{s.name}</p>
                        <p className="text-xs text-gray-500">{s.level}</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs text-gray-500">{s.date ? formatDate(s.date, { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="card" aria-labelledby="levels-heading">
            <h2 id="levels-heading" className="section-title mb-4">
              Students by level
            </h2>
            {data.levels.length === 0 ? (
              <p className="text-sm text-gray-500">No students yet.</p>
            ) : (
              <ul className="space-y-3">
                {data.levels.map((l) => (
                  <li key={l.level}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-gray-700">{l.level}</span>
                      <span className="font-medium tabular-nums text-accent">{l.count}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-sand-200" aria-hidden="true">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${(l.count / maxLevel) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card" aria-labelledby="att-heading">
            <h2 id="att-heading" className="section-title">
              Attendance
            </h2>
            <p className="mt-3 font-heading text-4xl font-semibold tabular-nums text-accent">{data.attendanceRate === null ? '—' : `${data.attendanceRate}%`}</p>
            <p className="text-sm text-gray-500">{data.attendanceRate === null ? 'No attendance recorded yet' : 'Present across all marked classes'}</p>
            <Link to="/admin/analytics" className="btn-secondary btn-sm mt-4">
              <Icon name="chart" className="h-4 w-4" /> Analytics
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default AdminDashboard;
