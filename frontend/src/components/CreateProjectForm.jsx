import React, { useState } from 'react';
import { projectsApi } from '../api/client';

const CreateProjectForm = ({ studentId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    github_url: '',
    demo_url: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Пожалуйста, заполните обязательные поля');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const projectData = {
        ...formData,
        student_id: studentId,
        // Убираем пустые URL
        github_url: formData.github_url.trim() || null,
        demo_url: formData.demo_url.trim() || null,
        image_url: formData.image_url.trim() || null
      };
      
      const project = await projectsApi.create(projectData);
      onSuccess(project);
    } catch (err) {
      setError('Ошибка при создании проекта. Попробуйте еще раз.');
      console.error('Create project error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Добавить проект
      </h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Название проекта *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input-field"
            placeholder="Введите название проекта"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Описание проекта *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="textarea-field"
            placeholder="Опишите проект, используемые технологии и его особенности"
            required
          />
        </div>
        
        <div>
          <label htmlFor="github_url" className="block text-sm font-medium text-gray-700 mb-1">
            GitHub URL
          </label>
          <input
            type="url"
            id="github_url"
            name="github_url"
            value={formData.github_url}
            onChange={handleChange}
            className="input-field"
            placeholder="https://github.com/username/repository"
          />
        </div>
        
        <div>
          <label htmlFor="demo_url" className="block text-sm font-medium text-gray-700 mb-1">
            Демо URL
          </label>
          <input
            type="url"
            id="demo_url"
            name="demo_url"
            value={formData.demo_url}
            onChange={handleChange}
            className="input-field"
            placeholder="https://your-project-demo.com"
          />
        </div>
        
        <div>
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
            Изображение проекта (URL)
          </label>
          <input
            type="url"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="input-field"
            placeholder="https://example.com/screenshot.png"
          />
          <p className="text-xs text-gray-500 mt-1">
            Можно использовать imgur.com или другие сервисы для загрузки изображений
          </p>
        </div>
        
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Создание...' : 'Добавить проект'}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={loading}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectForm;