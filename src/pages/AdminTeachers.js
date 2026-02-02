import React, { useState, useEffect } from 'react';

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
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
    // TODO: Fetch all teachers from API
    setTeachers([
      { 
        id: 1, 
        name: 'Priya Sharma', 
        email: 'priya.teacher@test.com', 
        phone: '9876543210', 
        specialization: 'Lucknow Gharana', 
        experience: 15, 
        batches: 4, 
        students: 45, 
        isActive: true 
      },
      { 
        id: 2, 
        name: 'Rajesh Kumar', 
        email: 'rajesh.teacher@test.com', 
        phone: '9876543211', 
        specialization: 'Jaipur Gharana', 
        experience: 12, 
        batches: 3, 
        students: 38, 
        isActive: true 
      },
      { 
        id: 3, 
        name: 'Meera Iyer', 
        email: 'meera.teacher@test.com', 
        phone: '9876543212', 
        specialization: 'Kathak Classical', 
        experience: 10, 
        batches: 2, 
        students: 25, 
        isActive: true 
      },
      { 
        id: 4, 
        name: 'Anil Verma', 
        email: 'anil.teacher@test.com', 
        phone: '9876543213', 
        specialization: 'Banaras Gharana', 
        experience: 8, 
        batches: 2, 
        students: 20, 
        isActive: false 
      },
    ]);
  }, []);

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add teacher via API
    alert('Teacher added! (API integration pending)');
    setShowAddModal(false);
    setFormData({ fullName: '', email: '', phone: '', specialization: '', experienceYears: '', qualifications: '', bio: '' });
  };

  const handleToggleStatus = (teacherId) => {
    setTeachers(teachers.map(t => 
      t.id === teacherId ? { ...t, isActive: !t.isActive } : t
    ));
  };

  const handleDelete = (teacherId) => {
    if (window.confirm('Delete this teacher?')) {
      setTeachers(teachers.filter(t => t.id !== teacherId));
    }
  };

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
