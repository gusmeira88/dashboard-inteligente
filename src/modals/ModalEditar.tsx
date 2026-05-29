import { useState, useEffect } from "react"

type Produto = {
    id: number
    nome: string
    preco: number
    categoria?: string | null
}

type Props = {
    produto: Produto | null
    categoriasSugeridas: string[]
    onFechar: () => void
    onAcao: () => void
}

const api: string = "http://127.0.0.1:8000/produtos"

function ModalEditar({ produto, categoriasSugeridas, onFechar, onAcao }: Props) {
    const [nome, setNome] = useState<string>("")
    const [preco, setPreco] = useState<number>(0)
    const [categoria, setCategoria] = useState<string>("")

    useEffect(() => {
        if (produto) {
            setNome(produto.nome)
            setPreco(produto.preco)
            setCategoria(produto.categoria || "")
        }
    }, [produto])

    if (!produto) return null

    async function salvar() {
        const cat = categoria.trim() === "" ? "Outros" : categoria.trim()
        await fetch(
            `${api}/${produto!.id}?nome=${encodeURIComponent(nome)}&preco=${preco}&categoria=${encodeURIComponent(cat)}`,
            { method: "PUT" }
        )
        onAcao()
        onFechar()
    }

    return (
        <div className="modal-overlay" onClick={onFechar}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-titulo">Editar produto</h2>
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
                        list="categorias-existentes-editar"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                    />
                    <datalist id="categorias-existentes-editar">
                        {categoriasSugeridas.map((c) => (
                            <option value={c} key={c} />
                        ))}
                    </datalist>
                </div>
                <div className="modal-acoes">
                    <button className="btn-cinza" onClick={onFechar}>Cancelar</button>
                    <button className="btn-primario" onClick={salvar}>Salvar</button>
                </div>
            </div>
        </div>
    )
}

export default ModalEditar
