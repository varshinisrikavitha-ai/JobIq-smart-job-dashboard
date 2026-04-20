import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { ScoreBadge } from '../components/ui/ScoreBadge';
import { calculateMatchScore } from '../utils/scoring';

export function JobDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { jobs } = useApp();
  const jobId = Number(params.jobId);
  const job = jobs.getJobById(jobId);

  if (!job) {
    return (
      <div className="glass-card rounded-3xl p-8 text-center">
      <h2 className="text-2xl font-semibold text-slate-900">Job not found</h2>
      <p className="mt-2 text-sm text-slate-600">The listing may have moved or is no longer available in the live feed.</p>
        <Link to="/" className="mt-6 inline-block">
          <Button>Back to dashboard</Button>
        </Link>
      </div>
    );
  }

  const score = calculateMatchScore(job, jobs.filters, jobs.preferences);
  const saved = jobs.isSaved(job.id);
  const descriptionHtml = job.description.replace(
    /<p>([A-Z][A-Z0-9\s&,'"()\-./]{3,}:)<\/p>/g,
    '<h3>$1</h3>'
  ).replace(
    /<p>([^<]{1,80}:)<\/p>/g,
    '<h3>$1</h3>'
  );

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <section className="surface-card md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="section-title">Job details</p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">{job.title}</h2>
            <p className="mt-3 text-lg text-slate-600">{job.company}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="panel-chip">{job.location}</span>
              <span className="panel-chip">{job.jobType}</span>
              <span className="panel-chip">{job.salary}</span>
            </div>
          </div>
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <ScoreBadge score={score} />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => jobs.toggleSavedJob(job)}
                className="rounded-2xl border border-cyan-300 bg-cyan-50 px-4 py-2.5 text-sm font-semibold text-cyan-900 transition hover:bg-cyan-100 dark:border-cyan-300 dark:bg-cyan-50 dark:text-cyan-900 dark:hover:bg-cyan-100"
              >
                {saved ? 'Remove saved' : 'Save job'}
              </button>
              <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold !text-white shadow-[0_10px_22px_rgba(37,99,235,0.22)] transition hover:brightness-105 dark:from-blue-600 dark:to-indigo-600 dark:!text-white"
                style={{ color: '#ffffff' }}
              >
                Apply now
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="surface-card md:p-7">
          <p className="section-title">Description</p>
          <p className="mt-2 text-sm text-slate-600">Read through responsibilities, requirements, and application details.</p>
          <div
            className="details-content job-description mt-5 rounded-2xl p-5 md:p-6"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        </div>
        <div className="space-y-4">
          <div className="surface-card details-side-card md:p-7">
            <p className="section-title">Signals</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p className="leading-6"><span className="text-base font-black tracking-tight text-slate-900 dark:text-slate-50">Published:</span> {new Date(job.publishedAt).toLocaleString()}</p>
              <p className="leading-6"><span className="font-black text-slate-900 dark:text-slate-50">Category:</span> {job.category}</p>
              <p className="leading-6"><span className="font-black text-slate-900 dark:text-slate-50">Tags:</span> {job.tags.join(', ') || 'None'}</p>
              <p className="leading-6"><span className="font-black text-slate-900 dark:text-slate-50">Company:</span> {job.company}</p>
            </div>
          </div>
          <div className="surface-card details-side-card md:p-7">
            <p className="section-title">Quick action</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Save this role to keep it in your shortlist. Your preferences and saved jobs persist across sessions.
            </p>
            <button
              type="button"
              onClick={() => {
                if (saved) {
                  navigate('/saved');
                  return;
                }
                jobs.toggleSavedJob(job);
              }}
              className="mt-5 inline-flex items-center justify-center rounded-2xl border border-cyan-300 bg-cyan-50 px-4 py-2.5 text-sm font-semibold text-cyan-900 transition hover:bg-cyan-100 dark:border-cyan-300 dark:bg-cyan-50 dark:text-cyan-900 dark:hover:bg-cyan-100"
            >
              {saved ? 'Open saved jobs' : 'Save job'}
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
}