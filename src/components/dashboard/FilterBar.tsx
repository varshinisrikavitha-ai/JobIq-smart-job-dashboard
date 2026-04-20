import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';
import type { SortOption } from '../../types/jobs';

export function FilterBar() {
  const { jobs } = useApp();

  return (
    <section className="surface-card border-blue-200 bg-blue-50/70 dark:border-slate-700 dark:bg-slate-900/70">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="section-title">Smart filters</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">Refine by role type, location, salary, and relevance</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Keep search scope tight with a clean control set that matches recruiter-grade dashboards.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={jobs.clearFilters}>
          Reset all
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-12 xl:items-end">
        <div className="auth-panel flex h-full flex-col rounded-2xl border border-blue-200 bg-blue-50/70 p-4 shadow-sm xl:col-span-4 dark:border-slate-700 dark:bg-slate-900/70">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">Keyword search</label>
          <Input
            value={jobs.filters.search}
            onChange={(event) => jobs.setSearch(event.target.value)}
            placeholder="Frontend, React, Product Designer..."
          />
        </div>

        <div className="auth-panel flex h-full flex-col rounded-2xl border border-blue-200 bg-blue-50/70 p-4 shadow-sm xl:col-span-2 dark:border-slate-700 dark:bg-slate-900/70">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">Location</label>
          <Input
            value={jobs.filters.location}
            onChange={(event) => jobs.setLocation(event.target.value)}
            placeholder="Remote or city"
          />
        </div>

        <div className="auth-panel flex h-full flex-col rounded-2xl border border-blue-200 bg-blue-50/70 p-4 shadow-sm xl:col-span-2 dark:border-slate-700 dark:bg-slate-900/70">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">Job type</label>
          <Select value={jobs.filters.jobType} onChange={(event) => jobs.setJobType(event.target.value)}>
            <option value="all">All types</option>
            <option value="remote">Remote</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
          </Select>
        </div>

        <div className="auth-panel flex h-full flex-col rounded-2xl border border-blue-200 bg-blue-50/70 p-4 shadow-sm xl:col-span-2 dark:border-slate-700 dark:bg-slate-900/70">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">Minimum salary</label>
          <Input
            type="number"
            min="0"
            value={jobs.filters.salaryMin}
            onChange={(event) => jobs.setSalaryMin(Number(event.target.value) || 0)}
            placeholder="e.g. 70000"
          />
        </div>

        <div className="auth-panel flex h-full flex-col rounded-2xl border border-blue-200 bg-blue-50/70 p-4 shadow-sm xl:col-span-2 dark:border-slate-700 dark:bg-slate-900/70">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">Sort by</label>
          <Select value={jobs.filters.sortBy} onChange={(event) => jobs.setSortBy(event.target.value as SortOption)}>
            <option value="score">Highest score</option>
            <option value="recent">Newest jobs</option>
            <option value="salary">Highest salary</option>
          </Select>
        </div>
      </div>
    </section>
  );
}