import React, { useState, useEffect } from 'react';
import galleryRequestService from '../services/galleryRequestService';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import ProtectedMedia, { openProtectedMedia } from '../components/ProtectedMedia';

const AdminGalleryRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await galleryRequestService.getAllAdminRequests();
      setRequests(data || []);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (request) => {
    if (!window.confirm(`Approve upload request from ${request.student_name}?`)) return;
    
    setProcessing(true);
    try {
      await galleryRequestService.updateRequestStatus(request.id, 'approved');
      alert(`Request approved! "${request.title}" is now visible in the gallery.`);
      fetchRequests();
    } catch (error) {
      console.error('Approval failed:', error);
      alert(error.message || 'Failed to approve request.');
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectClick = (request) => {
    setSelectedRequest(request);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      await galleryRequestService.updateRequestStatus(selectedRequest.id, 'rejected', rejectionReason);
      setShowRejectModal(false);
      alert(`Request rejected. ${selectedRequest.student_name} will be notified.`);
      fetchRequests();
    } catch (error) {
      console.error('Rejection failed:', error);
      alert(error.message || 'Failed to reject request.');
    } finally {
      setProcessing(false);
    }
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


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500 text-center py-20">Loading requests...</p>
      </div>
    );
  }

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
            <div key={request.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
              <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                {request.file_url ? (
                  <ProtectedMedia
                    requestId={request.id}
                    mediaType={request.media_type}
                    alt={request.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className={request.media_type === 'photo' ? 'text-blue-400' : 'text-red-400'}>
                    {request.media_type === 'photo' ? (
                      <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    )}
                  </div>
                )}
                
                {request.media_type === 'video' && request.file_url && (
                   <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                     <svg className="w-12 h-12 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                     </svg>
                   </div>
                )}
                
                {request.file_url && (
                   <button
                     type="button"
                     onClick={() => openProtectedMedia(request.id)}
                     className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                     title="View full size"
                     aria-label="View full size"
                   >
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                     </svg>
                   </button>
                )}
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-accent text-lg">{request.title}</h3>
                  <StatusBadge status={request.status} type="request" />
                </div>

                <p className="text-sm text-gray-600 mb-4 h-10 line-clamp-2">{request.description}</p>

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

                <div className="mt-auto">
                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(request)}
                        disabled={processing}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold text-sm disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectClick(request)}
                        disabled={processing}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-semibold text-sm disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {request.status === 'approved' && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-700">
                        Approved on {new Date(request.reviewed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} by {request.reviewed_by_name || 'Admin'}
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
                  <button type="submit" disabled={processing} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-semibold disabled:opacity-50">
                    {processing ? 'Processing...' : 'Confirm Rejection'}
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
