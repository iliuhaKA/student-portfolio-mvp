from pydantic import BaseModel, HttpUrl
from typing import List, Optional
from datetime import datetime

# Схемы для Project
class ProjectBase(BaseModel):
    title: str
    description: str
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    image: Optional[str] = None  # путь к файлу

class ProjectCreate(BaseModel):
    title: str
    description: str
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    student_id: int

class Project(ProjectBase):
    id: int
    student_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Схемы для Student
class StudentBase(BaseModel):
    name: str
    description: str

class StudentCreate(StudentBase):
    pass

class Student(StudentBase):
    id: int
    created_at: datetime
    projects: List[Project] = []
    
    class Config:
        from_attributes = True

# Схема для списка студентов (без проектов)
class StudentSummary(StudentBase):
    id: int
    created_at: datetime
    projects_count: int = 0
    
    class Config:
        from_attributes = True