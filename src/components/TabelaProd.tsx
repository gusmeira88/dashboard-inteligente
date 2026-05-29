type Produto = {
    id: number
    nome: string
    preco: number
    categoria?: string | null
}

type Props = {
    produtos: Produto[]
    totalPaginas: number
    pagina: number
    onBusca: (busca: string) => void
    onPagina: (pagina: number) => void
    onEditar: (produto: Produto) => void
    onAcao: () => void
}

const api: string = "http://127.0.0.1:8000/produtos"

function TabelaProd({ produtos, totalPaginas, pagina, onBusca, onPagina, onEditar, onAcao }: Props) {

    async function deletar(id: number) {
        await fetch(`${api}/${id}`, { method: "DELETE" })
        onAcao()
    }

    return (
        <div className="card">
            <div className="busca-topo">
                <input
                    className="input"
                    placeholder="Buscar produto pelo nome"
                    onChange={(e) => onBusca(e.target.value)}
                />
            </div>
            {produtos.length === 0 ? (
                <p className="vazio">Nenhum produto encontrado.</p>
            ) : (
                <>
                    <table className="tabela">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Categoria</th>
                                <th>Preço</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {produtos.map((produto: Produto) => (
                                <tr key={produto.id}>
                                    <td>{produto.id}</td>
                                    <td>{produto.nome}</td>
                                    <td>
                                        <span className="badge-categoria">
                                            {produto.categoria || "Sem categoria"}
                                        </span>
                                    </td>
                                    <td>R$ {produto.preco.toFixed(2)}</td>
                                    <td>
                                        <button className="btn-azul" onClick={() => onEditar(produto)}>
                                            Editar
                                        </button>
                                        <button className="btn-vermelho" onClick={() => deletar(produto.id)}>
                                            Deletar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="paginacao">
                        <button
                            className="btn-pagina"
                            onClick={() => onPagina(pagina - 1)}
                            disabled={pagina <= 1}
                        >
                            Anterior
                        </button>
                        <span className="pagina-info">Página {pagina} de {totalPaginas}</span>
                        <button
                            className="btn-pagina"
                            onClick={() => onPagina(pagina + 1)}
                            disabled={pagina >= totalPaginas}
                        >
                            Próximo
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default TabelaProd
