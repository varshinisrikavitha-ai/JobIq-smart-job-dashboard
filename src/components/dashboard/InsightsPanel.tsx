import { useApp } from '../../context/AppContext';

export function InsightsPanel() {
  const { jobs } = useApp();

  return (
    <section className="surface-card border-blue-200 bg-blue-50/70 dark:border-slate-700 dark:bg-slate-900/70">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="section-title">AI job insights</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Logic-based recommendations</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Fast readout designed to help a recruiter or reviewer understand fit at a glance.</p>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {jobs.insights.map((insight, index) => (
          <div key={insight} className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-200">Insight {index + 1}</p>
            {insight}
          </div>
        ))}
      </div>
    </section>
  );
}