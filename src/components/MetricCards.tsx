import Icon from './Icon'

type Props = {
    total: number
    valorTotal: number
    maisCaro: number
    precoMedio?: number
}

function MetricCards({ total, valorTotal, maisCaro, precoMedio }: Props) {
    return (
        <div className={`metric-cards-grid ${precoMedio !== undefined ? 'cols-4' : 'cols-3'}`}>
            <div className="metric-card">
                <div className="metric-icone azul"><Icon name="package" size={22} /></div>
                <div className="metric-info">
                    <span className="metric-label">Total de produtos</span>
                    <span className="metric-valor">{total}</span>
                </div>
            </div>
            <div className="metric-card">
                <div className="metric-icone verde"><Icon name="wallet" size={22} /></div>
                <div className="metric-info">
                    <span className="metric-label">Valor total em estoque</span>
                    <span className="metric-valor">R$ {valorTotal.toFixed(2)}</span>
                </div>
            </div>
            {precoMedio !== undefined && (
                <div className="metric-card">
                    <div className="metric-icone amarelo"><Icon name="gauge" size={22} /></div>
                    <div className="metric-info">
                        <span className="metric-label">Ticket médio</span>
                        <span className="metric-valor">R$ {precoMedio.toFixed(2)}</span>
                    </div>
                </div>
            )}
            <div className="metric-card">
                <div className="metric-icone roxo"><Icon name="tag" size={22} /></div>
                <div className="metric-info">
                    <span className="metric-label">Maior preço</span>
                    <span className="metric-valor">R$ {maisCaro.toFixed(2)}</span>
                </div>
            </div>
        </div>
    )
}

export default MetricCards
