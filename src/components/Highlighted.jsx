// Shows the original message with every suspicious phrase highlighted.
export default function Highlighted({ text, flags }) {
  const ranges = []
  const lower = text.toLowerCase()
  for (const f of flags) {
    if (!f.match || f.match === '!!!') continue
    const start = lower.indexOf(f.match.toLowerCase())
    if (start >= 0) ranges.push({ start, end: start + f.match.length, title: f.title })
  }
  ranges.sort((a, b) => a.start - b.start)

  const parts = []
  let pos = 0
  for (const r of ranges) {
    if (r.start < pos) continue // skip overlaps
    if (r.start > pos) parts.push(text.slice(pos, r.start))
    parts.push(
      <mark key={r.start} title={r.title}>
        {text.slice(r.start, r.end)}
      </mark>,
    )
    pos = r.end
  }
  parts.push(text.slice(pos))

  return <blockquote className="highlighted">{parts}</blockquote>
}
