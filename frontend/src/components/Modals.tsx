import { useSearchParams } from "react-router-dom";

const inputClass =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[15px] text-[var(--text-h)] shadow-sm outline-none transition " +
    "placeholder:text-[var(--text)]/60 " +
    "focus:border-[var(--accent-border)] focus:ring-2 focus:ring-[var(--accent)]/25 " +
    "dark:bg-[color-mix(in_oklab,var(--bg)_100%,#000_12%)]";

const labelClass = "mb-1.5 block text-left text-[13px] font-medium tracking-wide text-[var(--text-h)]";

const AuthModal = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const mode = searchParams.get("mode");
    const isLogin = mode !== "signup";

    return (
        <div className="mx-auto w-full max-w-[480px] px-4 py-8 sm:px-6 sm:py-10">
            <section
                aria-labelledby="auth-panel-title"
                className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-8 shadow-[var(--shadow)] dark:border-[var(--border)] dark:bg-[color-mix(in_oklab,var(--bg)_92%,transparent)]"
            >
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[var(--accent-bg)] blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-12 h-36 w-36 rounded-full bg-[var(--accent-bg)] opacity-60 blur-3xl" />

                <div className="relative">
                    {isLogin ? (
                        <LoginForm onSwitchToSignup={() => setSearchParams({ mode: "signup" })} />
                    ) : (
                        <SignupForm onSwitchToLogin={() => setSearchParams({ mode: "login" })} />
                    )}
                </div>
            </section>
        </div>
    );
};

export default AuthModal;



const LoginForm = ({ onSwitchToSignup }: { onSwitchToSignup: () => void }) => {
    return (
        <div className="flex flex-col gap-6 text-left">
            <header className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                    Activity tracker
                </p>
                <h2
                    id="auth-panel-title"
                    className="text-2xl font-semibold tracking-tight text-[var(--text-h)] sm:text-[26px]"
                >
                    Welcome back
                </h2>
                <p className="text-[15px] leading-snug text-[var(--text)]">
                    Sign in to manage your tasks.
                </p>
            </header>

            <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                    e.preventDefault();
                }}
            >
                <div>
                    <label htmlFor="login-email" className={labelClass}>
                        Email
                    </label>
                    <input
                        id="login-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        className={inputClass}
                    />
                </div>
                <div>
                    <label htmlFor="login-password" className={labelClass}>
                        Password
                    </label>
                    <input
                        id="login-password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className={inputClass}
                    />
                </div>
                <button
                    type="submit"
                    className="mt-1 w-full rounded-xl bg-[var(--accent)] py-3.5 text-[15px] font-semibold text-white shadow-md transition hover:brightness-110 active:scale-[0.99] dark:text-[#0c0a10]"
                >
                    Sign in
                </button>
            </form>

            <p className="text-center text-[14px] text-[var(--text)]">
                No account?{" "}
                <button
                    type="button"
                    onClick={onSwitchToSignup}
                    className="font-semibold text-[var(--accent)] underline-offset-2 transition hover:underline"
                >
                    Create one
                </button>
            </p>
        </div>
    );
};


const SignupForm = ({ onSwitchToLogin }: { onSwitchToLogin: () => void }) => {
    return (
        <div className="flex flex-col gap-6 text-left">
            <header className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                    Activity tracker
                </p>
                <h2
                    id="auth-panel-title"
                    className="text-2xl font-semibold tracking-tight text-[var(--text-h)] sm:text-[26px]"
                >
                    Create your account
                </h2>
                <p className="text-[15px] leading-snug text-[var(--text)]">
                    Start tracking in under a minute.
                </p>
            </header>

            <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                    e.preventDefault();
                }}
            >
                <div>
                    <label htmlFor="signup-email" className={labelClass}>
                        Email
                    </label>
                    <input
                        id="signup-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        className={inputClass}
                    />
                </div>
                <div>
                    <label htmlFor="signup-password" className={labelClass}>
                        Password
                    </label>
                    <input
                        id="signup-password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        className={inputClass}
                    />
                </div>
                <div>
                    <label htmlFor="signup-confirm" className={labelClass}>
                        Confirm password
                    </label>
                    <input
                        id="signup-confirm"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        className={inputClass}
                    />
                </div>
                <button
                    type="submit"
                    className="mt-1 w-full rounded-xl bg-[var(--accent)] py-3.5 text-[15px] font-semibold text-white shadow-md transition hover:brightness-110 active:scale-[0.99] dark:text-[#0c0a10]"
                >
                    Create account
                </button>
            </form>

            <p className="text-center text-[14px] text-[var(--text)]">
                Already have an account?{" "}
                <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="font-semibold text-[var(--accent)] underline-offset-2 transition hover:underline"
                >
                    Sign in
                </button>
            </p>
        </div>
    );
};
