import React from 'react';

const AboutPage = () => {
  const levels = [
    { number: 1, name: 'Praveshika Pratham', description: 'Foundation level introducing basic postures, hand movements, and simple rhythmic patterns.' },
    { number: 2, name: 'Praveshika Purna', description: 'Completion of foundational training with enhanced footwork and introductory compositions.' },
    { number: 3, name: 'Madhyama Pratham', description: 'Intermediate level focusing on complex rhythms and expressive storytelling techniques.' },
    { number: 4, name: 'Madhyama Purna', description: 'Advanced intermediate training with intricate choreography and theoretical knowledge.' },
    { number: 5, name: 'Visharad Pratham', description: 'Advanced level emphasizing artistic expression and performance skills.' },
    { number: 6, name: 'Visharad Purna', description: 'Completion of advanced training with mastery of traditional compositions.' },
    { number: 7, name: 'Alankar Pratham', description: 'Expert level requiring exceptional technical proficiency and creative interpretation.' },
    { number: 8, name: 'Alankar Purna', description: 'Mastery level where students become accomplished performers and potential teachers.' },
  ];

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/20 to-secondary/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-primary mb-6">
            About Roopak Nrityalaya
          </h1>
          <div className="w-32 h-1 bg-secondary mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            A premier institution dedicated to preserving and promoting the classical dance form of Kathak
            through traditional teaching methods and modern educational practices.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-heading font-bold text-primary mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Roopak Nrityalaya was established with a vision to create a nurturing environment where 
                  students can immerse themselves in the rich tradition of Kathak dance. Our journey began 
                  with a deep commitment to preserving the authenticity of this classical art form while 
                  making it accessible to aspiring dancers of all ages.
                </p>
                <p>
                  Under the guidance of experienced gurus who have dedicated their lives to Kathak, we have 
                  created a structured curriculum that spans eight progressive levels. Each level is carefully 
                  designed to build upon the previous one, ensuring comprehensive training from foundational 
                  techniques to advanced performances.
                </p>
                <p>
                  Our academy is more than just a dance school – it's a cultural hub where tradition meets 
                  innovation, where students don't just learn steps but embrace the philosophy, history, 
                  and spirituality embedded in Kathak.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-accent mb-2">Traditional Guru-Shishya Parampara</h3>
                    <p className="text-gray-600">Learning through the time-honored teacher-student tradition</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-accent mb-2">Structured 8-Level Curriculum</h3>
                    <p className="text-gray-600">Progressive learning from Praveshika to Alankar</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-accent mb-2">Performance Opportunities</h3>
                    <p className="text-gray-600">Regular events, competitions, and cultural programs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-heading font-bold text-primary mb-4">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                To be a globally recognized center of excellence for Kathak dance, preserving its rich 
                heritage while innovating teaching methodologies. We envision creating accomplished dancers 
                who become cultural ambassadors, spreading the beauty of this classical art form worldwide.
              </p>
            </div>

            <div className="card">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-heading font-bold text-primary mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                To provide authentic, high-quality Kathak training that nurtures both technical excellence 
                and artistic expression. We are committed to making classical dance education accessible, 
                fostering discipline, creativity, and cultural appreciation in every student who walks through 
                our doors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8 Levels of Kathak Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-primary mb-4">
              The Eight Levels of Kathak
            </h2>
            <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our comprehensive curriculum is structured across eight progressive levels, each designed to 
              build mastery systematically, just like the belt system in martial arts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {levels.map((level) => (
              <div 
                key={level.number}
                className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Level Number Badge */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{level.number}</span>
                </div>

                <div className="p-6 pt-8">
                  <h3 className="text-xl font-heading font-bold text-accent mb-3 pr-12">
                    {level.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {level.description}
                  </p>
                </div>

                {/* Progress indicator */}
                <div className="h-1 bg-gradient-to-r from-primary to-secondary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 text-center">
            <p className="text-lg text-gray-700">
              <span className="font-bold text-primary">Progressive Learning:</span> Students begin at 
              Praveshika Pratham and advance through each level, building a strong foundation before 
              moving to more complex techniques. This systematic approach ensures comprehensive mastery 
              of Kathak.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-primary mb-4">
              Why Choose Roopak Nrityalaya
            </h2>
            <div className="w-24 h-1 bg-secondary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-accent mb-3">Expert Instructors</h3>
              <p className="text-gray-600">
                Learn from accomplished Kathak dancers with decades of experience and deep knowledge 
                of traditional techniques.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-accent mb-3">Structured Progress</h3>
              <p className="text-gray-600">
                Clear progression through 8 levels ensures systematic skill development and measurable 
                achievement milestones.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-accent mb-3">Performance Platform</h3>
              <p className="text-gray-600">
                Regular opportunities to perform at cultural events, competitions, and annual showcases 
                build confidence and stage presence.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-accent mb-3">Flexible Scheduling</h3>
              <p className="text-gray-600">
                Multiple batch timings and personalized attention ensure learning fits into your schedule 
                without compromise.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-accent mb-3">Rich Resources</h3>
              <p className="text-gray-600">
                Access to learning materials, practice videos, and audio resources to support your journey 
                beyond classroom hours.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-accent mb-3">Community & Culture</h3>
              <p className="text-gray-600">
                Join a vibrant community of dance enthusiasts who share your passion for preserving and 
                celebrating Indian classical arts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-heading font-bold mb-6">
            Ready to Begin Your Kathak Journey?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join Roopak Nrityalaya and discover the joy, discipline, and artistry of classical Kathak dance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
              Enroll Now
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors">
              Schedule a Visit
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
