import React, { useCallback, useEffect, useState } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import { useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import teacherService from '../services/teacherService';
import { useToast } from '../context/ToastContext';

const todayISO = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

const TeacherAttendance = () => {
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(searchParams.get('batch') || '');
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alreadyMarked, setAlreadyMarked] = useState(false);

  const loadBatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const rows = await teacherService.getBatches();
      setBatches(
        rows
          .filter((b) => b.is_active !== false)
          .map((b) => ({ id: String(b.batch_id), name: b.batch_name, level: b.level_name }))
      );
    } catch (err) {
      setError(err.message || 'Could not load your batches');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBatches();
  }, [loadBatches]);

  // Load the batch roster together with any attendance already saved for the date.
  useEffect(() => {
    if (!selectedBatch || !selectedDate) {
      setStudents([]);
      return undefined;
    }
    let active = true;
    setLoadingStudents(true);
    teacherService
      .getBatchAttendance(selectedBatch, selectedDate)
      .then((rows) => {
        if (!active) return;
        setStudents(rows.map((r) => ({ id: r.student_id, name: r.full_name, rollNo: r.roll_number || '—' })));
        const existing = {};
        rows.forEach((r) => {
          if (r.status !== 'unmarked') existing[r.student_id] = r.status;
        });
        setAttendance(existing);
        setAlreadyMarked(Object.keys(existing).length > 0);
      })
      .catch((err) => active && toast.error(err.message || 'Could not load students for this batch'))
      .finally(() => active && setLoadingStudents(false));
    return () => {
      active = false;
    };
  }, [selectedBatch, selectedDate, toast]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleBulkMark = (status) => {
    const updated = {};
    students.forEach((student) => {
      updated[student.id] = status;
    });
    setAttendance(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const records = students.filter((s) => attendance[s.id]).map((s) => ({ student_id: s.id, status: attendance[s.id] }));
    if (!records.length) {
      toast.error('Mark at least one student before saving.');
      return;
    }
    const unmarked = students.length - records.length;
    if (unmarked > 0 && !window.confirm(`${unmarked} student(s) are not marked and will be skipped. Save anyway?`)) return;

    setSaving(true);
    try {
      await teacherService.markAttendance({ batch_id: Number(selectedBatch), attendance_date: selectedDate, records });
      setAlreadyMarked(true);
      toast.success(`Attendance saved for ${records.length} student(s).`);
    } catch (err) {
      toast.error(err.message || 'Could not save attendance.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusCount = (status) => {
    return Object.values(attendance).filter(s => s === status).length;
  };

  if (loading) return <PageSkeleton label="Loading your batches..." />;
  if (error) return <ErrorState message={error} onRetry={loadBatches} />;

  return (
    <div className="page">
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-title">
            Mark Attendance
          </h1>
          <p className="text-gray-600">Record student attendance for your classes</p>
        </div>

        {/* Selection Form */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">
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
              <label className="form-label">
                Date *
              </label>
              <input
                type="date"
                max={todayISO()}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>
        </div>

        {batches.length === 0 && (
          <div className="bg-yellow-50 border border-amber-200 rounded-xl p-6 text-amber-800 mb-8">
            You have no active batches assigned yet. An administrator can assign batches to you.
          </div>
        )}

        {selectedBatch && loadingStudents && <LoadingSpinner text="Loading students..." />}

        {selectedBatch && !loadingStudents && students.length === 0 && (
          <div className="card sm:p-8 text-center text-gray-600">
            No active students are enrolled in this batch.
          </div>
        )}

        {selectedBatch && !loadingStudents && students.length > 0 && (
          <>
            {/* Quick Stats */}
            {alreadyMarked && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-800 mb-6 text-sm">
                Attendance for this date has already been saved. Saving again will update it.
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
                <p className="text-2xl font-bold text-amber-600">{getStatusCount('late')}</p>
              </div>
            </div>

            {/* Bulk Actions */}
            <div className="card mb-6">
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
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Mark All Late
                </button>
              </div>
            </div>

            {/* Student List */}
            <form onSubmit={handleSubmit}>
              <div className="card mb-6">
                <h3 className="font-bold text-accent mb-6 text-xl">Student Attendance</h3>
                
                <div className="space-y-3">
                  {students.map((student, index) => (
                    <div 
                      key={student.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-sand-50 rounded-lg hover:bg-sand-100 transition-colors"
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

                      <div className="flex gap-2" role="group" aria-label={`Attendance for ${student.name}`}>
                        <button
                          type="button"
                          aria-pressed={attendance[student.id] === 'present'}
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
                          aria-pressed={attendance[student.id] === 'absent'}
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
                          aria-pressed={attendance[student.id] === 'late'}
                          onClick={() => handleAttendanceChange(student.id, 'late')}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            attendance[student.id] === 'late'
                              ? 'bg-amber-600 text-white shadow-lg'
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
