from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
from datetime import datetime, timedelta
import os

load_dotenv(".env.local")

# DB 설정
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# DB 모델
class Todo(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    completed = Column(Boolean, default=False)
    date = Column(String, nullable=True)


# Pydantic 스키마
class TodoCreate(BaseModel):
    title: str
    date: Optional[str] = None

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None

class TodoResponse(BaseModel):
    id: int
    title: str
    completed: bool
    date: Optional[str] = None

    class Config:
        from_attributes = True


# 테이블 생성
Base.metadata.create_all(bind=engine)

# 기존 DB에 date 컬럼이 없으면 추가
with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE todos ADD COLUMN date TEXT"))
        conn.commit()
    except Exception:
        pass

# FastAPI 앱
app = FastAPI(title="Todo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# DB 세션 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 엔드포인트
@app.get("/")
def root():
    return {"message": "Hello World"}

@app.get("/todos", response_model=list[TodoResponse])
def get_todos(filter: Optional[str] = None, search: Optional[str] = None, date: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Todo)
    if date:
        query = query.filter(Todo.date == date)
    if filter == "active":
        query = query.filter(Todo.completed == False)
    elif filter == "completed":
        query = query.filter(Todo.completed == True)
    if search:
        query = query.filter(Todo.title.like(f"%{search}%"))
    return query.all()

@app.get("/todos/week-counts")
def get_week_counts(week_start: str, db: Session = Depends(get_db)):
    try:
        start = datetime.strptime(week_start, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
    result = {}
    for i in range(7):
        d = (start + timedelta(days=i)).strftime("%Y-%m-%d")
        result[d] = db.query(Todo).filter(Todo.date == d).count()
    return result

@app.post("/todos", response_model=TodoResponse, status_code=201)
def create_todo(body: TodoCreate, db: Session = Depends(get_db)):
    date = body.date or datetime.today().strftime("%Y-%m-%d")
    todo = Todo(title=body.title, date=date)
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo

@app.get("/todos/{todo_id}", response_model=TodoResponse)
def get_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo

@app.put("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, body: TodoUpdate, db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    if body.title is not None:
        todo.title = body.title
    if body.completed is not None:
        todo.completed = body.completed
    db.commit()
    db.refresh(todo)
    return todo

@app.delete("/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(todo)
    db.commit()
