import React from 'react';

const HomePage = () => {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-secondary/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left side - Institute Info */}
            <div className="text-center md:text-left">
              <div className="mb-6">
                {/* Logo Placeholder - Replace with actual logo */}
                <div className="inline-block w-32 h-32 bg-primary rounded-full flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-5xl">RN</span>
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-heading font-bold text-primary mb-4">
                Roopak Nrityalaya
              </h1>
              <p className="text-2xl text-accent mb-6 font-medium">
                Kathak Dance Academy
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Preserving the ancient art of Kathak through traditional teaching methods
                while nurturing the next generation of classical dancers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button className="btn-primary">
                  Enroll Now
                </button>
                <button className="btn-secondary">
                  Learn More
                </button>
              </div>
            </div>

            {/* Right side - Founder Photo */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Decorative circle behind */}
                <div className="absolute -inset-4 bg-secondary/20 rounded-full blur-2xl"></div>
                
                {/* Founder Photo - Placeholder */}
                <div className="relative w-80 h-80 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-32 h-32 mx-auto text-white/50" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      <p className="text-white text-lg mt-4">Founder Photo</p>
                      <p className="text-white/70 text-sm">(Upload your image)</p>
                    </div>
                  </div>
                </div>

                {/* Founder Name */}
                <div className="text-center mt-6">
                  <h3 className="text-2xl font-heading font-bold text-accent">
                    [Founder Name]
                  </h3>
                  <p className="text-gray-600">Founder & Chief Instructor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Institute Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-primary mb-4">
              About Our Institute
            </h2>
            <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-bold text-accent mb-3">
                Traditional Learning
              </h3>
              <p className="text-gray-600">
                Authentic Kathak training following the Guru-Shishya parampara with 8 levels
                of systematic progression from Praveshika to Alankar.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-bold text-accent mb-3">
                Expert Faculty
              </h3>
              <p className="text-gray-600">
                Learn from experienced gurus who are dedicated to preserving and
                promoting the rich heritage of Kathak dance.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-bold text-accent mb-3">
                Performance Opportunities
              </h3>
              <p className="text-gray-600">
                Regular performances, competitions, and cultural events to showcase
                student talent and build confidence.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 md:p-12">
            <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
              <span className="font-semibold text-primary">Roopak Nrityalaya</span> was established
              with the vision of creating a nurturing environment where students can immerse themselves
              in the classical dance form of Kathak. Our structured curriculum spans eight progressive
              levels, ensuring comprehensive training from foundational techniques to advanced performances.
              We believe in holistic development, combining rigorous technical training with creative
              expression and cultural appreciation.
            </p>
          </div>
        </div>
      </section>

      {/* Senior Teachers Section - Placeholder */}
      <section className="py-20 bg-background-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-primary mb-4">
              Our Senior Teachers
            </h2>
            <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Learn from experienced masters who bring decades of expertise and passion for Kathak
            </p>
          </div>

          {/* Teacher Carousel - We'll implement this next */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-500 text-lg">
              Teacher Carousel will be implemented here
            </p>
            <p className="text-gray-400 text-sm mt-2">
              (Featuring 10 senior teachers with photos, names, experience, and bio)
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-heading font-bold mb-6">
            Begin Your Kathak Journey Today
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join our community of passionate dancers and experience the joy of classical dance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
              Register Now
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
