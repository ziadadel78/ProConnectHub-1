/**
 * Frontend Application Constants
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const USER_ROLES = {
  ADMIN: 'admin',
  CLIENT: 'client',
  FREELANCER: 'freelancer',
} as const;

export const JOB_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const PROPOSAL_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  JOBS: {
    BROWSE: '/jobs',
    DETAIL: (id: string) => `/jobs/${id}`,
    CREATE: '/jobs/create',
  },
  PROPOSALS: {
    LIST: '/proposals',
    CREATE: (jobId: string) => `/proposals/create/${jobId}`,
  },
  PORTFOLIO: {
    LIST: '/portfolio',
    CREATE: '/portfolio/create',
    EDIT: (id: string) => `/portfolio/${id}/edit`,
  },
  PROFILE: '/profile',
  MESSAGES: '/messages',
  ADMIN: '/admin',
} as const;

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;
