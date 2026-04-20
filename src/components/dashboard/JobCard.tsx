import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { JobListing } from '../../types/jobs';
import { useApp } from '../../context/AppContext';
import { ScoreBadge } from '../ui/ScoreBadge';
import { toPlainText } from '../../utils/jobFilters';

interface JobCardProps {
  job: JobListing & { matchScore?: number };
}

export function JobCard({ job }: JobCardProps) {
  const { jobs } = useApp();
  const saved = jobs.isSaved(job.id);
  const score = job.matchScore ?? 0;
  const description = toPlainText(job.description);

  return (
    <motion.article layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="auth-panel flex h-full flex-col rounded-3xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-h-[88px] flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-200">{job.category}</p>
          <h3 className="mt-2 text-lg font-semibold text-blue-700 dark:text-blue-100">{job.title}</h3>
          <p className="mt-1 text-sm text-slate-200">{job.company}</p>
        </div>
        <ScoreBadge score={score} />
      </div>

      <p className="mt-4 min-h-[110px] rounded-2xl border border-blue-300/20 bg-blue-300/10 p-3 text-sm leading-6 text-slate-100 dark:border-blue-200/20 dark:bg-blue-300/15 dark:text-slate-100">
        {description.slice(0, 210)}...
      </p>

      <div className="mt-4 flex min-h-[36px] flex-wrap gap-2">
        {job.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="job-pill">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between gap-3 text-sm text-slate-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="job-pill">{job.jobType}</span>
            <span className="job-pill">{job.location}</span>
            <span className="job-pill job-pill-indigo">{job.salary}</span>
          </div>
          <p className="whitespace-nowrap">{new Date(job.publishedAt).toLocaleDateString()}</p>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <Link
            to={`/jobs/${job.id}`}
            className="job-view-action inline-flex flex-1 items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition"
          >
            View details
          </Link>
          <button
            type="button"
            onClick={() => jobs.toggleSavedJob(job)}
            className={`job-save-action rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${saved ? 'is-saved' : ''}`}
          >
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </motion.article>
  );
}