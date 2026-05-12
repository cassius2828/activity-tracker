import {
  dangerBtnClass,
  primaryBtnClass,
  subtleBtnClass,
} from "../../styles/classNames";
import Modal from "./Modal";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Use the destructive button style for the confirm action (default: false). */
  destructive?: boolean;
  /** Disable confirm + suppress close while an async action is in flight. */
  isWorking?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Small confirmation dialog. Replaces `window.confirm` for consistent UX. */
const ConfirmModal = ({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  isWorking = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => (
  <Modal
    open={open}
    onClose={onCancel}
    lockClose={isWorking}
    ariaLabel={title}
    panelClassName="max-w-sm"
  >
    <div className="px-6 py-5">
      <h2 className="!m-0 !text-lg !tracking-tight text-[var(--text-h)]">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 text-[14px] text-[var(--text)]">{description}</p>
      ) : null}
      <div className="mt-5 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isWorking}
          className={subtleBtnClass}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isWorking}
          className={destructive ? dangerBtnClass : primaryBtnClass}
        >
          {isWorking ? "Working..." : confirmLabel}
        </button>
      </div>
    </div>
  </Modal>
);

export default ConfirmModal;
