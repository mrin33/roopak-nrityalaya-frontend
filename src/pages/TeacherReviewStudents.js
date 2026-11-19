import React, { useCallback, useEffect, useState } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import StarRating from '../components/StarRating';
import RollNumberBadge from '../components/RollNumberBadge';
import ErrorState from '../components/ErrorState';
import teacherService from '../services/teacherService';
import { useToast } from '../context/ToastContext';

const freshForm = () => ({
  reviewMonth: new Date().getMonth() + 1,
  reviewYear: new Date().getFullYear(),
  techniqueRating: 3,
  rhythmRating: 3,
  creativityRating: 3,
  disciplineRating: 3,
  reviewText: '',
});

const TeacherReviewStudents = () => {
  const toast = useToast();
  const [students, setStudents] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState(freshForm());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [studentRows, reviewRows] = await Promise.all([teacherService.getStudents(), teacherService.getReviews()]);
      const reviews = reviewRows.map((r) => ({ ...r, id: r.review_id }));
      // Most recent review period per student
      const latest = {};
      reviews.forEach((r) => {
        const key = r.review_year * 12 + r.review_month;
        if (!latest[r.student_id] || key > latest[r.student_id].key) latest[r.student_id] = { key, r };
      });
      setStudents(
        studentRows.map((st) => ({
          ...st,
          id: st.student_id,
          last_review_date: latest[st.student_id]
            ? `${latest[st.student_id].r.review_year}-${String(latest[st.student_id].r.review_month).padStart(2, '0')}-01`
            : null,
        }))
      );
      setMyReviews(reviews);
    } catch (err) {
      setError(err.message || 'Could not load your students');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenReview = (student) => {
    setSelectedStudent(student);
    setFormData(freshForm());
    setShowReviewModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (category, rating) => {
    setFormData((prev) => ({ ...prev, [category]: rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await teacherService.createReview({
        student_id: selectedStudent.id,
        review_month: parseInt(formData.reviewMonth, 10),
        review_year: parseInt(formData.reviewYear, 10),
        technique_rating: parseInt(formData.techniqueRating, 10),
        rhythm_rating: parseInt(formData.rhythmRating, 10),
        creativity_rating: parseInt(formData.creativityRating, 10),
        discipline_rating: parseInt(formData.disciplineRating, 10),
        review_text: formData.reviewText,
      });
      setShowReviewModal(false);
      toast.success(`Review saved for ${selectedStudent.full_name}. It is now visible on their Reviews page.`);
      loadData();
    } catch (err) {
      toast.error(err.message || 'Could not save the review.');
    } finally {
      setSaving(false);
    }
  };

  const renderStarSelector = (category) => (
    <StarRating
      rating={formData[category]}
      interactive={true}
      onChange={(value) => handleRatingChange(category, value)}
      size="lg"
    />
  );

  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  // A student needs a review when none exists for the current month.
  const needsReview = (student) => {
    if (!student.last_review_date) return true;
    const last = new Date(student.last_review_date);
    const now = new Date();
    return last.getFullYear() * 12 + last.getMonth() < now.getFullYear() * 12 + now.getMonth();
  };

  const studentsNeedingReview = students.filter(needsReview);

  if (loading) return <PageSkeleton label="Loading your students..." />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div className="page">
      <div>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-title">
            Review Students
          </h1>
          <p className="text-gray-600">Provide monthly feedback to help students improve</p>
        </div>

        {/* Alert for pending reviews */}
        {studentsNeedingReview.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-amber-500 p-4 mb-8 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">
                  <strong>{studentsNeedingReview.length} student{studentsNeedingReview.length > 1 ? 's' : ''} need{studentsNeedingReview.length === 1 ? 's' : ''} a review this month!</strong> Regular feedback helps students track their progress.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Total Students</p>
            <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-primary">{students.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Need Review</p>
            <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-amber-700">{studentsNeedingReview.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Reviews This Month</p>
            <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-green-700">
              {myReviews.filter(r => 
                r.review_month === new Date().getMonth() + 1 && 
                r.review_year === new Date().getFullYear()
              ).length}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
            <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-blue-700">{myReviews.length}</p>
          </div>
        </div>

        {/* My Students */}
        <div className="card mb-6">
          <h2 className="section-title mb-5 border-b border-sand-200 pb-3">My Students</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sand-50 border-b-2">
                <tr>
                  <th className="th">Roll No</th>
                  <th className="th">Student Name</th>
                  <th className="th">Level</th>
                  <th className="th">Batch</th>
                  <th className="th">Last Review</th>
                  <th className="th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                      No students are enrolled in your batches yet.
                    </td>
                  </tr>
                )}
                {students.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-sand-50">
                    <td>
                      <RollNumberBadge rollNumber={student.roll_number} />
                    </td>
                    <td className="px-6 py-4 font-semibold text-accent">{student.full_name}</td>
                    <td className="td text-gray-600">{student.level_name}</td>
                    <td className="td text-gray-600">{student.batch_name}</td>
                    <td className="px-6 py-4 text-sm">
                      {student.last_review_date ? (
                        <span className="text-gray-600">
                          {new Date(student.last_review_date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </span>
                      ) : (
                        <span className="text-amber-600 font-semibold">Never reviewed</span>
                      )}
                    </td>
                    <td className="td">
                      <button
                        onClick={() => handleOpenReview(student)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                          needsReview(student)
                            ? 'bg-primary text-white hover:bg-primary-dark'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {needsReview(student) ? 'Submit Review' : 'Add Review'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="card">
          <h2 className="section-title mb-5 border-b border-sand-200 pb-3">Recent Reviews</h2>
          
          {myReviews.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 text-lg">No reviews submitted yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myReviews.map((review) => (
                <div key={review.id} className="border border-sand-200 rounded-lg p-4 hover:shadow-lift transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-primary">{review.overall_rating}</span>
                        <span className="text-xs text-gray-600">Rating</span>
                      </div>
                      <div>
                        <p className="font-semibold text-accent">{review.student_name}</p>
                        <p className="text-sm text-gray-600">Roll No: {review.roll_number}</p>
                        <p className="text-sm text-gray-600">
                          {getMonthName(review.review_month)} {review.review_year}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        Submitted on {new Date(review.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Modal */}
        {showReviewModal && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-primary text-white p-6 rounded-t-2xl sticky top-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Monthly Review</h2>
                    <p className="text-sm text-white/80 mt-1">
                      {selectedStudent.full_name} ({selectedStudent.roll_number})
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowReviewModal(false)}
                    className="text-white hover:bg-white/20 rounded-full p-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  {/* Month and Year */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Review Month *</label>
                      <select
                        name="reviewMonth"
                        value={formData.reviewMonth}
                        onChange={handleChange}
                        className="input-field"
                        required
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                          <option key={month} value={month}>
                            {getMonthName(month)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Year *</label>
                      <select
                        name="reviewYear"
                        value={formData.reviewYear}
                        onChange={handleChange}
                        className="input-field"
                        required
                      >
                        {[0, 1].map((back) => {
                          const y = new Date().getFullYear() - back;
                          return (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  {/* Rating Categories */}
                  <div className="space-y-4 p-4 bg-sand-50 rounded-lg">
                    <h3 className="font-semibold text-accent mb-4">Rate Student Performance (1-5 Stars)</h3>
                    
                    <div>
                      <label className="form-label">
                        Technique Progress *
                      </label>
                      {renderStarSelector('techniqueRating')}
                      <p className="text-xs text-gray-500 mt-1">Footwork, hand gestures, body posture</p>
                    </div>

                    <div>
                      <label className="form-label">
                        Rhythm Understanding *
                      </label>
                      {renderStarSelector('rhythmRating')}
                      <p className="text-xs text-gray-500 mt-1">Taal mastery, layakari, tempo control</p>
                    </div>

                    <div>
                      <label className="form-label">
                        Creativity & Expression *
                      </label>
                      {renderStarSelector('creativityRating')}
                      <p className="text-xs text-gray-500 mt-1">Abhinaya, facial expressions, interpretation</p>
                    </div>

                    <div>
                      <label className="form-label">
                        Discipline & Attendance *
                      </label>
                      {renderStarSelector('disciplineRating')}
                      <p className="text-xs text-gray-500 mt-1">Regular practice, punctuality, dedication</p>
                    </div>
                  </div>

                  {/* Overall Rating Display */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900 mb-1">Overall Rating</p>
                    <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-blue-700">
                      {((parseInt(formData.techniqueRating) + 
                         parseInt(formData.rhythmRating) + 
                         parseInt(formData.creativityRating) + 
                         parseInt(formData.disciplineRating)) / 4).toFixed(2)} / 5.00
                    </p>
                  </div>

                  {/* Written Feedback */}
                  <div>
                    <label className="form-label">
                      Written Feedback *
                    </label>
                    <textarea
                      name="reviewText"
                      value={formData.reviewText}
                      onChange={handleChange}
                      rows="6"
                      className="input-field"
                      placeholder="Provide detailed feedback on the student's progress, strengths, and areas for improvement..."
                      required
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1">
                      This feedback will be visible to the student. Be constructive and encouraging!
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  <button 
                    type="button" 
                    onClick={() => setShowReviewModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                    {saving ? 'Saving…' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherReviewStudents;
