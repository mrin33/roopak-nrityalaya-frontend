import React, { useState, useEffect } from 'react';
import BatchCapacityBar from '../components/BatchCapacityBar';
import StatusBadge from '../components/StatusBadge';
// import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminBatches = () => {
  const [batches, setBatches] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    levelId: '',
    teacherId: '',
    schedule: '',
    time: '',
    room: '',
    maxStudents: ''
  });

  useEffect(() => {
    fetchBatchesAndTeachers();
  }, []);

  const fetchBatchesAndTeachers = async () => {
    try {
      setLoading(true);
      const adminService = require('../services/adminService').default;
      const [batchesData, teachersData] = await Promise.all([
        adminService.getAllBatches(),
        adminService.getAllTeachers()
      ]);

      setBatches(batchesData.map(b => ({
        id: b.batch_id,
        name: b.batch_name,
        level: b.level_name,
        teacher: b.full_name || 'Unassigned',
        schedule: b.schedule,
        time: b.time,
        room: b.room,
        current_enrolled: b.current_enrolled || 0,
        max_students: b.max_students || parseInt(b.maxStudents) || 15,
        isActive: b.is_active
      })));
      setTeachers(teachersData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load batches');
    } finally {
      setLoading(false);
    }
  };

  const filteredBatches = batches.filter(batch =>
    (batch.name && batch.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (batch.teacher && batch.teacher.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const adminService = require('../services/adminService').default;
      await adminService.createBatch({
        batch_name: formData.name,
        level_id: formData.levelId,
        teacher_id: formData.teacherId,
        schedule: formData.schedule,
        time: formData.time,
        room: formData.room,
        max_students: formData.maxStudents,
        start_date: new Date().toISOString().split('T')[0]
      });
      alert('Batch created successfully!');
      fetchBatchesAndTeachers();
      setShowAddModal(false);
      setFormData({ name: '', levelId: '', teacherId: '', schedule: '', time: '', room: '', maxStudents: '' });
    } catch (err) {
      console.error('Error creating batch:', err);
      alert('Failed to create batch');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this batch?')) {
      try {
        const adminService = require('../services/adminService').default;
        await adminService.deleteBatch(id);
        setBatches(batches.filter(b => b.id !== id));
      } catch (err) {
        console.error('Error deleting batch:', err);
        alert('Failed to delete batch');
      }
    }
  };

  if (loading && batches.length === 0) return <LoadingSpinner fullScreen={true} text="Loading batches..." size="lg" />;
  if (error) return <div className="min-h-screen flex items-center justify-center"><div className="text-red-600">{error}</div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-heading font-bold text-primary mb-2">Manage Batches</h1>
            <p className="text-gray-600">Create and organize class batches</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            + Create Batch
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Batches</p>
            <p className="text-3xl font-bold text-primary">{batches.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Active</p>
            <p className="text-3xl font-bold text-green-600">{batches.filter(b => b.isActive).length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Students</p>
            <p className="text-3xl font-bold text-blue-600">{batches.reduce((sum, b) => sum + b.totalStudents, 0)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Available Slots</p>
            <p className="text-3xl font-bold text-purple-600">{batches.reduce((sum, b) => sum + (b.maxStudents - b.totalStudents), 0)}</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <input
            type="text"
            placeholder="Search batches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Batches Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Batch Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Level</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Teacher</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Schedule</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Capacity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBatches.map((batch) => (
                <tr key={batch.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-accent">{batch.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{batch.level}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{batch.teacher}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>{batch.schedule}</div>
                    <div className="text-xs text-gray-500">{batch.time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <BatchCapacityBar 
                      currentEnrolled={batch.current_enrolled || batch.totalStudents}
                      maxStudents={batch.max_students || batch.maxStudents}
                      showLabel={false}
                      size="sm"
                    />
                    <span className="text-xs text-gray-600 mt-1">
                      {batch.current_enrolled || batch.totalStudents}/{batch.max_students || batch.maxStudents}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={batch.isActive ? 'active' : 'inactive'} type="batch" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">Edit</button>
                      <button onClick={() => handleDelete(batch.id)} className="text-red-600 hover:text-red-800 text-sm font-semibold">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-primary text-white p-6 rounded-t-2xl sticky top-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Create New Batch</h2>
                  <button onClick={() => setShowAddModal(false)} className="text-white hover:bg-white/20 rounded-full p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Batch Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Level *</label>
                    <select name="levelId" value={formData.levelId} onChange={handleChange} className="input-field" required>
                      <option value="">Select level</option>
                      <option value="1">Praveshika Pratham</option>
                      <option value="2">Praveshika Purna</option>
                      <option value="3">Madhyama Pratham</option>
                      <option value="4">Madhyama Purna</option>
                      <option value="5">Visharad Pratham</option>
                      <option value="6">Visharad Purna</option>
                      <option value="7">Alankar Pratham</option>
                      <option value="8">Alankar Purna</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Teacher *</label>
                    <select name="teacherId" value={formData.teacherId} onChange={handleChange} className="input-field" required>
                      <option value="">Select teacher</option>
                      {teachers.map(t => (
                        <option key={t.teacher_id} value={t.teacher_id}>{t.full_name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Schedule *</label>
                    <input type="text" name="schedule" value={formData.schedule} onChange={handleChange} className="input-field" placeholder="E.g., Mon, Wed, Fri" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Time *</label>
                    <input type="text" name="time" value={formData.time} onChange={handleChange} className="input-field" placeholder="E.g., 8:00 AM - 9:30 AM" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Room *</label>
                    <input type="text" name="room" value={formData.room} onChange={handleChange} className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Max Students *</label>
                    <input type="number" name="maxStudents" value={formData.maxStudents} onChange={handleChange} className="input-field" min="1" required />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary">Create Batch</button>
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
