import React, { useState, useEffect } from 'react';
import noticeService from '../services/noticeService';

const NoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  const categories = ['all', 'event', 'fees', 'admission', 'workshop', 'holiday', 'examination', 'general'];

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        // Will fetch published notices. We don't filter by target audience strictly here if it's the public page, 
        // but if someone is logged in we might. For now, get all public notices.
        const data = await noticeService.getNotices();
        setNotices(data);
      } catch (error) {
        setLoadError(error.message || 'Could not load notices.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

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
      general: 'bg-gray-100 text-gray-800'
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
      case 'general':
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
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
          {loading ? (
             <div className="text-center py-20">
               <svg className="animate-spin h-10 w-10 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               <p className="text-gray-500 text-xl">Loading notices...</p>
             </div>
          ) : loadError ? (
            <div className="text-center py-12 text-red-700" role="alert">{loadError}</div>
          ) : filteredNotices.length > 0 ? (
            <div className="space-y-6">
              {filteredNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-heading font-bold text-primary">
                          {notice.title}
                        </h2>
                        {notice.is_important && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                            Important
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        Posted on {formatDate(notice.created_at)}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold capitalize ${getCategoryColor(notice.category)}`}>
                        {getCategoryIcon(notice.category)}
                        {notice.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {notice.content}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      For: {notice.target_audience === 'all' ? 'Everyone' : notice.target_audience.charAt(0).toUpperCase() + notice.target_audience.slice(1)}
                    </span>
                    {notice.status === 'published' && (
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
