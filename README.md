# Dashboard Inteligente

Painel web full-stack para gestão de catálogo de produtos com CRUD completo, métricas em tempo real, visualizações analíticas construídas do zero e suporte a PWA com cache offline.

---

## Stack

**Frontend**
- React 19 + TypeScript
- Vite 8
- React Router 7
- CSS puro — sem Tailwind, sem libs de UI

**Backend**
- Python 3.14
- FastAPI
- SQLite

**PWA**
- Manifest + service worker manual (cache-first do app shell, network-first das APIs)

**Sem dependências externas para gráficos** — barras, donut e linha são SVG e CSS feitos à mão.

---

## Funcionalidades

- **Dashboard analítico** com filtros (busca, categoria, faixa de preço) recalculando métricas e gráficos ao vivo
- **5 visualizações**:
  - Cadastros nos últimos 30 dias (linha com área)
  - Top 5 produtos mais caros (barras)
  - Top 5 produtos mais baratos (barras)
  - Produtos por categoria (donut com legenda)
  - Distribuição por faixa de preço (donut com legenda)
- **Resumo estatístico** com mínimo, máximo, média, mediana e amplitude
- **CRUD completo** via modais, incluindo categoria com sugestões via `<datalist>`
- **Categorização automática** — produtos sem categoria recebem uma sugerida por palavras-chave do nome
- **Histórico de preços** — toda alteração de preço é registrada na tabela `precos_historico`
- **Tabela paginada** (10 por página) com busca server-side, badge de categoria e ações por linha
- **Stale-while-revalidate** via `localStorage` — listas, métricas e séries históricas aparecem instantaneamente do cache enquanto o fetch acontece
- **PWA instalável** com cache do app shell — funciona offline mostrando o último estado conhecido

---

## Estrutura

```
backend/
  main.py             FastAPI app, CORS e startup
  database.py         conexao SQLite, schema e backfill (categoria + datas)
  routes_produtos.py  endpoints /produtos
  produtos.db         banco SQLite (auto-criado)

public/
  manifest.webmanifest
  sw.js               service worker manual
  icon.svg            ícone do app

src/
  pages/
    Dashboard.tsx     /              análise completa com filtros e 5 gráficos
    Home.tsx          /visao-geral   resumo rápido e atalhos
    Produtos.tsx      /produtos      tabela CRUD com categoria
  components/
    Sidebar.tsx
    MetricCards.tsx
    GraficoBarras.tsx
    GraficoDonut.tsx
    GraficoLinha.tsx
    ResumoEstatistico.tsx
    TabelaProd.tsx
    Icon.tsx          ícones SVG inline
  modals/
    ModalInserir.tsx
    ModalEditar.tsx
  utils/
    cache.ts          helpers de localStorage
  registerSW.ts       registra o service worker
```

---

## Como rodar

### Pré-requisitos
- Node 20+
- Python 3.11+

### Backend
```bash
cd backend
pip install fastapi uvicorn
uvicorn main:app --host 127.0.0.1 --port 8000
```

A API sobe em `http://127.0.0.1:8000`. Documentação automática em `http://127.0.0.1:8000/docs`.

### Frontend
```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`. Em Chrome/Edge, clique no ícone de instalar na barra de endereço para instalar como app.

---

## API

| Método | Endpoint                                  | Descrição                                |
|--------|-------------------------------------------|------------------------------------------|
| GET    | `/produtos`                               | Lista paginada (10/página) com busca     |
| GET    | `/produtos/todos`                         | Todos os produtos sem paginação          |
| GET    | `/produtos/metricas`                      | total, valor total, máx, mín, média      |
| GET    | `/produtos/categorias`                    | Agregado por categoria (count, sum, avg) |
| GET    | `/produtos/historico-cadastros?dias=30`   | Série diária de cadastros                |
| POST   | `/produtos?nome=&preco=&categoria=`       | Cria produto (e registra no histórico)   |
| PUT    | `/produtos/{id}?nome=&preco=&categoria=`  | Atualiza e registra mudança de preço     |
| DELETE | `/produtos/{id}`                          | Remove produto e seu histórico           |

---

## Decisões técnicas

- **Zero libs de gráfico** — donut em SVG com `stroke-dasharray`, linha com `<path>` + área preenchida via fill-opacity, barras com flexbox. Mantém o bundle enxuto e demonstra domínio de fundamentos.
- **APIRouter modular** — `database.py` isola conexão, schema e backfill; `routes_produtos.py` agrupa endpoints; `main.py` fica com 15 linhas.
- **Rotas estáticas antes das dinâmicas** — `/produtos/metricas`, `/produtos/todos`, `/produtos/categorias` e `/produtos/historico-cadastros` declaradas antes de `/produtos/{id}` para o FastAPI não interpretar como ID.
- **Migrations idempotentes em SQLite** — `PRAGMA table_info` valida antes de cada `ALTER TABLE`, e o backfill de categoria/data só toca em linhas com NULL.
- **Stale-while-revalidate** — UI carrega do `localStorage` antes do fetch; combinado com o cache do service worker, o app abre instantaneamente e tolera quedas curtas do backend.
- **Filtros 100% client-side no dashboard** — `useMemo` recompila métricas, séries e gráficos sem nova requisição; a tabela continua paginada server-side.
- **Service worker manual** — sem build plugin, cache-first para `/` e estáticos, network-first para a API; vale como exercício de PWA sem mágica.

---

## Próximos passos

- Testes (pytest + vitest)
- Autenticação JWT
- Dark mode (persistido em `localStorage`)
- Exportação CSV/Excel do catálogo filtrado
- Notificações via toast em sucesso/erro de CRUD
- Deploy: backend no Render/Fly.io, frontend no Vercel
- CI com GitHub Actions (lint + testes)
- Docker compose para subir tudo com um comando
