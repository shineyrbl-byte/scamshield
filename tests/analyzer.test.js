import { test } from 'node:test'
import assert from 'node:assert/strict'
import { analyze, analyzeUrl, extractUrls } from '../src/lib/analyzer.js'

const ids = (r) => r.flags.map((f) => f.id)

test('empty input is safe', () => {
  assert.equal(analyze('').level, 'safe')
})

test('normal message is safe', () => {
  const r = analyze('Hey, are we still meeting for lunch at 1pm tomorrow?')
  assert.equal(r.level, 'safe')
  assert.equal(r.score, 0)
})

test('genuine OTP-style bank alert without asks stays low-ish', () => {
  const r = analyze('Rs 500 debited from your HDFC account on 02-Nov. Not you? Call 1800-202-6161.')
  assert.notEqual(r.level, 'danger')
})

test('KYC phishing is danger', () => {
  const r = analyze(
    'Dear SBI customer, your account will be blocked today. Update your KYC immediately: http://sbi-kyc-update.xyz/login',
  )
  assert.equal(r.level, 'danger')
  for (const id of ['threat', 'kyc', 'url-lookalike', 'url-tld', 'url-http']) {
    assert.ok(ids(r).includes(id), `missing ${id}`)
  }
})

test('job scam is flagged', () => {
  const r = analyze('Part time job! Earn ₹3000 per day by liking YouTube videos. No experience needed. WhatsApp me now')
  assert.equal(r.level, 'danger')
  assert.ok(ids(r).includes('job'))
})

test('OTP request is flagged as credentials', () => {
  const r = analyze('Please share the OTP you just received to confirm your refund')
  assert.ok(ids(r).includes('credentials'))
})

test('official domains are not flagged as lookalikes', () => {
  assert.deepEqual(analyzeUrl('https://www.onlinesbi.sbi/'), [])
  assert.deepEqual(analyzeUrl('https://www.amazon.in/orders'), [])
})

test('shorteners and IP links are flagged', () => {
  assert.ok(analyzeUrl('bit.ly/3xYz').some((f) => f.id === 'url-shortener'))
  assert.ok(analyzeUrl('http://103.21.4.9/pay').some((f) => f.id === 'url-ip'))
})

test('extracts bare domains and strips trailing punctuation', () => {
  assert.deepEqual(extractUrls('Visit paytm-reward.top now.'), ['paytm-reward.top'])
})

test('rupee amounts are detected in payment requests', () => {
  const r = analyze('Your parcel is held at customs. Pay ₹499 clearance fee to release it.')
  assert.ok(ids(r).includes('payment'))
})

test('Hindi KYC scam is detected', () => {
  const r = analyze('प्रिय ग्राहक, आपका बैंक खाता आज बंद हो जाएगा। तुरंत केवाईसी अपडेट करें: http://sbi-kyc.top/hi')
  assert.equal(r.level, 'danger')
  for (const id of ['urgency', 'threat', 'kyc']) assert.ok(ids(r).includes(id), `missing ${id}`)
})

test('Hindi job scam is detected', () => {
  const r = analyze('घर बैठे काम करें और रोज़ ₹5000 कमाएं! अभी व्हाट्सएप करें')
  assert.ok(ids(r).includes('job'))
  assert.notEqual(r.level, 'safe')
})

test('Hinglish OTP request is detected', () => {
  const r = analyze('Sir aapka refund aa gaya hai, jo otp aaya hai wo jaldi bata do')
  assert.ok(ids(r).includes('credentials'))
})

test('normal Hindi message is safe', () => {
  assert.equal(analyze('कल शाम को खाने पर मिलते हैं, मम्मी ने बुलाया है।').level, 'safe')
})
