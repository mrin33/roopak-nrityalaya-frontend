import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import noticeService from '../services/noticeService';
import { PageSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Modal from '../components/ui/Modal';
import Icon from '../components/ui/Icon';
import RowAction from '../components/ui/RowAction';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import { formatDate, toDate, todayISO } from '../utils/date';

const CATEGORIES = ['general', 'event', 'fees', 'admission', 'workshop', 'holiday', 'examination'];
const AUDIENCE = { all: 'Everyone', students: 'Students', teachers: 'Teachers' };
const EMPTY_FORM = { title: '', content: '', targetAudience: 'all', category: 'general', isImportant: false, status: 'published', expiryDate: '' };

const AdminNotices = () => {
  const toast = useToast();
  const confirm = useConfirm();
  const [notices, setNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const fetchNotices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setNotices(await noticeService.getAllAdminNotices());
    } catch (err) {
      setError(err.message || 'Could not load notices.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const q = searchTerm.trim().toLowerCase();
  const filtered = notices.filter((n) => !q || n.title.toLowerCase().includes(q) || (n.content || '').toLowerCase().includes(q));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (n) => {
    setFormData({
      title: n.title,
      content: n.content,
      targetAudience: n.target_audience || 'all',
      category: n.category || 'general',
      isImportant: !!n.is_important,
      status: n.status || 'published',
      expiryDate: n.expiry_date ? String(n.expiry_date).slice(0, 10) : '',
    });
    setEditingId(n.id);
    setShowModal(true);
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
        status: formData.status,
        expiry_date: formData.expiryDate || null,
      };
      if (editingId) {
        await noticeService.updateNotice(editingId, payload);
        toast.success('Notice updated.');
      } else {
        await noticeService.createNotice(payload);
        toast.success(formData.status === 'draft' ? 'Draft saved.' : 'Notice published.');
      }
      setShowModal(false);
      fetchNotices();
    } catch (err) {
      toast.error(err.message || 'Failed to save notice. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (n) => {
    const ok = await confirm({ title: `Delete “${n.title}”?`, message: 'It will be removed from the notice board and portals.', confirmLabel: 'Delete', tone: 'danger' });
    if (!ok) return;
    try {
      await noticeService.deleteNotice(n.id);
      setNotices((list) => list.filter((x) => x.id !== n.id));
      toast.success('Notice deleted.');
    } catch (err) {
      toast.error(err.message || 'Failed to delete notice.');
    }
  };

  if (loading && !notices.length) return <PageSkeleton label="Loading notices…" variant="cards" />;
  if (error) return <ErrorState message={error} onRetry={fetchNotices} />;

  const now = new Date();
  const thisMonth = notices.filter((n) => {
    const d = toDate(n.created_at);
    return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const isExpired = (n) => n.expiry_date && String(n.expiry_date).slice(0, 10) < todayISO();

  return (
    <div className="page">
      <PageHeader
        title="Notices"
        description="Announcements for the public notice board and the student and teacher portals."
        actions={
          <button type="button" onClick={openAdd} className="btn-primary">
            <Icon name="plus" className="h-4 w-4" /> New notice
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Notices" value={notices.length} icon="megaphone" tone="brand" />
        <StatCard label="Published" value={notices.filter((n) => n.status === 'published').length} icon="checkCircle" tone="success" />
        <StatCard label="Important" value={notices.filter((n) => n.is_important).length} icon="warning" tone="danger" />
        <StatCard label="Posted this month" value={thisMonth} icon="calendar" tone="gold" />
      </div>

      <div className="relative mb-4 max-w-md">
        <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input type="search" placeholder="Search notices" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-9" aria-label="Search notices" />
      </div>

      {filtered.length === 0 ? (
        <div className="surface">
          <EmptyState
            icon="megaphone"
            title={notices.length ? 'No notices match your search' : 'No notices yet'}
            actionText={notices.length ? undefined : 'Post the first notice'}
            onAction={notices.length ? undefined : openAdd}
          />
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((n) => (
            <li key={n.id} className={`card ${n.is_important ? 'border-l-4 border-l-primary' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={n.status || 'published'} />
                    {n.is_important && <span className="badge-danger">Important</span>}
                    {isExpired(n) && <span className="badge-neutral">Expired</span>}
                    <span className="badge-gold capitalize">{n.category}</span>
                    <span className="badge-neutral">{AUDIENCE[n.target_audience] || n.target_audience}</span>
                  </div>
                  <h2 className="mt-2 font-heading text-lg font-semibold text-accent">{n.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">{n.content}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    Posted {formatDate(n.created_at, { day: 'numeric', month: 'short', year: 'numeric' })}
                    {n.expiry_date && ` · Until ${formatDate(n.expiry_date, { day: 'numeric', month: 'short', year: 'numeric' })}`}
                  </p>
                </div>
                <div className="-mr-2 flex shrink-0">
                  <RowAction icon="pencil" label={`Edit ${n.title}`} onClick={() => openEdit(n)} />
                  <RowAction icon="trash" label={`Delete ${n.title}`} onClick={() => handleDelete(n)} danger />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit notice' : 'New notice'} size="lg" dismissible={!submitting}>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="n-title" className="form-label">
                Title
              </label>
              <input id="n-title" name="title" value={formData.title} onChange={handleChange} className="input-field" maxLength={255} required />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="n-content" className="form-label">
                Message
              </label>
              <textarea id="n-content" name="content" value={formData.content} onChange={handleChange} rows={6} className="input-field" required />
            </div>
            <div>
              <label htmlFor="n-aud" className="form-label">
                Audience
              </label>
              <select id="n-aud" name="targetAudience" value={formData.targetAudience} onChange={handleChange} className="input-field">
                <option value="all">Everyone (public notice board)</option>
                <option value="students">Students only</option>
                <option value="teachers">Teachers only</option>
              </select>
            </div>
            <div>
              <label htmlFor="n-cat" className="form-label">
                Category
              </label>
              <select id="n-cat" name="category" value={formData.category} onChange={handleChange} className="input-field">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="capitalize">
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="n-status" className="form-label">
                Status
              </label>
              <select id="n-status" name="status" value={formData.status} onChange={handleChange} className="input-field">
                <option value="published">Published</option>
                <option value="draft">Draft (not visible)</option>
              </select>
            </div>
            <div>
              <label htmlFor="n-expiry" className="form-label">
                Show until <span className="font-normal text-gray-500">(optional)</span>
              </label>
              <input id="n-expiry" type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} className="input-field" />
            </div>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-sand-200 p-3 sm:col-span-2">
              <input type="checkbox" name="isImportant" checked={formData.isImportant} onChange={handleChange} className="mt-1 h-4 w-4" />
              <span className="text-sm">
                <span className="font-medium text-accent">Mark as important</span>
                <span className="block text-gray-500">Highlighted and listed first.</span>
              </span>
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Saving…' : editingId ? 'Save changes' : formData.status === 'draft' ? 'Save draft' : 'Publish'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminNotices;
