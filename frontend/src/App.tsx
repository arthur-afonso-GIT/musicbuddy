import { useEffect, useState } from 'react'
import { checkHealth } from './api/client'

type Status = 'loading' | 'connected' | 'error'

function NavIcon({ name }: { name: 'home' | 'sheet' | 'tools' }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9" /><path d="M9 20v-6h6v6" /></>,
    sheet: <><path d="M6 3h9l4 4v14H6z" /><path d="M15 3v5h4" /><path d="M9 12h7M9 16h7" /></>,
    tools: <><path d="M4 6h16M4 12h16M4 18h16" /><circle cx="9" cy="6" r="2" /><circle cx="16" cy="12" r="2" /><circle cx="11" cy="18" r="2" /></>,
  }
  return <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const tools = [
  { number: '01', name: 'Descobrir tonalidade', description: 'Veja os tons que combinam com uma frase musical.' },
  { number: '02', name: 'Explorar acordes', description: 'Compare possibilidades ouvindo cada caminho.' },
  { number: '03', name: 'Montar a música', description: 'Organize ideias e cifras em blocos.' },
]

export default function App() {
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 8000)
    let active = true
    setStatus('loading')
    setMessage('')
    checkHealth(controller.signal)
      .then(() => { if (active) setStatus('connected') })
      .catch((error: unknown) => {
        if (!active) return
        setStatus('error')
        setMessage(controller.signal.aborted
          ? 'A conexão demorou mais que o esperado.'
          : error instanceof TypeError
            ? 'Não foi possível acessar a API local.'
            : error instanceof Error ? error.message : 'Não foi possível verificar a conexão.')
      })
      .finally(() => window.clearTimeout(timeout))
    return () => { active = false; window.clearTimeout(timeout); controller.abort() }
  }, [attempt])

  const statusText = status === 'loading' ? 'Verificando conexão' : status === 'connected' ? 'Ambiente local conectado' : 'API local desconectada'

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navegação principal">
        <a className="brand" href="#inicio" aria-label="MusicPlanner, início"><span className="brand-mark" aria-hidden="true">m</span> musicplanner</a>
        <nav className="sidebar-nav" aria-label="Seções da página">
          <p className="nav-label">Caderno</p>
          <a className="nav-link active" href="#inicio" aria-current="page"><NavIcon name="home" />Início</a>
          <a className="nav-link" href="#cifras"><NavIcon name="sheet" />Últimas cifras</a>
          <a className="nav-link" href="#ferramentas"><NavIcon name="tools" />Ferramentas</a>
        </nav>
        <div className="sidebar-bottom"><span>SEU ESPAÇO</span><strong>Protótipo local</strong></div>
      </aside>
      <div className="mobile-header"><div className="mobile-brand"><span className="brand-mark" aria-hidden="true">m</span> musicplanner</div><nav className="mobile-nav" aria-label="Seções da página"><a href="#cifras">Cifras</a><a href="#ferramentas">Ferramentas</a></nav></div>
      <main className="content" id="inicio">
        <div className="topline"><span>Início / Seu caderno</span><span className={`api-status ${status}`} role="status" aria-live="polite">{statusText}</span></div>
        <header className="page-heading"><h1>Seu caderno de música.</h1><p>Encontre suas cifras e, em breve, comece novas ideias a partir de uma melodia.</p></header>
        <section className="section" id="cifras" aria-labelledby="recent-title">
          <div className="section-heading"><h2 id="recent-title">Últimas cifras</h2><span>Recentes primeiro</span></div>
          <div className="recent-empty"><div className="empty-score" aria-hidden="true" /><div><h3>Nenhuma cifra salva ainda</h3><p>As músicas que você salvar aparecerão aqui para continuar depois.</p></div></div>
        </section>
        <section className="section" id="ferramentas" aria-labelledby="tools-title">
          <div className="section-heading"><h2 id="tools-title">Ferramentas</h2><span>Em desenvolvimento</span></div>
          <div className="tools">{tools.map(tool => <div className="tool-row" key={tool.number}><span className="tool-number" aria-hidden="true">{tool.number}</span><div><h3>{tool.name}</h3><p>{tool.description}</p></div><span className="tool-state">Em breve</span></div>)}</div>
        </section>
        <div className={`system-detail ${status}`}><p>{status === 'error' ? `${message} Inicie o backend e tente novamente.` : 'MusicPlanner está em construção. As ferramentas musicais ainda não estão disponíveis.'}</p><button className="text-button" disabled={status === 'loading'} onClick={() => setAttempt(value => value + 1)}>Verificar conexão</button></div>
      </main>
    </div>
  )
}
