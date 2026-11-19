import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon';

const SIZES = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

let openCount = 0;

/**
 * Accessible dialog: focus moves into the dialog and is trapped there,
 * Escape / backdrop click close it, focus returns to the trigger afterwards
 * and the page behind does not scroll. On phones it docks to the bottom.
 */
const Modal = ({
  open = true,
  onClose,
  title,
  description,
  size = 'md',
  children,
  footer,
  dismissible = true,
  initialFocus,
}) => {
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();
  const descId = useId();
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    openCount += 1;
    document.body.style.overflow = 'hidden';

    const panel = panelRef.current;
    const target =
      (initialFocus && panel?.querySelector(initialFocus)) ||
      panel?.querySelector('[data-autofocus]') ||
      panel?.querySelector('input:not([type="hidden"]):not([disabled]), select, textarea') ||
      panel?.querySelector(FOCUSABLE);
    (target || panel)?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape' && dismissible) {
        e.stopPropagation();
        onCloseRef.current?.();
      } else if (e.key === 'Tab' && panel) {
        const items = [...panel.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    panel?.addEventListener('keydown', onKey);

    return () => {
      panel?.removeEventListener('keydown', onKey);
      openCount -= 1;
      if (openCount <= 0) document.body.style.overflow = '';
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') previouslyFocused.focus();
    };
  }, [open, dismissible, initialFocus]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-accent-dark/50 backdrop-blur-[1px] animate-fade-in"
        onClick={dismissible ? () => onCloseRef.current?.() : undefined}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={`relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-drawer outline-none animate-scale-in sm:rounded-2xl ${
          SIZES[size] || SIZES.md
        }`}
      >
        {title && (
          <div className="flex items-start justify-between gap-4 border-b border-sand-200 px-5 py-4 sm:px-6">
            <div className="min-w-0">
              <h2 id={titleId} className="font-heading text-xl font-semibold text-accent">
                {title}
              </h2>
              {description && (
                <p id={descId} className="mt-1 text-sm text-gray-600">
                  {description}
                </p>
              )}
            </div>
            {dismissible && (
              <button type="button" onClick={() => onCloseRef.current?.()} className="icon-btn -mr-2 shrink-0" aria-label="Close dialog">
                <Icon name="x" />
              </button>
            )}
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer && (
          <div className="flex flex-col-reverse gap-2 border-t border-sand-200 bg-sand-50 px-5 py-3 sm:flex-row sm:justify-end sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
