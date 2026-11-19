import React, { useState, useEffect } from 'react';
import noticeService from '../services/noticeService';

const AdminNotices = () => {
  const [notices, setNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Track whether we are editing an existing notice
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetAudience: 'all',
    category: 'general',
    isImportant: false,
    status: 'published'
  });

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const data = await noticeService.getAllAdminNotices();
      setNotices(data);
    } catch (err) {
      console.error('Failed to fetch notices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        target_audience: formData.targetAudience,
        category: formData.category,
        is_important: formData.isImportant,
        status: formData.status
      };

      if (editingId) {
        await noticeService.updateNotice(editingId, payload);
        alert('Notice updated successfully!');
      } else {
        await noticeService.createNotice(payload);
        alert('Notice published successfully!');
      }
      
      setShowAddModal(false);
      resetForm();
      fetchNotices();
    } catch (err) {
      console.error('Failed to submit notice:', err);
      alert('Failed to save notice. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete notice?')) {
      try {
        await noticeService.deleteNotice(id);
        setNotices(notices.filter(n => n.id !== id));
      } catch (err) {
        console.error('Error deleting notice:', err);
        alert('Failed to delete notice.');
      }
    }
  };

  const handleEdit = (notice) => {
    setFormData({
      title: notice.title,
      content: notice.content,
      targetAudience: notice.target_audience || 'all',
      category: notice.category || 'general',
      isImportant: notice.is_important,
      status: notice.status || 'published'
    });
    setEditingId(notice.id);
    setShowAddModal(true);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({ 
      title: '', 
      content: '', 
      targetAudience: 'all', 
      category: 'general',
      isImportant: false,
      status: 'published'
    });
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading notices...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-heading font-bold text-primary mb-2">Manage Notices</h1>
            <p className="text-gray-600">Post and manage announcements</p>
          </div>
          <button onClick={openAddModal} className="btn-primary">+ Post Notice</button>
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
            <p className="text-3xl font-bold text-red-600">{notices.filter(n => n.is_important).length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">This Month</p>
            <p className="text-3xl font-bold text-blue-600">{notices.filter(n => new Date(n.created_at).getMonth() === new Date().getMonth()).length}</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <input type="text" placeholder="Search notices..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field" />
        </div>

        {/* Notices */}
        <div className="space-y-4">
          {filteredNotices.length > 0 ? filteredNotices.map((notice) => (
            <div key={notice.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-accent">{notice.title}</h3>
                    {notice.is_important && <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Important</span>}
                    {notice.status === 'draft' && <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">Draft</span>}
                  </div>
                  <p className="text-gray-700 mb-3 line-clamp-2">{notice.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Target: <span className="font-semibold capitalize">{notice.target_audience}</span></span>
                    <span>•</span>
                    <span>Category: <span className="font-semibold capitalize">{notice.category}</span></span>
                    <span>•</span>
                    <span>{new Date(notice.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(notice)} className="text-blue-600 hover:text-blue-800 font-semibold text-sm">Edit</button>
                  <button onClick={() => handleDelete(notice.id)} className="text-red-600 hover:text-red-800 font-semibold text-sm">Delete</button>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No notices found.</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full">
              <div className="bg-primary text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{editingId ? 'Edit Notice' : 'Post Notice'}</h2>
                  <button onClick={() => setShowAddModal(false)} className="text-white hover:bg-white/20 rounded-full p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-semibold text-accent mb-2">Title *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-accent mb-2">Content (Description) *</label>
                  <textarea name="content" value={formData.content} onChange={handleChange} rows="6" className="input-field" required></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Target Audience *</label>
                    <select name="targetAudience" value={formData.targetAudience} onChange={handleChange} className="input-field" required>
                      <option value="all">Everyone</option>
                      <option value="students">Students Only</option>
                      <option value="teachers">Teachers Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Category *</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="input-field" required>
                      <option value="general">General</option>
                      <option value="event">Event</option>
                      <option value="fees">Fees</option>
                      <option value="admission">Admission</option>
                      <option value="workshop">Workshop</option>
                      <option value="holiday">Holiday</option>
                      <option value="examination">Examination</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mt-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="isImportant" name="isImportant" checked={formData.isImportant} onChange={handleChange} className="w-4 h-4 cursor-pointer focus:ring-primary text-primary" />
                    <label htmlFor="isImportant" className="ml-2 text-sm font-semibold cursor-pointer">Mark as Important</label>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="input-field">
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
                    {submitting ? 'Saving...' : (editingId ? 'Update Notice' : 'Publish Notice')}
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

export default AdminNotices;
