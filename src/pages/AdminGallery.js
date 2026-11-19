import React, { useCallback, useEffect, useState } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import ProtectedMedia from '../components/ProtectedMedia';
import adminService from '../services/adminService';
import { useToast } from '../context/ToastContext';

const ACCEPT = {
  photo: 'image/jpeg,image/png,image/webp,image/gif',
  video: 'video/mp4,video/webm,video/quicktime',
};
const EMPTY_FORM = { title: '', description: '', category: '', type: 'photo', isVisible: true, file: null };

const AdminGallery = () => {
  const toast = useToast();
  const [media, setMedia] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null); // { mode: 'add' } | { mode: 'edit', item }
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const fetchGallery = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setMedia(await adminService.getGallery());
    } catch (err) {
      setError(err.message || 'Failed to load the gallery');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const filteredMedia = media.filter((m) => filterType === 'all' || m.media_type === filterType);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setModal({ mode: 'add' });
  };
  const openEdit = (item) => {
    setFormData({
      title: item.title || '',
      description: item.description || '',
      category: item.category || '',
      type: item.media_type,
      isVisible: item.is_visible,
      file: null,
    });
    setModal({ mode: 'edit', item });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal.mode === 'add') {
        if (!formData.file) throw new Error('Please choose a file to upload.');
        const fd = new FormData();
        fd.append('title', formData.title);
        fd.append('description', formData.description);
        fd.append('category', formData.category);
        fd.append('is_visible', String(formData.isVisible));
        fd.append('file', formData.file);
        await adminService.createGalleryItem(fd);
        toast.success('Media uploaded to the gallery.');
      } else {
        await adminService.updateGalleryItem(modal.item.id, {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          is_visible: formData.isVisible,
        });
        toast.success('Gallery item updated.');
      }
      setModal(null);
      fetchGallery();
    } catch (err) {
      toast.error(err.message || 'Could not save the gallery item.');
    } finally {
      setSaving(false);
    }
  };

  const toggleVisible = async (item) => {
    setBusyId(item.id);
    try {
      await adminService.updateGalleryItem(item.id, { is_visible: !item.is_visible });
      toast.success(item.is_visible ? 'Hidden from the public gallery.' : 'Now visible in the public gallery.');
      fetchGallery();
    } catch (err) {
      toast.error(err.message || 'Could not update visibility.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title}" from the gallery? This cannot be undone.`)) return;
    setBusyId(item.id);
    try {
      await adminService.deleteGalleryItem(item.id);
      toast.success('Gallery item deleted.');
      setMedia((list) => list.filter((m) => m.id !== item.id));
    } catch (err) {
      toast.error(err.message || 'Could not delete the item.');
    } finally {
      setBusyId(null);
    }
  };

  if (loading && !media.length) return <PageSkeleton label="Loading gallery..." />;
  if (error) return <ErrorState message={error} onRetry={fetchGallery} />;

  return (
    <div className="page">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="page-title">Gallery Management</h1>
            <p className="text-gray-600">Upload and manage photos & videos shown on the public gallery</p>
          </div>
          <button onClick={openAdd} className="btn-primary">
            + Upload
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[
            ['Total Items', media.length, 'text-primary'],
            ['Visible', media.filter((m) => m.is_visible).length, 'text-green-600'],
            ['Photos', media.filter((m) => m.media_type === 'photo').length, 'text-blue-600'],
            ['Videos', media.filter((m) => m.media_type === 'video').length, 'text-purple-600'],
          ].map(([label, value, color]) => (
            <div key={label} className="card">
              <p className="text-sm text-gray-600 mb-1">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="card mb-6">
          <div className="flex flex-wrap gap-3" role="group" aria-label="Filter by type">
            {[
              ['all', 'All'],
              ['photo', 'Photos'],
              ['video', 'Videos'],
            ].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setFilterType(v)}
                aria-pressed={filterType === v}
                className={`px-4 py-2 rounded-lg font-semibold ${filterType === v ? 'bg-primary text-white' : 'bg-sand-100'}`}
              >
                {l}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Student uploads appear here once approved in Gallery Requests.
          </p>
        </div>

        {filteredMedia.length === 0 ? (
          <div className="surface">
            <EmptyState
              icon="image"
              title={media.length ? 'Nothing of this type yet' : 'The gallery is empty'}
              description="Upload photos or videos, or approve student submissions."
              actionText="Upload"
              onAction={openAdd}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedia.map((item) => (
              <div key={item.id} className="surface overflow-hidden flex flex-col">
                <div className="relative h-48 bg-sand-100">
                  <ProtectedMedia
                    path={`/admin/gallery/${item.id}/file`}
                    mediaType={item.media_type}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    controls={item.media_type === 'video'}
                  />
                  {!item.is_visible && (
                    <span className="absolute top-2 left-2 px-2 py-1 rounded bg-gray-900/70 text-white text-xs font-semibold">Hidden</span>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.media_type === 'photo' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {item.media_type}
                    </span>
                    {item.category && <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sand-100 text-gray-700">{item.category}</span>}
                    {item.uploader_role === 'student' && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                        by {item.uploaded_by_name || 'student'}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-accent mt-2 mb-1">{item.title}</h3>
                  {item.description && <p className="text-sm text-gray-600 mb-4">{item.description}</p>}
                  <p className="text-xs text-gray-400 mb-4">{new Date(item.created_at).toLocaleDateString('en-IN')}</p>
                  <div className="mt-auto grid grid-cols-3 gap-2">
                    <button onClick={() => openEdit(item)} className="btn-secondary text-sm px-2 py-2">
                      Edit
                    </button>
                    <button
                      onClick={() => toggleVisible(item)}
                      disabled={busyId === item.id}
                      className="bg-sand-100 hover:bg-gray-200 rounded-lg text-sm font-semibold px-2 py-2 disabled:opacity-50"
                    >
                      {item.is_visible ? 'Hide' : 'Show'}
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={busyId === item.id}
                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {modal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-primary text-white p-6 rounded-t-2xl flex items-center justify-between">
                <h2 className="text-2xl font-bold">{modal.mode === 'add' ? 'Upload Media' : 'Edit Media'}</h2>
                <button onClick={() => setModal(null)} className="text-white hover:bg-white/20 rounded-full p-2" aria-label="Close">
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label htmlFor="g-title" className="form-label">Title *</label>
                  <input id="g-title" type="text" name="title" value={formData.title} onChange={handleChange} className="input-field" required />
                </div>
                <div>
                  <label htmlFor="g-desc" className="form-label">Description</label>
                  <textarea id="g-desc" name="description" value={formData.description} onChange={handleChange} rows="3" className="input-field" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {modal.mode === 'add' && (
                    <div>
                      <label htmlFor="g-type" className="form-label">Type *</label>
                      <select id="g-type" name="type" value={formData.type} onChange={handleChange} className="input-field">
                        <option value="photo">Photo</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                  )}
                  <div>
                    <label htmlFor="g-cat" className="form-label">Category / Event</label>
                    <input id="g-cat" type="text" name="category" value={formData.category} onChange={handleChange} className="input-field" placeholder="e.g. Annual Day 2026" />
                  </div>
                </div>
                {modal.mode === 'add' && (
                  <div>
                    <label htmlFor="g-file" className="form-label">File *</label>
                    <input
                      id="g-file"
                      type="file"
                      onChange={(e) => setFormData((f) => ({ ...f, file: e.target.files[0] || null }))}
                      accept={ACCEPT[formData.type]}
                      className="input-field"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Photos: JPG, PNG, WEBP, GIF · Videos: MP4, WEBM, MOV · max 50 MB</p>
                  </div>
                )}
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <input type="checkbox" name="isVisible" checked={formData.isVisible} onChange={handleChange} />
                  Show on the public gallery
                </label>
                <div className="flex justify-end gap-4">
                  <button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                    {saving ? 'Saving…' : modal.mode === 'add' ? 'Upload' : 'Save Changes'}
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

export default AdminGallery;
