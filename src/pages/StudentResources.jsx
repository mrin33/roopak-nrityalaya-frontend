import React, { useCallback, useEffect, useState } from 'react';
import { CardGridSkeleton, Skeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import ResourceCard, { RESOURCE_TYPES } from '../components/ResourceCard';
import studentService from '../services/studentService';
import { useToast } from '../context/ToastContext';

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

  if (error) return <ErrorState message={error} onRetry={load} />;

  const count = (type) => resources.filter((r) => r.resource_type === type).length;
  const filtered = resources.filter((r) => filter === 'all' || r.resource_type === filter);
  const tabs = [['all', 'All', null], ...RESOURCE_TYPES.filter(([v]) => count(v) > 0)];

  return (
    <div className="page">
      <PageHeader title="Learning resources" description="Notes, audio and videos shared by your teachers for your level." />

      {loading ? (
        <>
          <Skeleton className="mb-6 h-11 w-80 max-w-full" />
          <CardGridSkeleton />
        </>
      ) : resources.length === 0 ? (
        <div className="surface">
          <EmptyState icon="book" title="No resources yet" description="Your teachers have not shared any resources for your level yet." size="lg" />
        </div>
      ) : (
        <>
          {tabs.length > 2 && (
            <div className="mb-6 inline-flex flex-wrap gap-1 rounded-xl border border-sand-200 bg-white p-1" role="group" aria-label="Filter by type">
              {tabs.map(([value, label]) => (
                <button key={value} type="button" onClick={() => setFilter(value)} aria-pressed={filter === value} className={filter === value ? 'tab-active' : 'tab'}>
                  {label} <span className="ml-1 text-xs opacity-70">{value === 'all' ? resources.length : count(value)}</span>
                </button>
              ))}
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <ResourceCard key={r.id} resource={r} onOpen={openResource} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentResources;
