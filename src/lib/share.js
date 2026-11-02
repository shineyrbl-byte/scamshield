import { LEVELS } from './analyzer.js'

export function buildWarning(result) {
  const { score, level, flags } = result
  const lines = [
    `🛡️ ScamShield check: ${LEVELS[level].label.toUpperCase()} (risk ${score}/100)`,
  ]
  if (flags.length) {
    lines.push('', 'Warning signs:')
    for (const f of flags.slice(0, 5)) lines.push(`• ${f.title}`)
  }
  if (level !== 'safe') {
    lines.push('', 'If you get a message like this: do not click links, never share OTP/PIN, and never pay any "fee".')
  }
  lines.push('', `Check messages yourself: ${window.location.origin}${window.location.pathname}`)
  return lines.join('\n')
}

export function whatsappLink(text) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}
