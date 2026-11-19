import React, { useState, useEffect, useCallback } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import { Link } from 'react-router-dom';
import ErrorState from '../components/ErrorState';
import adminService from '../services/adminService';

const sameMonth = (dateStr, ref) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
};

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalBatches: 0,
    pendingFees: 0,
    recentRegistrations: [],
    feeCollection: {
      thisMonth: 0,
      lastMonth: 0,
      pending: 0
    },
    levelDistribution: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
      try {
        setLoading(true);
        setError(null);
        const [stats, students, fees, attendance] = await Promise.all([
          adminService.getDashboard(),
          adminService.getAllStudents(),
          adminService.getAllFees(),
          adminService.getAttendanceSummary(),
        ]);

        const now = new Date();
        const lastMonthRef = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const paid = fees.filter((f) => f.payment_status === 'paid');
        const outstanding = fees.filter((f) => f.payment_status === 'pending' || f.payment_status === 'overdue');
        const att = attendance.reduce(
          (acc, b) => ({
            present: acc.present + b.total_present,
            marked: acc.marked + b.total_present + b.total_absent + b.total_late,
          }),
          { present: 0, marked: 0 }
        );

        // Process recent registrations
        const recentRegistrations = [...students]
          .sort((a, b) => new Date(b.enrollment_date || 0) - new Date(a.enrollment_date || 0))
          .slice(0, 3)
          .map(s => ({
            id: s.student_id,
            name: s.full_name,
            level: s.level_name || 'Unassigned',
            date: s.enrollment_date
          }));

        // Process level distribution
        const levelCounts = {};
        students.forEach(s => {
          if (s.level_name) {
            levelCounts[s.level_name] = (levelCounts[s.level_name] || 0) + 1;
          }
        });
        const levelDistribution = Object.entries(levelCounts).map(([level, count]) => ({
          level,
          count
        }));

        setDashboardData({
          totalStudents: stats.total_students || 0,
          totalTeachers: stats.total_teachers || 0,
          totalBatches: stats.total_batches || 0,
          pendingFees: outstanding.length,
          overduePayments: stats.overdue_payments || 0,
          pendingGalleryRequests: stats.pending_gallery_requests || 0,
          unreadMessages: stats.unread_messages || 0,
          recentRegistrations,
          feeCollection: {
            thisMonth: stats.monthly_revenue || 0,
            lastMonth: paid
              .filter((f) => sameMonth(f.payment_date, lastMonthRef))
              .reduce((s, f) => s + Number(f.total_amount || 0), 0),
            pending: outstanding.reduce((s, f) => s + Number(f.total_amount || 0), 0),
          },
          attendanceRate: att.marked ? Math.round((att.present / att.marked) * 100) : null,
          feeCollectionRate: fees.length ? Math.round((paid.length / fees.length) * 100) : null,
          levelDistribution
        });
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) return <PageSkeleton label="Loading dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={fetchDashboardData} />;

  return (
    <div className="page">
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-title">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage your academy - Overview and quick actions</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Students</p>
                <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-primary">{dashboardData.totalStudents}</p>
                <p className="text-xs text-green-600 mt-1">+12 this month</p>
              </div>
              <svg className="w-14 h-14 text-primary/20" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Teachers</p>
                <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-green-700">{dashboardData.totalTeachers}</p>
                <p className="text-xs text-gray-500 mt-1">Active faculty</p>
              </div>
              <svg className="w-14 h-14 text-green-500/20" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Batches</p>
                <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-blue-700">{dashboardData.totalBatches}</p>
                <p className="text-xs text-gray-500 mt-1">All levels</p>
              </div>
              <svg className="w-14 h-14 text-blue-500/20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Fees</p>
                <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-amber-700">{dashboardData.pendingFees}</p>
                <p className="text-xs text-red-600 mt-1">
                  {dashboardData.overduePayments ? `${dashboardData.overduePayments} overdue` : 'None overdue'}
                </p>
              </div>
              <svg className="w-14 h-14 text-amber-500/20" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Fee Collection Summary */}
        <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Fee Collection Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-white/70 text-sm mb-1">This Month</p>
              <p className="text-3xl font-bold">₹{dashboardData.feeCollection.thisMonth.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-white/70 text-sm mb-1">Last Month</p>
              <p className="text-3xl font-bold">₹{dashboardData.feeCollection.lastMonth.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-white/70 text-sm mb-1">Pending</p>
              <p className="text-3xl font-bold text-amber-300">₹{dashboardData.feeCollection.pending.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Management Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Management Actions */}
            <div className="card">
              <h2 className="text-2xl font-bold text-accent mb-6 pb-4 border-b">Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/admin/students" className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl hover:shadow-lift transition-all">
                  <svg className="w-12 h-12 text-primary mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <h3 className="font-bold text-accent mb-1">Manage Students</h3>
                  <p className="text-sm text-gray-600">Add, edit, view all students</p>
                </Link>

                <Link to="/admin/teachers" className="p-6 bg-gradient-to-br from-green-100 to-green-50 rounded-xl hover:shadow-lift transition-all">
                  <svg className="w-12 h-12 text-green-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                  <h3 className="font-bold text-accent mb-1">Manage Teachers</h3>
                  <p className="text-sm text-gray-600">Add, edit, view all teachers</p>
                </Link>

                <Link to="/admin/batches" className="p-6 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl hover:shadow-lift transition-all">
                  <svg className="w-12 h-12 text-blue-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="font-bold text-accent mb-1">Manage Batches</h3>
                  <p className="text-sm text-gray-600">Create and organize classes</p>
                </Link>

                <Link to="/admin/fees" className="p-6 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl hover:shadow-lift transition-all">
                  <svg className="w-12 h-12 text-amber-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="font-bold text-accent mb-1">Fee Management</h3>
                  <p className="text-sm text-gray-600">Track payments and dues</p>
                </Link>

                <Link to="/admin/notices" className="p-6 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl hover:shadow-lift transition-all">
                  <svg className="w-12 h-12 text-purple-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                  <h3 className="font-bold text-accent mb-1">Post Notices</h3>
                  <p className="text-sm text-gray-600">Announcements for all</p>
                </Link>

                <Link to="/admin/gallery" className="p-6 bg-gradient-to-br from-red-100 to-red-50 rounded-xl hover:shadow-lift transition-all">
                  <svg className="w-12 h-12 text-red-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="font-bold text-accent mb-1">Gallery Management</h3>
                  <p className="text-sm text-gray-600">Upload event photos/videos</p>
                </Link>
              </div>
            </div>

            {/* Recent Registrations */}
            <div className="card">
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <h2 className="section-title">Recent Registrations</h2>
                <Link to="/admin/students" className="text-sm text-primary hover:text-primary-dark">
                  View All →
                </Link>
              </div>
              <div className="space-y-3">
                {dashboardData.recentRegistrations.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-6">No students enrolled yet.</p>
                )}
                {dashboardData.recentRegistrations.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 bg-sand-50 rounded-lg hover:bg-sand-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">{student.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-accent">{student.name}</p>
                        <p className="text-xs text-gray-600">{student.level}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {student.date ? new Date(student.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Level Distribution & Quick Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Level Distribution */}
            <div className="card">
              <h2 className="text-xl font-bold text-accent mb-6 pb-4 border-b">Student Distribution</h2>
              <div className="space-y-3">
                {dashboardData.levelDistribution.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.level}</span>
                      <span className="text-sm font-bold text-primary">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(item.count / dashboardData.totalStudents) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Stats */}
            <div className="card">
              <h2 className="text-xl font-bold text-accent mb-4 pb-2 border-b">System Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Students</span>
                  <span className="font-bold text-green-600">{dashboardData.totalStudents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Teachers</span>
                  <span className="font-bold text-blue-600">{dashboardData.totalTeachers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Running Batches</span>
                  <span className="font-bold text-purple-600">{dashboardData.totalBatches}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-sm text-gray-600">Attendance Rate</span>
                  <span className="font-bold text-primary">
                    {dashboardData.attendanceRate === null ? 'No data yet' : `${dashboardData.attendanceRate}%`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Fee Collection Rate</span>
                  <span className="font-bold text-primary">
                    {dashboardData.feeCollectionRate === null ? 'No data yet' : `${dashboardData.feeCollectionRate}%`}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Reports */}
            <div className="bg-gradient-to-br from-secondary/20 to-primary/20 rounded-xl shadow-lg p-6">
              <h2 className="section-title mb-4">Needs attention</h2>
              <div className="space-y-2">
                <Link to="/admin/gallery-requests" className="block text-sm text-primary hover:text-primary-dark hover:underline">
                  → Gallery requests awaiting review ({dashboardData.pendingGalleryRequests})
                </Link>
                <Link to="/admin/messages" className="block text-sm text-primary hover:text-primary-dark hover:underline">
                  → Unread contact messages ({dashboardData.unreadMessages})
                </Link>
                <Link to="/admin/fees" className="block text-sm text-primary hover:text-primary-dark hover:underline">
                  → Fee records
                </Link>
                <Link to="/admin/analytics" className="block text-sm text-primary hover:text-primary-dark hover:underline">
                  → Performance analytics
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
