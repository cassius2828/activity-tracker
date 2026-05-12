import { useEffect } from "react";

type Options = {
  /** Whether the modal is currently open. */
  open: boolean;
  /** Called when the user presses Escape. Ignored while `lockClose` is true. */
  onClose: () => void;
  /** Block the Escape close handler (e.g. while a submit is in flight). */
  lockClose?: boolean;
};

/**
 * Wires standard modal chrome behaviors:
 *   - Locks page scroll while open (sets `body.overflow: hidden`).
 *   - Closes on Escape (unless `lockClose` is true).
 */
export const useModalChrome = ({ open, onClose, lockClose = false }: Options) => {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !lockClose) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, lockClose, onClose]);
};
