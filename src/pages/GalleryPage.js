import React, { useCallback, useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import publicService from '../services/publicService';

const GalleryPage = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const rows = await publicService.getGallery();
      setGalleryItems(
        rows.map((g) => ({
          id: g.id,
          type: g.media_type,
          eventName: g.category || 'General',
          year: g.year,
          caption: g.title,
          description: g.description,
          url: publicService.mediaUrl(g.media_url),
        }))
      );
    } catch (err) {
      setError(err.message || 'Could not load the gallery');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const [yearFilter, setYearFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [mediaFilter, setMediaFilter] = useState('all'); // 'all', 'photo', 'video'

  // Get unique years and events
  const years = ['all', ...new Set(galleryItems.map(item => item.year))].sort().reverse();
  const events = ['all', ...new Set(galleryItems.map(item => item.eventName))];

  // Filter items
  const filteredItems = galleryItems.filter(item => {
    const yearMatch = yearFilter === 'all' || item.year === parseInt(yearFilter);
    const eventMatch = eventFilter === 'all' || item.eventName === eventFilter;
    const mediaMatch = mediaFilter === 'all' || item.type === mediaFilter;
    return yearMatch && eventMatch && mediaMatch;
  });

  if (loading) return <LoadingSpinner fullScreen={true} text="Loading gallery..." size="lg" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/20 to-secondary/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-primary mb-6">
            Event Gallery
          </h1>
          <div className="w-32 h-1 bg-secondary mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Relive the magic of our performances, workshops, and cultural events through 
            our collection of photos and videos.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white shadow-md md:sticky md:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Year Filter */}
            <div>
              <label className="block text-sm font-semibold text-accent mb-2">
                Filter by Year
              </label>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="input-field"
              >
                {years.map(year => (
                  <option key={year} value={year}>
                    {year === 'all' ? 'All Years' : year}
                  </option>
                ))}
              </select>
            </div>

            {/* Event Filter */}
            <div>
              <label className="block text-sm font-semibold text-accent mb-2">
                Filter by Event
              </label>
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="input-field"
              >
                {events.map(event => (
                  <option key={event} value={event}>
                    {event === 'all' ? 'All Events' : event}
                  </option>
                ))}
              </select>
            </div>

            {/* Media Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-accent mb-2">
                Media Type
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setMediaFilter('all')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    mediaFilter === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setMediaFilter('photo')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    mediaFilter === 'photo'
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Photos
                </button>
                <button
                  onClick={() => setMediaFilter('video')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    mediaFilter === 'video'
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Videos
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-center text-sm text-gray-600">
            Showing {filteredItems.length} of {galleryItems.length} items
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  {/* Media Container */}
                  <div className="relative h-64 bg-gradient-to-br from-primary/20 to-secondary/20">
                    {item.url ? (
                      item.type === 'photo' ? (
                        <img
                          loading="lazy"
                          src={item.url}
                          alt={item.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                          controls
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {item.type === 'photo' ? (
                          <div className="text-center">
                            <svg className="w-20 h-20 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-500 mt-2">Photo</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <svg className="w-20 h-20 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-500 mt-2">Video</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Media Type Badge */}
                    <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase">
                      {item.type}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                      <button className="opacity-0 group-hover:opacity-100 bg-white text-primary px-6 py-2 rounded-lg font-semibold transform scale-75 group-hover:scale-100 transition-all duration-300">
                        View Full
                      </button>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-accent mb-1">
                      {item.eventName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{item.year}</p>
                    <p className="text-sm text-gray-700">{item.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 text-xl mb-2">No items found</p>
              <p className="text-gray-400">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </section>

      {/* Upload Section (Admin Only - placeholder) */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-heading font-bold text-primary mb-4">
            Share Your Memories
          </h2>
          <p className="text-gray-700 mb-6">
            Have photos or videos from our events? Contact our admin team to contribute to the gallery.
          </p>
          <button className="btn-secondary">
            Contact Admin
          </button>
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;
