import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TeacherBatches = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);

  useEffect(() => {
    // TODO: Fetch teacher's batches from API
    setBatches([
      {
        id: 1,
        name: 'Morning Batch A',
        level: 'Praveshika Pratham',
        schedule: 'Monday, Wednesday, Friday',
        time: '8:00 AM - 9:30 AM',
        room: 'Studio 1',
        totalStudents: 12,
        averageAttendance: 92,
        students: [
          { id: 1, name: 'Riya Sharma', rollNo: 'RN001', attendance: 95 },
          { id: 2, name: 'Amit Kumar', rollNo: 'RN002', attendance: 88 },
          { id: 3, name: 'Priya Patel', rollNo: 'RN003', attendance: 92 },
          { id: 4, name: 'Rahul Singh', rollNo: 'RN004', attendance: 90 },
          { id: 5, name: 'Sneha Gupta', rollNo: 'RN005', attendance: 96 },
          { id: 6, name: 'Arjun Reddy', rollNo: 'RN006', attendance: 89 },
        ]
      },
      {
        id: 2,
        name: 'Evening Batch B',
        level: 'Madhyama Pratham',
        schedule: 'Tuesday, Thursday, Saturday',
        time: '5:00 PM - 6:30 PM',
        room: 'Studio 2',
        totalStudents: 15,
        averageAttendance: 88,
        students: [
          { id: 7, name: 'Ananya Iyer', rollNo: 'RN007', attendance: 90 },
          { id: 8, name: 'Karan Mehta', rollNo: 'RN008', attendance: 85 },
        ]
      },
      {
        id: 3,
        name: 'Advanced Batch',
        level: 'Visharad Pratham',
        schedule: 'Monday, Wednesday, Friday',
        time: '6:00 PM - 7:30 PM',
        room: 'Main Hall',
        totalStudents: 10,
        averageAttendance: 95,
        students: [
          { id: 9, name: 'Divya Shah', rollNo: 'RN009', attendance: 97 },
          { id: 10, name: 'Rohan Desai', rollNo: 'RN010', attendance: 93 },
        ]
      },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-2">
            My Batches
          </h1>
          <p className="text-gray-600">View and manage all your assigned batches</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Batches</p>
            <p className="text-3xl font-bold text-primary">{batches.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Students</p>
            <p className="text-3xl font-bold text-green-600">
              {batches.reduce((sum, b) => sum + b.totalStudents, 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Average Attendance</p>
            <p className="text-3xl font-bold text-blue-600">
              {batches.length > 0 ? Math.round(batches.reduce((sum, b) => sum + b.averageAttendance, 0) / batches.length) : 0}%
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Active Batches</p>
            <p className="text-3xl font-bold text-purple-600">{batches.length}</p>
          </div>
        </div>

        {/* Batches Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {batches.map((batch) => (
            <div key={batch.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
              
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

                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
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
                      <div key={student.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
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
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-accent">Roll No</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-accent">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-accent">Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBatch.students.map((student) => (
                      <tr key={student.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-sm">{student.rollNo}</td>
                        <td className="px-4 py-3 font-medium text-accent">{student.name}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            student.attendance >= 90 ? 'bg-green-100 text-green-700' :
                            student.attendance >= 75 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {student.attendance}%
                          </span>
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
