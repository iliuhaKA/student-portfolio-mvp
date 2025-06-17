import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Обработка ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API функции для студентов
export const studentsApi = {
  // Получить всех студентов
  getAll: async (search = '') => {
    const params = search ? { search } : {};
    const response = await apiClient.get('/api/students/', { params });
    return response.data;
  },
  
  // Получить студента по ID
  getById: async (id) => {
    const response = await apiClient.get(`/api/students/${id}`);
    return response.data;
  },
  
  // Создать студента
  create: async (studentData) => {
    const response = await apiClient.post('/api/students/', studentData);
    return response.data;
  }
};

// API функции для проектов
export const projectsApi = {
  // Создать проект
  create: async (projectData) => {
    const response = await apiClient.post('/api/projects/', projectData);
    return response.data;
  },
  
  // Получить проекты студента
  getByStudentId: async (studentId) => {
    const response = await apiClient.get(`/api/students/${studentId}/projects`);
    return response.data;
  }
};

export default apiClient;