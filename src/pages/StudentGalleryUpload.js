import React, { useState, useEffect } from 'react';
import galleryRequestService from '../services/galleryRequestService';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';

const StudentGalleryUpload = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaType: 'photo',
    category: 'Performances'
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await galleryRequestService.getStudentRequests();
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    setSubmitting(true);
    try {
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('media_type', formData.mediaType);
      uploadData.append('category', formData.category);
      uploadData.append('file', selectedFile);

      await galleryRequestService.createRequest(uploadData);
      
      setShowUploadModal(false);
      setFormData({
        title: '',
        description: '',
        mediaType: 'photo',
        category: 'Performances'
      });
      setSelectedFile(null);
      
      alert('Upload request submitted successfully! Admin will review it soon.');
      fetchRequests();
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to submit upload request.');
    } finally {
      setSubmitting(false);
    }
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

  // Create an absolute URL for media files since the backend serves them at /uploads
  const API_BASE = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api', '') : 'http://localhost:5000';
  const getMediaUrl = (url) => url ? `${API_BASE}${url}` : '';

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
              <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                {request.file_url ? (
                  request.media_type === 'photo' ? (
                    <img src={getMediaUrl(request.file_url)} alt="preview" className="object-cover w-full h-full" />
                  ) : (
                    <video src={getMediaUrl(request.file_url)} className="object-cover w-full h-full" controls={false} />
                  )
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
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-accent text-lg flex-1">{request.title}</h3>
                  <StatusBadge status={request.status} type="request" />
                </div>

                <p className="text-sm text-gray-600 mb-4 h-10 line-clamp-2">{request.description}</p>

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
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors">
                      <input
                        type="file"
                        accept={formData.mediaType === 'photo' ? 'image/*' : 'video/*'}
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        required
                      />
                      <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      {selectedFile ? (
                        <p className="text-primary font-semibold truncate px-4">{selectedFile.name}</p>
                      ) : (
                        <>
                          <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500">
                            {formData.mediaType === 'photo' ? 'PNG, JPG up to 10MB' : 'MP4, MOV up to 100MB'}
                          </p>
                        </>
                      )}
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
                  <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
                    {submitting ? 'Uploading...' : 'Submit Request'}
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
