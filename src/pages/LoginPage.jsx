import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardPath } from '../config/navigation';
import { AuthShell, PasswordInput } from '../components/public/AuthShell';
import { usePageTitle } from '../components/public/Sections';

const LoginPage = () => {
  usePageTitle('Log in');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const sessionExpired = new URLSearchParams(location.search).get('session') === 'expired';
  const returnTo = location.state?.from;

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotHelp, setShowForgotHelp] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user } = await login(form.email, form.password);
      // Return to the page that required login, if it belongs to this role.
      const home = dashboardPath(user.role);
      navigate(returnTo && returnTo.startsWith(`/${user.role}/`) ? returnTo : home, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Log in to your student, teacher or admin account.">
      <div className="space-y-4">
        {sessionExpired && !error && <div className="callout-warning">Your session has ended. Please log in again.</div>}
        {error && (
          <div className="callout-danger" role="alert">
            {error}
          </div>
        )}
      </div>

      <form className="mt-4 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
            className="input-field"
            disabled={loading}
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowForgotHelp((v) => !v)}
              className="mb-1.5 text-sm font-medium text-primary hover:text-primary-700"
              aria-expanded={showForgotHelp}
              aria-controls="forgot-help"
            >
              Forgot password?
            </button>
          </div>
          <PasswordInput id="password" name="password" required value={form.password} onChange={handleChange} disabled={loading} />
          {showForgotHelp && (
            <p id="forgot-help" className="callout-info mt-3">
              Please contact the academy office. An administrator can send you a secure link to set a new password.
            </p>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary btn-lg w-full">
          {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}
          {loading ? 'Logging in…' : 'Log in'}
        </button>

        <p className="text-center text-sm text-gray-600">
          New to the academy?{' '}
          <Link to="/register" className="font-semibold text-primary hover:text-primary-700">
            Register as a student
          </Link>
        </p>
      </form>

      {/* Development-only hint; never shipped in production builds and never shows passwords */}
      {import.meta.env.DEV && (
        <div className="callout-info mt-8 text-xs">
          <p className="font-semibold">Local demo accounts</p>
          <p className="mt-1">
            admin@test.com, teacher@test.com, student@test.com — created by <code>npm run seed:dev</code> in the backend, using
            your SEED_PASSWORD.
          </p>
        </div>
      )}
    </AuthShell>
  );
};

export default LoginPage;
