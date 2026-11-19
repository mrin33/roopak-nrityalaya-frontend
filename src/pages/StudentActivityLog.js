import React, { useCallback, useEffect, useState } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import PerformanceGraph from '../components/PerformanceGraph';
import studentService from '../services/studentService';
import { useToast } from '../context/ToastContext';
import { formatDate, todayISO } from '../utils/date';

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
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
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
      setError(err.message || 'Could not load your activity logs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData(freshForm());
    setShowAddModal(true);
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
    setShowAddModal(true);
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
        toast.success('Activity log updated.');
      } else {
        await studentService.createActivityLog(payload);
        toast.success('Activity log saved.');
      }
      setShowAddModal(false);
      setFormData(freshForm());
      load();
    } catch (err) {
      toast.error(err.message || 'Could not save the activity log.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (log) => {
    if (!window.confirm(`Delete your log for ${formatDate(log.log_date)}?`)) return;
    try {
      await studentService.deleteActivityLog(log.id);
      toast.success('Activity log deleted.');
      load();
    } catch (err) {
      toast.error(err.message || 'Could not delete the log.');
    }
  };

  const getMoodEmoji = (mood) => {
    switch(mood) {
      case 'great': return '😊';
      case 'good': return '🙂';
      case 'okay': return '😐';
      case 'tired': return '😴';
      case 'frustrated': return '😤';
      default: return '🙂';
    }
  };

  const getMoodColor = (mood) => {
    switch(mood) {
      case 'great': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'okay': return 'bg-amber-100 text-amber-800';
      case 'tired': return 'bg-purple-100 text-purple-800';
      case 'frustrated': return 'bg-red-100 text-red-800';
      default: return 'bg-sand-100 text-gray-800';
    }
  };

  const totalPracticeHours = stats ? stats.total_practice_hours : 0;
  const avgPracticeHours = stats ? stats.avg_practice_hours : 0;
  const thisWeekLogs = stats ? stats.this_week_logs : 0;

  // Prepare data for PerformanceGraph (last 7 days)
  const last7DaysData = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    const dayLog = logs.find(log => log.log_date === dateString);
    
    last7DaysData.push({
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
      value: dayLog ? dayLog.practice_hours : 0
    });
  }

  // LOADING STATE - Using LoadingSpinner Component
  if (loading) {
    return <PageSkeleton label="Loading activity logs..." />;
  }
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="page">
      <div>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="page-title">
              Activity Log
            </h1>
            <p className="text-gray-600">Track your practice sessions and progress</p>
          </div>
          <button onClick={openAdd} className="btn-primary">
            + Add Activity
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Total Hours</p>
            <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-primary">{totalPracticeHours}h</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Average Hours</p>
            <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-green-700">{avgPracticeHours}h</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Total Sessions</p>
            <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-blue-700">{logs.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">This Week</p>
            <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-purple-700">{thisWeekLogs}</p>
          </div>
        </div>

        {/* Practice Hours Graph - Using PerformanceGraph Component */}
        <div className="card mb-6">
          <PerformanceGraph 
            data={last7DaysData}
            title="Practice Hours - Last 7 Days"
            maxValue={Math.max(4, ...last7DaysData.map((d) => d.value))}
            color="blue"
            height={200}
            showValues={true}
          />
        </div>

        {/* Activity Logs List */}
        <div className="space-y-6">
          {logs.map((log) => (
            <div key={log.id} className="card hover:shadow-lift transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="section-title">
                      {formatDate(log.log_date, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getMoodColor(log.mood)}`}>
                      {getMoodEmoji(log.mood)} {(log.mood || 'good').charAt(0).toUpperCase() + (log.mood || 'good').slice(1)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-primary">{log.practice_hours}h</p>
                  <p className="text-xs text-gray-500">Practice Time</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Activities Done:</p>
                  <p className="text-gray-600">{log.activities_done}</p>
                </div>

                {log.performances && log.performances !== 'None' && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Performances:</p>
                    <p className="text-gray-600">{log.performances}</p>
                  </div>
                )}

                {log.notes && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Notes:</p>
                    <div className="p-3 bg-sand-50 rounded-lg">
                      <p className="text-gray-700 italic">"{log.notes}"</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-4 mt-4 pt-4 border-t text-sm font-semibold">
                <button onClick={() => openEdit(log)} className="text-primary hover:underline">Edit</button>
                <button onClick={() => handleDelete(log)} className="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State - Using EmptyState Component */}
        {logs.length === 0 && (
          <EmptyState 
            icon="document"
            title="No activity logs yet"
            description="Start tracking your practice sessions to see your progress over time"
            actionText="Add Your First Log"
            onAction={openAdd}
            size="lg"
          />
        )}

        {/* Add Activity Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-primary text-white p-6 rounded-t-2xl sticky top-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{editingId ? 'Edit Activity Log' : 'Add Activity Log'}</h2>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="text-white hover:bg-white/20 rounded-full p-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="form-label">Date *</label>
                    <input
                      type="date"
                      max={todayISO()}
                      name="logDate"
                      value={formData.logDate}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Activities Done *</label>
                    <textarea
                      name="activitiesDone"
                      value={formData.activitiesDone}
                      onChange={handleChange}
                      rows="4"
                      className="input-field"
                      placeholder="Describe what you practiced today..."
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="form-label">Performances</label>
                    <input
                      type="text"
                      name="performances"
                      value={formData.performances}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Any performances? (optional)"
                    />
                  </div>

                  <div>
                    <label className="form-label">Practice Hours *</label>
                    <input
                      type="number"
                      name="practiceHours"
                      value={formData.practiceHours}
                      onChange={handleChange}
                      step="0.5"
                      min="0"
                      max="24"
                      className="input-field"
                      placeholder="2.5"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Mood</label>
                    <select
                      name="mood"
                      value={formData.mood}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="great">😊 Great</option>
                      <option value="good">🙂 Good</option>
                      <option value="okay">😐 Okay</option>
                      <option value="tired">😴 Tired</option>
                      <option value="frustrated">😤 Frustrated</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="3"
                      className="input-field"
                      placeholder="Any additional thoughts or observations..."
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                    {saving ? 'Saving…' : 'Save Activity Log'}
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

export default StudentActivityLog;
