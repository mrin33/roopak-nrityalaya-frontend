import React, { useCallback, useEffect, useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import studentService from '../services/studentService';
import { useToast } from '../context/ToastContext';
import { formatDate, todayISO } from '../utils/date';

const StudentMakeupClasses = () => {
  const toast = useToast();
  const [missedClasses, setMissedClasses] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [availableBatches, setAvailableBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ makeupBatchId: '', makeupDate: '', notes: '' });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [missed, mine, batches] = await Promise.all([
        studentService.getMissedClasses(),
        studentService.getMakeupRequests(),
        studentService.getMakeupBatches(),
      ]);
      setMissedClasses(missed.map((m) => ({ ...m, id: m.attendance_id })));
      setRequests(
        mine.map((r) => ({
          ...r,
          id: r.booking_id,
          requested_at: r.created_at,
          teacher_note: r.notes,
        }))
      );
      setAvailableBatches(
        batches.map((b) => ({
          id: b.batch_id,
          name: b.batch_name,
          schedule: [b.schedule, b.time, b.teacher_name].filter(Boolean).join(' · '),
        }))
      );
    } catch (err) {
      setError(err.message || 'Could not load makeup classes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRequestClick = (missedClass) => {
    setSelectedClass(missedClass);
    setFormData({ makeupBatchId: '', makeupDate: '', notes: '' });
    setShowRequestModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await studentService.createMakeupRequest({
        attendance_id: selectedClass.id,
        makeup_batch_id: parseInt(formData.makeupBatchId, 10),
        makeup_class_date: formData.makeupDate,
        notes: formData.notes,
      });
      setShowRequestModal(false);
      toast.success('Makeup request sent. The teacher of that batch will review it.');
      load();
    } catch (err) {
      toast.error(err.message || 'Could not submit the request.');
    } finally {
      setSaving(false);
    }
  };

  const stats = {
    missedTotal: missedClasses.length,
    requestsPending: requests.filter(r => r.status === 'pending').length,
    requestsApproved: requests.filter(r => r.status === 'approved').length,
    requestsRejected: requests.filter(r => r.status === 'rejected').length
  };

  if (loading) return <LoadingSpinner fullScreen={true} text="Loading makeup classes..." size="lg" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-2">
            Makeup Classes
          </h1>
          <p className="text-gray-600">Request makeup classes for missed sessions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Missed Classes</p>
            <p className="text-3xl font-bold text-red-600">{stats.missedTotal}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Pending Requests</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.requestsPending}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-600">{stats.requestsApproved}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Rejected</p>
            <p className="text-3xl font-bold text-gray-600">{stats.requestsRejected}</p>
          </div>
        </div>

        {/* Missed Classes Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b">Missed Classes</h2>
          
          <div className="space-y-4">
            {missedClasses.map((cls) => (
              <div key={cls.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-bold text-accent">
                      {formatDate(cls.class_date, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h3>
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                      Absent
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {cls.batch_name} - {cls.teacher_name}
                  </p>
                </div>
                {cls.can_request_makeup ? (
                  <button
                    onClick={() => handleRequestClick(cls)}
                    className="btn-primary text-sm"
                  >
                    Request Makeup
                  </button>
                ) : (
                  <span className="text-sm text-gray-500">Already Requested</span>
                )}
              </div>
            ))}
          </div>

          {/* Empty State - Using EmptyState Component */}
          {missedClasses.length === 0 && (
            <EmptyState 
              icon="calendar"
              title="No missed classes"
              description="Great attendance! Keep it up!"
              size="sm"
            />
          )}
        </div>

        {/* Makeup Requests Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b">Your Makeup Requests</h2>
          
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-bold text-accent">Makeup Request #{request.id}</h3>
                      <StatusBadge status={request.status} />
                    </div>
                    <p className="text-sm text-gray-500">
                      Requested on {new Date(request.requested_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Missed Class</p>
                    <p className="font-bold text-accent mb-1">
                      {formatDate(request.original_class_date, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-sm text-gray-600">{request.original_batch_name}</p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Makeup Class</p>
                    <p className="font-bold text-accent mb-1">
                      {formatDate(request.makeup_class_date, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-sm text-gray-600">{request.makeup_batch_name}</p>
                  </div>
                </div>

                {request.status === 'approved' && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      ✓ Approved{request.approved_by_name ? ` by ${request.approved_by_name}` : ''}. 
                      Please attend the makeup class on the scheduled date.
                    </p>
                  </div>
                )}

                {request.status === 'rejected' && request.teacher_note && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs font-semibold text-red-800 mb-1">Notes:</p>
                    <p className="text-sm text-red-700 whitespace-pre-line">{request.teacher_note}</p>
                  </div>
                )}

                {request.status === 'pending' && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-700">
                      ⏳ Pending teacher/admin approval...
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State - Using EmptyState Component */}
          {requests.length === 0 && (
            <EmptyState 
              icon="calendar"
              title="No makeup requests"
              description="Request makeup classes for any missed sessions"
              size="sm"
            />
          )}
        </div>

        {/* Request Modal */}
        {showRequestModal && selectedClass && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-primary text-white p-6 rounded-t-2xl sticky top-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Request Makeup Class</h2>
                  <button 
                    onClick={() => setShowRequestModal(false)}
                    className="text-white hover:bg-white/20 rounded-full p-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm font-semibold text-red-800 mb-1">Missed Class:</p>
                  <p className="text-accent font-bold">
                    {new Date(selectedClass.class_date).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{selectedClass.batch_name}</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">
                      Select Makeup Batch *
                    </label>
                    <select
                      name="makeupBatchId"
                      value={formData.makeupBatchId}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">{availableBatches.length ? 'Choose a batch...' : 'No batches at your level are available'}</option>
                      {availableBatches.map(batch => (
                        <option key={batch.id} value={batch.id}>
                          {batch.name} - {batch.schedule}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">
                      Makeup Class Date *
                    </label>
                    <input
                      type="date"
                      name="makeupDate"
                      value={formData.makeupDate}
                      onChange={handleChange}
                      className="input-field"
                      min={todayISO()}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="3"
                      className="input-field"
                      placeholder="Any additional information..."
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  <button 
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentMakeupClasses;
