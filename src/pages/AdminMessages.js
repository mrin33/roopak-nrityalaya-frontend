import React, { useCallback, useEffect, useState } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import Icon from '../components/ui/Icon';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import LoadMore from '../components/ui/LoadMore';
import adminService from '../services/adminService';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';

const PAGE_SIZE = 100;

// Messages submitted through the public Contact page.
const AdminMessages = () => {
  const toast = useToast();
  const confirm = useConfirm();
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('unread');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const page = await adminService.getMessagesPage({ limit: PAGE_SIZE });
      setMessages(page.rows);
      setTotal(page.total);
    } catch (err) {
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const page = await adminService.getMessagesPage({ limit: PAGE_SIZE, offset: messages.length });
      setMessages((list) => [...list, ...page.rows.filter((r) => !list.some((x) => x.message_id === r.message_id))]);
      setTotal(page.total);
    } catch (err) {
      toast.error(err.message || 'Could not load more messages.');
    } finally {
      setLoadingMore(false);
    }
  };

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
    const ok = await confirm({ title: `Delete the message from ${m.name}?`, message: 'This cannot be undone.', confirmLabel: 'Delete', tone: 'danger' });
    if (!ok) return;
    setBusyId(m.message_id);
    try {
      await adminService.deleteMessage(m.message_id);
      setMessages((list) => list.filter((x) => x.message_id !== m.message_id));
      setTotal((n) => Math.max(0, n - 1));
      toast.success('Message deleted.');
    } catch (err) {
      toast.error(err.message || 'Could not delete the message.');
    } finally {
      setBusyId(null);
    }
  };

  if (loading && !messages.length) return <PageSkeleton label="Loading messages…" variant="cards" stats={false} />;
  if (error) return <ErrorState message={error} onRetry={fetchMessages} />;

  const unread = messages.filter((m) => !m.is_read).length;
  const shown = messages.filter((m) => filter === 'all' || (filter === 'unread' ? !m.is_read : m.is_read));
  const tabs = [
    ['unread', 'Unread', unread],
    ['read', 'Read', messages.length - unread],
    ['all', 'All', messages.length],
  ];

  return (
    <div className="page">
      <PageHeader title="Messages" description="Enquiries sent from the website’s contact form. Reply by email or phone." />

      <div className="mb-6 inline-flex flex-wrap gap-1 rounded-xl border border-sand-200 bg-white p-1" role="group" aria-label="Filter messages">
        {tabs.map(([v, l, n]) => (
          <button key={v} type="button" onClick={() => setFilter(v)} aria-pressed={filter === v} className={filter === v ? 'tab-active' : 'tab'}>
            {l} <span className="ml-1 text-xs opacity-70">{n}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="surface">
          <EmptyState icon="mail" title={filter === 'unread' ? 'You’re all caught up' : 'No messages here'} description="New enquiries from the Contact page will appear here." />
        </div>
      ) : (
        <ul className="space-y-3">
          {shown.map((m) => {
            const busy = busyId === m.message_id;
            const replySubject = encodeURIComponent(`Re: ${m.subject || 'Your enquiry'}`);
            return (
              <li key={m.message_id}>
                <article className={`card ${m.is_read ? '' : 'border-l-4 border-l-primary'}`}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-body text-base font-semibold text-accent">{m.subject || 'General enquiry'}</h2>
                        {!m.is_read && <span className="badge-brand">New</span>}
                      </div>
                      <p className="mt-0.5 text-sm text-gray-600">
                        {m.name} · <span className="break-all">{m.email}</span>
                        {m.phone ? ` · ${m.phone}` : ''}
                      </p>
                    </div>
                    <time className="shrink-0 text-xs text-gray-500" dateTime={m.created_at}>
                      {new Date(m.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </time>
                  </div>
                  <p className="mt-3 whitespace-pre-line leading-relaxed text-gray-700">{m.message}</p>
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-sand-100 pt-3">
                    <a href={`mailto:${m.email}?subject=${replySubject}`} className="btn-secondary btn-sm">
                      <Icon name="mail" className="h-4 w-4" /> Reply by email
                    </a>
                    {m.phone && (
                      <a href={`tel:${m.phone}`} className="btn-ghost btn-sm">
                        <Icon name="phone" className="h-4 w-4" /> Call
                      </a>
                    )}
                    <button type="button" onClick={() => setRead(m, !m.is_read)} disabled={busy} className="btn-ghost btn-sm">
                      <Icon name={m.is_read ? 'mail' : 'check'} className="h-4 w-4" /> Mark as {m.is_read ? 'unread' : 'read'}
                    </button>
                    <button type="button" onClick={() => remove(m)} disabled={busy} className="btn-ghost btn-sm text-red-700 hover:bg-red-50 hover:text-red-800">
                      <Icon name="trash" className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
      <LoadMore loaded={messages.length} total={total} loading={loadingMore} onLoadMore={loadMore} noun="messages" />
    </div>
  );
};

export default AdminMessages;
