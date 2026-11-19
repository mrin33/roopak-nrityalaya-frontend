import React, { useState, useEffect } from 'react';

import RollNumberBadge from '../components/RollNumberBadge';
import PaymentWindowBadge from '../components/PaymentWindowBadge';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminStudents = () => {
  // const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaymentWindow, setFilterPaymentWindow] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const adminService = require('../services/adminService').default;
      const data = await adminService.getAllStudents();
      setStudents(data.map(s => ({
        id: s.student_id,
        roll_number: s.roll_number,
        name: s.full_name,
        email: s.email,
        phone: s.phone,
        level: s.level_name || 'Unassigned',
        batch: s.batch_name,
        payment_window: s.payment_window || 'monthly',
        discount: s.discount || 0,
        status: s.status,
        enrollmentDate: s.enrollment_date
      })));
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (student.roll_number && student.roll_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = filterLevel === 'all' || student.level === filterLevel;
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    const matchesPayment = filterPaymentWindow === 'all' || student.payment_window === filterPaymentWindow;
    return matchesSearch && matchesLevel && matchesStatus && matchesPayment;
  });

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const adminService = require('../services/adminService').default;
        await adminService.deleteStudent(studentId);
        setStudents(students.filter(s => s.id !== studentId));
        alert('Student deleted successfully!');
      } catch (err) {
        console.error('Error deleting student:', err);
        alert('Failed to delete student');
      }
    }
  };

  const handleToggleStatus = async (studentId) => {
    try {
      const student = students.find(s => s.id === studentId);
      const newStatus = student.status === 'active' ? 'inactive' : 'active';
      const adminService = require('../services/adminService').default;
      await adminService.changeStudentStatus(studentId, { status: newStatus });
      setStudents(students.map(s => 
        s.id === studentId 
          ? { ...s, status: newStatus }
          : s
      ));
    } catch (err) {
      console.error('Error changing abstract status:', err);
      alert('Failed to change student status');
    }
  };

  if (loading) return <LoadingSpinner fullScreen={true} text="Loading students..." size="lg" />;
  if (error) return <div className="min-h-screen flex items-center justify-center"><div className="text-red-600">{error}</div></div>;

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
          <button onClick={() => setShowAddModal(true)} className="btn-primary">
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

        {/* Filters - UPDATED with Payment Window */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-accent mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by name, roll no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-accent mb-2">Level</label>
              <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="input-field">
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
              <label className="block text-sm font-semibold text-accent mb-2">Status</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* NEW Phase 1 Filter */}
            <div>
              <label className="block text-sm font-semibold text-accent mb-2">Payment Plan</label>
              <select value={filterPaymentWindow} onChange={(e) => setFilterPaymentWindow(e.target.value)} className="input-field">
                <option value="all">All Plans</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="half_yearly">Half-Yearly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            Showing {filteredStudents.length} of {students.length} students
          </p>
        </div>

        {/* Students Table - UPDATED with Roll Number and Payment Window */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Roll No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Student Details</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Level</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Payment Plan</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Batch</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50 transition-colors">
                     <td className="px-6 py-4">
                      <RollNumberBadge rollNumber={student.roll_number} size="lg" />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-accent">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                      <p className="text-sm text-gray-500">{student.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.level}</td>
                      <td className="px-6 py-4">
                        <PaymentWindowBadge 
                          paymentWindow={student.payment_window}
                          discount={student.discount}
                        />
                    </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                      {student.batch || <span className="text-yellow-600 font-semibold">Not Assigned</span>}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={student.status} type="student" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
                          Edit
                        </button>
                        <button onClick={() => handleToggleStatus(student.id)} className="text-yellow-600 hover:text-yellow-800 font-semibold text-sm">
                          {student.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => handleDeleteStudent(student.id)} className="text-red-600 hover:text-red-800 font-semibold text-sm">
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
            <EmptyState 
              icon="user"
              title="No students found"
              description="Try adjusting your search or filter criteria"
            />
          )}
        </div>

        {/* Add Student Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
              <h2 className="text-2xl font-bold text-accent mb-4">Add New Student</h2>
              <p className="text-gray-600 mb-6">
                Student registration form will be implemented here.
              </p>
              <button onClick={() => setShowAddModal(false)} className="btn-primary">
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
