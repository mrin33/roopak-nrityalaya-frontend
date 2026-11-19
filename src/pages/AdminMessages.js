import React, { useCallback, useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import adminService from '../services/adminService';
import { useToast } from '../context/ToastContext';

// Messages submitted through the public Contact page.
const AdminMessages = () => {
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setMessages(await adminService.getMessages());
    } catch (err) {
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const setRead = async (m, isRead) => {
    setBusyId(m.message_id);
    try {
      await adminService.updateMessage(m.message_id, isRead);
      setMessages((list) => list.map((x) => (x.message_id === m.message_id ? { ...x, is_read: isRead } : x)));
    } catch (err) {
      toast.error(err.message || 'Could not update the message.');
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (m) => {
    if (!window.confirm(`Delete the message from ${m.name}?`)) return;
    setBusyId(m.message_id);
    try {
      await adminService.deleteMessage(m.message_id);
      setMessages((list) => list.filter((x) => x.message_id !== m.message_id));
      toast.success('Message deleted.');
    } catch (err) {
      toast.error(err.message || 'Could not delete the message.');
    } finally {
      setBusyId(null);
    }
  };

  if (loading && !messages.length) return <LoadingSpinner fullScreen={true} text="Loading messages..." size="lg" />;
  if (error) return <ErrorState message={error} onRetry={fetchMessages} />;

  const shown = messages.filter((m) => filter === 'all' || (filter === 'unread' ? !m.is_read : m.is_read));
  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-primary mb-2">Contact Messages</h1>
          <p className="text-gray-600">
            Enquiries sent from the website contact form · {unread} unread
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6" role="group" aria-label="Filter messages">
          {[
            ['all', `All (${messages.length})`],
            ['unread', `Unread (${unread})`],
            ['read', 'Read'],
          ].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              aria-pressed={filter === v}
              className={`px-4 py-2 rounded-lg font-semibold ${filter === v ? 'bg-primary text-white' : 'bg-white shadow'}`}
            >
              {l}
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg">
            <EmptyState icon="document" title="No messages here" description="New enquiries from the Contact page will appear here." />
          </div>
        ) : (
          <div className="space-y-4">
            {shown.map((m) => (
              <article
                key={m.message_id}
                className={`bg-white rounded-xl shadow p-6 border-l-4 ${m.is_read ? 'border-gray-200' : 'border-primary'}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="font-bold text-accent text-lg">{m.subject || 'General enquiry'}</h2>
                    <p className="text-sm text-gray-600">
                      {m.name} · <span className="break-all">{m.email}</span>
                      {m.phone ? ` · ${m.phone}` : ''}
                    </p>
                  </div>
                  <time className="text-xs text-gray-500 whitespace-nowrap">{new Date(m.created_at).toLocaleString('en-IN')}</time>
                </div>
                <p className="text-gray-700 whitespace-pre-line">{m.message}</p>
                <div className="flex gap-4 mt-4 text-sm font-semibold">
                  <button onClick={() => setRead(m, !m.is_read)} disabled={busyId === m.message_id} className="text-primary hover:underline disabled:opacity-50">
                    Mark as {m.is_read ? 'unread' : 'read'}
                  </button>
                  <button onClick={() => remove(m)} disabled={busyId === m.message_id} className="text-red-600 hover:underline disabled:opacity-50">
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
