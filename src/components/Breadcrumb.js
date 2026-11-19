import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Mapping for better display names
  const nameMap = {
    'student': 'Student Portal',
    'teacher': 'Teacher Portal',
    'admin': 'Admin Panel',
    'dashboard': 'Dashboard',
    'attendance': 'Attendance',
    'fees': 'Fee Management',
    'activity-log': 'Activity Log',
    'reviews': 'Reviews',
    'gallery-upload': 'Gallery Upload',
    'makeup-classes': 'Makeup Classes',
    'resources': 'Resources',
    'schedule': 'Schedule',
    'students': 'Students',
    'batches': 'Batches',
    'review-students': 'Review Students',
    'batch-transfer': 'Batch Transfer',
    'profile': 'Profile',
    'teachers': 'Teachers',
    'gallery-requests': 'Gallery Requests',
    'analytics': 'Analytics',
    'status-changes': 'Status Changes',
    'notices': 'Notices',
    'gallery': 'Gallery',
    'messages': 'Messages',
    'makeup-requests': 'Makeup Requests'
  };

  return (
    <div className="bg-white border-b py-3 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <nav className="flex items-center space-x-2 text-sm">
          <Link to="/" className="text-gray-500 hover:text-primary transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>

          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const displayName = nameMap[name] || name.charAt(0).toUpperCase() + name.slice(1);

            return (
              <React.Fragment key={name}>
                <span className="text-gray-400">/</span>
                {isLast ? (
                  <span className="text-primary font-semibold">{displayName}</span>
                ) : (
                  <Link
                    to={routeTo}
                    className="text-gray-500 hover:text-primary transition-colors"
                  >
                    {displayName}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;
