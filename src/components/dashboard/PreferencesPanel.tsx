import { useMemo, useState, type FormEvent } from 'react';
import { useApp } from '../../context/AppContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const suggestedKeywords = ['frontend', 'react', 'remote', 'product', 'design', 'typescript', 'full-stack', 'node'];

function normalizeKeyword(value: string) {
  return value.trim().toLowerCase();
}

export function PreferencesPanel() {
  const { jobs } = useApp();
  const [keywordInput, setKeywordInput] = useState('');

  const keywords = jobs.preferences.favoriteKeywords;
  const hasKeywords = keywords.length > 0;

  const availableSuggestions = useMemo(
    () => suggestedKeywords.filter((keyword) => !keywords.includes(keyword)),
    [keywords]
  );

  const addKeyword = (rawKeyword: string) => {
    const keyword = normalizeKeyword(rawKeyword);
    if (!keyword || keywords.includes(keyword)) {
      setKeywordInput('');
      return;
    }

    jobs.setFavoriteKeywords([...keywords, keyword].slice(0, 12));
    setKeywordInput('');
  };

  const removeKeyword = (keyword: string) => {
    jobs.setFavoriteKeywords(keywords.filter((item) => item !== keyword));
  };

  const onKeywordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addKeyword(keywordInput);
  };

  return (
    <section className="surface-card border-blue-200 bg-blue-50/70 dark:border-slate-700 dark:bg-slate-900/70">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="section-title">Preference settings</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">Personalize your scoring engine</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            These values improve match scoring quality by prioritizing your preferred location, compensation floor, and role keywords.
          </p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-blue-200">
          Persisted in local storage
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="auth-panel rounded-2xl border border-blue-200 bg-blue-50/70 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Preferred location goal</label>
          <Input
            value={jobs.preferences.preferredLocation}
            onChange={(event) => jobs.setPreferredLocation(event.target.value)}
            placeholder="Remote, Europe, New York..."
          />
        </div>

        <div className="auth-panel rounded-2xl border border-blue-200 bg-blue-50/70 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Target minimum salary</label>
          <Input
            type="number"
            min="0"
            value={jobs.preferences.salaryMin}
            onChange={(event) => jobs.setPreferredSalary(Number(event.target.value) || 0)}
            placeholder="Expected annual salary"
          />
        </div>
      </div>

      <div className="mt-4 auth-panel rounded-2xl border border-blue-200 bg-blue-50/70 p-4 shadow-sm md:p-5 dark:border-slate-700 dark:bg-slate-900/70">
        <div className="mb-3 flex items-center justify-between gap-3">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Priority keywords</label>
          <span className="text-xs text-slate-500">{keywords.length}/12</span>
        </div>

        <form onSubmit={onKeywordSubmit} className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <Input
            value={keywordInput}
            onChange={(event) => setKeywordInput(event.target.value)}
            placeholder="Add keyword and press Enter"
          />
          <Button type="submit" className="job-view-action text-slate-50">Add keyword</Button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {hasKeywords ? (
            keywords.map((keyword) => (
              <button
                key={keyword}
                type="button"
                onClick={() => removeKeyword(keyword)}
                className="inline-flex h-9 items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-4 text-xs font-semibold uppercase tracking-[0.08em] leading-none text-slate-700 transition hover:border-blue-300 hover:bg-blue-100 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-blue-200 dark:hover:bg-slate-800 dark:hover:text-blue-100"
              >
                {keyword} ×
              </button>
            ))
          ) : (
            <p className="text-sm text-slate-600">No keywords yet. Add a few to improve fit scoring.</p>
          )}
        </div>

        {availableSuggestions.length > 0 ? (
          <div className="mt-4 border-t border-blue-200 pt-4 dark:border-slate-700">
            <p className="mb-2 text-xs uppercase tracking-[0.16em] text-slate-500">Suggested</p>
            <div className="flex flex-wrap items-center gap-2">
              {availableSuggestions.map((keyword) => (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => addKeyword(keyword)}
                  className="inline-flex h-9 items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-4 text-xs font-semibold uppercase tracking-[0.08em] leading-none text-slate-700 transition hover:border-blue-300 hover:bg-blue-100 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-blue-200 dark:hover:bg-slate-800 dark:hover:text-blue-100"
                >
                  + {keyword}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
