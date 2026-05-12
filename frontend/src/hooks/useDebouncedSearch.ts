import { useEffect, useState } from "react";

type Options<T> = {
  /** Raw search input. The hook trims and debounces it. */
  query: string;
  /** Skip running the search (e.g. unauthenticated, panel hidden). */
  enabled?: boolean;
  /** Debounce in ms. Defaults to 300. */
  delayMs?: number;
  /** Called with the trimmed query + an `AbortSignal` for the current request. */
  fetcher: (trimmed: string, signal: AbortSignal) => Promise<T>;
};

type State<T> = {
  results: T | null;
  isLoading: boolean;
  error: unknown;
};

/**
 * Debounced async search with cancellation.
 * - Empty (trimmed) query short-circuits to `results = null`.
 * - Each new keystroke aborts the in-flight request via AbortController.
 */
export const useDebouncedSearch = <T,>({
  query,
  enabled = true,
  delayMs = 300,
  fetcher,
}: Options<T>): State<T> => {
  const [state, setState] = useState<State<T>>({
    results: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!enabled) {
      setState({ results: null, isLoading: false, error: null });
      return;
    }
    const trimmed = query.trim();
    if (!trimmed) {
      setState({ results: null, isLoading: false, error: null });
      return;
    }

    const controller = new AbortController();
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const timeoutId = window.setTimeout(async () => {
      try {
        const results = await fetcher(trimmed, controller.signal);
        if (controller.signal.aborted) return;
        setState({ results, isLoading: false, error: null });
      } catch (error) {
        if (controller.signal.aborted) return;
        setState({ results: null, isLoading: false, error });
      }
    }, delayMs);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [query, enabled, delayMs, fetcher]);

  return state;
};
