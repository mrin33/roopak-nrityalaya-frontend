import React, { useCallback, useEffect, useState } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Modal from '../components/ui/Modal';
import Icon from '../components/ui/Icon';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import studentService from '../services/studentService';
import { useToast } from '../context/ToastContext';
import { formatDate, todayISO } from '../utils/date';

const shortDate = (d) => formatDate(d, { weekday: 'short', day: 'numeric', month: 'short' });

const StudentMakeupClasses = () => {
  const toast = useToast();
  const [missedClasses, setMissedClasses] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [availableBatches, setAvailableBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ makeupBatchId: '', makeupDate: '', notes: '' });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [missed, mine, batches] = await Promise.all([
        studentService.getMissedClasses(),
        studentService.getMakeupRequests(),
        studentService.getMakeupBatches(),
      ]);
      setMissedClasses(missed.map((m) => ({ ...m, id: m.attendance_id })));
      setRequests(mine.map((r) => ({ ...r, id: r.booking_id, requested_at: r.created_at, teacher_note: r.notes })));
      setAvailableBatches(
        batches.map((b) => ({
          id: b.batch_id,
          name: b.batch_name,
          schedule: [b.schedule, b.time, b.teacher_name].filter(Boolean).join(' · '),
        }))
      );
    } catch (err) {
      setError(err.message || 'Could not load makeup classes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openRequest = (missedClass) => {
    setSelectedClass(missedClass);
    setFormData({ makeupBatchId: '', makeupDate: '', notes: '' });
  };

  const handleChange = (e) => setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await studentService.createMakeupRequest({
        attendance_id: selectedClass.id,
        makeup_batch_id: parseInt(formData.makeupBatchId, 10),
        makeup_class_date: formData.makeupDate,
        notes: formData.notes,
      });
      setSelectedClass(null);
      toast.success('Makeup request sent. The teacher of that batch will review it.');
      load();
    } catch (err) {
      toast.error(err.message || 'Could not submit the request.');
    } finally {
      setSaving(false);
    }
  };

  const count = (s) => requests.filter((r) => r.status === s).length;

  if (loading) return <PageSkeleton label="Loading makeup classes…" variant="cards" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="page">
      <PageHeader title="Makeup classes" description="Missed a class? Request to attend another batch at your level." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Missed classes" value={missedClasses.length} icon="xCircle" tone="danger" />
        <StatCard label="Pending" value={count('pending')} icon="clock" tone="warning" />
        <StatCard label="Approved" value={count('approved')} icon="checkCircle" tone="success" />
        <StatCard label="Declined" value={count('rejected')} icon="x" tone="neutral" />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Missed */}
        <section className="surface overflow-hidden lg:col-span-2" aria-labelledby="missed-heading">
          <h2 id="missed-heading" className="section-title border-b border-sand-200 px-5 py-4">
            Missed classes
          </h2>
          {missedClasses.length === 0 ? (
            <EmptyState icon="checkCircle" title="No missed classes" description="Great attendance — keep it up!" size="sm" />
          ) : (
            <ul className="divide-y divide-sand-100">
              {missedClasses.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <p className="font-medium text-accent">{formatDate(c.class_date, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    <p className="truncate text-sm text-gray-600">
                      {c.batch_name}
                      {c.teacher_name ? ` · ${c.teacher_name}` : ''}
                    </p>
                  </div>
                  {c.can_request_makeup ? (
                    <button type="button" onClick={() => openRequest(c)} className="btn-primary btn-sm shrink-0">
                      Request
                    </button>
                  ) : (
                    <span className="badge-neutral shrink-0">Requested</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Requests */}
        <section className="lg:col-span-3" aria-labelledby="requests-heading">
          <h2 id="requests-heading" className="section-title mb-3">
            Your requests
          </h2>
          {requests.length === 0 ? (
            <div className="surface">
              <EmptyState icon="refresh" title="No makeup requests yet" description="Requests you make for missed classes will be tracked here." size="sm" />
            </div>
          ) : (
            <ul className="space-y-3">
              {requests.map((r) => (
                <li key={r.id} className="card">
                  <div className="flex items-center justify-between gap-3">
                    <StatusBadge status={r.status} label={r.status === 'rejected' ? 'Declined' : undefined} />
                    <span className="text-xs text-gray-500">Requested {formatDate(r.requested_at, { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="min-w-0 flex-1 rounded-lg bg-sand-50 p-3">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-gray-500">Missed</p>
                      <p className="mt-0.5 font-medium text-accent">{shortDate(r.original_class_date)}</p>
                      <p className="truncate text-xs text-gray-600">{r.original_batch_name}</p>
                    </div>
                    <Icon name="arrowRight" className="h-5 w-5 shrink-0 text-secondary-600" />
                    <div className="min-w-0 flex-1 rounded-lg bg-primary-50/60 p-3">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-gray-500">Makeup</p>
                      <p className="mt-0.5 font-medium text-accent">{shortDate(r.makeup_class_date)}</p>
                      <p className="truncate text-xs text-gray-600">{r.makeup_batch_name}</p>
                    </div>
                  </div>
                  {r.status === 'approved' && (
                    <p className="mt-3 text-sm text-green-800">
                      Approved{r.approved_by_name ? ` by ${r.approved_by_name}` : ''}. Please attend on the scheduled date.
                    </p>
                  )}
                  {r.status === 'pending' && <p className="mt-3 text-sm text-gray-600">Waiting for the teacher to respond.</p>}
                  {r.status === 'rejected' && r.teacher_note && (
                    <p className="mt-3 whitespace-pre-line rounded-lg bg-red-50 p-3 text-sm text-red-800">{r.teacher_note}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <Modal open={!!selectedClass} onClose={() => setSelectedClass(null)} title="Request a makeup class" size="md">
        {selectedClass && (
          <form onSubmit={handleSubmit}>
            <div className="mb-5 rounded-lg bg-sand-50 p-4 text-sm">
              <p className="text-gray-500">Missed class</p>
              <p className="font-semibold text-accent">{formatDate(selectedClass.class_date, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              <p className="text-gray-600">{selectedClass.batch_name}</p>
            </div>
            <div className="space-y-5">
              <div>
                <label htmlFor="makeupBatchId" className="form-label">
                  Attend with batch
                </label>
                <select id="makeupBatchId" name="makeupBatchId" value={formData.makeupBatchId} onChange={handleChange} className="input-field" required>
                  <option value="">{availableBatches.length ? 'Choose a batch…' : 'No other batches at your level'}</option>
                  {availableBatches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} — {b.schedule}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="makeupDate" className="form-label">
                  Date
                </label>
                <input id="makeupDate" type="date" name="makeupDate" value={formData.makeupDate} onChange={handleChange} className="input-field" min={todayISO()} required />
              </div>
              <div>
                <label htmlFor="notes" className="form-label">
                  Note for the teacher <span className="font-normal text-gray-500">(optional)</span>
                </label>
                <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} className="input-field" />
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" onClick={() => setSelectedClass(null)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={saving || !availableBatches.length} className="btn-primary">
                {saving ? 'Sending…' : 'Send request'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default StudentMakeupClasses;
