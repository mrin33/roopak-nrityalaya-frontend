import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageSkeleton, Skeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import Icon from '../components/ui/Icon';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import RollNumberBadge from '../components/RollNumberBadge';
import teacherService from '../services/teacherService';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import { todayISO } from '../utils/date';

const STATUSES = [
  ['present', 'Present', 'bg-green-700 text-white', 'P'],
  ['late', 'Late', 'bg-amber-500 text-accent-dark', 'L'],
  ['absent', 'Absent', 'bg-red-700 text-white', 'A'],
];

const TeacherAttendance = () => {
  const toast = useToast();
  const confirm = useConfirm();
  const [searchParams] = useSearchParams();
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(searchParams.get('batch') || '');
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alreadyMarked, setAlreadyMarked] = useState(false);

  const loadBatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const rows = await teacherService.getBatches();
      setBatches(rows.filter((b) => b.is_active !== false).map((b) => ({ id: String(b.batch_id), name: b.batch_name, level: b.level_name })));
    } catch (err) {
      setError(err.message || 'Could not load your batches');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBatches();
  }, [loadBatches]);

  // Load the batch roster together with any attendance already saved for the date.
  useEffect(() => {
    if (!selectedBatch || !selectedDate) {
      setStudents([]);
      return undefined;
    }
    let active = true;
    setLoadingStudents(true);
    teacherService
      .getBatchAttendance(selectedBatch, selectedDate)
      .then((rows) => {
        if (!active) return;
        setStudents(rows.map((r) => ({ id: r.student_id, name: r.full_name, rollNo: r.roll_number })));
        const existing = {};
        rows.forEach((r) => {
          if (r.status !== 'unmarked') existing[r.student_id] = r.status;
        });
        setAttendance(existing);
        setAlreadyMarked(Object.keys(existing).length > 0);
      })
      .catch((err) => active && toast.error(err.message || 'Could not load students for this batch'))
      .finally(() => active && setLoadingStudents(false));
    return () => {
      active = false;
    };
  }, [selectedBatch, selectedDate, toast]);

  const mark = (id, status) => setAttendance((prev) => ({ ...prev, [id]: status }));
  const markAll = (status) => setAttendance(Object.fromEntries(students.map((s) => [s.id, status])));
  const count = (status) => Object.values(attendance).filter((s) => s === status).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const records = students.filter((s) => attendance[s.id]).map((s) => ({ student_id: s.id, status: attendance[s.id] }));
    if (!records.length) {
      toast.error('Mark at least one student before saving.');
      return;
    }
    const unmarked = students.length - records.length;
    if (unmarked > 0) {
      const ok = await confirm({
        title: 'Some students are not marked',
        message: `${unmarked} student${unmarked > 1 ? 's are' : ' is'} not marked and will be skipped. Save the rest?`,
        confirmLabel: 'Save anyway',
      });
      if (!ok) return;
    }
    setSaving(true);
    try {
      await teacherService.markAttendance({ batch_id: Number(selectedBatch), attendance_date: selectedDate, records });
      setAlreadyMarked(true);
      toast.success(`Attendance saved for ${records.length} student${records.length > 1 ? 's' : ''}.`);
    } catch (err) {
      toast.error(err.message || 'Could not save attendance.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageSkeleton label="Loading your batches…" variant="form" />;
  if (error) return <ErrorState message={error} onRetry={loadBatches} />;

  const marked = Object.keys(attendance).length;

  return (
    <div className="page">
      <PageHeader title="Attendance" description="Choose a batch and date, then mark each student." />

      <div className="card mb-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="batch" className="form-label">
            Batch
          </label>
          <select id="batch" value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="input-field">
            <option value="">Choose a batch</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} — {b.level}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date" className="form-label">
            Date
          </label>
          <input id="date" type="date" max={todayISO()} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="input-field" />
        </div>
      </div>

      {batches.length === 0 ? (
        <div className="callout-warning">You have no active batches yet. An administrator can assign batches to you.</div>
      ) : !selectedBatch ? (
        <div className="surface">
          <EmptyState icon="clipboardCheck" title="Select a batch to start" description="The student list appears here with any attendance already saved for that date." />
        </div>
      ) : loadingStudents ? (
        <div className="surface space-y-1 p-4" role="status" aria-label="Loading students">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="surface">
          <EmptyState icon="users" title="No active students in this batch" size="sm" />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {alreadyMarked && (
            <div className="callout-success mb-4 flex gap-2">
              <Icon name="checkCircle" className="h-5 w-5 shrink-0" /> Attendance for this date is saved. Saving again updates it.
            </div>
          )}

          <section className="surface overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-sand-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="text-sm text-gray-600" aria-live="polite">
                <span className="font-semibold text-accent">{marked}</span> of {students.length} marked ·{' '}
                <span className="text-green-800">{count('present')} present</span> · <span className="text-amber-800">{count('late')} late</span> ·{' '}
                <span className="text-red-800">{count('absent')} absent</span>
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="self-center text-xs font-medium text-gray-500">Mark all:</span>
                {STATUSES.map(([v, l]) => (
                  <button key={v} type="button" onClick={() => markAll(v)} className="btn-secondary btn-sm">
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <ul className="divide-y divide-sand-100">
              {students.map((s, i) => (
                <li key={s.id} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand-100 text-xs font-semibold text-gray-600">{i + 1}</span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-accent">{s.name}</p>
                      <RollNumberBadge rollNumber={s.rollNo} size="sm" />
                    </div>
                  </div>
                  <div className="inline-flex shrink-0 rounded-lg border border-sand-300 bg-white p-0.5" role="radiogroup" aria-label={`Attendance for ${s.name}`}>
                    {STATUSES.map(([v, l, active]) => {
                      const on = attendance[s.id] === v;
                      return (
                        <button
                          key={v}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          onClick={() => mark(s.id, v)}
                          className={`min-w-[4.5rem] rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${on ? active : 'text-gray-600 hover:bg-sand-100'}`}
                        >
                          {l}
                        </button>
                      );
                    })}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <div className="sticky bottom-0 z-10 -mx-4 mt-4 flex justify-end gap-2 border-t border-sand-200 bg-sand-50/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
            <button type="button" onClick={() => setSelectedBatch('')} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : alreadyMarked ? 'Update attendance' : 'Save attendance'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TeacherAttendance;
