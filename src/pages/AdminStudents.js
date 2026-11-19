import React, { useCallback, useEffect, useState } from 'react';
import RollNumberBadge from '../components/RollNumberBadge';
import PaymentWindowBadge from '../components/PaymentWindowBadge';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingSpinner from '../components/LoadingSpinner';
import InviteLinkDialog from '../components/InviteLinkDialog';
import adminService from '../services/adminService';
import useLevels from '../hooks/useLevels';
import { useToast } from '../context/ToastContext';

const PAYMENT_WINDOWS = [
  ['monthly', 'Monthly'],
  ['quarterly', 'Quarterly'],
  ['half_yearly', 'Half-Yearly'],
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

const AdminStudents = () => {
  const toast = useToast();
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

  const q = searchTerm.toLowerCase();
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      (s.full_name || '').toLowerCase().includes(q) ||
      (s.roll_number || '').toLowerCase().includes(q) ||
      (s.email || '').toLowerCase().includes(q);
    const matchesLevel = filterLevel === 'all' || String(s.current_level_id) === filterLevel;
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    const matchesPayment = filterPaymentWindow === 'all' || s.payment_window === filterPaymentWindow;
    return matchesSearch && matchesLevel && matchesStatus && matchesPayment;
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
        const result = await adminService.createStudent({
          ...formData,
          batch_id: formData.batch_id || undefined,
        });
        setInvite({ invite: result.invite, name: formData.full_name });
        toast.success(`${formData.full_name} was enrolled (roll number ${result.student.roll_number}).`);
      } else {
        const { enrollment_reason, ...rest } = formData;
        await adminService.updateStudent(modal.student.student_id, {
          ...rest,
          batch_id: formData.batch_id ? Number(formData.batch_id) : null,
        });
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
      reason = window.prompt(`Reason for deactivating ${student.full_name} (optional):`, '');
      if (reason === null) return; // cancelled
    }
    setBusyId(student.student_id);
    try {
      await adminService.changeStudentStatus(student.student_id, {
        status: activate ? 'active' : 'inactive',
        reason: reason || undefined,
      });
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
    if (!window.confirm(`Delete ${student.full_name}? Their login and records will be removed. This cannot be undone.`)) return;
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

  if (loading && !students.length) return <LoadingSpinner fullScreen={true} text="Loading students..." size="lg" />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  const batchesForLevel = batches.filter(
    (b) => b.is_active && (!formData.current_level_id || String(b.level_id) === formData.current_level_id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-primary mb-2">Manage Students</h1>
            <p className="text-gray-600">View, add, edit, and manage all students</p>
          </div>
          <button onClick={openAdd} className="btn-primary">
            + Add New Student
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[
            ['Total Students', students.length, 'text-primary'],
            ['Active', students.filter((s) => s.status === 'active').length, 'text-green-600'],
            ['Inactive', students.filter((s) => s.status !== 'active').length, 'text-red-600'],
            ['Without a batch', students.filter((s) => !s.batch_name && s.status === 'active').length, 'text-yellow-600'],
          ].map(([label, value, color]) => (
            <div key={label} className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <p className="text-sm text-gray-600 mb-1">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="search"
              placeholder="Search name, roll number, email…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              aria-label="Search students"
            />
            <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="input-field" aria-label="Filter by level">
              <option value="all">All Levels</option>
              {levels.map((l) => (
                <option key={l.level_id} value={String(l.level_id)}>
                  {l.level_name}
                </option>
              ))}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field" aria-label="Filter by status">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={filterPaymentWindow}
              onChange={(e) => setFilterPaymentWindow(e.target.value)}
              className="input-field"
              aria-label="Filter by payment plan"
            >
              <option value="all">All Payment Plans</option>
              {PAYMENT_WINDOWS.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Showing {filteredStudents.length} of {students.length} students
          </p>
        </div>

        {/* Table */}
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg">
            <EmptyState
              icon="user"
              title={students.length ? 'No students match your filters' : 'No students yet'}
              description={students.length ? 'Try changing the search or filters.' : 'Enrol your first student to get started.'}
              actionText={students.length ? undefined : 'Add Student'}
              onAction={students.length ? undefined : openAdd}
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-primary/10 to-secondary/10">
                  <tr>
                    {['Roll No.', 'Student', 'Level', 'Payment Plan', 'Batch', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-sm font-semibold text-accent whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.student_id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <RollNumberBadge rollNumber={student.roll_number} size="lg" />
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-accent">{student.full_name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                        <p className="text-sm text-gray-500">{student.phone}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{student.level_name || 'Unassigned'}</td>
                      <td className="px-6 py-4">
                        <PaymentWindowBadge paymentWindow={student.payment_window} discount={student.discount} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {student.batch_name || <span className="text-yellow-600 font-semibold">Not Assigned</span>}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={student.status} type="student" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          <button
                            onClick={() => openEdit(student)}
                            disabled={busyId === student.student_id}
                            className="text-blue-600 hover:text-blue-800 font-semibold text-sm disabled:opacity-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleStatus(student)}
                            disabled={busyId === student.student_id}
                            className="text-yellow-600 hover:text-yellow-800 font-semibold text-sm disabled:opacity-50"
                          >
                            {student.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                          {student.status === 'active' && (
                            <button
                              onClick={() => handleSendLink(student)}
                              disabled={busyId === student.student_id}
                              className="text-primary hover:text-primary-dark font-semibold text-sm disabled:opacity-50"
                              title="Create a password setup / reset link"
                            >
                              Send link
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteStudent(student)}
                            disabled={busyId === student.student_id}
                            className="text-red-600 hover:text-red-800 font-semibold text-sm disabled:opacity-50"
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

        {/* Add / Edit Student Modal */}
        {modal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-accent">{modal.mode === 'add' ? 'Add New Student' : 'Edit Student'}</h2>
                <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600 text-2xl" aria-label="Close">
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                {modal.mode === 'add' && (
                  <p className="text-sm text-gray-600 bg-blue-50 border-l-4 border-blue-400 p-3 rounded mb-6">
                    A roll number is generated automatically. After saving you will get a one-time link for the student
                    to set their password.
                  </p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    ['full_name', 'Full Name *', 'text', true],
                    ['email', 'Email *', 'email', true],
                    ['phone', 'Phone', 'tel', false],
                    ['date_of_birth', 'Date of Birth', 'date', false],
                    ['emergency_contact_name', 'Emergency Contact Name', 'text', false],
                    ['emergency_contact', 'Emergency Contact Phone', 'tel', false],
                  ].map(([name, label, type, required]) => (
                    <div key={name}>
                      <label htmlFor={`s-${name}`} className="block text-sm font-semibold text-gray-700 mb-2">
                        {label}
                      </label>
                      <input id={`s-${name}`} type={type} name={name} value={formData[name]} onChange={handleChange} className="input-field" required={required} />
                    </div>
                  ))}
                  <div>
                    <label htmlFor="s-gender" className="block text-sm font-semibold text-gray-700 mb-2">
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
                    <label htmlFor="s-level" className="block text-sm font-semibold text-gray-700 mb-2">
                      Level *
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
                    <label htmlFor="s-pw" className="block text-sm font-semibold text-gray-700 mb-2">
                      Payment Plan
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
                    <label htmlFor="s-batch" className="block text-sm font-semibold text-gray-700 mb-2">
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
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="s-address" className="block text-sm font-semibold text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea id="s-address" name="address" value={formData.address} onChange={handleChange} rows="2" className="input-field" />
                  </div>
                  {modal.mode === 'add' && (
                    <div className="md:col-span-2">
                      <label htmlFor="s-reason" className="block text-sm font-semibold text-gray-700 mb-2">
                        Enrollment note
                      </label>
                      <textarea id="s-reason" name="enrollment_reason" value={formData.enrollment_reason} onChange={handleChange} rows="2" className="input-field" />
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-4 mt-8">
                  <button type="button" onClick={() => setModal(null)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                    {saving ? 'Saving…' : modal.mode === 'add' ? 'Enrol Student' : 'Save Changes'}
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

export default AdminStudents;
