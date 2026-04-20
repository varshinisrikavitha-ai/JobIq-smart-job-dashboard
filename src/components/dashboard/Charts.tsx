import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, CartesianGrid, LabelList } from 'recharts';
import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';

function groupByCategory(items: { category: string }[]) {
  const map = new Map<string, number>();
  items.forEach((item) => map.set(item.category || 'Other', (map.get(item.category || 'Other') || 0) + 1));
  return [...map.entries()].map(([name, value]) => ({ name, value }));
}

function groupByLocation(items: { location: string }[]) {
  const map = new Map<string, number>();
  items.forEach((item) => {
    const location = item.location.includes(',') ? item.location.split(',')[0] : item.location;
    map.set(location, (map.get(location) || 0) + 1);
  });
  return [...map.entries()].slice(0, 6).map(([name, value]) => ({ name, value }));
}

export function Charts() {
  const { jobs, theme } = useApp();
  const categoryData = useMemo(() => groupByCategory(jobs.allJobs), [jobs.allJobs]);
  const locationData = useMemo(() => groupByLocation(jobs.allJobs), [jobs.allJobs]);
  const totalCategoryJobs = useMemo(() => categoryData.reduce((sum, item) => sum + item.value, 0), [categoryData]);
  const chartPalette = theme.darkMode
    ? ['#60a5fa', '#34d399', '#fbbf24', '#f472b6', '#a78bfa', '#22d3ee']
    : ['#1d4ed8', '#047857', '#b45309', '#be185d', '#5b21b6', '#0e7490'];
  const axisColor = theme.darkMode ? '#a9b8cd' : '#334155';
  const gridColor = theme.darkMode ? 'rgba(148,163,184,0.16)' : 'rgba(51,65,85,0.22)';
  const tooltipBg = theme.darkMode ? 'rgba(9, 14, 23, 0.95)' : 'rgba(255, 255, 255, 0.98)';
  const tooltipBorder = theme.darkMode ? '1px solid rgba(148,163,184,0.28)' : '1px solid rgba(51,65,85,0.24)';
  const tooltipText = theme.darkMode ? '#f8fafc' : '#0f172a';

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <section className="surface-card flex h-full min-h-[540px] flex-col border-blue-200 bg-blue-50/70 dark:border-slate-700 dark:bg-slate-900/70">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="section-title">Jobs by category</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Hiring demand distribution</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Clear split of role categories with distinct color coding for quick review.</p>
          </div>
        </div>
        <div className="h-72 rounded-3xl border border-blue-200 bg-blue-50 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                innerRadius={66}
                outerRadius={106}
                paddingAngle={4}
                stroke={theme.darkMode ? '#0b1220' : '#f8fbff'}
                strokeWidth={2}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={entry.name} fill={chartPalette[index % chartPalette.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: tooltipBg,
                  border: tooltipBorder,
                  borderRadius: '16px',
                  color: tooltipText,
                }}
                labelStyle={{ color: tooltipText }}
                itemStyle={{ color: tooltipText }}
                formatter={(value: number) => [`${value} roles`, 'Openings']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {categoryData.slice(0, 6).map((item, index) => {
            const percent = totalCategoryJobs > 0 ? Math.round((item.value / totalCategoryJobs) * 100) : 0;
            return (
              <div key={item.name} className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: chartPalette[index % chartPalette.length] }}
                    aria-hidden="true"
                  />
                  <span className="max-w-[10rem] truncate text-slate-700 dark:text-slate-200" title={item.name}>
                    {item.name}
                  </span>
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{percent}%</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="surface-card flex h-full min-h-[540px] flex-col border-blue-200 bg-blue-50/70 dark:border-slate-700 dark:bg-slate-900/70">
        <div className="mb-5">
          <p className="section-title">Jobs by location</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Most active markets</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Bar spacing and axis labels tuned for quick scanning and cleaner comparisons.</p>
        </div>
        <div className="h-80 rounded-3xl border border-blue-200 bg-blue-50 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={locationData} barCategoryGap="46%" barGap={16} barSize={28}>
              <CartesianGrid stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" stroke={axisColor} tickLine={false} axisLine={false} tick={{ fill: axisColor, fontSize: 12 }} />
              <YAxis stroke={axisColor} tickLine={false} axisLine={false} tick={{ fill: axisColor, fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: tooltipBg,
                  border: tooltipBorder,
                  borderRadius: '16px',
                  color: tooltipText,
                }}
                labelStyle={{ color: tooltipText }}
                itemStyle={{ color: tooltipText }}
                formatter={(value: number) => [`${value} roles`, 'Openings']}
                cursor={false}
              />
              <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                {locationData.map((entry, index) => (
                  <Cell key={entry.name} fill={chartPalette[index % chartPalette.length]} />
                ))}
                <LabelList dataKey="value" position="top" fill={axisColor} fontSize={11} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}