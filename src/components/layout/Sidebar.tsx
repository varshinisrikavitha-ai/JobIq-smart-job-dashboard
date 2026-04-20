import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/saved', label: 'Saved Jobs' },
  { to: '/login', label: 'Login' },
];

export function Sidebar() {
  const { jobs } = useApp();

  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="surface-card hidden w-72 shrink-0 flex-col justify-between lg:flex"
    >
      <div className="flex flex-1 flex-col">
        <div className="mb-8 flex items-center gap-4 px-1">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border-2 border-blue-400 bg-gradient-to-br from-blue-200 via-cyan-100 to-indigo-200 shadow-[inset_0_2px_8px_0_rgba(30,64,175,0.10)] dark:bg-gradient-to-br dark:from-blue-900 dark:via-sky-800 dark:to-indigo-900 dark:border-blue-700">
            <span className="text-xl font-bold text-blue-800 dark:text-white">JQ</span>
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-extrabold tracking-[-0.01em] whitespace-nowrap">
              <span className="text-[#111827] dark:text-slate-100">Job</span><span className="bg-gradient-to-r from-sky-500 to-indigo-400 bg-clip-text text-transparent ml-0.5">IQ</span>
            </p>
            <p className="text-xs mt-0.5 uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 leading-tight">Dashboard</p>
          </div>
        </div>

        <nav className="space-y-2 px-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'flex items-center rounded-2xl px-4 py-3 text-sm font-semibold transition',
                  isActive
                    ? 'border border-blue-300 bg-blue-100 text-blue-800 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-sky-200'
                    : 'text-slate-600 hover:bg-blue-100 hover:text-blue-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-6 rounded-3xl border border-blue-300 bg-blue-100 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Market pulse</p>
        <div className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center justify-between">
            <span>Total jobs</span>
            <strong className="metric-value text-xl">{jobs.totalJobs}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span>Remote jobs</span>
            <strong className="text-lg font-bold text-sky-700 dark:text-sky-300">{jobs.remoteJobs}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span>Saved jobs</span>
            <strong className="text-lg font-bold text-indigo-700 dark:text-indigo-300">{jobs.totalSaved}</strong>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}