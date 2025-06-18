import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Asegúrate que tu backend esté en el puerto 5000
});

export default API;
