# Student Portfolio MVP

Веб-приложение для создания портфолио студентов с их проектами.

## 🚀 Быстрый старт с Docker

### Предварительные требования
- Docker
- Docker Compose

### Запуск приложения
```bash
# Клонирование репозитория
git clone <repository-url>
cd student-portfolio-mvp

# Сборка и запуск
docker-compose up -d

# Просмотр логов
docker-compose logs -f
```

### Доступ к приложению
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API документация**: http://localhost:8000/docs

## 🛠️ Разработка

### Локальная разработка (без Docker)

#### Backend (Python/FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate     # Windows

pip install -r requirements.txt
python init_db.py
uvicorn app.main:app --reload
```

#### Frontend (React)
```bash
cd frontend
npm install
npm start
```

## 📁 Структура проекта

```
student-portfolio-mvp/
├── backend/                 # FastAPI backend
│   ├── app/                # Основной код приложения
│   ├── data/               # База данных (создается автоматически)
│   ├── uploads/            # Загруженные файлы
│   ├── init_db.py          # Скрипт инициализации БД
│   └── Dockerfile
├── frontend/               # React frontend
│   ├── src/               # Исходный код
│   ├── public/            # Статические файлы
│   ├── nginx.conf         # Конфигурация nginx
│   └── Dockerfile
├── docker-compose.yml      # Оркестрация контейнеров
└── .gitignore             # Игнорируемые файлы
```

## 🗄️ База данных

### Особенности работы с БД
- **SQLite** используется для простоты разработки
- База данных **НЕ** хранится в Git (см. .gitignore)
- Автоматическая инициализация при первом запуске
- Тестовые данные добавляются автоматически

### Управление данными
```bash
# Инициализация БД с тестовыми данными
docker-compose exec backend python init_db.py

# Сброс БД (удаление volumes)
docker-compose down -v
docker-compose up -d
```

## 🔧 Полезные команды

### Docker команды
```bash
# Пересборка после изменений
docker-compose build
docker-compose up -d

# Просмотр логов
docker-compose logs backend
docker-compose logs frontend

# Вход в контейнер
docker-compose exec backend bash
docker-compose exec frontend sh

# Остановка
docker-compose down
```

### Разработка
```bash
# Запуск только backend
docker-compose up backend

# Запуск только frontend
docker-compose up frontend

# Просмотр статуса
docker-compose ps
```

## 📝 API Endpoints

### Студенты
- `GET /api/students/` - список всех студентов
- `POST /api/students/` - создание студента
- `GET /api/students/{id}` - получение студента
- `PUT /api/students/{id}` - обновление студента
- `DELETE /api/students/{id}` - удаление студента

### Проекты
- `GET /api/projects/` - список всех проектов
- `POST /api/projects/` - создание проекта
- `GET /api/projects/{id}` - получение проекта
- `PUT /api/projects/{id}` - обновление проекта
- `DELETE /api/projects/{id}` - удаление проекта

## 🔒 Безопасность

- Загруженные файлы сохраняются в отдельной папке
- База данных изолирована в Docker volume
- CORS настроен для локальной разработки

## 🚀 Развертывание

### Продакшн
Для продакшн развертывания рекомендуется:
1. Использовать PostgreSQL вместо SQLite
2. Настроить HTTPS
3. Добавить аутентификацию
4. Настроить мониторинг

### Переменные окружения
```bash
# Backend
DATABASE_URL=sqlite:///./data/students.db

# Frontend
REACT_APP_API_URL=http://localhost:8000
```

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch
3. Внесите изменения
4. Добавьте тесты
5. Создайте Pull Request

## 📄 Лицензия

MIT License