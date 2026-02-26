import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import RollNumberBadge from '../components/RollNumberBadge';
import PaymentWindowBadge from '../components/PaymentWindowBadge';
import LateFeeWarning from '../components/LateFeeWarning';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    attendancePercentage: 0,
    feeStatus: 'pending',
    batchInfo: null,
    recentNotices: [],
    upcomingClasses: [],
    // NEW Phase 1 fields
    roll_number: 'PP15',
    payment_window: 'quarterly',
    discount: 2,
    next_due_date: '2026-02-05',
    has_late_fee: false,
    late_fee_amount: 0,
    performance_score: 87
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

  const currentLevel = user?.profile?.current_level_id || 1;
  const currentLevelInfo = levels.find(l => l.number === currentLevel) || levels[0];
  const progressPercentage = (currentLevel / 8) * 100;

  useEffect(() => {
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
      ],
      // NEW Phase 1 fields
      roll_number: 'PP15',
      payment_window: 'quarterly',
      discount: 2,
      next_due_date: '2026-02-05',
      has_late_fee: false,
      late_fee_amount: 0,
      performance_score: 87
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

        {/* Late Fee Warning - NEW Phase 1 */}
        {dashboardData.has_late_fee && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="font-bold text-red-800 text-lg">Payment Overdue!</p>
                <p className="text-red-700 mt-1">
                  Your payment is overdue. Late fee of ₹{dashboardData.late_fee_amount || 100} has been applied.
                </p>
                <Link to="/student/fees" className="inline-block mt-3 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors">
                  Pay Now →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats Cards - UPDATED with 5 cards including Phase 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Roll Number Card - NEW Phase 1 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-3">Roll Number</p>
            <RollNumberBadge rollNumber={dashboardData.roll_number} size="lg" showFull={false} />
          </div>

          {/* Current Level Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-primary">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Current Level</h3>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">{currentLevel}</span>
              </div>
            </div>
            <p className="text-lg font-bold text-accent">{currentLevelInfo.name}</p>
            <div className="mt-3 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{Math.round(progressPercentage)}% Complete</p>
          </div>

          {/* Attendance Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Attendance</h3>
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-accent">{dashboardData.attendancePercentage}%</p>
            <p className="text-xs text-gray-500 mt-1">This Month</p>
          </div>

          {/* Payment Plan Info - NEW Phase 1 */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-600">Payment Plan</p>
              {dashboardData.discount > 0 && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                  Save {dashboardData.discount}%
                </span>
              )}
            </div>
            <p className="text-lg font-bold text-primary capitalize">
              {dashboardData.payment_window}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Next due: {new Date(dashboardData.next_due_date).toLocaleDateString()}
            </p>
          </div>

          {/* Performance Score - NEW Phase 1 */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
            <p className="text-sm text-gray-600 mb-2">Performance</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-3xl font-bold text-purple-600">
                {dashboardData.performance_score}
              </p>
              <p className="text-sm text-gray-500">/100</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{width: `${dashboardData.performance_score}%`}}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Batch Information */}
            {dashboardData.batchInfo && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-accent mb-4 pb-2 border-b">Your Batch</h2>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="font-semibold">{dashboardData.batchInfo.batchName}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{dashboardData.batchInfo.schedule}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Teacher: {dashboardData.batchInfo.teacherName}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link to="/student/schedule" className="btn-secondary text-sm">
                    View Full Schedule →
                  </Link>
                </div>
              </div>
            )}

            {/* Recent Notices */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-accent mb-4 pb-2 border-b">Recent Notices</h2>
              <div className="space-y-4">
                {dashboardData.recentNotices.map((notice) => (
                  <div key={notice.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-accent">{notice.title}</p>
                      <p className="text-xs text-gray-500">{new Date(notice.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Link to="/notices" className="text-primary hover:text-primary-dark font-semibold text-sm">
                  View All Notices →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-accent mb-4 pb-2 border-b">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/student/attendance" className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span className="font-semibold text-gray-700">View Attendance</span>
                </Link>

                <Link to="/student/fees" className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="font-semibold text-gray-700">Pay Fees</span>
                </Link>

                <Link to="/student/resources" className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <svg className="w-6 h-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="font-semibold text-gray-700">Learning Resources</span>
                </Link>

                <Link to="/student/schedule" className="flex items-center p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                  <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-semibold text-gray-700">Class Schedule</span>
                </Link>
              </div>
            </div>

            {/* Upcoming Classes */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-accent mb-4 pb-2 border-b">Upcoming Classes</h2>
              <div className="space-y-4">
                {dashboardData.upcomingClasses.map((classItem, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-xs text-gray-600">
                        {new Date(classItem.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold text-primary">
                        {new Date(classItem.date).getDate()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-accent">{classItem.type}</p>
                      <p className="text-sm text-gray-600">{classItem.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
