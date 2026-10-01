import axios from 'axios';

// Defaults to Vite proxy or environment variable
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://career-os-backend.onrender.com';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('career_os_jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response handler
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.warn('Backend API request error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data: { email: string; password: string }) => apiClient.post('/auth/login', data),
  register: (data: { name: string; email: string; password: string }) => apiClient.post('/auth/register', data),
  getMe: () => apiClient.get('/auth/me'),
};

export const dsaApi = {
  getTopics: () => apiClient.get('/dsa/topics'),
  getProblems: (topicId: number) => apiClient.get(`/dsa/topics/${topicId}/problems`),
  logAttempt: (problemId: number, data: any) => apiClient.post(`/dsa/problems/${problemId}/attempts`, data),
  getDueRevisions: () => apiClient.get('/dsa/revisions/due'),
  completeRevision: (revisionId: string | number, data: any) => apiClient.put(`/dsa/revisions/${revisionId}`, data),
  getStats: () => apiClient.get('/dsa/stats'),
};

export const habitsApi = {
  saveJournal: (data: any) => apiClient.post('/daily/journal', data),
  getJournal: (date: string) => apiClient.get(`/daily/journal?date=${date}`),
  saveGym: (data: any) => apiClient.post('/daily/gym', data),
  saveCommunication: (data: any) => apiClient.post('/daily/communication', data),
  getDashboard: () => apiClient.get('/dashboard/today'),
};
