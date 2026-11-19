import React, { useState, useEffect } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';

import RollNumberBadge from '../components/RollNumberBadge';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
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

  if (loading) return <PageSkeleton label="Loading students..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="page">
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-title">
            My Students
          </h1>
          <p className="text-gray-600">View and manage students across all your batches</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Total Students</p>
            <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-primary">{students.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">High Attendance (≥90%)</p>
            <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-green-700">
              {students.filter(s => s.attendance >= 90).length}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Average Attendance</p>
            <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-blue-700">
              {Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / students.length)}%
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">
              Low Attendance (&lt;75%)
            </p>            
            <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-red-700">
              {students.filter(s => s.attendance < 75).length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Search</label>
              <input
                type="text"
                placeholder="Search by name or roll no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="form-label">Filter by Batch</label>
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
              <label className="form-label">Filter by Level</label>
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
        <div className="surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sand-50 border-b-2 border-sand-200">
                <tr>
                  <th className="th">Roll No</th>
                  <th className="th">Name</th>
                  <th className="th">Batch</th>
                  <th className="th">Level</th>
                  <th className="th">Attendance</th>
                  <th className="th">Contact</th>
                  <th className="th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-sand-50 transition-colors">
                    <td className="td">
                      <RollNumberBadge rollNumber={student.rollNo} size="md" />
                    </td>
                    <td className="td">
                      <p className="font-semibold text-accent">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </td>
                    <td className="td text-gray-600">{student.batch}</td>
                    <td className="td text-gray-600">{student.level}</td>
                    <td className="td">
                      <StatusBadge 
                        status={student.attendance >= 90 ? 'present' : student.attendance >= 75 ? 'late' : 'absent'} 
                      />
                      <span className="ml-2 text-sm font-semibold">{student.attendance}%</span>
                    </td>
                    <td className="td text-gray-600">{student.phone}</td>
                    <td className="td">
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
