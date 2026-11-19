import React, { useState, useEffect, useCallback } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import StarRating from '../components/StarRating';
import RollNumberBadge from '../components/RollNumberBadge';
import PerformanceGraph from '../components/PerformanceGraph';
import ErrorState from '../components/ErrorState';
import adminService from '../services/adminService';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    bestTeachers: [],
    bestStudents: [],
    enrollmentTrends: [],
    discontinuationReasons: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [bestTeachers, bestStudents, enrollmentTrends, discontinuationReasons] = await Promise.all([
        adminService.getBestTeachers(),
        adminService.getBestStudents(),
        adminService.getEnrollmentTrends(),
        adminService.getDiscontinuationReasons(),
      ]);
      setAnalytics({
        bestTeachers: bestTeachers.map((t) => ({ ...t, id: t.teacher_id, avg_rating: Number(t.avg_rating).toFixed(1) })),
        bestStudents,
        enrollmentTrends,
        discontinuationReasons,
      });
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) return <PageSkeleton label="Loading analytics..." />;
  if (error) return <ErrorState message={error} onRetry={fetchAnalytics} />;

  const maxEnrolled = Math.max(5, ...analytics.enrollmentTrends.map((t) => t.enrolled));
  const maxReason = Math.max(1, ...analytics.discontinuationReasons.map((r) => r.count));


  return (
    <div className="page">
      <div>
        
        <div className="mb-8">
          <h1 className="page-title">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">Insights and performance metrics</p>
        </div>

        {/* Best Teachers */}
        <div className="card mb-6">
          <h2 className="section-title mb-5 border-b border-sand-200 pb-3">🏆 Top Performing Teachers</h2>
          {analytics.bestTeachers.length === 0 && (
            <p className="text-gray-500 text-center py-6">No active teachers yet.</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analytics.bestTeachers.map((teacher, index) => (
              <div key={teacher.id} className={`p-6 rounded-xl border-2 ${
                index === 0 ? 'border-amber-400 bg-yellow-50' :
                index === 1 ? 'border-gray-400 bg-sand-50' :
                'border-orange-400 bg-orange-50'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-4xl font-bold ${
                    index === 0 ? 'text-amber-600' :
                    index === 1 ? 'text-gray-600' :
                    'text-orange-600'
                  }`}>
                    #{index + 1}
                  </span>
                  <StarRating rating={teacher.avg_rating} size="sm" />
                </div>
                <h3 className="text-xl font-bold text-accent mb-2">{teacher.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Rating: <span className="font-semibold text-primary">{teacher.avg_rating}/5.0</span></p>
                  <p>Students: <span className="font-semibold">{teacher.total_students}</span></p>
                  <p>Experience: <span className="font-semibold">{teacher.experience_years} years</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Students */}
        <div className="card mb-6">
          <h2 className="section-title mb-5 border-b border-sand-200 pb-3">⭐ Top Performing Students</h2>
          <p className="text-sm text-gray-500 mb-4">
            Score = average teacher review × 20; attendance over the last 90 days.
          </p>
          {analytics.bestStudents.length === 0 && (
            <p className="text-gray-500 text-center py-6">No active students yet.</p>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sand-50 border-b-2">
                <tr>
                  <th className="th">Rank</th>
                  <th className="th">Roll No</th>
                  <th className="th">Student Name</th>
                  <th className="th">Performance Score</th>
                  <th className="th">Attendance</th>
                  <th className="th">Practice Hours</th>
                </tr>
              </thead>
              <tbody>
                {analytics.bestStudents.map((student, index) => (
                  <tr key={student.roll_number} className={`border-b hover:bg-sand-50 ${index < 3 ? 'bg-yellow-50/30' : ''}`}>
                    <td className="td">
                      <span className={`text-lg font-bold ${
                        index === 0 ? 'text-amber-600' :
                        index === 1 ? 'text-gray-600' :
                        index === 2 ? 'text-orange-600' :
                        'text-gray-400'
                      }`}>
                        #{index + 1}
                      </span>
                    </td>
                    <td className="td">
                      <RollNumberBadge rollNumber={student.roll_number} />
                    </td>
                    <td className="px-6 py-4 font-semibold text-accent">{student.name}</td>
                    <td className="td">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-purple-600">{student.performance_score}</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full"
                            style={{width: `${student.performance_score}%`}}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="td">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        {student.attendance}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">{student.practice_hours}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Enrollment Trends */}
          <PerformanceGraph 
            data={analytics.enrollmentTrends.map(t => ({
              label: t.month,
              value: t.enrolled
            }))}
            title="Enrollment Trends"
            maxValue={maxEnrolled}
            color="primary"
            height={250}
          />

          {/* Discontinuation Reasons */}
          <div className="card">
            <h2 className="section-title mb-5 border-b border-sand-200 pb-3">📊 Discontinuation Reasons</h2>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600">Total Discontinuations</p>
              <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-red-700">
                {analytics.discontinuationReasons.reduce((sum, r) => sum + r.count, 0)}
              </p>
            </div>

            <div className="space-y-4">
              {analytics.discontinuationReasons.length === 0 && (
                <p className="text-gray-500 text-center py-6">No discontinuations recorded.</p>
              )}
              {analytics.discontinuationReasons.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-700">{item.reason}</span>
                    <span className="text-sm font-bold text-red-600">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-red-500 h-3 rounded-full transition-all"
                      style={{width: `${(item.count / maxReason) * 100}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
