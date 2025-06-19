import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import StudentCard from '../components/StudentCard';
import { studentsApi } from '../api/client';

const HomePage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  const loadStudents = async (search = '') => {
    try {
      setSearchLoading(!!search);
      const data = await studentsApi.getAll(search);
      setStudents(data);
      setError('');
    } catch (err) {
      setError('Ошибка при загрузке студентов');
      console.error('Load students error:', err);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await studentsApi.delete(studentId);
      setStudents(students.filter(student => student.id !== studentId));
    } catch (err) {
      setError('Ошибка при удалении студента');
      console.error('Delete student error:', err);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== '') {
        loadStudents(searchQuery);
      } else {
        loadStudents();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка студентов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Портфолио студентов
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover amazing projects created by talented students
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск студентов..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="input-field pl-10"
              />
              {searchLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
            
            <Link to="/create" className="btn-primary flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Добавить студента</span>
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {students.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchQuery ? 'Студенты не найдены' : 'Пока нет студентов'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? 'Попробуйте изменить поисковый запрос' 
                : 'Станьте первым, кто добавит своё портфолио!'
              }
            </p>
            {!searchQuery && (
              <Link to="/create" className="btn-primary inline-flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Добавить первого студента</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <StudentCard 
                key={student.id} 
                student={student} 
                onDelete={handleDeleteStudent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;