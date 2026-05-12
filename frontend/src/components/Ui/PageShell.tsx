import type { ReactNode } from "react";

type PageShellSize = "sm" | "md" | "lg";

const sizeClass: Record<PageShellSize, string> = {
  sm: "max-w-xl",
  md: "max-w-3xl",
  lg: "max-w-6xl",
};

type PageShellProps = {
  children: ReactNode;
  size?: PageShellSize;
  className?: string;
};

/** Standard centered page shell used across every routed page. */
const PageShell = ({ children, size = "md", className = "" }: PageShellProps) => (
  <div
    className={`mx-auto w-full ${sizeClass[size]} px-4 py-8 text-left sm:px-6 sm:py-10 ${className}`}
  >
    {children}
  </div>
);

export default PageShell;
