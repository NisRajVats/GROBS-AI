import os
import google.generativeai as genai
from dotenv import load_dotenv
import models  # We need this to know what a 'Resume' object is
import json
from pydantic import ValidationError

# Load the .env file
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found. Make sure it's set in your .env file.")

# Configure the Gemini client
genai.configure(api_key=api_key)

# This is the JSON structure we want the AI to return
# We will define this in schemas.py as well
AI_RESPONSE_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "score": {
            "type": "NUMBER",
            "description": "A score from 0-100 of how well the resume matches the job description."
        },
        "missing_keywords": {
            "type": "ARRAY",
            "items": {"type": "STRING"},
            "description": "A list of 5-10 key skills or terms from the job description that are missing from the resume."
        },
        "suggestions": {
            "type": "STRING",
            "description": "A 3-5 bullet point list (as a single string) of specific, actionable advice to improve the resume for this job."
        }
    },
    "required": ["score", "missing_keywords", "suggestions"]
}

# Set up the model
generation_config = genai.GenerationConfig(
    response_mime_type="application/json",
    response_schema=AI_RESPONSE_SCHEMA
)

model = genai.GenerativeModel(
    'gemini-2.5-flash-preview-09-2025',
    generation_config=generation_config
)

def analyze_resume_with_ai(resume: models.Resume, job_description: str):
    """
    Analyzes a resume against a job description using the Gemini API
    and returns a structured JSON response.
    """
    
    # 1. We create a simplified version of the resume to send to the AI
    # This saves tokens and money, and is cleaner.
    resume_data_for_ai = {
        "full_name": resume.full_name,
        "email": resume.email,
        "phone": resume.phone,
        "linkedin_url": resume.linkedin_url,
        "education": [
            {"school": edu.school, "degree": edu.degree} for edu in resume.education
        ],
        "experience": [
            {"role": exp.role, "company": exp.company, "responsibilities": exp.responsibilities} for exp in resume.experience
        ],
        "projects": [
            {"name": proj.project_name, "description": proj.description} for proj in resume.projects
        ],
        "skills": [skill.name for skill in resume.skills]
    }
    
    # 2. We build the prompt
    prompt = f"""
    You are an expert career coach and resume optimization bot named 'GROBS.AI'.
    Your task is to analyze a user's resume against a specific job description.

    First, here is the user's resume data in JSON format:
    --- RESUME START ---
    {json.dumps(resume_data_for_ai, indent=2)}
    --- RESUME END ---

    Next, here is the job description they are applying for:
    --- JOB DESCRIPTION START ---
    {job_description}
    --- JOB DESCRIPTION END ---

    Please provide a critical analysis. Focus on what is missing and how they can improve.
    Return your analysis *only* in the requested JSON format.
    """
    
    # 3. We call the AI
    try:
        response = model.generate_content(prompt)
        # We parse the JSON text from the AI's response
        return json.loads(response.text)
        
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        # Handle cases where the AI gives a bad response (e.g., safety block)
        # We'll need to update schemas.py to handle this error case
        return {
            "score": 0,
            "missing_keywords": ["Error: Could not analyze resume."],
            "suggestions": f"An error occurred while analyzing the resume: {str(e)}"
        }