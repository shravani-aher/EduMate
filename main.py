from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from predictor import recommend_colleges


# ==========================================
# CREATE FASTAPI APP
# ==========================================

app = FastAPI(title="EduMate API")


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# STUDENT INPUT MODEL
# ==========================================

class StudentProfile(BaseModel):
    percentile: float
    category: str
    gender: str
    branch: str
    home_university: str
    city: str


# ==========================================
# PREDICTION ENDPOINT
# ==========================================

@app.post("/predict")
def predict(profile: StudentProfile):

    results = recommend_colleges(
        percentile=profile.percentile,
        category=profile.category,
        gender=profile.gender,
        branch=profile.branch,
        city=profile.city
    )

    colleges = results.to_dict(
        orient="records"
    )

    return {
        "student": {
            "percentile": profile.percentile,
            "category": profile.category,
            "gender": profile.gender,
            "branch": profile.branch,
            "home_university": profile.home_university,
            "city": profile.city
        },
        "colleges": colleges
    }


# ==========================================
# HOME / HEALTH CHECK
# ==========================================

@app.get("/")
def home():

    return {
        "message": "EduMate API is running"
    }