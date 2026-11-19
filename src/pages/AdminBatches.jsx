import React, { useCallback, useEffect, useState } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Modal from '../components/ui/Modal';
import Icon from '../components/ui/Icon';
import RowAction from '../components/ui/RowAction';
import BatchCapacityBar from '../components/BatchCapacityBar';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import adminService from '../services/adminService';
import useLevels from '../hooks/useLevels';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';

const EMPTY_FORM = { batch_name: '', level_id: '', teacher_id: '', schedule: '', time: '', room: '', max_students: '15', start_date: '' };

const AdminBatches = () => {
  const toast = useToast();
  const confirm = useConfirm();
  const { levels } = useLevels();
  const [batches, setBatches] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null); // { mode: 'add' } | { mode: 'edit', batch }
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [batchRows, teacherRows] = await Promise.all([adminService.getAllBatches(), adminService.getAllTeachers()]);
      setBatches(batchRows);
      setTeachers(teacherRows);
    } catch (err) {
      setError(err.message || 'Failed to load batches');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const q = searchTerm.trim().toLowerCase();
  const filtered = batches.filter(
    (b) => !q || (b.batch_name || '').toLowerCase().includes(q) || (b.teacher_name || '').toLowerCase().includes(q) || (b.level_name || '').toLowerCase().includes(q)
  );

  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setModal({ mode: 'add' });
  };
  const openEdit = (b) => {
    setFormData({
      batch_name: b.batch_name || '',
      level_id: String(b.level_id || ''),
      teacher_id: String(b.teacher_id || ''),
      schedule: b.schedule || '',
      time: b.time || '',
      room: b.room || '',
      max_students: String(b.max_students || 15),
      start_date: b.start_date ? b.start_date.slice(0, 10) : '',
    });
    setModal({ mode: 'edit', batch: b });
  };

  const handleChange = (e) => setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...formData, start_date: formData.start_date || undefined };
    try {
      if (modal.mode === 'add') {
        await adminService.createBatch(payload);
        toast.success(`Batch “${formData.batch_name}” created.`);
      } else {
        await adminService.updateBatch(modal.batch.batch_id, payload);
        toast.success('Batch updated.');
      }
      setModal(null);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Could not save the batch.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (b) => {
    if (b.is_active) {
      const ok = await confirm({
        title: `Deactivate ${b.batch_name}?`,
        message: 'It will no longer accept students or appear for attendance. History is kept.',
        confirmLabel: 'Deactivate',
      });
      if (!ok) return;
    }
    setBusyId(b.batch_id);
    try {
      await adminService.updateBatch(b.batch_id, { is_active: !b.is_active });
      toast.success(`${b.batch_name} is now ${b.is_active ? 'inactive' : 'active'}.`);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Could not update the batch.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (b) => {
    const ok = await confirm({
      title: `Delete ${b.batch_name}?`,
      message: 'This cannot be undone. Batches with students or attendance history cannot be deleted — deactivate them instead.',
      confirmLabel: 'Delete batch',
      tone: 'danger',
    });
    if (!ok) return;
    setBusyId(b.batch_id);
    try {
      await adminService.deleteBatch(b.batch_id);
      toast.success('Batch deleted.');
      setBatches((list) => list.filter((x) => x.batch_id !== b.batch_id));
    } catch (err) {
      toast.error(err.message || 'Failed to delete batch');
    } finally {
      setBusyId(null);
    }
  };

  if (loading && !batches.length) return <PageSkeleton label="Loading batches…" />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  const totalSeats = batches.filter((b) => b.is_active).reduce((s, b) => s + (b.max_students || 0), 0);
  const enrolled = batches.reduce((s, b) => s + (b.active_students || 0), 0);

  return (
    <div className="page">
      <PageHeader
        title="Batches"
        description="Class groups by level, with teacher, timings and capacity."
        actions={
          <button type="button" onClick={openAdd} className="btn-primary">
            <Icon name="plus" className="h-4 w-4" /> New batch
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Batches" value={batches.length} icon="collection" tone="brand" />
        <StatCard label="Active" value={batches.filter((b) => b.is_active).length} icon="checkCircle" tone="success" />
        <StatCard label="Students enrolled" value={enrolled} icon="users" tone="gold" />
        <StatCard label="Places available" value={Math.max(totalSeats - enrolled, 0)} hint="In active batches" icon="plus" tone="info" />
      </div>

      <section className="surface overflow-hidden">
        <div className="border-b border-sand-200 p-4 sm:px-5">
          <div className="relative max-w-md">
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input type="search" placeholder="Batch, teacher or level" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-9" aria-label="Search batches" />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon="collection"
            title={batches.length ? 'No batches match your search' : 'No batches yet'}
            description={batches.length ? 'Try a different search term.' : 'Create a batch and assign a teacher.'}
            actionText={batches.length ? undefined : 'Create batch'}
            onAction={batches.length ? undefined : openAdd}
          />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Batch</th>
                  <th scope="col" className="hidden md:table-cell">
                    Teacher
                  </th>
                  <th scope="col" className="hidden lg:table-cell">
                    Schedule
                  </th>
                  <th scope="col" className="w-40">
                    Capacity
                  </th>
                  <th scope="col">Status</th>
                  <th scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => {
                  const busy = busyId === b.batch_id;
                  return (
                    <tr key={b.batch_id}>
                      <td>
                        <p className="font-medium text-accent">{b.batch_name}</p>
                        <p className="text-xs text-gray-500">{b.level_name}</p>
                      </td>
                      <td className="hidden text-gray-600 md:table-cell">{b.teacher_name || <span className="badge-warning">Unassigned</span>}</td>
                      <td className="hidden text-gray-600 lg:table-cell">
                        {b.schedule}
                        <span className="block text-xs text-gray-500">
                          {b.time}
                          {b.room ? ` · ${b.room}` : ''}
                        </span>
                      </td>
                      <td>
                        <BatchCapacityBar currentEnrolled={b.active_students} maxStudents={b.max_students} size="sm" />
                      </td>
                      <td>
                        <StatusBadge status={b.is_active ? 'active' : 'inactive'} />
                      </td>
                      <td>
                        <div className="flex justify-end gap-0.5">
                          <RowAction icon="pencil" label={`Edit ${b.batch_name}`} onClick={() => openEdit(b)} disabled={busy} />
                          <RowAction icon={b.is_active ? 'eyeOff' : 'refresh'} label={b.is_active ? `Deactivate ${b.batch_name}` : `Reactivate ${b.batch_name}`} onClick={() => toggleActive(b)} disabled={busy} />
                          <RowAction icon="trash" label={`Delete ${b.batch_name}`} onClick={() => handleDelete(b)} disabled={busy} danger />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'add' ? 'New batch' : 'Edit batch'} size="lg" dismissible={!saving}>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="b-name" className="form-label">
                Batch name
              </label>
              <input id="b-name" name="batch_name" value={formData.batch_name} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label htmlFor="b-level" className="form-label">
                Level
              </label>
              <select id="b-level" name="level_id" value={formData.level_id} onChange={handleChange} className="input-field" required>
                <option value="">Select level</option>
                {levels.map((l) => (
                  <option key={l.level_id} value={String(l.level_id)}>
                    {l.level_number}. {l.level_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="b-teacher" className="form-label">
                Teacher
              </label>
              <select id="b-teacher" name="teacher_id" value={formData.teacher_id} onChange={handleChange} className="input-field" required>
                <option value="">Select teacher</option>
                {teachers
                  .filter((t) => t.is_active || String(t.teacher_id) === formData.teacher_id)
                  .map((t) => (
                    <option key={t.teacher_id} value={String(t.teacher_id)}>
                      {t.full_name}
                      {t.specialization ? ` — ${t.specialization}` : ''}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label htmlFor="b-max" className="form-label">
                Maximum students
              </label>
              <input id="b-max" type="number" min="1" max="15" name="max_students" value={formData.max_students} onChange={handleChange} className="input-field" />
              <p className="form-hint">Between 1 and 15.</p>
            </div>
            <div>
              <label htmlFor="b-schedule" className="form-label">
                Days
              </label>
              <input id="b-schedule" name="schedule" value={formData.schedule} onChange={handleChange} className="input-field" placeholder="e.g. Mon, Wed, Fri" required />
              <p className="form-hint">Used to build students’ weekly timetable.</p>
            </div>
            <div>
              <label htmlFor="b-time" className="form-label">
                Time
              </label>
              <input id="b-time" name="time" value={formData.time} onChange={handleChange} className="input-field" placeholder="e.g. 5:00 – 6:30 PM" required />
            </div>
            <div>
              <label htmlFor="b-room" className="form-label">
                Room <span className="font-normal text-gray-500">(optional)</span>
              </label>
              <input id="b-room" name="room" value={formData.room} onChange={handleChange} className="input-field" placeholder="e.g. Studio 1" />
            </div>
            <div>
              <label htmlFor="b-start" className="form-label">
                Start date <span className="font-normal text-gray-500">(optional)</span>
              </label>
              <input id="b-start" type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="input-field" />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={() => setModal(null)} className="btn-secondary" disabled={saving}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : modal?.mode === 'add' ? 'Create batch' : 'Save changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminBatches;
