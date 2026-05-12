import { Component, type ErrorInfo, type ReactNode } from "react";
import {
  cardClass,
  errorNoticeClass,
  primaryBtnClass,
} from "../../styles/classNames";
import PageShell from "../Ui/PageShell";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

/**
 * App-level boundary so an unexpected render error doesn't leave a blank page.
 * Mounted once at the root, below `BrowserRouter` so the user can still navigate.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[ErrorBoundary] uncaught render error", error, info);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <PageShell>
        <div className={cardClass}>
          <h1 className="!m-0 !text-2xl !tracking-tight text-[var(--text-h)]">
            Something went wrong
          </h1>
          <p className="mt-2 text-[14px] text-[var(--text)]">
            The page hit an unexpected error. You can try again or go home.
          </p>
          {this.state.error?.message ? (
            <p className={`mt-4 ${errorNoticeClass}`}>
              {this.state.error.message}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={this.reset}
              className={primaryBtnClass}
            >
              Try again
            </button>
            <a href="/" className={primaryBtnClass}>
              Go home
            </a>
          </div>
        </div>
      </PageShell>
    );
  }
}

export default ErrorBoundary;
