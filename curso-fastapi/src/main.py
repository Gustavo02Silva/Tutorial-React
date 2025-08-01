from fastapi import FastAPI, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from database import SessionLocal
import auth
import schemas
from models import Author, Post
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou especifique: ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register/")
def register(author: schemas.AuthorCreate, db: Session = Depends(get_db)):
    

    #Verifica se o usuário já existe
    existing_user = db.query(Author).filter(Author.username == author.username).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Autor já existe")

    #Gerando o hash da senha do author
    hashed_password = auth.hash_password(author.password)

    #Cria novo autor
    db_author = Author(username=author.username,
        email = author.email, password=hashed_password)
    db.add(db_author)
    db.commit()
    

    #Cria o token JWT para o usuário recém criado
    token = auth.create_token({"sub": author.username},
                expires_delta=auth.timedelta(hours=2))
    
    return {"msg": "Usuário registrado com sucesso", "access_token": token}

@app.post("/login/")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(Author).filter(Author.username == user.username).first()

    if not db_user or not auth.verify_password(user.password,
                                db_user.password):
        raise HTTPException(status_code=400, detail="Credenciais inválidas")
        #Cria o token JWT para o usuário recém criado
    token = auth.create_token({"sub": db_user.username},
                expires_delta=auth.timedelta(hours=2))
    return {"access_token": token}

@app.post("/posts/")
def create_post(
    post: schemas.PostCreate,
    db: Session = Depends(get_db),
    username: str = Depends(auth.get_current_user)  # Obtém o usuário autenticado
):
    db_user = db.query(Author).filter(Author.username == username).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    db_post = Post(author_id=db_user.id, title=post.title, text=post.text, date=post.date)
    db.add(db_post)
    db.commit()

    return {"msg": "Post criado com sucesso"}

@app.get("/posts/")
def get_all_posts(db: Session = Depends(get_db)):
    posts = db.query(Post).all()
    return posts