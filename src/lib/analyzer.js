// ScamShield detection engine.
// Rule-based and fully offline: no message ever leaves the user's device.

const TEXT_RULES = [
  {
    id: 'urgency',
    title: 'Creates false urgency',
    explain:
      'Scammers rush you so you act before thinking. Real banks and companies give you time.',
    weight: 15,
    patterns: [
      /\burgent(ly)?\b/i,
      /\bimmediately\b/i,
      /\bact now\b/i,
      /\blast (chance|warning|reminder)\b/i,
      /\bwithin \d+\s*(hours?|hrs?|minutes?|mins?)\b/i,
      /\b(today|tonight) (itself|only)\b/i,
      /\bexpir(es|ing|ed) (today|soon|in)\b/i,
      /\bfinal notice\b/i,
    ],
  },
  {
    id: 'threat',
    title: 'Threatens you',
    explain:
      'Threats of arrest, account blocking or disconnection are a classic fear tactic. Police and banks do not threaten people over SMS or WhatsApp.',
    weight: 20,
    patterns: [
      /\b(account|card|sim|number|kyc)\b.{0,40}\b(blocked|suspended|deactivated|frozen|closed|disabled)\b/i,
      /\b(will be|has been|is) (blocked|suspended|deactivated|disconnected|terminated)\b/i,
      /\barrest(ed)?\b/i,
      /\bdigital arrest\b/i,
      /\blegal action\b/i,
      /\bwarrant\b/i,
      /\bpenalty\b/i,
      /\b(electricity|power|connection).{0,30}\bdisconnect/i,
    ],
  },
  {
    id: 'credentials',
    title: 'Asks for secret codes or passwords',
    explain:
      'No genuine bank, app or government office will ever ask for your OTP, PIN, CVV or password. Anyone asking is a scammer.',
    weight: 35,
    patterns: [
      /\b(share|send|tell|provide|enter|give).{0,25}\b(otp|pin|cvv|password|passcode|verification code)\b/i,
      /\b(otp|cvv|upi pin|atm pin)\b/i,
      /\bnet ?banking (id|password|credentials)\b/i,
      /\b(login|sign in) (details|credentials)\b/i,
    ],
  },
  {
    id: 'kyc',
    title: 'Fake KYC / account update request',
    explain:
      'Messages asking you to "update KYC", PAN or Aadhaar through a link are one of the most common bank scams in India.',
    weight: 25,
    patterns: [
      /\b(update|complete|verify|re-?verify)\b.{0,20}\b(kyc|pan|aadha?ar|account details)\b/i,
      /\bkyc\b.{0,30}\b(pending|expired|incomplete|update)\b/i,
      /\bverify your (account|identity)\b/i,
    ],
  },
  {
    id: 'prize',
    title: 'Too-good-to-be-true reward',
    explain:
      'You cannot win a lottery or prize you never entered. "Free" rewards are bait to get your money or details.',
    weight: 20,
    patterns: [
      /\b(you('ve| have)? won|winner|congratulations)\b/i,
      /\blottery\b/i,
      /\b(lucky|cash) ?(draw|prize|reward)\b/i,
      /\bclaim (your|the)?\s*(prize|reward|gift|cashback|refund)\b/i,
      /\bfree (gift|iphone|recharge|laptop)\b/i,
      /(\b\d+\s*(lakh|crore)\b|₹\s?\d{2,}[,\d]*).{0,30}\b(won|prize|reward|credited|cashback)\b/i,
    ],
  },
  {
    id: 'payment',
    title: 'Asks you to pay or transfer money',
    explain:
      'Being asked to pay a "fee" to receive money, a parcel or a job is always a scam. Never pay strangers via UPI, gift cards or crypto.',
    weight: 25,
    patterns: [
      /\b(registration|processing|clearance|customs|delivery|release|security) (fee|charge|deposit)\b/i,
      /\bpay\b.{0,25}(₹|\b(rs\.?|inr|fee|amount|now)\b)/i,
      /\bgift ?cards?\b/i,
      /\b(bitcoin|crypto|usdt)\b/i,
      /\b(scan|approve).{0,20}\b(qr|collect request|upi request)\b/i,
      /\btransfer\b.{0,20}(₹|\b(money|amount|funds|rs)\b)/i,
    ],
  },
  {
    id: 'job',
    title: 'Fake job / easy money offer',
    explain:
      'Offers of big daily earnings for simple online tasks (liking videos, rating hotels) end with you paying a "deposit" you never get back.',
    weight: 40,
    patterns: [
      /\b(work|job) from home\b/i,
      /\bpart[- ]?time (job|work|opportunity)\b/i,
      /\bearn\b.{0,25}?(₹|rs\.?|\$)?\s?\d[\d,]*.{0,20}\b(daily|per day|a day|\/day|weekly)\b/i,
      /\b(lik(e|ing)|subscrib(e|ing)|rat(e|ing)).{0,20}\b(videos?|youtube|hotels?|products?)\b/i,
      /\bno (experience|investment) (needed|required)\b/i,
      /\b(guaranteed|assured) (returns?|income|profit)\b/i,
    ],
  },
  {
    id: 'impersonation',
    title: 'Pretends to be an official organisation',
    explain:
      'Scammers pose as banks, couriers, police, tax offices or big brands. Contact the organisation yourself using its official app or website, not the details in this message.',
    weight: 10,
    patterns: [
      /\b(sbi|hdfc|icici|axis bank|kotak|paytm|phonepe|gpay|google pay|bank of baroda|pnb)\b/i,
      /\b(fedex|dhl|blue ?dart|india ?post|courier|parcel|shipment)\b/i,
      /\b(customs|cbi|police|cyber ?cell|narcotics|income ?tax|trai|rbi)\b/i,
      /\b(amazon|flipkart|netflix|paypal|apple id|microsoft)\b/i,
    ],
  },
  {
    id: 'off-platform',
    title: 'Moves the conversation somewhere private',
    explain:
      'Asking you to switch to WhatsApp, Telegram or a personal number lets scammers avoid detection.',
    weight: 10,
    patterns: [
      /\b(whatsapp|telegram|signal)\b.{0,20}\b(me|us|on|at|now|group|link)\b/i,
      /\b(call|contact|dial)\b.{0,20}(\+?\d[\d\s-]{8,})/i,
      /\bt\.me\//i,
      /\bwa\.me\//i,
    ],
  },
  {
    id: 'remote-access',
    title: 'Asks you to install an app',
    explain:
      'Screen-sharing apps like AnyDesk or TeamViewer, or an unknown .apk file, let scammers control your phone and empty your bank account.',
    weight: 35,
    patterns: [
      /\b(anydesk|teamviewer|quicksupport|rustdesk)\b/i,
      /\.apk\b/i,
      /\b(install|download)\b.{0,25}\b(app|application)\b.{0,25}\b(link|below|this)\b/i,
    ],
  },
]

const SHORTENERS = [
  'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'cutt.ly', 'is.gd', 'rb.gy',
  'shorturl.at', 'ow.ly', 'tiny.cc', 'rebrand.ly', 'shorte.st', 'v.gd',
]

const RISKY_TLDS = [
  'xyz', 'top', 'click', 'tk', 'ml', 'ga', 'cf', 'gq', 'work', 'support',
  'buzz', 'rest', 'fit', 'loan', 'win', 'bid', 'icu', 'cyou', 'sbs', 'live',
]

// Brand keyword -> domains that genuinely belong to that brand.
const OFFICIAL_DOMAINS = {
  sbi: ['sbi.co.in', 'onlinesbi.sbi', 'sbi.bank.in', 'onlinesbi.com'],
  hdfc: ['hdfcbank.com', 'hdfc.com', 'hdfcbank.bank.in'],
  icici: ['icicibank.com', 'icici.bank.in'],
  axis: ['axisbank.com', 'axis.bank.in'],
  kotak: ['kotak.com', 'kotak.bank.in'],
  paytm: ['paytm.com'],
  phonepe: ['phonepe.com'],
  amazon: ['amazon.in', 'amazon.com', 'amazon.co.uk'],
  flipkart: ['flipkart.com'],
  paypal: ['paypal.com'],
  netflix: ['netflix.com'],
  apple: ['apple.com', 'icloud.com'],
  microsoft: ['microsoft.com', 'live.com', 'office.com'],
  google: ['google.com', 'google.co.in'],
  incometax: ['incometax.gov.in'],
  indiapost: ['indiapost.gov.in'],
  fedex: ['fedex.com'],
  dhl: ['dhl.com'],
  whatsapp: ['whatsapp.com'],
  instagram: ['instagram.com'],
  facebook: ['facebook.com'],
}

const URL_REGEX =
  /\b((?:https?:\/\/|www\.)[^\s<>"']+|(?:[a-z0-9-]+\.)+(?:com|in|net|org|xyz|top|click|tk|ml|ga|cf|gq|ly|me|co|info|live|link|site|online|shop|icu|buzz|work|support|sbs|cyou)(?:\/[^\s<>"']*)?)/gi

export function extractUrls(text) {
  const found = text.match(URL_REGEX) || []
  return [...new Set(found.map((u) => u.replace(/[.,!?)\]]+$/, '')))]
}

function parseUrl(raw) {
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `http://${raw}`
  try {
    return { url: new URL(withScheme), hadScheme: /^https?:\/\//i.test(raw) }
  } catch {
    return null
  }
}

function endsWithDomain(host, domain) {
  return host === domain || host.endsWith(`.${domain}`)
}

export function analyzeUrl(raw) {
  const parsed = parseUrl(raw)
  if (!parsed) return []
  const { url, hadScheme } = parsed
  const host = url.hostname.toLowerCase()
  const flags = []
  const add = (id, title, explain, weight) =>
    flags.push({ id, title, explain, weight, match: raw })

  if (SHORTENERS.some((s) => endsWithDomain(host, s))) {
    add(
      'url-shortener',
      'Hides the real link with a URL shortener',
      `"${host}" hides where the link actually goes. Scammers use shorteners to disguise fake websites.`,
      15,
    )
  }

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    add(
      'url-ip',
      'Link uses a raw number address',
      'Real companies use names like sbi.co.in, not number addresses like 192.168.1.1.',
      30,
    )
  }

  if (host.includes('xn--')) {
    add(
      'url-punycode',
      'Link uses look-alike characters',
      'This web address uses special characters that can make a fake site look identical to a real one.',
      30,
    )
  }

  const tld = host.split('.').pop()
  if (RISKY_TLDS.includes(tld)) {
    add(
      'url-tld',
      `Unusual website ending (.${tld})`,
      `Websites ending in ".${tld}" are cheap and frequently used for scams. Banks and government sites never use them.`,
      15,
    )
  }

  const flat = host.replace(/[-.]/g, '')
  for (const [brand, domains] of Object.entries(OFFICIAL_DOMAINS)) {
    if (flat.includes(brand) && !domains.some((d) => endsWithDomain(host, d))) {
      add(
        'url-lookalike',
        `Fake ${brand.toUpperCase()} website`,
        `"${host}" mentions ${brand.toUpperCase()} but is not its official website (${domains[0]}). This is a classic phishing trick.`,
        40,
      )
      break
    }
  }

  if ((host.match(/-/g) || []).length >= 2) {
    add(
      'url-hyphens',
      'Suspicious, hyphen-heavy web address',
      `Addresses like "${host}" are typical of fake sites trying to look official.`,
      10,
    )
  }

  if (url.username || raw.includes('@')) {
    add(
      'url-at',
      'Link hides its real destination',
      'An "@" inside a link can make it look like one site while sending you to another.',
      25,
    )
  }

  if (hadScheme && url.protocol === 'http:') {
    add(
      'url-http',
      'Link is not secure (no https)',
      'Anything you type on this page could be read by others. Never enter personal details on an "http://" site.',
      10,
    )
  }

  return flags
}

export const LEVELS = {
  safe: {
    label: 'Looks safe',
    advice: [
      'No common scam signs found, but stay alert.',
      'If it asks for money or personal details later, check again.',
    ],
  },
  suspicious: {
    label: 'Suspicious',
    advice: [
      'Do not click links or reply yet.',
      'Contact the organisation directly using its official app, website or the number on your card.',
      'Ask a family member or friend you trust for a second opinion.',
    ],
  },
  danger: {
    label: 'Likely a scam',
    advice: [
      'Do not click any link, call any number or reply.',
      'Never share OTP, PIN, CVV or passwords, and never pay any "fee".',
      'Block the sender and delete the message.',
      'In India, report it at sancharsaathi.gov.in (Chakshu) or cybercrime.gov.in, or call 1930 if you lost money.',
    ],
  },
}

export function levelFor(score) {
  if (score >= 60) return 'danger'
  if (score >= 25) return 'suspicious'
  return 'safe'
}

export function analyze(text) {
  const input = (text || '').trim()
  if (!input) return { score: 0, level: 'safe', flags: [], urls: [] }

  const flags = []

  for (const rule of TEXT_RULES) {
    const matches = rule.patterns.map((re) => input.match(re)).filter(Boolean)
    if (matches.length) {
      // Several different signs of the same scam type = more confidence.
      const bonus = Math.min(10, (matches.length - 1) * 5)
      flags.push({
        id: rule.id,
        title: rule.title,
        explain: rule.explain,
        weight: rule.weight + bonus,
        match: matches[0][0],
      })
    }
  }

  const urls = extractUrls(input)
  const seenUrlFlags = new Set()
  for (const u of urls) {
    for (const f of analyzeUrl(u)) {
      if (seenUrlFlags.has(f.id)) continue
      seenUrlFlags.add(f.id)
      flags.push(f)
    }
  }

  if (urls.length && flags.some((f) => ['urgency', 'threat', 'kyc', 'prize', 'credentials'].includes(f.id))) {
    flags.push({
      id: 'link-plus-pressure',
      title: 'Pressure plus a link',
      explain:
        'A link combined with pressure or a reward is the most common phishing pattern: it wants you to tap before you think.',
      weight: 15,
      match: urls[0],
    })
  }

  const letters = input.replace(/[^a-zA-Z]/g, '')
  const caps = input.replace(/[^A-Z]/g, '')
  if (letters.length > 30 && caps.length / letters.length > 0.5) {
    flags.push({
      id: 'shouting',
      title: 'Lots of CAPITAL LETTERS',
      explain: 'Shouting in capitals is used to create panic or excitement.',
      weight: 5,
      match: input.slice(0, 40),
    })
  }
  if ((input.match(/!/g) || []).length >= 3) {
    flags.push({
      id: 'exclaim',
      title: 'Excessive exclamation marks',
      explain: 'Genuine official messages are calm. Lots of "!!!" is a pressure tactic.',
      weight: 5,
      match: '!!!',
    })
  }

  // Brand name alone is weak evidence; only count it alongside another signal.
  const strong = flags.filter((f) => f.id !== 'impersonation')
  const counted = strong.length ? flags : []

  const score = Math.min(100, counted.reduce((s, f) => s + f.weight, 0))
  counted.sort((a, b) => b.weight - a.weight)

  return { score, level: levelFor(score), flags: counted, urls }
}
