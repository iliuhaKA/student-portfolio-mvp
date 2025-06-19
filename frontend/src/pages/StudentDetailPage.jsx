import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, User, Calendar } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import CreateProjectForm from '../components/CreateProjectForm';
import { studentsApi, projectsApi } from '../api/client';

const StudentDetailPage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateProject, setShowCreateProject] = useState(false);

  const loadStudent = async () => {
    try {
      setLoading(true);
      const data = await studentsApi.getById(parseInt(id));
      setStudent(data);
      setError('');
    } catch (err) {
      setError('Студент не найден');
      console.error('Load student error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadStudent();
    }
  }, [id]);

  const handleProjectCreated = (newProject) => {
    setStudent(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
    setShowCreateProject(false);
  };

  const handleProjectDelete = async (projectId) => {
    try {
      await projectsApi.delete(projectId);
      setStudent(prev => ({
        ...prev,
        projects: prev.projects.filter(project => project.id !== projectId)
      }));
    } catch (err) {
      setError('Ошибка при удалении проекта');
      console.error('Delete project error:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L5.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Студент не найден</h3>
          <p className="text-gray-600 mb-6">Возможно, профиль был удален или не существует</p>
          <Link to="/" className="btn-primary">
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  if (showCreateProject) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CreateProjectForm
            studentId={parseInt(id)}
            onSuccess={handleProjectCreated}
            onCancel={() => setShowCreateProject(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Вернуться к списку студентов
          </Link>
        </div>

        {/* Student Profile */}
        <div className="card mb-8">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-primary-600" />
              </div>
            </div>
            
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {student.name}
              </h1>
              <p className="text-gray-600 text-lg mb-4">
                {student.description}
              </p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Профиль создан {formatDate(student.created_at)}</span>
                </div>
                <div>
                  <span>{student.projects.length} проектов</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Проекты ({student.projects.length})
          </h2>
          
          <button
            onClick={() => setShowCreateProject(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Добавить проект</span>
          </button>
        </div>

        {/* Projects Grid */}
        {student.projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Пока нет проектов
            </h3>
            <p className="text-gray-600 mb-6">
              Добавьте первый проект, чтобы продемонстрировать свои навыки
            </p>
            <button
              onClick={() => setShowCreateProject(true)}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Добавить первый проект</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {student.projects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onDelete={handleProjectDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetailPage;