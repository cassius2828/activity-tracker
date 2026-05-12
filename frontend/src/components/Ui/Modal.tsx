import type { ReactNode } from "react";
import { useModalChrome } from "../../hooks/useModalChrome";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  /** Set true while a submit is in flight to suppress Escape / overlay close. */
  lockClose?: boolean;
  ariaLabel: string;
  children: ReactNode;
  /** Override the inner panel max-width. Defaults to `max-w-lg`. */
  panelClassName?: string;
};

/**
 * Centered overlay modal with backdrop, escape-to-close, and body scroll lock.
 * Children render inside an unstyled card; provide your own header/body/footer.
 */
const Modal = ({
  open,
  onClose,
  lockClose = false,
  ariaLabel,
  children,
  panelClassName = "max-w-lg",
}: ModalProps) => {
  useModalChrome({ open, onClose, lockClose });

  if (!open) return null;

  const safeClose = () => {
    if (!lockClose) onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={safeClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/50 backdrop-blur-sm"
      />
      <div
        className={`relative z-10 w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-[var(--shadow)] ${panelClassName}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
