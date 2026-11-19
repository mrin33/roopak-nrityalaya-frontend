import React, { useState, useEffect, useCallback } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Icon from '../components/ui/Icon';
import RollNumberBadge from '../components/RollNumberBadge';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import LoadMore from '../components/ui/LoadMore';
import adminService from '../services/adminService';
import { useToast } from '../context/ToastContext';

const PAGE_SIZE = 200;
const mapChange = (c) => ({ ...c, id: c.change_id, from: c.status_from, to: c.status_to, changed_at: c.created_at });

const TYPES = {
  enrollment: ['New enrolment', 'badge-success', 'plus'],
  discontinuation: ['Discontinued', 'badge-danger', 'xCircle'],
  rejoining: ['Rejoined', 'badge-info', 'refresh'],
  batch_switch: ['Batch switch', 'badge-gold', 'switch'],
};

const AdminStatusChanges = () => {
  const toast = useToast();
  const [changes, setChanges] = useState([]);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChanges = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const page = await adminService.getStatusChangesPage({ limit: PAGE_SIZE });
      setChanges(page.rows.map(mapChange));
      setTotal(page.total);
    } catch (err) {
      setError(err.message || 'Failed to load status history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChanges();
  }, [fetchChanges]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const page = await adminService.getStatusChangesPage({ limit: PAGE_SIZE, offset: changes.length });
      setChanges((list) => [...list, ...page.rows.map(mapChange)]);
      setTotal(page.total);
    } catch (err) {
      toast.error(err.message || 'Could not load more records.');
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) return <PageSkeleton label="Loading status history…" />;
  if (error) return <ErrorState message={error} onRetry={fetchChanges} />;

  const count = (t) => changes.filter((c) => c.change_type === t).length;
  const shown = filterType === 'all' ? changes : changes.filter((c) => c.change_type === filterType);

  return (
    <div className="page">
      <PageHeader title="Status history" description="Every enrolment, discontinuation, rejoining and batch switch, with reasons." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Enrolments" value={count('enrollment')} icon="plus" tone="success" />
        <StatCard label="Discontinued" value={count('discontinuation')} icon="xCircle" tone="danger" />
        <StatCard label="Rejoined" value={count('rejoining')} icon="refresh" tone="info" />
        <StatCard label="Batch switches" value={count('batch_switch')} icon="switch" tone="gold" />
      </div>

      <div className="mb-4 inline-flex flex-wrap gap-1 rounded-xl border border-sand-200 bg-white p-1" role="group" aria-label="Filter by type">
        {[['all', 'All'], ...Object.entries(TYPES).map(([k, [l]]) => [k, l])].map(([v, l]) => (
          <button key={v} type="button" onClick={() => setFilterType(v)} aria-pressed={filterType === v} className={filterType === v ? 'tab-active' : 'tab'}>
            {l} <span className="ml-1 text-xs opacity-70">{v === 'all' ? changes.length : count(v)}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="surface">
          <EmptyState icon="document" title="No status changes found" />
        </div>
      ) : (
        <ol className="surface divide-y divide-sand-100">
          {shown.map((c) => {
            const [label, cls, icon] = TYPES[c.change_type] || [c.change_type, 'badge-neutral', 'document'];
            const showFromTo = c.change_type !== 'enrollment' && (c.from || c.to);
            return (
              <li key={c.id} className="flex gap-4 p-4 sm:p-5">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sand-100 text-gray-600">
                  <Icon name={icon} className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-accent">{c.student_name}</p>
                    <RollNumberBadge rollNumber={c.roll_number} size="sm" />
                    <span className={cls}>{label}</span>
                  </div>
                  {showFromTo && (
                    <p className="mt-1.5 flex flex-wrap items-center gap-2 text-sm">
                      <span className="capitalize text-gray-600">{c.from || '—'}</span>
                      <Icon name="arrowRight" className="h-4 w-4 text-gray-400" />
                      <span className="font-medium capitalize text-accent">{c.to || '—'}</span>
                    </p>
                  )}
                  {c.reason && <p className="mt-1.5 text-sm text-gray-700">{c.reason}</p>}
                  {c.detailed_feedback && <p className="mt-1 text-sm text-gray-600">{c.detailed_feedback}</p>}
                  <p className="mt-2 text-xs text-gray-500">
                    {new Date(c.changed_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    {c.changed_by_email && ` · by ${c.changed_by_email}`}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
      <LoadMore loaded={changes.length} total={total} loading={loadingMore} onLoadMore={loadMore} noun="records" />
    </div>
  );
};

export default AdminStatusChanges;
