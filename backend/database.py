import sqlite3
import random
from datetime import datetime, timedelta

conexao = sqlite3.connect("produtos.db", check_same_thread=False)
cursor = conexao.cursor()


CATEGORIAS_KEYWORDS = {
    "Informática": [
        "notebook", "monitor", "mouse", "teclado", "headset", "webcam", "microfone",
        "caixa de som", "fone", "ssd", "hd externo", "pendrive", "cartao sd",
        "cabo hdmi", "cabo usb", "carregador usb", "carregador wireless",
        "power bank", "hub", "adaptador",
    ],
    "Casa Inteligente": ["smart", "camera", "roteador", "repetidor"],
    "Móveis e Escritório": ["cadeira", "mesa", "suporte"],
    "Material Escolar": [
        "caderno", "caneta", "lapis", "borracha", "apontador", "marcador",
        "estojo", "mochila", "calculadora", "regua",
    ],
}


def _categoria_para(nome):
    nome_lower = nome.lower()
    for categoria, palavras in CATEGORIAS_KEYWORDS.items():
        for p in palavras:
            if p in nome_lower:
                return categoria
    return "Outros"


def _coluna_existe(tabela, coluna):
    cursor.execute(f"PRAGMA table_info({tabela})")
    return any(linha[1] == coluna for linha in cursor.fetchall())


def startup():
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS produtos(
            id    INTEGER PRIMARY KEY AUTOINCREMENT,
            nome  TEXT,
            preco REAL
        )
    """)

    if not _coluna_existe("produtos", "categoria"):
        cursor.execute("ALTER TABLE produtos ADD COLUMN categoria TEXT")
    if not _coluna_existe("produtos", "created_at"):
        cursor.execute("ALTER TABLE produtos ADD COLUMN created_at TEXT")

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS precos_historico(
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            produto_id INTEGER,
            preco      REAL,
            data       TEXT
        )
    """)

    conexao.commit()

    _backfill_categorias()
    _backfill_datas()

    print("[OK] Tabela criada/verificada!")


def _backfill_categorias():
    cursor.execute("SELECT id, nome FROM produtos WHERE categoria IS NULL OR categoria = ''")
    pendentes = cursor.fetchall()
    if not pendentes:
        return
    for pid, nome in pendentes:
        cursor.execute(
            "UPDATE produtos SET categoria = ? WHERE id = ?",
            (_categoria_para(nome or ""), pid),
        )
    conexao.commit()


def _backfill_datas():
    cursor.execute("SELECT id FROM produtos WHERE created_at IS NULL OR created_at = ''")
    pendentes = [linha[0] for linha in cursor.fetchall()]
    if not pendentes:
        return
    agora = datetime.utcnow()
    for pid in pendentes:
        dias_atras = random.randint(0, 59)
        data = (agora - timedelta(days=dias_atras)).isoformat(timespec="seconds")
        cursor.execute("UPDATE produtos SET created_at = ? WHERE id = ?", (data, pid))
    conexao.commit()
