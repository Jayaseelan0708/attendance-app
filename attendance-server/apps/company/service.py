from fastapi import HTTPException, status
import apps.company.models as CompanyModel
import apps.company.persistence as CompanyPersistence
from helpers import is_valid_uuid
import constant as Constant

# Creates a new company
def create_company(new_company: CompanyModel.NewCompany) -> CompanyModel.Company:
    try:
        return CompanyPersistence.save_company(new_company)
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Returns the company information by sid/id
def company_by_sid(id: any) -> CompanyModel.Company:
    try:
        if(is_valid_uuid(id)):
            company = CompanyPersistence.company_by_any(id)
            if (company is not None):
                return CompanyModel.Company(**company.__dict__)
            else:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=Constant.HTTP_COMPANY_NOT_FOUND) 
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=Constant.HTTP_INVALID_COMPANY_SID)
    except HTTPException as http_exception:
        raise HTTPException(status_code=http_exception.status_code, detail=http_exception.detail)
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)