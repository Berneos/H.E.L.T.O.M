import { useId, useRef, useState } from 'react'
import './Habilidades.css'

const STATS = [
  {
    value: '4',
    label: 'HABILIDADES ATIVAS',
    hint: 'em execução',
    tone: 'green',
  },
  {
    value: '6.0',
    label: 'NÍVEL MÉDIO',
    hint: 'de 10 máximo',
    tone: 'purple',
  },
  {
    value: '2',
    label: 'SLOTS DISPONÍVEIS',
    hint: 'para novos módulos',
    tone: 'orange',
  },
  {
    value: '68%',
    label: 'CARGA COGNITIVA',
    hint: 'dentro do limite',
    tone: 'cyan',
  },
]

const SKILLS = [
  {
    id: 'SKL-01',
    title: 'ARTES MARCIAIS',
    category: 'OFENSIVO',
    active: true,
    tone: 'red',
    level: 10,
    xp: 10000,
    xpMax: 10000,
    description:
      'Canaliza impulsos sinápticos em vetores de ataque. Latência baixa.',
  },
  {
    id: 'SKL-02',
    title: 'BALLET',
    category: 'SOCIAL',
    active: true,
    tone: 'purple',
    level: 7,
    xp: 8540,
    xpMax: 10000,
    description:
      'Execução de movimentos graciosos e precisos. Requer coordenação motora fina.',
  },
  {
    id: 'SKL-03',
    title: 'SUPRESSÃO EMOCIONAL',
    category: 'DEFENSIVO',
    active: false,
    tone: 'green',
    level: 4,
    xp: 3200,
    xpMax: 5000,
    description:
      'Atenuação voluntária de picos afetivos. Módulo offline — requer recalibração do limiar de empatia.',
  },
  {
    id: 'SKL-04',
    title: 'ANÁLISE DE PADRÕES',
    category: 'COGNITIVO',
    active: true,
    tone: 'cyan',
    level: 6,
    xp: 5500,
    xpMax: 7500,
    description:
      'Detecta correlações ocultas em fluxos de dados e comportamento. Precisão cresce com amostras repetidas.',
  },
  {
    id: 'SKL-05',
    title: 'LINK EMPÁTICO',
    category: 'SOCIAL',
    active: false,
    tone: 'purple',
    level: 2,
    xp: 1200,
    xpMax: 2500,
    description:
      'Estabelece resonância emocional de curto alcance. Slot inativo — protocolo de consentimento pendente.',
  },
  {
    id: 'SKL-06',
    title: 'CRIPTOGRAFIA MNÊMICA',
    category: 'DEFENSIVO',
    active: true,
    tone: 'green',
    level: 8,
    xp: 7900,
    xpMax: 10000,
    description:
      'Blindagem de clusters de memória com chaves neurais rotativas. Protege contra leitura não autorizada.',
  },
]

/**
 * Ponto de integração com o backend.
 * Substitua o corpo por POST multipart/form-data para o endpoint de upload.
 */
async function uploadHabilidade(file) {
  // TODO: conectar ao backend
  // const body = new FormData()
  // body.append('habilidade', file)
  // const res = await fetch('/api/habilidades/upload', { method: 'POST', body })
  // if (!res.ok) throw new Error('Falha no upload')
  // return res.json()
  await new Promise((resolve) => setTimeout(resolve, 600))
  return { ok: true, fileName: file.name }
}

export function Habilidades() {
  const inputId = useId()
  const inputRef = useRef(null)
  const [uploadState, setUploadState] = useState({ status: 'idle', fileName: '' })

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setUploadState({ status: 'uploading', fileName: file.name })

    try {
      await uploadHabilidade(file)
      setUploadState({ status: 'success', fileName: file.name })
    } catch {
      setUploadState({ status: 'error', fileName: file.name })
    }
  }

  return (
    <main className="habilidades" id="habilidades">
      <section className="habilidades-stats" aria-label="Métricas de habilidades">
        {STATS.map((stat) => (
          <article key={stat.label} className={`habilidades-stat tone-${stat.tone}`}>
            <p className="habilidades-stat-value">{stat.value}</p>
            <p className="habilidades-stat-label">{stat.label}</p>
            <p className="habilidades-stat-hint">{stat.hint}</p>
          </article>
        ))}
      </section>

      <div className="habilidades-toolbar">
        <div className="habilidades-toolbar-copy">
          <p className="habilidades-toolbar-label">MÓDULOS</p>
          <p className="habilidades-toolbar-hint">
            {uploadState.status === 'uploading' && `Enviando ${uploadState.fileName}…`}
            {uploadState.status === 'success' && `Módulo recebido: ${uploadState.fileName}`}
            {uploadState.status === 'error' && `Falha ao enviar ${uploadState.fileName}`}
            {uploadState.status === 'idle' && '2 slots livres para novos módulos'}
          </p>
        </div>

        <input
          ref={inputRef}
          id={inputId}
          className="habilidades-upload-input"
          type="file"
          accept=".json,.skl,.bin,application/json"
          onChange={handleFileChange}
        />
        <button
          type="button"
          className="habilidades-upload-btn"
          disabled={uploadState.status === 'uploading'}
          onClick={() => inputRef.current?.click()}
        >
          {uploadState.status === 'uploading' ? 'ENVIANDO…' : '+ UPLOAD DE HABILIDADE'}
        </button>
      </div>

      <section className="habilidades-grid" aria-label="Módulos de habilidade">
        {SKILLS.map((skill) => (
          <article
            key={skill.id}
            className={`habilidades-card tone-${skill.tone}${skill.active ? ' is-active' : ''}`}
          >
            <header className="habilidades-card-top">
              <span className="habilidades-card-id">{skill.id}</span>
              <div className="habilidades-card-flags">
                <span className="habilidades-card-cat">{skill.category}</span>
                <span
                  className={`habilidades-card-status${skill.active ? ' is-on' : ''}`}
                >
                  <span className="habilidades-card-status-dot" aria-hidden="true" />
                  {skill.active ? 'ATIVO' : 'INATIVO'}
                </span>
              </div>
            </header>

            <h2 className="habilidades-card-title">{skill.title}</h2>

            <div className="habilidades-nvl">
              <div className="habilidades-nvl-label">
                <span>NVL</span>
                <span>
                  {skill.level}
                  <em>/10</em>
                </span>
              </div>
              <div className="habilidades-nvl-bars" aria-hidden="true">
                {Array.from({ length: 10 }, (_, i) => (
                  <span
                    key={i}
                    className={`habilidades-nvl-seg${i < skill.level ? ' is-filled' : ''}`}
                  />
                ))}
              </div>
            </div>

            <div className="habilidades-xp">
              <span>XP</span>
              <div className="habilidades-xp-track">
                <span
                  className="habilidades-xp-fill"
                  style={{ width: `${(skill.xp / skill.xpMax) * 100}%` }}
                />
              </div>
              <span className="habilidades-xp-value">
                {formatXp(skill.xp)} / {formatXp(skill.xpMax)}
              </span>
            </div>

            <p className="habilidades-card-desc">{skill.description}</p>
          </article>
        ))}
      </section>

      <footer className="habilidades-footer">
        <span>MNEMO // VAULT — NEURAL MEMORY MANAGEMENT SYSTEM v4.7.2</span>
        <span>
          TAG#: #600788 · ENCRIPTAÇÃO: AES-512{' '}
          <span className="habilidades-secure">
            <span className="habilidades-secure-dot" aria-hidden="true" />
            SEGURO
          </span>
        </span>
      </footer>
    </main>
  )
}

function formatXp(value) {
  return value.toLocaleString('pt-BR')
}

export default Habilidades
