import type { JobListing } from '../types/jobs';

function normalize(text: string) {
  return text.toLowerCase().trim();
}

export function toPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseSalaryAmount(salary: string): number | null {
  const matches = salary.matchAll(/(\d+(?:[.,]\d+)?)\s*(k)?/gi);
  const values: number[] = [];

  for (const match of matches) {
    const numericRaw = match[1]?.replace(/,/g, '');
    if (!numericRaw) {
      continue;
    }

    const numeric = Number(numericRaw);
    if (Number.isNaN(numeric)) {
      continue;
    }

    const scaled = match[2] ? numeric * 1000 : numeric;
    values.push(scaled);
  }

  if (!values.length) {
    return null;
  }

  return Math.max(...values);
}

export function isRemoteJob(job: JobListing): boolean {
  const context = normalize(`${job.jobType} ${job.location} ${job.tags.join(' ')}`);
  return context.includes('remote') || context.includes('work from home') || context.includes('anywhere');
}

export function matchesJobType(job: JobListing, filterType: string): boolean {
  const selectedType = normalize(filterType);
  if (!selectedType || selectedType === 'all') {
    return true;
  }

  const context = normalize(`${job.jobType} ${job.location} ${job.tags.join(' ')}`);

  if (selectedType === 'remote') {
    return isRemoteJob(job);
  }

  if (selectedType === 'full-time') {
    return /full[\s-]?time|permanent/.test(context);
  }

  if (selectedType === 'part-time') {
    return /part[\s-]?time/.test(context);
  }

  if (selectedType === 'contract') {
    return /contract|freelance/.test(context);
  }

  return context.includes(selectedType);
}
