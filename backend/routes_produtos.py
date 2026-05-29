from datetime import datetime, timedelta
from fastapi import APIRouter
from database import conexao, cursor

router = APIRouter()


def _linha_para_dict(l):
    return {
        "id": l[0],
        "nome": l[1],
        "preco": l[2],
        "categoria": l[3] if len(l) > 3 else None,
        "created_at": l[4] if len(l) > 4 else None,
    }


@router.get("/produtos/metricas")
def metricas():
    cursor.execute("""
        SELECT COUNT(*),
               COALESCE(SUM(preco), 0),
               COALESCE(MAX(preco), 0),
               COALESCE(MIN(preco), 0),
               COALESCE(AVG(preco), 0)
        FROM produtos
    """)
    total, valor_total, mais_caro, mais_barato, preco_medio = cursor.fetchone()
    return {
        "total": total,
        "valor_total": valor_total,
        "mais_caro": mais_caro,
        "mais_barato": mais_barato,
        "preco_medio": preco_medio,
    }


@router.get("/produtos/todos")
def todos():
    cursor.execute("SELECT id, nome, preco, categoria, created_at FROM produtos ORDER BY id DESC")
    return [_linha_para_dict(l) for l in cursor.fetchall()]


@router.get("/produtos/categorias")
def categorias():
    cursor.execute("""
        SELECT COALESCE(categoria, 'Sem categoria') AS cat,
               COUNT(*),
               COALESCE(SUM(preco), 0),
               COALESCE(AVG(preco), 0)
        FROM produtos
        GROUP BY cat
        ORDER BY COUNT(*) DESC
    """)
    return [
        {"categoria": c, "total": t, "valor_total": v, "preco_medio": m}
        for c, t, v, m in cursor.fetchall()
    ]


@router.get("/produtos/historico-cadastros")
def historico_cadastros(dias: int = 30):
    hoje = datetime.utcnow().date()
    inicio = hoje - timedelta(days=dias - 1)
    cursor.execute(
        "SELECT substr(created_at, 1, 10) AS dia, COUNT(*) "
        "FROM produtos WHERE substr(created_at, 1, 10) >= ? "
        "GROUP BY dia ORDER BY dia",
        (inicio.isoformat(),),
    )
    contagem = {linha[0]: linha[1] for linha in cursor.fetchall()}
    serie = []
    for i in range(dias):
        d = (inicio + timedelta(days=i)).isoformat()
        serie.append({"data": d, "total": contagem.get(d, 0)})
    return serie


@router.get("/produtos")
def listar(busca: str = "", pagina: int = 1):
    por_pagina = 10
    offset = (pagina - 1) * por_pagina
    filtro = f"%{busca}%"

    cursor.execute("SELECT COUNT(*) FROM produtos WHERE nome LIKE ?", (filtro,))
    total = cursor.fetchone()[0]
    total_paginas = max(1, (total + por_pagina - 1) // por_pagina)

    cursor.execute(
        "SELECT id, nome, preco, categoria, created_at FROM produtos "
        "WHERE nome LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?",
        (filtro, por_pagina, offset),
    )
    produtos = [_linha_para_dict(l) for l in cursor.fetchall()]
    return {"produtos": produtos, "total_paginas": total_paginas}


@router.post("/produtos")
def criar(nome: str, preco: float, categoria: str = "Outros"):
    agora = datetime.utcnow().isoformat(timespec="seconds")
    cursor.execute(
        "INSERT INTO produtos (nome, preco, categoria, created_at) VALUES (?, ?, ?, ?)",
        (nome, preco, categoria, agora),
    )
    produto_id = cursor.lastrowid
    cursor.execute(
        "INSERT INTO precos_historico (produto_id, preco, data) VALUES (?, ?, ?)",
        (produto_id, preco, agora),
    )
    conexao.commit()
    return {"mensagem": "Produto criado!", "id": produto_id}


@router.put("/produtos/{id}")
def atualizar(id: int, nome: str, preco: float, categoria: str = "Outros"):
    cursor.execute("SELECT preco FROM produtos WHERE id = ?", (id,))
    linha = cursor.fetchone()
    preco_anterior = linha[0] if linha else None
    cursor.execute(
        "UPDATE produtos SET nome = ?, preco = ?, categoria = ? WHERE id = ?",
        (nome, preco, categoria, id),
    )
    if preco_anterior is not None and preco_anterior != preco:
        cursor.execute(
            "INSERT INTO precos_historico (produto_id, preco, data) VALUES (?, ?, ?)",
            (id, preco, datetime.utcnow().isoformat(timespec="seconds")),
        )
    conexao.commit()
    return {"mensagem": "Produto atualizado!"}


@router.delete("/produtos/{id}")
def deletar(id: int):
    cursor.execute("DELETE FROM produtos WHERE id = ?", (id,))
    cursor.execute("DELETE FROM precos_historico WHERE produto_id = ?", (id,))
    conexao.commit()
    return {"mensagem": "Produto deletado!"}
