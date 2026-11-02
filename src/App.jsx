import { useEffect, useState } from 'react'
import { analyze } from './lib/analyzer.js'
import ResultCard from './components/ResultCard.jsx'
import { EXAMPLES } from './lib/examples.js'
import { LANGS, ui } from './lib/i18n.js'
import Quiz from './components/Quiz.jsx'
import ScreenshotUpload from './components/ScreenshotUpload.jsx'

export default function App() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [tab, setTab] = useState('check')
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en')
  const t = ui(lang)

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  function check(e) {
    e.preventDefault()
    if (!text.trim()) return
    setResult(analyze(text))
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="lang-switch" role="group" aria-label="Language">
          {Object.entries(LANGS).map(([code, name]) => (
            <button
              key={code}
              type="button"
              className={lang === code ? 'active' : ''}
              aria-pressed={lang === code}
              onClick={() => setLang(code)}
            >
              {name}
            </button>
          ))}
        </div>
        <h1>
          <span aria-hidden="true">🛡️</span> ScamShield
        </h1>
        <p>{t.tagline}</p>
      </header>

      <nav className="tabs" role="tablist">
        {['check', 'quiz'].map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={tab === id ? 'active' : ''}
            onClick={() => setTab(id)}
          >
            {id === 'check' ? t.tabCheck : t.tabQuiz}
          </button>
        ))}
      </nav>

      {tab === 'quiz' && <Quiz key={lang} lang={lang} />}

      <main hidden={tab !== 'check'}>
        <form className="checker" onSubmit={check}>
          <label htmlFor="msg">{t.inputLabel}</label>
          <textarea
            id="msg"
            rows={6}
            value={text}
            placeholder={t.placeholder}
            onChange={(e) => {
              setText(e.target.value)
              setResult(null)
            }}
          />
          <div className="actions">
            <button type="submit" className="primary" disabled={!text.trim()}>
              {t.check}
            </button>
            <ScreenshotUpload
              lang={lang}
              onText={(txt) => {
                setText(txt)
                setResult(analyze(txt))
              }}
            />
            {text && (
              <button
                type="button"
                className="ghost"
                onClick={() => {
                  setText('')
                  setResult(null)
                }}
              >
                {t.clear}
              </button>
            )}
          </div>

          <div className="examples">
            <p className="muted">{t.tryExample}</p>
            <div className="chips">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  type="button"
                  className="chip"
                  onClick={() => {
                    setText(ex.text)
                    setResult(analyze(ex.text))
                  }}
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>
        </form>

        {result && <ResultCard result={result} text={text} lang={lang} />}
      </main>

      <footer>
        <p>{t.privacy}</p>
        <p className="muted">{t.disclaimer}</p>
      </footer>
    </div>
  )
}
