import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // IIS will proxy /api → http://127.0.0.1:5000/api
});

export default api;
