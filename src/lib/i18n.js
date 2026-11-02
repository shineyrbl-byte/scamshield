import { LEVELS } from './analyzer.js'

export const LANGS = { en: 'English', hi: 'हिन्दी' }

const UI = {
  en: {
    tabCheck: '🔍 Check a message',
    tabQuiz: '🎯 Spot the scam quiz',
    tagline:
      "Got a strange SMS, WhatsApp message, email or link? Paste it below and we'll tell you if it looks like a scam, in plain language.",
    inputLabel: 'Suspicious message or link',
    placeholder:
      'e.g. Dear customer, your SBI account will be blocked today. Update KYC now: http://sbi-kyc.xyz',
    check: 'Check message',
    clear: 'Clear',
    tryExample: 'No message handy? Try an example:',
    foundSigns: (n) => `We found ${n} warning sign${n > 1 ? 's' : ''}.`,
    noSigns: 'We found no common warning signs.',
    suspiciousParts: 'Suspicious parts of the message',
    why: 'Why we think so',
    found: 'Found:',
    whatToDo: 'What you should do',
    protect: 'Protect someone you love.',
    protectText: 'Send this warning to family members who might get the same message.',
    shareWhatsapp: 'Share on WhatsApp',
    shareCopy: 'Share / copy warning',
    copied: 'Copied ✓',
    risk: '/ 100 risk',
    privacy: '🔒 Private by design: your message is checked on your device and never uploaded anywhere.',
    disclaimer: 'ScamShield gives guidance, not guarantees. When in doubt, contact the organisation directly.',
    warnHeader: 'ScamShield check',
    warnSigns: 'Warning signs:',
    warnTip: 'If you get a message like this: do not click links, never share OTP/PIN, and never pay any "fee".',
    warnLink: 'Check messages yourself:',
  },
  hi: {
    tabCheck: '🔍 मैसेज जांचें',
    tabQuiz: '🎯 स्कैम पहचानें क्विज़',
    tagline:
      'कोई अजीब SMS, WhatsApp मैसेज, ईमेल या लिंक मिला है? उसे नीचे पेस्ट करें, हम आसान भाषा में बताएंगे कि यह धोखाधड़ी (स्कैम) तो नहीं।',
    inputLabel: 'संदिग्ध मैसेज या लिंक',
    placeholder: 'जैसे: प्रिय ग्राहक, आपका खाता आज बंद हो जाएगा। तुरंत KYC अपडेट करें: http://sbi-kyc.xyz',
    check: 'मैसेज जांचें',
    clear: 'मिटाएं',
    tryExample: 'कोई मैसेज नहीं है? एक उदाहरण आज़माएं:',
    foundSigns: (n) => `हमें ${n} चेतावनी संकेत मिले।`,
    noSigns: 'हमें कोई सामान्य चेतावनी संकेत नहीं मिला।',
    suspiciousParts: 'मैसेज के संदिग्ध हिस्से',
    why: 'हम ऐसा क्यों मानते हैं',
    found: 'मिला:',
    whatToDo: 'आपको क्या करना चाहिए',
    protect: 'अपनों को बचाएं।',
    protectText: 'यह चेतावनी परिवार के उन लोगों को भेजें जिन्हें ऐसा मैसेज आ सकता है।',
    shareWhatsapp: 'WhatsApp पर भेजें',
    shareCopy: 'शेयर / कॉपी करें',
    copied: 'कॉपी हो गया ✓',
    risk: '/ 100 खतरा',
    privacy: '🔒 पूरी तरह निजी: आपका मैसेज आपके ही फ़ोन पर जांचा जाता है, कहीं अपलोड नहीं होता।',
    disclaimer: 'ScamShield सलाह देता है, गारंटी नहीं। शक हो तो संस्था से सीधे संपर्क करें।',
    warnHeader: 'ScamShield जांच',
    warnSigns: 'चेतावनी संकेत:',
    warnTip: 'ऐसा मैसेज आए तो: लिंक पर क्लिक न करें, OTP/PIN कभी न बताएं, और कोई "फीस" न भरें।',
    warnLink: 'खुद मैसेज जांचें:',
  },
}

const LEVELS_HI = {
  safe: {
    label: 'सुरक्षित लगता है',
    advice: ['कोई सामान्य स्कैम संकेत नहीं मिला, फिर भी सावधान रहें।', 'अगर बाद में पैसे या निजी जानकारी मांगी जाए, तो दोबारा जांचें।'],
  },
  suspicious: {
    label: 'संदिग्ध',
    advice: [
      'अभी किसी लिंक पर क्लिक न करें, जवाब न दें।',
      'संस्था के आधिकारिक ऐप, वेबसाइट या अपने कार्ड पर लिखे नंबर से खुद संपर्क करें।',
      'किसी भरोसेमंद परिवार वाले या दोस्त से राय लें।',
    ],
  },
  danger: {
    label: 'यह स्कैम है',
    advice: [
      'किसी लिंक पर क्लिक न करें, किसी नंबर पर कॉल न करें, जवाब न दें।',
      'OTP, PIN, CVV या पासवर्ड कभी न बताएं, और कोई "फीस" न भरें।',
      'भेजने वाले को ब्लॉक करें और मैसेज डिलीट करें।',
      'sancharsaathi.gov.in (चक्षु) या cybercrime.gov.in पर शिकायत करें। पैसे गए हों तो तुरंत 1930 पर कॉल करें।',
    ],
  },
}

const FLAGS_HI = {
  urgency: ['जल्दबाज़ी करवाता है', 'स्कैमर आपको जल्दी करवाते हैं ताकि आप सोच न सकें। असली बैंक और कंपनियां समय देती हैं।'],
  threat: ['आपको धमकाता है', 'गिरफ्तारी, खाता बंद या कनेक्शन काटने की धमकी डराने की चाल है। पुलिस और बैंक SMS या WhatsApp पर धमकी नहीं देते।'],
  credentials: ['OTP, PIN या पासवर्ड मांगता है', 'कोई भी असली बैंक, ऐप या सरकारी दफ्तर आपका OTP, PIN, CVV या पासवर्ड कभी नहीं मांगता।'],
  kyc: ['नकली KYC / खाता अपडेट', 'लिंक से KYC, PAN या आधार अपडेट करने को कहना भारत में सबसे आम बैंक स्कैम है।'],
  prize: ['बहुत अच्छा इनाम, जो सच नहीं', 'जिस लॉटरी में आपने हिस्सा ही नहीं लिया, वह आप जीत नहीं सकते। "मुफ़्त" इनाम एक जाल है।'],
  payment: ['पैसे भेजने को कहता है', 'पैसे, पार्सल या नौकरी पाने के लिए "फीस" भरने को कहना हमेशा स्कैम होता है।'],
  job: ['नकली नौकरी / आसान कमाई', 'वीडियो लाइक करके रोज़ हज़ारों कमाने के ऑफ़र में अंत में आपसे "डिपॉज़िट" लिया जाता है जो वापस नहीं आता।'],
  impersonation: ['किसी आधिकारिक संस्था का नाम लेता है', 'स्कैमर बैंक, कूरियर, पुलिस या बड़ी कंपनियों का रूप धरते हैं। संस्था से खुद उसकी आधिकारिक वेबसाइट या ऐप से संपर्क करें।'],
  'off-platform': ['निजी चैट पर ले जाना चाहता है', 'WhatsApp, Telegram या निजी नंबर पर बुलाना स्कैमर्स को पकड़े जाने से बचाता है।'],
  'remote-access': ['ऐप इंस्टॉल करवाना चाहता है', 'AnyDesk, TeamViewer या अनजान .apk फ़ाइल से स्कैमर आपका फ़ोन चला कर खाता खाली कर सकते हैं।'],
  'url-shortener': ['असली लिंक छिपाया गया है', 'छोटे किए गए लिंक (जैसे bit.ly) से पता नहीं चलता कि वह कहां ले जाएगा।'],
  'url-ip': ['लिंक में नाम की जगह नंबर है', 'असली कंपनियां sbi.co.in जैसे नाम इस्तेमाल करती हैं, 192.168.1.1 जैसे नंबर नहीं।'],
  'url-punycode': ['लिंक में मिलते-जुलते अक्षर', 'इस पते में खास अक्षर हैं जिनसे नकली साइट बिल्कुल असली जैसी दिखती है।'],
  'url-tld': ['वेबसाइट का अजीब अंत', 'ऐसे अंत वाली वेबसाइटें सस्ती होती हैं और अक्सर स्कैम में इस्तेमाल होती हैं। बैंक इन्हें कभी इस्तेमाल नहीं करते।'],
  'url-lookalike': ['नकली बैंक / कंपनी वेबसाइट', 'यह वेबसाइट किसी बड़ी कंपनी का नाम लेती है, पर उसकी असली वेबसाइट नहीं है।'],
  'url-hyphens': ['बहुत सारे "-" वाला पता', 'ऐसे पते अक्सर नकली साइटों के होते हैं जो आधिकारिक दिखना चाहती हैं।'],
  'url-at': ['लिंक असली मंज़िल छिपाता है', 'लिंक के अंदर "@" से वह एक साइट जैसा दिखता है पर दूसरी पर ले जाता है।'],
  'url-http': ['लिंक सुरक्षित नहीं (https नहीं)', '"http://" वाली साइट पर कभी निजी जानकारी न डालें।'],
  'link-plus-pressure': ['दबाव के साथ लिंक', 'लिंक के साथ जल्दबाज़ी या इनाम सबसे आम फ़िशिंग तरीका है।'],
  shouting: ['बहुत सारे CAPITAL अक्षर', 'बड़े अक्षरों में लिखना घबराहट या लालच पैदा करने के लिए होता है।'],
  exclaim: ['बहुत सारे "!!!"', 'असली आधिकारिक मैसेज शांत होते हैं।'],
}

export function ui(lang) {
  return UI[lang] || UI.en
}

export function levelInfo(level, lang) {
  return lang === 'hi' ? LEVELS_HI[level] : LEVELS[level]
}

export function flagText(flag, lang) {
  if (lang === 'hi' && FLAGS_HI[flag.id]) {
    const [title, explain] = FLAGS_HI[flag.id]
    return { title, explain }
  }
  return { title: flag.title, explain: flag.explain }
}
