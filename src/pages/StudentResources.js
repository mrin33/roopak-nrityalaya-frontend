import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const StudentResources = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [filter, setFilter] = useState('all'); // all, video, audio, document

  const currentLevel = user?.profile?.current_level_id || 1;

  useEffect(() => {
    // TODO: Fetch real resources from API based on student's level
    setResources([
      {
        id: 1,
        title: 'Basic Footwork Techniques',
        type: 'video',
        level: 1,
        duration: '15:30',
        description: 'Learn fundamental footwork patterns for Praveshika Pratham',
        uploadedBy: 'Priya Sharma',
        thumbnail: null
      },
      {
        id: 2,
        title: 'Taal Introduction - Teen Taal',
        type: 'audio',
        level: 1,
        duration: '08:45',
        description: 'Understanding the 16-beat cycle of Teen Taal',
        uploadedBy: 'Rajesh Kumar',
        thumbnail: null
      },
      {
        id: 3,
        title: 'Hand Gestures (Hastak) Guide',
        type: 'document',
        level: 1,
        duration: null,
        description: 'Comprehensive PDF guide for basic hand movements',
        uploadedBy: 'Meera Iyer',
        thumbnail: null
      },
      {
        id: 4,
        title: 'Practice Session - Tatkar',
        type: 'video',
        level: 1,
        duration: '20:15',
        description: 'Follow along practice session for tatkar basics',
        uploadedBy: 'Priya Sharma',
        thumbnail: null
      },
    ]);
  }, [currentLevel]);

  const filteredResources = resources.filter(resource => {
    if (filter === 'all') return true;
    return resource.type === filter;
  });

  const getTypeIcon = (type) => {
    switch(type) {
      case 'video':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
        );
      case 'audio':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
          </svg>
        );
      case 'document':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'video': return 'text-red-600 bg-red-100';
      case 'audio': return 'text-blue-600 bg-blue-100';
      case 'document': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-2">
            Learning Resources
          </h1>
          <p className="text-gray-600">
            Access videos, audio files, and documents for Level {currentLevel} practice
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-md p-2 mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Resources
          </button>
          <button
            onClick={() => setFilter('video')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              filter === 'video'
                ? 'bg-red-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Videos
          </button>
          <button
            onClick={() => setFilter('audio')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              filter === 'audio'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Audio
          </button>
          <button
            onClick={() => setFilter('document')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              filter === 'document'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Documents
          </button>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
              {/* Thumbnail */}
              <div className={`h-48 bg-gradient-to-br ${
                resource.type === 'video' ? 'from-red-400 to-red-600' :
                resource.type === 'audio' ? 'from-blue-400 to-blue-600' :
                'from-green-400 to-green-600'
              } flex items-center justify-center`}>
                <div className="text-white">
                  {getTypeIcon(resource.type)}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getTypeColor(resource.type)}`}>
                    {resource.type}
                  </span>
                  {resource.duration && (
                    <span className="text-xs text-gray-500">{resource.duration}</span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-accent mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{resource.description}</p>

                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  {resource.uploadedBy}
                </div>

                <button className="w-full btn-primary">
                  {resource.type === 'document' ? 'Download' : 'Play Now'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-20">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-xl mb-2">No resources found</p>
            <p className="text-gray-400">Try selecting a different filter</p>
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">📚 How to Use Resources</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Videos and audio files can be streamed directly</li>
            <li>• Documents are available for download as PDFs</li>
            <li>• Practice regularly using these resources between classes</li>
            <li>• New resources are added monthly</li>
            <li>• Resources are specific to your current level</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentResources;
