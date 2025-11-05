from pydantic import BaseModel, EmailStr
from typing import List, Optional

# --- User Schemas (No changes) ---

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: int
    email: EmailStr
    is_active: bool

    class Config:
        from_attributes = True # Replaced orm_mode


# --- Token Schemas (No changes) ---

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None


# --- NEW: Resume Schemas ---
# These schemas define the structure for Education, Experience, and Projects

# --- Education Schemas ---
class EducationBase(BaseModel):
    school: str
    degree: str
    start_date: str
    end_date: str

class EducationCreate(EducationBase):
    pass # No new fields needed for creation

class Education(EducationBase):
    id: int
    resume_id: int

    class Config:
        from_attributes = True

# --- Experience Schemas ---
class ExperienceBase(BaseModel):
    company: str
    role: str
    start_date: str
    end_date: str
    responsibilities: Optional[str] = None

class ExperienceCreate(ExperienceBase):
    pass

class Experience(ExperienceBase):
    id: int
    resume_id: int

    class Config:
        from_attributes = True

# --- Project Schemas ---
class ProjectBase(BaseModel):
    project_name: str
    description: Optional[str] = None
    project_url: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    resume_id: int

    class Config:
        from_attributes = True

# --- NEW: Skill Schemas ---
class SkillBase(BaseModel):
    name: str

class SkillCreate(SkillBase):
    pass

class Skill(SkillBase):
    id: int
    resume_id: int

    class Config:
        from_attributes = True


# --- Full Resume Schemas ---

# This is the main schema for *creating* a resume
# It matches the 'formData' object from our React frontend
class ResumeCreate(BaseModel):
    # Personal Info
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    
    # Nested Lists
    education: List[EducationCreate]
    experience: List[ExperienceCreate]
    projects: List[ProjectCreate]
    skills: List[SkillCreate]

# This is the main schema for *reading* a resume
# This is what we will send back from the API
class Resume(ResumeCreate):
    id: int
    owner_id: int
    
    # Tell Pydantic to read the nested data from SQLAlchemy
    education: List[Education] = []
    experience: List[Experience] = []
    projects: List[Project] = []
    skills: List[Skill] = []

    class Config:
        from_attributes = True

# --- NEW: AI Analysis Schemas ---

class JobDescriptionIn(BaseModel):
    """The job description text sent from the frontend"""
    text: str

class AnalysisResult(BaseModel):
    """The structured JSON response from the AI"""
    score: float
    missing_keywords: List[str]
    suggestions: str