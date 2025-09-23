import axios from 'axios';

const API_BASE_URL =  'https://souvik-booking-app-backend.onrender.com/api'
  
// const API_BASE_URL = 'http://localhost:8800/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

export default axiosInstance;