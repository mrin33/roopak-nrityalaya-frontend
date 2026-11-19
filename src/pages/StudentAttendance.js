import React, { useState, useEffect } from 'react';

const StudentAttendance = () => {

  const [attendanceData, setAttendanceData] = useState({
    overall: { present: 0, absent: 0, late: 0, percentage: 0 },
    records: []
  });
  const [filterMonth, setFilterMonth] = useState('all');

  useEffect(() => {
    // TODO: Fetch real attendance data from API
    // For now, using dummy data
    setAttendanceData({
      overall: {
        present: 34,
        absent: 3,
        late: 3,
        percentage: 85
      },
      records: [
        { date: '2026-01-31', status: 'present', notes: 'Great practice session' },
        { date: '2026-01-29', status: 'present', notes: '' },
        { date: '2026-01-27', status: 'late', notes: 'Arrived 15 mins late' },
        { date: '2026-01-24', status: 'present', notes: '' },
        { date: '2026-01-22', status: 'absent', notes: 'Sick leave' },
        { date: '2026-01-20', status: 'present', notes: '' },
        { date: '2026-01-17', status: 'present', notes: 'Excellent performance' },
        { date: '2026-01-15', status: 'late', notes: 'Traffic delay' },
      ]
    });
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'present':
        return (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'absent':
        return (
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'late':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-2">
            My Attendance
          </h1>
          <p className="text-gray-600">Track your class attendance and maintain consistency</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Present</p>
                <p className="text-3xl font-bold text-green-600">{attendanceData.overall.present}</p>
              </div>
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Absent</p>
                <p className="text-3xl font-bold text-red-600">{attendanceData.overall.absent}</p>
              </div>
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Late</p>
                <p className="text-3xl font-bold text-yellow-600">{attendanceData.overall.late}</p>
              </div>
              <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Percentage</p>
                <p className="text-3xl font-bold text-primary">{attendanceData.overall.percentage}%</p>
              </div>
              <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Attendance Records */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <h2 className="text-2xl font-bold text-accent">Attendance Records</h2>
            <select 
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            >
              <option value="all">All Months</option>
              <option value="jan">January 2026</option>
              <option value="dec">December 2025</option>
              <option value="nov">November 2025</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-accent">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-accent">Day</th>
                  <th className="text-left py-3 px-4 font-semibold text-accent">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-accent">Notes</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.records.map((record, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      {new Date(record.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(record.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {record.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">📌 Attendance Tips</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Aim for at least 80% attendance to progress to the next level</li>
            <li>• Inform your teacher in advance if you need to miss a class</li>
            <li>• Regular attendance is key to mastering Kathak techniques</li>
            <li>• Medical leaves will be considered with proper documentation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
