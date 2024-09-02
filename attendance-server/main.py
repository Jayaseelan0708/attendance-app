from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apps.user.routers import router as user_router
from apps.company.routers import router as company_router

app = FastAPI()

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(company_router)