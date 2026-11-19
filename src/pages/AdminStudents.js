import React, { useCallback, useEffect, useState } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Modal from '../components/ui/Modal';
import Icon from '../components/ui/Icon';
import RowAction from '../components/ui/RowAction';
import RollNumberBadge from '../components/RollNumberBadge';
import PaymentWindowBadge from '../components/PaymentWindowBadge';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import InviteLinkDialog from '../components/InviteLinkDialog';
import adminService from '../services/adminService';
import useLevels from '../hooks/useLevels';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';

const PAYMENT_WINDOWS = [
  ['monthly', 'Monthly'],
  ['quarterly', 'Quarterly'],
  ['half_yearly', 'Half-yearly'],
  ['yearly', 'Yearly'],
];

const EMPTY_FORM = {
  full_name: '',
  email: '',
  phone: '',
  date_of_birth: '',
  gender: '',
  address: '',
  emergency_contact_name: '',
  emergency_contact: '',
  current_level_id: '',
  payment_window: 'monthly',
  batch_id: '',
  enrollment_reason: '',
};

const TEXT_FIELDS = [
  ['full_name', 'Full name', 'text', true],
  ['email', 'Email', 'email', true],
  ['phone', 'Phone', 'tel', false],
  ['date_of_birth', 'Date of birth', 'date', false],
  ['emergency_contact_name', 'Emergency contact name', 'text', false],
  ['emergency_contact', 'Emergency contact phone', 'tel', false],
];

const AdminStudents = () => {
  const toast = useToast();
  const confirm = useConfirm();
  const { levels } = useLevels();
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaymentWindow, setFilterPaymentWindow] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null); // { mode: 'add' } | { mode: 'edit', student }
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [invite, setInvite] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [studentRows, batchRows] = await Promise.all([adminService.getAllStudents(), adminService.getAllBatches()]);
      setStudents(studentRows);
      setBatches(batchRows);
    } catch (err) {
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const q = searchTerm.trim().toLowerCase();
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      !q ||
      (s.full_name || '').toLowerCase().includes(q) ||
      (s.roll_number || '').toLowerCase().includes(q) ||
      (s.email || '').toLowerCase().includes(q);
    return (
      matchesSearch &&
      (filterLevel === 'all' || String(s.current_level_id) === filterLevel) &&
      (filterStatus === 'all' || s.status === filterStatus) &&
      (filterPaymentWindow === 'all' || s.payment_window === filterPaymentWindow)
    );
  });

  const openAdd = () => {
    setFormData({ ...EMPTY_FORM, current_level_id: levels[0] ? String(levels[0].level_id) : '' });
    setModal({ mode: 'add' });
  };

  const openEdit = async (student) => {
    setBusyId(student.student_id);
    try {
      const d = await adminService.getStudentDetails(student.student_id);
      setFormData({
        full_name: d.full_name || '',
        email: d.email || '',
        phone: d.phone || '',
        date_of_birth: d.date_of_birth ? d.date_of_birth.slice(0, 10) : '',
        gender: d.gender || '',
        address: d.address || '',
        emergency_contact_name: d.emergency_contact_name || '',
        emergency_contact: d.emergency_contact || '',
        current_level_id: d.current_level_id ? String(d.current_level_id) : '',
        payment_window: d.payment_window || 'monthly',
        batch_id: d.batch_id ? String(d.batch_id) : '',
        enrollment_reason: d.enrollment_reason || '',
      });
      setModal({ mode: 'edit', student });
    } catch (err) {
      toast.error(err.message || 'Could not load student details');
    } finally {
      setBusyId(null);
    }
  };

  const handleChange = (e) => setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal.mode === 'add') {
        const result = await adminService.createStudent({ ...formData, batch_id: formData.batch_id || undefined });
        setInvite({ invite: result.invite, name: formData.full_name });
        toast.success(`${formData.full_name} was enrolled (roll number ${result.student.roll_number}).`);
      } else {
        const { enrollment_reason, ...rest } = formData;
        await adminService.updateStudent(modal.student.student_id, { ...rest, batch_id: formData.batch_id ? Number(formData.batch_id) : null });
        toast.success('Student details updated.');
      }
      setModal(null);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Could not save the student.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (student) => {
    const activate = student.status !== 'active';
    let reason;
    if (!activate) {
      const res = await confirm({
        title: `Deactivate ${student.full_name}?`,
        message: 'They will no longer be able to log in. You can reactivate them later.',
        confirmLabel: 'Deactivate',
        tone: 'danger',
        input: { label: 'Reason', placeholder: 'Recorded in the status history' },
      });
      if (!res) return;
      reason = res.value;
    }
    setBusyId(student.student_id);
    try {
      await adminService.changeStudentStatus(student.student_id, { status: activate ? 'active' : 'inactive', reason: reason || undefined });
      toast.success(`${student.full_name} is now ${activate ? 'active' : 'inactive and cannot log in'}.`);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to change student status');
    } finally {
      setBusyId(null);
    }
  };

  const handleSendLink = async (student) => {
    setBusyId(student.student_id);
    try {
      const result = await adminService.regenerateStudentInvite(student.student_id);
      setInvite({ invite: result.invite, name: student.full_name });
    } catch (err) {
      toast.error(err.message || 'Could not create a password link');
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteStudent = async (student) => {
    const ok = await confirm({
      title: `Delete ${student.full_name}?`,
      message: 'Their login and records will be removed. This cannot be undone. Students with payment history cannot be deleted — deactivate them instead.',
      confirmLabel: 'Delete student',
      tone: 'danger',
    });
    if (!ok) return;
    setBusyId(student.student_id);
    try {
      await adminService.deleteStudent(student.student_id);
      toast.success('Student deleted.');
      setStudents((list) => list.filter((s) => s.student_id !== student.student_id));
    } catch (err) {
      toast.error(err.message || 'Failed to delete student');
    } finally {
      setBusyId(null);
    }
  };

  if (loading && !students.length) return <PageSkeleton label="Loading students…" />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  const batchesForLevel = batches.filter((b) => b.is_active && (!formData.current_level_id || String(b.level_id) === formData.current_level_id));

  return (
    <div className="page">
      <PageHeader
        title="Students"
        description="Enrol students, assign batches and manage their accounts."
        actions={
          <button type="button" onClick={openAdd} className="btn-primary">
            <Icon name="plus" className="h-4 w-4" /> Add student
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="All students" value={students.length} icon="users" tone="brand" />
        <StatCard label="Active" value={students.filter((s) => s.status === 'active').length} icon="checkCircle" tone="success" />
        <StatCard label="Inactive" value={students.filter((s) => s.status !== 'active').length} icon="xCircle" tone="neutral" />
        <StatCard label="Active, no batch" value={students.filter((s) => !s.batch_name && s.status === 'active').length} icon="warning" tone="warning" />
      </div>

      <section className="surface overflow-hidden">
        <div className="grid gap-3 border-b border-sand-200 p-4 sm:grid-cols-2 sm:px-5 lg:grid-cols-4">
          <div className="relative">
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input type="search" placeholder="Name, roll number or email" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-9" aria-label="Search students" />
          </div>
          <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="input-field" aria-label="Filter by level">
            <option value="all">All levels</option>
            {levels.map((l) => (
              <option key={l.level_id} value={String(l.level_id)}>
                {l.level_name}
              </option>
            ))}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field" aria-label="Filter by status">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select value={filterPaymentWindow} onChange={(e) => setFilterPaymentWindow(e.target.value)} className="input-field" aria-label="Filter by payment plan">
            <option value="all">All payment plans</option>
            {PAYMENT_WINDOWS.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {filteredStudents.length === 0 ? (
          <EmptyState
            icon="user"
            title={students.length ? 'No students match your filters' : 'No students yet'}
            description={students.length ? 'Try changing the search or filters.' : 'Enrol your first student to get started.'}
            actionText={students.length ? undefined : 'Add student'}
            onAction={students.length ? undefined : openAdd}
          />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Student</th>
                  <th scope="col" className="hidden lg:table-cell">
                    Level
                  </th>
                  <th scope="col" className="hidden xl:table-cell">
                    Plan
                  </th>
                  <th scope="col" className="hidden md:table-cell">
                    Batch
                  </th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-right">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => {
                  const busy = busyId === s.student_id;
                  return (
                    <tr key={s.student_id}>
                      <td>
                        <p className="font-medium text-accent">{s.full_name}</p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2">
                          <RollNumberBadge rollNumber={s.roll_number} size="sm" />
                          <span className="text-xs text-gray-500">{s.email}</span>
                        </div>
                      </td>
                      <td className="hidden text-gray-600 lg:table-cell">{s.level_name || 'Unassigned'}</td>
                      <td className="hidden xl:table-cell">
                        <PaymentWindowBadge paymentWindow={s.payment_window} discount={s.discount} />
                      </td>
                      <td className="hidden text-gray-600 md:table-cell">{s.batch_name || <span className="badge-warning">Not assigned</span>}</td>
                      <td>
                        <StatusBadge status={s.status} />
                      </td>
                      <td>
                        <div className="flex justify-end gap-0.5">
                          <RowAction icon="pencil" label={`Edit ${s.full_name}`} onClick={() => openEdit(s)} disabled={busy} />
                          {s.status === 'active' && <RowAction icon="key" label={`Password link for ${s.full_name}`} onClick={() => handleSendLink(s)} disabled={busy} />}
                          <RowAction
                            icon={s.status === 'active' ? 'eyeOff' : 'refresh'}
                            label={s.status === 'active' ? `Deactivate ${s.full_name}` : `Reactivate ${s.full_name}`}
                            onClick={() => handleToggleStatus(s)}
                            disabled={busy}
                          />
                          <RowAction icon="trash" label={`Delete ${s.full_name}`} onClick={() => handleDeleteStudent(s)} disabled={busy} danger />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <p className="border-t border-sand-200 px-5 py-3 text-xs text-gray-500" aria-live="polite">
          Showing {filteredStudents.length} of {students.length} students
        </p>
      </section>

      <InviteLinkDialog invite={invite?.invite} name={invite?.name} onClose={() => setInvite(null)} />

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === 'add' ? 'Add a student' : 'Edit student'}
        description={modal?.mode === 'add' ? 'A roll number is generated automatically. You will get a one-time link for the student to set their password.' : modal?.student?.full_name}
        size="lg"
        dismissible={!saving}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            {TEXT_FIELDS.map(([name, label, type, required]) => (
              <div key={name}>
                <label htmlFor={`s-${name}`} className="form-label">
                  {label} {!required && <span className="font-normal text-gray-500">(optional)</span>}
                </label>
                <input id={`s-${name}`} type={type} name={name} value={formData[name]} onChange={handleChange} className="input-field" required={required} />
              </div>
            ))}
            <div>
              <label htmlFor="s-gender" className="form-label">
                Gender
              </label>
              <select id="s-gender" name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                <option value="">Not specified</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label htmlFor="s-level" className="form-label">
                Level
              </label>
              <select
                id="s-level"
                name="current_level_id"
                value={formData.current_level_id}
                onChange={(e) => setFormData((f) => ({ ...f, current_level_id: e.target.value, batch_id: '' }))}
                className="input-field"
                required
              >
                <option value="">Select level</option>
                {levels.map((l) => (
                  <option key={l.level_id} value={String(l.level_id)}>
                    {l.level_number}. {l.level_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="s-pw" className="form-label">
                Payment plan
              </label>
              <select id="s-pw" name="payment_window" value={formData.payment_window} onChange={handleChange} className="input-field">
                {PAYMENT_WINDOWS.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="s-batch" className="form-label">
                Batch
              </label>
              <select id="s-batch" name="batch_id" value={formData.batch_id} onChange={handleChange} className="input-field">
                <option value="">Not assigned</option>
                {batchesForLevel.map((b) => (
                  <option key={b.batch_id} value={String(b.batch_id)} disabled={b.active_students >= b.max_students && String(b.batch_id) !== formData.batch_id}>
                    {b.batch_name} — {b.schedule} {b.time} ({b.active_students}/{b.max_students})
                  </option>
                ))}
              </select>
              <p className="form-hint">Only active batches at the selected level are listed; full batches are disabled.</p>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="s-address" className="form-label">
                Address <span className="font-normal text-gray-500">(optional)</span>
              </label>
              <textarea id="s-address" name="address" value={formData.address} onChange={handleChange} rows={2} className="input-field" />
            </div>
            {modal?.mode === 'add' && (
              <div className="sm:col-span-2">
                <label htmlFor="s-reason" className="form-label">
                  Enrolment note <span className="font-normal text-gray-500">(optional)</span>
                </label>
                <textarea id="s-reason" name="enrollment_reason" value={formData.enrollment_reason} onChange={handleChange} rows={2} className="input-field" />
              </div>
            )}
          </div>
          <div className="modal-actions">
            <button type="button" onClick={() => setModal(null)} className="btn-secondary" disabled={saving}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : modal?.mode === 'add' ? 'Enrol student' : 'Save changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminStudents;
