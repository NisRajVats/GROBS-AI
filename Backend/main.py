from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
import security # Our updated security file
from datetime import timedelta
from fastapi.security import OAuth2PasswordBearer
import security # This should already be there
import crud # This should already be there
from typing import List

# Import all our new files
import models
import schemas
import crud
from database import engine, get_db  # get_db was in database.py

# This creates the tables (it's safe to run every time)
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# This tells FastAPI to look for a token in the URL "/token"
# (but we won't use it directly, it just sets up the dependency)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- CORS Middleware ---
# This is the security that allows your React frontend
# to talk to your Python backend
origins = [
    "http://localhost:5173",  # Your React app
    "http://127.0.0.1:5173", # Your React app
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoints ---

@app.get("/")
def read_root():
    return {"message": "GROBS.AI Backend is running!"}


@app.post("/register/", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):

    # 1. Check if user already exists
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        # If they do, raise an error
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. If not, create the new user
    return crud.create_user(db=db, user=user)


@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    db: Session = Depends(get_db), 
    form_data: OAuth2PasswordRequestForm = Depends()
):

    # 1. Get the user from the DB by email (form_data.username is the email)
    user = crud.get_user_by_email(db, email=form_data.username)

    # 2. Check if user exists and if the password is correct
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        # If not, raise an error
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. If password is correct, create a new access token
    access_token = security.create_access_token(
        data={"sub": user.email}
    )

    # 4. Return the token
    return {"access_token": access_token, "token_type": "bearer"}

async def get_current_user(
    db: Session = Depends(get_db), 
    token: str = Depends(oauth2_scheme)
):
    """
    A dependency that gets the token, decodes it,
    and returns the user from the database.
    """
    
    # 1. Decode the token to get the email
    token_data = security.decode_access_token(token)
    
    if not token_data or not token_data.email:
        # If the token is invalid or has no email
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # 2. Get the user from the database
    user = crud.get_user_by_email(db, email=token_data.email)
    
    if user is None:
        # If the user from the token doesn't exist
        raise HTTPException(
            status_code=401,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    return user # This is the logged-in user object


@app.get("/users/me", response_model=schemas.User)
async def read_users_me(
    current_user: models.User = Depends(get_current_user)
):
    """
    A protected endpoint. If you can access this,
    your token is valid and the dependency is working.
    """
    return current_user


@app.post("/resume/", response_model=schemas.Resume)
async def create_new_resume(
    resume_data: schemas.ResumeCreate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    """
    Protected endpoint to create a new resume.
    It takes the full resume data from the frontend
    and associates it with the logged-in user.
    """
    
    # 1. We already have the user from get_current_user
    # 2. We have the resume data from the request body
    
    # 3. Call the CRUD function to save everything
    return crud.create_resume(db=db, resume_data=resume_data, user_id=current_user.id)

@app.get("/resumes/", response_model=List[schemas.Resume])
async def read_user_resumes(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Protected endpoint to get all resumes for the current user.
    """
    return crud.get_resumes_by_owner(db=db, user_id=current_user.id)


@app.get("/resume/{resume_id}", response_model=schemas.Resume)
async def read_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Protected endpoint to get a single resume by its ID.
    """
    db_resume = crud.get_resume(db=db, resume_id=resume_id, user_id=current_user.id)
    if db_resume is None:
        raise HTTPException(status_code=404, detail="Resume not found")
    return db_resume

   