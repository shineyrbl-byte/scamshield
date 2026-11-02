// "Spot the scam" training questions. A mix of real-looking genuine messages
// and scams, so people learn the difference instead of distrusting everything.
export const QUIZ = [
  {
    text: 'Rs 2,000 debited from A/c XX4521 on 01-Nov by UPI to SWIGGY. Not you? Call 1800-1234 (number on your card).',
    scam: false,
    why: {
      en: 'A normal transaction alert. It asks for nothing and points you to the number on your own card.',
      hi: 'यह सामान्य लेन-देन अलर्ट है। यह कुछ नहीं मांगता और आपके कार्ड पर लिखा नंबर बताता है।',
    },
  },
  {
    text: 'Dear customer your HDFC account will be suspended today. Click http://hdfc-netbank-verify.top to update PAN immediately.',
    scam: true,
    why: {
      en: 'Threat + urgency + a fake "hdfc" website ending in .top. HDFC never asks you to update PAN via SMS link.',
      hi: 'धमकी + जल्दबाज़ी + .top पर खत्म होने वाली नकली "hdfc" वेबसाइट। HDFC कभी SMS लिंक से PAN अपडेट नहीं करवाता।',
    },
  },
  {
    text: 'Your OTP for login is 482913. Do not share it with anyone, including bank staff.',
    scam: false,
    why: {
      en: 'Genuine OTP messages tell you NOT to share the code. The danger is someone calling to ask for it.',
      hi: 'असली OTP मैसेज कहते हैं कि कोड किसी को न बताएं। खतरा तब है जब कोई फ़ोन करके इसे मांगे।',
    },
  },
  {
    text: 'Hello I am Priya from Amazon HR. Earn ₹4000 daily by rating hotels on Google. Part time, no experience needed. Message me on Telegram.',
    scam: true,
    why: {
      en: 'Classic task scam: easy daily earnings, no experience, moves you to Telegram. You will later be asked for a "deposit".',
      hi: 'आम टास्क स्कैम: आसान रोज़ की कमाई, अनुभव की ज़रूरत नहीं, Telegram पर बुलाना। बाद में "डिपॉज़िट" मांगा जाएगा।',
    },
  },
  {
    text: 'Electricity Department: Your power will be disconnected tonight at 9:30 pm as last month bill was not updated. Call officer 9876543210 immediately.',
    scam: true,
    why: {
      en: 'Electricity boards do not message from personal numbers or threaten same-night cuts. Check in your official electricity app.',
      hi: 'बिजली विभाग निजी नंबर से मैसेज नहीं करता और उसी रात कनेक्शन काटने की धमकी नहीं देता। अपने आधिकारिक बिजली ऐप में जांचें।',
    },
  },
  {
    text: 'Your Flipkart order #OD43218 has been shipped and will arrive by Thursday. Track it in the Flipkart app.',
    scam: false,
    why: {
      en: 'No link to tap, no payment, no pressure. It tells you to use the official app.',
      hi: 'कोई लिंक नहीं, कोई भुगतान नहीं, कोई दबाव नहीं। यह आधिकारिक ऐप इस्तेमाल करने को कहता है।',
    },
  },
  {
    text: 'Mom my phone fell in water, this is my new number. Urgently need ₹15,000 for fees, please send on this UPI, will explain later.',
    scam: true,
    why: {
      en: 'The "new number" family scam. Always call your family member on their old number before sending money.',
      hi: '"नया नंबर" वाला पारिवारिक स्कैम। पैसे भेजने से पहले हमेशा परिवार वाले को उनके पुराने नंबर पर कॉल करें।',
    },
  },
  {
    text: 'Congratulations! Your mobile number won ₹25 lakh in the WhatsApp Lucky Draw 2026. Pay ₹10,000 registration fee to claim.',
    scam: true,
    why: {
      en: 'There is no WhatsApp lottery. Paying a fee to receive a prize is always a scam.',
      hi: 'WhatsApp की कोई लॉटरी नहीं होती। इनाम पाने के लिए फीस भरना हमेशा स्कैम है।',
    },
  },
]
