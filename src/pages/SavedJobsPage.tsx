import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/dashboard/EmptyState';
import { ScoreBadge } from '../components/ui/ScoreBadge';
import { calculateMatchScore } from '../utils/scoring';

export function SavedJobsPage() {
  const { jobs } = useApp();

  if (!jobs.savedJobs.length) {
    return (
      <EmptyState
        title="No saved jobs yet"
        description="Bookmark roles from the dashboard or job details page and they will appear here automatically."
        actionLabel="Explore jobs"
        actionTo="/"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="surface-card">
        <p className="section-title">Saved jobs</p>
        <h2 className="mt-3 text-3xl font-extrabold text-slate-900">Your shortlist</h2>
        <p className="mt-2 text-sm text-slate-600">Everything you bookmarked lives here and persists in localStorage.</p>
      </div>
      <div className="grid gap-4">
        {jobs.savedJobs.map((job) => (
          <article key={job.id} className="surface-card grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{job.category}</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{job.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{job.company}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="panel-chip">{job.location}</span>
                <span className="panel-chip">{job.jobType}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 md:justify-self-end">
              <ScoreBadge score={calculateMatchScore(job, jobs.filters, jobs.preferences)} />
              <Link to={`/jobs/${job.id}`} className="action-primary">
                View
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}