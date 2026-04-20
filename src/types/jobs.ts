export interface JobApiRecord {
  id: number;
  url: string;
  title: string;
  company_name: string;
  category: string;
  job_type: string;
  publication_date: string;
  candidate_required_location: string;
  salary: string | null;
  tags: string[];
  description: string;
  company_logo: string | null;
}

export interface JobsApiResponse {
  jobs: JobApiRecord[];
}

export interface JobListing {
  id: number;
  title: string;
  company: string;
  category: string;
  jobType: string;
  location: string;
  salary: string;
  tags: string[];
  description: string;
  url: string;
  publishedAt: string;
  companyLogo: string | null;
}

export interface UserPreferences {
  preferredLocation: string;
  salaryMin: number;
  favoriteKeywords: string[];
}

export interface AuthUser {
  name: string;
  email: string;
  role: string;
}

export interface AuthAccount extends AuthUser {
  password: string;
}

export type SortOption = 'score' | 'recent' | 'salary';

export interface FiltersState {
  search: string;
  location: string;
  jobType: string;
  salaryMin: number;
  sortBy: SortOption;
}
