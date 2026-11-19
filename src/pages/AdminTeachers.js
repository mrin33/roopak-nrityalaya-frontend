import React, { useCallback, useEffect, useState } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Modal from '../components/ui/Modal';
import Icon from '../components/ui/Icon';
import RowAction from '../components/ui/RowAction';
import StatusBadge from '../components/StatusBadge';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import InviteLinkDialog from '../components/InviteLinkDialog';
import adminService from '../services/adminService';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';

const EMPTY_FORM = { fullName: '', email: '', phone: '', specialization: '', experienceYears: '', qualifications: '', bio: '', isSenior: false };

const toForm = (t) => ({
  fullName: t.full_name || '',
  email: t.email || '',
  phone: t.phone || '',
  specialization: t.specialization || '',
  experienceYears: t.experience_years ?? '',
  qualifications: t.qualifications || '',
  bio: t.bio || '',
  isSenior: !!t.is_senior,
});

const FIELDS = [
  ['fullName', 'Full name', 'text', true],
  ['email', 'Email', 'email', true],
  ['phone', 'Phone', 'tel', false],
  ['specialization', 'Specialisation', 'text', false],
  ['experienceYears', 'Experience (years)', 'number', false],
];

const AdminTeachers = () => {
  const toast = useToast();
  const confirm = useConfirm();
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null); // null | { mode: 'add' } | { mode: 'edit', teacher }
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [invite, setInvite] = useState(null);

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setTeachers(await adminService.getAllTeachers());
    } catch (err) {
      setError(err.message || 'Failed to load teachers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const q = searchTerm.trim().toLowerCase();
  const filtered = teachers.filter(
    (t) => !q || (t.full_name || '').toLowerCase().includes(q) || (t.email || '').toLowerCase().includes(q) || (t.specialization || '').toLowerCase().includes(q)
  );

  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setModal({ mode: 'add' });
  };
  const openEdit = (teacher) => {
    setFormData(toForm(teacher));
    setModal({ mode: 'edit', teacher });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      specialization: formData.specialization,
      experience_years: formData.experienceYears === '' ? undefined : parseInt(formData.experienceYears, 10),
      qualifications: formData.qualifications,
      bio: formData.bio,
      is_senior: formData.isSenior,
    };
    try {
      if (modal.mode === 'add') {
        // No password: the teacher sets their own via the invitation link.
        const result = await adminService.createTeacher(payload);
        setInvite({ invite: result.invite, name: formData.fullName });
        toast.success(`${formData.fullName} was added.`);
      } else {
        await adminService.updateTeacher(modal.teacher.teacher_id, payload);
        toast.success('Teacher details updated.');
      }
      setModal(null);
      fetchTeachers();
    } catch (err) {
      toast.error(err.message || 'Could not save the teacher.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (teacher) => {
    if (teacher.is_active) {
      const ok = await confirm({
        title: `Deactivate ${teacher.full_name}?`,
        message: 'They will no longer be able to log in, and they disappear from the public Teachers page.',
        confirmLabel: 'Deactivate',
        tone: 'danger',
      });
      if (!ok) return;
    }
    setBusyId(teacher.teacher_id);
    try {
      await adminService.updateTeacher(teacher.teacher_id, { is_active: !teacher.is_active });
      toast.success(`${teacher.full_name} is now ${teacher.is_active ? 'inactive and cannot log in' : 'active'}.`);
      fetchTeachers();
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setBusyId(null);
    }
  };

  const handleSendLink = async (teacher) => {
    setBusyId(teacher.teacher_id);
    try {
      const result = await adminService.regenerateTeacherInvite(teacher.teacher_id);
      setInvite({ invite: result.invite, name: teacher.full_name });
      fetchTeachers();
    } catch (err) {
      toast.error(err.message || 'Could not create a password setup link');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (teacher) => {
    const ok = await confirm({
      title: `Delete ${teacher.full_name}?`,
      message: 'Their login will be removed. This cannot be undone. Teachers with batches or history should be deactivated instead.',
      confirmLabel: 'Delete teacher',
      tone: 'danger',
    });
    if (!ok) return;
    setBusyId(teacher.teacher_id);
    try {
      await adminService.deleteTeacher(teacher.teacher_id);
      toast.success('Teacher deleted.');
      setTeachers((list) => list.filter((t) => t.teacher_id !== teacher.teacher_id));
    } catch (err) {
      toast.error(err.message || 'Failed to delete teacher');
    } finally {
      setBusyId(null);
    }
  };

  if (loading && !teachers.length) return <PageSkeleton label="Loading teachers…" />;
  if (error) return <ErrorState message={error} onRetry={fetchTeachers} />;

  return (
    <div className="page">
      <PageHeader
        title="Teachers"
        description="Faculty accounts, public profiles and invitations."
        actions={
          <button type="button" onClick={openAdd} className="btn-primary">
            <Icon name="plus" className="h-4 w-4" /> Add teacher
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Teachers" value={teachers.length} icon="teacher" tone="brand" />
        <StatCard label="Active" value={teachers.filter((t) => t.is_active).length} icon="checkCircle" tone="success" />
        <StatCard label="Batches taught" value={teachers.reduce((s, t) => s + (t.total_batches || 0), 0)} icon="collection" tone="gold" />
        <StatCard label="Students taught" value={teachers.reduce((s, t) => s + (t.total_students || 0), 0)} icon="users" tone="info" />
      </div>

      <section className="surface overflow-hidden">
        <div className="border-b border-sand-200 p-4 sm:px-5">
          <div className="relative max-w-md">
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input type="search" placeholder="Name, email or specialisation" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-9" aria-label="Search teachers" />
          </div>
        </div>
        {filtered.length === 0 ? (
          <EmptyState
            icon="user"
            title={teachers.length ? 'No teachers match your search' : 'No teachers yet'}
            description={teachers.length ? 'Try a different search term.' : 'Add your first teacher to get started.'}
            actionText={teachers.length ? undefined : 'Add teacher'}
            onAction={teachers.length ? undefined : openAdd}
          />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Teacher</th>
                  <th scope="col" className="hidden lg:table-cell">
                    Specialisation
                  </th>
                  <th scope="col" className="hidden md:table-cell text-right">
                    Batches
                  </th>
                  <th scope="col" className="hidden md:table-cell text-right">
                    Students
                  </th>
                  <th scope="col">Status</th>
                  <th scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const busy = busyId === t.teacher_id;
                  return (
                    <tr key={t.teacher_id}>
                      <td>
                        <p className="flex items-center gap-2 font-medium text-accent">
                          {t.full_name}
                          {t.is_senior && <span className="badge-gold">Senior</span>}
                        </p>
                        <p className="text-xs text-gray-500">{t.email}</p>
                      </td>
                      <td className="hidden text-gray-600 lg:table-cell">
                        {t.specialization || '—'}
                        <span className="block text-xs text-gray-500">{t.experience_years ?? 0} years</span>
                      </td>
                      <td className="hidden text-right tabular-nums md:table-cell">{t.total_batches}</td>
                      <td className="hidden text-right tabular-nums md:table-cell">{t.total_students}</td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          <StatusBadge status={t.is_active ? 'active' : 'inactive'} />
                          {t.invite_pending && <span className="badge-warning">Invite pending</span>}
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-end gap-0.5">
                          <RowAction icon="pencil" label={`Edit ${t.full_name}`} onClick={() => openEdit(t)} disabled={busy} />
                          {t.is_active && <RowAction icon="key" label={`Password link for ${t.full_name}`} onClick={() => handleSendLink(t)} disabled={busy} />}
                          <RowAction
                            icon={t.is_active ? 'eyeOff' : 'refresh'}
                            label={t.is_active ? `Deactivate ${t.full_name}` : `Reactivate ${t.full_name}`}
                            onClick={() => handleToggleStatus(t)}
                            disabled={busy}
                          />
                          <RowAction icon="trash" label={`Delete ${t.full_name}`} onClick={() => handleDelete(t)} disabled={busy} danger />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <p className="border-t border-sand-200 px-5 py-3 text-xs text-gray-500">
          Showing {filtered.length} of {teachers.length} teachers
        </p>
      </section>

      <InviteLinkDialog invite={invite?.invite} name={invite?.name} onClose={() => setInvite(null)} />

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === 'add' ? 'Add a teacher' : 'Edit teacher'}
        description={modal?.mode === 'add' ? 'You will get a one-time link to share so the teacher can set their own password.' : modal?.teacher?.full_name}
        size="lg"
        dismissible={!saving}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            {FIELDS.map(([name, label, type, required]) => (
              <div key={name}>
                <label htmlFor={`t-${name}`} className="form-label">
                  {label} {!required && <span className="font-normal text-gray-500">(optional)</span>}
                </label>
                <input
                  id={`t-${name}`}
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="input-field"
                  required={required}
                  min={type === 'number' ? 0 : undefined}
                  max={type === 'number' ? 80 : undefined}
                />
              </div>
            ))}
            <label className="flex cursor-pointer items-start gap-3 self-end rounded-lg border border-sand-200 p-3">
              <input type="checkbox" name="isSenior" checked={formData.isSenior} onChange={handleChange} className="mt-1 h-4 w-4" />
              <span className="text-sm">
                <span className="font-medium text-accent">Senior faculty</span>
                <span className="block text-gray-500">Listed first on the public Teachers page</span>
              </span>
            </label>
            <div className="sm:col-span-2">
              <label htmlFor="t-qualifications" className="form-label">
                Qualifications <span className="font-normal text-gray-500">(optional)</span>
              </label>
              <input id="t-qualifications" name="qualifications" value={formData.qualifications} onChange={handleChange} className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="t-bio" className="form-label">
                Bio <span className="font-normal text-gray-500">(shown publicly)</span>
              </label>
              <textarea id="t-bio" name="bio" value={formData.bio} onChange={handleChange} rows={3} className="input-field" />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={() => setModal(null)} className="btn-secondary" disabled={saving}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : modal?.mode === 'add' ? 'Add teacher' : 'Save changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminTeachers;
