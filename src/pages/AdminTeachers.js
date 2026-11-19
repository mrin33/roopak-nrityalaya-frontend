import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // One-time password-setup link returned by the API (shown once to the admin)
  const [inviteInfo, setInviteInfo] = useState(null);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    experienceYears: '',
    qualifications: '',
    bio: ''
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const adminService = require('../services/adminService').default;
      const data = await adminService.getAllTeachers();
      setTeachers(data.map(t => ({
        id: t.teacher_id,
        name: t.full_name,
        email: t.email,
        phone: t.phone,
        specialization: t.specialization,
        experience: t.experience_years,
        batches: t.total_batches || 0,
        invitePending: t.invite_pending,
        students: t.total_students || 0,
        isActive: t.is_active
      })));
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = teachers.filter(teacher =>
    (teacher.name && teacher.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (teacher.email && teacher.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (teacher.specialization && teacher.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const adminService = require('../services/adminService').default;
      const teacherPayload = {
        email: formData.email,
        full_name: formData.fullName,
        phone: formData.phone,
        specialization: formData.specialization,
        experience_years: parseInt(formData.experienceYears) || 0,
        qualifications: formData.qualifications || '',
        bio: formData.bio || ''
      };
      // No password is sent: the teacher sets their own via the invitation link.
      const result = await adminService.createTeacher(teacherPayload);
      setCopied(false);
      setInviteInfo({ name: formData.fullName, ...result.invite });
      fetchTeachers();
      setShowAddModal(false);
      setFormData({ fullName: '', email: '', phone: '', specialization: '', experienceYears: '', qualifications: '', bio: '' });
    } catch (err) {
      console.error('Error adding teacher:', err);
      alert(err.message || 'Failed to add teacher');
    }
  };

  const handleToggleStatus = async (teacherId) => {
    try {
      const teacher = teachers.find(t => t.id === teacherId);
      const newStatus = !teacher.isActive;
      const adminService = require('../services/adminService').default;
      await adminService.updateTeacher(teacherId, { is_active: newStatus });
      setTeachers(teachers.map(t => 
        t.id === teacherId ? { ...t, isActive: newStatus } : t
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  const handleSendLink = async (teacher) => {
    try {
      const adminService = require('../services/adminService').default;
      const result = await adminService.regenerateTeacherInvite(teacher.id);
      setCopied(false);
      setInviteInfo({ name: teacher.name, ...result.invite });
    } catch (err) {
      alert(err.message || 'Failed to create a password setup link');
    }
  };

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteInfo.url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const handleDelete = async (teacherId) => {
    if (window.confirm('Delete this teacher?')) {
      try {
        const adminService = require('../services/adminService').default;
        await adminService.deleteTeacher(teacherId);
        setTeachers(teachers.filter(t => t.id !== teacherId));
      } catch (err) {
        console.error('Error deleting teacher:', err);
        alert(err.message || 'Failed to delete teacher');
      }
    }
  };

  if (loading) return <LoadingSpinner fullScreen={true} text="Loading teachers..." size="lg" />;
  if (error) return <div className="min-h-screen flex items-center justify-center"><div className="text-red-600">{error}</div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-heading font-bold text-primary mb-2">
              Manage Teachers
            </h1>
            <p className="text-gray-600">Add, edit, and manage teaching staff</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            + Add New Teacher
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Teachers</p>
            <p className="text-3xl font-bold text-primary">{teachers.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Active</p>
            <p className="text-3xl font-bold text-green-600">
              {teachers.filter(t => t.isActive).length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Batches</p>
            <p className="text-3xl font-bold text-blue-600">
              {teachers.reduce((sum, t) => sum + t.batches, 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Students</p>
            <p className="text-3xl font-bold text-purple-600">
              {teachers.reduce((sum, t) => sum + t.students, 0)}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <input
            type="text"
            placeholder="Search by name, email, or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
          <p className="text-sm text-gray-600 mt-2">
            Showing {filteredTeachers.length} of {teachers.length} teachers
          </p>
        </div>

        {/* Teachers Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Specialization</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Experience</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Batches</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Students</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-accent">{teacher.name}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{teacher.email}</p>
                      <p className="text-sm text-gray-500">{teacher.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{teacher.specialization}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{teacher.experience} years</td>
                    <td className="px-6 py-4 text-sm font-semibold text-primary">{teacher.batches}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">{teacher.students}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        teacher.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {teacher.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {teacher.invitePending && (
                        <span className="ml-2 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                          Invite pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                          Edit
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(teacher.id)}
                          className="text-yellow-600 hover:text-yellow-800 text-sm font-semibold"
                        >
                          {teacher.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleSendLink(teacher)}
                          className="text-primary hover:text-primary-dark text-sm font-semibold"
                          title="Create a new password setup link"
                        >
                          Send link
                        </button>
                        <button 
                          onClick={() => handleDelete(teacher.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-semibold"
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

        {/* Invitation link (shown once after creating a teacher / requesting a new link) */}
        {inviteInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
              <h2 className="text-2xl font-bold text-accent mb-2">Password setup link</h2>
              <p className="text-gray-600 mb-4">
                Share this one-time link with <span className="font-semibold">{inviteInfo.name}</span> so they can
                choose their own password. It expires on{' '}
                <span className="font-semibold">{new Date(inviteInfo.expires_at).toLocaleString()}</span> and is not
                shown again.
              </p>
              <div className="flex gap-2">
                <input readOnly value={inviteInfo.url} className="input-field text-sm" onFocus={(e) => e.target.select()} aria-label="Invitation link" />
                <button type="button" onClick={copyInviteLink} className="btn-primary whitespace-nowrap">
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="flex justify-end mt-6">
                <button type="button" onClick={() => setInviteInfo(null)} className="btn-secondary">Done</button>
              </div>
            </div>
          </div>
        )}

        {/* Add Teacher Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="bg-primary text-white p-6 rounded-t-2xl sticky top-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Add New Teacher</h2>
                  <button 
                    onClick={() => setShowAddModal(false)} 
                    className="text-white hover:bg-white/20 rounded-full p-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Full Name *</label>
                    <input 
                      type="text" 
                      name="fullName" 
                      value={formData.fullName} 
                      onChange={handleChange} 
                      className="input-field" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Email *</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      className="input-field" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Phone *</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      className="input-field" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Specialization *</label>
                    <input 
                      type="text" 
                      name="specialization" 
                      value={formData.specialization} 
                      onChange={handleChange} 
                      className="input-field" 
                      placeholder="E.g., Lucknow Gharana" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Years of Experience *</label>
                    <input 
                      type="number" 
                      name="experienceYears" 
                      value={formData.experienceYears} 
                      onChange={handleChange} 
                      className="input-field" 
                      min="0" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Qualifications</label>
                    <input 
                      type="text" 
                      name="qualifications" 
                      value={formData.qualifications} 
                      onChange={handleChange} 
                      className="input-field" 
                      placeholder="E.g., MA in Kathak" 
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-semibold text-accent mb-2">Bio</label>
                  <textarea 
                    name="bio" 
                    value={formData.bio} 
                    onChange={handleChange} 
                    rows="4" 
                    className="input-field" 
                    placeholder="Brief introduction..."
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)} 
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                  >
                    Add Teacher
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
