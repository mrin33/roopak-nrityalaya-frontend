import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../services/authService';
import Icon from '../components/ui/Icon';
import { Skeleton } from '../components/ui/Skeleton';
import { AuthShell, PasswordInput, PasswordRules, passwordValid } from '../components/public/AuthShell';
import { usePageTitle } from '../components/public/Sections';

// Landing page for one-time invitation / password-reset links:
//   /set-password?token=...
const SetPasswordPage = () => {
  usePageTitle('Set your password');
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

  useEffect(() => {
    if (status !== 'done') return undefined;
    const t = setTimeout(() => navigate('/login'), 2500);
    return () => clearTimeout(t);
  }, [status, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!passwordValid(password)) {
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
    } catch (err) {
      setError(err.message || 'Could not set your password. The link may have expired.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title={purpose === 'reset' ? 'Reset your password' : 'Set up your account'}
      subtitle={status === 'ready' ? `Choose a password for ${email}.` : undefined}
    >
      {status === 'checking' && (
        <div className="space-y-4" role="status" aria-label="Checking your link">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      )}

      {status === 'invalid' && (
        <div>
          <div className="callout-danger" role="alert">
            This link is invalid or has expired. Please ask the academy administrator for a new one.
          </div>
          <Link to="/login" className="btn-secondary mt-6">
            Go to login
          </Link>
        </div>
      )}

      {status === 'done' && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center" role="status">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
            <Icon name="check" className="h-6 w-6" />
          </span>
          <p className="mt-3 font-semibold text-green-900">Your password has been set.</p>
          <p className="mt-1 text-sm text-green-800">Taking you to the login page…</p>
        </div>
      )}

      {status === 'ready' && (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {error && (
            <p role="alert" className="callout-danger">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="password" className="form-label">
              New password
            </label>
            <PasswordInput id="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <PasswordRules password={password} />
          </div>
          <div>
            <label htmlFor="confirm" className="form-label">
              Confirm password
            </label>
            <PasswordInput id="confirm" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary btn-lg w-full">
            {submitting ? 'Saving…' : 'Set password'}
          </button>
        </form>
      )}
    </AuthShell>
  );
};

export default SetPasswordPage;
