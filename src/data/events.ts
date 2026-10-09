export type EventCategory = "Training" | "Placement" | "Award" | "Visit";

export type EventItem = {
  slug: string;
  /** ≤70 chars, plain English */
  headline: string;
  /** Key phrase in the headline to undergo <mark> wrap */
  highlight: string;
  kicker: EventCategory;
  /** one line */
  summary: string;
  /** full original caption (Hindi where the original was Hindi) */
  fullText: string;
  date: string;
  /** date not stated in the original caption — confirm */
  dateUncertain?: boolean;
  /** local copy in /public/events/ (downloaded from rsecurity.in/images/…) */
  image: string;
  imageAlt: string;
  width: number;
  height: number;
};

// Images downloaded from https://rsecurity.in/images/… and renamed to kebab-case.
export const EVENTS: EventItem[] = [
  {
    slug: "nasha-mukt-bharat",
    headline: "Nasha Mukt Bharat awareness drive at Ranchi mega centres",
    highlight: "awareness drive",
    summary: "Trainees pledge against substance abuse at mega centres.",
    fullText:
      "नशा मुक्त भारत, स्वस्थ भारत: एकजुट होकर बनाएंगे मजबूत भारत! आज दिनांक 26-06-2024, श्रीधर ज्ञान संस्थान, रांची के मेगा प्रशिक्षण केंद्रों में आयोजित कार्यक्रम की सफलता हमें गौरवान्वित करती है। इस कार्यक्रम का उद्देश्य नशा मुक्त भारत के निर्माण के लिए जागरूकता फैलाना था।",
    date: "26 JUN 2024",
    kicker: "Training",
    image: "/events/nasha-mukt-bharat.jpeg",
    imageAlt: "Trainees at the Nasha Mukt Bharat awareness drive",
    width: 922,
    height: 691,
  },
  {
    slug: "placement-drive-gumla-2023",
    headline: "Mega placement drive & certificate distribution, Gumla",
    highlight: "Mega placement drive",
    summary: "Skill certificates and offer letters handed over at Gumla.",
    fullText:
      "दिनांक 24.06.23 को रांची सिक्योरिटी प्रा. लिमिटेड के गुमला स्थित मेगा प्रशिक्षण केंद्र श्रीधर ज्ञान संस्थान में महा प्लेसमेंट ड्राइव के-सह- कौशल प्रमाण पत्र एवं नियुक्ति पत्र वितरण समारोह एवं alumni meet का आयोजन किया गया।",
    date: "24 JUN 2023",
    kicker: "Placement",
    image: "/events/placement-drive-gumla-2023.jpeg",
    imageAlt: "Certificate distribution ceremony at Gumla training centre",
    width: 908,
    height: 706,
  },
  {
    slug: "trainees-with-mos-delhi",
    headline: "Trainees meet Union MoS Labour Santosh Gangwar, Delhi",
    highlight: "Union MoS Labour",
    summary: "Our trainees with Union Minister of State for Labour.",
    fullText:
      "दिल्ली में श्री संतोष गंगवार, केंद्रीय श्रम और रोजगार मामलों के राज्य मंत्री, भारत सरकार के साथ रांची सिक्योरिटी प्राइवेट लिमिटेड की प्रशिक्षु।",
    date: "NOV 2019",
    dateUncertain: true,
    kicker: "Visit",
    image: "/events/trainees-with-mos-delhi.jpg",
    imageAlt: "Ranchi Security trainees with Union MoS Labour Santosh Gangwar",
    width: 1280,
    height: 960,
  },
  {
    slug: "capsi-summit-delhi-2019",
    headline: "Trainees at CAPSI Security Skill & Leadership Summit",
    highlight: "CAPSI Security Skill",
    summary: "CAPSI annual summit, Delhi — our trainees participated.",
    fullText:
      "15 से 16 नवम्बर 2019 को दिल्ली में सेंट्रल एसोसिएशन ऑफ़ प्राइवेट सिक्यूरिटी इंडस्ट्रीज (CAPSI) के वार्षिक सम्मलेन – सिक्यूरिटी स्किल एंड लीडरशिप समिट में भाग लेती रांची सिक्यूरिटी की अभ्यार्थियाँ।",
    date: "15–16 NOV 2019",
    kicker: "Training",
    image: "/events/capsi-summit-delhi-2019.jpg",
    imageAlt: "Trainees at the CAPSI Security Skill and Leadership Summit",
    width: 1024,
    height: 768,
  },
  {
    slug: "fire-fighting-demo",
    headline: "Unarmed security fire-fighting demonstration",
    highlight: "fire-fighting demonstration",
    summary: "Live fire-fighting drill at the Marda training centre.",
    fullText:
      "Unarmed Security Fire Fighting Demonstration classes is going on under Deen Dayal Upadhyay Kaushal Kendra at Training center SHRIDHAR GYAN SANSTHAN, MARDA, Gumla.",
    date: "NOV 2019",
    dateUncertain: true,
    kicker: "Training",
    image: "/events/fire-fighting-demo.jpg",
    imageAlt: "Unarmed security guard fire-fighting demonstration",
    width: 1032,
    height: 581,
  },
  {
    slug: "mepsc-tot-2019",
    headline: "MEPSC Soft-Skill Training of Trainers programme",
    highlight: "Training of Trainers",
    summary: "Five-day TOT at our five-star Ranchi training centre.",
    fullText:
      "Management and Entrepreneurship & Professional Sector Council (MEPSC) conducted 5 Days of SOFT SKILL TRAINING OF TRAINERS (TOT) Program by Master Trainer Ms. Prema, at one of our 5-star graded Training Center SHRIDHAR GYAN SANSTHAN, RANCHI from 14th October 2019 to 19th October 2019.",
    date: "14–19 OCT 2019",
    kicker: "Training",
    image: "/events/mepsc-tot-2019.jpg",
    imageAlt: "MEPSC Training of Trainers programme in session",
    width: 1152,
    height: 864,
  },
  {
    slug: "jindal-steel-placement",
    headline: "Jindal Steel Works selects 10 trained guards",
    highlight: "selects 10 trained guards",
    summary: "Ten trainees offered roles at Jindal Steel Works, Bellary.",
    fullText:
      "दिनांक 12 अक्टूबर 2019 को दीन दयाल उपाध्याय कौशल केंद्र के प्रशिक्षण प्रदाता रांची सिक्योरिटी प्राइवेट लिमिटेड द्वारा — सुरक्षा गार्ड में मान्यता प्राप्त प्रशिक्षण केंद्र, श्रीधर ज्ञान संस्थान, रांची में बेलारी, कर्नाटका की नामी सुरक्षा एजेंसी JINDAL STEEL WORKS ने 10 प्रशिक्षित युवकों का चयन कर उन्हें ऑफर लेटर प्रदान किया।",
    date: "12 OCT 2019",
    kicker: "Placement",
    image: "/events/jindal-steel-placement.jpg",
    imageAlt: "Trainees selected by Jindal Steel Works",
    width: 922,
    height: 691,
  },
  {
    slug: "mha-licensing-portal",
    headline: "Private security licensing portal launch (MHA)",
    highlight: "licensing portal launch",
    summary: "RSPL at the Ministry of Home Affairs portal launch.",
    fullText:
      "Ranchi Security Pvt. Ltd. participated in the launch of a private security agency licensing portal initiated by the Ministry of Home Affairs on 24th September 2019. Union Home Minister Mr. Amit Shah asked operators of private security agencies to undertake welfare initiatives like health insurance, medical check-up and pension for private guards.",
    date: "24 SEP 2019",
    kicker: "Visit",
    image: "/events/mha-licensing-portal.jpg",
    imageAlt: "Private security licensing portal launch event",
    width: 556,
    height: 624,
  },
  {
    slug: "campus-placement-62",
    headline: "Campus placement drive, 62 candidates",
    highlight: "62 candidates",
    summary: "62 candidates at the DDI Road, Gumla placement drive.",
    fullText:
      "दीन दयाल उपाध्याय कौशल केंद्र के प्रशिक्षण प्रदाता रांची सिक्योरिटी प्राइवेट लिमिटेड के डी.इस.पी. रोड, गुमला स्थित कार्यालय में दिनांक 13 एवं 14 अगस्त को कैंपस प्लेसमेंट ड्राइव का आयोजन किया गया। इस रोजगार मेले में कुल 62 प्रत्याशियों ने भाग लिया, जिसमें कर्नाटक स्थित सुरक्षा एजेंसी जिंदल स्टील वर्क्स प्राइवेट लिमिटेड द्वारा चयनित अभ्यर्थियों को ऑफर लेटर प्रदान किया गया।",
    date: "13–14 AUG 2019",
    kicker: "Placement",
    image: "/events/campus-placement-62.jpg",
    imageAlt: "Campus placement drive with 62 candidates",
    width: 960,
    height: 720,
  },
  {
    slug: "g4s-women-guards",
    headline: "G4S recruits 25 trained women guards",
    highlight: "recruits 25 trained women guards",
    summary: "Offer letters to 25 women guards at Gumla Town Hall.",
    fullText:
      "आज दिनांक 27 जुलाई 2019 को गुमला जिले में स्थित टाउन हॉल में डिस्ट्रिक्ट लीगल स्टैचूटरी अथोरिटी (DLSA) द्वारा रोजगार शिविर का आयोजन किया गया। इस शिविर में श्रीधर ज्ञान संस्थान, मरदा, गुमला के 25 प्रशिक्षित युवतियों को हैदराबाद की नामी सुरक्षा एजेंसी G4S Secure Solutions India Pvt. Ltd. में नौकरी हेतु निबंधन पत्र प्रदान किया गया।",
    date: "27 JUL 2019",
    kicker: "Placement",
    image: "/events/g4s-women-guards.jpg",
    imageAlt: "G4S offer letters for 25 trained women guards",
    width: 960,
    height: 720,
  },
  {
    slug: "niti-aayog-visit",
    headline: "NITI Aayog team visits Marda training centre",
    highlight: "NITI Aayog team visits",
    summary: "NITI Aayog officials tour the Shridhar Gyan Sansthan.",
    fullText:
      "On 17th July 2019, Mr. Parmeshwar Agarwal and Mr. Amit Kumar, Team NITI Aayog, and Mr. Brajesh Kumar, DSC Gumla, visited our Training Center SHRIDHAR GYAN SANSTHAN, Marda (Gumla). During their visit they discussed the training syllabus and how trainees handle the security equipment and facilities provided during their complete training period.",
    date: "17 JUL 2019",
    kicker: "Visit",
    image: "/events/niti-aayog-visit.jpg",
    imageAlt: "NITI Aayog team visiting the Marda training centre",
    width: 1032,
    height: 581,
  },
  {
    slug: "global-skill-summit-19",
    headline: "CM Raghubar Das at our Global Skill Summit '19 stall",
    highlight: "CM Raghubar Das",
    summary: "Jharkhand CM visits the RSPL stall at Khelgaon.",
    fullText:
      "Shri Raghubar Das, CM of Jharkhand, visited the Ranchi Security stall at Global Skill Summit '19, Khelgaon Sports Complex, Ranchi on 10th January 2019.",
    date: "10 JAN 2019",
    kicker: "Visit",
    image: "/events/global-skill-summit-19.jpg",
    imageAlt: "CM Raghubar Das at the Ranchi Security stall",
    width: 832,
    height: 624,
  },
  {
    slug: "gen-rawat-gumla",
    headline: "Gen. Bipin Rawat honours brave soldiers, Gumla",
    highlight: "Gen. Bipin Rawat honours",
    summary: "Chief of Army Staff honours veterans at Chaenpur.",
    fullText:
      "शुक्रवार 04.01.2019 को गुमला के चैनपुर में वीर सैनिक, वीर नारी सम्मान सह गौरव सेनानी रैली समारोह का आयोजन किया गया। कार्यक्रम के मुख्य अतिथि थल सेनाध्यक्ष जनरल बिपिन रावत जी ने परमवीर चक्र विजेता लांस नायक अल्बर्ट एक्का की पत्नी बलमदीन एक्का के साथ झारखण्ड की अन्य वीर नारियों एवं वीर सैनिकों को सम्मानित किया।",
    date: "4 JAN 2019",
    kicker: "Award",
    image: "/events/gen-rawat-gumla.jpg",
    imageAlt: "General Bipin Rawat honouring brave soldiers at Gumla",
    width: 717,
    height: 412,
  },
] as const;

export const EVENT_STATS = {
  count: EVENTS.length,
  yearStart: 2018,
  yearEnd: 2024,
} as const;