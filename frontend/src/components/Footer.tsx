const Footer = () => {
  return (
    <footer className="mt-auto w-full border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="mx-auto max-w-[1126px] px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Activity tracker
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--text)]">
            Learning project — tasks, auth, and profiles. Replace dummy data with your API when you are ready.
          </p>
          <p className="mt-4 text-[12px] text-[var(--text)]/80">
            © {new Date().getFullYear()} · Built for practice
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
