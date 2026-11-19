import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, user } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    emergencyContactName: '',
    emergencyContact: '',
    currentLevel: '1',
    paymentWindow: 'monthly',
    enrollmentReason: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const levels = [
    { id: 1, name: 'Praveshika Pratham', code: 'PP', monthlyFee: 1000 },
    { id: 2, name: 'Praveshika Purna', code: 'PM', monthlyFee: 1200 },
    { id: 3, name: 'Madhyama Pratham', code: 'MP', monthlyFee: 1500 },
    { id: 4, name: 'Madhyama Purna', code: 'MM', monthlyFee: 1500 },
    { id: 5, name: 'Visharad Pratham', code: 'VP', monthlyFee: 2000 },
    { id: 6, name: 'Visharad Purna', code: 'VM', monthlyFee: 2000 },
    { id: 7, name: 'Alankar Pratham', code: 'AP', monthlyFee: 2500 },
    { id: 8, name: 'Alankar Purna', code: 'AM', monthlyFee: 2500 }
  ];

  const paymentOptions = [
    { value: 'monthly', label: 'Monthly', discount: 0, multiplier: 1, badge: 'Flexible', color: 'blue' },
    { value: 'quarterly', label: 'Quarterly', discount: 2, multiplier: 3, badge: 'Save 2%', color: 'green' },
    { value: 'half_yearly', label: 'Half-Yearly', discount: 5, multiplier: 6, badge: 'Save 5%', color: 'purple' },
    { value: 'yearly', label: 'Yearly', discount: 10, multiplier: 12, badge: 'Save 10%', color: 'gold' }
  ];

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/student/dashboard');
    }
  }, [user, navigate]);

  const getSelectedLevel = () => {
    return levels.find(l => l.id === parseInt(formData.currentLevel));
  };

  const calculateFee = () => {
    const level = getSelectedLevel();
    if (!level) return { base: 0, discounted: 0, savings: 0 };

    const option = paymentOptions.find(p => p.value === formData.paymentWindow);
    const baseAmount = level.monthlyFee * option.multiplier;
    const discountedAmount = baseAmount * (1 - option.discount / 100);
    const savings = baseAmount - discountedAmount;

    return {
      base: baseAmount,
      discounted: Math.round(discountedAmount),
      savings: Math.round(savings)
    };
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8 || !/[A-Za-z]/.test(formData.password) || !/d/.test(formData.password)) {
      setError('Password must be at least 8 characters and contain a letter and a number');
      return;
    }

    setLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        emergencyContactName: formData.emergencyContactName,
        emergencyContact: formData.emergencyContact,
        currentLevelId: parseInt(formData.currentLevel),
        paymentWindow: formData.paymentWindow,
        enrollmentReason: formData.enrollmentReason
      });

      // Will redirect automatically via useEffect when user state updates
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fees = calculateFee();
  const selectedOption = paymentOptions.find(p => p.value === formData.paymentWindow);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-2">
            Student Registration
          </h1>
          <p className="text-gray-600">Join Roopak Nrityalaya Kathak Academy</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Personal Information */}
            <div>
              <h3 className="text-xl font-bold text-accent mb-4 pb-2 border-b-2 border-primary/20">
                Personal Information
              </h3>
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
                    placeholder="Enter your full name"
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
                    onChange={handleChange}
                    className="input-field"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-accent mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="At least 8 characters, letters and numbers"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-accent mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Re-enter password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-accent mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-accent mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-accent mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-accent mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="City, State"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-xl font-bold text-accent mb-4 pb-2 border-b-2 border-primary/20">
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-accent mb-2">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Parent/Guardian name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-accent mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Emergency contact number"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Level Selection */}
            <div>
              <h3 className="text-xl font-bold text-accent mb-4 pb-2 border-b-2 border-primary/20">
                Course Information
              </h3>
              <div>
                <label className="block text-sm font-semibold text-accent mb-2">
                  Select Level *
                </label>
                <select
                  name="currentLevel"
                  value={formData.currentLevel}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  {levels.map(level => (
                    <option key={level.id} value={level.id}>
                      {level.name} - ₹{level.monthlyFee}/month
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Your roll number will be auto-assigned based on this level (e.g., {getSelectedLevel()?.code}1, {getSelectedLevel()?.code}2...)
                </p>
              </div>
            </div>

            {/* Payment Window Selection */}
            <div>
              <h3 className="text-xl font-bold text-accent mb-4 pb-2 border-b-2 border-primary/20">
                Payment Preference
              </h3>
              
              <label className="block text-sm font-semibold text-accent mb-3">
                Select Payment Window *
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentOptions.map(option => (
                  <label
                    key={option.value}
                    className={`relative cursor-pointer border-2 rounded-xl p-4 transition-all ${
                      formData.paymentWindow === option.value
                        ? 'border-primary bg-primary/5 shadow-lg'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentWindow"
                      value={option.value}
                      checked={formData.paymentWindow === option.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-accent">{option.label}</p>
                        <p className="text-xs text-gray-600">
                          {option.multiplier} month{option.multiplier > 1 ? 's' : ''}
                        </p>
                      </div>
                      {option.discount > 0 && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          {option.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline space-x-2">
                      {option.discount > 0 && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{getSelectedLevel()?.monthlyFee * option.multiplier}
                        </span>
                      )}
                      <span className="text-xl font-bold text-primary">
                        ₹{Math.round(getSelectedLevel()?.monthlyFee * option.multiplier * (1 - option.discount / 100))}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Fee Summary */}
              {fees.savings > 0 && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 font-semibold">
                    🎉 You save ₹{fees.savings} with {selectedOption?.label} payment!
                  </p>
                </div>
              )}
            </div>

            {/* Enrollment Reason */}
            <div>
              <h3 className="text-xl font-bold text-accent mb-4 pb-2 border-b-2 border-primary/20">
                About You
              </h3>
              <div>
                <label className="block text-sm font-semibold text-accent mb-2">
                  Why do you want to join? (Optional)
                </label>
                <textarea
                  name="enrollmentReason"
                  value={formData.enrollmentReason}
                  onChange={handleChange}
                  rows="4"
                  className="input-field"
                  placeholder="Tell us what motivated you to join Roopak Nrityalaya..."
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">
                  This helps us understand you better and customize your learning experience
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering...' : 'Complete Registration'}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-primary-dark font-semibold">
                Login here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
