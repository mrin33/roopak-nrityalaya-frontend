import React, { useState } from 'react';
import Modal from './ui/Modal';
import { PasswordInput, PasswordRules, passwordValid } from './public/AuthShell';
import authService from '../services/authService';
import { useToast } from '../context/ToastContext';

/** Change the signed-in user's password (PUT /auth/change-password). */
const ChangePasswordDialog = ({ open, onClose }) => {
  const toast = useToast();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const close = () => {
    if (saving) return;
    setForm({ current: '', next: '', confirm: '' });
    setError('');
    onClose();
  };

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!passwordValid(form.next)) return setError('The new password must be at least 8 characters and contain a letter and a number.');
    if (form.next !== form.confirm) return setError('The new passwords do not match.');
    if (form.next === form.current) return setError('Choose a password different from your current one.');
    setSaving(true);
    try {
      await authService.changePassword(form.current, form.next);
      toast.success('Password changed. Other devices have been signed out.');
      setSaving(false);
      setForm({ current: '', next: '', confirm: '' });
      onClose();
    } catch (err) {
      setError(err.message || 'Could not change your password.');
      setSaving(false);
    }
    return undefined;
  };

  return (
    <Modal open={open} onClose={close} title="Change password" size="sm" dismissible={!saving}>
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error && (
          <p className="callout-danger" role="alert">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="cp-current" className="form-label">
            Current password
          </label>
          <PasswordInput id="cp-current" value={form.current} onChange={set('current')} autoComplete="current-password" required />
        </div>
        <div>
          <label htmlFor="cp-next" className="form-label">
            New password
          </label>
          <PasswordInput id="cp-next" value={form.next} onChange={set('next')} autoComplete="new-password" required />
          <PasswordRules password={form.next} />
        </div>
        <div>
          <label htmlFor="cp-confirm" className="form-label">
            Confirm new password
          </label>
          <PasswordInput id="cp-confirm" value={form.confirm} onChange={set('confirm')} autoComplete="new-password" required />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={close} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={saving || !form.current}>
            {saving ? 'Saving…' : 'Change password'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordDialog;
