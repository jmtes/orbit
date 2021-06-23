import axios from 'axios';

// Fetch used for public endpoints of API
const publicFetch = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export { publicFetch };
