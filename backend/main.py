from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

conexao = sqlite3.connect("produtos.db", check_same_thread=False)
cursor = conexao.cursor()

@app.on_event("startup")
def startup():
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS produtos(
            id    INTEGER PRIMARY KEY AUTOINCREMENT,
            nome  TEXT,
            preco REAL
        )
    """)
    conexao.commit()
    print("✅ Tabela criada/verificada!")


@app.get("/produtos")
def listar():
    cursor.execute("SELECT * FROM produtos")
    linhas = cursor.fetchall()
    return [{"id": l[0], "nome": l[1], "preco": l[2]} for l in linhas]


@app.post("/produtos")
def criar(nome: str, preco: float):
    cursor.execute("INSERT INTO produtos (nome, preco) VALUES (?, ?)", (nome, preco))
    conexao.commit()
    return {"mensagem": "Produto criado!"}


@app.put("/produtos/{id}")
def atualizar(id: int, nome: str, preco: float):
    cursor.execute("UPDATE produtos SET nome = ?, preco = ? WHERE id = ?", (nome, preco, id))
    conexao.commit()
    return {"mensagem": "Produto atualizado!"}


@app.delete("/produtos/{id}")
def deletar(id: int):
    cursor.execute("DELETE FROM produtos WHERE id = ?", (id,))
    conexao.commit()
    return {"mensagem": "Produto deletado!"}