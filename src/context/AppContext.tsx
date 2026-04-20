import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { fetchJobs } from '../services/jobsService';
import type { AuthAccount, AuthUser, FiltersState, JobListing, SortOption, UserPreferences } from '../types/jobs';
import { calculateMatchScore } from '../utils/scoring';
import { isRemoteJob, matchesJobType, parseSalaryAmount, toPlainText } from '../utils/jobFilters';

interface AppContextValue {
  auth: {
    user: AuthUser | null;
    account: AuthAccount;
    signIn: (credentials: { email: string; password: string }) => boolean;
    signUp: (account: AuthAccount) => boolean;
    logout: () => void;
  };
  theme: {
    darkMode: boolean;
    toggleTheme: () => void;
  };
  jobs: {
    allJobs: JobListing[];
    filteredJobs: JobListing[];
    filteredCount: number;
    savedJobs: JobListing[];
    loading: boolean;
    error: string | null;
    page: number;
    pageSize: number;
    filters: FiltersState;
    preferences: UserPreferences;
    setSearch: (value: string) => void;
    setLocation: (value: string) => void;
    setJobType: (value: string) => void;
    setSalaryMin: (value: number) => void;
    setSortBy: (value: SortOption) => void;
    setPreferredLocation: (value: string) => void;
    setPreferredSalary: (value: number) => void;
    setFavoriteKeywords: (value: string[]) => void;
    toggleSavedJob: (job: JobListing) => void;
    isSaved: (jobId: number) => boolean;
    nextPage: () => void;
    prevPage: () => void;
    clearFilters: () => void;
    totalJobs: number;
    totalSaved: number;
    remoteJobs: number;
    topJobs: JobListing[];
    insights: string[];
    getJobById: (jobId: number) => JobListing | undefined;
  };
}

const defaultFilters: FiltersState = {
  search: '',
  location: '',
  jobType: 'all',
  salaryMin: 0,
  sortBy: 'score',
};

const defaultPreferences: UserPreferences = {
  preferredLocation: 'Remote',
  salaryMin: 0,
  favoriteKeywords: ['remote', 'frontend', 'product', 'design'],
};

const defaultAuthAccount: AuthAccount = {
  name: 'Avery Morgan',
  email: 'avery@smartjobs.dev',
  role: 'Growth Designer',
  password: 'password123',
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

function useThemeState() {
  const [darkMode, setDarkMode] = useLocalStorage('smart-theme', true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.documentElement.classList.toggle('light', !darkMode);
    document.documentElement.style.colorScheme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  return {
    darkMode,
    toggleTheme: () => setDarkMode((current) => !current),
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useThemeState();
  const [user, setUser] = useLocalStorage<AuthUser | null>('smart-user', null);
  const [account, setAccount] = useLocalStorage<AuthAccount>('smart-account', defaultAuthAccount);
  const [filters, setFilters] = useLocalStorage<FiltersState>('smart-filters', defaultFilters);
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>('smart-preferences', defaultPreferences);
  const [savedJobs, setSavedJobs] = useLocalStorage<JobListing[]>('smart-saved-jobs', []);
  const [allJobs, setAllJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(filters.search, 400);
  const pageSize = 12;

  useEffect(() => {
    let isMounted = true;

    async function loadJobs() {
      setLoading(true);
      setError(null);
      try {
        const jobs = await fetchJobs(debouncedSearch);
        if (!isMounted) {
          return;
        }
        setAllJobs(jobs);
      } catch {
        if (isMounted) {
          setError('We could not load live job data right now. Please retry in a moment.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadJobs();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [filters.search, filters.location, filters.jobType, filters.salaryMin, filters.sortBy]);

  const filteredJobs = useMemo(() => {
    const normalizedLocation = filters.location.toLowerCase().trim();
    const normalizedSearch = filters.search.toLowerCase().trim();

    const jobs = allJobs
      .map((job) => ({
        ...job,
        matchScore: calculateMatchScore(job, filters, preferences),
      }))
      .filter((job) => {
        const descriptionText = toPlainText(job.description);
        const matchesLocation =
          !normalizedLocation ||
          [job.location, ...job.tags, job.jobType]
            .join(' ')
            .toLowerCase()
            .includes(normalizedLocation);
        const matchesType = matchesJobType(job, filters.jobType);
        const salaryAmount = parseSalaryAmount(job.salary);
        const matchesSalary = filters.salaryMin === 0 ? true : salaryAmount !== null && salaryAmount >= filters.salaryMin;
        const matchesSearch =
          !normalizedSearch ||
          [job.title, job.company, job.category, descriptionText, job.jobType, job.location, ...job.tags]
            .join(' ')
            .toLowerCase()
            .includes(normalizedSearch);

        return matchesLocation && matchesType && matchesSalary && matchesSearch;
      });

    const sortedJobs = [...jobs].sort((firstJob, secondJob) => {
      if (filters.sortBy === 'recent') {
        return new Date(secondJob.publishedAt).getTime() - new Date(firstJob.publishedAt).getTime();
      }

      if (filters.sortBy === 'salary') {
        return (parseSalaryAmount(secondJob.salary) || 0) - (parseSalaryAmount(firstJob.salary) || 0);
      }

      return secondJob.matchScore - firstJob.matchScore;
    });

    return sortedJobs;
  }, [allJobs, filters, preferences]);

  const pagedJobs = useMemo(() => filteredJobs.slice(0, page * pageSize), [filteredJobs, page]);
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));

  const stats = useMemo(() => {
    const remoteJobs = allJobs.filter((job) => isRemoteJob(job)).length;
    return {
      totalJobs: allJobs.length,
      remoteJobs,
      totalSaved: savedJobs.length,
    };
  }, [allJobs, savedJobs.length]);

  const topJobs = useMemo(() => filteredJobs.slice(0, 3), [filteredJobs]);

  const insights = useMemo(() => {
    if (!filteredJobs.length) {
      return ['No jobs matched your current filters. Try broadening the location or salary range.'];
    }

    const remoteShare = filteredJobs.filter((job) => job.location.toLowerCase().includes('remote')).length / filteredJobs.length;
    const salarySpread = filteredJobs.some((job) => job.salary !== 'Not disclosed');

    return [
      remoteShare > 0.6
        ? 'Remote-first jobs dominate your current feed. This is a strong market for flexible roles.'
        : 'Your current search contains a healthy mix of remote and location-bound jobs.',
      salarySpread
        ? 'Several jobs disclose pay. Prioritize these listings to optimize your application yield.'
        : 'Compensation is sparse in this segment, so your match score leans more on title and location fit.',
      topJobs[0]
        ? `Top recommendation: ${topJobs[0].title} at ${topJobs[0].company} has the highest fit score.`
        : 'Refine your search to generate sharper recommendations.',
    ];
  }, [filteredJobs, topJobs]);

  const isSaved = (jobId: number) => savedJobs.some((job) => job.id === jobId);

  const toggleSavedJob = (job: JobListing) => {
    setSavedJobs((current) => {
      if (current.some((savedJob) => savedJob.id === job.id)) {
        return current.filter((savedJob) => savedJob.id !== job.id);
      }

      return [job, ...current];
    });
  };

  const updateFilters = (patch: Partial<FiltersState>) => {
    setFilters((current) => ({ ...current, ...patch }));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const value: AppContextValue = {
    auth: {
      user,
      account,
      signIn: ({ email, password }) => {
        if (account.email !== email || account.password !== password) {
          return false;
        }

        setUser({ name: account.name, email: account.email, role: account.role });
        return true;
      },
      signUp: (nextAccount) => {
        setAccount(nextAccount);
        setUser({ name: nextAccount.name, email: nextAccount.email, role: nextAccount.role });
        return true;
      },
      logout: () => {
        setUser(null);
        if (location.pathname !== '/login') {
          navigate('/login', { replace: true });
        }
      },
    },
    theme,
    jobs: {
      allJobs,
      filteredJobs: pagedJobs,
      savedJobs,
      loading,
      error,
      page,
      pageSize,
      filters,
      preferences,
      setSearch: (value) => updateFilters({ search: value }),
      setLocation: (value) => updateFilters({ location: value }),
      setJobType: (value) => updateFilters({ jobType: value }),
      setSalaryMin: (value) => updateFilters({ salaryMin: value }),
      setSortBy: (value) => updateFilters({ sortBy: value }),
      setPreferredLocation: (value) => setPreferences((current) => ({ ...current, preferredLocation: value })),
      setPreferredSalary: (value) => setPreferences((current) => ({ ...current, salaryMin: value })),
      setFavoriteKeywords: (value) => setPreferences((current) => ({ ...current, favoriteKeywords: value })),
      toggleSavedJob,
      isSaved,
      nextPage: () => setPage((current) => Math.min(current + 1, totalPages)),
      prevPage: () => setPage((current) => Math.max(1, current - 1)),
      clearFilters,
      totalJobs: stats.totalJobs,
      filteredCount: filteredJobs.length,
      totalSaved: stats.totalSaved,
      remoteJobs: stats.remoteJobs,
      topJobs,
      insights,
      getJobById: (jobId) => allJobs.find((job) => job.id === jobId) ?? savedJobs.find((job) => job.id === jobId),
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }

  return context;
}