import axios from 'axios';
import type { JobApiRecord, JobListing, JobsApiResponse } from '../types/jobs';

const jobsApi = axios.create({
  baseURL: 'https://remotive.com/api',
  timeout: 15000,
});

function formatJob(record: JobApiRecord): JobListing {
  return {
    id: record.id,
    title: record.title,
    company: record.company_name,
    category: record.category,
    jobType: record.job_type,
    location: record.candidate_required_location || 'Remote',
    salary: record.salary || 'Not disclosed',
    tags: record.tags || [],
    description: record.description,
    url: record.url,
    publishedAt: record.publication_date,
    companyLogo: record.company_logo,
  };
}

export async function fetchJobs(search = ''): Promise<JobListing[]> {
  const response = await jobsApi.get<JobsApiResponse>('/remote-jobs', {
    params: search ? { search } : undefined,
  });

  return response.data.jobs.map(formatJob);
}

export async function fetchJobById(jobId: number): Promise<JobListing | undefined> {
  const jobs = await fetchJobs();
  return jobs.find((job) => job.id === jobId);
}
