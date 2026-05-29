import { useState, useEffect, useMemo } from 'react'
import MetricCards from '../components/MetricCards'
import GraficoBarras from '../components/GraficoBarras'
import GraficoDonut from '../components/GraficoDonut'
import GraficoLinha from '../components/GraficoLinha'
import ResumoEstatistico from '../components/ResumoEstatistico'
import Icon from '../components/Icon'
import { lerCache, gravarCache } from '../utils/cache'

const CACHE_PRODUTOS = 'cache:produtos'
const CACHE_HISTORICO = 'cache:historico'

type Produto = {
    id: number
    nome: string
    preco: number
    categoria?: string | null
    created_at?: string | null
}

type PontoHistorico = {
    data: string
    total: number
}

const FAIXAS = [
    { label: 'Até R$ 50',         cor: '#1d4ed8', test: (p: number) => p < 50 },
    { label: 'R$ 50 a R$ 100',    cor: '#15803d', test: (p: number) => p >= 50 && p < 100 },
    { label: 'R$ 100 a R$ 200',   cor: '#b45309', test: (p: number) => p >= 100 && p < 200 },
    { label: 'R$ 200 a R$ 500',   cor: '#6d28d9', test: (p: number) => p >= 200 && p < 500 },
    { label: 'Acima de R$ 500',   cor: '#dc2626', test: (p: number) => p >= 500 },
]

const CORES_CATEGORIA = ['#1d4ed8', '#15803d', '#b45309', '#6d28d9', '#dc2626', '#0891b2', '#db2777']

function mediana(valores: number[]): number {
    if (valores.length === 0) return 0
    const ordenado = [...valores].sort((a, b) => a - b)
    const meio = Math.floor(ordenado.length / 2)
    if (ordenado.length % 2 === 0) {
        return (ordenado[meio - 1] + ordenado[meio]) / 2
    }
    return ordenado[meio]
}

function Dashboard() {
    const api = "http://127.0.0.1:8000/produtos"
    const [produtos, setProdutos] = useState<Produto[]>(() => lerCache<Produto[]>(CACHE_PRODUTOS, []))
    const [historico, setHistorico] = useState<PontoHistorico[]>(() => lerCache<PontoHistorico[]>(CACHE_HISTORICO, []))
    const [busca, setBusca] = useState<string>("")
    const [precoMin, setPrecoMin] = useState<string>("")
    const [precoMax, setPrecoMax] = useState<string>("")
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>("")

    async function carregar() {
        try {
            const r1 = await fetch(`${api}/todos`)
            const lista: Produto[] = await r1.json()
            setProdutos(lista)
            gravarCache(CACHE_PRODUTOS, lista)

            const r2 = await fetch(`${api}/historico-cadastros?dias=30`)
            const serie: PontoHistorico[] = await r2.json()
            setHistorico(serie)
            gravarCache(CACHE_HISTORICO, serie)
        } catch {
            return
        }
    }

    useEffect(() => {
        carregar()
    }, [])

    const categoriasDisponiveis = useMemo(() => {
        const set = new Set<string>()
        produtos.forEach(p => set.add(p.categoria || "Sem categoria"))
        return Array.from(set).sort()
    }, [produtos])

    const filtrados = useMemo(() => {
        const buscaLower = busca.trim().toLowerCase()
        const min = precoMin === "" ? -Infinity : Number(precoMin)
        const max = precoMax === "" ? Infinity : Number(precoMax)
        return produtos.filter(p => {
            const cat = p.categoria || "Sem categoria"
            return (
                p.nome.toLowerCase().includes(buscaLower) &&
                p.preco >= min &&
                p.preco <= max &&
                (categoriaSelecionada === "" || cat === categoriaSelecionada)
            )
        })
    }, [produtos, busca, precoMin, precoMax, categoriaSelecionada])

    const metricas = useMemo(() => {
        const total = filtrados.length
        const valorTotal = filtrados.reduce((s, p) => s + p.preco, 0)
        const maisCaro = filtrados.reduce((m, p) => Math.max(m, p.preco), 0)
        const precoMedio = total === 0 ? 0 : valorTotal / total
        return { total, valorTotal, maisCaro, precoMedio }
    }, [filtrados])

    const estatisticas = useMemo(() => {
        if (filtrados.length === 0) {
            return { minimo: 0, maximo: 0, media: 0, mediana: 0, amplitude: 0 }
        }
        const precos = filtrados.map(p => p.preco)
        const minimo = Math.min(...precos)
        const maximo = Math.max(...precos)
        const media = precos.reduce((s, n) => s + n, 0) / precos.length
        return { minimo, maximo, media, mediana: mediana(precos), amplitude: maximo - minimo }
    }, [filtrados])

    const topMaisCaros = useMemo(() => {
        return [...filtrados]
            .sort((a, b) => b.preco - a.preco)
            .slice(0, 5)
            .map(p => ({ label: p.nome, valor: p.preco }))
    }, [filtrados])

    const topMaisBaratos = useMemo(() => {
        return [...filtrados]
            .sort((a, b) => a.preco - b.preco)
            .slice(0, 5)
            .map(p => ({ label: p.nome, valor: p.preco }))
    }, [filtrados])

    const distribuicaoDonut = useMemo(() => {
        return FAIXAS.map(f => ({
            label: f.label,
            valor: filtrados.filter(p => f.test(p.preco)).length,
            cor: f.cor,
        }))
    }, [filtrados])

    const porCategoria = useMemo(() => {
        const mapa = new Map<string, number>()
        filtrados.forEach(p => {
            const cat = p.categoria || "Sem categoria"
            mapa.set(cat, (mapa.get(cat) || 0) + 1)
        })
        return Array.from(mapa.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([label, valor], i) => ({
                label,
                valor,
                cor: CORES_CATEGORIA[i % CORES_CATEGORIA.length],
            }))
    }, [filtrados])

    const cadastrosPorDia = useMemo(() => {
        return historico.map(p => ({ label: p.data, valor: p.total }))
    }, [historico])

    const filtrosAtivos = busca !== "" || precoMin !== "" || precoMax !== "" || categoriaSelecionada !== ""

    function limparFiltros() {
        setBusca("")
        setPrecoMin("")
        setPrecoMax("")
        setCategoriaSelecionada("")
    }

    return (
        <div className="main">
            <div className="page-header">
                <div>
                    <h1 className="page-titulo">Dashboard</h1>
                    <p className="page-subtitulo">Análise completa do catálogo de produtos</p>
                </div>
            </div>

            <div className="filtros-bar filtros-bar-amplo">
                <div className="filtro-campo filtro-busca">
                    <span className="filtro-icone"><Icon name="search" size={16} /></span>
                    <input
                        className="input"
                        placeholder="Buscar produto pelo nome"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </div>
                <div className="filtro-campo">
                    <select
                        className="input"
                        value={categoriaSelecionada}
                        onChange={(e) => setCategoriaSelecionada(e.target.value)}
                    >
                        <option value="">Todas as categorias</option>
                        {categoriasDisponiveis.map(c => (
                            <option value={c} key={c}>{c}</option>
                        ))}
                    </select>
                </div>
                <div className="filtro-campo">
                    <input
                        className="input"
                        type="number"
                        placeholder="Preço mínimo"
                        value={precoMin}
                        onChange={(e) => setPrecoMin(e.target.value)}
                    />
                </div>
                <div className="filtro-campo">
                    <input
                        className="input"
                        type="number"
                        placeholder="Preço máximo"
                        value={precoMax}
                        onChange={(e) => setPrecoMax(e.target.value)}
                    />
                </div>
                <button
                    className="btn-cinza"
                    onClick={limparFiltros}
                    disabled={!filtrosAtivos}
                >
                    Limpar
                </button>
            </div>

            <MetricCards
                total={metricas.total}
                valorTotal={metricas.valorTotal}
                maisCaro={metricas.maisCaro}
                precoMedio={metricas.precoMedio}
            />

            <div className="dashboard-graficos-largo">
                <GraficoLinha
                    titulo="Cadastros nos últimos 30 dias"
                    dados={cadastrosPorDia}
                    cor="#1d4ed8"
                />
            </div>

            <div className="dashboard-graficos">
                <GraficoBarras
                    titulo="Top 5 produtos mais caros"
                    dados={topMaisCaros}
                    formato={(n) => `R$ ${n.toFixed(2)}`}
                    cor="#1d4ed8"
                />
                <GraficoBarras
                    titulo="Top 5 produtos mais baratos"
                    dados={topMaisBaratos}
                    formato={(n) => `R$ ${n.toFixed(2)}`}
                    cor="#15803d"
                />
            </div>

            <div className="dashboard-graficos">
                <GraficoDonut
                    titulo="Produtos por categoria"
                    dados={porCategoria}
                />
                <GraficoDonut
                    titulo="Distribuição por faixa de preço"
                    dados={distribuicaoDonut}
                />
            </div>

            <div className="dashboard-graficos-largo">
                <ResumoEstatistico {...estatisticas} />
            </div>
        </div>
    )
}

export default Dashboard
