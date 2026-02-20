import React, { useState, useEffect } from 'react';
import StarRating from '../components/StarRating';
import RollNumberBadge from '../components/RollNumberBadge';
import PerformanceGraph from '../components/PerformanceGraph';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    bestTeachers: [],
    bestStudents: [],
    enrollmentTrends: [],
    discontinuationReasons: []
  });

  useEffect(() => {
    // TODO: Fetch analytics from API
    setAnalytics({
      bestTeachers: [
        { id: 1, name: 'Priya Sharma', avg_rating: 4.7, total_students: 28, experience_years: 8 },
        { id: 2, name: 'Rajesh Kumar', avg_rating: 4.5, total_students: 25, experience_years: 6 },
        { id: 3, name: 'Meera Iyer', avg_rating: 4.3, total_students: 20, experience_years: 5 }
      ],
      bestStudents: [
        { roll_number: 'VP1', name: 'Sneha Gupta', performance_score: 95, attendance: 98, practice_hours: 180 },
        { roll_number: 'MP1', name: 'Priya Patel', performance_score: 92, attendance: 95, practice_hours: 165 },
        { roll_number: 'PP1', name: 'Riya Sharma', performance_score: 90, attendance: 92, practice_hours: 155 },
        { roll_number: 'VM1', name: 'Anita Desai', performance_score: 88, attendance: 90, practice_hours: 150 },
        { roll_number: 'PP2', name: 'Amit Kumar', performance_score: 87, attendance: 88, practice_hours: 145 }
      ],
      enrollmentTrends: [
        { month: 'Sep 2025', enrolled: 45 },
        { month: 'Oct 2025', enrolled: 52 },
        { month: 'Nov 2025', enrolled: 58 },
        { month: 'Dec 2025', enrolled: 60 },
        { month: 'Jan 2026', enrolled: 65 }
      ],
      discontinuationReasons: [
        { reason: 'Relocation', count: 5 },
        { reason: 'Health Issues', count: 3 },
        { reason: 'Financial Constraints', count: 2 },
        { reason: 'Time Constraints', count: 4 },
        { reason: 'Other', count: 1 }
      ]
    });
  }, []);

  
  const totalEnrollments = analytics.enrollmentTrends.reduce((sum, t) => sum + t.enrolled, 0);
  const avgEnrollment = analytics.enrollmentTrends.length > 0 
    ? (totalEnrollments / analytics.enrollmentTrends.length).toFixed(0)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">Insights and performance metrics</p>
        </div>

        {/* Best Teachers */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b">🏆 Top Performing Teachers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analytics.bestTeachers.map((teacher, index) => (
              <div key={teacher.id} className={`p-6 rounded-xl border-2 ${
                index === 0 ? 'border-yellow-400 bg-yellow-50' :
                index === 1 ? 'border-gray-400 bg-gray-50' :
                'border-orange-400 bg-orange-50'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-4xl font-bold ${
                    index === 0 ? 'text-yellow-600' :
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
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b">⭐ Top Performing Students</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Roll No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Student Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Performance Score</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Attendance</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Practice Hours</th>
                </tr>
              </thead>
              <tbody>
                {analytics.bestStudents.map((student, index) => (
                  <tr key={student.roll_number} className={`border-b hover:bg-gray-50 ${index < 3 ? 'bg-yellow-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      <span className={`text-lg font-bold ${
                        index === 0 ? 'text-yellow-600' :
                        index === 1 ? 'text-gray-600' :
                        index === 2 ? 'text-orange-600' :
                        'text-gray-400'
                      }`}>
                        #{index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <RollNumberBadge rollNumber={student.roll_number} />
                    </td>
                    <td className="px-6 py-4 font-semibold text-accent">{student.name}</td>
                    <td className="px-6 py-4">
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
                    <td className="px-6 py-4">
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
            maxValue={70}
            color="primary"
            height={250}
          />

          {/* Discontinuation Reasons */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b">📊 Discontinuation Reasons</h2>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600">Total Discontinuations</p>
              <p className="text-3xl font-bold text-red-600">
                {analytics.discontinuationReasons.reduce((sum, r) => sum + r.count, 0)}
              </p>
            </div>

            <div className="space-y-4">
              {analytics.discontinuationReasons.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-700">{item.reason}</span>
                    <span className="text-sm font-bold text-red-600">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-red-500 h-3 rounded-full transition-all"
                      style={{width: `${(item.count / 5) * 100}%`}}
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
