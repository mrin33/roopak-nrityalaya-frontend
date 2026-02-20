import React, { useState, useEffect } from 'react';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';

const AdminGalleryRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    // TODO: Fetch gallery requests from API
    setRequests([
      {
        id: 1,
        student_name: 'Riya Sharma',
        roll_number: 'PP1',
        title: 'My First Performance',
        description: 'Annual Day 2025 performance photo',
        media_type: 'photo',
        category: 'Performances',
        status: 'pending',
        requested_at: '2026-02-03T10:30:00',
        file_url: '/uploads/performance1.jpg'
      },
      {
        id: 2,
        student_name: 'Amit Kumar',
        roll_number: 'PP2',
        title: 'Practice Session Video',
        description: 'Our batch practicing for competition',
        media_type: 'video',
        category: 'Practice',
        status: 'pending',
        requested_at: '2026-02-02T14:20:00',
        file_url: '/uploads/practice1.mp4'
      },
      {
        id: 3,
        student_name: 'Priya Patel',
        roll_number: 'MP1',
        title: 'Workshop Participation',
        description: 'Photo from the recent workshop',
        media_type: 'photo',
        category: 'Workshops',
        status: 'approved',
        requested_at: '2026-01-28T09:15:00',
        reviewed_at: '2026-01-29T10:00:00',
        reviewed_by: 'Admin',
        file_url: '/uploads/workshop1.jpg'
      },
      {
        id: 4,
        student_name: 'Rahul Singh',
        roll_number: 'MP2',
        title: 'Solo Performance',
        description: 'Tarana performance at cultural event',
        media_type: 'video',
        category: 'Performances',
        status: 'rejected',
        requested_at: '2026-01-25T16:45:00',
        reviewed_at: '2026-01-26T11:30:00',
        reviewed_by: 'Admin',
        rejection_reason: 'Video quality is too low. Please upload HD version.',
        file_url: '/uploads/performance2.mp4'
      }
    ]);
  }, []);

  const handleApprove = (request) => {
    if (!window.confirm(`Approve upload request from ${request.student_name}?`)) return;
    
    // TODO: API call to approve
    setRequests(requests.map(r => 
      r.id === request.id 
        ? { ...r, status: 'approved', reviewed_at: new Date().toISOString(), reviewed_by: 'Admin' }
        : r
    ));
    alert(`Request approved! "${request.title}" is now visible in the gallery.`);
  };

  const handleRejectClick = (request) => {
    setSelectedRequest(request);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    // TODO: API call to reject
    setRequests(requests.map(r => 
      r.id === selectedRequest.id 
        ? { 
            ...r, 
            status: 'rejected', 
            reviewed_at: new Date().toISOString(), 
            reviewed_by: 'Admin',
            rejection_reason: rejectionReason
          }
        : r
    ));
    setShowRejectModal(false);
    alert(`Request rejected. ${selectedRequest.student_name} will be notified.`);
  };

  const getMediaIcon = (type) => {
    if (type === 'photo') {
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
      </svg>
    );
  };

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(r => r.status === filter);

  const stats = {
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    total: requests.length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-2">
            Gallery Upload Requests
          </h1>
          <p className="text-gray-600">Review and approve student gallery uploads</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Requests</p>
            <p className="text-3xl font-bold text-primary">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Pending Review</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Rejected</p>
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredRequests.length} of {requests.length} requests
            </p>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field w-48"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className={`h-48 flex items-center justify-center ${
                request.media_type === 'photo' ? 'bg-gradient-to-br from-blue-100 to-blue-50' : 'bg-gradient-to-br from-red-100 to-red-50'
              }`}>
                <div className={request.media_type === 'photo' ? 'text-blue-400' : 'text-red-400'}>
                  {getMediaIcon(request.media_type)}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-accent text-lg">{request.title}</h3>
                  <StatusBadge status={request.status} type="request" />
                </div>

                <p className="text-sm text-gray-600 mb-4">{request.description}</p>

                <div className="space-y-2 mb-4 pb-4 border-b">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Student:</span>
                    <span className="font-semibold">{request.student_name} ({request.roll_number})</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">{request.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <span className="capitalize">{request.media_type}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Requested:</span>
                    <span>{new Date(request.requested_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>

                {request.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApprove(request)}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectClick(request)}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-semibold text-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {request.status === 'approved' && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-700">
                      Approved on {new Date(request.reviewed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} by {request.reviewed_by}
                    </p>
                  </div>
                )}

                {request.status === 'rejected' && request.rejection_reason && (
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-xs font-semibold text-red-800 mb-1">Rejection Reason:</p>
                    <p className="text-xs text-red-700">{request.rejection_reason}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <EmptyState 
            icon="upload"
            title="No gallery requests"
            description="Students haven't submitted any upload requests yet"
          />
        )}

        {showRejectModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full">
              <div className="bg-red-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Reject Upload Request</h2>
                  <button 
                    onClick={() => setShowRejectModal(false)}
                    className="text-white hover:bg-white/20 rounded-full p-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleRejectSubmit} className="p-6">
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Request:</p>
                  <p className="font-bold text-accent">{selectedRequest.title}</p>
                  <p className="text-sm text-gray-600 mt-1">From: {selectedRequest.student_name}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-accent mb-2">
                    Reason for Rejection *
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows="5"
                    className="input-field"
                    placeholder="Explain why this upload is being rejected. This will be sent to the student."
                    required
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    Be specific and constructive. The student will receive this feedback.
                  </p>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button 
                    type="button" 
                    onClick={() => setShowRejectModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-semibold">
                    Confirm Rejection
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

export default AdminGalleryRequests;
