import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ConfirmProvider } from './context/ConfirmContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './components/layout/PublicLayout';
import PortalLayout from './components/layout/PortalLayout';

// Public pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import TeachersPage from './pages/TeachersPage';
import GalleryPage from './pages/GalleryPage';
import NoticesPage from './pages/NoticesPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SetPasswordPage from './pages/SetPasswordPage';
import NotFoundPage from './pages/NotFoundPage';

// Student portal
import StudentDashboard from './pages/StudentDashboard';
import StudentAttendance from './pages/StudentAttendance';
import StudentFees from './pages/StudentFees';
import StudentActivityLog from './pages/StudentActivityLog';
import StudentReviews from './pages/StudentReviews';
import StudentGalleryUpload from './pages/StudentGalleryUpload';
import StudentMakeupClasses from './pages/StudentMakeupClasses';
import StudentResources from './pages/StudentResources';
import StudentSchedule from './pages/StudentSchedule';

// Teacher portal
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherAttendance from './pages/TeacherAttendance';
import TeacherStudents from './pages/TeacherStudents';
import TeacherBatches from './pages/TeacherBatches';
import TeacherReviewStudents from './pages/TeacherReviewStudents';
import TeacherBatchTransfer from './pages/TeacherBatchTransfer';
import TeacherResources from './pages/TeacherResources';
import TeacherProfile from './pages/TeacherProfile';
import TeacherMakeupRequests from './pages/TeacherMakeupRequests';

// Admin portal
import AdminDashboard from './pages/AdminDashboard';
import AdminStudents from './pages/AdminStudents';
import AdminTeachers from './pages/AdminTeachers';
import AdminBatches from './pages/AdminBatches';
import AdminFees from './pages/AdminFees';
import AdminGalleryRequests from './pages/AdminGalleryRequests';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminStatusChanges from './pages/AdminStatusChanges';
import AdminNotices from './pages/AdminNotices';
import AdminGallery from './pages/AdminGallery';
import AdminMessages from './pages/AdminMessages';

const PORTALS = {
  student: [
    ['dashboard', StudentDashboard],
    ['attendance', StudentAttendance],
    ['fees', StudentFees],
    ['activity-log', StudentActivityLog],
    ['reviews', StudentReviews],
    ['gallery-upload', StudentGalleryUpload],
    ['makeup-classes', StudentMakeupClasses],
    ['resources', StudentResources],
    ['schedule', StudentSchedule],
  ],
  teacher: [
    ['dashboard', TeacherDashboard],
    ['attendance', TeacherAttendance],
    ['students', TeacherStudents],
    ['batches', TeacherBatches],
    ['review-students', TeacherReviewStudents],
    ['batch-transfer', TeacherBatchTransfer],
    ['resources', TeacherResources],
    ['profile', TeacherProfile],
    ['makeup-requests', TeacherMakeupRequests],
  ],
  admin: [
    ['dashboard', AdminDashboard],
    ['students', AdminStudents],
    ['teachers', AdminTeachers],
    ['batches', AdminBatches],
    ['fees', AdminFees],
    ['gallery-requests', AdminGalleryRequests],
    ['analytics', AdminAnalytics],
    ['status-changes', AdminStatusChanges],
    ['notices', AdminNotices],
    ['gallery', AdminGallery],
    ['messages', AdminMessages],
  ],
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ConfirmProvider>
          <Router>
            <Routes>
              {/* Public website: navbar + footer, never a portal sidebar */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/teachers" element={<TeachersPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/notices" element={<NoticesPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/set-password" element={<SetPasswordPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Portals: sidebar layout, role-protected */}
              {Object.entries(PORTALS).map(([role, pages]) => (
                <Route
                  key={role}
                  path={`/${role}`}
                  element={
                    <ProtectedRoute role={role}>
                      <PortalLayout role={role} />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="dashboard" replace />} />
                  {pages.map(([path, Page]) => (
                    <Route key={path} path={path} element={<Page />} />
                  ))}
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Route>
              ))}
            </Routes>
          </Router>
        </ConfirmProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
