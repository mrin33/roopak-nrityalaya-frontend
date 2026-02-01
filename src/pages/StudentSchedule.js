import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const StudentSchedule = () => {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState({
    batchInfo: null,
    weeklySchedule: [],
    upcomingEvents: []
  });

  useEffect(() => {
    // TODO: Fetch real schedule from API
    setSchedule({
      batchInfo: {
        batchName: 'Evening Batch A',
        level: 'Praveshika Pratham (Level 1)',
        teacher: 'Priya Sharma',
        classRoom: 'Studio 1',
        duration: '1.5 hours'
      },
      weeklySchedule: [
        { day: 'Monday', time: '5:00 PM - 6:30 PM', type: 'Regular Class', status: 'scheduled' },
        { day: 'Tuesday', time: null, type: null, status: 'off' },
        { day: 'Wednesday', time: '5:00 PM - 6:30 PM', type: 'Regular Class', status: 'scheduled' },
        { day: 'Thursday', time: null, type: null, status: 'off' },
        { day: 'Friday', time: '5:00 PM - 6:30 PM', type: 'Practice Session', status: 'scheduled' },
        { day: 'Saturday', time: '10:00 AM - 12:00 PM', type: 'Group Practice', status: 'optional' },
        { day: 'Sunday', time: null, type: null, status: 'off' },
      ],
      upcomingEvents: [
        { date: '2026-02-15', event: 'Annual Day Registration Deadline', type: 'deadline' },
        { date: '2026-03-05', event: 'Level Examination', type: 'exam' },
        { date: '2026-03-20', event: 'Workshop: Advanced Footwork', type: 'workshop' },
      ]
    });
  }, []);

  const getDayColor = (status) => {
    switch(status) {
      case 'scheduled': return 'bg-green-50 border-green-200';
      case 'optional': return 'bg-blue-50 border-blue-200';
      case 'off': return 'bg-gray-50 border-gray-200';
      default: return 'bg-white border-gray-200';
    }
  };

  const getEventIcon = (type) => {
    switch(type) {
      case 'deadline':
        return (
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'exam':
        return (
          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'workshop':
        return (
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-2">
            My Schedule
          </h1>
          <p className="text-gray-600">View your class timetable and upcoming events</p>
        </div>

        {/* Batch Information Card */}
        {schedule.batchInfo && (
          <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl shadow-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Batch Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div>
                <p className="text-white/70 text-sm mb-1">Batch Name</p>
                <p className="font-semibold text-lg">{schedule.batchInfo.batchName}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm mb-1">Level</p>
                <p className="font-semibold text-lg">{schedule.batchInfo.level}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm mb-1">Teacher</p>
                <p className="font-semibold text-lg">{schedule.batchInfo.teacher}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm mb-1">Location</p>
                <p className="font-semibold text-lg">{schedule.batchInfo.classRoom}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm mb-1">Duration</p>
                <p className="font-semibold text-lg">{schedule.batchInfo.duration}</p>
              </div>
            </div>
          </div>
        )}

        {/* Weekly Schedule */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-accent mb-6 pb-4 border-b">Weekly Schedule</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {schedule.weeklySchedule.map((day, index) => (
              <div 
                key={index}
                className={`border-2 rounded-xl p-4 transition-all ${getDayColor(day.status)} ${
                  day.status === 'off' ? 'opacity-50' : 'hover:shadow-md'
                }`}
              >
                <h3 className="font-bold text-accent mb-2">{day.day}</h3>
                {day.time ? (
                  <>
                    <p className="text-sm text-gray-600 mb-2">{day.time}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      day.status === 'scheduled' ? 'bg-green-200 text-green-800' :
                      day.status === 'optional' ? 'bg-blue-200 text-blue-800' :
                      'bg-gray-200 text-gray-800'
                    }`}>
                      {day.type}
                    </span>
                  </>
                ) : (
                  <p className="text-sm text-gray-400 italic">No class</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-200 rounded mr-2"></div>
              <span className="text-gray-600">Regular Class</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-200 rounded mr-2"></div>
              <span className="text-gray-600">Optional/Practice</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
              <span className="text-gray-600">No Class</span>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-accent mb-6 pb-4 border-b">Upcoming Events</h2>
          
          <div className="space-y-4">
            {schedule.upcomingEvents.map((event, index) => (
              <div 
                key={index}
                className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex-shrink-0">
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-accent mb-1">{event.event}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                  event.type === 'deadline' ? 'bg-red-100 text-red-800' :
                  event.type === 'exam' ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Card */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-yellow-900 mb-3">💡 Class Tips</h3>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li>• Arrive 10 minutes before class to warm up</li>
            <li>• Bring water bottle and towel</li>
            <li>• Wear comfortable practice clothes</li>
            <li>• Inform teacher in advance if you'll be absent</li>
            <li>• Saturday practice sessions are optional but highly recommended</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentSchedule;
