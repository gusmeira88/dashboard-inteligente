type Ponto = {
    label: string
    valor: number
}

type Props = {
    titulo: string
    dados: Ponto[]
    cor?: string
    formato?: (n: number) => string
}

function GraficoLinha({ titulo, dados, cor, formato }: Props) {
    const accent = cor || '#1d4ed8'
    const fmt = formato || ((n: number) => String(n))
    const largura = 720
    const altura = 220
    const padTop = 24
    const padBottom = 36
    const padLeft = 40
    const padRight = 16
    const plotW = largura - padLeft - padRight
    const plotH = altura - padTop - padBottom

    const max = Math.max(...dados.map(d => d.valor), 1)
    const total = dados.reduce((s, d) => s + d.valor, 0)

    function x(i: number): number {
        if (dados.length <= 1) return padLeft + plotW / 2
        return padLeft + (i / (dados.length - 1)) * plotW
    }
    function y(v: number): number {
        return padTop + plotH - (v / max) * plotH
    }

    const pathLinha = dados.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d.valor)}`).join(' ')
    const pathArea = `${pathLinha} L ${x(dados.length - 1)} ${padTop + plotH} L ${x(0)} ${padTop + plotH} Z`

    const gridLinhas = [0, 0.25, 0.5, 0.75, 1]
    const ticksX = dados.length > 12
        ? [0, Math.floor(dados.length / 4), Math.floor(dados.length / 2), Math.floor(3 * dados.length / 4), dados.length - 1]
        : dados.map((_, i) => i)

    function rotuloCurto(label: string): string {
        if (label.length === 10 && label[4] === '-') {
            const [, m, d] = label.split('-')
            return `${d}/${m}`
        }
        return label
    }

    return (
        <div className="card grafico-card">
            <h2>{titulo}</h2>
            {dados.length === 0 || total === 0 ? (
                <p className="vazio">Sem dados para exibir</p>
            ) : (
                <svg viewBox={`0 0 ${largura} ${altura}`} className="linha-svg" preserveAspectRatio="none">
                    {gridLinhas.map((g, i) => (
                        <line
                            key={i}
                            x1={padLeft}
                            x2={padLeft + plotW}
                            y1={padTop + plotH * g}
                            y2={padTop + plotH * g}
                            className="linha-grid"
                            strokeWidth="1"
                        />
                    ))}
                    {gridLinhas.map((g, i) => (
                        <text
                            key={`yt-${i}`}
                            x={padLeft - 8}
                            y={padTop + plotH * g + 3}
                            textAnchor="end"
                            className="linha-axis-label"
                        >
                            {Math.round(max * (1 - g))}
                        </text>
                    ))}
                    <path d={pathArea} fill={accent} fillOpacity="0.12" />
                    <path d={pathLinha} fill="none" stroke={accent} strokeWidth="2.5" />
                    {dados.map((d, i) => (
                        <circle
                            key={i}
                            cx={x(i)}
                            cy={y(d.valor)}
                            r={d.valor > 0 ? 3 : 0}
                            fill={accent}
                        >
                            <title>{`${rotuloCurto(d.label)}: ${fmt(d.valor)}`}</title>
                        </circle>
                    ))}
                    {ticksX.map((i) => (
                        <text
                            key={`xt-${i}`}
                            x={x(i)}
                            y={altura - 12}
                            textAnchor="middle"
                            className="linha-axis-label"
                        >
                            {rotuloCurto(dados[i].label)}
                        </text>
                    ))}
                </svg>
            )}
        </div>
    )
}

export default GraficoLinha
