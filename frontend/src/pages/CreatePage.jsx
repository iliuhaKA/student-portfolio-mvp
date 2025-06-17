import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CreateStudentForm from '../components/CreateStudentForm';
import CreateProjectForm from '../components/CreateProjectForm';

const CreatePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 - create student, 2 - create project
  const [createdStudent, setCreatedStudent] = useState(null);

  const handleStudentCreated = (student) => {
    setCreatedStudent(student);
    setStep(2);
  };

  const handleProjectCreated = (project) => {
    // После создания проекта переходим к профилю студента
    navigate(`/student/${createdStudent.id}`);
  };

  const handleSkipProject = () => {
    // Можно пропустить создание проекта
    navigate(`/student/${createdStudent.id}`);
  };

  const handleCancel = () => {
    if (step === 1) {
      navigate('/');
    } else {
      // Если отменяем создание проекта, все равно переходим к студенту
      navigate(`/student/${createdStudent.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Вернуться на главную
          </Link>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className={`flex items-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-primary-600 border-primary-600 text-white' : 'border-gray-300'
              }`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Создать студента</span>
            </div>
            
            <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
            
            <div className={`flex items-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-primary-600 border-primary-600 text-white' : 'border-gray-300'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Добавить проект</span>
            </div>
          </div>
        </div>

        {/* Form content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {step === 1 ? (
            <CreateStudentForm
              onSuccess={handleStudentCreated}
              onCancel={handleCancel}
            />
          ) : (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Отлично! Профиль создан
                </h2>
                <p className="text-gray-600">
                  Теперь добавьте первый проект для <strong>{createdStudent?.name}</strong>
                </p>
              </div>
              
              <CreateProjectForm
                studentId={createdStudent?.id}
                onSuccess={handleProjectCreated}
                onCancel={handleCancel}
              />
              
              <div className="mt-6 text-center">
                <button
                  onClick={handleSkipProject}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Пропустить и перейти к профилю
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePage;