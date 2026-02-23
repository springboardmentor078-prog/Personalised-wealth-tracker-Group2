import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated logic (or refresh token)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // If 401 Unauthorized, maybe token expired
            // A more robust implementation would try to refresh token here.
            // For now, clear token and redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            // Only redirect if not already on login/register to avoid loops
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
