import { useState } from 'react'

const T = {
  en: { button: '📷 Upload a screenshot', reading: (p) => `Reading text from screenshot… ${p}%`, fail: 'Could not read text from that image. Try a clearer screenshot or paste the text.' },
  hi: { button: '📷 स्क्रीनशॉट अपलोड करें', reading: (p) => `स्क्रीनशॉट से टेक्स्ट पढ़ा जा रहा है… ${p}%`, fail: 'इस फ़ोटो से टेक्स्ट नहीं पढ़ा जा सका। साफ़ स्क्रीनशॉट लें या टेक्स्ट पेस्ट करें।' },
}

// Reads text from an image entirely in the browser (Tesseract OCR).
// The image itself is never uploaded.
export default function ScreenshotUpload({ lang, onText }) {
  const t = T[lang] || T.en
  const [progress, setProgress] = useState(null)
  const [error, setError] = useState('')

  async function handle(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setError('')
    setProgress(0)
    try {
      const { createWorker } = await import('tesseract.js')
      const worker = await createWorker(['eng', 'hin'], 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') setProgress(Math.round(m.progress * 100))
        },
      })
      const { data } = await worker.recognize(file)
      await worker.terminate()
      const text = data.text.replace(/\n{3,}/g, '\n\n').trim()
      if (!text) throw new Error('empty')
      onText(text)
    } catch {
      setError(t.fail)
    } finally {
      setProgress(null)
    }
  }

  return (
    <div className="upload">
      <label className={`button upload-btn ${progress !== null ? 'busy' : ''}`}>
        {progress !== null ? t.reading(progress) : t.button}
        <input type="file" accept="image/*" onChange={handle} disabled={progress !== null} hidden />
      </label>
      {error && <p className="upload-error">{error}</p>}
    </div>
  )
}
