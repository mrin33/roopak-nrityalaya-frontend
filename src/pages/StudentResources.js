import React, { useCallback, useEffect, useState } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import studentService from '../services/studentService';
import { useToast } from '../context/ToastContext';

const TYPES = [
  ['all', 'All Resources', 'bg-primary'],
  ['video', 'Videos', 'bg-red-600'],
  ['audio', 'Audio', 'bg-blue-600'],
  ['document', 'Documents', 'bg-green-600'],
  ['image', 'Images', 'bg-purple-600'],
];
const TYPE_STYLE = {
  video: { gradient: 'from-red-500 to-red-600', badge: 'text-red-600 bg-red-100' },
  audio: { gradient: 'from-blue-500 to-blue-600', badge: 'text-blue-600 bg-blue-100' },
  document: { gradient: 'from-green-500 to-green-600', badge: 'text-green-600 bg-green-100' },
  image: { gradient: 'from-purple-500 to-purple-600', badge: 'text-purple-600 bg-purple-100' },
};

const StudentResources = () => {
  const toast = useToast();
  const [resources, setResources] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setResources(await studentService.getResources());
    } catch (err) {
      setError(err.message || 'Could not load resources');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openResource = async (r) => {
    if (r.is_external) {
      window.open(r.external_url, '_blank', 'noopener,noreferrer');
      return;
    }
    const win = window.open('', '_blank');
    try {
      const url = await studentService.openResourceFile(r.id);
      if (win) win.location.href = url;
    } catch (err) {
      if (win) win.close();
      toast.error(err.message || 'Could not open this resource.');
    }
  };

  if (loading) return <PageSkeleton label="Loading resources..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const filtered = resources.filter((r) => filter === 'all' || r.resource_type === filter);

  return (
    <div className="page">
      <div>
        <div className="mb-8">
          <h1 className="page-title">Learning Resources</h1>
          <p className="text-gray-600">Videos, audio and documents shared by your teachers for your level</p>
        </div>

        <div className="surface mb-6 flex flex-wrap gap-1.5 p-1.5" role="group" aria-label="Filter by type">
          {TYPES.map(([value, label, active]) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              className={`px-4 sm:px-6 py-2 rounded-lg font-medium transition-all ${
                filter === value ? `${active} text-white` : 'text-gray-600 hover:bg-sand-100'
              }`}
            >
              {label} ({value === 'all' ? resources.length : resources.filter((r) => r.resource_type === value).length})
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="surface">
            <EmptyState
              icon="document"
              title={resources.length ? 'Nothing of this type yet' : 'No resources yet'}
              description="Your teachers have not shared any resources for your level yet."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((r) => {
              const style = TYPE_STYLE[r.resource_type] || TYPE_STYLE.document;
              return (
                <article key={r.id} className="surface overflow-hidden hover:shadow-lift transition-all flex flex-col">
                  <div className={`h-28 bg-gradient-to-br ${style.gradient} flex items-center justify-center text-white text-lg font-semibold capitalize`}>
                    {r.resource_type}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${style.badge}`}>
                        {r.resource_type}
                        {r.is_external ? ' · link' : ''}
                      </span>
                      <span className="text-xs text-gray-500">{r.file_size}</span>
                    </div>
                    <h3 className="text-lg font-bold text-accent mb-1">{r.title}</h3>
                    {r.description && <p className="text-sm text-gray-600 mb-3">{r.description}</p>}
                    <p className="text-xs text-gray-500 mb-4">
                      {r.uploaded_by_name ? `By ${r.uploaded_by_name} · ` : ''}
                      {r.level_name || 'All levels'} · {new Date(r.created_at).toLocaleDateString('en-IN')}
                    </p>
                    <button onClick={() => openResource(r)} className="mt-auto btn-primary w-full">
                      {r.is_external ? 'Open link' : r.resource_type === 'document' ? 'Open document' : 'Open'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentResources;
