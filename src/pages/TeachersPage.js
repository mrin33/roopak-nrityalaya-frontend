import React, { useState } from 'react';

const TeachersPage = () => {
  // Placeholder teacher data - you'll replace this with real data from backend later
  const [teachers] = useState([
    {
      id: 1,
      name: 'Teacher Name 1',
      specialization: 'Lucknow Gharana',
      experience: 25,
      qualification: 'M.A. in Kathak, Sangeet Visharad',
      bio: 'An accomplished Kathak dancer and teacher with over two decades of experience. Specializes in traditional repertoire and abhinaya.',
      isSenior: true,
      photoUrl: null // Placeholder - add real photo URL later
    },
    {
      id: 2,
      name: 'Teacher Name 2',
      specialization: 'Jaipur Gharana',
      experience: 18,
      qualification: 'B.A. in Performing Arts, Alankar',
      bio: 'Known for powerful footwork and rhythmic precision. Has performed at numerous national and international stages.',
      isSenior: true,
      photoUrl: null
    },
    {
      id: 3,
      name: 'Teacher Name 3',
      specialization: 'Banaras Gharana',
      experience: 15,
      qualification: 'Diploma in Kathak, Visharad Purna',
      bio: 'Combines traditional technique with innovative choreography. Passionate about teaching young learners.',
      isSenior: false,
      photoUrl: null
    },
    {
      id: 4,
      name: 'Teacher Name 4',
      specialization: 'Lucknow Gharana',
      experience: 20,
      qualification: 'M.Phil in Dance Studies',
      bio: 'Expert in Kathak theory and history. Focuses on the spiritual aspects of classical dance.',
      isSenior: true,
      photoUrl: null
    },
    {
      id: 5,
      name: 'Teacher Name 5',
      specialization: 'Jaipur Gharana',
      experience: 12,
      qualification: 'B.Performing Arts, Visharad',
      bio: 'Dynamic performer and patient teacher. Specializes in teaching intermediate and advanced students.',
      isSenior: false,
      photoUrl: null
    },
    {
      id: 6,
      name: 'Teacher Name 6',
      specialization: 'Lucknow Gharana',
      experience: 22,
      qualification: 'Sangeet Prabhakar, Alankar Purna',
      bio: 'Renowned for expressive storytelling through dance. Has trained numerous award-winning students.',
      isSenior: true,
      photoUrl: null
    },
  ]);

  const [filter, setFilter] = useState('all'); // 'all', 'senior', 'regular'

  const filteredTeachers = teachers.filter(teacher => {
    if (filter === 'senior') return teacher.isSenior;
    if (filter === 'regular') return !teacher.isSenior;
    return true;
  });

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/20 to-secondary/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-primary mb-6">
            Our Teachers
          </h1>
          <div className="w-32 h-1 bg-secondary mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Meet our dedicated faculty of accomplished Kathak dancers who bring passion, 
            expertise, and years of experience to guide you on your dance journey.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white shadow-sm sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === 'all'
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Teachers ({teachers.length})
            </button>
            <button
              onClick={() => setFilter('senior')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === 'senior'
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Senior Faculty ({teachers.filter(t => t.isSenior).length})
            </button>
            <button
              onClick={() => setFilter('regular')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === 'regular'
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Teaching Faculty ({teachers.filter(t => !t.isSenior).length})
            </button>
          </div>
        </div>
      </section>

      {/* Teachers Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                {/* Teacher Photo - Grayscale placeholder */}
                <div className="relative h-80 bg-gradient-to-br from-gray-300 to-gray-400 overflow-hidden">
                  {teacher.photoUrl ? (
                    <img
                      src={teacher.photoUrl}
                      alt={teacher.name}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-32 h-32 mx-auto text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        <p className="text-gray-600 mt-2">Photo Coming Soon</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Senior Badge */}
                  {teacher.isSenior && (
                    <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full text-sm font-bold">
                      Senior Faculty
                    </div>
                  )}
                </div>

                {/* Teacher Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-heading font-bold text-primary mb-2">
                    {teacher.name}
                  </h3>
                  <p className="text-secondary font-semibold mb-1">
                    {teacher.specialization}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    {teacher.experience} years of experience
                  </p>

                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <p className="text-sm font-semibold text-accent mb-1">Qualification:</p>
                    <p className="text-sm text-gray-600">{teacher.qualification}</p>
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed">
                    {teacher.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredTeachers.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No teachers found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Join Our Faculty Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-heading font-bold text-primary mb-6">
            Interested in Teaching with Us?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            We're always looking for passionate and experienced Kathak teachers to join our faculty. 
            If you have expertise in classical dance and a desire to inspire the next generation, 
            we'd love to hear from you.
          </p>
          <button className="btn-primary">
            Apply to Teach
          </button>
        </div>
      </section>
    </div>
  );
};

export default TeachersPage;
