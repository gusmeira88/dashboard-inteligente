import { useState } from "react"

type Props = {
    aberto: boolean
    categoriasSugeridas: string[]
    onFechar: () => void
    onAcao: () => void
}

const api: string = "http://127.0.0.1:8000/produtos"

function ModalInserir({ aberto, categoriasSugeridas, onFechar, onAcao }: Props) {
    const [nome, setNome] = useState<string>("")
    const [preco, setPreco] = useState<number>(0)
    const [categoria, setCategoria] = useState<string>("")

    if (!aberto) return null

    async function criar() {
        const cat = categoria.trim() === "" ? "Outros" : categoria.trim()
        await fetch(
            `${api}?nome=${encodeURIComponent(nome)}&preco=${preco}&categoria=${encodeURIComponent(cat)}`,
            { method: "POST" }
        )
        setNome("")
        setPreco(0)
        setCategoria("")
        onAcao()
        onFechar()
    }

    return (
        <div className="modal-overlay" onClick={onFechar}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-titulo">Novo produto</h2>
                <div className="form-coluna">
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
                    <input
                        className="input"
                        placeholder="Categoria"
                        list="categorias-existentes"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                    />
                    <datalist id="categorias-existentes">
                        {categoriasSugeridas.map((c) => (
                            <option value={c} key={c} />
                        ))}
                    </datalist>
                </div>
                <div className="modal-acoes">
                    <button className="btn-cinza" onClick={onFechar}>Cancelar</button>
                    <button className="btn-primario" onClick={criar}>Cadastrar</button>
                </div>
            </div>
        </div>
    )
}

export default ModalInserir
