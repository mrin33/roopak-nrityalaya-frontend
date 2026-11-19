import React, { useCallback, useEffect, useState } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Modal from '../components/ui/Modal';
import Icon from '../components/ui/Icon';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import PerformanceGraph from '../components/PerformanceGraph';
import studentService from '../services/studentService';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import { formatDate, todayISO } from '../utils/date';

const MOODS = [
  ['great', 'Great', 'badge-success'],
  ['good', 'Good', 'badge-info'],
  ['okay', 'Okay', 'badge-warning'],
  ['tired', 'Tired', 'badge-neutral'],
  ['frustrated', 'Frustrated', 'badge-danger'],
];
const moodOf = (m) => MOODS.find(([v]) => v === m) || MOODS[1];

const freshForm = () => ({
  logDate: todayISO(),
  activitiesDone: '',
  performances: '',
  practiceHours: '',
  notes: '',
  mood: 'good',
});

const StudentActivityLog = () => {
  const toast = useToast();
  const confirm = useConfirm();
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(freshForm());

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [rows, statRows] = await Promise.all([studentService.getActivityLogs(), studentService.getActivityStats()]);
      setLogs(rows.map((l) => ({ ...l, id: l.log_id, practice_hours: Number(l.practice_hours) || 0 })));
      setStats(statRows);
    } catch (err) {
      setError(err.message || 'Could not load your practice log');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleChange = (e) => setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  const openAdd = () => {
    setEditingId(null);
    setFormData(freshForm());
    setShowModal(true);
  };

  const openEdit = (log) => {
    setEditingId(log.id);
    setFormData({
      logDate: log.log_date,
      activitiesDone: log.activities_done || '',
      performances: log.performances && log.performances !== 'None' ? log.performances : '',
      practiceHours: String(log.practice_hours),
      notes: log.notes || '',
      mood: log.mood || 'good',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      log_date: formData.logDate,
      activities_done: formData.activitiesDone,
      performances: formData.performances || 'None',
      practice_hours: formData.practiceHours === '' ? 0 : parseFloat(formData.practiceHours),
      notes: formData.notes,
      mood: formData.mood,
    };
    setSaving(true);
    try {
      if (editingId) {
        await studentService.updateActivityLog(editingId, payload);
        toast.success('Practice log updated.');
      } else {
        await studentService.createActivityLog(payload);
        toast.success('Practice log saved.');
      }
      setShowModal(false);
      setFormData(freshForm());
      load();
    } catch (err) {
      toast.error(err.message || 'Could not save the practice log.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (log) => {
    const ok = await confirm({
      title: 'Delete this entry?',
      message: `Your practice log for ${formatDate(log.log_date)} will be removed.`,
      confirmLabel: 'Delete',
      tone: 'danger',
    });
    if (!ok) return;
    try {
      await studentService.deleteActivityLog(log.id);
      toast.success('Practice log deleted.');
      load();
    } catch (err) {
      toast.error(err.message || 'Could not delete the log.');
    }
  };

  // Practice hours for the last 7 days (local dates).
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const iso = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    const dayLog = logs.find((l) => l.log_date === iso);
    last7.push({ label: date.toLocaleDateString('en-IN', { weekday: 'short' }), value: dayLog ? dayLog.practice_hours : 0 });
  }

  if (loading) return <PageSkeleton label="Loading your practice log…" variant="cards" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="page">
      <PageHeader
        title="Practice log"
        description="Record your riyaz and track your progress over time."
        actions={
          <button type="button" onClick={openAdd} className="btn-primary">
            <Icon name="plus" className="h-4 w-4" /> Log practice
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total hours" value={`${stats?.total_practice_hours ?? 0}h`} icon="clock" tone="brand" />
        <StatCard label="Average / session" value={`${stats?.avg_practice_hours ?? 0}h`} icon="chart" tone="gold" />
        <StatCard label="Sessions logged" value={logs.length} icon="clipboardList" tone="info" />
        <StatCard label="This week" value={stats?.this_week_logs ?? 0} icon="calendar" tone="success" />
      </div>

      <section className="card mb-6" aria-labelledby="chart-heading">
        <h2 id="chart-heading" className="section-title mb-4">
          Last 7 days
        </h2>
        <PerformanceGraph data={last7} maxValue={Math.max(4, ...last7.map((d) => d.value))} unit="h" height={180} />
      </section>

      {logs.length === 0 ? (
        <div className="surface">
          <EmptyState
            icon="clipboardList"
            title="No practice logged yet"
            description="Start recording your practice sessions to see your progress over time."
            actionText="Log your first session"
            onAction={openAdd}
            size="lg"
          />
        </div>
      ) : (
        <ul className="space-y-4">
          {logs.map((log) => {
            const [, moodLabel, moodClass] = moodOf(log.mood);
            return (
              <li key={log.id} className="card">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-body text-base font-semibold text-accent">
                      {formatDate(log.log_date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </h3>
                    <span className={`${moodClass} mt-1.5`}>Feeling {moodLabel.toLowerCase()}</span>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-heading text-2xl font-semibold tabular-nums text-primary">{log.practice_hours}h</p>
                    <p className="text-xs text-gray-500">practice</p>
                  </div>
                </div>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="font-medium text-gray-500">Practised</dt>
                    <dd className="mt-0.5 whitespace-pre-wrap text-accent">{log.activities_done}</dd>
                  </div>
                  {log.performances && log.performances !== 'None' && (
                    <div>
                      <dt className="font-medium text-gray-500">Performances</dt>
                      <dd className="mt-0.5 text-accent">{log.performances}</dd>
                    </div>
                  )}
                  {log.notes && (
                    <div>
                      <dt className="font-medium text-gray-500">Notes</dt>
                      <dd className="mt-1 rounded-lg bg-sand-50 p-3 italic text-gray-700">{log.notes}</dd>
                    </div>
                  )}
                </dl>
                <div className="mt-4 flex gap-2 border-t border-sand-100 pt-3">
                  <button type="button" onClick={() => openEdit(log)} className="btn-ghost btn-sm">
                    <Icon name="pencil" className="h-4 w-4" /> Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(log)} className="btn-ghost btn-sm text-red-700 hover:bg-red-50 hover:text-red-800">
                    <Icon name="trash" className="h-4 w-4" /> Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit practice log' : 'Log practice'} size="lg">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="logDate" className="form-label">
                Date
              </label>
              <input id="logDate" type="date" max={todayISO()} name="logDate" value={formData.logDate} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label htmlFor="practiceHours" className="form-label">
                Practice hours
              </label>
              <input
                id="practiceHours"
                type="number"
                inputMode="decimal"
                name="practiceHours"
                value={formData.practiceHours}
                onChange={handleChange}
                step="0.5"
                min="0"
                max="24"
                className="input-field"
                placeholder="e.g. 1.5"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="activitiesDone" className="form-label">
                What did you practise?
              </label>
              <textarea id="activitiesDone" name="activitiesDone" value={formData.activitiesDone} onChange={handleChange} rows={4} className="input-field" required />
            </div>
            <div>
              <label htmlFor="performances" className="form-label">
                Performances <span className="font-normal text-gray-500">(optional)</span>
              </label>
              <input id="performances" name="performances" value={formData.performances} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="mood" className="form-label">
                How did it feel?
              </label>
              <select id="mood" name="mood" value={formData.mood} onChange={handleChange} className="input-field">
                {MOODS.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="notes" className="form-label">
                Notes <span className="font-normal text-gray-500">(optional)</span>
              </label>
              <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} className="input-field" />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Save entry'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentActivityLog;
