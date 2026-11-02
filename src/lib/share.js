import { flagText, levelInfo, ui } from './i18n.js'

export function buildWarning(result, lang = 'en') {
  const { score, level, flags } = result
  const t = ui(lang)
  const lines = [`🛡️ ${t.warnHeader}: ${levelInfo(level, lang).label.toUpperCase()} (${score}/100)`]
  if (flags.length) {
    lines.push('', t.warnSigns)
    for (const f of flags.slice(0, 5)) lines.push(`• ${flagText(f, lang).title}`)
  }
  if (level !== 'safe') lines.push('', t.warnTip)
  lines.push('', `${t.warnLink} ${window.location.origin}${window.location.pathname}`)
  return lines.join('\n')
}

export function whatsappLink(text) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}
