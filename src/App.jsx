import { useState } from 'react'
import { analyze } from './lib/analyzer.js'
import ResultCard from './components/ResultCard.jsx'

export default function App() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)

  function check(e) {
    e.preventDefault()
    if (!text.trim()) return
    setResult(analyze(text))
  }

  return (
    <div className="app">
      <header className="hero">
        <h1>
          <span aria-hidden="true">🛡️</span> ScamShield
        </h1>
        <p>Got a strange SMS, WhatsApp message, email or link? Paste it below and we'll tell you if it looks like a scam, in plain language.</p>
      </header>

      <main>
        <form className="checker" onSubmit={check}>
          <label htmlFor="msg">Suspicious message or link</label>
          <textarea
            id="msg"
            rows={6}
            value={text}
            placeholder="e.g. Dear customer, your SBI account will be blocked today. Update KYC now: http://sbi-kyc.xyz"
            onChange={(e) => {
              setText(e.target.value)
              setResult(null)
            }}
          />
          <div className="actions">
            <button type="submit" className="primary" disabled={!text.trim()}>
              Check message
            </button>
            {text && (
              <button
                type="button"
                className="ghost"
                onClick={() => {
                  setText('')
                  setResult(null)
                }}
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {result && <ResultCard result={result} />}
      </main>

      <footer>
        <p>🔒 Private by design: your message is checked on your device and never uploaded anywhere.</p>
        <p className="muted">ScamShield gives guidance, not guarantees. When in doubt, contact the organisation directly.</p>
      </footer>
    </div>
  )
}
