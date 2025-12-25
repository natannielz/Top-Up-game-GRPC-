import axios from 'axios';

const BASE_URL = 'https://games-details.p.rapidapi.com';
const API_KEY = '4f986f64cemsh76b9539edccd3f4p1eba5fjsn2c9321c70d4e';
const API_HOST = 'games-details.p.rapidapi.com';

const steamClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': API_HOST
  }
});

// Interceptor for better error handling
steamClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default steamClient;
