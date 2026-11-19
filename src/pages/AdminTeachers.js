import React, { useCallback, useEffect, useState } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import InviteLinkDialog from '../components/InviteLinkDialog';
import adminService from '../services/adminService';
import { useToast } from '../context/ToastContext';

const EMPTY_FORM = {
  fullName: '',
  email: '',
  phone: '',
  specialization: '',
  experienceYears: '',
  qualifications: '',
  bio: '',
  isSenior: false,
};

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

const AdminTeachers = () => {
  const toast = useToast();
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null); // null | { mode: 'add' } | { mode: 'edit', teacher }
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [invite, setInvite] = useState(null); // { invite, name }

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

  const q = searchTerm.toLowerCase();
  const filteredTeachers = teachers.filter(
    (t) =>
      (t.full_name || '').toLowerCase().includes(q) ||
      (t.email || '').toLowerCase().includes(q) ||
      (t.specialization || '').toLowerCase().includes(q)
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
    if (!window.confirm(`Delete ${teacher.full_name}? Their login will be removed. This cannot be undone.`)) return;
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

  if (loading && !teachers.length) return <PageSkeleton label="Loading teachers..." />;
  if (error) return <ErrorState message={error} onRetry={fetchTeachers} />;

  return (
    <div className="page">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="page-title">Manage Teachers</h1>
            <p className="text-gray-600">Add, edit, and manage teaching staff</p>
          </div>
          <button onClick={openAdd} className="btn-primary">
            + Add New Teacher
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[
            ['Total Teachers', teachers.length, 'text-primary'],
            ['Active', teachers.filter((t) => t.is_active).length, 'text-green-600'],
            ['Total Batches', teachers.reduce((s, t) => s + (t.total_batches || 0), 0), 'text-blue-600'],
            ['Total Students', teachers.reduce((s, t) => s + (t.total_students || 0), 0), 'text-purple-600'],
          ].map(([label, value, color]) => (
            <div key={label} className="card">
              <p className="text-sm text-gray-600 mb-1">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="card mb-6">
          <input
            type="search"
            placeholder="Search by name, email, or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            aria-label="Search teachers"
          />
          <p className="text-sm text-gray-600 mt-2">
            Showing {filteredTeachers.length} of {teachers.length} teachers
          </p>
        </div>

        {/* Teachers Table */}
        {filteredTeachers.length === 0 ? (
          <div className="surface">
            <EmptyState
              icon="user"
              title={teachers.length ? 'No teachers match your search' : 'No teachers yet'}
              description={teachers.length ? 'Try a different search term.' : 'Add your first teacher to get started.'}
              actionText={teachers.length ? undefined : 'Add Teacher'}
              onAction={teachers.length ? undefined : openAdd}
            />
          </div>
        ) : (
          <div className="surface overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sand-50 border-b-2">
                  <tr>
                    {['Teacher', 'Specialization', 'Experience', 'Batches', 'Students', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-200">
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher.teacher_id} className="hover:bg-sand-50">
                      <td className="td">
                        <p className="font-semibold text-accent">{teacher.full_name}</p>
                        <p className="text-sm text-gray-600">{teacher.email}</p>
                        {teacher.phone && <p className="text-sm text-gray-500">{teacher.phone}</p>}
                      </td>
                      <td className="td text-gray-600">{teacher.specialization || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{teacher.experience_years ?? 0} years</td>
                      <td className="px-6 py-4 text-sm font-semibold text-primary">{teacher.total_batches}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">{teacher.total_students}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            teacher.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {teacher.is_active ? 'Active' : 'Inactive'}
                        </span>
                        {teacher.invite_pending && (
                          <span className="ml-2 px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                            Invite pending
                          </span>
                        )}
                      </td>
                      <td className="td">
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          <button onClick={() => openEdit(teacher)} className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleStatus(teacher)}
                            disabled={busyId === teacher.teacher_id}
                            className="text-amber-600 hover:text-amber-800 text-sm font-semibold disabled:opacity-50"
                          >
                            {teacher.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                          {teacher.is_active && (
                            <button
                              onClick={() => handleSendLink(teacher)}
                              disabled={busyId === teacher.teacher_id}
                              className="text-primary hover:text-primary-dark text-sm font-semibold disabled:opacity-50"
                              title="Create a new password setup link"
                            >
                              Send link
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(teacher)}
                            disabled={busyId === teacher.teacher_id}
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

        <InviteLinkDialog invite={invite?.invite} name={invite?.name} onClose={() => setInvite(null)} />

        {/* Add / Edit Teacher Modal */}
        {modal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="section-title">{modal.mode === 'add' ? 'Add New Teacher' : 'Edit Teacher'}</h2>
                <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600 text-2xl" aria-label="Close">
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                {modal.mode === 'add' && (
                  <p className="text-sm text-gray-600 bg-blue-50 border-l-4 border-blue-400 p-3 rounded mb-6">
                    After saving you will get a one-time link to share with the teacher so they can set their own password.
                  </p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    ['fullName', 'Full Name *', 'text', true],
                    ['email', 'Email *', 'email', true],
                    ['phone', 'Phone', 'tel', false],
                    ['specialization', 'Specialization', 'text', false],
                    ['experienceYears', 'Experience (years)', 'number', false],
                  ].map(([name, label, type, required]) => (
                    <div key={name}>
                      <label htmlFor={`t-${name}`} className="form-label">
                        {label}
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
                  <label className="flex items-center gap-2 mt-8 text-sm font-semibold text-gray-700">
                    <input type="checkbox" name="isSenior" checked={formData.isSenior} onChange={handleChange} />
                    Senior teacher
                  </label>
                  <div className="md:col-span-2">
                    <label htmlFor="t-qualifications" className="form-label">
                      Qualifications
                    </label>
                    <input id="t-qualifications" name="qualifications" value={formData.qualifications} onChange={handleChange} className="input-field" />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="t-bio" className="form-label">
                      Bio
                    </label>
                    <textarea id="t-bio" name="bio" value={formData.bio} onChange={handleChange} rows="3" className="input-field" />
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-8">
                  <button type="button" onClick={() => setModal(null)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                    {saving ? 'Saving…' : modal.mode === 'add' ? 'Add Teacher' : 'Save Changes'}
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

export default AdminTeachers;
