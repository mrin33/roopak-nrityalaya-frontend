import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const TeacherStudents = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [filterBatch, setFilterBatch] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    // TODO: Fetch teacher's batches and students from API
    setBatches([
      { id: 'all', name: 'All Batches' },
      { id: 1, name: 'Morning Batch A' },
      { id: 2, name: 'Evening Batch B' },
      { id: 3, name: 'Advanced Batch' },
      { id: 4, name: 'Weekend Special' },
    ]);

    setStudents([
      { id: 1, name: 'Riya Sharma', rollNo: 'RN001', batch: 'Morning Batch A', level: 'Praveshika Pratham', attendance: 92, phone: '9876543210', email: 'riya@test.com' },
      { id: 2, name: 'Amit Kumar', rollNo: 'RN002', batch: 'Morning Batch A', level: 'Praveshika Pratham', attendance: 88, phone: '9876543211', email: 'amit@test.com' },
      { id: 3, name: 'Priya Patel', rollNo: 'RN003', batch: 'Evening Batch B', level: 'Madhyama Pratham', attendance: 95, phone: '9876543212', email: 'priya@test.com' },
      { id: 4, name: 'Rahul Singh', rollNo: 'RN004', batch: 'Evening Batch B', level: 'Madhyama Pratham', attendance: 85, phone: '9876543213', email: 'rahul@test.com' },
      { id: 5, name: 'Sneha Gupta', rollNo: 'RN005', batch: 'Advanced Batch', level: 'Visharad Pratham', attendance: 97, phone: '9876543214', email: 'sneha@test.com' },
      { id: 6, name: 'Arjun Reddy', rollNo: 'RN006', batch: 'Advanced Batch', level: 'Visharad Pratham', attendance: 90, phone: '9876543215', email: 'arjun@test.com' },
      { id: 7, name: 'Ananya Iyer', rollNo: 'RN007', batch: 'Weekend Special', level: 'Praveshika Purna', attendance: 93, phone: '9876543216', email: 'ananya@test.com' },
      { id: 8, name: 'Karan Mehta', rollNo: 'RN008', batch: 'Weekend Special', level: 'Praveshika Purna', attendance: 87, phone: '9876543217', email: 'karan@test.com' },
    ]);
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesBatch = filterBatch === 'all' || student.batch === batches.find(b => b.id.toString() === filterBatch)?.name;
    const matchesLevel = filterLevel === 'all' || student.level === filterLevel;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBatch && matchesLevel && matchesSearch;
  });

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-2">
            My Students
          </h1>
          <p className="text-gray-600">View and manage students across all your batches</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Students</p>
            <p className="text-3xl font-bold text-primary">{students.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">High Attendance (≥90%)</p>
            <p className="text-3xl font-bold text-green-600">
              {students.filter(s => s.attendance >= 90).length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Average Attendance</p>
            <p className="text-3xl font-bold text-blue-600">
              {Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / students.length)}%
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Low Attendance (&lt;75%)</p>
            <p className="text-3xl font-bold text-red-600">
              {students.filter(s => s.attendance < 75).length}
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
                placeholder="Search by name or roll no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-accent mb-2">Filter by Batch</label>
              <select
                value={filterBatch}
                onChange={(e) => setFilterBatch(e.target.value)}
                className="input-field"
              >
                {batches.map(batch => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name}
                  </option>
                ))}
              </select>
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Batch</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Level</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Attendance</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-gray-900">{student.rollNo}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-accent">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.batch}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.level}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getAttendanceColor(student.attendance)}`}>
                        {student.attendance}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.phone}</td>
                    <td className="px-6 py-4">
                      <button className="text-primary hover:text-primary-dark font-semibold text-sm">
                        View Details
                      </button>
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
      </div>
    </div>
  );
};

export default TeacherStudents;
