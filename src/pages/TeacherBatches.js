import React, { useState, useEffect } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import ErrorState from '../components/ErrorState';
import teacherService from '../services/teacherService';

const TeacherBatches = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBatchesAndStudents = async () => {
      try {
        setLoading(true);
        
        const [batchesData, studentsData] = await Promise.all([
          teacherService.getBatches(),
          teacherService.getStudents()
        ]);

        const formattedBatches = batchesData.map(b => {
          const batchStudents = studentsData.filter(s => s.batch_name === b.batch_name);
          const totalAttendance = batchStudents.reduce((sum, s) => sum + (Number(s.attendance_percentage) || 0), 0);
          const averageAttendance = batchStudents.length > 0 ? Math.round(totalAttendance / batchStudents.length) : 0;

          return {
            id: b.batch_id,
            name: b.batch_name,
            level: b.level_name,
            schedule: b.schedule,
            time: b.time,
            room: b.room,
            totalStudents: b.active_students,
            averageAttendance: averageAttendance,
            students: batchStudents.map(s => ({
              id: s.student_id,
              name: s.full_name,
              rollNo: s.roll_number,
              attendance: Math.round(Number(s.attendance_percentage) || 0)
            }))
          };
        });

        setBatches(formattedBatches);
      } catch (err) {
        setError(err.message || 'Failed to load batches');
      } finally {
        setLoading(false);
      }
    };

    fetchBatchesAndStudents();
  }, []);

  if (loading) return <PageSkeleton label="Loading batches..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="page">
      <div>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-title">
            My Batches
          </h1>
          <p className="text-gray-600">View and manage all your assigned batches</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Total Batches</p>
            <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-primary">{batches.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Total Students</p>
            <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-green-700">
              {batches.reduce((sum, b) => sum + b.totalStudents, 0)}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Average Attendance</p>
            <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-blue-700">
              {batches.length > 0 ? Math.round(batches.reduce((sum, b) => sum + b.averageAttendance, 0) / batches.length) : 0}%
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Active Batches</p>
            <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-purple-700">{batches.length}</p>
          </div>
        </div>

        {/* Batches Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {batches.map((batch) => (
            <div key={batch.id} className="surface overflow-hidden hover:shadow-lift transition-all">
              
              {/* Batch Header */}
              <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6">
                <h3 className="text-2xl font-bold mb-2">{batch.name}</h3>
                <p className="text-white/90">{batch.level}</p>
              </div>

              {/* Batch Details */}
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">{batch.schedule}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">{batch.time}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-sm">{batch.room}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-sand-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{batch.totalStudents}</p>
                    <p className="text-xs text-gray-600">Students</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{batch.averageAttendance}%</p>
                    <p className="text-xs text-gray-600">Avg Attendance</p>
                  </div>
                </div>

                {/* Student Preview */}
                <div className="mb-4">
                  <h4 className="font-semibold text-accent mb-3">Students</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {batch.students.slice(0, 3).map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-2 bg-sand-50 rounded-lg text-sm">
                        <span className="font-medium text-accent">{student.name}</span>
                        <span className="text-gray-600">{student.rollNo}</span>
                      </div>
                    ))}
                    {batch.students.length > 3 && (
                      <p className="text-xs text-gray-500 text-center pt-1">
                        +{batch.students.length - 3} more students
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Link 
                    to="/teacher/attendance"
                    className="btn-primary text-center text-sm"
                  >
                    Mark Attendance
                  </Link>
                  <button 
                    onClick={() => setSelectedBatch(batch)}
                    className="btn-secondary text-sm"
                  >
                    View All Students
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Student List Modal */}
        {selectedBatch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{selectedBatch.name}</h2>
                    <p className="text-white/90">{selectedBatch.level} - {selectedBatch.totalStudents} Students</p>
                  </div>
                  <button 
                    onClick={() => setSelectedBatch(null)}
                    className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <table className="w-full">
                  <thead className="bg-sand-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-accent">Roll No</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-accent">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-accent">Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBatch.students.map((student) => (
                      <tr key={student.id} className="border-b hover:bg-sand-50">
                        <td className="px-4 py-3 font-mono text-sm">{student.rollNo}</td>
                        <td className="px-4 py-3 font-medium text-accent">{student.name}</td>
                        <td className="px-4 py-3">
                        <StatusBadge 
                          status={student.attendance >= 90 ? 'present' : student.attendance >= 75 ? 'late' : 'absent'} 
                        />
                        <span className="ml-2 text-sm">{student.attendance}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherBatches;
