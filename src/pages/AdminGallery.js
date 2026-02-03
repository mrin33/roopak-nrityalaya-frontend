import React, { useState, useEffect } from 'react';

const AdminGallery = () => {
  const [media, setMedia] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: 'image',
    file: null
  });

  useEffect(() => {
    // TODO: Fetch gallery from API
    setMedia([
      { id: 1, title: 'Annual Day 2025', description: 'Students performing', category: 'Events', type: 'image', uploadDate: '2025-12-15' },
      { id: 2, title: 'Kathak Workshop', description: 'Special workshop', category: 'Workshops', type: 'image', uploadDate: '2025-11-20' },
      { id: 3, title: 'Performance Highlights', description: 'Competition moments', category: 'Performances', type: 'video', uploadDate: '2025-10-10' },
    ]);
  }, []);

  const filteredMedia = media.filter(item => filterType === 'all' || item.type === filterType);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Media uploaded! (File upload API pending)');
    setShowUploadModal(false);
    setFormData({ title: '', description: '', category: '', type: 'image', file: null });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete?')) {
      setMedia(media.filter(m => m.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-heading font-bold text-primary mb-2">Gallery Management</h1>
            <p className="text-gray-600">Upload and manage photos & videos</p>
          </div>
          <button onClick={() => setShowUploadModal(true)} className="btn-primary">+ Upload</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Items</p>
            <p className="text-3xl font-bold text-primary">{media.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Images</p>
            <p className="text-3xl font-bold text-green-600">{media.filter(m => m.type === 'image').length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Videos</p>
            <p className="text-3xl font-bold text-blue-600">{media.filter(m => m.type === 'video').length}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex gap-3">
            <button onClick={() => setFilterType('all')} className={`px-4 py-2 rounded-lg font-semibold ${filterType === 'all' ? 'bg-primary text-white' : 'bg-gray-100'}`}>All</button>
            <button onClick={() => setFilterType('image')} className={`px-4 py-2 rounded-lg font-semibold ${filterType === 'image' ? 'bg-primary text-white' : 'bg-gray-100'}`}>Images</button>
            <button onClick={() => setFilterType('video')} className={`px-4 py-2 rounded-lg font-semibold ${filterType === 'video' ? 'bg-primary text-white' : 'bg-gray-100'}`}>Videos</button>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredMedia.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                {item.type === 'image' ? (
                  <svg className="w-16 h-16 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                )}
              </div>
              <div className="p-6">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.type === 'image' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{item.type}</span>
                <h3 className="text-lg font-bold text-accent mt-2 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                <div className="flex space-x-2">
                  <button className="flex-1 btn-secondary text-sm">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full">
              <div className="bg-primary text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Upload Media</h2>
                  <button onClick={() => setShowUploadModal(false)} className="text-white hover:bg-white/20 rounded-full p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-accent mb-2">Title *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-accent mb-2">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="input-field"></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Type *</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="input-field" required>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Category</label>
                    <input type="text" name="category" value={formData.category} onChange={handleChange} className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-accent mb-2">File *</label>
                  <input type="file" onChange={handleFileChange} accept={formData.type === 'image' ? 'image/*' : 'video/*'} className="input-field" required />
                </div>
                <div className="flex justify-end space-x-4">
                  <button type="button" onClick={() => setShowUploadModal(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary">Upload</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;
