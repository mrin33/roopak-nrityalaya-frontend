import React, { useCallback, useEffect, useState } from 'react';
import BatchCapacityBar from '../components/BatchCapacityBar';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingSpinner from '../components/LoadingSpinner';
import adminService from '../services/adminService';
import useLevels from '../hooks/useLevels';
import { useToast } from '../context/ToastContext';

const EMPTY_FORM = { batch_name: '', level_id: '', teacher_id: '', schedule: '', time: '', room: '', max_students: '15', start_date: '' };

const AdminBatches = () => {
  const toast = useToast();
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

  const q = searchTerm.toLowerCase();
  const filteredBatches = batches.filter(
    (b) =>
      (b.batch_name || '').toLowerCase().includes(q) ||
      (b.teacher_name || '').toLowerCase().includes(q) ||
      (b.level_name || '').toLowerCase().includes(q)
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
        toast.success(`Batch "${formData.batch_name}" created.`);
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
    if (!window.confirm(`Delete batch "${b.batch_name}"? This cannot be undone.`)) return;
    setBusyId(b.batch_id);
    try {
      await adminService.deleteBatch(b.batch_id);
      toast.success('Batch deleted.');
      setBatches((list) => list.filter((x) => x.batch_id !== b.batch_id));
    } catch (err) {
      // e.g. "has active students" or "has attendance history — mark it inactive instead"
      toast.error(err.message || 'Failed to delete batch');
    } finally {
      setBusyId(null);
    }
  };

  if (loading && !batches.length) return <LoadingSpinner fullScreen={true} text="Loading batches..." size="lg" />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  const totalSeats = batches.reduce((s, b) => s + (b.max_students || 0), 0);
  const enrolled = batches.reduce((s, b) => s + (b.active_students || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-primary mb-2">Manage Batches</h1>
            <p className="text-gray-600">Create and manage class batches</p>
          </div>
          <button onClick={openAdd} className="btn-primary">
            + Create New Batch
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[
            ['Total Batches', batches.length, 'text-primary'],
            ['Active', batches.filter((b) => b.is_active).length, 'text-green-600'],
            ['Students Enrolled', enrolled, 'text-blue-600'],
            ['Seats Available', Math.max(totalSeats - enrolled, 0), 'text-purple-600'],
          ].map(([label, value, color]) => (
            <div key={label} className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <p className="text-sm text-gray-600 mb-1">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <input
            type="search"
            placeholder="Search by batch, teacher or level…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            aria-label="Search batches"
          />
        </div>

        {filteredBatches.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg">
            <EmptyState
              icon="calendar"
              title={batches.length ? 'No batches match your search' : 'No batches yet'}
              description={batches.length ? 'Try a different search term.' : 'Create a batch and assign a teacher.'}
              actionText={batches.length ? undefined : 'Create Batch'}
              onAction={batches.length ? undefined : openAdd}
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-primary/10 to-secondary/10">
                  <tr>
                    {['Batch Name', 'Level', 'Teacher', 'Schedule', 'Capacity', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-sm font-semibold text-accent whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredBatches.map((b) => (
                    <tr key={b.batch_id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold text-accent">{b.batch_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{b.level_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{b.teacher_name || 'Unassigned'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div>{b.schedule}</div>
                        <div className="text-xs text-gray-500">
                          {b.time}
                          {b.room ? ` · ${b.room}` : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 min-w-[140px]">
                        <BatchCapacityBar currentEnrolled={b.active_students} maxStudents={b.max_students} showLabel={false} size="sm" />
                        <span className="text-xs text-gray-600 mt-1">
                          {b.active_students}/{b.max_students}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={b.is_active ? 'active' : 'inactive'} type="batch" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          <button onClick={() => openEdit(b)} className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                            Edit
                          </button>
                          <button
                            onClick={() => toggleActive(b)}
                            disabled={busyId === b.batch_id}
                            className="text-yellow-600 hover:text-yellow-800 text-sm font-semibold disabled:opacity-50"
                          >
                            {b.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDelete(b)}
                            disabled={busyId === b.batch_id}
                            className="text-red-600 hover:text-red-800 text-sm font-semibold disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {modal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-primary text-white p-6 rounded-t-2xl sticky top-0 flex items-center justify-between">
                <h2 className="text-2xl font-bold">{modal.mode === 'add' ? 'Create New Batch' : 'Edit Batch'}</h2>
                <button onClick={() => setModal(null)} className="text-white hover:bg-white/20 rounded-full p-2" aria-label="Close">
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="b-name" className="block text-sm font-semibold text-accent mb-2">Batch Name *</label>
                    <input id="b-name" name="batch_name" value={formData.batch_name} onChange={handleChange} className="input-field" required />
                  </div>
                  <div>
                    <label htmlFor="b-level" className="block text-sm font-semibold text-accent mb-2">Level *</label>
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
                    <label htmlFor="b-teacher" className="block text-sm font-semibold text-accent mb-2">Teacher *</label>
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
                    <label htmlFor="b-max" className="block text-sm font-semibold text-accent mb-2">Max Students (1–15)</label>
                    <input id="b-max" type="number" min="1" max="15" name="max_students" value={formData.max_students} onChange={handleChange} className="input-field" />
                  </div>
                  <div>
                    <label htmlFor="b-schedule" className="block text-sm font-semibold text-accent mb-2">Days *</label>
                    <input id="b-schedule" name="schedule" value={formData.schedule} onChange={handleChange} className="input-field" placeholder="e.g. Mon, Wed, Fri" required />
                  </div>
                  <div>
                    <label htmlFor="b-time" className="block text-sm font-semibold text-accent mb-2">Time *</label>
                    <input id="b-time" name="time" value={formData.time} onChange={handleChange} className="input-field" placeholder="e.g. 5:00 PM - 6:30 PM" required />
                  </div>
                  <div>
                    <label htmlFor="b-room" className="block text-sm font-semibold text-accent mb-2">Room</label>
                    <input id="b-room" name="room" value={formData.room} onChange={handleChange} className="input-field" placeholder="e.g. Studio 1" />
                  </div>
                  <div>
                    <label htmlFor="b-start" className="block text-sm font-semibold text-accent mb-2">Start Date</label>
                    <input id="b-start" type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="input-field" />
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-8">
                  <button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                    {saving ? 'Saving…' : modal.mode === 'add' ? 'Create Batch' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBatches;
