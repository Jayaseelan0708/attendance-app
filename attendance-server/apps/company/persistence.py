from sqlalchemy import or_
from database.connection import session as database, exc
from database.models import Company
import apps.company.models as CompanyModel
from uuid import uuid4

# Creates a new company
def save_company(new_company: CompanyModel.NewCompany) -> CompanyModel.Company:
    try:
        company = Company(**new_company.__dict__, sid=str(uuid4()).encode())
        database.add(company)
        database.commit()
        database.refresh(company)
        return CompanyModel.Company(**company.__dict__)
    except exc.SQLAlchemyError as sql_alchemy_error:
        database.rollback()
        raise sql_alchemy_error
    except Exception:
        raise Exception
    
def company_by_any(value: any):
    try:
        return database.query(Company).filter(or_(Company.id == value, Company.sid == str(value).encode())).one_or_none()
    except exc.SQLAlchemyError as sql_alchemy_error:
        raise sql_alchemy_error
    except Exception:
        raise Exception