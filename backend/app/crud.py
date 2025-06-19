from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models, schemas

# CRUD для Student
def get_student(db: Session, student_id: int):
    return db.query(models.Student).filter(models.Student.id == student_id).first()

def get_students(db: Session, skip: int = 0, limit: int = 100):
    # Получаем студентов с количеством проектов
    return db.query(
        models.Student,
        func.count(models.Project.id).label("projects_count")
    ).outerjoin(models.Project).group_by(models.Student.id).offset(skip).limit(limit).all()

def create_student(db: Session, student: schemas.StudentCreate):
    db_student = models.Student(**student.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

def search_students(db: Session, query: str):
    return db.query(models.Student).filter(
        models.Student.name.contains(query)
    ).all()

# CRUD для Project
def get_projects_by_student(db: Session, student_id: int):
    return db.query(models.Project).filter(models.Project.student_id == student_id).all()

def create_project(db: Session, project: schemas.ProjectCreate):
    db_project = models.Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def get_project(db: Session, project_id: int):
    return db.query(models.Project).filter(models.Project.id == project_id).first()

def delete_project(db: Session, project_id: int):
    """Удаление проекта"""
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        return False
    
    db.delete(project)
    db.commit()
    return True

def delete_student(db: Session, student_id: int):
    """Удаление студента и всех его проектов"""
    # Сначала проверяем, существует ли студент
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        return False
    
    # Удаляем все проекты студента
    db.query(models.Project).filter(models.Project.student_id == student_id).delete()
    
    # Удаляем самого студента
    db.delete(student)
    db.commit()
    return True