import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import Icon from '../components/ui/Icon';

/**
 * Lightweight, accessible toast notifications.
 *   const toast = useToast();
 *   toast.success('Saved');  toast.error(err.message);  toast.info('...');
 * Call success() only after the API has confirmed the operation.
 */
const ToastContext = createContext(null);

const STYLES = {
  success: ['text-green-700', 'checkCircle'],
  error: ['text-red-700', 'xCircle'],
  info: ['text-sky-700', 'info'],
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
        className="pointer-events-none fixed inset-x-4 z-[100] flex flex-col items-end gap-2 sm:left-auto sm:right-6 sm:w-96"
        style={{ top: 'calc(env(safe-area-inset-top, 0px) + 4.75rem)' }}
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((t) => {
          const [tone, icon] = STYLES[t.type];
          return (
            <div
              key={t.id}
              role={t.type === 'error' ? 'alert' : 'status'}
              className="pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-sand-200 bg-white px-4 py-3 shadow-lift animate-rise-in"
            >
              <Icon name={icon} className={`mt-0.5 h-5 w-5 shrink-0 ${tone}`} />
              <p className="flex-1 text-sm font-medium text-accent">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="-mr-1 rounded p-0.5 text-gray-400 hover:text-accent"
                aria-label="Dismiss notification"
              >
                <Icon name="x" className="h-4 w-4" />
              </button>
            </div>
          );
        })}
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
