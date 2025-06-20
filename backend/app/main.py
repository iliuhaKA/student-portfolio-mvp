from fastapi import FastAPI, Depends, HTTPException, Query, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.staticfiles import StaticFiles
import shutil
from pathlib import Path

from . import crud, models, schemas
from .database import SessionLocal, engine, get_db

# Создаем таблицы
models.Base.metadata.create_all(bind=engine)

# Инициализируем FastAPI
app = FastAPI(
    title="Student Portfolio API",
    description="API for managing student portfolios",
    version="1.0.0"
)

# Настройка CORS для работы с фронтендом
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
if not UPLOAD_DIR.exists():
    UPLOAD_DIR.mkdir(parents=True)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Корневой endpoint
@app.get("/")
def read_root():
    return {"message": "Student Portfolio API is running!"}

# Endpoints для студентов
@app.post("/api/students/", response_model=schemas.Student)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    """Создание нового студента"""
    return crud.create_student(db=db, student=student)

@app.get("/api/students/", response_model=List[schemas.StudentSummary])
def read_students(
    skip: int = 0, 
    limit: int = 100, 
    search: Optional[str] = Query(None, description="Поиск по имени студента"),
    db: Session = Depends(get_db)
):
    """Получение списка студентов"""
    if search:
        students = crud.search_students(db, search)
        # Преобразуем в StudentSummary формат
        result = []
        for student in students:
            projects_count = len(student.projects)
            result.append(schemas.StudentSummary(
                id=student.id,
                name=student.name,
                description=student.description,
                created_at=student.created_at,
                projects_count=projects_count
            ))
        return result
    else:
        students_with_count = crud.get_students(db, skip=skip, limit=limit)
        result = []
        for student, projects_count in students_with_count:
            result.append(schemas.StudentSummary(
                id=student.id,
                name=student.name,
                description=student.description,
                created_at=student.created_at,
                projects_count=projects_count or 0
            ))
        return result

@app.get("/api/students/{student_id}", response_model=schemas.Student)
def read_student(student_id: int, db: Session = Depends(get_db)):
    """Получение студента с его проектами"""
    db_student = crud.get_student(db, student_id=student_id)
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return db_student

@app.delete("/api/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    """Удаление студента"""
    result = crud.delete_student(db, student_id=student_id)
    if not result:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student deleted successfully"}

# Endpoints для проектов
@app.post("/api/projects/", response_model=schemas.Project)
async def create_project(
    title: str = Form(...),
    description: str = Form(...),
    student_id: int = Form(...),
    github_url: Optional[str] = Form(None),
    demo_url: Optional[str] = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    db_student = crud.get_student(db, student_id=student_id)
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")

    image_path = None
    if image:
        file_extension = Path(image.filename).suffix
        unique_filename = f"{crud.generate_unique_filename()}{file_extension}"
        file_path = UPLOAD_DIR / unique_filename
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_path = unique_filename

    project_data = schemas.ProjectCreate(
        title=title,
        description=description,
        student_id=student_id,
        github_url=github_url,
        demo_url=demo_url
    )
    return crud.create_project(db=db, project=project_data, image=image_path)

@app.get("/api/students/{student_id}/projects", response_model=List[schemas.Project])
def read_student_projects(student_id: int, db: Session = Depends(get_db)):
    """Получение проектов студента"""
    # Проверяем, существует ли студент
    db_student = crud.get_student(db, student_id=student_id)
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return crud.get_projects_by_student(db, student_id=student_id)

@app.delete("/api/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    """Удаление проекта"""
    result = crud.delete_project(db, project_id=project_id)
    if not result:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "API is working correctly"}