type Props = {
    minimo: number
    maximo: number
    media: number
    mediana: number
    amplitude: number
}

function ResumoEstatistico({ minimo, maximo, media, mediana, amplitude }: Props) {
    const formato = (n: number) => `R$ ${n.toFixed(2)}`
    return (
        <div className="card grafico-card">
            <h2>Resumo estatístico</h2>
            <div className="resumo-grid">
                <div className="resumo-item">
                    <span className="resumo-label">Menor preço</span>
                    <span className="resumo-valor">{formato(minimo)}</span>
                </div>
                <div className="resumo-item">
                    <span className="resumo-label">Maior preço</span>
                    <span className="resumo-valor">{formato(maximo)}</span>
                </div>
                <div className="resumo-item">
                    <span className="resumo-label">Preço médio</span>
                    <span className="resumo-valor">{formato(media)}</span>
                </div>
                <div className="resumo-item">
                    <span className="resumo-label">Mediana</span>
                    <span className="resumo-valor">{formato(mediana)}</span>
                </div>
                <div className="resumo-item resumo-item-largo">
                    <span className="resumo-label">Amplitude de preço</span>
                    <span className="resumo-valor">{formato(amplitude)}</span>
                </div>
            </div>
        </div>
    )
}

export default ResumoEstatistico
