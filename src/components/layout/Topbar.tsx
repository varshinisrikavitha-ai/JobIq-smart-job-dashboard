import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

function ThemeIcon({ darkMode }: { darkMode: boolean }) {
  if (darkMode) {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
        <path
          d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z"
          fill="currentColor"
          opacity="0.95"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Topbar() {
  const { auth, theme, jobs } = useApp();

  return (
    <header className="surface-card rounded-3xl px-5 py-4 md:px-6 md:py-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="section-title">Career analytics cockpit</p>
          <h1 className="mt-2 text-xl font-semibold text-white md:text-2xl">Track, score, and prioritize your next opportunity</h1>
          <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600">
            Live jobs, ranking signals, saved roles, and a faster workflow for focused job searches.
          </p>
        </div>

      <div className="flex flex-wrap items-center gap-3 lg:justify-end">
        <button
          type="button"
          onClick={theme.toggleTheme}
          className="theme-toggle inline-flex h-11 w-11 items-center justify-center rounded-2xl transition"
          aria-label={theme.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <motion.span
            key={theme.darkMode ? 'dark' : 'light'}
            initial={{ opacity: 0, rotate: -35, scale: 0.9 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 35, scale: 0.85 }}
            transition={{ duration: 0.22 }}
            className="text-blue-700 dark:text-sky-200"
          >
            <ThemeIcon darkMode={theme.darkMode} />
          </motion.span>
        </button>
        <Link
          to="/saved"
          className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-slate-700 dark:bg-slate-900/70 dark:text-sky-200 dark:hover:bg-slate-800"
        >
          Saved {jobs.totalSaved}
        </Link>
        {auth.user ? (
          <div className="flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900/70">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-blue-200/70 text-xs font-bold text-blue-800 dark:bg-sky-300/20 dark:text-sky-100">
              {auth.user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{auth.user.name}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">{auth.user.role}</p>
            </div>
            <button
              type="button"
              onClick={auth.logout}
              className="logout-action ml-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-slate-50 transition hover:brightness-105"
          >
            Login
          </Link>
        )}
      </div>
      </div>
    </header>
  );
}