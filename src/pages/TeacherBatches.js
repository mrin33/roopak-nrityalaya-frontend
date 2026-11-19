import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Modal from '../components/ui/Modal';
import Icon from '../components/ui/Icon';
import BatchCapacityBar from '../components/BatchCapacityBar';
import RollNumberBadge from '../components/RollNumberBadge';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import teacherService from '../services/teacherService';

const TeacherBatches = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [batchesData, studentsData] = await Promise.all([teacherService.getBatches(), teacherService.getStudents()]);
      setBatches(
        batchesData.map((b) => {
          const list = studentsData.filter((s) => s.batch_name === b.batch_name);
          const total = list.reduce((sum, s) => sum + (Number(s.attendance_percentage) || 0), 0);
          return {
            id: b.batch_id,
            name: b.batch_name,
            level: b.level_name,
            schedule: b.schedule,
            time: b.time,
            room: b.room,
            isActive: b.is_active !== false,
            max: b.max_students,
            totalStudents: Number(b.active_students) || 0,
            averageAttendance: list.length ? Math.round(total / list.length) : 0,
            students: list.map((s) => ({
              id: s.student_id,
              name: s.full_name,
              rollNo: s.roll_number,
              attendance: Math.round(Number(s.attendance_percentage) || 0),
            })),
          };
        })
      );
    } catch (err) {
      setError(err.message || 'Failed to load batches');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <PageSkeleton label="Loading batches…" variant="cards" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const withStudents = batches.filter((b) => b.students.length);
  const avg = withStudents.length ? Math.round(withStudents.reduce((s, b) => s + b.averageAttendance, 0) / withStudents.length) : 0;

  return (
    <div className="page">
      <PageHeader title="My batches" description="Class groups assigned to you, with timings and enrolment." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Batches" value={batches.length} icon="collection" tone="brand" />
        <StatCard label="Active batches" value={batches.filter((b) => b.isActive).length} icon="checkCircle" tone="success" />
        <StatCard label="Students" value={batches.reduce((s, b) => s + b.totalStudents, 0)} icon="users" tone="gold" />
        <StatCard label="Average attendance" value={withStudents.length ? `${avg}%` : '—'} icon="chart" tone="info" />
      </div>

      {batches.length === 0 ? (
        <div className="surface">
          <EmptyState icon="collection" title="No batches assigned yet" description="The academy office assigns batches to teachers." size="lg" />
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {batches.map((b) => (
            <article key={b.id} className="card flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-heading text-xl font-semibold text-accent">{b.name}</h2>
                  <p className="text-sm text-secondary-700">{b.level}</p>
                </div>
                {!b.isActive && <span className="badge-neutral">Inactive</span>}
              </div>
              <ul className="mt-4 grid gap-2 text-sm text-gray-700 sm:grid-cols-3">
                <li className="flex items-center gap-2">
                  <Icon name="calendar" className="h-4 w-4 text-gray-400" /> {b.schedule || '—'}
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="clock" className="h-4 w-4 text-gray-400" /> {b.time || '—'}
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="mapPin" className="h-4 w-4 text-gray-400" /> {b.room || '—'}
                </li>
              </ul>
              <div className="mt-4 grid grid-cols-2 gap-4 rounded-lg bg-sand-50 p-4">
                <div>
                  <BatchCapacityBar currentEnrolled={b.totalStudents} maxStudents={b.max || 15} />
                </div>
                <div className="text-right">
                  <p className="font-heading text-2xl font-semibold tabular-nums text-accent">{b.students.length ? `${b.averageAttendance}%` : '—'}</p>
                  <p className="text-xs text-gray-500">average attendance</p>
                </div>
              </div>
              {b.students.length > 0 && (
                <p className="mt-4 text-sm text-gray-600">
                  {b.students
                    .slice(0, 3)
                    .map((s) => s.name)
                    .join(', ')}
                  {b.students.length > 3 && ` and ${b.students.length - 3} more`}
                </p>
              )}
              <div className="mt-auto flex gap-2 pt-5">
                <Link to={`/teacher/attendance?batch=${b.id}`} className="btn-primary flex-1">
                  <Icon name="clipboardCheck" className="h-4 w-4" /> Attendance
                </Link>
                <button type="button" onClick={() => setSelectedBatch(b)} className="btn-secondary flex-1" disabled={!b.students.length}>
                  <Icon name="users" className="h-4 w-4" /> Students
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={!!selectedBatch}
        onClose={() => setSelectedBatch(null)}
        title={selectedBatch?.name}
        description={selectedBatch && `${selectedBatch.level} · ${selectedBatch.students.length} students`}
        size="lg"
      >
        {selectedBatch && (
          <div className="-mx-5 -my-5 sm:-mx-6">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Student</th>
                  <th scope="col" className="text-right">
                    Attendance
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedBatch.students.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <p className="font-medium text-accent">{s.name}</p>
                      <RollNumberBadge rollNumber={s.rollNo} size="sm" />
                    </td>
                    <td className={`text-right font-medium tabular-nums ${s.attendance < 75 ? 'text-red-700' : 'text-accent'}`}>{s.attendance}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TeacherBatches;
