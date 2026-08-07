import api from '@/lib/axios';

export interface ChartDatum {
  name?: string;
  label?: string;
  date?: string;
  value: number;
  assessments?: number;
  insights?: number;
}

export interface DashboardAnalytics {
  activity: ChartDatum[];
  skills: ChartDatum[];
  interests: ChartDatum[];
  careers: ChartDatum[];
  assessmentCoverage: ChartDatum[];
  summary: {
    assessments: number;
    insights: number;
    skillsTracked: number;
    interestsTracked: number;
    careerPaths: number;
  };
  updatedAt: string;
}

export const getDashboardAnalyticsApi = () => api.get<DashboardAnalytics>('/dashboard/analytics');
