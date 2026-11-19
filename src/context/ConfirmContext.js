import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import Modal from '../components/ui/Modal';
import Icon from '../components/ui/Icon';

/**
 * Promise-based confirmation dialogs (replaces window.confirm / window.prompt).
 *
 *   const confirm = useConfirm();
 *   if (!(await confirm({ title: 'Delete batch?', message: '…', confirmLabel: 'Delete', tone: 'danger' }))) return;
 *
 *   // With a text field (resolves to { value } or false when cancelled):
 *   const res = await confirm({ title: 'Reject upload', input: { label: 'Reason', required: true } });
 *   if (!res) return;  res.value …
 */
const ConfirmContext = createContext(null);

export const ConfirmProvider = ({ children }) => {
  const [state, setState] = useState(null);
  const [value, setValue] = useState('');
  const resolver = useRef(null);

  const confirm = useCallback((options) => {
    setValue(options.input?.defaultValue || '');
    setState(options);
    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const finish = (result) => {
    resolver.current?.(result);
    resolver.current = null;
    setState(null);
  };

  const submit = (e) => {
    e.preventDefault();
    if (state.input) {
      if (state.input.required && !value.trim()) return;
      finish({ value: value.trim() });
    } else {
      finish(true);
    }
  };

  const danger = state?.tone === 'danger';

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && (
        <Modal open onClose={() => finish(false)} size="sm">
          <form onSubmit={submit}>
            <div className="flex gap-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  danger ? 'bg-red-50 text-red-700' : 'bg-primary-50 text-primary'
                }`}
              >
                <Icon name={danger ? 'warning' : 'info'} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-heading text-lg font-semibold text-accent">{state.title}</h2>
                {state.message && <p className="mt-1 text-sm text-gray-600">{state.message}</p>}
                {state.input && (
                  <div className="mt-4">
                    <label htmlFor="confirm-input" className="form-label">
                      {state.input.label}
                      {!state.input.required && <span className="font-normal text-gray-500"> (optional)</span>}
                    </label>
                    {state.input.multiline ? (
                      <textarea
                        id="confirm-input"
                        data-autofocus
                        rows={3}
                        className="input-field"
                        value={value}
                        maxLength={state.input.maxLength || 500}
                        placeholder={state.input.placeholder}
                        onChange={(e) => setValue(e.target.value)}
                        required={state.input.required}
                      />
                    ) : (
                      <input
                        id="confirm-input"
                        data-autofocus
                        className="input-field"
                        value={value}
                        maxLength={state.input.maxLength || 500}
                        placeholder={state.input.placeholder}
                        onChange={(e) => setValue(e.target.value)}
                        required={state.input.required}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => finish(false)}
                data-autofocus={danger && !state.input ? true : undefined}
              >
                {state.cancelLabel || 'Cancel'}
              </button>
              <button
                type="submit"
                className={danger ? 'btn-danger' : 'btn-primary'}
                data-autofocus={!danger && !state.input ? true : undefined}
                disabled={state.input?.required && !value.trim()}
              >
                {state.confirmLabel || 'Confirm'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within a ConfirmProvider');
  return ctx;
};

export default ConfirmContext;
