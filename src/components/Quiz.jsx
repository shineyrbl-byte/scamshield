import { useState } from 'react'
import { QUIZ } from '../lib/quiz.js'

const T = {
  en: {
    intro: 'Can you tell a scam from a real message? Test yourself with 8 real-world examples.',
    q: (i, n) => `Message ${i} of ${n}`,
    scam: '🚨 Scam',
    safe: '✅ Genuine',
    right: 'Correct!',
    wrong: 'Not quite.',
    wasScam: 'This was a scam.',
    wasSafe: 'This was genuine.',
    next: 'Next message →',
    finish: 'See my score',
    done: (s, n) => `You spotted ${s} out of ${n}.`,
    great: 'Excellent! You have sharp scam radar. Share this quiz with family who may be less sure.',
    ok: 'Good effort. Scammers are tricky. Keep the warning signs in mind and use the checker when in doubt.',
    again: 'Try again',
  },
  hi: {
    intro: 'क्या आप असली और स्कैम मैसेज में फ़र्क पहचान सकते हैं? 8 असली जैसे उदाहरणों से खुद को परखें।',
    q: (i, n) => `मैसेज ${i} / ${n}`,
    scam: '🚨 स्कैम',
    safe: '✅ असली',
    right: 'सही!',
    wrong: 'गलत।',
    wasScam: 'यह स्कैम था।',
    wasSafe: 'यह असली था।',
    next: 'अगला मैसेज →',
    finish: 'मेरा स्कोर देखें',
    done: (s, n) => `आपने ${n} में से ${s} सही पहचाने।`,
    great: 'शानदार! आप स्कैम अच्छी तरह पहचानते हैं। यह क्विज़ परिवार के साथ शेयर करें।',
    ok: 'अच्छी कोशिश। स्कैमर चालाक होते हैं। शक हो तो चेकर का इस्तेमाल करें।',
    again: 'फिर से खेलें',
  },
}

export default function Quiz({ lang }) {
  const t = T[lang] || T.en
  const [i, setI] = useState(0)
  const [answer, setAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const q = QUIZ[i]

  function pick(saysScam) {
    if (answer !== null) return
    setAnswer(saysScam)
    if (saysScam === q.scam) setScore((s) => s + 1)
  }

  function next() {
    if (i + 1 >= QUIZ.length) {
      setDone(true)
      return
    }
    setI(i + 1)
    setAnswer(null)
  }

  function restart() {
    setI(0)
    setAnswer(null)
    setScore(0)
    setDone(false)
  }

  if (done) {
    return (
      <section className="quiz card">
        <p className="quiz-score">{t.done(score, QUIZ.length)}</p>
        <p>{score >= QUIZ.length - 1 ? t.great : t.ok}</p>
        <div className="actions">
          <button type="button" className="primary" onClick={restart}>
            {t.again}
          </button>
        </div>
      </section>
    )
  }

  const correct = answer !== null && answer === q.scam

  return (
    <section className="quiz card">
      {i === 0 && answer === null && <p className="muted">{t.intro}</p>}
      <div className="quiz-progress" aria-hidden="true">
        <div style={{ width: `${(i / QUIZ.length) * 100}%` }} />
      </div>
      <p className="muted">{t.q(i + 1, QUIZ.length)}</p>
      <blockquote className="sms">{q.text}</blockquote>

      <div className="actions quiz-answers">
        <button
          type="button"
          className={answer === true ? 'picked' : ''}
          disabled={answer !== null}
          onClick={() => pick(true)}
        >
          {t.scam}
        </button>
        <button
          type="button"
          className={answer === false ? 'picked' : ''}
          disabled={answer !== null}
          onClick={() => pick(false)}
        >
          {t.safe}
        </button>
      </div>

      {answer !== null && (
        <div className={`quiz-feedback ${correct ? 'ok' : 'bad'}`} aria-live="polite">
          <p>
            <strong>{correct ? t.right : t.wrong}</strong> {q.scam ? t.wasScam : t.wasSafe}
          </p>
          <p>{q.why[lang] || q.why.en}</p>
          <div className="actions">
            <button type="button" className="primary" onClick={next}>
              {i + 1 >= QUIZ.length ? t.finish : t.next}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
