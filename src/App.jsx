import React, { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ConfirmProvider } from './context/ConfirmContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './components/layout/PublicLayout';
import PortalLayout from './components/layout/PortalLayout';

// Pages are code-split per route; the landing page stays in the main bundle.
// Public pages
import HomePage from './pages/HomePage';
const AboutPage = lazy(() => import('./pages/AboutPage'));
const TeachersPage = lazy(() => import('./pages/TeachersPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const NoticesPage = lazy(() => import('./pages/NoticesPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const SetPasswordPage = lazy(() => import('./pages/SetPasswordPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Student portal
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const StudentAttendance = lazy(() => import('./pages/StudentAttendance'));
const StudentFees = lazy(() => import('./pages/StudentFees'));
const StudentActivityLog = lazy(() => import('./pages/StudentActivityLog'));
const StudentReviews = lazy(() => import('./pages/StudentReviews'));
const StudentGalleryUpload = lazy(() => import('./pages/StudentGalleryUpload'));
const StudentMakeupClasses = lazy(() => import('./pages/StudentMakeupClasses'));
const StudentResources = lazy(() => import('./pages/StudentResources'));
const StudentSchedule = lazy(() => import('./pages/StudentSchedule'));

// Teacher portal
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'));
const TeacherAttendance = lazy(() => import('./pages/TeacherAttendance'));
const TeacherStudents = lazy(() => import('./pages/TeacherStudents'));
const TeacherBatches = lazy(() => import('./pages/TeacherBatches'));
const TeacherReviewStudents = lazy(() => import('./pages/TeacherReviewStudents'));
const TeacherBatchTransfer = lazy(() => import('./pages/TeacherBatchTransfer'));
const TeacherResources = lazy(() => import('./pages/TeacherResources'));
const TeacherProfile = lazy(() => import('./pages/TeacherProfile'));
const TeacherMakeupRequests = lazy(() => import('./pages/TeacherMakeupRequests'));

// Admin portal
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminStudents = lazy(() => import('./pages/AdminStudents'));
const AdminTeachers = lazy(() => import('./pages/AdminTeachers'));
const AdminBatches = lazy(() => import('./pages/AdminBatches'));
const AdminFees = lazy(() => import('./pages/AdminFees'));
const AdminGalleryRequests = lazy(() => import('./pages/AdminGalleryRequests'));
const AdminAnalytics = lazy(() => import('./pages/AdminAnalytics'));
const AdminStatusChanges = lazy(() => import('./pages/AdminStatusChanges'));
const AdminNotices = lazy(() => import('./pages/AdminNotices'));
const AdminGallery = lazy(() => import('./pages/AdminGallery'));
const AdminMessages = lazy(() => import('./pages/AdminMessages'));

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
