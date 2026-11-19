import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

/**
 * Lightweight, accessible toast notifications.
 *   const toast = useToast();
 *   toast.success('Saved');  toast.error(err.message);  toast.info('...');
 * Call success() only after the API has confirmed the operation.
 */
const ToastContext = createContext(null);

const STYLES = {
  success: 'bg-green-50 border-green-500 text-green-800',
  error: 'bg-red-50 border-red-500 text-red-800',
  info: 'bg-blue-50 border-blue-500 text-blue-800',
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const show = useCallback(
    (type, message, duration = type === 'error' ? 6000 : 4000) => {
      if (!message) return;
      const id = nextId.current++;
      setToasts((list) => [...list.slice(-3), { id, type, message }]);
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  const api = React.useMemo(
    () => ({
      success: (m, d) => show('success', m, d),
      error: (m, d) => show('error', m || 'Something went wrong. Please try again.', d),
      info: (m, d) => show('info', m, d),
    }),
    [show]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="fixed z-[100] right-4 left-4 sm:left-auto sm:w-96 flex flex-col gap-2"
        style={{ top: 'calc(env(safe-area-inset-top, 0px) + 5.5rem)' }}
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.type === 'error' ? 'alert' : 'status'}
            className={`border-l-4 rounded-lg shadow-lg px-4 py-3 flex items-start gap-3 ${STYLES[t.type]}`}
          >
            <p className="flex-1 text-sm font-medium">{t.message}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="text-current opacity-60 hover:opacity-100"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};

export default ToastContext;
