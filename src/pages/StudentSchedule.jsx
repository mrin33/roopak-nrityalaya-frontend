import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import Icon from '../components/ui/Icon';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import studentService from '../services/studentService';
import noticeService from '../services/noticeService';
import { formatDate } from '../utils/date';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const EVENT_CATEGORIES = ['event', 'examination', 'workshop', 'holiday'];

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

  if (loading) return <PageSkeleton label="Loading schedule…" variant="cards" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const batch = schedule.batchInfo;
  const days = batch ? classDays(batch.schedule) : new Set();
  const today = DAYS[(new Date().getDay() + 6) % 7];

  return (
    <div className="page">
      <PageHeader title="Schedule" description="Your weekly class timetable and upcoming academy events." />

      {!batch ? (
        <div className="callout-warning mb-6 flex gap-3">
          <Icon name="info" className="mt-0.5 h-5 w-5 shrink-0" />
          You have not been assigned to a batch yet. The academy office will assign you to one soon.
        </div>
      ) : (
        <>
          <section className="surface mb-6 overflow-hidden" aria-labelledby="batch-heading">
            <div className="border-b border-sand-200 bg-sand-50 px-5 py-4 sm:px-6">
              <p className="eyebrow">Your batch</p>
              <h2 id="batch-heading" className="mt-1 font-heading text-2xl font-semibold text-accent">
                {batch.batchName}
              </h2>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 p-5 sm:p-6 lg:grid-cols-4">
              {[
                ['Level', batch.level, 'teacher'],
                ['Teacher', batch.teacher, 'user'],
                ['Days', batch.schedule, 'calendar'],
                ['Time & room', [batch.time, batch.classRoom].filter(Boolean).join(' · '), 'clock'],
              ].map(([label, value, icon]) => (
                <div key={label} className="flex gap-3">
                  <Icon name={icon} className="mt-0.5 h-5 w-5 shrink-0 text-secondary-600" />
                  <div className="min-w-0">
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
                    <dd className="mt-0.5 font-medium text-accent">{value || '—'}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>

          <section className="card mb-6" aria-labelledby="week-heading">
            <h2 id="week-heading" className="section-title mb-4">
              This week
            </h2>
            {days.size === 0 ? (
              <p className="text-gray-600">Class days: {batch.schedule}</p>
            ) : (
              <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                {DAYS.map((day) => {
                  const hasClass = days.has(day);
                  const isToday = day === today;
                  return (
                    <li
                      key={day}
                      className={`rounded-lg border p-3 ${
                        hasClass ? 'border-primary-200 bg-primary-50/60' : 'border-sand-200 bg-sand-50 text-gray-400'
                      } ${isToday ? 'ring-2 ring-secondary-500 ring-offset-1' : ''}`}
                      aria-current={isToday ? 'date' : undefined}
                    >
                      <p className={`text-sm font-semibold ${hasClass ? 'text-accent' : ''}`}>
                        {day.slice(0, 3)}
                        {isToday && <span className="ml-1.5 text-[0.65rem] font-semibold uppercase text-secondary-700">Today</span>}
                      </p>
                      <p className="mt-1 text-xs">{hasClass ? batch.time || 'Class' : 'No class'}</p>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>
        </>
      )}

      <section className="card" aria-labelledby="events-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="events-heading" className="section-title">
            Upcoming events
          </h2>
          <Link to="/notices" className="text-sm font-semibold text-primary hover:text-primary-700">
            All notices
          </Link>
        </div>
        {events.length === 0 ? (
          <EmptyState icon="calendar" size="sm" title="No upcoming events have been announced" />
        ) : (
          <ul className="divide-y divide-sand-100">
            {events.map((e) => (
              <li key={e.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h3 className="font-body font-semibold text-accent">{e.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">{e.content}</p>
                  <p className="mt-1 text-xs text-gray-500">Posted {formatDate(e.created_at)}</p>
                </div>
                <span className="badge-gold shrink-0 self-start capitalize">{e.category}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default StudentSchedule;
