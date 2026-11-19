import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../services/authService';

// Landing page for one-time invitation / password-reset links:
//   /set-password?token=...
const SetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [status, setStatus] = useState('checking'); // checking | ready | invalid | done
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState('invite');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }
    authService
      .checkSetupToken(token)
      .then((data) => {
        setEmail(data.email);
        setPurpose(data.purpose);
        setStatus('ready');
      })
      .catch(() => setStatus('invalid'));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setError('Password must be at least 8 characters and contain a letter and a number.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      await authService.setPassword(token, password);
      setStatus('done');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.message || 'Could not set your password. The link may have expired.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-heading font-bold text-primary text-center mb-2">
          {purpose === 'reset' ? 'Reset your password' : 'Welcome to Roopak Nrityalaya'}
        </h1>

        {status === 'checking' && <p className="text-center text-gray-600 mt-6">Checking your link…</p>}

        {status === 'invalid' && (
          <div className="mt-6 text-center">
            <p className="text-red-700 bg-red-50 border-l-4 border-red-500 p-4 rounded text-left">
              This link is invalid or has expired. Please ask the academy administrator for a new one.
            </p>
            <Link to="/login" className="inline-block mt-6 text-primary font-semibold hover:underline">
              Go to login
            </Link>
          </div>
        )}

        {status === 'done' && (
          <p className="mt-6 text-green-800 bg-green-50 border-l-4 border-green-500 p-4 rounded">
            Your password has been set. Redirecting you to the login page…
          </p>
        )}

        {status === 'ready' && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
            <p className="text-center text-gray-600">
              Choose a password for <span className="font-semibold">{email}</span>
            </p>
            {error && (
              <p role="alert" className="text-sm text-red-700 bg-red-50 border-l-4 border-red-500 p-3 rounded">
                {error}
              </p>
            )}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters, letters and numbers"
                required
              />
            </div>
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                autoComplete="new-password"
                className="input-field"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={submitting} className="w-full btn-primary disabled:opacity-50">
              {submitting ? 'Saving…' : 'Set password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SetPasswordPage;
