import React, { useCallback, useEffect, useMemo, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import studentService from '../services/studentService';

const STATUS_STYLE = {
  present: 'bg-green-100 text-green-800',
  absent: 'bg-red-100 text-red-800',
  late: 'bg-yellow-100 text-yellow-800',
};

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

  if (loading) return <LoadingSpinner fullScreen={true} text="Loading attendance..." size="lg" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const { overall } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-primary mb-2">My Attendance</h1>
          <p className="text-gray-600">Track your class attendance and maintain consistency</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[
            ['Present', overall.present, 'text-green-600', 'border-green-500'],
            ['Absent', overall.absent, 'text-red-600', 'border-red-500'],
            ['Late', overall.late, 'text-yellow-600', 'border-yellow-500'],
            ['Attendance', `${overall.percentage}%`, 'text-primary', 'border-primary'],
          ].map(([label, value, color, border]) => (
            <div key={label} className={`bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 ${border}`}>
              <p className="text-sm text-gray-600 mb-1">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {overall.total_classes > 0 && overall.percentage < 75 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded p-4 mb-8 text-yellow-800 text-sm">
            Your attendance is below 75%. Missed a class? You can request a makeup class from the Makeup Classes page.
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b">
            <h2 className="text-2xl font-bold text-accent">Attendance Records</h2>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              aria-label="Filter by month"
            >
              <option value="all">All Months</option>
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    {['Date', 'Day', 'Batch', 'Status', 'Notes'].map((h) => (
                      <th key={h} className="text-left py-3 px-4 font-semibold text-accent">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => {
                    const d = new Date(r.attendance_date);
                    return (
                      <tr key={r.attendance_id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap">
                          {d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{d.toLocaleDateString('en-IN', { weekday: 'long' })}</td>
                        <td className="py-3 px-4 text-gray-600">{r.batch_name || '—'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${STATUS_STYLE[r.status] || 'bg-gray-100'}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm">{r.notes || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
