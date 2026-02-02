import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    myBatches: [],
    totalStudents: 0,
    classesToday: 0,
    pendingAttendance: 0,
    recentNotices: [],
    upcomingClasses: []
  });

  useEffect(() => {
    // TODO: Fetch real data from API
    setDashboardData({
      myBatches: [
        { id: 1, name: 'Evening Batch A', level: 'Praveshika Pratham', students: 12, schedule: 'Mon, Wed, Fri - 5:00 PM' },
        { id: 2, name: 'Morning Batch B', level: 'Madhyama Pratham', students: 8, schedule: 'Tue, Thu, Sat - 10:00 AM' },
        { id: 3, name: 'Advanced Batch', level: 'Visharad Purna', students: 6, schedule: 'Mon, Wed - 7:00 PM' }
      ],
      totalStudents: 26,
      classesToday: 2,
      pendingAttendance: 1,
      recentNotices: [
        { id: 1, title: 'Level Examinations Schedule Released', date: '2026-01-28' },
        { id: 2, title: 'Teacher Training Workshop - February', date: '2026-01-25' }
      ],
      upcomingClasses: [
        { batch: 'Evening Batch A', date: '2026-02-03', time: '5:00 PM', students: 12 },
        { batch: 'Advanced Batch', date: '2026-02-03', time: '7:00 PM', students: 6 }
      ]
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-2">
            Welcome, {user?.profile?.full_name || user?.email}
          </h1>
          <p className="text-gray-600">Teacher Dashboard - Manage your classes and students</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">My Batches</p>
                <p className="text-3xl font-bold text-primary">{dashboardData.myBatches.length}</p>
              </div>
              <svg className="w-12 h-12 text-primary/20" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-green-600">{dashboardData.totalStudents}</p>
              </div>
              <svg className="w-12 h-12 text-green-500/20" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Classes Today</p>
                <p className="text-3xl font-bold text-blue-600">{dashboardData.classesToday}</p>
              </div>
              <svg className="w-12 h-12 text-blue-500/20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Attendance</p>
                <p className="text-3xl font-bold text-yellow-600">{dashboardData.pendingAttendance}</p>
              </div>
              <svg className="w-12 h-12 text-yellow-500/20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - My Batches */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Batches */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <h2 className="text-2xl font-bold text-accent">My Batches</h2>
                <Link to="/teacher/batches" className="text-sm text-primary hover:text-primary-dark">
                  View All →
                </Link>
              </div>

              <div className="space-y-4">
                {dashboardData.myBatches.map((batch) => (
                  <div key={batch.id} className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-5 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-accent">{batch.name}</h3>
                        <p className="text-sm text-gray-600">{batch.level}</p>
                      </div>
                      <span className="px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold">
                        {batch.students} Students
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {batch.schedule}
                      </span>
                      <div className="flex space-x-2">
                        <Link to={`/teacher/attendance/${batch.id}`} className="text-primary hover:text-primary-dark font-semibold">
                          Mark Attendance
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link to={`/teacher/students/${batch.id}`} className="text-primary hover:text-primary-dark font-semibold">
                          View Students
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Classes */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-accent mb-6 pb-4 border-b">Today's Classes</h2>
              <div className="space-y-4">
                {dashboardData.upcomingClasses.map((class_, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold">{class_.time}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-accent">{class_.batch}</p>
                        <p className="text-sm text-gray-600">{class_.students} students enrolled</p>
                      </div>
                    </div>
                    <Link to={`/teacher/attendance`} className="btn-primary">
                      Start Class
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions & Notices */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-accent mb-4 pb-2 border-b">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/teacher/attendance" className="block p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl hover:shadow-md transition-all">
                  <div className="flex items-center space-x-3">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <div>
                      <p className="font-semibold text-accent">Mark Attendance</p>
                      <p className="text-xs text-gray-600">Record student attendance</p>
                    </div>
                  </div>
                </Link>

                <Link to="/teacher/students" className="block p-4 bg-gradient-to-r from-green-100 to-green-50 rounded-xl hover:shadow-md transition-all">
                  <div className="flex items-center space-x-3">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-accent">View Students</p>
                      <p className="text-xs text-gray-600">Student list & progress</p>
                    </div>
                  </div>
                </Link>

                <Link to="/teacher/resources" className="block p-4 bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl hover:shadow-md transition-all">
                  <div className="flex items-center space-x-3">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div>
                      <p className="font-semibold text-accent">Upload Resources</p>
                      <p className="text-xs text-gray-600">Videos, audio, documents</p>
                    </div>
                  </div>
                </Link>

                <Link to="/teacher/schedule" className="block p-4 bg-gradient-to-r from-purple-100 to-purple-50 rounded-xl hover:shadow-md transition-all">
                  <div className="flex items-center space-x-3">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-accent">My Schedule</p>
                      <p className="text-xs text-gray-600">View teaching timetable</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Notices */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <h2 className="text-xl font-bold text-accent">Notices</h2>
                <Link to="/notices" className="text-sm text-primary hover:text-primary-dark">
                  View All →
                </Link>
              </div>
              <div className="space-y-3">
                {dashboardData.recentNotices.map((notice) => (
                  <div key={notice.id} className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                    <h3 className="font-semibold text-accent text-sm mb-1">{notice.title}</h3>
                    <p className="text-xs text-gray-500">
                      {new Date(notice.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Summary */}
            <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">My Profile</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-white/70">Name</p>
                  <p className="font-semibold">{user?.profile?.full_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-white/70">Email</p>
                  <p className="font-semibold">{user?.email}</p>
                </div>
                <div>
                  <p className="text-white/70">Experience</p>
                  <p className="font-semibold">{user?.profile?.experience_years || 0} years</p>
                </div>
                <div>
                  <p className="text-white/70">Specialization</p>
                  <p className="font-semibold">{user?.profile?.specialization || 'Kathak'}</p>
                </div>
              </div>
              <Link to="/teacher/profile" className="block mt-4 text-center bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
