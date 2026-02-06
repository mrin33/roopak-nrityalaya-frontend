import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const StudentGalleryUpload = () => {
  const { user } = useAuth();
  const [myRequests, setMyRequests] = useState([]);
  const [approvedUploads, setApprovedUploads] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaType: 'photo',
    category: '',
    fileUrl: ''
  });

  useEffect(() => {
    // TODO: Fetch gallery requests and approved uploads from API
    setMyRequests([
      {
        id: 1,
        title: 'My First Performance',
        description: 'Annual Day 2025 performance photo',
        media_type: 'photo',
        category: 'Performances',
        status: 'pending',
        requested_at: '2026-02-03T10:30:00'
      },
      {
        id: 2,
        title: 'Practice Session',
        description: 'Our batch practicing for competition',
        media_type: 'photo',
        category: 'Practice',
        status: 'approved',
        requested_at: '2026-01-28T14:20:00',
        reviewed_at: '2026-01-29T09:15:00'
      },
      {
        id: 3,
        title: 'Tarana Performance',
        description: 'Solo Tarana at cultural event',
        media_type: 'video',
        category: 'Performances',
        status: 'rejected',
        requested_at: '2026-01-25T16:45:00',
        reviewed_at: '2026-01-26T11:30:00',
        rejection_reason: 'Video quality is too low. Please upload a higher resolution version.'
      }
    ]);

    setApprovedUploads([
      {
        id: 2,
        title: 'Practice Session',
        description: 'Our batch practicing for competition',
        media_type: 'photo',
        category: 'Practice'
      }
    ]);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // TODO: Upload file to server and get URL
      // For now, just store the file name
      setFormData({ ...formData, fileUrl: `/uploads/${file.name}` });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API call to submit gallery request
    const newRequest = {
      id: myRequests.length + 1,
      title: formData.title,
      description: formData.description,
      media_type: formData.mediaType,
      category: formData.category,
      status: 'pending',
      requested_at: new Date().toISOString()
    };
    setMyRequests([newRequest, ...myRequests]);
    setShowUploadModal(false);
    setFormData({ title: '', description: '', mediaType: 'photo', category: '', fileUrl: '' });
    alert('Upload request submitted! Admin will review it soon.');
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">⏳ Pending Review</span>;
      case 'approved':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">✓ Approved</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">✗ Rejected</span>;
      default:
        return null;
    }
  };

  const getMediaIcon = (type) => {
    if (type === 'photo') {
      return (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
        </svg>
      );
    }
  };

  const stats = {
    pending: myRequests.filter(r => r.status === 'pending').length,
    approved: myRequests.filter(r => r.status === 'approved').length,
    rejected: myRequests.filter(r => r.status === 'rejected').length,
    total: myRequests.length
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
            <p className="text-gray-600">Share your performances and practice moments</p>
          </div>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="btn-primary"
          >
            + Upload Photo/Video
          </button>
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
                <strong>Note:</strong> All uploads require admin approval before appearing on the public gallery page. 
                You'll be notified once your upload is reviewed.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Uploads</p>
            <p className="text-3xl font-bold text-primary">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Pending Review</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Rejected</p>
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>

        {/* My Upload Requests */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b">My Upload Requests</h2>
          
          {myRequests.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-lg mb-4">No upload requests yet</p>
              <button onClick={() => setShowUploadModal(true)} className="btn-primary">
                Upload Your First Photo/Video
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className={`h-48 flex items-center justify-center ${
                    request.media_type === 'photo' ? 'bg-gradient-to-br from-blue-100 to-blue-50' : 'bg-gradient-to-br from-red-100 to-red-50'
                  }`}>
                    <div className={request.media_type === 'photo' ? 'text-blue-400' : 'text-red-400'}>
                      {getMediaIcon(request.media_type)}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-accent">{request.title}</h3>
                      {getStatusBadge(request.status)}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span className="px-2 py-1 bg-gray-100 rounded">
                        {request.category}
                      </span>
                      <span className="capitalize">{request.media_type}</span>
                    </div>
                    
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Requested: {new Date(request.requested_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      {request.reviewed_at && (
                        <p>Reviewed: {new Date(request.reviewed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      )}
                    </div>

                    {request.status === 'rejected' && request.rejection_reason && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs font-semibold text-red-800 mb-1">Rejection Reason:</p>
                        <p className="text-xs text-red-700">{request.rejection_reason}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Approved Uploads */}
        {approvedUploads.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b">
              My Approved Uploads (Visible on Gallery Page)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedUploads.map((upload) => (
                <div key={upload.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className={`h-48 flex items-center justify-center ${
                    upload.media_type === 'photo' ? 'bg-gradient-to-br from-green-100 to-green-50' : 'bg-gradient-to-br from-purple-100 to-purple-50'
                  }`}>
                    <div className={upload.media_type === 'photo' ? 'text-green-400' : 'text-purple-400'}>
                      {getMediaIcon(upload.media_type)}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-accent mb-2">{upload.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{upload.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="px-2 py-1 bg-gray-100 rounded">{upload.category}</span>
                      <span className="text-green-600 font-semibold">✓ Live on Gallery</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-primary text-white p-6 rounded-t-2xl sticky top-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Upload Photo/Video</h2>
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
                      placeholder="E.g., Annual Day Performance"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className="input-field"
                      placeholder="Describe what this photo/video shows..."
                      required
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-accent mb-2">Type *</label>
                      <select 
                        name="mediaType"
                        value={formData.mediaType}
                        onChange={handleChange}
                        className="input-field"
                        required
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
                        required
                      >
                        <option value="">Select category</option>
                        <option value="Events">Events</option>
                        <option value="Workshops">Workshops</option>
                        <option value="Performances">Performances</option>
                        <option value="Practice">Practice</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Upload File *</label>
                    <input 
                      type="file" 
                      onChange={handleFileChange}
                      accept="image/*,video/*"
                      className="input-field"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Max file size: 10MB. Accepted formats: JPG, PNG, MP4, MOV
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>⚠️ Important:</strong> Your upload will be reviewed by admin before appearing on the gallery page. 
                      You'll be notified once it's approved or if changes are needed.
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
                    Submit for Approval
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
