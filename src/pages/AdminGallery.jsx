import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Modal from '../components/ui/Modal';
import FileDrop from '../components/ui/FileDrop';
import Icon from '../components/ui/Icon';
import RowAction from '../components/ui/RowAction';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import ProtectedMedia from '../components/ProtectedMedia';
import adminService from '../services/adminService';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import { formatDate } from '../utils/date';

const ACCEPT = { photo: 'image/jpeg,image/png,image/webp,image/gif', video: 'video/mp4,video/webm,video/quicktime' };
const MAX_BYTES = 50 * 1024 * 1024;
const EMPTY_FORM = { title: '', description: '', category: '', type: 'photo', isVisible: true, file: null };
const TYPES = [
  ['all', 'All'],
  ['photo', 'Photos'],
  ['video', 'Videos'],
];

const AdminGallery = () => {
  const toast = useToast();
  const confirm = useConfirm();
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

  const shown = media.filter((m) => filterType === 'all' || m.media_type === filterType);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value, ...(name === 'type' ? { file: null } : {}) }));
  };

  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setModal({ mode: 'add' });
  };
  const openEdit = (item) => {
    setFormData({ title: item.title || '', description: item.description || '', category: item.category || '', type: item.media_type, isVisible: item.is_visible, file: null });
    setModal({ mode: 'edit', item });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modal.mode === 'add' && !formData.file) {
      toast.error('Please choose a file to upload.');
      return;
    }
    setSaving(true);
    try {
      if (modal.mode === 'add') {
        const fd = new FormData();
        fd.append('title', formData.title);
        fd.append('description', formData.description);
        fd.append('category', formData.category);
        fd.append('is_visible', String(formData.isVisible));
        fd.append('file', formData.file);
        await adminService.createGalleryItem(fd);
        toast.success(formData.isVisible ? 'Uploaded and published to the gallery.' : 'Uploaded (hidden from the public gallery).');
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
    const ok = await confirm({ title: `Delete “${item.title}”?`, message: 'The file is removed from the gallery permanently.', confirmLabel: 'Delete', tone: 'danger' });
    if (!ok) return;
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

  if (loading && !media.length) return <PageSkeleton label="Loading gallery…" variant="gallery" />;
  if (error) return <ErrorState message={error} onRetry={fetchGallery} />;

  return (
    <div className="page">
      <PageHeader
        title="Gallery"
        description="Photos and videos shown on the public gallery and home page."
        actions={
          <>
            <Link to="/admin/gallery-requests" className="btn-secondary">
              <Icon name="inbox" className="h-4 w-4" /> Student uploads
            </Link>
            <button type="button" onClick={openAdd} className="btn-primary">
              <Icon name="upload" className="h-4 w-4" /> Upload
            </button>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Items" value={media.length} icon="photo" tone="brand" />
        <StatCard label="Public" value={media.filter((m) => m.is_visible).length} icon="eye" tone="success" />
        <StatCard label="Photos" value={media.filter((m) => m.media_type === 'photo').length} icon="photo" tone="gold" />
        <StatCard label="Videos" value={media.filter((m) => m.media_type === 'video').length} icon="video" tone="info" />
      </div>

      <div className="mb-6 inline-flex gap-1 rounded-xl border border-sand-200 bg-white p-1" role="group" aria-label="Filter by type">
        {TYPES.map(([v, l]) => (
          <button key={v} type="button" onClick={() => setFilterType(v)} aria-pressed={filterType === v} className={filterType === v ? 'tab-active' : 'tab'}>
            {l}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((item) => {
            const busy = busyId === item.id;
            return (
              <article key={item.id} className="surface flex flex-col overflow-hidden">
                <div className={`relative aspect-[4/3] bg-sand-100 ${item.is_visible ? '' : 'opacity-70'}`}>
                  <ProtectedMedia
                    path={`/admin/gallery/${item.id}/file`}
                    mediaType={item.media_type}
                    alt={item.title}
                    className="h-full w-full object-cover"
                    controls={item.media_type === 'video'}
                  />
                  <span className="absolute left-3 top-3">{item.is_visible ? <span className="badge-success bg-white">Public</span> : <span className="badge-neutral bg-white">Hidden</span>}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-body font-semibold text-accent">{item.title}</h2>
                    <div className="-mr-2 -mt-1 flex shrink-0">
                      <RowAction icon="pencil" label={`Edit ${item.title}`} onClick={() => openEdit(item)} disabled={busy} />
                      <RowAction icon={item.is_visible ? 'eyeOff' : 'eye'} label={item.is_visible ? 'Hide from public gallery' : 'Show in public gallery'} onClick={() => toggleVisible(item)} disabled={busy} />
                      <RowAction icon="trash" label={`Delete ${item.title}`} onClick={() => handleDelete(item)} disabled={busy} danger />
                    </div>
                  </div>
                  {item.description && <p className="mt-1 line-clamp-2 text-sm text-gray-600">{item.description}</p>}
                  <p className="mt-auto flex flex-wrap items-center gap-2 pt-3 text-xs text-gray-500">
                    <span className="capitalize">{item.media_type}</span>
                    {item.category && <span className="badge-neutral">{item.category}</span>}
                    {item.uploader_role === 'student' && <span className="badge-info">by {item.uploaded_by_name || 'student'}</span>}
                    <span>{formatDate(item.created_at, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'add' ? 'Upload to the gallery' : 'Edit gallery item'} size="lg" dismissible={!saving}>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="g-title" className="form-label">
                Title
              </label>
              <input id="g-title" name="title" value={formData.title} onChange={handleChange} className="input-field" required />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="g-desc" className="form-label">
                Description <span className="font-normal text-gray-500">(optional)</span>
              </label>
              <textarea id="g-desc" name="description" value={formData.description} onChange={handleChange} rows={3} className="input-field" />
            </div>
            {modal?.mode === 'add' && (
              <div>
                <label htmlFor="g-type" className="form-label">
                  Type
                </label>
                <select id="g-type" name="type" value={formData.type} onChange={handleChange} className="input-field">
                  <option value="photo">Photo</option>
                  <option value="video">Video</option>
                </select>
              </div>
            )}
            <div className={modal?.mode === 'add' ? '' : 'sm:col-span-2'}>
              <label htmlFor="g-cat" className="form-label">
                Event / category
              </label>
              <input id="g-cat" name="category" value={formData.category} onChange={handleChange} className="input-field" placeholder="e.g. Annual Day 2026" />
              <p className="form-hint">Visitors can filter the gallery by this.</p>
            </div>
            {modal?.mode === 'add' && (
              <div className="sm:col-span-2">
                <FileDrop
                  file={formData.file}
                  onChange={(file) => setFormData((f) => ({ ...f, file }))}
                  accept={ACCEPT[formData.type]}
                  maxBytes={MAX_BYTES}
                  required
                  hint={formData.type === 'photo' ? 'JPG, PNG, WEBP or GIF · up to 50 MB' : 'MP4, WEBM or MOV · up to 50 MB'}
                />
              </div>
            )}
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-sand-200 p-3 sm:col-span-2">
              <input type="checkbox" name="isVisible" checked={formData.isVisible} onChange={handleChange} className="mt-1 h-4 w-4" />
              <span className="text-sm">
                <span className="font-medium text-accent">Show on the public gallery</span>
                <span className="block text-gray-500">The newest public photo is also used on the home page.</span>
              </span>
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={() => setModal(null)} className="btn-secondary" disabled={saving}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : modal?.mode === 'add' ? 'Upload' : 'Save changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminGallery;
