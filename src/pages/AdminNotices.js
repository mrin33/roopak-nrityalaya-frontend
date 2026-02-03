import React, { useState, useEffect } from 'react';

const AdminNotices = () => {
  const [notices, setNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAudience: 'all',
    isImportant: false
  });

  useEffect(() => {
    // TODO: Fetch notices from API
    setNotices([
      { id: 1, title: 'Annual Day Celebration 2026', description: 'Save the date for our annual day celebration on March 15, 2026.', targetAudience: 'all', isImportant: true, createdDate: '2026-01-28', status: 'published' },
      { id: 2, title: 'Level Examination Schedule', description: 'Level examinations will be conducted in the first week of March.', targetAudience: 'students', isImportant: true, createdDate: '2026-01-25', status: 'published' },
      { id: 3, title: 'Teacher Training Workshop', description: 'All teachers are invited to attend the workshop on February 10, 2026.', targetAudience: 'teachers', isImportant: false, createdDate: '2026-01-20', status: 'published' },
    ]);
  }, []);

  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Notice published! (API pending)');
    setShowAddModal(false);
    setFormData({ title: '', description: '', targetAudience: 'all', isImportant: false });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete notice?')) {
      setNotices(notices.filter(n => n.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-heading font-bold text-primary mb-2">Manage Notices</h1>
            <p className="text-gray-600">Post and manage announcements</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-primary">+ Post Notice</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-3xl font-bold text-primary">{notices.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Published</p>
            <p className="text-3xl font-bold text-green-600">{notices.filter(n => n.status === 'published').length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Important</p>
            <p className="text-3xl font-bold text-red-600">{notices.filter(n => n.isImportant).length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">This Month</p>
            <p className="text-3xl font-bold text-blue-600">{notices.filter(n => new Date(n.createdDate).getMonth() === new Date().getMonth()).length}</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <input type="text" placeholder="Search notices..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field" />
        </div>

        {/* Notices */}
        <div className="space-y-4">
          {filteredNotices.map((notice) => (
            <div key={notice.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-accent">{notice.title}</h3>
                    {notice.isImportant && <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Important</span>}
                  </div>
                  <p className="text-gray-700 mb-3">{notice.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Target: <span className="font-semibold capitalize">{notice.targetAudience}</span></span>
                    <span>•</span>
                    <span>{new Date(notice.createdDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">Edit</button>
                  <button onClick={() => handleDelete(notice.id)} className="text-red-600 hover:text-red-800 font-semibold text-sm">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full">
              <div className="bg-primary text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Post Notice</h2>
                  <button onClick={() => setShowAddModal(false)} className="text-white hover:bg-white/20 rounded-full p-2">
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
                  <label className="block text-sm font-semibold text-accent mb-2">Description *</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows="6" className="input-field" required></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-accent mb-2">Target Audience *</label>
                  <select name="targetAudience" value={formData.targetAudience} onChange={handleChange} className="input-field" required>
                    <option value="all">Everyone</option>
                    <option value="students">Students Only</option>
                    <option value="teachers">Teachers Only</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="isImportant" name="isImportant" checked={formData.isImportant} onChange={handleChange} className="w-4 h-4" />
                  <label htmlFor="isImportant" className="ml-2 text-sm font-semibold">Mark as Important</label>
                </div>
                <div className="flex justify-end space-x-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary">Publish</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotices;
