import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';

const StudentGalleryUpload = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaType: 'photo',
    category: 'Performances',
    fileUrl: ''
  });

  useEffect(() => {
    // TODO: Fetch gallery requests from API
    setRequests([
      {
        id: 1,
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
        title: 'Practice Session Video',
        description: 'Our batch practicing for competition',
        media_type: 'video',
        category: 'Practice',
        status: 'approved',
        requested_at: '2026-02-02T14:20:00',
        reviewed_at: '2026-02-03T09:00:00',
        file_url: '/uploads/practice1.mp4'
      },
      {
        id: 3,
        title: 'Workshop Photo',
        description: 'Photo from the recent workshop',
        media_type: 'photo',
        category: 'Workshops',
        status: 'rejected',
        requested_at: '2026-01-28T09:15:00',
        reviewed_at: '2026-01-29T10:00:00',
        rejection_reason: 'Image quality is too low. Please upload HD version.',
        file_url: '/uploads/workshop1.jpg'
      }
    ]);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API call to submit upload request
    const newRequest = {
      id: requests.length + 1,
      title: formData.title,
      description: formData.description,
      media_type: formData.mediaType,
      category: formData.category,
      status: 'pending',
      requested_at: new Date().toISOString(),
      file_url: formData.fileUrl
    };
    setRequests([newRequest, ...requests]);
    setShowUploadModal(false);
    setFormData({
      title: '',
      description: '',
      mediaType: 'photo',
      category: 'Performances',
      fileUrl: ''
    });
    alert('Upload request submitted successfully! Admin will review it soon.');
  };

  const filteredRequests = filterStatus === 'all' 
    ? requests 
    : requests.filter(r => r.status === filterStatus);

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-heading font-bold text-primary mb-2">
              Gallery Upload
            </h1>
            <p className="text-gray-600">Upload your performance photos and videos</p>
          </div>
          <button onClick={() => setShowUploadModal(true)} className="btn-primary">
            + Upload Media
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Requests</p>
            <p className="text-3xl font-bold text-primary">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Pending</p>
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

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredRequests.length} of {requests.length} requests
            </p>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field w-48"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className={`h-48 flex items-center justify-center ${
                request.media_type === 'photo' ? 'bg-gradient-to-br from-blue-100 to-blue-50' : 'bg-gradient-to-br from-red-100 to-red-50'
              }`}>
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
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-accent text-lg flex-1">{request.title}</h3>
                  <StatusBadge status={request.status} type="request" />
                </div>

                <p className="text-sm text-gray-600 mb-4">{request.description}</p>

                <div className="space-y-2 mb-4 pb-4 border-b">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">{request.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <span className="capitalize font-semibold">{request.media_type}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Submitted:</span>
                    <span>{new Date(request.requested_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>

                {request.status === 'approved' && request.reviewed_at && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-700">
                      ✓ Approved on {new Date(request.reviewed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                )}

                {request.status === 'rejected' && request.rejection_reason && (
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-xs font-semibold text-red-800 mb-1">Rejection Reason:</p>
                    <p className="text-xs text-red-700">{request.rejection_reason}</p>
                  </div>
                )}

                {request.status === 'pending' && (
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xs text-yellow-700">
                      ⏳ Waiting for admin review...
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State - Using EmptyState Component */}
        {filteredRequests.length === 0 && (
          <EmptyState 
            icon="upload"
            title="No upload requests yet"
            description="Upload your performance photos and videos to share with everyone"
            actionText="Upload Now"
            onAction={() => setShowUploadModal(true)}
            size="lg"
          />
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-primary text-white p-6 rounded-t-2xl sticky top-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Upload Media</h2>
                  <button 
                    onClick={() => setShowUploadModal(false)}
                    className="text-white hover:bg-white/20 rounded-full p-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="My First Performance"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      className="input-field"
                      placeholder="Describe your photo or video..."
                      required
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-accent mb-2">Media Type *</label>
                      <select
                        name="mediaType"
                        value={formData.mediaType}
                        onChange={handleChange}
                        className="input-field"
                      >
                        <option value="photo">Photo</option>
                        <option value="video">Video</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-accent mb-2">Category *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="input-field"
                      >
                        <option value="Performances">Performances</option>
                        <option value="Practice">Practice</option>
                        <option value="Workshops">Workshops</option>
                        <option value="Events">Events</option>
                        <option value="Competitions">Competitions</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Upload File *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">
                        {formData.mediaType === 'photo' ? 'PNG, JPG up to 10MB' : 'MP4, MOV up to 100MB'}
                      </p>
                      <input
                        type="file"
                        accept={formData.mediaType === 'photo' ? 'image/*' : 'video/*'}
                        className="hidden"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Your upload will be reviewed by admin before appearing in the gallery.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  <button 
                    type="button"
                    onClick={() => setShowUploadModal(false)}
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
        )}
      </div>
    </div>
  );
};

export default StudentGalleryUpload;
