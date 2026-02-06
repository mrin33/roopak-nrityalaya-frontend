import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import TeachersPage from './pages/TeachersPage';
import GalleryPage from './pages/GalleryPage';
import NoticesPage from './pages/NoticesPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import StudentAttendance from './pages/StudentAttendance';
import StudentFees from './pages/StudentFees';
import StudentResources from './pages/StudentResources';
import StudentSchedule from './pages/StudentSchedule';
// Import new pages
import StudentActivityLog from './pages/StudentActivityLog';
import StudentGalleryUpload from './pages/StudentGalleryUpload';
import StudentReviews from './pages/StudentReviews';
import StudentMakeupClasses from './pages/StudentMakeupClasses';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherAttendance from './pages/TeacherAttendance';
import TeacherStudents from './pages/TeacherStudents';
import TeacherBatches from './pages/TeacherBatches';
import TeacherResources from './pages/TeacherResources';
import TeacherProfile from './pages/TeacherProfile';
import AdminDashboard from './pages/AdminDashboard';
import AdminStudents from './pages/AdminStudents';
import AdminTeachers from './pages/AdminTeachers';
import AdminBatches from './pages/AdminBatches';
import AdminFees from './pages/AdminFees';
import AdminNotices from './pages/AdminNotices';
import AdminGallery from './pages/AdminGallery';
import Footer from './components/Footer';



function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar />
          <main className="flex-grow">
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
              
              {/* Protected Student Routes */}
              <Route 
                path="/student/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student/attendance" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentAttendance />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student/fees" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentFees />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student/resources" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentResources />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student/schedule" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentSchedule />
                  </ProtectedRoute>
                } 
              />
              
              // Add routes inside student routes section
              <Route path="/student/activity-log" element={
                <ProtectedRoute role="student">
                  <StudentActivityLog />
                </ProtectedRoute>
              } />
              <Route path="/student/gallery-upload" element={
                <ProtectedRoute role="student">
                  <StudentGalleryUpload />
                </ProtectedRoute>
              } />
              <Route path="/student/reviews" element={
                <ProtectedRoute role="student">
                  <StudentReviews />
                </ProtectedRoute>
              } />
              <Route path="/student/makeup-classes" element={
                <ProtectedRoute role="student">
                  <StudentMakeupClasses />
                </ProtectedRoute>
              } />
              
              {/* Protected Teacher Routes */}
              <Route 
                path="/teacher/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <TeacherDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher/attendance" 
                element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <TeacherAttendance />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher/students" 
                element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <TeacherStudents />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher/batches" 
                element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <TeacherBatches />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher/resources" 
                element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <TeacherResources />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher/profile" 
                element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <TeacherProfile />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/students" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminStudents />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/teachers" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminTeachers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/batches" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminBatches />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/fees" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminFees />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/notices" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminNotices />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/gallery" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminGallery />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
