import React, { useState } from 'react';
import Modal from './ui/Modal';
import Icon from './ui/Icon';

/**
 * Shows a one-time password-setup link returned by the API (teacher/student
 * invitations and resets). The link is displayed once; email delivery is not
 * configured, so the admin shares it manually.
 */
const InviteLinkDialog = ({ invite, name, onClose }) => {
  const [copied, setCopied] = useState(false);
  if (!invite) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(invite.url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={invite.purpose === 'reset' ? 'Password reset link' : 'Invitation link'} size="md">
      <p className="text-sm text-gray-600">
        Share this one-time link with <span className="font-semibold text-accent">{name}</span> so they can choose their
        own password. It expires on <span className="font-semibold text-accent">{new Date(invite.expires_at).toLocaleString('en-IN')}</span>{' '}
        and will not be shown again.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input readOnly value={invite.url} className="input-field font-mono text-xs" onFocus={(e) => e.target.select()} aria-label="Password setup link" />
        <button type="button" onClick={copy} className="btn-primary whitespace-nowrap">
          <Icon name={copied ? 'check' : 'copy'} className="h-4 w-4" />
          {copied ? 'Copied' : 'Copy link'}
        </button>
      </div>
      <p className="mt-3 text-xs text-gray-500" aria-live="polite">
        {copied ? 'Link copied to the clipboard.' : 'Email delivery is not set up yet — send the link via WhatsApp, SMS or email.'}
      </p>
      <div className="modal-actions">
        <button type="button" onClick={onClose} className="btn-secondary">
          Done
        </button>
      </div>
    </Modal>
  );
};

export default InviteLinkDialog;
