import React, { useState } from 'react';

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="invite-title">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
        <h2 id="invite-title" className="text-2xl font-bold text-accent mb-2">
          {invite.purpose === 'reset' ? 'Password reset link' : 'Invitation link'}
        </h2>
        <p className="text-gray-600 mb-4">
          Share this one-time link with <span className="font-semibold">{name}</span> so they can choose their own
          password. It expires on{' '}
          <span className="font-semibold">{new Date(invite.expires_at).toLocaleString()}</span> and will not be shown
          again.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            readOnly
            value={invite.url}
            className="input-field text-sm"
            onFocus={(e) => e.target.select()}
            aria-label="Password setup link"
          />
          <button type="button" onClick={copy} className="btn-primary whitespace-nowrap">
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
        <div className="flex justify-end mt-6">
          <button type="button" onClick={onClose} className="btn-secondary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteLinkDialog;
