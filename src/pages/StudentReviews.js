import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const StudentReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [filterMonth, setFilterMonth] = useState('all');

  useEffect(() => {
    // TODO: Fetch teacher reviews from API
    setReviews([
      {
        id: 1,
        teacher_name: 'Priya Sharma',
        review_month: 1,
        review_year: 2026,
        technique_rating: 4,
        rhythm_rating: 5,
        creativity_rating: 4,
        discipline_rating: 5,
        overall_rating: 4.5,
        review_text: 'Excellent progress in footwork. Keep practicing taal patterns. Your dedication is showing great results!',
        is_viewed_by_student: false,
        created_at: '2026-02-01T10:00:00'
      },
      {
        id: 2,
        teacher_name: 'Priya Sharma',
        review_month: 12,
        review_year: 2025,
        technique_rating: 3,
        rhythm_rating: 4,
        creativity_rating: 4,
        discipline_rating: 4,
        overall_rating: 3.75,
        review_text: 'Good improvement from last month. Focus more on hand gestures and facial expressions.',
        is_viewed_by_student: true,
        created_at: '2026-01-02T10:00:00'
      },
      {
        id: 3,
        teacher_name: 'Priya Sharma',
        review_month: 11,
        review_year: 2025,
        technique_rating: 3,
        rhythm_rating: 3,
        creativity_rating: 3,
        discipline_rating: 4,
        overall_rating: 3.25,
        review_text: 'Need to work on basic footwork consistency. Practice daily for better results.',
        is_viewed_by_student: true,
        created_at: '2025-12-01T10:00:00'
      }
    ]);
  }, []);

  const markAsViewed = (reviewId) => {
    setReviews(reviews.map(r => 
      r.id === reviewId ? { ...r, is_viewed_by_student: true } : r
    ));
    // TODO: API call to mark review as viewed
  };

  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  const renderStars = (rating) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const filteredReviews = filterMonth === 'all' 
    ? reviews 
    : reviews.filter(r => r.review_month === parseInt(filterMonth));

  const newReviewsCount = reviews.filter(r => !r.is_viewed_by_student).length;

  // Calculate average ratings
  const avgTechnique = (reviews.reduce((sum, r) => sum + r.technique_rating, 0) / reviews.length).toFixed(1);
  const avgRhythm = (reviews.reduce((sum, r) => sum + r.rhythm_rating, 0) / reviews.length).toFixed(1);
  const avgCreativity = (reviews.reduce((sum, r) => sum + r.creativity_rating, 0) / reviews.length).toFixed(1);
  const avgDiscipline = (reviews.reduce((sum, r) => sum + r.discipline_rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-2">
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
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-2">Technique</p>
            <p className="text-3xl font-bold text-primary mb-2">{avgTechnique}</p>
            {renderStars(Math.round(parseFloat(avgTechnique)))}
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-2">Rhythm</p>
            <p className="text-3xl font-bold text-green-600 mb-2">{avgRhythm}</p>
            {renderStars(Math.round(parseFloat(avgRhythm)))}
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-2">Creativity</p>
            <p className="text-3xl font-bold text-purple-600 mb-2">{avgCreativity}</p>
            {renderStars(Math.round(parseFloat(avgCreativity)))}
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-2">Discipline</p>
            <p className="text-3xl font-bold text-blue-600 mb-2">{avgDiscipline}</p>
            {renderStars(Math.round(parseFloat(avgDiscipline)))}
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
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
              <option value="1">January 2026</option>
              <option value="12">December 2025</option>
              <option value="11">November 2025</option>
              <option value="10">October 2025</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <div 
              key={review.id} 
              className={`bg-white rounded-xl shadow-lg p-6 ${
                !review.is_viewed_by_student ? 'border-2 border-blue-300' : ''
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="text-xl font-bold text-accent">
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
                  <p className="text-3xl font-bold text-primary">{review.overall_rating}</p>
                  <p className="text-xs text-gray-500">Overall Rating</p>
                </div>
              </div>

              {/* Rating Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Technique</p>
                  {renderStars(review.technique_rating)}
                  <p className="text-xs text-gray-500 mt-1">{review.technique_rating}/5</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Rhythm</p>
                  {renderStars(review.rhythm_rating)}
                  <p className="text-xs text-gray-500 mt-1">{review.rhythm_rating}/5</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Creativity</p>
                  {renderStars(review.creativity_rating)}
                  <p className="text-xs text-gray-500 mt-1">{review.creativity_rating}/5</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Discipline</p>
                  {renderStars(review.discipline_rating)}
                  <p className="text-xs text-gray-500 mt-1">{review.discipline_rating}/5</p>
                </div>
              </div>

              {/* Teacher's Comments */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Teacher's Comments:</p>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 italic">"{review.review_text}"</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-xs text-gray-500">
                  Posted on {new Date(review.created_at).toLocaleDateString('en-US', { 
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

        {filteredReviews.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-lg">No reviews found for the selected month</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentReviews;
