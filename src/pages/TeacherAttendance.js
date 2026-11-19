import React, { useState, useEffect } from 'react';

const TeacherAttendance = () => {

  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [batches, setBatches] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // TODO: Fetch teacher's batches from API
    setBatches([
      { id: 1, name: 'Morning Batch A', level: 'Praveshika Pratham' },
      { id: 2, name: 'Evening Batch B', level: 'Madhyama Pratham' },
      { id: 3, name: 'Advanced Batch', level: 'Visharad Pratham' },
      { id: 4, name: 'Weekend Special', level: 'Praveshika Purna' },
    ]);
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      // TODO: Fetch students for selected batch from API
      const mockStudents = [
        { id: 1, name: 'Riya Sharma', rollNo: 'RN001' },
        { id: 2, name: 'Amit Kumar', rollNo: 'RN002' },
        { id: 3, name: 'Priya Patel', rollNo: 'RN003' },
        { id: 4, name: 'Rahul Singh', rollNo: 'RN004' },
        { id: 5, name: 'Sneha Gupta', rollNo: 'RN005' },
        { id: 6, name: 'Arjun Reddy', rollNo: 'RN006' },
        { id: 7, name: 'Ananya Iyer', rollNo: 'RN007' },
        { id: 8, name: 'Karan Mehta', rollNo: 'RN008' },
      ];
      
      setStudents(mockStudents);
      
      // Initialize attendance state
      const initialAttendance = {};
      mockStudents.forEach(student => {
        initialAttendance[student.id] = 'present'; // default to present
      });
      setAttendance(initialAttendance);
    }
  }, [selectedBatch]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleBulkMark = (status) => {
    const updatedAttendance = {};
    students.forEach(student => {
      updatedAttendance[student.id] = status;
    });
    setAttendance(updatedAttendance);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // TODO: Send attendance data to API
    console.log('Saving attendance:', {
      batchId: selectedBatch,
      date: selectedDate,
      attendance: attendance
    });

    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert('Attendance marked successfully!');
    }, 1000);
  };

  const getStatusCount = (status) => {
    return Object.values(attendance).filter(s => s === status).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-2">
            Mark Attendance
          </h1>
          <p className="text-gray-600">Record student attendance for your classes</p>
        </div>

        {/* Selection Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-accent mb-2">
                Select Batch *
              </label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Choose a batch</option>
                {batches.map(batch => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name} - {batch.level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-accent mb-2">
                Date *
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>
        </div>

        {selectedBatch && students.length > 0 && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-primary">{students.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-2xl font-bold text-green-600">{getStatusCount('present')}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm text-gray-600">Absent</p>
                <p className="text-2xl font-bold text-red-600">{getStatusCount('absent')}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm text-gray-600">Late</p>
                <p className="text-2xl font-bold text-yellow-600">{getStatusCount('late')}</p>
              </div>
            </div>

            {/* Bulk Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="font-bold text-accent mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleBulkMark('present')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Mark All Present
                </button>
                <button
                  onClick={() => handleBulkMark('absent')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Mark All Absent
                </button>
                <button
                  onClick={() => handleBulkMark('late')}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Mark All Late
                </button>
              </div>
            </div>

            {/* Student List */}
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 className="font-bold text-accent mb-6 text-xl">Student Attendance</h3>
                
                <div className="space-y-3">
                  {students.map((student, index) => (
                    <div 
                      key={student.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center font-semibold text-primary">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-accent">{student.name}</p>
                          <p className="text-sm text-gray-500">Roll No: {student.rollNo}</p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleAttendanceChange(student.id, 'present')}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            attendance[student.id] === 'present'
                              ? 'bg-green-600 text-white shadow-lg'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAttendanceChange(student.id, 'absent')}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            attendance[student.id] === 'absent'
                              ? 'bg-red-600 text-white shadow-lg'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAttendanceChange(student.id, 'late')}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            attendance[student.id] === 'late'
                              ? 'bg-yellow-600 text-white shadow-lg'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Late
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setSelectedBatch('')}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Attendance'}
                </button>
              </div>
            </form>
          </>
        )}

        {!selectedBatch && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
            <svg className="w-16 h-16 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-blue-800 text-lg font-semibold mb-2">Select a batch to start</p>
            <p className="text-blue-600 text-sm">Choose a batch and date to mark attendance</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAttendance;
