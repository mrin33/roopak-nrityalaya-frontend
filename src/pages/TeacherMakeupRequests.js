import React, { useCallback, useEffect, useState } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import StatusBadge from '../components/StatusBadge';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import teacherService from '../services/teacherService';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/date';

// Students who missed a class request to attend one of this teacher's batches.
const TeacherMakeupRequests = () => {
  const toast = useToast();
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
      notes = window.prompt('Reason for declining (shown to the student):', '');
      if (notes === null) return;
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

  if (loading) return <PageSkeleton label="Loading makeup requests..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const shown = requests.filter((r) => filter === 'all' || r.status === filter);
  const count = (s) => requests.filter((r) => r.status === s).length;

  return (
    <div className="page">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="page-title">Makeup Class Requests</h1>
          <p className="text-gray-600">Students who missed a class and want to join one of your batches</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6" role="group" aria-label="Filter requests">
          {[
            ['pending', `Pending (${count('pending')})`],
            ['approved', `Approved (${count('approved')})`],
            ['rejected', 'Declined'],
            ['completed', 'Attended'],
            ['all', 'All'],
          ].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              aria-pressed={filter === v}
              className={`px-4 py-2 rounded-lg font-semibold ${filter === v ? 'bg-primary text-white' : 'bg-white shadow'}`}
            >
              {l}
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <div className="surface">
            <EmptyState icon="calendar" title="No requests here" description="Makeup requests for your batches will appear here." />
          </div>
        ) : (
          <div className="space-y-4">
            {shown.map((r) => (
              <article key={r.booking_id} className="bg-white rounded-xl shadow p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                  <div>
                    <h2 className="font-bold text-accent text-lg">
                      {r.student_name} <span className="text-sm text-gray-500 font-normal">({r.roll_number || '—'})</span>
                    </h2>
                    <p className="text-sm text-gray-600">Requested {new Date(r.created_at).toLocaleDateString('en-IN')}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-sand-50 rounded-lg mb-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">MISSED</p>
                    <p className="font-semibold">{formatDate(r.original_class_date)}</p>
                    <p className="text-gray-600">{r.original_batch_name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">WANTS TO ATTEND</p>
                    <p className="font-semibold">{formatDate(r.makeup_class_date)}</p>
                    <p className="text-gray-600">{r.makeup_batch_name}</p>
                  </div>
                </div>
                {r.notes && <p className="text-sm text-gray-700 whitespace-pre-line mb-4">{r.notes}</p>}
                <div className="flex flex-wrap gap-3">
                  {r.status === 'pending' && (
                    <>
                      <button onClick={() => decide(r, 'approved')} disabled={busyId === r.booking_id} className="btn-primary px-4 py-2 disabled:opacity-50">
                        Approve
                      </button>
                      <button
                        onClick={() => decide(r, 'rejected')}
                        disabled={busyId === r.booking_id}
                        className="px-4 py-2 rounded-lg font-semibold bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {r.status === 'approved' && (
                    <button onClick={() => decide(r, 'completed')} disabled={busyId === r.booking_id} className="btn-secondary px-4 py-2 disabled:opacity-50">
                      Mark as attended
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherMakeupRequests;
