import { motion } from 'framer-motion';

interface StatsCardsProps {
  totalJobs: number;
  remoteJobs: number;
  savedJobs: number;
}

const cards = [
  { label: 'Total jobs fetched', panel: 'panel-blue', text: 'text-blue-700 dark:text-blue-100', dot: 'bg-blue-500 dark:bg-blue-300' },
  { label: 'Remote jobs count', panel: 'panel-sky', text: 'text-sky-700 dark:text-sky-100', dot: 'bg-sky-500 dark:bg-sky-300' },
  { label: 'Saved jobs', panel: 'panel-indigo', text: 'text-indigo-700 dark:text-indigo-100', dot: 'bg-indigo-500 dark:bg-indigo-300' },
];

export function StatsCards({ totalJobs, remoteJobs, savedJobs }: StatsCardsProps) {
  const values = [totalJobs, remoteJobs, savedJobs];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08, duration: 0.4 }}
          className={`auth-panel ${card.panel} flex h-full min-h-[132px] flex-col justify-between rounded-3xl p-5`}
        >
          <div className="flex items-center justify-between">
            <p className="metric-label text-slate-600 dark:text-slate-200">{card.label}</p>
            <span className={`h-2.5 w-2.5 rounded-full ${card.dot}`} />
          </div>
          <p className={`metric-value mt-3 ${card.text}`}>{values[index]}</p>
        </motion.div>
      ))}
    </div>
  );
}