type Fatia = {
    label: string
    valor: number
    cor: string
}

type Props = {
    titulo: string
    dados: Fatia[]
}

function GraficoDonut({ titulo, dados }: Props) {
    const total = dados.reduce((s, d) => s + d.valor, 0)
    const raio = 60
    const circ = 2 * Math.PI * raio
    let acumulado = 0

    return (
        <div className="card grafico-card">
            <h2>{titulo}</h2>
            {total === 0 ? (
                <p className="vazio">Sem dados para exibir</p>
            ) : (
                <div className="donut-wrapper">
                    <svg className="donut-svg" viewBox="0 0 160 160">
                        <circle r={raio} cx="80" cy="80" fill="none" className="donut-track" strokeWidth="22" />
                        {dados.map((d, i) => {
                            const fracao = d.valor / total
                            const dash = fracao * circ
                            const elemento = (
                                <circle
                                    key={i}
                                    r={raio}
                                    cx="80"
                                    cy="80"
                                    fill="none"
                                    stroke={d.cor}
                                    strokeWidth="22"
                                    strokeDasharray={`${dash} ${circ - dash}`}
                                    strokeDashoffset={-acumulado}
                                    transform="rotate(-90 80 80)"
                                />
                            )
                            acumulado += dash
                            return elemento
                        })}
                        <text x="80" y="76" textAnchor="middle" className="donut-numero">{total}</text>
                        <text x="80" y="94" textAnchor="middle" className="donut-rotulo">produtos</text>
                    </svg>
                    <div className="donut-legenda">
                        {dados.map((d, i) => {
                            const pct = total === 0 ? 0 : (d.valor / total) * 100
                            return (
                                <div className="legenda-linha" key={i}>
                                    <span className="legenda-cor" style={{ background: d.cor }} />
                                    <span className="legenda-label">{d.label}</span>
                                    <span className="legenda-valor">{d.valor} ({pct.toFixed(0)}%)</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default GraficoDonut
