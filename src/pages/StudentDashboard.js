import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    attendancePercentage: 0,
    feeStatus: 'pending',
    batchInfo: null,
    recentNotices: [],
    upcomingClasses: []
  });

  const levels = [
    { number: 1, name: 'Praveshika Pratham' },
    { number: 2, name: 'Praveshika Purna' },
    { number: 3, name: 'Madhyama Pratham' },
    { number: 4, name: 'Madhyama Purna' },
    { number: 5, name: 'Visharad Pratham' },
    { number: 6, name: 'Visharad Purna' },
    { number: 7, name: 'Alankar Pratham' },
    { number: 8, name: 'Alankar Purna' },
  ];

  // Get current level info
  const currentLevel = user?.profile?.current_level_id || 1;
  const currentLevelInfo = levels.find(l => l.number === currentLevel) || levels[0];

  // Calculate progress percentage (for visual)
  const progressPercentage = (currentLevel / 8) * 100;

  useEffect(() => {
    // TODO: Fetch real dashboard data from API
    // For now, using dummy data
    setDashboardData({
      attendancePercentage: 85,
      feeStatus: 'paid',
      batchInfo: {
        batchName: 'Evening Batch A',
        schedule: 'Mon, Wed, Fri - 5:00 PM to 6:30 PM',
        teacherName: 'Priya Sharma'
      },
      recentNotices: [
        { id: 1, title: 'Annual Day 2026 - Registration Open', date: '2026-01-25' },
        { id: 2, title: 'February Fees Reminder', date: '2026-01-28' }
      ],
      upcomingClasses: [
        { date: '2026-02-03', time: '5:00 PM', type: 'Regular Class' },
        { date: '2026-02-05', time: '5:00 PM', type: 'Practice Session' }
      ]
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-2">
            Welcome back, {user?.profile?.full_name || user?.profile?.fullName || user?.email}!
          </h1>
          <p className="text-gray-600">Here's what's happening with your Kathak journey</p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Current Level Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-primary">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Current Level</h3>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">{currentLevel}</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-accent">{currentLevelInfo.name}</p>
            <div className="mt-3 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Level {currentLevel} of 8</p>
          </div>

          {/* Attendance Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Attendance</h3>
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-accent">{dashboardData.attendancePercentage}%</p>
            <p className="text-sm text-gray-500 mt-1">Great progress!</p>
          </div>

          {/* Fee Status Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-secondary">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Fee Status</h3>
              <svg className="w-10 h-10 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-green-600 capitalize">{dashboardData.feeStatus}</p>
            <Link to="/student/fees" className="text-sm text-primary hover:text-primary-dark mt-1 inline-block">
              View Details →
            </Link>
          </div>

          {/* Batch Info Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">My Batch</h3>
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            {dashboardData.batchInfo ? (
              <>
                <p className="text-lg font-bold text-accent">{dashboardData.batchInfo.batchName}</p>
                <p className="text-xs text-gray-500 mt-1">{dashboardData.batchInfo.schedule}</p>
              </>
            ) : (
              <p className="text-sm text-gray-500">Not enrolled in any batch</p>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Progress */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-accent mb-4 pb-2 border-b">My Profile</h2>
              
              {/* Profile Photo Placeholder */}
              <div className="flex flex-col items-center mb-4">
                <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-16 h-16 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <button className="text-sm text-primary hover:text-primary-dark">
                  Upload Photo
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500">Full Name</label>
                  <p className="font-semibold text-accent">
                    {user?.profile?.full_name || user?.profile?.fullName || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Email</label>
                  <p className="text-sm text-gray-700">{user?.email}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Phone</label>
                  <p className="text-sm text-gray-700">{user?.profile?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Enrollment Date</label>
                  <p className="text-sm text-gray-700">
                    {user?.profile?.enrollment_date 
                      ? new Date(user.profile.enrollment_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <button className="w-full mt-4 btn-secondary">
                Edit Profile
              </button>
            </div>

            {/* Level Progress */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-accent mb-4 pb-2 border-b">Level Progress</h2>
              <div className="space-y-3">
                {levels.map((level) => (
                  <div 
                    key={level.number}
                    className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                      level.number === currentLevel 
                        ? 'bg-primary text-white' 
                        : level.number < currentLevel
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-50 text-gray-500'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        level.number === currentLevel
                          ? 'bg-white text-primary'
                          : level.number < currentLevel
                          ? 'bg-green-200 text-green-800'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {level.number}
                      </div>
                      <span className="font-medium">{level.name}</span>
                    </div>
                    {level.number < currentLevel && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {level.number === currentLevel && (
                      <span className="text-xs bg-white text-primary px-2 py-1 rounded-full font-semibold">
                        Current
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Activity & Notices */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Classes */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <h2 className="text-xl font-bold text-accent">Upcoming Classes</h2>
                <Link to="/student/schedule" className="text-sm text-primary hover:text-primary-dark">
                  View All →
                </Link>
              </div>
              <div className="space-y-3">
                {dashboardData.upcomingClasses.map((class_, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{new Date(class_.date).getDate()}</p>
                        <p className="text-xs text-gray-500">{new Date(class_.date).toLocaleString('default', { month: 'short' })}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-accent">{class_.type}</p>
                        <p className="text-sm text-gray-600">{class_.time}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      Upcoming
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Notices */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <h2 className="text-xl font-bold text-accent">Recent Notices</h2>
                <Link to="/notices" className="text-sm text-primary hover:text-primary-dark">
                  View All →
                </Link>
              </div>
              <div className="space-y-3">
                {dashboardData.recentNotices.map((notice) => (
                  <div key={notice.id} className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                    <h3 className="font-semibold text-accent mb-1">{notice.title}</h3>
                    <p className="text-xs text-gray-500">
                      {new Date(notice.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-accent mb-4 pb-2 border-b">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Link to="/student/attendance" className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl hover:shadow-md transition-all">
                  <svg className="w-10 h-10 text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span className="text-sm font-semibold text-accent">Attendance</span>
                </Link>

                <Link to="/student/fees" className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl hover:shadow-md transition-all">
                  <svg className="w-10 h-10 text-secondary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-sm font-semibold text-accent">Pay Fees</span>
                </Link>

                <Link to="/student/resources" className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-100 to-green-50 rounded-xl hover:shadow-md transition-all">
                  <svg className="w-10 h-10 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-sm font-semibold text-accent">Resources</span>
                </Link>

                <Link to="/student/schedule" className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl hover:shadow-md transition-all">
                  <svg className="w-10 h-10 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-semibold text-accent">Schedule</span>
                </Link>

                <Link to="/gallery" className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl hover:shadow-md transition-all">
                  <svg className="w-10 h-10 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-semibold text-accent">Gallery</span>
                </Link>

                <Link to="/contact" className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-red-100 to-red-50 rounded-xl hover:shadow-md transition-all">
                  <svg className="w-10 h-10 text-red-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-semibold text-accent">Contact</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
