import axios from 'axios';

const api = axios.create({
    baseURL: 'https://urboncompanybackend.onrender.com',
    withCredentials: true,
});

export default api;
