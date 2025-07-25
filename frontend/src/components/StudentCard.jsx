import React from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, Folder, X } from 'lucide-react';

const StudentCard = ({ student, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDelete = (e) => {
    e.preventDefault(); // Предотвращаем переход по ссылке
    if (window.confirm('Вы уверены, что хотите удалить этого студента?')) {
      onDelete(student.id);
    }
  };

  return (
    <Link to={`/student/${student.id}`} className="block">
      <div className="card hover:shadow-md transition-shadow duration-200 cursor-pointer relative">
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100 transition-colors duration-200"
          title="Удалить студента"
        >
          <X className="w-5 h-5 text-red-500" />
        </button>

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          
          <div className="flex-grow min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {student.name}
            </h3>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {student.description}
            </p>
            
            <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Folder className="w-4 h-4" />
                <span>{student.projects_count} проектов</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(student.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StudentCard;