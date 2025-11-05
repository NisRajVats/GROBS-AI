from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base # Use absolute import

# --- User Model (UPDATED) ---
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    
    # This creates a "link" so we can access user.resumes
    resumes = relationship("Resume", back_populates="owner")

# --- NEW: Resume Model ---
class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # --- Personal Info (a snapshot from the form) ---
    full_name = Column(String)
    email = Column(String)
    phone = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    
    # --- Links ---
    # Link to the user who owns this resume
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="resumes")
    
    # Links to the other sections
    education = relationship("Education", back_populates="resume", cascade="all, delete-orphan")
    experience = relationship("Experience", back_populates="resume", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="resume", cascade="all, delete-orphan")

# --- NEW: Education Model ---
class Education(Base):
    __tablename__ = "education"
    
    id = Column(Integer, primary_key=True, index=True)
    school = Column(String)
    degree = Column(String)
    start_date = Column(String)
    end_date = Column(String)
    
    # Link to the resume it belongs to
    resume_id = Column(Integer, ForeignKey("resumes.id"))
    resume = relationship("Resume", back_populates="education")

# --- NEW: Experience Model ---
class Experience(Base):
    __tablename__ = "experience"
    
    id = Column(Integer, primary_key=True, index=True)
    company = Column(String)
    role = Column(String)
    start_date = Column(String)
    end_date = Column(String)
    responsibilities = Column(Text, nullable=True) # Use Text for longer descriptions
    
    # Link to the resume it belongs to
    resume_id = Column(Integer, ForeignKey("resumes.id"))
    resume = relationship("Resume", back_populates="experience")

# --- NEW: Project Model ---
class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String)
    description = Column(Text, nullable=True)
    project_url = Column(String, nullable=True)
    
    # Link to the resume it belongs to
    resume_id = Column(Integer, ForeignKey("resumes.id"))
    resume = relationship("Resume", back_populates="projects")