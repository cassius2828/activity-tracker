import type { ComponentProps, FormEvent, ReactNode } from "react";
import {
  eyebrowClass,
  formStackClass,
  headerStackClass,
  inputClass,
  labelClass,
  modeFooterClass,
  modeLinkClass,
  panelSubtitleClass,
  panelTitleClass,
  primarySubmitClass,
  shellClass,
} from "./styles";

type AuthPanelHeaderProps = {
  titleId?: string;
  title: string;
  description: string;
  eyebrow?: string;
};

export const AuthPanelHeader = ({
  titleId = "auth-panel-title",
  title,
  description,
  eyebrow = "Activity tracker",
}: AuthPanelHeaderProps) => (
  <header className={headerStackClass}>
    <p className={eyebrowClass}>{eyebrow}</p>
    <h2 id={titleId} className={panelTitleClass}>
      {title}
    </h2>
    <p className={panelSubtitleClass}>{description}</p>
  </header>
);

type LabeledInputProps = {
  id: string;
  label: string;
  error?: string | null;
} & Pick<
  ComponentProps<"input">,
  "name" | "type" | "autoComplete" | "placeholder" | "value" | "onChange"
>;

export const LabeledInput = ({
  id,
  label,
  name,
  type,
  autoComplete,
  placeholder,
  value,
  onChange,
  error,
}: LabeledInputProps) => {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`${inputClass} ${
          error ? "border-rose-400/60 focus:border-rose-400" : ""
        }`}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
      />
      {error ? (
        <p
          id={errorId}
          className="mt-1 text-[12px] font-medium text-rose-700 dark:text-rose-300"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
};

type AuthSubmitButtonProps = {
  isLoading: boolean;
  loadingLabel: string;
  children: ReactNode;
};

export const AuthSubmitButton = ({
  isLoading,
  loadingLabel,
  children,
}: AuthSubmitButtonProps) => (
  <button
    type="submit"
    className={primarySubmitClass}
    disabled={isLoading}
  >
    {isLoading ? loadingLabel : children}
  </button>
);

type AuthModeFooterProps = {
  prompt: string;
  actionLabel: string;
  onAction: () => void;
};

export const AuthModeFooter = ({
  prompt,
  actionLabel,
  onAction,
}: AuthModeFooterProps) => (
  <p className={modeFooterClass}>
    {prompt}{" "}
    <button type="button" onClick={onAction} className={modeLinkClass}>
      {actionLabel}
    </button>
  </p>
);

type AuthFormShellProps = {
  title: string;
  description: string;
  onSubmit: (e: FormEvent) => void;
  footer: ReactNode;
  children: ReactNode;
};

/** Outer column + header + `<form>` + footer link row (matches login/signup layout). */
export const AuthFormShell = ({
  title,
  description,
  onSubmit,
  footer,
  children,
}: AuthFormShellProps) => (
  <div className={shellClass}>
    <AuthPanelHeader title={title} description={description} />
    <form className={formStackClass} onSubmit={onSubmit}>
      {children}
    </form>
    {footer}
  </div>
);
