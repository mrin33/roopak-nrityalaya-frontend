import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import galleryRequestService from '../services/galleryRequestService';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import ProtectedMedia from '../components/ProtectedMedia';
import PageHeader from '../components/ui/PageHeader';
import Modal from '../components/ui/Modal';
import FileDrop from '../components/ui/FileDrop';
import Icon from '../components/ui/Icon';
import { CardGridSkeleton } from '../components/ui/Skeleton';
import { formatDate } from '../utils/date';

const CATEGORIES = ['Performances', 'Practice', 'Workshops', 'Events', 'Competitions'];
const STATUS_TABS = [
  ['all', 'All'],
  ['pending', 'Pending'],
  ['approved', 'Approved'],
  ['rejected', 'Declined'],
];
const EMPTY = { title: '', description: '', mediaType: 'photo', category: 'Performances' };
const MAX_BYTES = 50 * 1024 * 1024; // server limit

const StudentGalleryUpload = () => {
  const toast = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(EMPTY);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setRequests((await galleryRequestService.getStudentRequests()) || []);
    } catch (err) {
      setError(err.message || 'Could not load your uploads.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
    if (name === 'mediaType') setSelectedFile(null);
  };

  const openModal = () => {
    setFormData(EMPTY);
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please choose a file to upload.');
      return;
    }
    setSubmitting(true);
    try {
      const body = new FormData();
      body.append('title', formData.title);
      body.append('description', formData.description);
      body.append('media_type', formData.mediaType);
      body.append('category', formData.category);
      body.append('file', selectedFile);
      await galleryRequestService.createRequest(body);
      setShowModal(false);
      toast.success('Upload submitted. An admin will review it soon.');
      fetchRequests();
    } catch (err) {
      toast.error(err.message || 'Failed to submit the upload.');
    } finally {
      setSubmitting(false);
    }
  };

  const shown = filterStatus === 'all' ? requests : requests.filter((r) => r.status === filterStatus);
  const count = (s) => (s === 'all' ? requests.length : requests.filter((r) => r.status === s).length);

  if (error) return <ErrorState message={error} onRetry={fetchRequests} />;

  return (
    <div className="page">
      <PageHeader
        title="Share photos & videos"
        description="Submit pictures and clips from performances and classes. Approved uploads appear in the public gallery."
        actions={
          <button type="button" onClick={openModal} className="btn-primary">
            <Icon name="upload" className="h-4 w-4" /> Upload
          </button>
        }
      />

      {loading ? (
        <CardGridSkeleton media />
      ) : requests.length === 0 ? (
        <div className="surface">
          <EmptyState
            icon="upload"
            title="No uploads yet"
            description="Share your performance photos and videos with the academy."
            actionText="Upload your first photo"
            onAction={openModal}
            size="lg"
          />
        </div>
      ) : (
        <>
          <div className="mb-6 inline-flex flex-wrap gap-1 rounded-xl border border-sand-200 bg-white p-1" role="group" aria-label="Filter by status">
            {STATUS_TABS.map(([v, l]) => (
              <button key={v} type="button" onClick={() => setFilterStatus(v)} aria-pressed={filterStatus === v} className={filterStatus === v ? 'tab-active' : 'tab'}>
                {l} <span className="ml-1 text-xs opacity-70">{count(v)}</span>
              </button>
            ))}
          </div>

          {shown.length === 0 ? (
            <div className="surface">
              <EmptyState icon="image" title="Nothing here" description="No uploads with this status." size="sm" />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((r) => (
                <article key={r.id} className="surface flex flex-col overflow-hidden">
                  <div className="relative aspect-[4/3] bg-sand-100">
                    {r.file_url ? (
                      <ProtectedMedia requestId={r.id} mediaType={r.media_type} alt={r.title} className="h-full w-full object-cover" controls={r.media_type === 'video'} />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sand-400">
                        <Icon name={r.media_type === 'video' ? 'video' : 'photo'} className="h-12 w-12" />
                      </div>
                    )}
                    <span className="absolute left-3 top-3">
                      <StatusBadge status={r.status} label={r.status === 'rejected' ? 'Declined' : undefined} />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-body font-semibold text-accent">{r.title}</h3>
                    {r.description && <p className="mt-1 line-clamp-2 text-sm text-gray-600">{r.description}</p>}
                    <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span className="badge-neutral">{r.category}</span>
                      <span className="capitalize">{r.media_type}</span>·
                      <span>Submitted {formatDate(r.requested_at, { day: 'numeric', month: 'short' })}</span>
                    </p>
                    {r.status === 'approved' && r.reviewed_at && (
                      <p className="mt-3 text-xs text-green-800">Approved on {formatDate(r.reviewed_at, { day: 'numeric', month: 'short' })} — now in the gallery.</p>
                    )}
                    {r.status === 'rejected' && r.rejection_reason && (
                      <p className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-800">
                        <span className="font-semibold">Reason: </span>
                        {r.rejection_reason}
                      </p>
                    )}
                    {r.status === 'pending' && <p className="mt-3 text-xs text-gray-500">Waiting for admin review.</p>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Upload a photo or video" size="lg" dismissible={!submitting}>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input id="title" name="title" value={formData.title} onChange={handleChange} className="input-field" maxLength={255} required />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="input-field" required />
            </div>
            <div>
              <label htmlFor="mediaType" className="form-label">
                Type
              </label>
              <select id="mediaType" name="mediaType" value={formData.mediaType} onChange={handleChange} className="input-field">
                <option value="photo">Photo</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select id="category" name="category" value={formData.category} onChange={handleChange} className="input-field">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <span className="form-label">File</span>
              <FileDrop
                file={selectedFile}
                onChange={setSelectedFile}
                required
                maxBytes={MAX_BYTES}
                accept={formData.mediaType === 'photo' ? 'image/jpeg,image/png,image/webp,image/gif' : 'video/mp4,video/webm,video/quicktime'}
                hint={formData.mediaType === 'photo' ? 'JPG, PNG, WEBP or GIF · up to 50 MB' : 'MP4, WEBM or MOV · up to 50 MB'}
              />
            </div>
          </div>
          <p className="callout-info mt-5">An admin reviews every upload before it appears in the public gallery.</p>
          <div className="modal-actions">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Uploading…' : 'Submit for review'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentGalleryUpload;
