import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api', // Remplacez l'URL si nécessaire
});

// Intercepteur de requêtes pour ajouter les en-têtes d'authentification et CSRF
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const csrfToken = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;  // Ajout du token Bearer
  }

  if (csrfToken && config.headers) {
    config.headers['X-CSRF-TOKEN'] = csrfToken;  // Ajout du token CSRF
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
