import React, { useCallback, useEffect, useState } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import Icon from '../components/ui/Icon';
import StatusBadge from '../components/StatusBadge';
import RollNumberBadge from '../components/RollNumberBadge';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import teacherService from '../services/teacherService';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import { formatDate } from '../utils/date';

const FILTERS = [
  ['pending', 'Pending'],
  ['approved', 'Approved'],
  ['rejected', 'Declined'],
  ['completed', 'Attended'],
  ['all', 'All'],
];

// Students who missed a class request to attend one of this teacher's batches.
const TeacherMakeupRequests = () => {
  const toast = useToast();
  const confirm = useConfirm();
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setRequests(await teacherService.getMakeupRequests());
    } catch (err) {
      setError(err.message || 'Could not load makeup requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const decide = async (r, status) => {
    let notes;
    if (status === 'rejected') {
      const res = await confirm({
        title: `Decline ${r.student_name}'s request?`,
        message: 'The student will see your reason on their Makeup Classes page.',
        confirmLabel: 'Decline request',
        tone: 'danger',
        input: { label: 'Reason', multiline: true, placeholder: 'e.g. The batch is full that day' },
      });
      if (!res) return;
      notes = res.value;
    }
    setBusyId(r.booking_id);
    try {
      await teacherService.updateMakeupRequest(r.booking_id, status, notes || undefined);
      toast.success(
        status === 'approved'
          ? `${r.student_name} can attend on ${formatDate(r.makeup_class_date)}.`
          : status === 'completed'
          ? 'Marked as attended.'
          : 'Request declined.'
      );
      load();
    } catch (err) {
      toast.error(err.message || 'Could not update the request.');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <PageSkeleton label="Loading makeup requests…" variant="cards" stats={false} />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const shown = requests.filter((r) => filter === 'all' || r.status === filter);
  const count = (s) => (s === 'all' ? requests.length : requests.filter((r) => r.status === s).length);

  return (
    <div className="page">
      <PageHeader title="Makeup requests" description="Students who missed a class and want to join one of your batches." />

      <div className="mb-6 inline-flex flex-wrap gap-1 rounded-xl border border-sand-200 bg-white p-1" role="group" aria-label="Filter requests">
        {FILTERS.map(([v, l]) => (
          <button key={v} type="button" onClick={() => setFilter(v)} aria-pressed={filter === v} className={filter === v ? 'tab-active' : 'tab'}>
            {l} <span className="ml-1 text-xs opacity-70">{count(v)}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="surface">
          <EmptyState icon="refresh" title={filter === 'pending' ? 'No requests waiting for you' : 'No requests here'} description="Makeup requests for your batches will appear here." />
        </div>
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {shown.map((r) => {
            const busy = busyId === r.booking_id;
            return (
              <li key={r.booking_id} className="card flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-accent">{r.student_name}</p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <RollNumberBadge rollNumber={r.roll_number} size="sm" />
                      <span className="text-xs text-gray-500">Requested {formatDate(r.created_at, { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                  <StatusBadge status={r.status} label={r.status === 'rejected' ? 'Declined' : r.status === 'completed' ? 'Attended' : undefined} />
                </div>
                <div className="mt-4 flex items-center gap-3 text-sm">
                  <div className="min-w-0 flex-1 rounded-lg bg-sand-50 p-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-gray-500">Missed</p>
                    <p className="font-medium text-accent">{formatDate(r.original_class_date, { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                    <p className="truncate text-xs text-gray-600">{r.original_batch_name || '—'}</p>
                  </div>
                  <Icon name="arrowRight" className="h-5 w-5 shrink-0 text-secondary-600" />
                  <div className="min-w-0 flex-1 rounded-lg bg-primary-50/60 p-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-gray-500">Wants to attend</p>
                    <p className="font-medium text-accent">{formatDate(r.makeup_class_date, { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                    <p className="truncate text-xs text-gray-600">{r.makeup_batch_name}</p>
                  </div>
                </div>
                {r.notes && <p className="mt-3 whitespace-pre-line text-sm text-gray-700">{r.notes}</p>}
                {(r.status === 'pending' || r.status === 'approved') && (
                  <div className="mt-auto flex gap-2 pt-4">
                    {r.status === 'pending' ? (
                      <>
                        <button type="button" onClick={() => decide(r, 'approved')} disabled={busy} className="btn-primary flex-1">
                          <Icon name="check" className="h-4 w-4" /> Approve
                        </button>
                        <button type="button" onClick={() => decide(r, 'rejected')} disabled={busy} className="btn-danger-outline flex-1">
                          Decline
                        </button>
                      </>
                    ) : (
                      <button type="button" onClick={() => decide(r, 'completed')} disabled={busy} className="btn-secondary flex-1">
                        <Icon name="clipboardCheck" className="h-4 w-4" /> Mark as attended
                      </button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TeacherMakeupRequests;
