import { useState, useEffect } from 'react'
import TabelaProd from '../components/TabelaProd'
import InserirProd from '../components/InserirProd'
import DeletarProd from '../components/DeletarProd'

type Produto = {
    id: number
    nome: string
    preco: number
}

function Produtos() {
    const api = "http://127.0.0.1:8000/produtos"
    const [produtos, setProdutos] = useState<Produto[]>([])

    async function buscar() {
        const resposta = await fetch(api)
        const dados: Produto[] = await resposta.json()
        setProdutos(dados)
    }

    useEffect(() => {
        buscar()
    }, [])

    return (
        <div className="app">
            <h1 className="app-titulo">📦 Produtos</h1>
            <TabelaProd produtos={produtos} />
            <InserirProd onAcao={buscar} />
            <DeletarProd produtos={produtos} onAcao={buscar} />
        </div>
    )
}

export default Produtos