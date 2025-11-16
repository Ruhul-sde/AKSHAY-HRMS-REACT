
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://49.249.199.62:5000/api',
});

export default api;
