from fastapi import APIRouter
from app.models.application import (
    Application,
    ApplicationList,
    CreateApplicationRequest,
    UpdateApplicationStatusRequest,
)

router = APIRouter(
    prefix="/applications",
    tags=["Applications"],
)

# Temporary in-memory database
applications_db = [
    Application(id=1, company="Google", role="Software Engineer", status="Applied"),
    Application(id=2, company="PwC", role="Technology Consultant", status="Interview"),
]


@router.get("/", response_model=ApplicationList)
def get_applications():
    return {"applications": applications_db}


@router.post("/", response_model=Application)
def create_application(request: CreateApplicationRequest):
    new_id = len(applications_db) + 1

    application = Application(
        id=new_id,
        company=request.company,
        role=request.role,
        status=request.status,
    )

    applications_db.append(application)
    return application

@router.put("/{application_id}", response_model=Application)
def update_application_status(
    application_id: int,
    request: UpdateApplicationStatusRequest,
):
    for application in applications_db:
        if application.id == application_id:
            application.status = request.status
            return application

    return {"error": "Application not found"}