from sqlalchemy import create_engine, exc
from sqlalchemy.orm import declarative_base, sessionmaker
import json

# try:
#     import pymysql
#     pymysql.install_as_MySQLdb()
# except Exception:
#     pass

database = {}

# Updating database configuration if .env.local file exists
try:
    with open(".env.local", "r") as file:
        env = json.load(file)
        if (env["database"] is not None):
            database = env["database"]
except FileNotFoundError as fileNotFoundError:
    with open(".env", "r") as file:
        env = json.load(file)
        if (env["database"] is not None):
            database = env["database"]
            
db_engine = create_engine(
    f"mysql://{database['username']}:{database['password']}@{database['hostname']}:{database['port']}/{database['dbname']}", echo=True)
SessionMaker = sessionmaker(bind=db_engine)
session = SessionMaker()
Base = declarative_base()
