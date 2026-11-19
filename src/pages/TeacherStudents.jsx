import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Modal from '../components/ui/Modal';
import Icon from '../components/ui/Icon';
import RollNumberBadge from '../components/RollNumberBadge';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import teacherService from '../services/teacherService';

const attendanceTone = (p) => (p >= 90 ? 'bg-green-600' : p >= 75 ? 'bg-amber-500' : 'bg-red-600');

const AttendanceMeter = ({ value }) => (
  <div className="flex items-center gap-2">
    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-sand-200" aria-hidden="true">
      <div className={`h-full rounded-full ${attendanceTone(value)}`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
    <span className="text-sm font-medium tabular-nums text-accent">{value}%</span>
  </div>
);

const TeacherStudents = () => {
  const [students, setStudents] = useState([]);
  const [batchNames, setBatchNames] = useState([]);
  const [filterBatch, setFilterBatch] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [studentsData, batchesData] = await Promise.all([teacherService.getStudents(), teacherService.getBatches()]);
      setBatchNames(batchesData.map((b) => b.batch_name));
      setStudents(
        studentsData.map((s) => ({
          id: s.student_id,
          name: s.full_name,
          rollNo: s.roll_number || '',
          batch: s.batch_name,
          level: s.level_name,
          attendance: Math.round(Number(s.attendance_percentage) || 0),
          phone: s.phone,
          email: s.email,
        }))
      );
    } catch (err) {
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const levels = useMemo(() => [...new Set(students.map((s) => s.level).filter(Boolean))].sort(), [students]);
  const q = searchTerm.trim().toLowerCase();
  const shown = students.filter(
    (s) =>
      (filterBatch === 'all' || s.batch === filterBatch) &&
      (filterLevel === 'all' || s.level === filterLevel) &&
      (!q || s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q))
  );
  const avg = students.length ? Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / students.length) : 0;

  if (loading) return <PageSkeleton label="Loading students…" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="page">
      <PageHeader title="My students" description="Students across all the batches you teach." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Students" value={students.length} icon="users" tone="brand" />
        <StatCard label="Average attendance" value={students.length ? `${avg}%` : '—'} hint="Across your batches" icon="chart" tone="gold" />
        <StatCard label="90% or more" value={students.filter((s) => s.attendance >= 90).length} icon="checkCircle" tone="success" />
        <StatCard label="Below 75%" value={students.filter((s) => s.attendance < 75).length} hint="May need follow-up" icon="warning" tone="danger" />
      </div>

      <section className="surface overflow-hidden">
        <div className="grid gap-3 border-b border-sand-200 p-4 sm:grid-cols-3 sm:px-5">
          <div className="relative">
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search name or roll no."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9"
              aria-label="Search students"
            />
          </div>
          <select value={filterBatch} onChange={(e) => setFilterBatch(e.target.value)} className="input-field" aria-label="Filter by batch">
            <option value="all">All batches</option>
            {batchNames.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="input-field" aria-label="Filter by level">
            <option value="all">All levels</option>
            {levels.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {shown.length === 0 ? (
          <EmptyState icon="user" title={students.length ? 'No students match' : 'No students yet'} description={students.length ? 'Try a different search or filter.' : 'Students appear here once they are enrolled in your batches.'} />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Student</th>
                  <th scope="col" className="hidden md:table-cell">
                    Batch
                  </th>
                  <th scope="col" className="hidden lg:table-cell">
                    Level
                  </th>
                  <th scope="col">Attendance</th>
                  <th scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {shown.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <p className="font-medium text-accent">{s.name}</p>
                      <RollNumberBadge rollNumber={s.rollNo} size="sm" />
                    </td>
                    <td className="hidden text-gray-600 md:table-cell">{s.batch || '—'}</td>
                    <td className="hidden text-gray-600 lg:table-cell">{s.level || '—'}</td>
                    <td>
                      <AttendanceMeter value={s.attendance} />
                    </td>
                    <td className="text-right">
                      <button type="button" onClick={() => setSelected(s)} className="btn-ghost btn-sm">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="border-t border-sand-200 px-5 py-3 text-xs text-gray-500" aria-live="polite">
          Showing {shown.length} of {students.length} students
        </p>
      </section>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name} size="sm">
        {selected && (
          <>
            <dl className="space-y-3 text-sm">
              {[
                ['Roll number', <RollNumberBadge key="r" rollNumber={selected.rollNo} />],
                ['Batch', selected.batch || '—'],
                ['Level', selected.level || '—'],
                ['Attendance', <AttendanceMeter key="a" value={selected.attendance} />],
                ['Email', selected.email ? <a key="e" href={`mailto:${selected.email}`} className="text-primary hover:underline">{selected.email}</a> : '—'],
                ['Phone', selected.phone ? <a key="p" href={`tel:${selected.phone}`} className="text-primary hover:underline">{selected.phone}</a> : '—'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4 border-b border-sand-100 pb-3 last:border-0">
                  <dt className="text-gray-500">{k}</dt>
                  <dd className="text-right text-accent">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default TeacherStudents;
