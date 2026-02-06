import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const StudentMakeupClasses = () => {
  const { user } = useAuth();
  const [missedClasses, setMissedClasses] = useState([]);
  const [makeupRequests, setMakeupRequests] = useState([]);
  const [availableBatches, setAvailableBatches] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedMissedClass, setSelectedMissedClass] = useState(null);
  const [formData, setFormData] = useState({
    makeupBatchId: '',
    makeupDate: '',
    notes: ''
  });

  useEffect(() => {
    // TODO: Fetch from API
    setMissedClasses([
      {
        id: 1,
        class_date: '2026-02-01',
        batch_name: 'Morning Batch A',
        time: '8:00 AM - 9:30 AM',
        teacher_name: 'Priya Sharma',
        can_request_makeup: true
      },
      {
        id: 2,
        class_date: '2026-01-29',
        batch_name: 'Morning Batch A',
        time: '8:00 AM - 9:30 AM',
        teacher_name: 'Priya Sharma',
        can_request_makeup: true
      },
      {
        id: 3,
        class_date: '2026-01-27',
        batch_name: 'Morning Batch A',
        time: '8:00 AM - 9:30 AM',
        teacher_name: 'Priya Sharma',
        can_request_makeup: false // Already requested
      }
    ]);

    setMakeupRequests([
      {
        id: 1,
        original_class_date: '2026-01-27',
        original_batch_name: 'Morning Batch A',
        makeup_batch_name: 'Evening Batch B',
        makeup_class_date: '2026-02-05',
        makeup_time: '5:00 PM - 6:30 PM',
        status: 'approved',
        approved_by: 'Priya Sharma',
        notes: 'Attending evening batch for makeup'
      },
      {
        id: 2,
        original_class_date: '2026-01-20',
        original_batch_name: 'Morning Batch A',
        makeup_batch_name: 'Weekend Special',
        makeup_class_date: '2026-01-23',
        makeup_time: '10:00 AM - 11:30 AM',
        status: 'completed',
        approved_by: 'Rajesh Kumar'
      }
    ]);

    // Same level batches only
    setAvailableBatches([
      {
        id: 2,
        batch_name: 'Evening Batch B',
        schedule: 'Tue, Thu, Sat',
        time: '5:00 PM - 6:30 PM',
        teacher_name: 'Rajesh Kumar',
        available_dates: ['2026-02-05', '2026-02-07', '2026-02-10']
      },
      {
        id: 3,
        batch_name: 'Weekend Special',
        schedule: 'Sat, Sun',
        time: '10:00 AM - 11:30 AM',
        teacher_name: 'Priya Sharma',
        available_dates: ['2026-02-08', '2026-02-09', '2026-02-15']
      }
    ]);
  }, []);

  const handleRequestMakeup = (missedClass) => {
    setSelectedMissedClass(missedClass);
    setShowRequestModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API call
    const selectedBatch = availableBatches.find(b => b.id === parseInt(formData.makeupBatchId));
    const newRequest = {
      id: makeupRequests.length + 1,
      original_class_date: selectedMissedClass.class_date,
      original_batch_name: selectedMissedClass.batch_name,
      makeup_batch_name: selectedBatch.batch_name,
      makeup_class_date: formData.makeupDate,
      makeup_time: selectedBatch.time,
      status: 'pending',
      notes: formData.notes
    };
    setMakeupRequests([newRequest, ...makeupRequests]);
    setMissedClasses(missedClasses.map(c => 
      c.id === selectedMissedClass.id ? { ...c, can_request_makeup: false } : c
    ));
    setShowRequestModal(false);
    setFormData({ makeupBatchId: '', makeupDate: '', notes: '' });
    alert('Makeup class request submitted! Teacher will review it soon.');
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">⏳ Pending</span>;
      case 'approved':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">✓ Approved</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">✗ Rejected</span>;
      case 'completed':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">✓ Completed</span>;
      default:
        return null;
    }
  };

  const stats = {
    missed: missedClasses.length,
    canRequest: missedClasses.filter(c => c.can_request_makeup).length,
    pending: makeupRequests.filter(r => r.status === 'pending').length,
    approved: makeupRequests.filter(r => r.status === 'approved').length
  };

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

        {/* Info Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                You can request makeup classes for any missed sessions. You'll be able to attend another batch of the <strong>same level</strong> on a date of your choice (subject to teacher approval).
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Missed Classes</p>
            <p className="text-3xl font-bold text-red-600">{stats.missed}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Can Request</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.canRequest}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Pending Approval</p>
            <p className="text-3xl font-bold text-blue-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
          </div>
        </div>

        {/* Missed Classes */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b">Missed Classes</h2>
          
          {missedClasses.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-24 h-24 mx-auto text-green-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 text-lg">Great! You haven't missed any classes recently.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {missedClasses.map((missedClass) => (
                <div key={missedClass.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-red-100 rounded-lg flex flex-col items-center justify-center">
                        <span className="text-xs text-red-600">
                          {new Date(missedClass.class_date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-2xl font-bold text-red-600">
                          {new Date(missedClass.class_date).getDate()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-accent">{missedClass.batch_name}</p>
                        <p className="text-sm text-gray-600">{missedClass.time}</p>
                        <p className="text-sm text-gray-600">Teacher: {missedClass.teacher_name}</p>
                      </div>
                    </div>
                    {missedClass.can_request_makeup ? (
                      <button
                        onClick={() => handleRequestMakeup(missedClass)}
                        className="btn-primary"
                      >
                        Request Makeup
                      </button>
                    ) : (
                      <span className="text-sm text-gray-500 italic">Already requested</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Makeup Requests */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b">My Makeup Requests</h2>
          
          {makeupRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No makeup class requests yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {makeupRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-bold text-accent">Makeup Request</h3>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm text-gray-600">
                        Requested by: {user?.profile?.full_name || user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">MISSED CLASS</p>
                      <p className="font-semibold text-red-700">{request.original_batch_name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(request.original_class_date).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">MAKEUP CLASS</p>
                      <p className="font-semibold text-green-700">{request.makeup_batch_name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(request.makeup_class_date).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-600">{request.makeup_time}</p>
                    </div>
                  </div>

                  {request.notes && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Your Notes:</p>
                      <p className="text-sm text-gray-600">{request.notes}</p>
                    </div>
                  )}

                  {request.approved_by && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-gray-500">
                        {request.status === 'approved' && 'Approved by: '}
                        {request.status === 'completed' && 'Completed - Approved by: '}
                        {request.approved_by}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Request Makeup Modal */}
        {showRequestModal && selectedMissedClass && (
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

              <div className="p-6">
                {/* Missed Class Info */}
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-semibold text-red-800 mb-2">Missed Class:</p>
                  <p className="text-sm text-red-700">
                    {selectedMissedClass.batch_name} - {new Date(selectedMissedClass.class_date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-red-700">{selectedMissedClass.time}</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-accent mb-2">
                        Select Batch (Same Level Only) *
                      </label>
                      <select 
                        name="makeupBatchId"
                        value={formData.makeupBatchId}
                        onChange={handleChange}
                        className="input-field"
                        required
                      >
                        <option value="">Choose a batch...</option>
                        {availableBatches.map(batch => (
                          <option key={batch.id} value={batch.id}>
                            {batch.batch_name} - {batch.schedule} ({batch.time})
                          </option>
                        ))}
                      </select>
                    </div>

                    {formData.makeupBatchId && (
                      <div>
                        <label className="block text-sm font-semibold text-accent mb-2">
                          Select Date *
                        </label>
                        <select 
                          name="makeupDate"
                          value={formData.makeupDate}
                          onChange={handleChange}
                          className="input-field"
                          required
                        >
                          <option value="">Choose a date...</option>
                          {availableBatches
                            .find(b => b.id === parseInt(formData.makeupBatchId))
                            ?.available_dates.map(date => (
                              <option key={date} value={date}>
                                {new Date(date).toLocaleDateString('en-US', { 
                                  weekday: 'long',
                                  month: 'long', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}

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
                        placeholder="Any additional information for the teacher..."
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
                    <button type="submit" className="btn-primary">
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentMakeupClasses;
