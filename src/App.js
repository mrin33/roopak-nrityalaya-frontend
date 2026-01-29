import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import TeachersPage from './pages/TeachersPage';
import GalleryPage from './pages/GalleryPage';
import NoticesPage from './pages/NoticesPage';
import ContactPage from './pages/ContactPage';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/notices" element={<NoticesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* We'll add login and dashboard routes later */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
