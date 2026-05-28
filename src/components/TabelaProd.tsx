type Produto = {
    id: number
    nome: string
    preco: number
}

type Props = {
    produtos: Produto[]
}

function TabelaProd({ produtos }: Props) {
    return (
        <div className="card">
            <h2>📋 Lista de Produtos</h2>
            {produtos.length === 0 ? (
                <p className="vazio">Nenhum produto cadastrado.</p>
            ) : (
                <table className="tabela">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Preço</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtos.map((produto: Produto) => (
                            <tr key={produto.id}>
                                <td>{produto.id}</td>
                                <td>{produto.nome}</td>
                                <td>R$ {produto.preco}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default TabelaProd