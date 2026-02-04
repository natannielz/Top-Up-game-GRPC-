import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3002/api'
});

// Add a request interceptor to add the token
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('currentUser');
            // Optional: redirect to login
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
