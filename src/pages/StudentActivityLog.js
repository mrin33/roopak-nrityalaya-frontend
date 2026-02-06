import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const StudentActivityLog = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
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
      case 'challenging': return '😓';
      default: return '🙂';
    }
  };

  const getMoodColor = (mood) => {
    switch(mood) {
      case 'great': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'okay': return 'bg-yellow-100 text-yellow-800';
      case 'tired': return 'bg-orange-100 text-orange-800';
      case 'challenging': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate statistics
  const totalPracticeHours = logs.reduce((sum, log) => sum + log.practice_hours, 0);
  const averagePracticeHours = logs.length > 0 ? (totalPracticeHours / logs.length).toFixed(1) : 0;
  const totalPerformances = logs.filter(log => log.performances !== 'None').length;
  const thisWeekLogs = logs.filter(log => {
    const logDate = new Date(log.log_date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return logDate >= weekAgo;
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-heading font-bold text-primary mb-2">
              Activity Log
            </h1>
            <p className="text-gray-600">Track your daily practice and performances</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            + Add Today's Activity
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Practice Hours</p>
                <p className="text-2xl font-bold text-primary">{totalPracticeHours.toFixed(1)}h</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Hours/Day</p>
                <p className="text-2xl font-bold text-green-600">{averagePracticeHours}h</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Performances</p>
                <p className="text-2xl font-bold text-purple-600">{totalPerformances}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-blue-600">{thisWeekLogs} logs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Practice Hours Graph */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-accent mb-4">Practice Hours Trend (Last 7 Days)</h3>
          <div className="flex items-end justify-between h-48 space-x-2">
            {logs.slice(0, 7).reverse().map((log, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-primary/20 rounded-t-lg relative" style={{ height: `${(log.practice_hours / 3) * 100}%`, minHeight: '20px' }}>
                  <div className="absolute -top-6 left-0 right-0 text-center text-sm font-bold text-primary">
                    {log.practice_hours}h
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {new Date(log.log_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">Goal: 2 hours/day</p>
            <p className="text-sm text-gray-600">Max: 3 hours shown</p>
          </div>
        </div>

        {/* Activity Logs Timeline */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b">Your Activity Timeline</h2>
          
          {logs.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 text-lg mb-4">No activity logs yet</p>
              <button onClick={() => setShowAddModal(true)} className="btn-primary">
                Add Your First Log
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
                        <span className="text-xs text-gray-600">
                          {new Date(log.log_date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-lg font-bold text-primary">
                          {new Date(log.log_date).getDate()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-accent">
                          {new Date(log.log_date).toLocaleDateString('en-US', { 
                            weekday: 'long',
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-sm text-gray-600">
                          {log.practice_hours} hours practiced
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getMoodColor(log.mood)}`}>
                      {getMoodEmoji(log.mood)} {log.mood.charAt(0).toUpperCase() + log.mood.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">📝 Activities Done:</p>
                      <p className="text-sm text-gray-600">{log.activities_done}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">🎭 Performances:</p>
                      <p className="text-sm text-gray-600">{log.performances}</p>
                    </div>
                  </div>

                  {log.notes && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-1">💭 Notes:</p>
                      <p className="text-sm text-gray-600 italic">{log.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Activity Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-primary text-white p-6 rounded-t-2xl sticky top-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Log Today's Activity</h2>
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
                    <label className="block text-sm font-semibold text-accent mb-2">What did you practice? *</label>
                    <textarea
                      name="activitiesDone"
                      value={formData.activitiesDone}
                      onChange={handleChange}
                      rows="4"
                      className="input-field"
                      placeholder="E.g., Teen Taal variations, footwork drills, hand gestures..."
                      required
                    ></textarea>
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
                      max="12"
                      className="input-field"
                      placeholder="E.g., 2.5"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter in hours (e.g., 1.5 for 1 hour 30 minutes)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Performances (if any)</label>
                    <textarea
                      name="performances"
                      value={formData.performances}
                      onChange={handleChange}
                      rows="2"
                      className="input-field"
                      placeholder="Any performances or demonstrations today..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">How did you feel? *</label>
                    <select 
                      name="mood"
                      value={formData.mood}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="great">😊 Great - Excellent session!</option>
                      <option value="good">🙂 Good - Productive practice</option>
                      <option value="okay">😐 Okay - Average session</option>
                      <option value="tired">😴 Tired - Low energy</option>
                      <option value="challenging">😓 Challenging - Struggled a bit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Additional Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="3"
                      className="input-field"
                      placeholder="Any observations, challenges, or achievements..."
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
