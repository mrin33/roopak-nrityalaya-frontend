import React, { useCallback, useEffect, useState } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import teacherService from '../services/teacherService';
import useLevels from '../hooks/useLevels';
import { useToast } from '../context/ToastContext';

const TYPE_STYLE = {
  video: { gradient: 'from-red-500 to-red-600', badge: 'bg-red-100 text-red-700', label: 'Video' },
  audio: { gradient: 'from-blue-500 to-blue-600', badge: 'bg-blue-100 text-blue-700', label: 'Audio' },
  document: { gradient: 'from-green-500 to-green-600', badge: 'bg-green-100 text-green-700', label: 'Document' },
  image: { gradient: 'from-purple-500 to-purple-600', badge: 'bg-purple-100 text-purple-700', label: 'Image' },
};
const ACCEPT = 'application/pdf,audio/mpeg,audio/wav,audio/mp4,video/mp4,video/webm,image/jpeg,image/png,image/webp';
const EMPTY_FORM = { title: '', description: '', level_id: '', source: 'file', file: null, external_url: '', resource_type: 'video' };

const TypeIcon = ({ type }) => {
  const d = {
    video: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    audio: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
    image: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    document: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  }[type] || '';
  return (
    <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={d} />
    </svg>
  );
};

const TeacherResources = () => {
  const toast = useToast();
  const { levels } = useLevels();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (formData.source === 'file') {
        if (!formData.file) throw new Error('Please choose a file.');
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
      setShowUploadForm(false);
      setFormData(EMPTY_FORM);
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
    if (!window.confirm(`Delete "${r.title}"? Students will no longer see it.`)) return;
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

  if (loading && !resources.length) return <PageSkeleton label="Loading resources..." />;
  if (error) return <ErrorState message={error} onRetry={loadResources} />;

  return (
    <div className="page">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="page-title">Learning Resources</h1>
            <p className="text-gray-600">Share videos, audio, documents and links with your students</p>
          </div>
          <button onClick={() => setShowUploadForm(true)} className="btn-primary">
            + Add Resource
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[
            ['Total Resources', resources.length, 'text-primary'],
            ['Videos', resources.filter((r) => r.resource_type === 'video').length, 'text-red-600'],
            ['Audio', resources.filter((r) => r.resource_type === 'audio').length, 'text-blue-600'],
            ['Documents', resources.filter((r) => r.resource_type === 'document').length, 'text-green-600'],
          ].map(([label, value, color]) => (
            <div key={label} className="card">
              <p className="text-sm text-gray-600 mb-1">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {resources.length === 0 ? (
          <div className="surface">
            <EmptyState
              icon="upload"
              title="No resources yet"
              description="Upload a file or add a link for your students."
              actionText="Add Your First Resource"
              onAction={() => setShowUploadForm(true)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((r) => {
              const style = TYPE_STYLE[r.resource_type] || TYPE_STYLE.document;
              return (
                <div key={r.id} className="surface overflow-hidden hover:shadow-lift transition-all flex flex-col">
                  <button
                    type="button"
                    onClick={() => openResource(r)}
                    className={`h-32 bg-gradient-to-br ${style.gradient} flex items-center justify-center text-white`}
                    aria-label={`Open ${r.title}`}
                  >
                    <TypeIcon type={r.resource_type} />
                  </button>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style.badge}`}>
                        {style.label}
                        {r.is_external ? ' · link' : ''}
                      </span>
                      <span className="text-xs text-gray-500">{r.file_size}</span>
                    </div>
                    <h3 className="text-lg font-bold text-accent mb-1">{r.title}</h3>
                    {r.description && <p className="text-sm text-gray-600 mb-2">{r.description}</p>}
                    <p className="text-sm text-gray-600 mb-2">{r.level_name || 'All levels'}</p>
                    <p className="text-xs text-gray-500 mb-4">
                      Added {new Date(r.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <div className="mt-auto flex gap-2">
                      <button onClick={() => openResource(r)} className="flex-1 btn-secondary text-sm px-3 py-2">
                        Open
                      </button>
                      <button
                        onClick={() => handleDelete(r)}
                        disabled={busyId === r.id}
                        className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showUploadForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-primary text-white p-6 rounded-t-2xl sticky top-0 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Add Resource</h2>
                <button onClick={() => setShowUploadForm(false)} className="text-white hover:bg-white/20 rounded-full p-2" aria-label="Close">
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label htmlFor="r-title" className="form-label">Title *</label>
                  <input id="r-title" name="title" value={formData.title} onChange={handleChange} className="input-field" placeholder="E.g., Basic Footwork Techniques" required />
                </div>
                <div>
                  <label htmlFor="r-level" className="form-label">Level</label>
                  <select id="r-level" name="level_id" value={formData.level_id} onChange={handleChange} className="input-field">
                    <option value="">All levels</option>
                    {levels.map((l) => (
                      <option key={l.level_id} value={String(l.level_id)}>
                        {l.level_number}. {l.level_name}
                      </option>
                    ))}
                  </select>
                </div>
                <fieldset>
                  <legend className="form-label">Source *</legend>
                  <div className="flex gap-6 text-sm">
                    {[
                      ['file', 'Upload a file'],
                      ['link', 'Add a link'],
                    ].map(([v, l]) => (
                      <label key={v} className="flex items-center gap-2">
                        <input type="radio" name="source" value={v} checked={formData.source === v} onChange={handleChange} />
                        {l}
                      </label>
                    ))}
                  </div>
                </fieldset>
                {formData.source === 'file' ? (
                  <div>
                    <label htmlFor="r-file" className="form-label">File *</label>
                    <input
                      id="r-file"
                      type="file"
                      accept={ACCEPT}
                      onChange={(e) => setFormData((f) => ({ ...f, file: e.target.files[0] || null }))}
                      className="input-field"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">PDF, MP3, WAV, M4A, MP4, WEBM, JPG, PNG, WEBP · max 50 MB</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label htmlFor="r-url" className="form-label">Link (https) *</label>
                      <input
                        id="r-url"
                        type="url"
                        name="external_url"
                        value={formData.external_url}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="https://www.youtube.com/watch?v=…"
                        pattern="https://.*"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="r-type" className="form-label">Type</label>
                      <select id="r-type" name="resource_type" value={formData.resource_type} onChange={handleChange} className="input-field">
                        <option value="video">Video</option>
                        <option value="audio">Audio</option>
                        <option value="document">Document</option>
                        <option value="image">Image</option>
                      </select>
                    </div>
                  </div>
                )}
                <div>
                  <label htmlFor="r-desc" className="form-label">Description</label>
                  <textarea id="r-desc" name="description" value={formData.description} onChange={handleChange} rows="3" className="input-field" />
                </div>
                <div className="flex justify-end gap-4">
                  <button type="button" onClick={() => setShowUploadForm(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                    {saving ? 'Uploading…' : 'Add Resource'}
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

export default TeacherResources;
