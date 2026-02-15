import axios from 'axios';

const api = axios.create({
  baseURL: 'https://49.249.199.62:89/api',
});

export default api;
