import React, { useCallback, useEffect, useState } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Modal from '../components/ui/Modal';
import Icon from '../components/ui/Icon';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import teacherService from '../services/teacherService';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import { formatDate, todayISO } from '../utils/date';

const TeacherBatchTransfer = () => {
  const toast = useToast();
  const confirm = useConfirm();
  const [myBatches, setMyBatches] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ substituteTeacherId: '', transferDate: '', reason: '', isPermanent: false });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [batchRows, teacherRows, transferRows] = await Promise.all([
        teacherService.getBatches(),
        teacherService.getAvailableTeachers(),
        teacherService.getMyTransfers(),
      ]);
      setMyBatches(batchRows.filter((b) => b.is_active !== false).map((b) => ({ ...b, id: b.batch_id, student_count: b.active_students })));
      setTeachers(teacherRows.map((t) => ({ ...t, id: t.teacher_id })));
      setTransfers(transferRows.map((t) => ({ ...t, id: t.transfer_id })));
    } catch (err) {
      setError(err.message || 'Could not load batch transfers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openTransfer = (batch) => {
    setSelectedBatch(batch);
    setFormData({ substituteTeacherId: '', transferDate: todayISO(), reason: '', isPermanent: false });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const teacher = teachers.find((t) => t.id === parseInt(formData.substituteTeacherId, 10));
    if (formData.isPermanent) {
      const ok = await confirm({
        title: 'Hand over this batch permanently?',
        message: `${selectedBatch.batch_name} will be reassigned to ${teacher?.full_name}. You will no longer teach this batch.`,
        confirmLabel: 'Hand over batch',
        tone: 'danger',
      });
      if (!ok) return;
    }
    setSaving(true);
    try {
      await teacherService.createTransfer({
        batch_id: selectedBatch.id,
        to_teacher_id: parseInt(formData.substituteTeacherId, 10),
        transfer_date: formData.transferDate,
        reason: formData.reason,
        is_permanent: formData.isPermanent,
      });
      toast.success(
        formData.isPermanent
          ? `${selectedBatch.batch_name} now belongs to ${teacher?.full_name}.`
          : `${teacher?.full_name} will take ${selectedBatch.batch_name} on ${formatDate(formData.transferDate)}.`
      );
      setSelectedBatch(null);
      loadData();
    } catch (err) {
      toast.error(err.message || 'Could not create the transfer.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageSkeleton label="Loading batch transfers…" variant="cards" />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div className="page">
      <PageHeader title="Batch transfers" description="Ask another teacher to cover a class for a day, or hand a batch over permanently." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="My batches" value={myBatches.length} icon="collection" tone="brand" />
        <StatCard label="Active transfers" value={transfers.filter((t) => t.status === 'active').length} icon="switch" tone="success" />
        <StatCard label="All transfers" value={transfers.length} icon="document" tone="neutral" />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-2" aria-labelledby="batches-heading">
          <h2 id="batches-heading" className="section-title mb-3">
            My batches
          </h2>
          {myBatches.length === 0 ? (
            <div className="surface">
              <EmptyState icon="collection" size="sm" title="No active batches to transfer" />
            </div>
          ) : (
            <ul className="space-y-3">
              {myBatches.map((b) => (
                <li key={b.id} className="card flex items-center justify-between gap-3 p-4 sm:p-5">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-accent">{b.batch_name}</p>
                    <p className="text-xs text-gray-500">
                      {b.level_name} · {b.student_count} students
                    </p>
                    <p className="mt-1 text-sm text-gray-600">{[b.schedule, b.time].filter(Boolean).join(' · ')}</p>
                  </div>
                  <button type="button" onClick={() => openTransfer(b)} className="btn-secondary btn-sm shrink-0">
                    <Icon name="switch" className="h-4 w-4" /> Transfer
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="lg:col-span-3" aria-labelledby="history-heading">
          <h2 id="history-heading" className="section-title mb-3">
            Transfer history
          </h2>
          {transfers.length === 0 ? (
            <div className="surface">
              <EmptyState icon="switch" size="sm" title="No batch transfers yet" />
            </div>
          ) : (
            <ul className="surface divide-y divide-sand-100">
              {transfers.map((t) => {
                const incoming = t.direction === 'incoming';
                return (
                  <li key={t.id} className="p-4 sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-accent">{t.batch_name}</p>
                          <StatusBadge status={t.status} />
                          <span className={incoming ? 'badge-info' : 'badge-neutral'}>{incoming ? 'Incoming' : 'Outgoing'}</span>
                          {t.is_permanent && <span className="badge-gold">Permanent</span>}
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          {incoming ? 'Covering for ' : 'Covered by '}
                          <span className="font-medium text-accent">{incoming ? t.from_teacher_name : t.to_teacher_name}</span>
                        </p>
                      </div>
                      <p className="text-sm font-medium text-primary">{formatDate(t.transfer_date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    {t.reason && <p className="mt-2 text-sm text-gray-600">{t.reason}</p>}
                    <p className="mt-2 text-xs text-gray-500">Requested {new Date(t.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <Modal open={!!selectedBatch} onClose={() => setSelectedBatch(null)} title="Transfer batch" description={selectedBatch?.batch_name} size="md" dismissible={!saving}>
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label htmlFor="substituteTeacherId" className="form-label">
                Teacher
              </label>
              <select id="substituteTeacherId" name="substituteTeacherId" value={formData.substituteTeacherId} onChange={handleChange} className="input-field" required>
                <option value="">Choose a teacher…</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.full_name}
                    {t.specialization ? ` — ${t.specialization}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="transferDate" className="form-label">
                {formData.isPermanent ? 'Effective from' : 'Date of class'}
              </label>
              <input id="transferDate" type="date" name="transferDate" value={formData.transferDate} onChange={handleChange} min={todayISO()} className="input-field" required />
            </div>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-sand-200 p-3">
              <input type="checkbox" name="isPermanent" checked={formData.isPermanent} onChange={handleChange} className="mt-1 h-4 w-4" />
              <span className="text-sm">
                <span className="font-medium text-accent">Permanent transfer</span>
                <span className="block text-gray-500">The batch is reassigned to this teacher instead of being covered for one day.</span>
              </span>
            </label>
            <div>
              <label htmlFor="reason" className="form-label">
                Reason
              </label>
              <textarea id="reason" name="reason" value={formData.reason} onChange={handleChange} rows={3} className="input-field" required />
            </div>
            <p className="form-hint">
              Students are not notified automatically — please let the batch know about the change.
            </p>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={() => setSelectedBatch(null)} className="btn-secondary" disabled={saving}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : 'Confirm transfer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeacherBatchTransfer;
