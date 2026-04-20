import type { FiltersState, JobListing, UserPreferences } from '../types/jobs';

const keywordWeight = 0.5;
const locationWeight = 0.25;
const salaryWeight = 0.25;

function parseSalaryAmount(salary: string): number | null {
  const match = salary.replace(/,/g, '').match(/(\d{2,3})(?:\s*[-–]\s*(\d{2,3}))?/);
  if (!match) {
    return null;
  }

  const first = Number(match[1]);
  if (Number.isNaN(first)) {
    return null;
  }

  const scale = /k/i.test(salary) ? 1000 : 1;
  return first * scale;
}

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

function keywordScore(job: JobListing, filters: FiltersState, preferences: UserPreferences): number {
  const query = normalize(filters.search);
  if (!query) {
    return 0.55;
  }

  const haystack = [job.title, job.company, job.category, job.description, ...job.tags]
    .join(' ')
    .toLowerCase();

  const keywords = query.split(/\s+/).filter(Boolean);
  const hits = keywords.filter((keyword) => haystack.includes(keyword)).length;
  const preferenceHits = preferences.favoriteKeywords.filter((keyword) =>
    haystack.includes(keyword.toLowerCase())
  ).length;

  return Math.min(1, (hits / keywords.length) * 0.8 + preferenceHits * 0.08 + 0.1);
}

function locationScore(job: JobListing, filters: FiltersState, preferences: UserPreferences): number {
  const target = normalize(filters.location || preferences.preferredLocation);
  if (!target) {
    return job.location.toLowerCase().includes('remote') ? 0.9 : 0.65;
  }

  const location = normalize(job.location);
  if (location.includes(target)) {
    return 1;
  }

  if (target === 'remote' && location.includes('remote')) {
    return 1;
  }

  return location.includes('worldwide') ? 0.75 : 0.25;
}

function salaryScore(job: JobListing, filters: FiltersState, preferences: UserPreferences): number {
  const jobSalary = parseSalaryAmount(job.salary);
  const expected = filters.salaryMin || preferences.salaryMin;

  if (!jobSalary) {
    return expected === 0 ? 0.55 : 0.35;
  }

  if (expected === 0) {
    return 0.85;
  }

  if (jobSalary >= expected) {
    return 1;
  }

  return Math.max(0.2, jobSalary / expected);
}

export function calculateMatchScore(
  job: JobListing,
  filters: FiltersState,
  preferences: UserPreferences
): number {
  const score =
    keywordScore(job, filters, preferences) * keywordWeight +
    locationScore(job, filters, preferences) * locationWeight +
    salaryScore(job, filters, preferences) * salaryWeight;

  return Math.max(5, Math.round(score * 100));
}

export function scoreTone(score: number): 'green' | 'yellow' | 'red' {
  if (score >= 75) {
    return 'green';
  }

  if (score >= 50) {
    return 'yellow';
  }

  return 'red';
}

export function scoreLabel(score: number): string {
  if (score >= 85) {
    return 'High match';
  }

  if (score >= 65) {
    return 'Strong match';
  }

  if (score >= 45) {
    return 'Possible fit';
  }

  return 'Low match';
}
