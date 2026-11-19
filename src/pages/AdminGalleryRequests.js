import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import galleryRequestService from '../services/galleryRequestService';
import StatusBadge from '../components/StatusBadge';
import RollNumberBadge from '../components/RollNumberBadge';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import ProtectedMedia, { openProtectedMedia } from '../components/ProtectedMedia';
import PageHeader from '../components/ui/PageHeader';
import Icon from '../components/ui/Icon';
import { PageSkeleton } from '../components/ui/Skeleton';
import { formatDate } from '../utils/date';

const TABS = [
  ['pending', 'Pending'],
  ['approved', 'Approved'],
  ['rejected', 'Declined'],
  ['all', 'All'],
];
const shortDate = (d) => formatDate(d, { day: 'numeric', month: 'short', year: 'numeric' });

const AdminGalleryRequests = () => {
  const toast = useToast();
  const confirm = useConfirm();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('pending');
  const [busyId, setBusyId] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setRequests((await galleryRequestService.getAllAdminRequests()) || []);
    } catch (err) {
      setError(err.message || 'Could not load gallery requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleApprove = async (r) => {
    const ok = await confirm({
      title: 'Publish this upload?',
      message: `“${r.title}” from ${r.student_name} will appear in the public gallery.`,
      confirmLabel: 'Approve and publish',
    });
    if (!ok) return;
    setBusyId(r.id);
    try {
      await galleryRequestService.updateRequestStatus(r.id, 'approved');
      toast.success(`Approved — “${r.title}” is now in the public gallery.`);
      fetchRequests();
    } catch (err) {
      toast.error(err.message || 'Failed to approve request.');
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (r) => {
    const res = await confirm({
      title: 'Decline this upload?',
      message: `${r.student_name} will see your reason on their uploads page.`,
      confirmLabel: 'Decline',
      tone: 'danger',
      input: { label: 'Reason', required: true, multiline: true, placeholder: 'e.g. The photo is blurred — please upload a clearer one.' },
    });
    if (!res) return;
    setBusyId(r.id);
    try {
      await galleryRequestService.updateRequestStatus(r.id, 'rejected', res.value);
      toast.success('Upload declined. The student can see the reason.');
      fetchRequests();
    } catch (err) {
      toast.error(err.message || 'Failed to decline request.');
    } finally {
      setBusyId(null);
    }
  };

  if (loading && !requests.length) return <PageSkeleton label="Loading upload requests…" variant="gallery" stats={false} />;
  if (error) return <ErrorState message={error} onRetry={fetchRequests} />;

  const shown = filter === 'all' ? requests : requests.filter((r) => r.status === filter);
  const count = (s) => (s === 'all' ? requests.length : requests.filter((r) => r.status === s).length);

  return (
    <div className="page">
      <PageHeader title="Student uploads" description="Photos and videos submitted by students. Approved items are published to the public gallery." />

      <div className="mb-6 inline-flex flex-wrap gap-1 rounded-xl border border-sand-200 bg-white p-1" role="group" aria-label="Filter by status">
        {TABS.map(([v, l]) => (
          <button key={v} type="button" onClick={() => setFilter(v)} aria-pressed={filter === v} className={filter === v ? 'tab-active' : 'tab'}>
            {l} <span className="ml-1 text-xs opacity-70">{count(v)}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="surface">
          <EmptyState icon="inbox" title={filter === 'pending' ? 'Nothing waiting for review' : 'No uploads here'} description="Student submissions will appear here." />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((r) => {
            const busy = busyId === r.id;
            return (
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
                  {r.file_url && (
                    <button
                      type="button"
                      onClick={() => openProtectedMedia(r.id)}
                      className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent-dark/60 text-white hover:bg-accent-dark/80"
                      aria-label={`Open ${r.title} full size`}
                      title="Open full size"
                    >
                      <Icon name="external" className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-body font-semibold text-accent">{r.title}</h2>
                  {r.description && <p className="mt-1 line-clamp-2 text-sm text-gray-600">{r.description}</p>}
                  <dl className="mt-3 space-y-1.5 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-gray-500">Student</dt>
                      <dd className="flex items-center gap-1.5 text-right text-accent">
                        {r.student_name} <RollNumberBadge rollNumber={r.roll_number} size="sm" />
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-gray-500">Category</dt>
                      <dd className="text-accent">
                        {r.category} · <span className="capitalize">{r.media_type}</span>
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-gray-500">Submitted</dt>
                      <dd className="text-accent">{shortDate(r.requested_at)}</dd>
                    </div>
                  </dl>
                  <div className="mt-auto pt-4">
                    {r.status === 'pending' && (
                      <div className="flex gap-2">
                        <button type="button" onClick={() => handleApprove(r)} disabled={busy} className="btn-primary flex-1">
                          <Icon name="check" className="h-4 w-4" /> Approve
                        </button>
                        <button type="button" onClick={() => handleReject(r)} disabled={busy} className="btn-danger-outline flex-1">
                          Decline
                        </button>
                      </div>
                    )}
                    {r.status === 'approved' && (
                      <p className="text-xs text-green-800">
                        Approved {r.reviewed_at ? shortDate(r.reviewed_at) : ''} by {r.reviewed_by_name || 'an admin'}
                      </p>
                    )}
                    {r.status === 'rejected' && r.rejection_reason && (
                      <p className="rounded-lg bg-red-50 p-3 text-xs text-red-800">
                        <span className="font-semibold">Reason: </span>
                        {r.rejection_reason}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminGalleryRequests;
