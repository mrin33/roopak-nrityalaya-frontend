import React, { useState } from 'react';

const NoticesPage = () => {
  // Placeholder data - will come from backend later
  const [notices] = useState([
    {
      id: 1,
      title: 'Annual Day 2026 - Registration Open',
      content: 'We are excited to announce that registration for our Annual Day performance is now open! All students are encouraged to participate. The event will be held on March 15, 2026. Please register by February 28, 2026.',
      postedDate: '2026-01-25',
      targetAudience: 'all',
      isActive: true,
      category: 'event'
    },
    {
      id: 2,
      title: 'February Fees Reminder',
      content: 'This is a reminder that fees for the month of February are due by February 5, 2026. Please ensure timely payment to avoid any disruption in classes. Online payment options are available through the student portal.',
      postedDate: '2026-01-28',
      targetAudience: 'students',
      isActive: true,
      category: 'fees'
    },
    {
      id: 3,
      title: 'New Batch Starting - Praveshika Pratham',
      content: 'A new beginner batch (Praveshika Pratham) will commence from February 10, 2026. Classes will be held on Monday, Wednesday, and Friday from 5:00 PM to 6:30 PM. Limited seats available. Contact admin for enrollment.',
      postedDate: '2026-01-20',
      targetAudience: 'all',
      isActive: true,
      category: 'admission'
    },
    {
      id: 4,
      title: 'Teacher Training Workshop - February 2026',
      content: 'A special workshop on teaching methodologies for Kathak will be conducted for all faculty members on February 18-19, 2026. This is a mandatory workshop. Please confirm your attendance with the admin.',
      postedDate: '2026-01-22',
      targetAudience: 'teachers',
      isActive: true,
      category: 'workshop'
    },
    {
      id: 5,
      title: 'Holiday Notice - Republic Day',
      content: 'The academy will remain closed on January 26, 2026 (Republic Day). Regular classes will resume from January 27, 2026. Wishing everyone a Happy Republic Day!',
      postedDate: '2026-01-24',
      targetAudience: 'all',
      isActive: true,
      category: 'holiday'
    },
    {
      id: 6,
      title: 'Examination Schedule - March 2026',
      content: 'Level examination for all students will be conducted in the first week of March 2026. Detailed schedule and syllabus will be shared with students by their respective teachers. Please prepare accordingly.',
      postedDate: '2026-01-18',
      targetAudience: 'students',
      isActive: true,
      category: 'examination'
    },
  ]);

  const [filterCategory, setFilterCategory] = useState('all');
  const categories = ['all', 'event', 'fees', 'admission', 'workshop', 'holiday', 'examination'];

  const filteredNotices = notices.filter(notice => {
    if (filterCategory === 'all') return true;
    return notice.category === filterCategory;
  });

  const getCategoryColor = (category) => {
    const colors = {
      event: 'bg-blue-100 text-blue-800',
      fees: 'bg-green-100 text-green-800',
      admission: 'bg-purple-100 text-purple-800',
      workshop: 'bg-yellow-100 text-yellow-800',
      holiday: 'bg-red-100 text-red-800',
      examination: 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'event':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'fees':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'admission':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        );
      case 'workshop':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        );
      case 'holiday':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'examination':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/20 to-secondary/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-primary mb-6">
            Notices & Announcements
          </h1>
          <div className="w-32 h-1 bg-secondary mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Stay updated with the latest news, announcements, and important information from Roopak Nrityalaya.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white shadow-sm sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all capitalize ${
                  filterCategory === category
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Notices List */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredNotices.length > 0 ? (
            <div className="space-y-6">
              {filteredNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-heading font-bold text-primary mb-2">
                        {notice.title}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Posted on {formatDate(notice.postedDate)}
                      </p>
                    </div>
                    <div className="ml-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold capitalize ${getCategoryColor(notice.category)}`}>
                        {getCategoryIcon(notice.category)}
                        {notice.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-700 leading-relaxed">
                      {notice.content}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      For: {notice.targetAudience === 'all' ? 'Everyone' : notice.targetAudience.charAt(0).toUpperCase() + notice.targetAudience.slice(1)}
                    </span>
                    {notice.isActive && (
                      <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full font-semibold">
                        ● Active
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 text-xl mb-2">No notices found</p>
              <p className="text-gray-400">Try adjusting your filter</p>
            </div>
          )}
        </div>
      </section>

      {/* Subscription Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-heading font-bold text-primary mb-4">
            Never Miss an Update
          </h2>
          <p className="text-gray-700 mb-6">
            Get important notices and announcements delivered to your email. Login to your student portal 
            to manage notification preferences.
          </p>
          <button className="btn-primary">
            Manage Notifications
          </button>
        </div>
      </section>
    </div>
  );
};

export default NoticesPage;
