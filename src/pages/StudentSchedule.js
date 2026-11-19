import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import studentService from '../services/studentService';
import noticeService from '../services/noticeService';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const EVENT_CATEGORIES = ['event', 'examination', 'workshop', 'holiday'];
const EVENT_STYLE = {
  event: 'bg-purple-100 text-purple-800',
  examination: 'bg-red-100 text-red-800',
  workshop: 'bg-blue-100 text-blue-800',
  holiday: 'bg-green-100 text-green-800',
};

// Batch schedules are free text ("Mon, Wed, Fri", "Monday/Thursday", "Daily").
const classDays = (schedule) => {
  const text = (schedule || '').toLowerCase();
  if (/daily|every ?day/.test(text)) return new Set(DAYS);
  return new Set(DAYS.filter((d) => new RegExp(`(^|[^a-z])${d.slice(0, 3).toLowerCase()}`).test(text)));
};

const StudentSchedule = () => {
  const [schedule, setSchedule] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [sched, notices] = await Promise.all([studentService.getSchedule(), noticeService.getNotices()]);
      setSchedule(sched);
      setEvents(notices.filter((n) => EVENT_CATEGORIES.includes(n.category)).slice(0, 6));
    } catch (err) {
      setError(err.message || 'Could not load your schedule');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <LoadingSpinner fullScreen={true} text="Loading schedule..." size="lg" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const batch = schedule.batchInfo;
  const days = batch ? classDays(batch.schedule) : new Set();
  const today = DAYS[(new Date().getDay() + 6) % 7];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-primary mb-2">My Schedule</h1>
          <p className="text-gray-600">Your class timetable and upcoming academy events</p>
        </div>

        {!batch ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-yellow-800 mb-8">
            You have not been assigned to a batch yet. The academy office will assign you to one soon.
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl shadow-2xl p-6 sm:p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Batch Information</h2>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                  ['Batch', batch.batchName],
                  ['Level', batch.level],
                  ['Teacher', batch.teacher],
                  ['Days', batch.schedule],
                  ['Time & Room', [batch.time, batch.classRoom].filter(Boolean).join(' · ')],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-white/70 text-sm mb-1">{label}</p>
                    <p className="font-semibold text-lg">{value || '—'}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-accent mb-6 pb-4 border-b">Weekly Schedule</h2>
              {days.size === 0 ? (
                <p className="text-gray-600">Class days: {batch.schedule}</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                  {DAYS.map((day) => {
                    const hasClass = days.has(day);
                    return (
                      <div
                        key={day}
                        className={`border-2 rounded-xl p-4 ${hasClass ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-60'} ${
                          day === today ? 'ring-2 ring-primary' : ''
                        }`}
                      >
                        <h3 className="font-bold text-accent mb-2">
                          {day}
                          {day === today && <span className="ml-1 text-xs text-primary">(today)</span>}
                        </h3>
                        {hasClass ? (
                          <p className="text-sm text-gray-700">{batch.time}</p>
                        ) : (
                          <p className="text-sm text-gray-400 italic">No class</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <h2 className="text-2xl font-bold text-accent">Upcoming Events</h2>
            <Link to="/notices" className="text-sm text-primary hover:underline">All notices →</Link>
          </div>
          {events.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No upcoming events have been announced.</p>
          ) : (
            <div className="space-y-4">
              {events.map((e) => (
                <div key={e.id} className="flex flex-col sm:flex-row sm:items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <h3 className="font-semibold text-accent mb-1">{e.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{e.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Posted {new Date(e.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <span className={`self-start px-3 py-1 rounded-full text-xs font-semibold capitalize ${EVENT_STYLE[e.category]}`}>{e.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentSchedule;
