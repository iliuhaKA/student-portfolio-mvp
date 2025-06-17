import React, { useState } from 'react';
import { studentsApi } from '../api/client';

const CreateStudentForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
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
    
    if (!formData.name.trim() || !formData.description.trim()) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const student = await studentsApi.create(formData);
      onSuccess(student);
    } catch (err) {
      setError('Ошибка при создании студента. Попробуйте еще раз.');
      console.error('Create student error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Создать профиль студента
      </h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Имя студента *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            placeholder="Введите имя студента"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Описание *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="textarea-field"
            placeholder="Расскажите о студенте, его специализации и интересах"
            required
          />
        </div>
        
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Создание...' : 'Создать студента'}
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

export default CreateStudentForm;