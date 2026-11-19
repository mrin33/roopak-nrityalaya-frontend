import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import LayoutWrapper from './components/LayoutWrapper';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import TeachersPage from './pages/TeachersPage';
import GalleryPage from './pages/GalleryPage';
import NoticesPage from './pages/NoticesPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SetPasswordPage from './pages/SetPasswordPage';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import StudentAttendance from './pages/StudentAttendance';
import StudentFees from './pages/StudentFees';
import StudentActivityLog from './pages/StudentActivityLog';
import StudentReviews from './pages/StudentReviews';
import StudentGalleryUpload from './pages/StudentGalleryUpload';
import StudentMakeupClasses from './pages/StudentMakeupClasses';
import StudentResources from './pages/StudentResources';
import StudentSchedule from './pages/StudentSchedule';

// Teacher Pages
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherAttendance from './pages/TeacherAttendance';
import TeacherStudents from './pages/TeacherStudents';
import TeacherBatches from './pages/TeacherBatches';
import TeacherReviewStudents from './pages/TeacherReviewStudents';
import TeacherBatchTransfer from './pages/TeacherBatchTransfer';
import TeacherResources from './pages/TeacherResources';
import TeacherProfile from './pages/TeacherProfile';
import TeacherMakeupRequests from './pages/TeacherMakeupRequests';

// Admin Pages
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

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
      <Router>
        <Navbar />
        <LayoutWrapper>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/notices" element={<NoticesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/set-password" element={<SetPasswordPage />} />

            {/* Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute role="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/attendance"
              element={
                <ProtectedRoute role="student">
                  <StudentAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/fees"
              element={
                <ProtectedRoute role="student">
                  <StudentFees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/activity-log"
              element={
                <ProtectedRoute role="student">
                  <StudentActivityLog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/reviews"
              element={
                <ProtectedRoute role="student">
                  <StudentReviews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/gallery-upload"
              element={
                <ProtectedRoute role="student">
                  <StudentGalleryUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/makeup-classes"
              element={
                <ProtectedRoute role="student">
                  <StudentMakeupClasses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/resources"
              element={
                <ProtectedRoute role="student">
                  <StudentResources />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/schedule"
              element={
                <ProtectedRoute role="student">
                  <StudentSchedule />
                </ProtectedRoute>
              }
            />

            {/* Teacher Routes */}
            <Route
              path="/teacher/dashboard"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/attendance"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/students"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/batches"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherBatches />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/review-students"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherReviewStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/batch-transfer"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherBatchTransfer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/resources"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherResources />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/profile"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher/makeup-requests"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherMakeupRequests />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <ProtectedRoute role="admin">
                  <AdminStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/teachers"
              element={
                <ProtectedRoute role="admin">
                  <AdminTeachers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/batches"
              element={
                <ProtectedRoute role="admin">
                  <AdminBatches />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/fees"
              element={
                <ProtectedRoute role="admin">
                  <AdminFees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/gallery-requests"
              element={
                <ProtectedRoute role="admin">
                  <AdminGalleryRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute role="admin">
                  <AdminAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/status-changes"
              element={
                <ProtectedRoute role="admin">
                  <AdminStatusChanges />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/notices"
              element={
                <ProtectedRoute role="admin">
                  <AdminNotices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/gallery"
              element={
                <ProtectedRoute role="admin">
                  <AdminGallery />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/messages"
              element={
                <ProtectedRoute role="admin">
                  <AdminMessages />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </LayoutWrapper>
      </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
