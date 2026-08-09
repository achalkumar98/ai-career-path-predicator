import api from '@/lib/axios';

export interface JobFilterParams {
  recency?: 'all' | '1d' | '3d' | '7d' | '14d' | '30d';
  dateFrom?: string | null; // ISO date string e.g. "2026-08-01"
  dateTo?: string | null;   // ISO date string e.g. "2026-08-09"
}

export const findJobMatchesApi = (
  keyword: string,
  location: string,
  filters: JobFilterParams = {},
) =>
  api.post('/job-matching', {
    keyword,
    location,
    recency:  filters.recency  ?? 'all',
    dateFrom: filters.dateFrom ?? null,
    dateTo:   filters.dateTo   ?? null,
  });
