import React, { useState, useEffect } from 'react';

import teacherService from '../services/teacherService';
import LoadingSpinner from '../components/LoadingSpinner';

const TeacherProfile = () => {
  // const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    experienceYears: 0,
    qualifications: '',
    bio: '',
    address: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profile = await teacherService.getProfile();
      setFormData({
        fullName: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        specialization: profile.specialization || '',
        experienceYears: profile.experience_years || 0,
        qualifications: profile.qualifications || '',
        bio: profile.bio || '',
        address: '' // Add mapping if available
      });
      setStats({
        totalStudents: profile.total_students || 0,
        avgRating: profile.avg_rating || 0
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await teacherService.updateProfile({
        phone: formData.phone,
        bio: formData.bio,
        specialization: formData.specialization,
        qualifications: formData.qualifications,
        experience_years: parseInt(formData.experienceYears, 10) || 0,
      });
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isEditing) return <LoadingSpinner fullScreen={true} />;
  if (error) return <div className="p-8 text-red-600 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-heading font-bold text-primary mb-2">
              My Profile
            </h1>
            <p className="text-gray-600">Manage your personal information</p>
          </div>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="btn-primary"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              
              {/* Profile Photo */}
              <div className="mb-6">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-20 h-20 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                {isEditing && (
                  <button className="text-sm text-primary hover:text-primary-dark font-semibold">
                    Change Photo
                  </button>
                )}
              </div>

              {/* Quick Info */}
              <h2 className="text-2xl font-bold text-accent mb-1">{formData.fullName}</h2>
              <p className="text-gray-600 mb-2">{formData.email}</p>
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                Teacher
              </span>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-primary">N/A</p>
                    <p className="text-xs text-gray-600">Batches</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{stats.totalStudents}</p>
                    <p className="text-xs text-gray-600">Students</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{formData.experienceYears}</p>
                    <p className="text-xs text-gray-600">Years Exp.</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{parseFloat(stats.avgRating).toFixed(1)}</p>
                    <p className="text-xs text-gray-600">Avg. Rating</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password Card */}
            {!isEditing && (
              <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                <h3 className="font-bold text-accent mb-4">Security</h3>
                <button className="w-full btn-secondary">
                  Change Password
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-accent mb-6 pb-4 border-b">
                {isEditing ? 'Edit Information' : 'Personal Information'}
              </h3>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-accent mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-accent mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        className="input-field bg-gray-100"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-accent mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-accent mb-2">
                        Specialization *
                      </label>
                      <input
                        type="text"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-accent mb-2">
                        Years of Experience *
                      </label>
                      <input
                        type="number"
                        name="experienceYears"
                        value={formData.experienceYears}
                        onChange={handleChange}
                        className="input-field"
                        min="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-accent mb-2">
                        Qualifications
                      </label>
                      <input
                        type="text"
                        name="qualifications"
                        value={formData.qualifications}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="4"
                      className="input-field"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="2"
                      className="input-field"
                    ></textarea>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-gray-600">Full Name</label>
                      <p className="font-semibold text-accent">{formData.fullName}</p>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Email</label>
                      <p className="font-semibold text-accent">{formData.email}</p>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Phone</label>
                      <p className="font-semibold text-accent">{formData.phone}</p>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Specialization</label>
                      <p className="font-semibold text-accent">{formData.specialization}</p>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Experience</label>
                      <p className="font-semibold text-accent">{formData.experienceYears} years</p>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Qualifications</label>
                      <p className="font-semibold text-accent">{formData.qualifications}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Bio</label>
                    <p className="font-semibold text-accent">{formData.bio}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Address</label>
                    <p className="font-semibold text-accent">{formData.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
