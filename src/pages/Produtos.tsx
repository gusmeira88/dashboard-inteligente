import { useState, useEffect, useMemo } from 'react'
import TabelaProd from '../components/TabelaProd'
import ModalInserir from '../modals/ModalInserir'
import ModalEditar from '../modals/ModalEditar'

type Produto = {
    id: number
    nome: string
    preco: number
    categoria?: string | null
}

function Produtos() {
    const api = "http://127.0.0.1:8000/produtos"
    const [produtos, setProdutos] = useState<Produto[]>([])
    const [totalPaginas, setTotalPaginas] = useState<number>(1)
    const [busca, setBusca] = useState<string>("")
    const [pagina, setPagina] = useState<number>(1)
    const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null)
    const [modalInserirAberto, setModalInserirAberto] = useState<boolean>(false)
    const [categoriasSugeridas, setCategoriasSugeridas] = useState<string[]>([])

    async function buscar() {
        const resposta = await fetch(`${api}?busca=${busca}&pagina=${pagina}`)
        const dados = await resposta.json()
        setProdutos(dados.produtos)
        setTotalPaginas(dados.total_paginas)
    }

    async function carregarCategorias() {
        try {
            const resposta = await fetch(`${api}/categorias`)
            const dados: { categoria: string }[] = await resposta.json()
            setCategoriasSugeridas(dados.map(d => d.categoria))
        } catch {
            return
        }
    }

    useEffect(() => {
        buscar()
    }, [busca, pagina])

    useEffect(() => {
        carregarCategorias()
    }, [])

    function aoBuscar(novaBusca: string) {
        setPagina(1)
        setBusca(novaBusca)
    }

    function aoAcao() {
        buscar()
        carregarCategorias()
    }

    return (
        <div className="main">
            <div className="page-header">
                <div>
                    <h1 className="page-titulo">Produtos</h1>
                    <p className="page-subtitulo">Gerencie, edite e remova itens do catálogo</p>
                </div>
                <button className="btn-primario" onClick={() => setModalInserirAberto(true)}>
                    + Novo Produto
                </button>
            </div>

            <TabelaProd
                produtos={produtos}
                totalPaginas={totalPaginas}
                pagina={pagina}
                onBusca={aoBuscar}
                onPagina={setPagina}
                onEditar={setProdutoEditando}
                onAcao={aoAcao}
            />

            <ModalInserir
                aberto={modalInserirAberto}
                categoriasSugeridas={categoriasSugeridas}
                onFechar={() => setModalInserirAberto(false)}
                onAcao={aoAcao}
            />
            <ModalEditar
                produto={produtoEditando}
                categoriasSugeridas={categoriasSugeridas}
                onFechar={() => setProdutoEditando(null)}
                onAcao={aoAcao}
            />
        </div>
    )
}

export default Produtos
