type Dado = {
    label: string
    valor: number
}

type Props = {
    titulo: string
    dados: Dado[]
    formato?: (n: number) => string
    cor?: string
}

function GraficoBarras({ titulo, dados, formato, cor }: Props) {
    const max = Math.max(...dados.map(d => d.valor), 1)
    const fmt = formato || ((n: number) => String(n))
    const accent = cor || '#1d4ed8'

    return (
        <div className="card grafico-card">
            <h2>{titulo}</h2>
            {dados.length === 0 ? (
                <p className="vazio">Sem dados para exibir</p>
            ) : (
                <div className="grafico-barras">
                    {dados.map((d, i) => (
                        <div className="barra-linha" key={i}>
                            <div className="barra-label" title={d.label}>{d.label}</div>
                            <div className="barra-track">
                                <div
                                    className="barra-fill"
                                    style={{
                                        width: `${(d.valor / max) * 100}%`,
                                        background: accent,
                                    }}
                                />
                            </div>
                            <div className="barra-valor">{fmt(d.valor)}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default GraficoBarras
