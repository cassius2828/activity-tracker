type BarProps = {
  w?: string;
  h?: string;
  tone?: string;
};

/** Skeleton bar used inside the marketing-page mock screenshots. */
const Bar = ({ w = "w-full", h = "h-2.5", tone = "bg-[var(--code-bg)]" }: BarProps) => (
  <span className={`block rounded-full ${tone} ${h} ${w}`} />
);

export default Bar;
