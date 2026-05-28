type Produto = {
    id: number
    nome: string
    preco: number
}

type Props = {
    produtos: Produto[]
    onAcao: () => void
}

const api: string = "http://127.0.0.1:8000/produtos";

function DeletarProd({ produtos, onAcao }: Props) {

    async function deletar(id: number) {
        await fetch(`${api}/${id}`, { method: "DELETE" })
        onAcao()  // avisa o pai pra atualizar
    }

    return (
        <div className="card">
            <h2>🗑️ Deletar Produto</h2>
            {produtos.length === 0 ? (
                <p className="vazio">Nenhum produto cadastrado.</p>
            ) : (
                <table className="tabela">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Preço</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtos.map((produto: Produto) => (
                            <tr key={produto.id}>
                                <td>{produto.id}</td>
                                <td>{produto.nome}</td>
                                <td>R$ {produto.preco}</td>
                                <td>
                                    <button className="btn-vermelho" onClick={() => deletar(produto.id)}>
                                        Deletar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default DeletarProd