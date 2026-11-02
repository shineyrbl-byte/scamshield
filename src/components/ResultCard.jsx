import { useState } from 'react'
import { LEVELS } from '../lib/analyzer.js'
import { buildWarning, whatsappLink } from '../lib/share.js'
import Highlighted from './Highlighted.jsx'

const ICONS = { safe: '✅', suspicious: '⚠️', danger: '🚨' }

function Gauge({ score, level }) {
  const r = 52
  const c = 2 * Math.PI * r
  return (
    <div className={`gauge gauge-${level}`} role="img" aria-label={`Risk score ${score} out of 100`}>
      <svg viewBox="0 0 120 120">
        <circle className="gauge-track" cx="60" cy="60" r={r} />
        <circle
          className="gauge-fill"
          cx="60"
          cy="60"
          r={r}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - score / 100)}
        />
      </svg>
      <div className="gauge-text">
        <strong>{score}</strong>
        <span>/ 100 risk</span>
      </div>
    </div>
  )
}

export default function ResultCard({ result, text }) {
  const { score, level, flags } = result
  const info = LEVELS[level]
  const [copied, setCopied] = useState(false)
  const warning = buildWarning(result)

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'ScamShield warning', text: warning })
        return
      } catch {
        // User cancelled or share failed; fall back to copying.
      }
    }
    await navigator.clipboard.writeText(warning)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className={`result result-${level}`} aria-live="polite">
      <div className="result-head">
        <Gauge score={score} level={level} />
        <div>
          <p className="verdict">
            <span aria-hidden="true">{ICONS[level]}</span> {info.label}
          </p>
          <p className="muted">
            {flags.length
              ? `We found ${flags.length} warning sign${flags.length > 1 ? 's' : ''}.`
              : 'We found no common warning signs.'}
          </p>
        </div>
      </div>

      {flags.length > 0 && (
        <>
          <h3>Suspicious parts of the message</h3>
          <Highlighted text={text} flags={flags} />
          <h3>Why we think so</h3>
          <ul className="flags">
            {flags.map((f) => (
              <li key={f.id} className={f.weight >= 25 ? 'flag flag-high' : 'flag'}>
                <p className="flag-title">{f.title}</p>
                <p className="flag-explain">{f.explain}</p>
                {f.match && (
                  <p className="flag-match">
                    Found: <mark>“{f.match}”</mark>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      <h3>What you should do</h3>
      <ol className="advice">
        {info.advice.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ol>

      {level !== 'safe' && (
        <div className="share">
          <p>
            <strong>Protect someone you love.</strong> Send this warning to family members who might get the same message.
          </p>
          <div className="actions">
            <a className="button whatsapp" href={whatsappLink(warning)} target="_blank" rel="noreferrer">
              Share on WhatsApp
            </a>
            <button type="button" onClick={share}>
              {copied ? 'Copied ✓' : 'Share / copy warning'}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
