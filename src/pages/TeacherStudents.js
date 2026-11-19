import React, { useState, useEffect } from 'react';

import RollNumberBadge from '../components/RollNumberBadge';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import teacherService from '../services/teacherService';

const TeacherStudents = () => {
  // const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [filterBatch, setFilterBatch] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentsAndBatches = async () => {
      try {
        setLoading(true);
        
        const [studentsData, batchesData] = await Promise.all([
          teacherService.getStudents(),
          teacherService.getBatches()
        ]);

        setBatches([
          { id: 'all', name: 'All Batches' },
          ...batchesData.map(b => ({ id: b.batch_name, name: b.batch_name }))
        ]);

        setStudents(studentsData.map(s => ({
          id: s.student_id,
          name: s.full_name,
          rollNo: s.roll_number || '',
          batch: s.batch_name,
          level: s.level_name,
          attendance: Math.round(Number(s.attendance_percentage) || 0),
          phone: s.phone,
          email: s.email
        })));
      } catch (err) {
        setError(err.message || 'Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsAndBatches();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesBatch = filterBatch === 'all' || student.batch === batches.find(b => b.id.toString() === filterBatch)?.name;
    const matchesLevel = filterLevel === 'all' || student.level === filterLevel;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBatch && matchesLevel && matchesSearch;
  });

  if (loading) return <LoadingSpinner fullScreen={true} text="Loading students..." size="lg" />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

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
            <p className="text-sm text-gray-600 mb-1">
              Low Attendance (&lt;75%)
            </p>            
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
                <option value="Praveshika Dwitiya">Praveshika Dwitiya</option>
                <option value="Madhyama Pratham">Madhyama Pratham</option>
                <option value="Madhyama Dwitiya">Madhyama Dwitiya</option>
                <option value="Visharad Pratham">Visharad Pratham</option>
                <option value="Visharad Dwitiya">Visharad Dwitiya</option>
              </select>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            Showing {filteredStudents.length} of {students.length} students
          </p>
        </div>

        {/* Students Table - USING RollNumberBadge and StatusBadge */}
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
                    <td className="px-6 py-4">
                      <RollNumberBadge rollNumber={student.rollNo} size="md" />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-accent">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.batch}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.level}</td>
                    <td className="px-6 py-4">
                      <StatusBadge 
                        status={student.attendance >= 90 ? 'present' : student.attendance >= 75 ? 'late' : 'absent'} 
                      />
                      <span className="ml-2 text-sm font-semibold">{student.attendance}%</span>
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

          {/* Empty State - USING EmptyState Component */}
          {filteredStudents.length === 0 && (
            <EmptyState 
              icon="user"
              title="No students found"
              description="Try adjusting your search or filter criteria"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherStudents;
