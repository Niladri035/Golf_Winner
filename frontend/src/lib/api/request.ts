import axios from 'axios';

// Clean Axios instance without top-level store dependencies
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});
