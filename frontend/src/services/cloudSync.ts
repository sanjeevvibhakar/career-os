import axios from 'axios';

const CLOUD_URL_KEY = 'career_os_cloud_api_url';

export const getSavedCloudUrl = (): string => {
  return localStorage.getItem(CLOUD_URL_KEY) || 'https://career-os-backend.onrender.com';
};

export const setSavedCloudUrl = (url: string) => {
  localStorage.setItem(CLOUD_URL_KEY, url.trim().replace(/\/$/, ''));
};

export const getExportSnapshot = () => {
  return {
    dsa: localStorage.getItem('career-os-dsa'),
    daily: localStorage.getItem('career-os-daily'),
    sprint: localStorage.getItem('career-os-sprint'),
    dashboard: localStorage.getItem('career-os-dashboard'),
    exportedAt: new Date().toISOString(),
  };
};

export const importSnapshotString = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    if (data.dsa) localStorage.setItem('career-os-dsa', data.dsa);
    if (data.daily) localStorage.setItem('career-os-daily', data.daily);
    if (data.sprint) localStorage.setItem('career-os-sprint', data.sprint);
    if (data.dashboard) localStorage.setItem('career-os-dashboard', data.dashboard);
    return true;
  } catch (err) {
    console.error('Failed to parse snapshot:', err);
    return false;
  }
};

// Check if backend is reachable
export const testCloudHealth = async (url: string): Promise<boolean> => {
  try {
    const res = await axios.get(`${url}/health`, { timeout: 8000 });
    return res.data?.status === 'UP';
  } catch (e) {
    return false;
  }
};

// Push local database to cloud backend
export const syncPushToCloud = async (apiUrl: string): Promise<{ success: boolean; message: string }> => {
  try {
    const snapshot = getExportSnapshot();
    const res = await axios.post(`${apiUrl}/api/sync/push`, snapshot, { timeout: 15000 });
    return { success: true, message: res.data?.message || 'Local data successfully backed up to cloud!' };
  } catch (err: any) {
    return { success: false, message: err?.response?.data?.message || err.message };
  }
};

// Pull cloud database to local storage
export const syncPullFromCloud = async (apiUrl: string): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await axios.get(`${apiUrl}/api/sync/pull`, { timeout: 15000 });
    if (res.data?.data) {
      importSnapshotString(JSON.stringify(res.data.data));
      return { success: true, message: 'Latest cloud data pulled and synced to your device!' };
    }
    return { success: false, message: 'No cloud snapshot found.' };
  } catch (err: any) {
    return { success: false, message: err?.response?.data?.message || err.message };
  }
};
