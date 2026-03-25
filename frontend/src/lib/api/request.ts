import axios from 'axios';

// Clean Axios instance without top-level store dependencies
const rawBaseURL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : 'https://golf-winner-backend-02.onrender.com/api');
const formattedBaseURL = rawBaseURL.replace(/\/$/, '');
const finalBaseURL = (formattedBaseURL.endsWith('/api') ? formattedBaseURL : `${formattedBaseURL}/api`) + '/';

export const api = axios.create({
  baseURL: finalBaseURL,
  withCredentials: true,
});
