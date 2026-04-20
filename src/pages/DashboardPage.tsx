import { motion } from 'framer-motion';
import { useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { FilterBar } from '../components/dashboard/FilterBar';
import { StatsCards } from '../components/dashboard/StatsCards';
import { Charts } from '../components/dashboard/Charts';
import { InsightsPanel } from '../components/dashboard/InsightsPanel';
import { JobCard } from '../components/dashboard/JobCard';
import { LoadingSkeleton } from '../components/dashboard/LoadingSkeleton';
import { EmptyState } from '../components/dashboard/EmptyState';
import { ErrorState } from '../components/dashboard/ErrorState';
import { PreferencesPanel } from '../components/dashboard/PreferencesPanel';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

export function DashboardPage() {
  const { jobs } = useApp();
  const hasMoreJobs = jobs.filteredJobs.length < jobs.filteredCount;

  const loadMoreJobs = useCallback(() => {
    if (!jobs.loading && hasMoreJobs) {
      jobs.nextPage();
    }
  }, [hasMoreJobs, jobs]);

  const { sentinelRef } = useInfiniteScroll({
    enabled: !jobs.loading && !jobs.error && hasMoreJobs,
    onLoadMore: loadMoreJobs,
  });

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <section className="glass-card overflow-hidden rounded-3xl p-6 md:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr] xl:items-stretch">
          <div className="flex flex-col justify-center">
            <p className="section-title">Job seeker command center</p>
              <h2 className="headline mt-6 mb-4 max-w-2xl">
                Find the <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent font-extrabold">best-fit roles</span>, track them instantly, and stay ahead of the market.
              </h2>
            <p className="subtle-text mt-4 max-w-2xl">
              Live listings from Remotive, match scoring, sorting, analytics, and saved jobs in one focused workspace.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1 xl:self-stretch">
            <div className="auth-panel panel-blue flex h-full flex-col justify-between rounded-3xl p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Match engine</p>
              <p className="mt-3 text-3xl font-extrabold text-blue-700 dark:text-blue-100">Signal scoring</p>
              <p className="mt-2 text-sm text-slate-600">Keyword, location, and salary fit blended into one score.</p>
            </div>
            <div className="auth-panel panel-sky flex h-full flex-col justify-between rounded-3xl p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Saved state</p>
              <p className="mt-3 text-3xl font-extrabold text-sky-700 dark:text-sky-100">Persistent</p>
              <p className="mt-2 text-sm text-slate-600">Bookmarks and preferences stay in localStorage.</p>
            </div>
            <div className="auth-panel panel-indigo flex h-full flex-col justify-between rounded-3xl p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Flow</p>
              <p className="mt-3 text-3xl font-extrabold text-indigo-700 dark:text-indigo-100">Fast</p>
              <p className="mt-2 text-sm text-slate-600">Motion, dark mode, and high-contrast controls built in.</p>
            </div>
          </div>
        </div>
      </section>

      <StatsCards totalJobs={jobs.totalJobs} remoteJobs={jobs.remoteJobs} savedJobs={jobs.totalSaved} />
      <FilterBar />
      <PreferencesPanel />

      {jobs.loading ? <LoadingSkeleton /> : jobs.error ? <ErrorState message={jobs.error} /> : null}

      {!jobs.loading && !jobs.error ? (
        <div className="space-y-6">
          {jobs.filteredJobs.length > 0 ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 items-stretch">
                {jobs.filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
              <div className="surface-card flex flex-col items-center gap-2 text-center">
                <p className="text-sm text-slate-600">
                  Showing <span className="font-semibold text-slate-900">{jobs.filteredJobs.length}</span> of{' '}
                  <span className="font-semibold text-slate-900">{jobs.filteredCount}</span> jobs
                </p>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  {hasMoreJobs ? 'Scroll to load more' : 'You reached the end of the feed'}
                </p>
                <div ref={sentinelRef} className="h-2 w-full" aria-hidden="true" />
              </div>
            </>
          ) : (
            <EmptyState
              title="No jobs matched your filters"
              description="Try broadening your location, lowering the salary threshold, or resetting the search filters to reveal more opportunities."
              actionLabel="Reset filters"
              actionTo="/"
            />
          )}
        </div>
      ) : null}

      <Charts />
      <InsightsPanel />
    </motion.div>
  );
}