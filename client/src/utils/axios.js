import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://souvik-booking-app-backend.onrender.com/api'
  : 'http://localhost:8800/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

export default axiosInstance;