import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminStudents = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    // TODO: Fetch all students from API
    setStudents([
      { id: 1, name: 'Riya Sharma', rollNo: 'RN001', email: 'riya@test.com', phone: '9876543210', level: 'Praveshika Pratham', batch: 'Morning Batch A', status: 'active', enrollmentDate: '2025-09-01' },
      { id: 2, name: 'Amit Kumar', rollNo: 'RN002', email: 'amit@test.com', phone: '9876543211', level: 'Praveshika Pratham', batch: 'Morning Batch A', status: 'active', enrollmentDate: '2025-09-01' },
      { id: 3, name: 'Priya Patel', rollNo: 'RN003', email: 'priya@test.com', phone: '9876543212', level: 'Madhyama Pratham', batch: 'Evening Batch B', status: 'active', enrollmentDate: '2025-08-15' },
      { id: 4, name: 'Rahul Singh', rollNo: 'RN004', email: 'rahul@test.com', phone: '9876543213', level: 'Madhyama Pratham', batch: 'Evening Batch B', status: 'active', enrollmentDate: '2025-08-15' },
      { id: 5, name: 'Sneha Gupta', rollNo: 'RN005', email: 'sneha@test.com', phone: '9876543214', level: 'Visharad Pratham', batch: 'Advanced Batch', status: 'active', enrollmentDate: '2025-07-20' },
      { id: 6, name: 'Inactive Student', rollNo: 'RN006', email: 'inactive@test.com', phone: '9876543215', level: 'Praveshika Purna', batch: null, status: 'inactive', enrollmentDate: '2025-06-01' },
    ]);
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || student.level === filterLevel;
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      // TODO: API call to delete student
      setStudents(students.filter(s => s.id !== studentId));
      alert('Student deleted successfully!');
    }
  };

  const handleToggleStatus = (studentId) => {
    // TODO: API call to toggle status
    setStudents(students.map(s => 
      s.id === studentId 
        ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' }
        : s
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-heading font-bold text-primary mb-2">
              Manage Students
            </h1>
            <p className="text-gray-600">View, add, edit, and manage all students</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            + Add New Student
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Students</p>
            <p className="text-3xl font-bold text-primary">{students.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Active</p>
            <p className="text-3xl font-bold text-green-600">
              {students.filter(s => s.status === 'active').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Inactive</p>
            <p className="text-3xl font-bold text-red-600">
              {students.filter(s => s.status === 'inactive').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Without Batch</p>
            <p className="text-3xl font-bold text-yellow-600">
              {students.filter(s => !s.batch).length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-accent mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by name, roll no, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-accent mb-2">Filter by Level</label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="input-field"
              >
                <option value="all">All Levels</option>
                <option value="Praveshika Pratham">Praveshika Pratham</option>
                <option value="Praveshika Purna">Praveshika Purna</option>
                <option value="Madhyama Pratham">Madhyama Pratham</option>
                <option value="Madhyama Purna">Madhyama Purna</option>
                <option value="Visharad Pratham">Visharad Pratham</option>
                <option value="Visharad Purna">Visharad Purna</option>
                <option value="Alankar Pratham">Alankar Pratham</option>
                <option value="Alankar Purna">Alankar Purna</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-accent mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            Showing {filteredStudents.length} of {students.length} students
          </p>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Roll No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Student Details</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Level</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Batch</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Enrollment Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm font-semibold text-gray-900">{student.rollNo}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-accent">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                      <p className="text-sm text-gray-500">{student.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.level}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {student.batch || <span className="text-yellow-600 font-semibold">Not Assigned</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        student.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(student.enrollmentDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(student.id)}
                          className="text-yellow-600 hover:text-yellow-800 font-semibold text-sm"
                          title={student.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {student.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => handleDeleteStudent(student.id)}
                          className="text-red-600 hover:text-red-800 font-semibold text-sm"
                          title="Delete"
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

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No students found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Add Student Modal - Placeholder */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
              <h2 className="text-2xl font-bold text-accent mb-4">Add New Student</h2>
              <p className="text-gray-600 mb-6">
                Student registration form will be implemented here with all fields.
              </p>
              <button 
                onClick={() => setShowAddModal(false)}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStudents;
