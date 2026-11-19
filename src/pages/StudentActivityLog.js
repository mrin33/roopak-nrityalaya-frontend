import React, { useState, useEffect } from 'react';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import PerformanceGraph from '../components/PerformanceGraph';

const StudentActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    logDate: new Date().toISOString().split('T')[0],
    activitiesDone: '',
    performances: '',
    practiceHours: '',
    notes: '',
    mood: 'good'
  });

  useEffect(() => {
    // TODO: Fetch activity logs from API
    setTimeout(() => {
      setLogs([
        {
          id: 1,
          log_date: '2026-02-03',
          activities_done: 'Practiced Teen Taal variations, footwork drills, chakkars',
          performances: 'None',
          practice_hours: 2.5,
          notes: 'Feeling confident with the new composition',
          mood: 'great'
        },
        {
          id: 2,
          log_date: '2026-02-02',
          activities_done: 'Hand gesture practice, Thumri rehearsal',
          performances: 'None',
          practice_hours: 2.0,
          notes: 'Need to work on expressions',
          mood: 'good'
        },
        {
          id: 3,
          log_date: '2026-02-01',
          activities_done: 'Group practice for annual day, solo piece rehearsal',
          performances: 'Practice performance for teacher',
          practice_hours: 3.0,
          notes: 'Great session! Teacher appreciated my improvement',
          mood: 'great'
        },
        {
          id: 4,
          log_date: '2026-01-31',
          activities_done: 'Basic footwork, rhythm practice',
          performances: 'None',
          practice_hours: 1.5,
          notes: 'Short session due to exam preparation',
          mood: 'okay'
        },
        {
          id: 5,
          log_date: '2026-01-30',
          activities_done: 'Full Tarana composition, speed practice',
          performances: 'None',
          practice_hours: 2.5,
          notes: 'Working on increasing speed while maintaining clarity',
          mood: 'good'
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API call to save activity log
    const newLog = {
      id: logs.length + 1,
      log_date: formData.logDate,
      activities_done: formData.activitiesDone,
      performances: formData.performances || 'None',
      practice_hours: parseFloat(formData.practiceHours),
      notes: formData.notes,
      mood: formData.mood
    };
    setLogs([newLog, ...logs]);
    setShowAddModal(false);
    setFormData({
      logDate: new Date().toISOString().split('T')[0],
      activitiesDone: '',
      performances: '',
      practiceHours: '',
      notes: '',
      mood: 'good'
    });
    alert('Activity log saved successfully!');
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
      case 'okay': return 'bg-yellow-100 text-yellow-800';
      case 'tired': return 'bg-purple-100 text-purple-800';
      case 'frustrated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate statistics
  const totalPracticeHours = logs.reduce((sum, log) => sum + log.practice_hours, 0);
  const avgPracticeHours = logs.length > 0 ? (totalPracticeHours / logs.length).toFixed(1) : 0;
  const thisWeekLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return logDate >= weekAgo;
  }).length;

  // Prepare data for PerformanceGraph (last 7 days)
  const last7DaysData = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    const dayLog = logs.find(log => log.log_date === dateString);
    
    last7DaysData.push({
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
      value: dayLog ? dayLog.practice_hours : 0
    });
  }

  // LOADING STATE - Using LoadingSpinner Component
  if (loading) {
    return <LoadingSpinner fullScreen={true} text="Loading activity logs..." size="lg" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-heading font-bold text-primary mb-2">
              Activity Log
            </h1>
            <p className="text-gray-600">Track your practice sessions and progress</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            + Add Activity
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Hours</p>
            <p className="text-3xl font-bold text-primary">{totalPracticeHours}h</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Average Hours</p>
            <p className="text-3xl font-bold text-green-600">{avgPracticeHours}h</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Sessions</p>
            <p className="text-3xl font-bold text-blue-600">{logs.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">This Week</p>
            <p className="text-3xl font-bold text-purple-600">{thisWeekLogs}</p>
          </div>
        </div>

        {/* Practice Hours Graph - Using PerformanceGraph Component */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <PerformanceGraph 
            data={last7DaysData}
            title="Practice Hours - Last 7 Days"
            maxValue={4}
            color="blue"
            height={200}
            showValues={true}
          />
        </div>

        {/* Activity Logs List */}
        <div className="space-y-6">
          {logs.map((log) => (
            <div key={log.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-accent">
                      {new Date(log.log_date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getMoodColor(log.mood)}`}>
                      {getMoodEmoji(log.mood)} {log.mood.charAt(0).toUpperCase() + log.mood.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">{log.practice_hours}h</p>
                  <p className="text-xs text-gray-500">Practice Time</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Activities Done:</p>
                  <p className="text-gray-600">{log.activities_done}</p>
                </div>

                {log.performances !== 'None' && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Performances:</p>
                    <p className="text-gray-600">{log.performances}</p>
                  </div>
                )}

                {log.notes && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Notes:</p>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 italic">"{log.notes}"</p>
                    </div>
                  </div>
                )}
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
            onAction={() => setShowAddModal(true)}
            size="lg"
          />
        )}

        {/* Add Activity Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-primary text-white p-6 rounded-t-2xl sticky top-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Add Activity Log</h2>
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
                    <label className="block text-sm font-semibold text-accent mb-2">Date *</label>
                    <input
                      type="date"
                      name="logDate"
                      value={formData.logDate}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Activities Done *</label>
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
                    <label className="block text-sm font-semibold text-accent mb-2">Performances</label>
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
                    <label className="block text-sm font-semibold text-accent mb-2">Practice Hours *</label>
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
                    <label className="block text-sm font-semibold text-accent mb-2">Mood</label>
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
                    <label className="block text-sm font-semibold text-accent mb-2">Notes</label>
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
                  <button type="submit" className="btn-primary">
                    Save Activity Log
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
