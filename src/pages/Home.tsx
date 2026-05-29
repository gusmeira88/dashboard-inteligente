import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MetricCards from '../components/MetricCards'
import ModalInserir from '../modals/ModalInserir'
import Icon from '../components/Icon'
import { lerCache, gravarCache } from '../utils/cache'

const CACHE_METRICAS = 'cache:metricas'
const METRICAS_INICIAIS = { total: 0, valor_total: 0, mais_caro: 0, mais_barato: 0, preco_medio: 0 }

type Metricas = {
    total: number
    valor_total: number
    mais_caro: number
    mais_barato: number
    preco_medio: number
}

function Home() {
    const api = "http://127.0.0.1:8000/produtos"
    const navigate = useNavigate()
    const [metricas, setMetricas] = useState<Metricas>(() => lerCache<Metricas>(CACHE_METRICAS, METRICAS_INICIAIS))
    const [modalInserirAberto, setModalInserirAberto] = useState<boolean>(false)
    const [categoriasSugeridas, setCategoriasSugeridas] = useState<string[]>([])

    async function buscarMetricas() {
        try {
            const resposta = await fetch(`${api}/metricas`)
            const dados: Metricas = await resposta.json()
            setMetricas(dados)
            gravarCache(CACHE_METRICAS, dados)
        } catch {
            return
        }
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
        buscarMetricas()
        carregarCategorias()
    }, [])

    return (
        <div className="main">
            <div className="page-header">
                <div>
                    <h1 className="page-titulo">Visão Geral</h1>
                    <p className="page-subtitulo">Resumo rápido e atalhos do catálogo</p>
                </div>
            </div>

            <MetricCards
                total={metricas.total}
                valorTotal={metricas.valor_total}
                maisCaro={metricas.mais_caro}
            />

            <h2 className="section-titulo">Ações rápidas</h2>
            <div className="acoes-grid">
                <button className="acao-card" onClick={() => setModalInserirAberto(true)}>
                    <div className="acao-card-icone primario"><Icon name="plus" size={20} /></div>
                    <span className="acao-card-titulo">Cadastrar produto</span>
                    <span className="acao-card-desc">Adicione um novo item ao catálogo</span>
                </button>

                <button className="acao-card" onClick={() => navigate('/produtos')}>
                    <div className="acao-card-icone azul"><Icon name="edit" size={20} /></div>
                    <span className="acao-card-titulo">Editar produtos</span>
                    <span className="acao-card-desc">Buscar e atualizar produtos existentes</span>
                </button>

                <button className="acao-card" onClick={() => navigate('/produtos')}>
                    <div className="acao-card-icone vermelho"><Icon name="trash" size={20} /></div>
                    <span className="acao-card-titulo">Remover produtos</span>
                    <span className="acao-card-desc">Excluir itens que saíram do catálogo</span>
                </button>
            </div>

            <ModalInserir
                aberto={modalInserirAberto}
                categoriasSugeridas={categoriasSugeridas}
                onFechar={() => setModalInserirAberto(false)}
                onAcao={buscarMetricas}
            />
        </div>
    )
}

export default Home
