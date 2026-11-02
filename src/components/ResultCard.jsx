import { useState } from 'react'
import { flagText, levelInfo, ui } from '../lib/i18n.js'
import { buildWarning, whatsappLink } from '../lib/share.js'
import Highlighted from './Highlighted.jsx'

const ICONS = { safe: '✅', suspicious: '⚠️', danger: '🚨' }

function Gauge({ score, level, label }) {
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
        <span>{label}</span>
      </div>
    </div>
  )
}

export default function ResultCard({ result, text, lang }) {
  const { score, level, flags } = result
  const info = levelInfo(level, lang)
  const t = ui(lang)
  const [copied, setCopied] = useState(false)
  const warning = buildWarning(result, lang)

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
        <Gauge score={score} level={level} label={t.risk} />
        <div>
          <p className="verdict">
            <span aria-hidden="true">{ICONS[level]}</span> {info.label}
          </p>
          <p className="muted">
            {flags.length ? t.foundSigns(flags.length) : t.noSigns}
          </p>
        </div>
      </div>

      {flags.length > 0 && (
        <>
          <h3>{t.suspiciousParts}</h3>
          <Highlighted text={text} flags={flags} />
          <h3>{t.why}</h3>
          <ul className="flags">
            {flags.map((f) => (
              <li key={f.id} className={f.weight >= 25 ? 'flag flag-high' : 'flag'}>
                <p className="flag-title">{flagText(f, lang).title}</p>
                <p className="flag-explain">{flagText(f, lang).explain}</p>
                {f.match && (
                  <p className="flag-match">
                    {t.found} <mark>“{f.match}”</mark>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      <h3>{t.whatToDo}</h3>
      <ol className="advice">
        {info.advice.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ol>

      {level !== 'safe' && (
        <div className="share">
          <p>
            <strong>{t.protect}</strong> {t.protectText}
          </p>
          <div className="actions">
            <a className="button whatsapp" href={whatsappLink(warning)} target="_blank" rel="noreferrer">
              {t.shareWhatsapp}
            </a>
            <button type="button" onClick={share}>
              {copied ? t.copied : t.shareCopy}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
