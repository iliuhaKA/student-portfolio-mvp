import React from 'react';
import { ExternalLink, Github, Calendar, X } from 'lucide-react';

const ProjectCard = ({ project, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить этот проект?')) {
      onDelete(project.id);
    }
  };

  return (
    <div className="card relative">
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100 transition-colors duration-200"
        title="Удалить проект"
      >
        <X className="w-5 h-5 text-red-500" />
      </button>

      {project.image && (
        <div className="mb-4">
          <img
            src={`http://localhost:8000/uploads/${project.image}`}
            alt={project.title}
            className="w-full h-48 object-cover rounded-lg"
            onError={e => { e.target.style.display = 'none'; }}
          />
        </div>
      )}
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {project.title}
      </h3>
      
      <p className="text-gray-600 mb-4">
        {project.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(project.created_at)}</span>
        </div>
        
        <div className="flex space-x-2">
          {project.github_url && (
            <a 
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
          
          {project.demo_url && (
            <a 
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Демо"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;