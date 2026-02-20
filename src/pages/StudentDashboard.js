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
    roll_number: 'PP15',
    payment_window: 'quarterly',
    discount: 2,
    next_due_date: '2026-02-25',
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
    // TODO: Fetch dashboard data from API
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
      roll_number: 'PP15',
      payment_window: 'quarterly',
      discount: 2,
      next_due_date: '2026-02-25',
      has_late_fee: false,
      late_fee_amount: 0,
      performance_score: 87
    });
  }, []);

  // Helper function to calculate days until due date
  const calculateDaysUntilDue = (dueDate) => {
    if (!dueDate) return 0;
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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

        {/* Late Fee Warning - Using LateFeeWarning Component */}
        <LateFeeWarning 
          hasLateFee={dashboardData.has_late_fee}
          lateFeeAmount={dashboardData.late_fee_amount}
          daysUntilLateFee={calculateDaysUntilDue(dashboardData.next_due_date)}
          nextDueDate={dashboardData.next_due_date}
          variant="banner"
        />

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Roll Number Card - Using RollNumberBadge Component */}
          <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-3">Roll Number</p>
            <RollNumberBadge 
              rollNumber={dashboardData.roll_number} 
              size="lg" 
              showFull={false} 
            />
            <p className="text-xs text-gray-500 mt-2">Auto-assigned</p>
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

          {/* Payment Plan Info - Using PaymentWindowBadge Component */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
            <p className="text-sm font-semibold text-gray-600 mb-3">Payment Plan</p>
            <PaymentWindowBadge 
              paymentWindow={dashboardData.payment_window}
              discount={dashboardData.discount}
              size="lg"
            />
            <p className="text-xs text-gray-500 mt-2">Next due: {new Date(dashboardData.next_due_date).toLocaleDateString()}</p>
          </div>

          {/* Performance Score Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Performance</h3>
              <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-accent">{dashboardData.performance_score}</p>
            <p className="text-xs text-gray-500 mt-1">Overall Score</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Batch Information */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-accent mb-4 pb-2 border-b">Your Batch</h2>
              
              {dashboardData.batchInfo ? (
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-primary mb-1">
                        {dashboardData.batchInfo.batchName}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">{dashboardData.batchInfo.schedule}</p>
                      <p className="text-sm text-gray-500">
                        Teacher: <span className="font-semibold text-accent">{dashboardData.batchInfo.teacherName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-accent mb-2">Upcoming Classes</h4>
                    <div className="space-y-2">
                      {dashboardData.upcomingClasses.map((cls, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">
                            {new Date(cls.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                          <span className="text-gray-600">{cls.time}</span>
                          <span className="text-primary font-semibold">{cls.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No batch assigned yet</p>
              )}
            </div>

            {/* Recent Notices */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <h2 className="text-2xl font-bold text-accent">Recent Notices</h2>
                <Link to="/notices" className="text-primary hover:text-primary-dark font-semibold text-sm">
                  View All →
                </Link>
              </div>
              
              <div className="space-y-4">
                {dashboardData.recentNotices.map((notice) => (
                  <div key={notice.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                    <div className="flex-1">
                      <p className="font-semibold text-accent">{notice.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notice.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-accent mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/student/attendance" className="block w-full bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold text-center">
                  📊 View Attendance
                </Link>
                <Link to="/student/fees" className="block w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold text-center">
                  💳 Pay Fees
                </Link>
                <Link to="/student/activity-log" className="block w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-center">
                  ✍️ Log Activity
                </Link>
                <Link to="/student/resources" className="block w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold text-center">
                  📚 Resources
                </Link>
              </div>
            </div>

            {/* Fee Status Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-accent mb-4">Fee Status</h2>
              <div className="text-center">
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-3 ${
                  dashboardData.feeStatus === 'paid' ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  {dashboardData.feeStatus === 'paid' ? (
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <p className={`text-lg font-bold ${
                  dashboardData.feeStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {dashboardData.feeStatus === 'paid' ? 'All Paid!' : 'Payment Pending'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {dashboardData.feeStatus === 'paid' 
                    ? 'You are all up to date' 
                    : 'Please complete your payment'}
                </p>
                {dashboardData.feeStatus !== 'paid' && (
                  <Link to="/student/fees" className="inline-block mt-3 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold">
                    Pay Now
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
