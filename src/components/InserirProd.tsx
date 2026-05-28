import { useState } from "react";

type Props = {
    onAcao: () => void
}

const api: string = "http://127.0.0.1:8000/produtos";

function InserirProd({ onAcao }: Props) {
    const [nome, setNome] = useState<string>("")
    const [preco, setPreco] = useState<number>(0)

    async function criar() {
        await fetch(`${api}?nome=${nome}&preco=${preco}`, {
            method: "POST"
        })
        setNome("")
        setPreco(0)
        onAcao()  // avisa o pai pra atualizar
    }

    return (
        <div className="card">
            <h2>➕ Inserir Produto</h2>
            <div className="form">
                <input
                    className="input"
                    placeholder="Nome do produto"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <input
                    className="input"
                    placeholder="Preço"
                    type="number"
                    value={preco}
                    onChange={(e) => setPreco(Number(e.target.value))}
                />
                <button className="btn-verde" onClick={criar}>Cadastrar</button>
            </div>
        </div>
    )
}

export default InserirProd