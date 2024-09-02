from fastapi import APIRouter, status, HTTPException, Path
from apps.company.service import create_company, company_by_sid
import apps.company.models as CompanyModel

router = APIRouter(prefix="/company")

# Creates a new company
@router.post("/create")
async def save_company(new_company: CompanyModel.NewCompany) -> CompanyModel.Company:
    try:
        return create_company(new_company)
    except HTTPException as http_exception:
       raise HTTPException(status_code=http_exception.status_code, detail=http_exception.detail)
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# Returns the company details by company sid
@router.get("/get/{sid}")
async def get_company(sid: str = Path()) -> CompanyModel.Company:
    try:
       return company_by_sid(sid)
    except HTTPException as http_exception:
       raise HTTPException(status_code=http_exception.status_code, detail=http_exception.detail)
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    