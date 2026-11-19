import React, { useCallback, useEffect, useState } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import StarRating from '../components/StarRating';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import studentService from '../services/studentService';
import { useToast } from '../context/ToastContext';

const StudentReviews = () => {
  const toast = useToast();
  const [reviews, setReviews] = useState([]);
  const [filterMonth, setFilterMonth] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const rows = await studentService.getReviews();
      setReviews(rows.map((r) => ({ ...r, id: r.review_id, overall_rating: Number(r.overall_rating) })));
    } catch (err) {
      setError(err.message || 'Could not load your reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markAsViewed = async (reviewId) => {
    try {
      await studentService.markReviewViewed(reviewId);
      setReviews((list) => list.map((r) => (r.id === reviewId ? { ...r, is_viewed_by_student: true } : r)));
    } catch (err) {
      toast.error(err.message || 'Could not update the review.');
    }
  };

  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  const filteredReviews = filterMonth === 'all' 
    ? reviews 
    : reviews.filter(r => r.review_month === parseInt(filterMonth));

  const newReviewsCount = reviews.filter(r => !r.is_viewed_by_student).length;

  // Calculate average ratings
  const avgTechnique = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.technique_rating, 0) / reviews.length).toFixed(1) : 0;
  const avgRhythm = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rhythm_rating, 0) / reviews.length).toFixed(1) : 0;
  const avgCreativity = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.creativity_rating, 0) / reviews.length).toFixed(1) : 0;
  const avgDiscipline = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.discipline_rating, 0) / reviews.length).toFixed(1) : 0;

  if (loading) return <PageSkeleton label="Loading reviews..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="page">
      <div>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-title">
            Teacher Reviews
          </h1>
          <p className="text-gray-600">See what your teacher thinks about your progress</p>
        </div>

        {/* New Reviews Alert */}
        {newReviewsCount > 0 && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>You have {newReviewsCount} new review{newReviewsCount > 1 ? 's' : ''}!</strong> Check what your teacher has to say.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Overall Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <p className="text-sm text-gray-600 mb-2">Technique</p>
            <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-primary mb-2">{avgTechnique}</p>
            <StarRating rating={parseFloat(avgTechnique)} size="md" />
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-2">Rhythm</p>
            <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-green-700 mb-2">{avgRhythm}</p>
            <StarRating rating={parseFloat(avgRhythm)} size="md" color="gold" />
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-2">Creativity</p>
            <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-purple-700 mb-2">{avgCreativity}</p>
            <StarRating rating={parseFloat(avgCreativity)} size="md" color="orange" />
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-2">Discipline</p>
            <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-blue-700 mb-2">{avgDiscipline}</p>
            <StarRating rating={parseFloat(avgDiscipline)} size="md" />
          </div>
        </div>

        {/* Filter */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredReviews.length} of {reviews.length} reviews
            </p>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="input-field w-64"
            >
              <option value="all">All Months</option>
              {[...new Set(reviews.map((r) => r.review_month))].map((m) => (
                <option key={m} value={m}>
                  {getMonthName(m)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <div 
              key={review.id} 
              className={`card ${
                !review.is_viewed_by_student ? 'border-2 border-blue-300' : ''
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="section-title">
                      {getMonthName(review.review_month)} {review.review_year} Review
                    </h3>
                    {!review.is_viewed_by_student && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">by {review.teacher_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-primary">{review.overall_rating}</p>
                  <p className="text-xs text-gray-500">Overall Rating</p>
                </div>
              </div>

              {/* Rating Breakdown - USING StarRating Component */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Technique</p>
                  <StarRating rating={review.technique_rating} showNumber={true} size="md" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Rhythm</p>
                  <StarRating rating={review.rhythm_rating} showNumber={true} size="md" color="gold" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Creativity</p>
                  <StarRating rating={review.creativity_rating} showNumber={true} size="md" color="orange" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Discipline</p>
                  <StarRating rating={review.discipline_rating} showNumber={true} size="md" />
                </div>
              </div>

              {/* Teacher's Comments */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Teacher's Comments:</p>
                <div className="p-4 bg-sand-50 rounded-lg">
                  <p className="text-gray-700 italic">{review.review_text ? `"${review.review_text}"` : 'No written comments.'}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-xs text-gray-500">
                  Posted on {new Date(review.created_at).toLocaleDateString('en-IN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                {!review.is_viewed_by_student && (
                  <button
                    onClick={() => markAsViewed(review.id)}
                    className="btn-secondary text-sm"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State - USING EmptyState Component */}
        {filteredReviews.length === 0 && (
          <EmptyState 
            icon="star"
            title="No reviews found"
            description="No reviews match your selected filter. Try viewing all months."
            size="lg"
          />
        )}
      </div>
    </div>
  );
};

export default StudentReviews;
