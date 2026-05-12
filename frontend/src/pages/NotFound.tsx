import { Link } from "react-router-dom";
import PageShell from "../components/Ui/PageShell";
import { eyebrowClass, primaryBtnClass } from "../styles/classNames";

const NotFound = () => (
  <PageShell>
    <header className="mb-6 space-y-2">
      <p className={eyebrowClass}>404</p>
      <h1 className="!m-0 !text-3xl !tracking-tight text-[var(--text-h)] sm:!text-4xl">
        Page not found
      </h1>
      <p className="text-[15px] text-[var(--text)]">
        The page you tried to open doesn't exist or has moved.
      </p>
    </header>
    <Link to="/" className={primaryBtnClass}>
      Go home
    </Link>
  </PageShell>
);

export default NotFound;
