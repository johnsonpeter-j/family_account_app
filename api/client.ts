import axios from 'axios';
import tokenStorage, { TOKEN_KEY } from './tokenStorage';

const serverUrl = (process.env.EXPO_PUBLIC_SERVER_URL ?? 'http://localhost:5000').replace(/\/+$/, '');

const apiClient = axios.create({
  baseURL: serverUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getItem(TOKEN_KEY);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;


