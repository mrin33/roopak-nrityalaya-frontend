import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Icon from '../components/ui/Icon';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/date';
import studentService from '../services/studentService';

const monthKey = (d) => d.slice(0, 7); // YYYY-MM
const monthLabel = (key) => {
  const [y, m] = key.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' });
};

const StudentAttendance = () => {
  const [data, setData] = useState({ records: [], overall: { present: 0, absent: 0, late: 0, percentage: 0, total_classes: 0 } });
  const [filterMonth, setFilterMonth] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setData(await studentService.getAttendance());
    } catch (err) {
      setError(err.message || 'Could not load your attendance');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const months = useMemo(
    () => [...new Set(data.records.map((r) => monthKey(String(r.attendance_date))))].sort().reverse(),
    [data.records]
  );
  const records = data.records.filter((r) => filterMonth === 'all' || monthKey(String(r.attendance_date)) === filterMonth);

  if (loading) return <PageSkeleton label="Loading attendance..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const { overall } = data;

  return (
    <div className="page">
      <PageHeader title="My attendance" description="Your class attendance as marked by your teacher." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Attendance rate" value={`${overall.percentage}%`} hint={`${overall.total_classes} classes recorded`} icon="chart" tone="brand" />
        <StatCard label="Present" value={overall.present} icon="checkCircle" tone="success" />
        <StatCard label="Late" value={overall.late} icon="clock" tone="warning" />
        <StatCard label="Absent" value={overall.absent} icon="xCircle" tone="danger" />
      </div>

      {overall.total_classes > 0 && overall.percentage < 75 && (
        <div className="callout-warning mb-6 flex gap-3">
          <Icon name="warning" className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Your attendance is below 75%. Missed a class?{' '}
            <Link to="/student/makeup-classes" className="font-semibold underline underline-offset-2">
              Request a makeup class
            </Link>
            .
          </p>
        </div>
      )}

      <section className="surface overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-sand-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <h2 className="section-title">Records</h2>
          <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="input-field sm:w-56" aria-label="Filter by month">
            <option value="all">All months</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {monthLabel(m)}
              </option>
            ))}
          </select>
        </div>

        {records.length === 0 ? (
          <EmptyState icon="calendar" title="No attendance records yet" description="Your attendance appears here once your teacher marks it." size="sm" />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col" className="hidden sm:table-cell">Batch</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="hidden md:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.attendance_id}>
                    <td className="whitespace-nowrap">
                      <span className="font-medium text-accent">{formatDate(r.attendance_date, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span className="block text-xs text-gray-500">{formatDate(r.attendance_date, { weekday: 'long' })}</span>
                    </td>
                    <td className="hidden text-gray-600 sm:table-cell">{r.batch_name || '—'}</td>
                    <td>
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="hidden text-gray-600 md:table-cell">{r.notes || '—'}</td>
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

export default StudentAttendance;
