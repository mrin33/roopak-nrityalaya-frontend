import React, { useCallback, useEffect, useState } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Modal from '../components/ui/Modal';
import FileDrop from '../components/ui/FileDrop';
import Icon from '../components/ui/Icon';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import ResourceCard from '../components/ResourceCard';
import teacherService from '../services/teacherService';
import useLevels from '../hooks/useLevels';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';

const ACCEPT = 'application/pdf,audio/mpeg,audio/wav,audio/mp4,video/mp4,video/webm,image/jpeg,image/png,image/webp';
const MAX_BYTES = 50 * 1024 * 1024;
const EMPTY_FORM = { title: '', description: '', level_id: '', source: 'file', file: null, external_url: '', resource_type: 'video' };

const TeacherResources = () => {
  const toast = useToast();
  const confirm = useConfirm();
  const { levels } = useLevels();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const loadResources = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setResources(await teacherService.getResources());
    } catch (err) {
      setError(err.message || 'Could not load your resources');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const handleChange = (e) => setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  const openForm = () => {
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.source === 'file' && !formData.file) {
      toast.error('Please choose a file.');
      return;
    }
    setSaving(true);
    try {
      if (formData.source === 'file') {
        const fd = new FormData();
        fd.append('title', formData.title);
        fd.append('description', formData.description);
        if (formData.level_id) fd.append('level_id', formData.level_id);
        fd.append('file', formData.file);
        await teacherService.createResource(fd);
      } else {
        await teacherService.createResource({
          title: formData.title,
          description: formData.description,
          level_id: formData.level_id || undefined,
          external_url: formData.external_url,
          resource_type: formData.resource_type,
        });
      }
      toast.success('Resource added. Students of that level can now see it.');
      setShowForm(false);
      loadResources();
    } catch (err) {
      toast.error(err.message || 'Could not add the resource.');
    } finally {
      setSaving(false);
    }
  };

  const openResource = async (r) => {
    if (r.is_external) {
      window.open(r.external_url, '_blank', 'noopener,noreferrer');
      return;
    }
    const win = window.open('', '_blank');
    try {
      const url = await teacherService.openResourceFile(r.id);
      if (win) win.location.href = url;
    } catch (err) {
      if (win) win.close();
      toast.error(err.message || 'Could not open the file.');
    }
  };

  const handleDelete = async (r) => {
    const ok = await confirm({ title: `Delete “${r.title}”?`, message: 'Students will no longer see this resource.', confirmLabel: 'Delete', tone: 'danger' });
    if (!ok) return;
    setBusyId(r.id);
    try {
      await teacherService.deleteResource(r.id);
      setResources((list) => list.filter((x) => x.id !== r.id));
      toast.success('Resource deleted.');
    } catch (err) {
      toast.error(err.message || 'Could not delete the resource.');
    } finally {
      setBusyId(null);
    }
  };

  if (loading && !resources.length) return <PageSkeleton label="Loading resources…" variant="cards" />;
  if (error) return <ErrorState message={error} onRetry={loadResources} />;

  const count = (t) => resources.filter((r) => r.resource_type === t).length;

  return (
    <div className="page">
      <PageHeader
        title="Learning resources"
        description="Share notes, audio, videos and links with students of a level."
        actions={
          <button type="button" onClick={openForm} className="btn-primary">
            <Icon name="plus" className="h-4 w-4" /> Add resource
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Resources" value={resources.length} icon="book" tone="brand" />
        <StatCard label="Videos" value={count('video')} icon="video" tone="gold" />
        <StatCard label="Audio" value={count('audio')} icon="music" tone="info" />
        <StatCard label="Documents" value={count('document')} icon="document" tone="neutral" />
      </div>

      {resources.length === 0 ? (
        <div className="surface">
          <EmptyState icon="upload" title="No resources yet" description="Upload a file or add a link for your students." actionText="Add your first resource" onAction={openForm} size="lg" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => (
            <ResourceCard
              key={r.id}
              resource={r}
              onOpen={openResource}
              actions={
                <button type="button" onClick={() => handleDelete(r)} disabled={busyId === r.id} className="btn-danger-outline" aria-label={`Delete ${r.title}`}>
                  <Icon name="trash" className="h-4 w-4" />
                </button>
              }
            />
          ))}
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add a resource" size="lg" dismissible={!saving}>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="r-title" className="form-label">
                Title
              </label>
              <input id="r-title" name="title" value={formData.title} onChange={handleChange} className="input-field" placeholder="e.g. Teen taal tatkar practice" required />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="r-level" className="form-label">
                Visible to
              </label>
              <select id="r-level" name="level_id" value={formData.level_id} onChange={handleChange} className="input-field">
                <option value="">All levels</option>
                {levels.map((l) => (
                  <option key={l.level_id} value={String(l.level_id)}>
                    {l.level_number}. {l.level_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2" role="radiogroup" aria-label="Source">
              <span className="form-label">Source</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['file', 'Upload a file', 'upload'],
                  ['link', 'Add a link', 'link'],
                ].map(([v, l, icon]) => (
                  <label
                    key={v}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium focus-within:ring-2 focus-within:ring-secondary-500 ${
                      formData.source === v ? 'border-primary bg-primary-50/60 text-primary-700' : 'border-sand-300 text-accent'
                    }`}
                  >
                    <input type="radio" name="source" value={v} checked={formData.source === v} onChange={handleChange} className="sr-only" />
                    <Icon name={icon} className="h-4 w-4" /> {l}
                  </label>
                ))}
              </div>
            </div>
            {formData.source === 'file' ? (
              <div className="sm:col-span-2">
                <FileDrop
                  file={formData.file}
                  onChange={(file) => setFormData((f) => ({ ...f, file }))}
                  accept={ACCEPT}
                  maxBytes={MAX_BYTES}
                  required
                  hint="PDF, MP3, WAV, M4A, MP4, WEBM, JPG, PNG, WEBP · up to 50 MB"
                />
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="r-url" className="form-label">
                    Link (https)
                  </label>
                  <input id="r-url" type="url" name="external_url" value={formData.external_url} onChange={handleChange} className="input-field" placeholder="https://…" pattern="https://.*" required />
                </div>
                <div>
                  <label htmlFor="r-type" className="form-label">
                    Type
                  </label>
                  <select id="r-type" name="resource_type" value={formData.resource_type} onChange={handleChange} className="input-field">
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="document">Document</option>
                    <option value="image">Image</option>
                  </select>
                </div>
              </>
            )}
            <div className="sm:col-span-2">
              <label htmlFor="r-desc" className="form-label">
                Description <span className="font-normal text-gray-500">(optional)</span>
              </label>
              <textarea id="r-desc" name="description" value={formData.description} onChange={handleChange} rows={3} className="input-field" />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary" disabled={saving}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Uploading…' : 'Add resource'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeacherResources;
