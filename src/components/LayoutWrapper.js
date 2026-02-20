import React from 'react';
import { useAuth } from '../context/AuthContext';
import StudentSidebar from './StudentSidebar';
import TeacherSidebar from './TeacherSidebar';
import AdminSidebar from './AdminSidebar';
import Breadcrumb from './Breadcrumb';

const LayoutWrapper = ({ children }) => {
  const { user } = useAuth();

  // Determine which sidebar to show
  const renderSidebar = () => {
    if (!user) return null;

    switch (user.role) {
      case 'student':
        return <StudentSidebar />;
      case 'teacher':
        return <TeacherSidebar />;
      case 'admin':
        return <AdminSidebar />;
      default:
        return null;
    }
  };

  const hasSidebar = user && ['student', 'teacher', 'admin'].includes(user.role);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar is always present (rendered in App.js) */}
      
      {/* Sidebar (only for logged-in users with role) */}
      {renderSidebar()}

      {/* Main Content */}
      <div className={`pt-16 ${hasSidebar ? 'lg:pl-64' : ''}`}>
        {/* Breadcrumb (only for portal pages) */}
        {hasSidebar && <Breadcrumb />}
        
        {/* Page Content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutWrapper;
