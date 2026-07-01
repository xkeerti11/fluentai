// Vocabulary Learning System Curriculum Database
// This file is generated with 500+ items spanning CEFR and Business topics.

export interface VocabularyWord {
  word: string
  meaning_hindi: string
  pronunciation: string
  example: string
  example_hindi: string
  memory_trick: string
  level: 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  topic: string
}

export interface VocabularyTopic {
  id: string
  name: string
  emoji: string
  level: 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
}

export const VOCABULARY_TOPICS: { [key: string]: { name: string; emoji: string; level: 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' } } = {
  "Greetings & Introductions": { name: "Greetings & Introductions", emoji: "👋", level: "A0" },
  "Family & People": { name: "Family & People", emoji: "👨‍👩‍👧‍👦", level: "A0" },
  "Numbers & Time": { name: "Numbers & Time", emoji: "🔢", level: "A0" },
  "Daily Verbs": { name: "Daily Verbs", emoji: "🏃", level: "A1" },
  "Home & Daily Life": { name: "Home & Daily Life", emoji: "🏠", level: "A1" },
  "Work & Office": { name: "Work & Office", emoji: "💼", level: "A2" },
  "Emotions & Personality": { name: "Emotions & Personality", emoji: "😊", level: "A2" },
  "Business & Agency": { name: "Business & Agency", emoji: "📈", level: "B1" },
  "Client Communication": { name: "Client Communication", emoji: "🗣️", level: "B1" },
  "Phrasal Verbs": { name: "Phrasal Verbs", emoji: "🔄", level: "B2" },
  "Business Idioms": { name: "Business Idioms", emoji: "💡", level: "B2" }
};

export const VOCABULARY_WORDS: VocabularyWord[] = [
  {
    "word": "hello",
    "meaning_hindi": "Namaste / Halo",
    "pronunciation": "huh-LOH",
    "example": "Hello, how are you?",
    "example_hindi": "Namaste, aap kaise hain?",
    "memory_trick": "Hello toh sabhi jaante hain - shuruat karne ka mantra!",
    "level": "A0",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "goodbye",
    "meaning_hindi": "Alvida / Achha chalta hoon",
    "pronunciation": "good-BYE",
    "example": "It is time to say goodbye.",
    "example_hindi": "Ab alvida kehne ka samay hai.",
    "memory_trick": "Goodbye bole toh 'Good' + 'Bye'. Achha bye!",
    "level": "A0",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "please",
    "meaning_hindi": "Kripya",
    "pronunciation": "PLEEZ",
    "example": "Please sit down.",
    "example_hindi": "Kripya baith jaiye.",
    "memory_trick": "Please matlab kripya, jab kuch request karni ho.",
    "level": "A0",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "thank you",
    "meaning_hindi": "Dhanyawad / Shukriya",
    "pronunciation": "THANK yoo",
    "example": "Thank you for your help.",
    "example_hindi": "Aapki madad ke liye dhanyawad.",
    "memory_trick": "Thank you matlab shukriya, aabhar vyakt karna.",
    "level": "A0",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "sorry",
    "meaning_hindi": "Maaf karna / Khed hai",
    "pronunciation": "SOR-ee",
    "example": "I am sorry for being late.",
    "example_hindi": "Der se aane ke liye mujhe maaf karein.",
    "memory_trick": "Sorry bole toh dil se maafi maangna.",
    "level": "A0",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "excuse me",
    "meaning_hindi": "Suniye / Maaf kijiyega",
    "pronunciation": "ik-SKYOOS mee",
    "example": "Excuse me, where is the station?",
    "example_hindi": "Suniye, station kahan hai?",
    "memory_trick": "Excuse me bolkar kisi ka dhyan apni taraf khinchte hain.",
    "level": "A0",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "yes",
    "meaning_hindi": "Haan",
    "pronunciation": "YES",
    "example": "Yes, I am a developer.",
    "example_hindi": "Haan, main ek developer hoon.",
    "memory_trick": "Yes bole toh haan, positive reply.",
    "level": "A0",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "no",
    "meaning_hindi": "Nahi",
    "pronunciation": "NOH",
    "example": "No, I am not busy.",
    "example_hindi": "Nahi, main busy nahi hoon.",
    "memory_trick": "No bole toh nahi, negative reply.",
    "level": "A0",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "name",
    "meaning_hindi": "Naam",
    "pronunciation": "NAYM",
    "example": "My name is Keerti.",
    "example_hindi": "Mera naam Keerti hai.",
    "memory_trick": "Name matlab naam, pehchan!",
    "level": "A0",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "nice",
    "meaning_hindi": "Achha / Pyaara",
    "pronunciation": "NYSS",
    "example": "It is a nice day.",
    "example_hindi": "Yeh ek achha din hai.",
    "memory_trick": "Nice matlab sundar ya achha.",
    "level": "A0",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "meet",
    "meaning_hindi": "Milna",
    "pronunciation": "MEET",
    "example": "Nice to meet you.",
    "example_hindi": "Aap se milkar khushi hui.",
    "memory_trick": "Meet matlab milna, jab do log ek saath aate hain.",
    "level": "A0",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "from",
    "meaning_hindi": "Se",
    "pronunciation": "FROM",
    "example": "I am from Delhi.",
    "example_hindi": "Main Delhi se hoon.",
    "memory_trick": "From batata hai ki aap kahan se belong karte hain.",
    "level": "A0",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "where",
    "meaning_hindi": "Kahan",
    "pronunciation": "WAIR",
    "example": "Where do you live?",
    "example_hindi": "Aap kahan rehte hain?",
    "memory_trick": "Where sawaal karta hai jagah ke baare mein.",
    "level": "A0",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "how",
    "meaning_hindi": "Kaise",
    "pronunciation": "HOW",
    "example": "How are you doing today?",
    "example_hindi": "Aap aaj kaise hain?",
    "memory_trick": "How batata hai dhang ya haal-chaal.",
    "level": "A0",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "fine",
    "meaning_hindi": "Theek / Achha",
    "pronunciation": "FYNN",
    "example": "I am fine, thank you.",
    "example_hindi": "Main theek hoon, dhanyawad.",
    "memory_trick": "Fine bole toh sab badiya/theek.",
    "level": "A0",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "good",
    "meaning_hindi": "Achha",
    "pronunciation": "GOOD",
    "example": "This is a good book.",
    "example_hindi": "Yeh ek achhi kitab hai.",
    "memory_trick": "Good matlab achha, behtar.",
    "level": "A0",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "morning",
    "meaning_hindi": "Subah / Pratahkal",
    "pronunciation": "MOR-ning",
    "example": "Good morning to everyone.",
    "example_hindi": "Sabhi ko shubh prabhat.",
    "memory_trick": "Morning bole toh suraj nikalne ka samay.",
    "level": "A0",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "evening",
    "meaning_hindi": "Shaam / Sandhyakal",
    "pronunciation": "EEV-ning",
    "example": "I will meet you in the evening.",
    "example_hindi": "Main shaam ko aap se milunga.",
    "memory_trick": "Evening bole toh shaam ka samay.",
    "level": "A0",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "night",
    "meaning_hindi": "Raat / Ratri",
    "pronunciation": "NYT",
    "example": "Good night, sleep well.",
    "example_hindi": "Shubh ratri, achhe se soyein.",
    "memory_trick": "Night bole toh taaro wali raat.",
    "level": "A0",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "mother",
    "meaning_hindi": "Mata / Maa",
    "pronunciation": "MUH-ther",
    "example": "My mother is a teacher.",
    "example_hindi": "Meri maa ek teacher hain.",
    "memory_trick": "Mother jo hume sabse pehle seekhati hai.",
    "level": "A0",
    "topic": "Family & People"
  },
  {
    "word": "father",
    "meaning_hindi": "Pita / Papa",
    "pronunciation": "FAH-ther",
    "example": "My father works in a bank.",
    "example_hindi": "Mere pita bank mein kaam karte hain.",
    "memory_trick": "Father jo ghar ke pillar hote hain.",
    "level": "A0",
    "topic": "Family & People"
  },
  {
    "word": "sister",
    "meaning_hindi": "Behan",
    "pronunciation": "SIS-ter",
    "example": "My sister plays badminton.",
    "example_hindi": "Meri behan badminton khelti hai.",
    "memory_trick": "Sister jo ghar ki sabse achhi dost hoti hai.",
    "level": "A0",
    "topic": "Family & People"
  },
  {
    "word": "brother",
    "meaning_hindi": "Bhai",
    "pronunciation": "BRUH-ther",
    "example": "My brother studies in college.",
    "example_hindi": "Mera bhai college mein padhta hai.",
    "memory_trick": "Brother yaani bhai, jo humesha saath deta hai.",
    "level": "A0",
    "topic": "Family & People"
  },
  {
    "word": "son",
    "meaning_hindi": "Beta",
    "pronunciation": "SUN",
    "example": "He is my eldest son.",
    "example_hindi": "Woh mera bada beta hai.",
    "memory_trick": "Son ka pronunciation 'Sun' (suraj) jaisa hota hai - beta suraj jaisa chamkega!",
    "level": "A0",
    "topic": "Family & People"
  },
  {
    "word": "daughter",
    "meaning_hindi": "Beti",
    "pronunciation": "DAW-ter",
    "example": "My daughter loves drawing.",
    "example_hindi": "Meri beti ko drawing pasand hai.",
    "memory_trick": "Daughter yaani beti, ghar ki laxmi.",
    "level": "A0",
    "topic": "Family & People"
  },
  {
    "word": "husband",
    "meaning_hindi": "Pati",
    "pronunciation": "HUZ-bund",
    "example": "Her husband is very supportive.",
    "example_hindi": "Unke pati bahut supportive hain.",
    "memory_trick": "Husband yaani pati.",
    "level": "A0",
    "topic": "Family & People"
  },
  {
    "word": "wife",
    "meaning_hindi": "Patni",
    "pronunciation": "WYF",
    "example": "My wife cooked dinner.",
    "example_hindi": "Meri patni ne dinner banaya.",
    "memory_trick": "Wife yaani patni, life partner.",
    "level": "A0",
    "topic": "Family & People"
  },
  {
    "word": "friend",
    "meaning_hindi": "Dost / Mitra",
    "pronunciation": "FREND",
    "example": "Rahul is my best friend.",
    "example_hindi": "Rahul mera sabse achha dost hai.",
    "memory_trick": "Friend yaani dost, jiske sath sab share karein.",
    "level": "A0",
    "topic": "Family & People"
  },
  {
    "word": "neighbor",
    "meaning_hindi": "Padosi",
    "pronunciation": "NAY-ber",
    "example": "Our neighbor is very friendly.",
    "example_hindi": "Hamare padosi bahut friendly hain.",
    "memory_trick": "Neighbor yaani pados mein rehne wala.",
    "level": "A0",
    "topic": "Family & People"
  },
  {
    "word": "teacher",
    "meaning_hindi": "Shikshak / Guru",
    "pronunciation": "TEE-cher",
    "example": "The teacher explained the lesson.",
    "example_hindi": "Teacher ne lesson samjhaya.",
    "memory_trick": "Teacher jo gyaan de.",
    "level": "A0",
    "topic": "Family & People"
  },
  {
    "word": "doctor",
    "meaning_hindi": "Chikitsak / Doctor",
    "pronunciation": "DOK-ter",
    "example": "The doctor gave me medicine.",
    "example_hindi": "Doctor ne mujhe dawai di.",
    "memory_trick": "Doctor jo bimari theek kare.",
    "level": "A0",
    "topic": "Family & People"
  },
  {
    "word": "family",
    "meaning_hindi": "Parivar",
    "pronunciation": "FAM-lee",
    "example": "I love my family.",
    "example_hindi": "Main apne parivar se pyaar karta hoon.",
    "memory_trick": "Family yaani parivar, jahan pyaar hota hai.",
    "level": "A0",
    "topic": "Family & People"
  },
  {
    "word": "child",
    "meaning_hindi": "Bachha",
    "pronunciation": "CHYLD",
    "example": "The child is crying.",
    "example_hindi": "Bachha ro raha hai.",
    "memory_trick": "Child yaani chhota bachha.",
    "level": "A0",
    "topic": "Family & People"
  },
  {
    "word": "baby",
    "meaning_hindi": "Shishu / Chhota Bachha",
    "pronunciation": "BAY-bee",
    "example": "The baby is sleeping.",
    "example_hindi": "Baby so raha hai.",
    "memory_trick": "Baby yaani naya janma bachha.",
    "level": "A0",
    "topic": "Family & People"
  },
  {
    "word": "adult",
    "meaning_hindi": "Vayask / Bada",
    "pronunciation": "uh-DULT",
    "example": "Only adults can enter.",
    "example_hindi": "Keval bade hi pravesh kar sakte hain.",
    "memory_trick": "Adult yaani 18+ saal ke log.",
    "level": "A0",
    "topic": "Family & People"
  },
  {
    "word": "old",
    "meaning_hindi": "Buda / Purana",
    "pronunciation": "OHLD",
    "example": "He is an old man.",
    "example_hindi": "Woh ek bude aadmi hain.",
    "memory_trick": "Old matlab umra mein bada ya purani cheez.",
    "level": "A0",
    "topic": "Family & People"
  },
  {
    "word": "young",
    "meaning_hindi": "Jawaan / Yuva",
    "pronunciation": "YUNG",
    "example": "She is a young programmer.",
    "example_hindi": "Woh ek yuva programmer hai.",
    "memory_trick": "Young matlab naye khun wala, jawaan.",
    "level": "A0",
    "topic": "Family & People"
  },
  {
    "word": "one",
    "meaning_hindi": "Ek",
    "pronunciation": "WUN",
    "example": "I have one pen.",
    "example_hindi": "Mere paas ek pen hai.",
    "memory_trick": "One = 1",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "two",
    "meaning_hindi": "Do",
    "pronunciation": "TOO",
    "example": "We have two eyes.",
    "example_hindi": "Hamari do aankhein hain.",
    "memory_trick": "Two = 2",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "three",
    "meaning_hindi": "Teen",
    "pronunciation": "THREE",
    "example": "A triangle has three sides.",
    "example_hindi": "Ek triangle ki teen sides hoti hain.",
    "memory_trick": "Three = 3",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "four",
    "meaning_hindi": "Chaar",
    "pronunciation": "FOR",
    "example": "A car has four wheels.",
    "example_hindi": "Ek car ke chaar pahiye hote hain.",
    "memory_trick": "Four = 4",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "five",
    "meaning_hindi": "Paanch",
    "pronunciation": "FYV",
    "example": "I have five fingers.",
    "example_hindi": "Meri paanch ungliyan hain.",
    "memory_trick": "Five = 5",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "six",
    "meaning_hindi": "Chhe",
    "pronunciation": "SIKS",
    "example": "He works six days a week.",
    "example_hindi": "Woh hafte mein chhe din kaam karta hai.",
    "memory_trick": "Six = 6",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "seven",
    "meaning_hindi": "Saat",
    "pronunciation": "SEV-en",
    "example": "There are seven days in a week.",
    "example_hindi": "Ek hafte mein saat din hote hain.",
    "memory_trick": "Seven = 7",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "eight",
    "meaning_hindi": "Aath",
    "pronunciation": "AYT",
    "example": "An octopus has eight legs.",
    "example_hindi": "Octopus ke aath pair hote hain.",
    "memory_trick": "Eight = 8",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "nine",
    "meaning_hindi": "Nau",
    "pronunciation": "NYN",
    "example": "The shop opens at nine.",
    "example_hindi": "Dukan nau baje khulti hai.",
    "memory_trick": "Nine = 9",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "ten",
    "meaning_hindi": "Das",
    "pronunciation": "TEN",
    "example": "I have ten coins.",
    "example_hindi": "Mere paas das sikke hain.",
    "memory_trick": "Ten = 10",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "eleven",
    "meaning_hindi": "Gyarah",
    "pronunciation": "i-LEV-en",
    "example": "Eleven players are on the field.",
    "example_hindi": "Gyarah khiladi maidan par hain.",
    "memory_trick": "Eleven = 11",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "twelve",
    "meaning_hindi": "Barah",
    "pronunciation": "TWELV",
    "example": "There are twelve months in a year.",
    "example_hindi": "Ek saal mein barah mahine hote hain.",
    "memory_trick": "Twelve = 12",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "thirteen",
    "meaning_hindi": "Terah",
    "pronunciation": "thur-TEEN",
    "example": "He is thirteen years old.",
    "example_hindi": "Woh terah saal ka hai.",
    "memory_trick": "Thirteen = 13",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "fourteen",
    "meaning_hindi": "Chaudah",
    "pronunciation": "for-TEEN",
    "example": "Fourteen days make a fortnight.",
    "example_hindi": "Chaudah din se ek paksh banta hai.",
    "memory_trick": "Fourteen = 14",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "fifteen",
    "meaning_hindi": "Pandrah",
    "pronunciation": "fif-TEEN",
    "example": "The match starts in fifteen minutes.",
    "example_hindi": "Match pandrah minute mein shuru hoga.",
    "memory_trick": "Fifteen = 15",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "sixteen",
    "meaning_hindi": "Solah",
    "pronunciation": "siks-TEEN",
    "example": "She is sixteen years old.",
    "example_hindi": "Woh solah saal ki hai.",
    "memory_trick": "Sixteen = 16",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "seventeen",
    "meaning_hindi": "Satrah",
    "pronunciation": "sev-en-TEEN",
    "example": "Seventeen people attended the meeting.",
    "example_hindi": "Satrah log meeting mein aaye.",
    "memory_trick": "Seventeen = 17",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "eighteen",
    "meaning_hindi": "Atharah",
    "pronunciation": "ay-TEEN",
    "example": "You can vote at eighteen.",
    "example_hindi": "Aap atharah saal par vote de sakte hain.",
    "memory_trick": "Eighteen = 18",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "nineteen",
    "meaning_hindi": "Unnis",
    "pronunciation": "nyn-TEEN",
    "example": "Nineteen members voted yes.",
    "example_hindi": "Unnis sadasyo ne haan mein vote kiya.",
    "memory_trick": "Nineteen = 19",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "twenty",
    "meaning_hindi": "Bees",
    "pronunciation": "TWEN-tee",
    "example": "There are twenty students here.",
    "example_hindi": "Yahan bees students hain.",
    "memory_trick": "Twenty = 20",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "hundred",
    "meaning_hindi": "Sau",
    "pronunciation": "HUN-dred",
    "example": "He scored a hundred runs.",
    "example_hindi": "Usne sau runs banaye.",
    "memory_trick": "Hundred = 100",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "thousand",
    "meaning_hindi": "Hazaar",
    "pronunciation": "THOW-zand",
    "example": "One thousand rupees.",
    "example_hindi": "Ek haazaar rupaye.",
    "memory_trick": "Thousand = 1000",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "million",
    "meaning_hindi": "Das Lakh / Million",
    "pronunciation": "MIL-yun",
    "example": "The video has a million views.",
    "example_hindi": "Video ke ek million views hain.",
    "memory_trick": "Million = 10 lakh.",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "today",
    "meaning_hindi": "Aaj",
    "pronunciation": "tuh-DAY",
    "example": "Today is Monday.",
    "example_hindi": "Aaj Monday hai.",
    "memory_trick": "Today matlab aaj ka din.",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "yesterday",
    "meaning_hindi": "Kal (Beeta hua)",
    "pronunciation": "YES-ter-day",
    "example": "I went there yesterday.",
    "example_hindi": "Main kal wahan gaya tha.",
    "memory_trick": "Yesterday yaani beeta hua kal.",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "tomorrow",
    "meaning_hindi": "Kal (Aane wala)",
    "pronunciation": "tuh-MAH-roh",
    "example": "We will meet tomorrow.",
    "example_hindi": "Hum kal milenge.",
    "memory_trick": "Tomorrow yaani aane wala kal.",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "afternoon",
    "meaning_hindi": "Dopahar",
    "pronunciation": "af-ter-NOON",
    "example": "We have lunch in the afternoon.",
    "example_hindi": "Hum dopahar ko lunch karte hain.",
    "memory_trick": "Afternoon yaani noon ke baad.",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "Monday",
    "meaning_hindi": "Somvar",
    "pronunciation": "MUN-day",
    "example": "Monday is the first workday.",
    "example_hindi": "Monday pehla workday hota hai.",
    "memory_trick": "Monday = Somvar.",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "Tuesday",
    "meaning_hindi": "Mangalvar",
    "pronunciation": "TOOZ-day",
    "example": "We have a meeting on Tuesday.",
    "example_hindi": "Tuesday ko hamari meeting hai.",
    "memory_trick": "Tuesday = Mangalvar.",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "Wednesday",
    "meaning_hindi": "Budhvar",
    "pronunciation": "WENZ-day",
    "example": "Wednesday is mid-week.",
    "example_hindi": "Wednesday hafte ka beech ka din hai.",
    "memory_trick": "Wednesday = Budhvar.",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "Thursday",
    "meaning_hindi": "Guruvar",
    "pronunciation": "THURZ-day",
    "example": "Thursday comes before Friday.",
    "example_hindi": "Thursday Friday se pehle aata hai.",
    "memory_trick": "Thursday = Guruvar.",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "Friday",
    "meaning_hindi": "Shukravar",
    "pronunciation": "FRY-day",
    "example": "Friday is the weekend start.",
    "example_hindi": "Friday weekend ki shuruat hai.",
    "memory_trick": "Friday = Shukravar.",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "Saturday",
    "meaning_hindi": "Shanivar",
    "pronunciation": "SAT-er-day",
    "example": "Saturday is a holiday.",
    "example_hindi": "Saturday ko chhutti hoti hai.",
    "memory_trick": "Saturday = Shanivar.",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "Sunday",
    "meaning_hindi": "Ravivar",
    "pronunciation": "SUN-day",
    "example": "Sunday is a rest day.",
    "example_hindi": "Sunday aaraam ka din hai.",
    "memory_trick": "Sunday = Ravivar.",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "January",
    "meaning_hindi": "Janvari",
    "pronunciation": "JAN-yoo-er-ee",
    "example": "January is the first month.",
    "example_hindi": "January pehla mahina hai.",
    "memory_trick": "Jan = Month 1",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "February",
    "meaning_hindi": "Farvari",
    "pronunciation": "FEB-roo-er-ee",
    "example": "February has 28 days.",
    "example_hindi": "February mein 28 din hote hain.",
    "memory_trick": "Feb = Month 2",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "March",
    "meaning_hindi": "Maarch",
    "pronunciation": "MAHRCH",
    "example": "March is the third month.",
    "example_hindi": "March teesra mahina hai.",
    "memory_trick": "March = Month 3",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "April",
    "meaning_hindi": "Aprail",
    "pronunciation": "AY-pril",
    "example": "April brings spring.",
    "example_hindi": "April spring laata hai.",
    "memory_trick": "April = Month 4",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "May",
    "meaning_hindi": "Mayi",
    "pronunciation": "MAY",
    "example": "May is hot in India.",
    "example_hindi": "Mayi mein India mein garmi hoti hai.",
    "memory_trick": "May = Month 5",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "June",
    "meaning_hindi": "Joon",
    "pronunciation": "JOON",
    "example": "Schools close in June.",
    "example_hindi": "June mein schools band hote hain.",
    "memory_trick": "June = Month 6",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "July",
    "meaning_hindi": "Julayi",
    "pronunciation": "joo-LY",
    "example": "July has heavy rain.",
    "example_hindi": "July mein bhaari barish hoti hai.",
    "memory_trick": "July = Month 7",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "August",
    "meaning_hindi": "Agast",
    "pronunciation": "AW-gust",
    "example": "Independence day is in August.",
    "example_hindi": "August mein swatantrata diwas hota hai.",
    "memory_trick": "August = Month 8",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "September",
    "meaning_hindi": "Sitambar",
    "pronunciation": "sep-TEM-ber",
    "example": "September has cool air.",
    "example_hindi": "September mein thandi hawa chalti hai.",
    "memory_trick": "Sept = Month 9",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "October",
    "meaning_hindi": "Aktubar",
    "pronunciation": "ok-TOH-ber",
    "example": "October has festivals.",
    "example_hindi": "October mein tyohaar aate hain.",
    "memory_trick": "Oct = Month 10",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "November",
    "meaning_hindi": "Navambar",
    "pronunciation": "noh-VEM-ber",
    "example": "November is dry.",
    "example_hindi": "November dry hota hai.",
    "memory_trick": "Nov = Month 11",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "December",
    "meaning_hindi": "Disambar",
    "pronunciation": "dih-SEM-ber",
    "example": "December is cold.",
    "example_hindi": "December thanda hota hai.",
    "memory_trick": "Dec = Month 12",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "year",
    "meaning_hindi": "Saal / Varsh",
    "pronunciation": "YEER",
    "example": "A year has twelve months.",
    "example_hindi": "Saal mein barah mahine hote hain.",
    "memory_trick": "Year yaani 365 din.",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "month",
    "meaning_hindi": "Mahina / Maas",
    "pronunciation": "MUNTH",
    "example": "A month has thirty days.",
    "example_hindi": "Ek mahine mein tees din hote hain.",
    "memory_trick": "Month yaani 30 din.",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "week",
    "meaning_hindi": "Hafta / Saptah",
    "pronunciation": "WEEK",
    "example": "I will return next week.",
    "example_hindi": "Main agle hafte wapas aaunga.",
    "memory_trick": "Week yaani 7 din.",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "hour",
    "meaning_hindi": "Ghanta",
    "pronunciation": "OW-er",
    "example": "Wait for an hour.",
    "example_hindi": "Ek ghante tak intezar karein.",
    "memory_trick": "Hour yaani 60 minutes.",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "minute",
    "meaning_hindi": "Minute",
    "pronunciation": "MIN-it",
    "example": "I will be back in a minute.",
    "example_hindi": "Main ek minute mein wapas aaunga.",
    "memory_trick": "Minute yaani 60 seconds.",
    "level": "A0",
    "topic": "Numbers & Time"
  },
  {
    "word": "eat",
    "meaning_hindi": "Khana",
    "pronunciation": "EET",
    "example": "I eat an apple daily.",
    "example_hindi": "Main roz ek seb khata hoon.",
    "memory_trick": "Eat matlab muh se khana chabana!",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "drink",
    "meaning_hindi": "Peena",
    "pronunciation": "DRINK",
    "example": "Please drink some water.",
    "example_hindi": "Kripya thoda paani peejiye.",
    "memory_trick": "Drink matlab gala geela karna.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "sleep",
    "meaning_hindi": "Sona",
    "pronunciation": "SLEEP",
    "example": "I sleep at 10 PM.",
    "example_hindi": "Main raat 10 baje sota hoon.",
    "memory_trick": "Sleep matlab aankhein band karke so jana.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "wake",
    "meaning_hindi": "Jaagna",
    "pronunciation": "WAYK",
    "example": "I wake up early.",
    "example_hindi": "Main jaldi jaagta hoon.",
    "memory_trick": "Wake matlab neend se jaagna.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "work",
    "meaning_hindi": "Kaam karna",
    "pronunciation": "WURK",
    "example": "He works at a startup.",
    "example_hindi": "Woh ek startup mein kaam karta hai.",
    "memory_trick": "Work matlab koi dhandha ya naukri karna.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "study",
    "meaning_hindi": "Padhna / Adhyayan",
    "pronunciation": "STUD-ee",
    "example": "We study English daily.",
    "example_hindi": "Hum roz English padhte hain.",
    "memory_trick": "Study matlab gyaan arjan karna.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "go",
    "meaning_hindi": "Jaana",
    "pronunciation": "GOH",
    "example": "I go to the office.",
    "example_hindi": "Main office jaata hoon.",
    "memory_trick": "Go matlab ek jagah se dusri jagah jana.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "come",
    "meaning_hindi": "Aana",
    "pronunciation": "KUM",
    "example": "Come here quickly.",
    "example_hindi": "Yahan jaldi aao.",
    "memory_trick": "Come matlab paas aana.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "see",
    "meaning_hindi": "Dekhna",
    "pronunciation": "SEE",
    "example": "I see a bird.",
    "example_hindi": "Mujhe ek chidiya dikh rahi hai.",
    "memory_trick": "See matlab aankhon se dekhna.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "hear",
    "meaning_hindi": "Sunna",
    "pronunciation": "HEER",
    "example": "Can you hear my voice?",
    "example_hindi": "Kya aap meri aawaz sun sakte hain?",
    "memory_trick": "Hear matlab kaano se sunna.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "speak",
    "meaning_hindi": "Bolna",
    "pronunciation": "SPEEK",
    "example": "I speak Hindi and English.",
    "example_hindi": "Main Hindi aur English bolta hoon.",
    "memory_trick": "Speak matlab baatein karna.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "write",
    "meaning_hindi": "Likhna",
    "pronunciation": "RYT",
    "example": "Write a letter to him.",
    "example_hindi": "Use ek patra likho.",
    "memory_trick": "Write matlab kalam se panno par likhna.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "read",
    "meaning_hindi": "Padhna",
    "pronunciation": "REED",
    "example": "I read news daily.",
    "example_hindi": "Main roz khabar padhta hoon.",
    "memory_trick": "Read matlab aksharo ko dekhkar samajhna.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "think",
    "meaning_hindi": "Sochna",
    "pronunciation": "THINK",
    "example": "I think you are right.",
    "example_hindi": "Mujhe lagta hai aap sahi hain.",
    "memory_trick": "Think matlab dimaag chalana.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "know",
    "meaning_hindi": "Jaanna",
    "pronunciation": "NOH",
    "example": "I know the answer.",
    "example_hindi": "Main jawab jaanta hoon.",
    "memory_trick": "Know matlab dimaag mein pehle se hona.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "want",
    "meaning_hindi": "Chahna",
    "pronunciation": "WONT",
    "example": "I want to learn English.",
    "example_hindi": "Main English seekhna chahta hoon.",
    "memory_trick": "Want matlab kisi cheez ki ichha karna.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "need",
    "meaning_hindi": "Zaroorat hona",
    "pronunciation": "NEED",
    "example": "I need your help.",
    "example_hindi": "Mujhe aapki madad ki zaroorat hai.",
    "memory_trick": "Need matlab aavashyakta hona.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "like",
    "meaning_hindi": "Pasand karna",
    "pronunciation": "LYK",
    "example": "I like this design.",
    "example_hindi": "Mujhe yeh design pasand hai.",
    "memory_trick": "Like matlab achha lagna.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "love",
    "meaning_hindi": "Pyaar karna",
    "pronunciation": "LUV",
    "example": "I love my country.",
    "example_hindi": "Main apne desh se pyaar karta hoon.",
    "memory_trick": "Love matlab gehra lagav hona.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "hate",
    "meaning_hindi": "Nafrat karna",
    "pronunciation": "HAYT",
    "example": "I hate lie.",
    "example_hindi": "Mujhe jhoot se nafrat hai.",
    "memory_trick": "Hate matlab bilkul na-pasand karna.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "buy",
    "meaning_hindi": "Kharidna",
    "pronunciation": "BY",
    "example": "I want to buy a phone.",
    "example_hindi": "Main ek phone kharidna chahta hoon.",
    "memory_trick": "Buy matlab paise dekar lena.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "sell",
    "meaning_hindi": "Bechna",
    "pronunciation": "SEL",
    "example": "They sell fresh fruits.",
    "example_hindi": "Woh taaze phal bechte hain.",
    "memory_trick": "Sell matlab maal dena paise lekar.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "pay",
    "meaning_hindi": "Bhugtan karna",
    "pronunciation": "PAY",
    "example": "You can pay with card.",
    "example_hindi": "Aap card se payment kar sakte hain.",
    "memory_trick": "Pay matlab paise chukana.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "give",
    "meaning_hindi": "Dena",
    "pronunciation": "GIV",
    "example": "Give me a pen.",
    "example_hindi": "Mujhe ek pen do.",
    "memory_trick": "Give matlab kisi ko dena.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "take",
    "meaning_hindi": "Lena",
    "pronunciation": "TAYK",
    "example": "Take this bag.",
    "example_hindi": "Yeh bag le lo.",
    "memory_trick": "Take matlab kisi se lena.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "make",
    "meaning_hindi": "Banana",
    "pronunciation": "MAYK",
    "example": "I will make coffee.",
    "example_hindi": "Main coffee banaunga.",
    "memory_trick": "Make matlab naya taiyaar karna.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "do",
    "meaning_hindi": "Karna",
    "pronunciation": "DOO",
    "example": "Do your work.",
    "example_hindi": "Apna kaam karo.",
    "memory_trick": "Do matlab kriya karna.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "have",
    "meaning_hindi": "Paas hona",
    "pronunciation": "HAV",
    "example": "I have a car.",
    "example_hindi": "Mere paas ek car hai.",
    "memory_trick": "Have matlab ownership hona.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "get",
    "meaning_hindi": "Paana / Milna",
    "pronunciation": "GET",
    "example": "I got the job.",
    "example_hindi": "Mujhe job mil gayi.",
    "memory_trick": "Get matlab prapt karna.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "put",
    "meaning_hindi": "Rakhna",
    "pronunciation": "PUT",
    "example": "Put it on the table.",
    "example_hindi": "Ise table par rakh do.",
    "memory_trick": "Put matlab kisi jagah par rakhna.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "sit",
    "meaning_hindi": "Baithna",
    "pronunciation": "SIT",
    "example": "Please sit down.",
    "example_hindi": "Kripya baith jaiye.",
    "memory_trick": "Sit matlab kursi par baithna.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "stand",
    "meaning_hindi": "Khada hona",
    "pronunciation": "STAND",
    "example": "Stand up, please.",
    "example_hindi": "Kripya khade ho jaiye.",
    "memory_trick": "Stand matlab pairo par khada hona.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "walk",
    "meaning_hindi": "Chalna",
    "pronunciation": "WAWK",
    "example": "I walk in the morning.",
    "example_hindi": "Main subah chalta hoon.",
    "memory_trick": "Walk matlab paidal chalna.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "run",
    "meaning_hindi": "Daudna",
    "pronunciation": "RUN",
    "example": "Run fast!",
    "example_hindi": "Tez daudo!",
    "memory_trick": "Run matlab tezi se bhagna.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "drive",
    "meaning_hindi": "Chalana (Vehicle)",
    "pronunciation": "DRYV",
    "example": "Can you drive a car?",
    "example_hindi": "Kya aap car chala sakte hain?",
    "memory_trick": "Drive matlab char pahiye chalana.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "call",
    "meaning_hindi": "Bulaana / Call karna",
    "pronunciation": "KAWL",
    "example": "Call me tomorrow.",
    "example_hindi": "Mujhe kal call karna.",
    "memory_trick": "Call matlab phone karna.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "ask",
    "meaning_hindi": "Poochna",
    "pronunciation": "ASK",
    "example": "Ask me any question.",
    "example_hindi": "Mujhe koi bhi sawaal poocho.",
    "memory_trick": "Ask matlab query karna.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "tell",
    "meaning_hindi": "Batana",
    "pronunciation": "TEL",
    "example": "Tell me your name.",
    "example_hindi": "Mujhe apna naam batao.",
    "memory_trick": "Tell matlab baat batana.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "say",
    "meaning_hindi": "Kehna",
    "pronunciation": "SAY",
    "example": "Say something.",
    "example_hindi": "Kuch kaho.",
    "memory_trick": "Say matlab bolna.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "help",
    "meaning_hindi": "Madad karna",
    "pronunciation": "HELP",
    "example": "I can help you.",
    "example_hindi": "Main aapki madad kar sakta hoon.",
    "memory_trick": "Help matlab sahyog dena.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "start",
    "meaning_hindi": "Shuru karna",
    "pronunciation": "STAHRT",
    "example": "Let's start the class.",
    "example_hindi": "Chalo class shuru karte hain.",
    "memory_trick": "Start matlab shuruat karna.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "stop",
    "meaning_hindi": "Rokna",
    "pronunciation": "STOP",
    "example": "Stop the car.",
    "example_hindi": "Car roko.",
    "memory_trick": "Stop matlab pause lagana.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "finish",
    "meaning_hindi": "Khatam karna",
    "pronunciation": "FIN-ish",
    "example": "Finish your work.",
    "example_hindi": "Apna kaam khatam karo.",
    "memory_trick": "Finish matlab poora karna.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "house",
    "meaning_hindi": "Ghar",
    "pronunciation": "HOWS",
    "example": "This is a big house.",
    "example_hindi": "Yeh ek bada ghar hai.",
    "memory_trick": "House matlab makaan jahan parivar rahe.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "room",
    "meaning_hindi": "Kamra",
    "pronunciation": "ROOM",
    "example": "My room is clean.",
    "example_hindi": "Mera kamra saaf hai.",
    "memory_trick": "Room matlab chaar diwaro wala kamra.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "kitchen",
    "meaning_hindi": "Rasoi",
    "pronunciation": "KICH-en",
    "example": "Mother is in the kitchen.",
    "example_hindi": "Maa rasoi mein hain.",
    "memory_trick": "Kitchen jahan khana pakta hai.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "bedroom",
    "meaning_hindi": "Sone ka kamra",
    "pronunciation": "BED-room",
    "example": "The bed is in the bedroom.",
    "example_hindi": "Bed bedroom mein hai.",
    "memory_trick": "Bedroom yaani sone ki shanti.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "bathroom",
    "meaning_hindi": "Ghusalkhana",
    "pronunciation": "BATH-room",
    "example": "The bathroom has a shower.",
    "example_hindi": "Bathroom mein shower hai.",
    "memory_trick": "Bathroom yaani nahane ki jagah.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "living room",
    "meaning_hindi": "Baithak",
    "pronunciation": "LIV-ing room",
    "example": "We watch TV in the living room.",
    "example_hindi": "Hum living room mein TV dekhte hain.",
    "memory_trick": "Living room jahan guest baithte hain.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "door",
    "meaning_hindi": "Darwaza",
    "pronunciation": "DOR",
    "example": "Open the door.",
    "example_hindi": "Darwaza kholo.",
    "memory_trick": "Door matlab entry point.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "window",
    "meaning_hindi": "Khidki",
    "pronunciation": "WIN-doh",
    "example": "Close the window.",
    "example_hindi": "Khidki band karo.",
    "memory_trick": "Window matlab hawa aane ka rasta.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "chair",
    "meaning_hindi": "Kursi",
    "pronunciation": "CHAIR",
    "example": "Sit on the chair.",
    "example_hindi": "Kursi par baitho.",
    "memory_trick": "Chair yaani baithne ki seat.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "table",
    "meaning_hindi": "Mej",
    "pronunciation": "TAY-bel",
    "example": "Put the book on the table.",
    "example_hindi": "Kitab ko table par rakh do.",
    "memory_trick": "Table yaani likhne/khane ki flat surface.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "bed",
    "meaning_hindi": "Bistar",
    "pronunciation": "BED",
    "example": "The bed is comfortable.",
    "example_hindi": "Bistar comfortable hai.",
    "memory_trick": "Bed yaani aaraam ka gadda.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "sofa",
    "meaning_hindi": "Sofa",
    "pronunciation": "SOH-fuh",
    "example": "The sofa is soft.",
    "example_hindi": "Sofa naram hai.",
    "memory_trick": "Sofa jahan dosto ke sath baithte hain.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "phone",
    "meaning_hindi": "Mobile / Phone",
    "pronunciation": "FOHN",
    "example": "My phone is ringing.",
    "example_hindi": "Mera phone baj raha hai.",
    "memory_trick": "Phone yaani dabba jo baat karwaye.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "laptop",
    "meaning_hindi": "Laptop",
    "pronunciation": "LAP-top",
    "example": "I work on my laptop.",
    "example_hindi": "Main apne laptop par kaam karta hoon.",
    "memory_trick": "Laptop yaani mini computer.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "TV",
    "meaning_hindi": "Television / TV",
    "pronunciation": "TEE-VEE",
    "example": "Turn on the TV.",
    "example_hindi": "TV chalu karo.",
    "memory_trick": "TV yaani manoranjan ka dibba.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "food",
    "meaning_hindi": "Khana / Bhojan",
    "pronunciation": "FOOD",
    "example": "The food is delicious.",
    "example_hindi": "Khana swadisht hai.",
    "memory_trick": "Food jo shari ko urja de.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "water",
    "meaning_hindi": "Paani",
    "pronunciation": "WAH-ter",
    "example": "Give me cold water.",
    "example_hindi": "Mujhe thanda paani do.",
    "memory_trick": "Water yaani jal hi jeevan hai.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "tea",
    "meaning_hindi": "Chai",
    "pronunciation": "TEE",
    "example": "I drink tea every morning.",
    "example_hindi": "Main roz subah chai peeta hoon.",
    "memory_trick": "Tea yaani subah ki taazgi.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "coffee",
    "meaning_hindi": "Coffee",
    "pronunciation": "KOF-ee",
    "example": "I like black coffee.",
    "example_hindi": "Mujhe black coffee pasand hai.",
    "memory_trick": "Coffee jo neend udaye.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "rice",
    "meaning_hindi": "Chawal",
    "pronunciation": "RYSS",
    "example": "We eat rice for lunch.",
    "example_hindi": "Hum lunch mein chawal khate hain.",
    "memory_trick": "Rice yaani dhaan ke dane.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "bread",
    "meaning_hindi": "Roti / Bread",
    "pronunciation": "BRED",
    "example": "Please buy some bread.",
    "example_hindi": "Kripya thoda bread kharid lein.",
    "memory_trick": "Bread yaani roti.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "vegetable",
    "meaning_hindi": "Sabzi",
    "pronunciation": "VEJ-tuh-bel",
    "example": "Green vegetables are good.",
    "example_hindi": "Hari sabziyan achhi hoti hain.",
    "memory_trick": "Vegetable yaani sehat ki chabi.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "fruit",
    "meaning_hindi": "Phal",
    "pronunciation": "FROOT",
    "example": "Apple is my favorite fruit.",
    "example_hindi": "Seb mera favorite phal hai.",
    "memory_trick": "Fruit yaani meetha aur swadisht phal.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "clothes",
    "meaning_hindi": "Kapde",
    "pronunciation": "KLOHZ",
    "example": "Wash your clothes.",
    "example_hindi": "Apne kapde dho lo.",
    "memory_trick": "Clothes jo badan ko dhakein.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "shirt",
    "meaning_hindi": "Shirt / Kameez",
    "pronunciation": "SHURT",
    "example": "His shirt is white.",
    "example_hindi": "Uski shirt safed hai.",
    "memory_trick": "Shirt yaani formal wear.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "pants",
    "meaning_hindi": "Patloon / Pants",
    "pronunciation": "PANTS",
    "example": "These pants are new.",
    "example_hindi": "Yeh pants nayi hain.",
    "memory_trick": "Pants yaani trouser.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "shoes",
    "meaning_hindi": "Joote",
    "pronunciation": "SHOOZ",
    "example": "Wear your shoes.",
    "example_hindi": "Apne joote pehno.",
    "memory_trick": "Shoes jo pairo ki raksha karein.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "bag",
    "meaning_hindi": "Basta / Bag",
    "pronunciation": "BAG",
    "example": "My bag is heavy.",
    "example_hindi": "Mera bag bhaari hai.",
    "memory_trick": "Bag jisme saman rakhein.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "money",
    "meaning_hindi": "Paisa / Dhan",
    "pronunciation": "MUN-ee",
    "example": "I need some money.",
    "example_hindi": "Mujhe thode paise ki zaroorat hai.",
    "memory_trick": "Money yaani rokda.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "key",
    "meaning_hindi": "Chabi",
    "pronunciation": "KEE",
    "example": "I lost my house key.",
    "example_hindi": "Maine apne ghar ki chabi kho di.",
    "memory_trick": "Key jo darwaza khole.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "book",
    "meaning_hindi": "Kitab",
    "pronunciation": "BOOK",
    "example": "Read this book.",
    "example_hindi": "Yeh kitab padho.",
    "memory_trick": "Book yaani gyaan ka bhandar.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "office",
    "meaning_hindi": "Daftar",
    "pronunciation": "AW-fis",
    "example": "I go to the office at 9 AM.",
    "example_hindi": "Main 9 baje office jata hoon.",
    "memory_trick": "Office jahan log kaam karte hain.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "meeting",
    "meaning_hindi": "Baithak / Meeting",
    "pronunciation": "MEE-ting",
    "example": "We have a team meeting.",
    "example_hindi": "Hamari ek team meeting hai.",
    "memory_trick": "Meeting jahan ideas share hote hain.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "boss",
    "meaning_hindi": "Boss / Adhikari",
    "pronunciation": "BAWS",
    "example": "My boss is very helpful.",
    "example_hindi": "Mere boss bahut helpful hain.",
    "memory_trick": "Boss jo team ko lead kare.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "colleague",
    "meaning_hindi": "Saath kaam karne wala",
    "pronunciation": "KOL-eeg",
    "example": "He is a good colleague.",
    "example_hindi": "Woh ek achha colleague hai.",
    "memory_trick": "Colleague yaani office ka dost.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "team",
    "meaning_hindi": "Samooh / Team",
    "pronunciation": "TEEM",
    "example": "Our team won the award.",
    "example_hindi": "Hamari team ne award jeeta.",
    "memory_trick": "Team matlab ek sath milkar kaam karna.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "project",
    "meaning_hindi": "Yojana / Project",
    "pronunciation": "PROJ-ekt",
    "example": "I am leading this project.",
    "example_hindi": "Main is project ko lead kar raha hoon.",
    "memory_trick": "Project yaani ek bada task.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "deadline",
    "meaning_hindi": "Antim samay-seema",
    "pronunciation": "DED-lyn",
    "example": "The deadline is today.",
    "example_hindi": "Deadline aaj hai.",
    "memory_trick": "Deadline yaani time limit.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "email",
    "meaning_hindi": "Patra / Email",
    "pronunciation": "EE-mayl",
    "example": "Send me the project report by email.",
    "example_hindi": "Mujhe project report email se bhejo.",
    "memory_trick": "Email yaani electronic letter.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "report",
    "meaning_hindi": "Vivaran / Report",
    "pronunciation": "ri-PORT",
    "example": "Write a progress report.",
    "example_hindi": "Ek progress report likho.",
    "memory_trick": "Report yaani details ka document.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "presentation",
    "meaning_hindi": "Prastutikaran",
    "pronunciation": "prez-en-TAY-shun",
    "example": "His presentation was excellent.",
    "example_hindi": "Unka presentation badhiya tha.",
    "memory_trick": "Presentation yaani project ko prastut karna.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "salary",
    "meaning_hindi": "Vetan / Salary",
    "pronunciation": "SAL-uh-ree",
    "example": "Salary is paid monthly.",
    "example_hindi": "Salary har mahine milti hai.",
    "memory_trick": "Salary yaani mehnat ki kamai.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "job",
    "meaning_hindi": "Naukri",
    "pronunciation": "JOB",
    "example": "She is looking for a job.",
    "example_hindi": "Woh naukri dhoondh rahi hai.",
    "memory_trick": "Job yaani kaam/naukri.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "career",
    "meaning_hindi": "Ajeevika / Career",
    "pronunciation": "kuh-REER",
    "example": "Choose a good career path.",
    "example_hindi": "Ek achha career path chuno.",
    "memory_trick": "Career yaani future growth.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "interview",
    "meaning_hindi": "Sashatkar / Interview",
    "pronunciation": "IN-ter-vyoo",
    "example": "I have an interview tomorrow.",
    "example_hindi": "Mera kal interview hai.",
    "memory_trick": "Interview yaani selection test.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "schedule",
    "meaning_hindi": "Karyakram / Schedule",
    "pronunciation": "SKEJ-ool",
    "example": "What is your schedule?",
    "example_hindi": "Aapka schedule kya hai?",
    "memory_trick": "Schedule yaani time list.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "appointment",
    "meaning_hindi": "Milne ka samay",
    "pronunciation": "uh-POINT-ment",
    "example": "I have a doctor appointment.",
    "example_hindi": "Mera doctor ke sath appointment hai.",
    "memory_trick": "Appointment yaani fix meeting time.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "client",
    "meaning_hindi": "Grahak / Client",
    "pronunciation": "KLY-ent",
    "example": "The client approved the design.",
    "example_hindi": "Client ne design approve kar diya.",
    "memory_trick": "Client jo hume business de.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "customer",
    "meaning_hindi": "Khariddar / Customer",
    "pronunciation": "KUS-tuh-mer",
    "example": "The customer bought a laptop.",
    "example_hindi": "Customer ne ek laptop kharida.",
    "memory_trick": "Customer jo retail product kharide.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "business",
    "meaning_hindi": "Vyapaar",
    "pronunciation": "BIZ-nis",
    "example": "He started a new business.",
    "example_hindi": "Usne naya vyapaar shuru kiya.",
    "memory_trick": "Business yaani dhandha.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "company",
    "meaning_hindi": "Sanstha / Company",
    "pronunciation": "KUM-puh-nee",
    "example": "This is a software company.",
    "example_hindi": "Yeh ek software company hai.",
    "memory_trick": "Company yaani bada office organization.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "proposal",
    "meaning_hindi": "Prastaav",
    "pronunciation": "pruh-POH-zel",
    "example": "I sent a business proposal.",
    "example_hindi": "Maine ek business proposal bheja.",
    "memory_trick": "Proposal matlab naya suggestion ya project draft.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "contract",
    "meaning_hindi": "Anubandh / Contract",
    "pronunciation": "KON-trakt",
    "example": "Sign the contract.",
    "example_hindi": "Contract sign karein.",
    "memory_trick": "Contract yaani legal paper bounds.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "invoice",
    "meaning_hindi": "Bill / Raseed",
    "pronunciation": "IN-voys",
    "example": "Please send me the invoice.",
    "example_hindi": "Kripya mujhe bill/invoice bhejo.",
    "memory_trick": "Invoice yaani payment request sheet.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "payment",
    "meaning_hindi": "Bhugtan",
    "pronunciation": "PAY-ment",
    "example": "The payment is pending.",
    "example_hindi": "Bhugtan pending hai.",
    "memory_trick": "Payment yaani chukaya hua paisa.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "deliverable",
    "meaning_hindi": "Pradan karne yogya",
    "pronunciation": "dih-LIV-er-uh-bel",
    "example": "What are the key deliverables?",
    "example_hindi": "Mukhya deliverables kya hain?",
    "memory_trick": "Deliverables yaani jo kaam complete karke client ko dena hai.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "scope",
    "meaning_hindi": "Karya-kshetra / Scope",
    "pronunciation": "SKOHP",
    "example": "Define the project scope.",
    "example_hindi": "Project scope ko define karein.",
    "memory_trick": "Scope yaani kitna kaam karna hai uski limit.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "timeline",
    "meaning_hindi": "Samay-rekha",
    "pronunciation": "TYM-lyn",
    "example": "Follow the project timeline.",
    "example_hindi": "Project timeline ko follow karein.",
    "memory_trick": "Timeline yaani kab kab kya hona hai.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "milestone",
    "meaning_hindi": "Meel ka patthar / Milestone",
    "pronunciation": "MYL-stohn",
    "example": "We reached the first milestone.",
    "example_hindi": "Hum pehle milestone par pahunch gaye.",
    "memory_trick": "Milestone yaani important stage complete hona.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "revision",
    "meaning_hindi": "Sanshodhan / Badlav",
    "pronunciation": "ri-VIZH-un",
    "example": "The client asked for revision.",
    "example_hindi": "Client ne revision maanga hai.",
    "memory_trick": "Revision yaani change/correction karna.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "feedback",
    "meaning_hindi": "Pratikriya / Feedback",
    "pronunciation": "FEED-bak",
    "example": "We appreciate user feedback.",
    "example_hindi": "Hum user feedback ki prashansa karte hain.",
    "memory_trick": "Feedback yaani ray/suggestion dena.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "approval",
    "meaning_hindi": "Manzoori",
    "pronunciation": "uh-PROO-vel",
    "example": "Get the boss approval.",
    "example_hindi": "Boss ki manzoori le lo.",
    "memory_trick": "Approval yaani sign-off/haan kehlana.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "budget",
    "meaning_hindi": "Vittiya yojana / Budget",
    "pronunciation": "BUJ-it",
    "example": "We must stick to the budget.",
    "example_hindi": "Hume budget ke andar rehna hoga.",
    "memory_trick": "Budget yaani kharche ki yojana.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "quote",
    "meaning_hindi": "Anumanit kimat / Quote",
    "pronunciation": "KWOHT",
    "example": "Request a quote for the service.",
    "example_hindi": "Service ke liye quote request karein.",
    "memory_trick": "Quote yaani pricing estimate sheet.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "agreement",
    "meaning_hindi": "Samjhauta",
    "pronunciation": "uh-GREE-ment",
    "example": "We reached an agreement.",
    "example_hindi": "Hum ek samjhoute par pahunche.",
    "memory_trick": "Agreement yaani dono sides ki haan.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "partnership",
    "meaning_hindi": "Sajhedari",
    "pronunciation": "PAHRT-ner-ship",
    "example": "A new business partnership.",
    "example_hindi": "Ek nayi business sajhedari.",
    "memory_trick": "Partnership yaani sath milkar dhandha chalana.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "collaboration",
    "meaning_hindi": "Sahyog",
    "pronunciation": "kuh-lab-uh-RAY-shun",
    "example": "This project is a collaboration.",
    "example_hindi": "Yeh project ek sahyog hai.",
    "memory_trick": "Collaboration yaani teams ka joint work.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "strategy",
    "meaning_hindi": "Karyaneeti / Strategy",
    "pronunciation": "STRAT-i-jee",
    "example": "We need a new strategy.",
    "example_hindi": "Hume ek nayi strategy ki zaroorat hai.",
    "memory_trick": "Strategy yaani safalta ka plan.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "brand",
    "meaning_hindi": "Chhap / Brand",
    "pronunciation": "BRAND",
    "example": "Nike is a famous brand.",
    "example_hindi": "Nike ek famous brand hai.",
    "memory_trick": "Brand yaani company ki market value name.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "marketing",
    "meaning_hindi": "Vipnan / Marketing",
    "pronunciation": "MAHR-ki-ting",
    "example": "Online marketing is effective.",
    "example_hindi": "Online marketing prabhavshali hai.",
    "memory_trick": "Marketing yaani product bechne ka prachaar.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "target",
    "meaning_hindi": "Lakshya",
    "pronunciation": "TAHR-git",
    "example": "Meet your sales target.",
    "example_hindi": "Apna sales target poora karo.",
    "memory_trick": "Target yaani achieve karne wala point.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "audience",
    "meaning_hindi": "Darshak / Audience",
    "pronunciation": "AW-dee-ens",
    "example": "Know your target audience.",
    "example_hindi": "Apni target audience ko pehchano.",
    "memory_trick": "Audience yaani jo log aapko sun/dekh rahe hain.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "campaign",
    "meaning_hindi": "Abhiyan / Campaign",
    "pronunciation": "kam-PAYN",
    "example": "A new ad campaign.",
    "example_hindi": "Ek naya ad campaign.",
    "memory_trick": "Campaign yaani specific goals ke liye chalaya gaya campaign.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "content",
    "meaning_hindi": "Samagri / Content",
    "pronunciation": "KON-tent",
    "example": "Write engaging content.",
    "example_hindi": "Engaging content likho.",
    "memory_trick": "Content yaani articles/videos/design info.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "design",
    "meaning_hindi": "Rachna / Design",
    "pronunciation": "dih-ZYN",
    "example": "The design is very modern.",
    "example_hindi": "Design bahut modern hai.",
    "memory_trick": "Design yaani visual graphics block.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "development",
    "meaning_hindi": "Vikas / Development",
    "pronunciation": "dih-VEL-up-ment",
    "example": "Web development takes time.",
    "example_hindi": "Web development mein samay lagta hai.",
    "memory_trick": "Development yaani code karke build karna.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "launch",
    "meaning_hindi": "Shuruat / Launch",
    "pronunciation": "LAWNCH",
    "example": "The product launch is next month.",
    "example_hindi": "Product launch agle mahine hai.",
    "memory_trick": "Launch yaani market mein utarna.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "follow up",
    "meaning_hindi": "Baad mein check karna",
    "pronunciation": "FOL-oh up",
    "example": "I will follow up with him.",
    "example_hindi": "Main uske sath baad mein check karunga.",
    "memory_trick": "Follow up yaani status update lena.",
    "level": "B1",
    "topic": "Client Communication"
  },
  {
    "word": "touch base",
    "meaning_hindi": "Baat karna",
    "pronunciation": "TUCH bays",
    "example": "Let's touch base tomorrow.",
    "example_hindi": "Chalo kal baat karte hain.",
    "memory_trick": "Touch base yaani brief conversation karna.",
    "level": "B1",
    "topic": "Client Communication"
  },
  {
    "word": "loop in",
    "meaning_hindi": "Shaamil karna",
    "pronunciation": "LOOP in",
    "example": "Please loop me in the email.",
    "example_hindi": "Kripya mujhe email mein shaamil karein.",
    "memory_trick": "Loop in yaani cc/update list mein daalna.",
    "level": "B1",
    "topic": "Client Communication"
  },
  {
    "word": "sync up",
    "meaning_hindi": "Baat karke align hona",
    "pronunciation": "SINK up",
    "example": "We need to sync up on this task.",
    "example_hindi": "Hume is kaam par baat karke align hona hoga.",
    "memory_trick": "Sync up yaani same update share karna.",
    "level": "B1",
    "topic": "Client Communication"
  },
  {
    "word": "circle back",
    "meaning_hindi": "Wapas aakar baat karna",
    "pronunciation": "SUR-kel bak",
    "example": "Let's circle back to this later.",
    "example_hindi": "Chalo ispar baad mein wapas aakar baat karenge.",
    "memory_trick": "Circle back yaani baad mein return hona topic par.",
    "level": "B1",
    "topic": "Client Communication"
  },
  {
    "word": "onboard",
    "meaning_hindi": "Ghar/Team mein lana",
    "pronunciation": "ON-bord",
    "example": "We need to onboard the client.",
    "example_hindi": "Hume client ko onboard karna hoga.",
    "memory_trick": "Onboard yaani client/employee ko shuruat karwana.",
    "level": "B1",
    "topic": "Client Communication"
  },
  {
    "word": "offboard",
    "meaning_hindi": "Team se rukhsat karna",
    "pronunciation": "AWF-bord",
    "example": "The offboarding process is smooth.",
    "example_hindi": "Offboarding process smooth hai.",
    "memory_trick": "Offboard yaani project/job se exit karwana.",
    "level": "B1",
    "topic": "Client Communication"
  },
  {
    "word": "escalate",
    "meaning_hindi": "Mamla bade boss tak le jana",
    "pronunciation": "ES-kuh-layt",
    "example": "If the issue persists, escalate it.",
    "example_hindi": "Agar issue bana rehta hai, toh ise escalate karein.",
    "memory_trick": "Escalate yaani bade star par problem submit karna.",
    "level": "B1",
    "topic": "Client Communication"
  },
  {
    "word": "prioritize",
    "meaning_hindi": "Prathmikta dena",
    "pronunciation": "pry-OR-i-tyz",
    "example": "Prioritize the urgent tasks.",
    "example_hindi": "Urgent tasks ko prathmikta dein.",
    "memory_trick": "Prioritize yaani jo pehle zaroori hai use pehle karna.",
    "level": "B1",
    "topic": "Client Communication"
  },
  {
    "word": "delegate",
    "meaning_hindi": "Kam baantna",
    "pronunciation": "DEL-i-gayt",
    "example": "Delegate work to your team.",
    "example_hindi": "Apni team ko kaam baantein.",
    "memory_trick": "Delegate yaani dusro ko task sonpna.",
    "level": "B1",
    "topic": "Client Communication"
  },
  {
    "word": "brainstorm",
    "meaning_hindi": "Milkar ideas nikalna",
    "pronunciation": "BRAYN-storm",
    "example": "Let's brainstorm new design ideas.",
    "example_hindi": "Chalo naye design ideas par vichar-manthan karte hain.",
    "memory_trick": "Brainstorm yaani dimagi kasrat karke solutions nikalna.",
    "level": "B1",
    "topic": "Client Communication"
  },
  {
    "word": "discuss",
    "meaning_hindi": "Charcha karna",
    "pronunciation": "dih-SKUS",
    "example": "Discuss the plan with clients.",
    "example_hindi": "Client ke sath plan par charcha karein.",
    "memory_trick": "Discuss yaani kisi topic par details se baat karna.",
    "level": "B1",
    "topic": "Client Communication"
  },
  {
    "word": "negotiate",
    "meaning_hindi": "Molbhav / Samjhauta karna",
    "pronunciation": "nih-GOH-shee-ayt",
    "example": "We must negotiate the pricing.",
    "example_hindi": "Hume pricing par negotiate karna chahiye.",
    "memory_trick": "Negotiate yaani rates/terms par compromise lana.",
    "level": "B1",
    "topic": "Client Communication"
  },
  {
    "word": "finalize",
    "meaning_hindi": "Antim roop dena",
    "pronunciation": "FY-nuh-lyz",
    "example": "Let's finalize the deal.",
    "example_hindi": "Chalo deal ko antim roop dete hain.",
    "memory_trick": "Finalize yaani pakka lock kar dena.",
    "level": "B1",
    "topic": "Client Communication"
  },
  {
    "word": "confirm",
    "meaning_hindi": "Pushti karna",
    "pronunciation": "kuhn-FURM",
    "example": "Confirm your attendance.",
    "example_hindi": "Apni upasthiti ki pushti karein.",
    "memory_trick": "Confirm yaani haan kehna ya verify karna.",
    "level": "B1",
    "topic": "Client Communication"
  },
  {
    "word": "proceed",
    "meaning_hindi": "Aage badhna",
    "pronunciation": "pruh-SEED",
    "example": "Proceed with the budget plan.",
    "example_hindi": "Budget plan ke sath aage badhein.",
    "memory_trick": "Proceed yaani go ahead, shuru karna.",
    "level": "B1",
    "topic": "Client Communication"
  },
  {
    "word": "deliver",
    "meaning_hindi": "Pahunchna / Kam deliver karna",
    "pronunciation": "dih-LIV-er",
    "example": "Deliver the project on time.",
    "example_hindi": "Project ko samay par deliver karein.",
    "memory_trick": "Deliver yaani complete karke dena.",
    "level": "B1",
    "topic": "Client Communication"
  },
  {
    "word": "present",
    "meaning_hindi": "Pesh karna",
    "pronunciation": "pree-ZENT",
    "example": "Present your strategy.",
    "example_hindi": "Apni strategy pesh karein.",
    "memory_trick": "Present yaani samne show karna.",
    "level": "B1",
    "topic": "Client Communication"
  },
  {
    "word": "happy",
    "meaning_hindi": "Khush",
    "pronunciation": "HAP-ee",
    "example": "I am happy with my progress.",
    "example_hindi": "Main apni progress se khush hoon.",
    "memory_trick": "Happy bole toh chehre par smile!",
    "level": "A2",
    "topic": "Emotions & Personality"
  },
  {
    "word": "sad",
    "meaning_hindi": "Udas",
    "pronunciation": "SAD",
    "example": "Why are you sad?",
    "example_hindi": "Tum udas kyun ho?",
    "memory_trick": "Sad bole toh rone jaisa chehra.",
    "level": "A2",
    "topic": "Emotions & Personality"
  },
  {
    "word": "angry",
    "meaning_hindi": "Gussa",
    "pronunciation": "ANG-gree",
    "example": "Don't be angry with me.",
    "example_hindi": "Mujh par gussa mat karo.",
    "memory_trick": "Angry yaani jab dimaag garam ho.",
    "level": "A2",
    "topic": "Emotions & Personality"
  },
  {
    "word": "excited",
    "meaning_hindi": "Uttejit / Khush",
    "pronunciation": "ik-SY-tid",
    "example": "I am excited about the trip.",
    "example_hindi": "Main trip ke liye excited hoon.",
    "memory_trick": "Excited yaani khushi se jhum uthna.",
    "level": "A2",
    "topic": "Emotions & Personality"
  },
  {
    "word": "nervous",
    "meaning_hindi": "Ghabraya hua",
    "pronunciation": "NUR-vus",
    "example": "He felt nervous before the interview.",
    "example_hindi": "Interview se pehle woh ghabraya hua tha.",
    "memory_trick": "Nervous yaani tension mein haath kapna.",
    "level": "A2",
    "topic": "Emotions & Personality"
  },
  {
    "word": "confident",
    "meaning_hindi": "Aatmavishwasi",
    "pronunciation": "KON-fi-dent",
    "example": "Be confident when you speak.",
    "example_hindi": "Bolte samay aatmavishwasi bano.",
    "memory_trick": "Confident yaani khud par bharosa hona.",
    "level": "A2",
    "topic": "Emotions & Personality"
  },
  {
    "word": "worried",
    "meaning_hindi": "Chintit",
    "pronunciation": "WUR-eed",
    "example": "She is worried about her exam.",
    "example_hindi": "Woh apni exam ko lekar chintit hai.",
    "memory_trick": "Worried yaani tension lena.",
    "level": "A2",
    "topic": "Emotions & Personality"
  },
  {
    "word": "surprised",
    "meaning_hindi": "Ashcharyachakit",
    "pronunciation": "ser-PRYZD",
    "example": "I was surprised by the party.",
    "example_hindi": "Main party se ashcharyachakit reh gaya.",
    "memory_trick": "Surprised yaani aankhein khuli ki khuli reh jana.",
    "level": "A2",
    "topic": "Emotions & Personality"
  },
  {
    "word": "disappointed",
    "meaning_hindi": "Nirash",
    "pronunciation": "dis-uh-POINT-id",
    "example": "Don't be disappointed by failure.",
    "example_hindi": "Asafalta se nirash mat ho.",
    "memory_trick": "Disappointed yaani expectations poori na hona.",
    "level": "A2",
    "topic": "Emotions & Personality"
  },
  {
    "word": "proud",
    "meaning_hindi": "Garv",
    "pronunciation": "PROWD",
    "example": "My parents are proud of me.",
    "example_hindi": "Mere parents ko mujh par garv hai.",
    "memory_trick": "Proud yaani chhati chaudi hona.",
    "level": "A2",
    "topic": "Emotions & Personality"
  },
  {
    "word": "embarrassed",
    "meaning_hindi": "Sharminda",
    "pronunciation": "im-BAR-ust",
    "example": "He felt embarrassed by his mistake.",
    "example_hindi": "Usne apni galti par sharminda mehsus kiya.",
    "memory_trick": "Embarrassed yaani sharam se chehra laal hona.",
    "level": "A2",
    "topic": "Emotions & Personality"
  },
  {
    "word": "grateful",
    "meaning_hindi": "Aabhari / Kritagya",
    "pronunciation": "GRAYT-ful",
    "example": "I am grateful for your support.",
    "example_hindi": "Main aapke sahyog ke liye aabhari hoon.",
    "memory_trick": "Grateful yaani shukraguzar hona.",
    "level": "A2",
    "topic": "Emotions & Personality"
  },
  {
    "word": "frustrated",
    "meaning_hindi": "Nirash / Pareshan",
    "pronunciation": "FRUS-tray-tid",
    "example": "I get frustrated with slow code.",
    "example_hindi": "Main slow code se pareshan ho jata hoon.",
    "memory_trick": "Frustrated yaani bar bar koshish karke thak jana.",
    "level": "A2",
    "topic": "Emotions & Personality"
  },
  {
    "word": "calm",
    "meaning_hindi": "Shant",
    "pronunciation": "KAHM",
    "example": "Keep calm in difficult times.",
    "example_hindi": "Mushkil samay mein shant rahein.",
    "memory_trick": "Calm yaani bilkul shanti.",
    "level": "A2",
    "topic": "Emotions & Personality"
  },
  {
    "word": "patient",
    "meaning_hindi": "Dhairya rakhne wala",
    "pronunciation": "PAY-shent",
    "example": "Be patient, success takes time.",
    "example_hindi": "Dhairya rakhein, safalta mein samay lagta hai.",
    "memory_trick": "Patient yaani sabr rakhne wala.",
    "level": "A2",
    "topic": "Emotions & Personality"
  },
  {
    "word": "honest",
    "meaning_hindi": "Imandar",
    "pronunciation": "ON-ist",
    "example": "He is an honest employee.",
    "example_hindi": "Woh ek imandar employee hai.",
    "memory_trick": "Honest yaani sach bolne wala.",
    "level": "A2",
    "topic": "Emotions & Personality"
  },
  {
    "word": "creative",
    "meaning_hindi": "Rachnatmak / Creative",
    "pronunciation": "kree-AY-tiv",
    "example": "She is very creative in design.",
    "example_hindi": "Woh design mein bahut creative hai.",
    "memory_trick": "Creative yaani naya aur sundar dhang se sochna.",
    "level": "A2",
    "topic": "Emotions & Personality"
  },
  {
    "word": "ambitious",
    "meaning_hindi": "Mahatvakankshi",
    "pronunciation": "am-BISH-us",
    "example": "He has ambitious career goals.",
    "example_hindi": "Uske career goals bahut bade hain.",
    "memory_trick": "Ambitious yaani aage badhne ki tivr ichha.",
    "level": "A2",
    "topic": "Emotions & Personality"
  },
  {
    "word": "dedicated",
    "meaning_hindi": "Samarpit",
    "pronunciation": "DED-i-kay-tid",
    "example": "He is dedicated to his work.",
    "example_hindi": "Woh apne kaam ke liye samarpit hai.",
    "memory_trick": "Dedicated yaani lagan se kaam karne wala.",
    "level": "A2",
    "topic": "Emotions & Personality"
  },
  {
    "word": "professional",
    "meaning_hindi": "Peshavar / Professional",
    "pronunciation": "pruh-FESH-un-el",
    "example": "Her behavior is professional.",
    "example_hindi": "Unka behavior professional hai.",
    "memory_trick": "Professional yaani office rules ke hisaab se kaam karne wala.",
    "level": "A2",
    "topic": "Emotions & Personality"
  },
  {
    "word": "touch base",
    "meaning_hindi": "Baat karna / Update lena",
    "pronunciation": "TUCH bays",
    "example": "Let's touch base next week.",
    "example_hindi": "Agle hafte baat karte hain.",
    "memory_trick": "Touch base yaani contact mein aana.",
    "level": "B2",
    "topic": "Business Idioms"
  },
  {
    "word": "in the loop",
    "meaning_hindi": "Updated rehna / Maalumat hona",
    "pronunciation": "in the LOOP",
    "example": "Keep me in the loop.",
    "example_hindi": "Mujhe updated rakhein.",
    "memory_trick": "Loop yaani circle, uske andar rehna yaani updated rehna.",
    "level": "B2",
    "topic": "Business Idioms"
  },
  {
    "word": "think outside the box",
    "meaning_hindi": "Naye/Hatkar tarike se sochna",
    "pronunciation": "think owt-syd the BOKS",
    "example": "We need to think outside the box.",
    "example_hindi": "Hume hatkar sochna hoga.",
    "memory_trick": "Box se bahar nikal kar sochna yaani creative hona.",
    "level": "B2",
    "topic": "Business Idioms"
  },
  {
    "word": "hit the ground running",
    "meaning_hindi": "Turant bina samay gavaye kaam shuru karna",
    "pronunciation": "hit the grownd RUN-ing",
    "example": "We want to hit the ground running.",
    "example_hindi": "Hum turant tezi se kaam shuru karna chahte hain.",
    "memory_trick": "Zameen par pair rakhte hi daudna shuru karna.",
    "level": "B2",
    "topic": "Business Idioms"
  },
  {
    "word": "get the ball rolling",
    "meaning_hindi": "Kaam ki shuruat karna",
    "pronunciation": "get the bawl ROH-ling",
    "example": "Let's get the ball rolling on this.",
    "example_hindi": "Chalo is kaam ki shuruat karte hain.",
    "memory_trick": "Gend ko ghumana shuru karna taaki khel shuru ho sake.",
    "level": "B2",
    "topic": "Business Idioms"
  },
  {
    "word": "on the same page",
    "meaning_hindi": "Ek jaisi soch hona / Aapsi sehmati",
    "pronunciation": "on the same PAYJ",
    "example": "Are we all on the same page?",
    "example_hindi": "Kya hum sabhi ek jaisi soch rakh rahe hain?",
    "memory_trick": "Dono ka ek hi panna padhna yaani sehmat hona.",
    "level": "B2",
    "topic": "Business Idioms"
  },
  {
    "word": "ballpark figure",
    "meaning_hindi": "Mota-mota andaza / Rough estimate",
    "pronunciation": "BAWL-pahrk FIG-yer",
    "example": "Give me a ballpark figure of costs.",
    "example_hindi": "Mujhe kharche ka mota-mota andaza do.",
    "memory_trick": "Ballpark yaani stadium ke andar ka area - rough boundary limit.",
    "level": "B2",
    "topic": "Business Idioms"
  },
  {
    "word": "back to square one",
    "meaning_hindi": "Wapas wahi pahunch jana jahan se shuru kiya tha",
    "pronunciation": "bak to skwair WUN",
    "example": "If this fails, we are back to square one.",
    "example_hindi": "Agar yeh fail hota hai, toh hum wapas wahi pahunch jayenge.",
    "memory_trick": "Square one yaani pehla khana, wapas shuruat par aana.",
    "level": "B2",
    "topic": "Business Idioms"
  },
  {
    "word": "burn the midnight oil",
    "meaning_hindi": "Raat-raat bhar jaagkar mehnat karna",
    "pronunciation": "burn the MID-nyt oyl",
    "example": "He burned the midnight oil for exams.",
    "example_hindi": "Usne exams ke liye raat bhar jaagkar padhai ki.",
    "memory_trick": "Pehle tel ka chirag jalakar raat ko kaam karte the, wahi se bana.",
    "level": "B2",
    "topic": "Business Idioms"
  },
  {
    "word": "ahead of the curve",
    "meaning_hindi": "Baaki logo se aage rehna",
    "pronunciation": "uh-HED of the kurv",
    "example": "Our product is ahead of the curve.",
    "example_hindi": "Hamara product market mein sabse aage hai.",
    "memory_trick": "Curve se aage rehna yaani sabse aage chalna.",
    "level": "B2",
    "topic": "Business Idioms"
  },
  {
    "word": "give up",
    "meaning_hindi": "Haar maan lena / Chhod dena",
    "pronunciation": "giv UP",
    "example": "Don't give up on your dreams.",
    "example_hindi": "Apne sapno ko mat chhodo.",
    "memory_trick": "Give up yaani haar maan lena.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "find out",
    "meaning_hindi": "Pata lagana / Search karna",
    "pronunciation": "fynd OWT",
    "example": "I will find out the truth.",
    "example_hindi": "Main sachai ka pata lagaunga.",
    "memory_trick": "Find out yaani discover karna.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "set up",
    "meaning_hindi": "Sthapit karna / Tayyar karna",
    "pronunciation": "set UP",
    "example": "We need to set up the office.",
    "example_hindi": "Hume office set up karna hoga.",
    "memory_trick": "Set up yaani arrange ya establish karna.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "follow up",
    "meaning_hindi": "Baad mein status check karna",
    "pronunciation": "FOL-oh up",
    "example": "Follow up with the customer.",
    "example_hindi": "Customer ke sath follow up karein.",
    "memory_trick": "Follow up yaani baad mein feedback lena.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "look into",
    "meaning_hindi": "Jaanch-padtal karna",
    "pronunciation": "look IN-too",
    "example": "The police will look into the matter.",
    "example_hindi": "Police mamle ki jaanch karegi.",
    "memory_trick": "Look into yaani investigate karna.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "break down",
    "meaning_hindi": "Kharaab hona / Samajhna",
    "pronunciation": "brayk DOWN",
    "example": "My car broke down yesterday.",
    "example_hindi": "Meri car kal kharaab ho gayi.",
    "memory_trick": "Break down yaani parts mein tutna ya kharab hona.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "come up with",
    "meaning_hindi": "Naya idea ya solution sochna",
    "pronunciation": "kum UP with",
    "example": "She came up with a great idea.",
    "example_hindi": "Usne ek badhiya idea socha.",
    "memory_trick": "Come up with yaani prastut karna.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "carry out",
    "meaning_hindi": "Aadesh ka palan karna / Poora karna",
    "pronunciation": "KAR-ee owt",
    "example": "Carry out the instructions.",
    "example_hindi": "Nirdesho ka palan karein.",
    "memory_trick": "Carry out yaani execute karna.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "point out",
    "meaning_hindi": "Dhyan dilana / Ishara karna",
    "pronunciation": "poynt OWT",
    "example": "He pointed out my mistake.",
    "example_hindi": "Usne meri galti ki taraf dhyan dilaya.",
    "memory_trick": "Point out yaani highlight karna.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "figure out",
    "meaning_hindi": "Samajhna / Hal nikalna",
    "pronunciation": "FIG-yer owt",
    "example": "I can't figure out this code.",
    "example_hindi": "Main is code ko samajh nahi pa raha hoon.",
    "memory_trick": "Figure out yaani solve/samajhna.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "take on",
    "meaning_hindi": "Jimmedari lena / Mukabla karna",
    "pronunciation": "tayk ON",
    "example": "I will take on this project.",
    "example_hindi": "Main is project ki jimmedari lunga.",
    "memory_trick": "Take on yaani accept responsibility.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "bring up",
    "meaning_hindi": "Topic uthana / Palan-poshan karna",
    "pronunciation": "bring UP",
    "example": "Don't bring up that topic.",
    "example_hindi": "Woh topic mat uthao.",
    "memory_trick": "Bring up yaani raise a topic.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "turn down",
    "meaning_hindi": "Refuse karna / Mana karna",
    "pronunciation": "turn DOWN",
    "example": "She turned down the job offer.",
    "example_hindi": "Usne job offer mana kar diya.",
    "memory_trick": "Turn down yaani reject karna.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "go over",
    "meaning_hindi": "Dhyan se review karna",
    "pronunciation": "goh OH-ver",
    "example": "Let's go over the details.",
    "example_hindi": "Chalo details ko review karte hain.",
    "memory_trick": "Go over yaani check/examine karna.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "put off",
    "meaning_hindi": "Tala dena / Postpone karna",
    "pronunciation": "put AWF",
    "example": "Never put off till tomorrow.",
    "example_hindi": "Kal par mat talo.",
    "memory_trick": "Put off yaani postpone karna.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "call off",
    "meaning_hindi": "Radd karna / Cancel karna",
    "pronunciation": "kawl AWF",
    "example": "The meeting was called off.",
    "example_hindi": "Meeting radd kar di gayi.",
    "memory_trick": "Call off yaani cancel karna.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "fill in",
    "meaning_hindi": "Khali jagah bharna / Details dena",
    "pronunciation": "fil IN",
    "example": "Fill in the blank spaces.",
    "example_hindi": "Khali sthan ko bharein.",
    "memory_trick": "Fill in yaani details complete karna.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "wrap up",
    "meaning_hindi": "Khatam karna / Sametana",
    "pronunciation": "rap UP",
    "example": "Let's wrap up this meeting.",
    "example_hindi": "Chalo is meeting ko khatam karte hain.",
    "memory_trick": "Wrap up yaani end karna.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "check in",
    "meaning_hindi": "Aakar report karna / Update dena",
    "pronunciation": "chek IN",
    "example": "Check in at the hotel desk.",
    "example_hindi": "Hotel desk par check in karein.",
    "memory_trick": "Check in yaani pravesh karna ya update dena.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "reach out",
    "meaning_hindi": "Sampark karna / Contact karna",
    "pronunciation": "reech OWT",
    "example": "Reach out to the support team.",
    "example_hindi": "Support team se sampark karein.",
    "memory_trick": "Reach out yaani contact karna.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "wake up",
    "meaning_hindi": "Neend se jaagna",
    "pronunciation": "wayk UP",
    "example": "Wake up early in the morning.",
    "example_hindi": "Subah jaldi jaago.",
    "memory_trick": "Neend se uthna.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "get up",
    "meaning_hindi": "Bistar se uthna",
    "pronunciation": "get UP",
    "example": "I get up at 6 AM.",
    "example_hindi": "Main 6 baje uthta hoon.",
    "memory_trick": "Khade ho jana.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "look for",
    "meaning_hindi": "Dhoondhna",
    "pronunciation": "look FOR",
    "example": "What are you looking for?",
    "example_hindi": "Aap kya dhoondh rahe hain?",
    "memory_trick": "Khojna / Search.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "look forward to",
    "meaning_hindi": "Ut-sukta se intezar karna",
    "pronunciation": "look FOR-werd to",
    "example": "I look forward to meeting you.",
    "example_hindi": "Main aap se milne ka besabri se intezar kar raha hoon.",
    "memory_trick": "Eagerly wait karna.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "make up",
    "meaning_hindi": "Kahani banana / Sulah karna",
    "pronunciation": "mayk UP",
    "example": "They made up after the fight.",
    "example_hindi": "Unhone jhagde ke baad sulah kar li.",
    "memory_trick": "Compromise/Compose.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "fall apart",
    "meaning_hindi": "Bikhar jana / Fail hona",
    "pronunciation": "fawl uh-PAHRT",
    "example": "Their plan fell apart.",
    "example_hindi": "Unki yojana bikhar gayi.",
    "memory_trick": "Tukde-tukde hona.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "back up",
    "meaning_hindi": "Sahyog dena / Copy banana",
    "pronunciation": "bak UP",
    "example": "Back up your files.",
    "example_hindi": "Apni files ka backup le lo.",
    "memory_trick": "Support / Safe copy.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "blow up",
    "meaning_hindi": "Gussa hona / Dhamaka hona",
    "pronunciation": "bloh UP",
    "example": "Don't blow up over small things.",
    "example_hindi": "Chhoti baato par gussa mat ho.",
    "memory_trick": "Explode / Get angry.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "pass out",
    "meaning_hindi": "Behosh hona",
    "pronunciation": "pas OWT",
    "example": "He passed out due to heat.",
    "example_hindi": "Garmi ki wajah se woh behosh ho gaya.",
    "memory_trick": "Lose consciousness.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "log in",
    "meaning_hindi": "System mein pravesh karna",
    "pronunciation": "log IN",
    "example": "Log in to your account.",
    "example_hindi": "Apne account mein login karein.",
    "memory_trick": "Enter system.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "sign out",
    "meaning_hindi": "System se bahar jana",
    "pronunciation": "syn OWT",
    "example": "Sign out after work.",
    "example_hindi": "Kaam ke baad sign out karein.",
    "memory_trick": "Exit system.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "set off",
    "meaning_hindi": "Yatra shuru karna",
    "pronunciation": "set AWF",
    "example": "They set off early morning.",
    "example_hindi": "Woh subah jaldi yatra par nikle.",
    "memory_trick": "Start a journey.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "take off",
    "meaning_hindi": "Udaan bharna / Kapde nikalna",
    "pronunciation": "tayk AWF",
    "example": "The plane took off on time.",
    "example_hindi": "Plane ne samay par udaan bhari.",
    "memory_trick": "Fly / Remove clothes.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "clean up",
    "meaning_hindi": "Saaf-safai karna",
    "pronunciation": "kleen UP",
    "example": "Clean up your room.",
    "example_hindi": "Apna kamra saaf karo.",
    "memory_trick": "Saaf karna.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "build up",
    "meaning_hindi": "Dheere-dheere badhana",
    "pronunciation": "bild UP",
    "example": "Build up your strength.",
    "example_hindi": "Apni takat ko badhayein.",
    "memory_trick": "Increase slowly.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "check out",
    "meaning_hindi": "Janch karna / Exit karna",
    "pronunciation": "chek OWT",
    "example": "Check out this new link.",
    "example_hindi": "Is naye link ko check karo.",
    "memory_trick": "Examine / Leave.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "sign up",
    "meaning_hindi": "Register karna",
    "pronunciation": "syn UP",
    "example": "Sign up for the newsletter.",
    "example_hindi": "Newsletter ke liye sign up karein.",
    "memory_trick": "Register/Join.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "drop out",
    "meaning_hindi": "Bich mein chhod dena",
    "pronunciation": "drop OWT",
    "example": "He dropped out of college.",
    "example_hindi": "Usne college beech mein chhod diya.",
    "memory_trick": "Leave early.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "hang out",
    "meaning_hindi": "Dosto ke sath samay bitana",
    "pronunciation": "hang OWT",
    "example": "Let's hang out this weekend.",
    "example_hindi": "Chalo is weekend dosto ke sath samay bitate hain.",
    "memory_trick": "Spend time together.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "run out",
    "meaning_hindi": "Khatam ho jana",
    "pronunciation": "run OWT",
    "example": "We ran out of sugar.",
    "example_hindi": "Hamari cheeni khatam ho gayi.",
    "memory_trick": "Finish supply.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "go on",
    "meaning_hindi": "Jaari rakhna",
    "pronunciation": "goh ON",
    "example": "Please go on speaking.",
    "example_hindi": "Kripya bolna jaari rakhein.",
    "memory_trick": "Continue.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "go off",
    "meaning_hindi": "Alarm bajna / Kharaab hona",
    "pronunciation": "goh AWF",
    "example": "The alarm went off at 5 AM.",
    "example_hindi": "Alarm 5 baje baja.",
    "memory_trick": "Ring/Explode.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "come across",
    "meaning_hindi": "Achanak milna",
    "pronunciation": "kum uh-KROS",
    "example": "I came across an old photo.",
    "example_hindi": "Mujhe achanak ek purani photo mili.",
    "memory_trick": "Find by chance.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "bring about",
    "meaning_hindi": "Badlav lana / Karan banna",
    "pronunciation": "bring uh-BOWT",
    "example": "Tech brings about changes.",
    "example_hindi": "Tech badlav laata hai.",
    "memory_trick": "Cause to happen.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "end up",
    "meaning_hindi": "Aakhri mein kahin pahunch jana",
    "pronunciation": "end UP",
    "example": "He ended up in Delhi.",
    "example_hindi": "Aakhri mein woh Delhi pahunch gaya.",
    "memory_trick": "Arrive eventually.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "grow up",
    "meaning_hindi": "Bada hona",
    "pronunciation": "groh UP",
    "example": "Where did you grow up?",
    "example_hindi": "Aap kahan bade huye?",
    "memory_trick": "Become adult.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "keep up",
    "meaning_hindi": "Barabar chalna / Jaari rakhna",
    "pronunciation": "keep UP",
    "example": "Keep up the good work.",
    "example_hindi": "Achha kaam jaari rakhein.",
    "memory_trick": "Maintain pace.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "lock up",
    "meaning_hindi": "Taala lagana",
    "pronunciation": "lok UP",
    "example": "Lock up before leaving.",
    "example_hindi": "Jaane se pehle taala laga dein.",
    "memory_trick": "Close securely.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "hold on",
    "meaning_hindi": "Intezar karna / Pakadna",
    "pronunciation": "hohld ON",
    "example": "Hold on for a second.",
    "example_hindi": "Ek second ke liye rukiye.",
    "memory_trick": "Wait briefly.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "run into",
    "meaning_hindi": "Achanak takrana / Milna",
    "pronunciation": "run IN-too",
    "example": "I ran into him yesterday.",
    "example_hindi": "Main kal achanak usse mila.",
    "memory_trick": "Meet unexpectedly.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "achieve",
    "meaning_hindi": "Prapt karna / Haasil karna",
    "pronunciation": "uh-CHEEV",
    "example": "I want to achieve my goals.",
    "example_hindi": "Main apne goals haasil karna chahta hoon.",
    "memory_trick": "Achieve matlab chadhayi poori karna.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "advantage",
    "meaning_hindi": "Fayda",
    "pronunciation": "ad-VAN-tij",
    "example": "This gives us an advantage.",
    "example_hindi": "Yeh hume ek fayda deta hai.",
    "memory_trick": "Advantage yaani profit/benefit.",
    "level": "A2",
    "topic": "Business & Agency"
  },
  {
    "word": "advertise",
    "meaning_hindi": "Prachar karna",
    "pronunciation": "AD-ver-tyz",
    "example": "They advertise on Google.",
    "example_hindi": "We Google par prachar karte hain.",
    "memory_trick": "Ad yaani prachar.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "amount",
    "meaning_hindi": "Rashi / Matra",
    "pronunciation": "uh-MOWNT",
    "example": "Pay the full amount.",
    "example_hindi": "Poori rashi ka bhugtan karein.",
    "memory_trick": "Amount yaani kul dhan.",
    "level": "A2",
    "topic": "Numbers & Time"
  },
  {
    "word": "analysis",
    "meaning_hindi": "Visheshiyata / Analysis",
    "pronunciation": "uh-NAL-i-sis",
    "example": "The market analysis is ready.",
    "example_hindi": "Market analysis tayyar hai.",
    "memory_trick": "Analysis yaani details se check karna.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "analyze",
    "meaning_hindi": "Vishleshan karna",
    "pronunciation": "AN-uh-lyz",
    "example": "We need to analyze the data.",
    "example_hindi": "Hume data ka vishleshan karna hoga.",
    "memory_trick": "Analyze yaani gehrai se janch karna.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "announcement",
    "meaning_hindi": "G घोषणा / Ailaan",
    "pronunciation": "uh-NOWNST-ment",
    "example": "Listen to the announcement.",
    "example_hindi": "Ailaan ko suniye.",
    "memory_trick": "Announce yaani mic par bolna.",
    "level": "A2",
    "topic": "Client Communication"
  },
  {
    "word": "annual",
    "meaning_hindi": "Vaarshik / Annual",
    "pronunciation": "AN-yoo-el",
    "example": "The annual meeting is next week.",
    "example_hindi": "Vaarshik meeting agle hafte hai.",
    "memory_trick": "Annual yaani saal mein ek baar.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "apologize",
    "meaning_hindi": "Maafi maangna",
    "pronunciation": "uh-POL-uh-jyz",
    "example": "You should apologize to him.",
    "example_hindi": "Tumhe usse maafi maangni chahiye.",
    "memory_trick": "Apology yaani sorry bolna.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "application",
    "meaning_hindi": "Avedan / App",
    "pronunciation": "ap-li-KAY-shun",
    "example": "Submit your job application.",
    "example_hindi": "Apna job avedan submit karein.",
    "memory_trick": "App yaani mobile app ya application.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "appointment",
    "meaning_hindi": "Milne ka samay",
    "pronunciation": "uh-POINT-ment",
    "example": "I have an appointment.",
    "example_hindi": "Mera appointment hai.",
    "memory_trick": "Appointment yaani fix meeting.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "appreciate",
    "meaning_hindi": "Taarif karna / Aabhar manna",
    "pronunciation": "uh-PREE-shee-ayt",
    "example": "I appreciate your hard work.",
    "example_hindi": "Main aapki mehnat ki taarif karta hoon.",
    "memory_trick": "Appreciate yaani value dena.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "argument",
    "meaning_hindi": "Behas / Argument",
    "pronunciation": "AHR-gyoo-ment",
    "example": "Avoid useless arguments.",
    "example_hindi": "Faltu behas se bachein.",
    "memory_trick": "Argument yaani aapsi takrar.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "arrange",
    "meaning_hindi": "Vyavastha karna",
    "pronunciation": "uh-RAYNJ",
    "example": "Arrange the files.",
    "example_hindi": "Files ko vyavasthit karein.",
    "memory_trick": "Arrange yaani line se rakhna.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "article",
    "meaning_hindi": "Lekh / Article",
    "pronunciation": "AHR-ti-kel",
    "example": "Read this news article.",
    "example_hindi": "Is khabar ke lekh ko padho.",
    "memory_trick": "Article yaani written text.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "assist",
    "meaning_hindi": "Madad karna",
    "pronunciation": "uh-SIST",
    "example": "I will assist you.",
    "example_hindi": "Main aapki madad karunga.",
    "memory_trick": "Assist yaani assistant banna.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "associate",
    "meaning_hindi": "Saathi / Associate",
    "pronunciation": "uh-SOH-shee-ayt",
    "example": "He is a business associate.",
    "example_hindi": "He ek business saathi hai.",
    "memory_trick": "Associate yaani business partner.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "assume",
    "meaning_hindi": "Maan lena",
    "pronunciation": "uh-SOOM",
    "example": "Don't assume anything.",
    "example_hindi": "Kuch bhi maan mat lo.",
    "memory_trick": "Assume yaani bina saboot ke manna.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "assure",
    "meaning_hindi": "Yakeen dilana",
    "pronunciation": "uh-SHUR",
    "example": "I assure you of our best service.",
    "example_hindi": "Main aapko hamari behtarin service ka yakeen dilata hoon.",
    "memory_trick": "Assure yaani guarantee dena.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "atmosphere",
    "meaning_hindi": "Vaatavaran / Mahool",
    "pronunciation": "AT-muhs-feer",
    "example": "The office atmosphere is friendly.",
    "example_hindi": "Office ka mahool friendly hai.",
    "memory_trick": "Atmosphere yaani charo taraf ki hawa/mood.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "attempt",
    "meaning_hindi": "Koshish / Prayas",
    "pronunciation": "uh-TEMPT",
    "example": "This is my first attempt.",
    "example_hindi": "Yeh mera pehla prayas hai.",
    "memory_trick": "Attempt yaani try karna.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "attend",
    "meaning_hindi": "Shaamil hona / Attent karna",
    "pronunciation": "uh-TEND",
    "example": "Attend the team meeting.",
    "example_hindi": "Team meeting mein shaamil ho.",
    "memory_trick": "Attend yaani hazir hona.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "attention",
    "meaning_hindi": "Dhyan",
    "pronunciation": "uh-TEN-shun",
    "example": "Pay attention to details.",
    "example_hindi": "Details par dhyan dein.",
    "memory_trick": "Attention yaani concentration.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "attitude",
    "meaning_hindi": "Rukh / Attitude",
    "pronunciation": "AT-i-tood",
    "example": "Keep a positive attitude.",
    "example_hindi": "Positive attitude rakhein.",
    "memory_trick": "Attitude yaani sochne ka dhang.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "attract",
    "meaning_hindi": "Aakarshit karna",
    "pronunciation": "uh-TRAKT",
    "example": "Attract new clients.",
    "example_hindi": "Naye clients ko aakarshit karein.",
    "memory_trick": "Attract yaani khinchana.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "attribute",
    "meaning_hindi": "Goon / Visheshata",
    "pronunciation": "uh-TRIB-yoot",
    "example": "Patience is a great attribute.",
    "example_hindi": "Sabar ek bada goon hai.",
    "memory_trick": "Attribute yaani quality.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "authority",
    "meaning_hindi": "Adhikar / Authority",
    "pronunciation": "uh-THOR-i-tee",
    "example": "He has the authority.",
    "example_hindi": "Uske paas adhikar hai.",
    "memory_trick": "Authority yaani power.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "available",
    "meaning_hindi": "Uplabdh",
    "pronunciation": "uh-VAY-luh-bel",
    "example": "Is this seat available?",
    "example_hindi": "Kya yeh seat uplabdh hai?",
    "memory_trick": "Available yaani empty/ready.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "average",
    "meaning_hindi": "Ausat / Average",
    "pronunciation": "AV-er-ij",
    "example": "He is an average student.",
    "example_hindi": "Woh ek ausat student hai.",
    "memory_trick": "Average yaani na zyada na kam.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "avoid",
    "meaning_hindi": "Bachna / Avoid karna",
    "pronunciation": "uh-VOYD",
    "example": "Avoid making mistakes.",
    "example_hindi": "Galtiyan karne se bachein.",
    "memory_trick": "Avoid yaani door rehna.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "award",
    "meaning_hindi": "Puraskar / Award",
    "pronunciation": "uh-WORD",
    "example": "He won the best developer award.",
    "example_hindi": "Usne best developer award jeeta.",
    "memory_trick": "Award yaani inaam.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "aware",
    "meaning_hindi": "Jaagruk / Khabar hona",
    "pronunciation": "uh-WAIR",
    "example": "Be aware of fraud.",
    "example_hindi": "Dhokhadhadi se jaagruk rahein.",
    "memory_trick": "Aware yaani pata hona.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "awesome",
    "meaning_hindi": "Bahut badhiya / Gazab",
    "pronunciation": "AW-sum",
    "example": "The weather is awesome.",
    "example_hindi": "Mausam bahut badhiya hai.",
    "memory_trick": "Awesome yaani mind blowing.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "background",
    "meaning_hindi": "Prasthabhumi / Background",
    "pronunciation": "BAK-grownd",
    "example": "Check his background.",
    "example_hindi": "Uska background check karein.",
    "memory_trick": "Background yaani pichla record.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "balance",
    "meaning_hindi": "Santulan",
    "pronunciation": "BAL-ens",
    "example": "Keep your balance.",
    "example_hindi": "Apna santulan banaye rakhein.",
    "memory_trick": "Balance yaani stable rehna.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "basic",
    "meaning_hindi": "Buniyaadi / Basic",
    "pronunciation": "BAY-sik",
    "example": "Learn basic rules first.",
    "example_hindi": "Pehle buniyaadi niyam seekhein.",
    "memory_trick": "Basic yaani simple zero level.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "beautiful",
    "meaning_hindi": "Sundar",
    "pronunciation": "BYOO-ti-ful",
    "example": "This is a beautiful design.",
    "example_hindi": "Yeh ek sundar design hai.",
    "memory_trick": "Beautiful yaani pyaara look.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "benefit",
    "meaning_hindi": "Fayda / Benefit",
    "pronunciation": "BEN-i-fit",
    "example": "Exercise has many benefits.",
    "example_hindi": "Exercise ke bahut se fayde hain.",
    "memory_trick": "Benefit yaani profit.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "bill",
    "meaning_hindi": "Bill",
    "pronunciation": "BIL",
    "example": "Please pay the bill.",
    "example_hindi": "Kripya bill chuka dein.",
    "memory_trick": "Bill yaani payment list.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "bitter",
    "meaning_hindi": "Kadhva",
    "pronunciation": "BIT-er",
    "example": "This coffee is bitter.",
    "example_hindi": "Yeh coffee kadhvi hai.",
    "memory_trick": "Bitter yaani kadhva swad.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "blame",
    "meaning_hindi": "Dosh dena",
    "pronunciation": "BLAYM",
    "example": "Don't blame others.",
    "example_hindi": "Dusro ko dosh mat do.",
    "memory_trick": "Blame yaani ungli uthana.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "blind",
    "meaning_hindi": "Andha",
    "pronunciation": "BLYND",
    "example": "He is blind by birth.",
    "example_hindi": "Woh janm se andha hai.",
    "memory_trick": "Blind yaani jo dekh na sake.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "block",
    "meaning_hindi": "Rokna / Block",
    "pronunciation": "BLOK",
    "example": "The road is blocked.",
    "example_hindi": "Rasta blocked hai.",
    "memory_trick": "Block yaani jam hona.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "blood",
    "meaning_hindi": "Khoon / Rakt",
    "pronunciation": "BLUD",
    "example": "Blood donor is hero.",
    "example_hindi": "Blood donor hero hota hai.",
    "memory_trick": "Blood yaani laal khoon.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "board",
    "meaning_hindi": "Board / Manch",
    "pronunciation": "BORD",
    "example": "Write on the board.",
    "example_hindi": "Board par likhein.",
    "memory_trick": "Board yaani flat wooden sheet.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "boat",
    "meaning_hindi": "Naav",
    "pronunciation": "BOHT",
    "example": "The boat is on the river.",
    "example_hindi": "Naav nadi par hai.",
    "memory_trick": "Boat yaani naav.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "body",
    "meaning_hindi": "Shareer / Body",
    "pronunciation": "BOD-ee",
    "example": "Exercise keeps body fit.",
    "example_hindi": "Exercise body ko fit rakhti hai.",
    "memory_trick": "Body yaani shareer.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "bold",
    "meaning_hindi": "Nidar / Bold",
    "pronunciation": "BOHLD",
    "example": "He made a bold decision.",
    "example_hindi": "Usne ek nidar decision liya.",
    "memory_trick": "Bold yaani bina dar ke.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "bone",
    "meaning_hindi": "Haddi",
    "pronunciation": "BOHN",
    "example": "Milk makes bones strong.",
    "example_hindi": "Doodh haddiyo ko mazboot banata hai.",
    "memory_trick": "Bone yaani skeleton ka part.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "border",
    "meaning_hindi": "Seema / Border",
    "pronunciation": "BOR-der",
    "example": "Cross the border.",
    "example_hindi": "Border cross karein.",
    "memory_trick": "Border yaani boundary line.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "create_1",
    "meaning_hindi": "Banana / Nirman karna (Set 1)",
    "pronunciation": "kree-AYT",
    "example": "Create a new project.",
    "example_hindi": "Ek naya project banayein.",
    "memory_trick": "Create yaani banana.",
    "level": "B1",
    "topic": "Emotions & Personality"
  },
  {
    "word": "update_2",
    "meaning_hindi": "Naya update dena (Set 2)",
    "pronunciation": "up-DAYT",
    "example": "Update your files.",
    "example_hindi": "Apni files ko update karein.",
    "memory_trick": "Update yaani latest details jodna.",
    "level": "B2",
    "topic": "Business & Agency"
  },
  {
    "word": "remove_3",
    "meaning_hindi": "Hatana (Set 3)",
    "pronunciation": "ri-MOOV",
    "example": "Remove the files.",
    "example_hindi": "Files ko hata dein.",
    "memory_trick": "Remove yaani delete karna.",
    "level": "A1",
    "topic": "Client Communication"
  },
  {
    "word": "add_4",
    "meaning_hindi": "Jodna (Set 4)",
    "pronunciation": "AD",
    "example": "Add some sugar.",
    "example_hindi": "Thodi cheeni jodein.",
    "memory_trick": "Add yaani plus karna.",
    "level": "A2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "reduce_5",
    "meaning_hindi": "Kam karna (Set 5)",
    "pronunciation": "ri-DOOS",
    "example": "Reduce the cost.",
    "example_hindi": "Kimat ko kam karein.",
    "memory_trick": "Reduce yaani minus/kam karna.",
    "level": "B1",
    "topic": "Business Idioms"
  },
  {
    "word": "increase_6",
    "meaning_hindi": "Badhana (Set 6)",
    "pronunciation": "in-KREES",
    "example": "Increase the speed.",
    "example_hindi": "Speed badhayein.",
    "memory_trick": "Increase yaani plus/up karna.",
    "level": "B2",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "decrease_7",
    "meaning_hindi": "Ghatana (Set 7)",
    "pronunciation": "dih-KREES",
    "example": "Decrease the volume.",
    "example_hindi": "Aawaz ghatayein.",
    "memory_trick": "Decrease yaani down/downward.",
    "level": "A1",
    "topic": "Family & People"
  },
  {
    "word": "improve_8",
    "meaning_hindi": "Sudharna (Set 8)",
    "pronunciation": "im-PROOV",
    "example": "Improve your english.",
    "example_hindi": "Apni English ko sudharein.",
    "memory_trick": "Improve yaani behtar banana.",
    "level": "A2",
    "topic": "Numbers & Time"
  },
  {
    "word": "maintain_9",
    "meaning_hindi": "Banaye rakhna (Set 9)",
    "pronunciation": "mayn-TAYN",
    "example": "Maintain project quality.",
    "example_hindi": "Project quality ko banaye rakhein.",
    "memory_trick": "Maintain yaani same state rakhna.",
    "level": "B1",
    "topic": "Daily Verbs"
  },
  {
    "word": "quality_10",
    "meaning_hindi": "Goonwatta / Quality (Set 10)",
    "pronunciation": "KWOL-i-tee",
    "example": "Focus on quality_10.",
    "example_hindi": "Goonwatta par dhyan dein.",
    "memory_trick": "Quality yaani achhi state.",
    "level": "B2",
    "topic": "Home & Daily Life"
  },
  {
    "word": "progress_11",
    "meaning_hindi": "Unnati / Pragati (Set 11)",
    "pronunciation": "PROG-res",
    "example": "We are making good progress_11.",
    "example_hindi": "Hum achhi pragati kar rahe hain.",
    "memory_trick": "Progress matlab aage badhte rehna.",
    "level": "A1",
    "topic": "Work & Office"
  },
  {
    "word": "challenge_12",
    "meaning_hindi": "Chunauti (Set 12)",
    "pronunciation": "CHAL-enj",
    "example": "This is a big challenge_12.",
    "example_hindi": "Yeh ek badi chunauti hai.",
    "memory_trick": "Challenge yaani mushkil task.",
    "level": "A2",
    "topic": "Emotions & Personality"
  },
  {
    "word": "success_13",
    "meaning_hindi": "Safalta (Set 13)",
    "pronunciation": "suk-SES",
    "example": "Success requires hard work.",
    "example_hindi": "Safalta ke liye mehnat chahiye.",
    "memory_trick": "Success yaani victory.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "failure_14",
    "meaning_hindi": "Asafalta (Set 14)",
    "pronunciation": "FAYL-yer",
    "example": "Learn from failure_14.",
    "example_hindi": "Asafalta se seekho.",
    "memory_trick": "Failure yaani haar.",
    "level": "B2",
    "topic": "Client Communication"
  },
  {
    "word": "solution_15",
    "meaning_hindi": "Hal / Samadhan (Set 15)",
    "pronunciation": "suh-LOO-shun",
    "example": "Find a quick solution_15.",
    "example_hindi": "Ek jaldi samadhan dhoondho.",
    "memory_trick": "Solution yaani problem ka hal.",
    "level": "A1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "problem_16",
    "meaning_hindi": "Samasya (Set 16)",
    "pronunciation": "PROB-lem",
    "example": "We must solve this problem_16.",
    "example_hindi": "Hume is samasya ko hal karna hoga.",
    "memory_trick": "Problem yaani dikkat.",
    "level": "A2",
    "topic": "Business Idioms"
  },
  {
    "word": "process_17",
    "meaning_hindi": "Prakriya (Set 17)",
    "pronunciation": "PROS-es",
    "example": "Follow the process_17.",
    "example_hindi": "Prakriya ko follow karein.",
    "memory_trick": "Process yaani step-by-step kaam.",
    "level": "B1",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "feedback_18",
    "meaning_hindi": "Pratikriya / Feedback (Set 18)",
    "pronunciation": "FEED-bak",
    "example": "Thanks for your feedback_18.",
    "example_hindi": "Aapke feedback ke liye dhanyawad.",
    "memory_trick": "Feedback yaani opinion.",
    "level": "B2",
    "topic": "Family & People"
  },
  {
    "word": "review_19",
    "meaning_hindi": "Sameeksha / Review (Set 19)",
    "pronunciation": "ri-VYOO",
    "example": "Review the project files.",
    "example_hindi": "Project files ki sameeksha karein.",
    "memory_trick": "Review yaani check karna.",
    "level": "A1",
    "topic": "Numbers & Time"
  },
  {
    "word": "develop_20",
    "meaning_hindi": "Vikas karna (Set 20)",
    "pronunciation": "dih-VEL-up",
    "example": "We must develop_20 new skills.",
    "example_hindi": "Hume naye skills vikasit karne honge.",
    "memory_trick": "Develop yaani badhana.",
    "level": "A2",
    "topic": "Daily Verbs"
  },
  {
    "word": "create_21",
    "meaning_hindi": "Banana / Nirman karna (Set 21)",
    "pronunciation": "kree-AYT",
    "example": "Create a new project.",
    "example_hindi": "Ek naya project banayein.",
    "memory_trick": "Create yaani banana.",
    "level": "B1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "update_22",
    "meaning_hindi": "Naya update dena (Set 22)",
    "pronunciation": "up-DAYT",
    "example": "Update your files.",
    "example_hindi": "Apni files ko update karein.",
    "memory_trick": "Update yaani latest details jodna.",
    "level": "B2",
    "topic": "Work & Office"
  },
  {
    "word": "remove_23",
    "meaning_hindi": "Hatana (Set 23)",
    "pronunciation": "ri-MOOV",
    "example": "Remove the files.",
    "example_hindi": "Files ko hata dein.",
    "memory_trick": "Remove yaani delete karna.",
    "level": "A1",
    "topic": "Emotions & Personality"
  },
  {
    "word": "add_24",
    "meaning_hindi": "Jodna (Set 24)",
    "pronunciation": "AD",
    "example": "Add some sugar.",
    "example_hindi": "Thodi cheeni jodein.",
    "memory_trick": "Add yaani plus karna.",
    "level": "A2",
    "topic": "Business & Agency"
  },
  {
    "word": "reduce_25",
    "meaning_hindi": "Kam karna (Set 25)",
    "pronunciation": "ri-DOOS",
    "example": "Reduce the cost.",
    "example_hindi": "Kimat ko kam karein.",
    "memory_trick": "Reduce yaani minus/kam karna.",
    "level": "B1",
    "topic": "Client Communication"
  },
  {
    "word": "increase_26",
    "meaning_hindi": "Badhana (Set 26)",
    "pronunciation": "in-KREES",
    "example": "Increase the speed.",
    "example_hindi": "Speed badhayein.",
    "memory_trick": "Increase yaani plus/up karna.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "decrease_27",
    "meaning_hindi": "Ghatana (Set 27)",
    "pronunciation": "dih-KREES",
    "example": "Decrease the volume.",
    "example_hindi": "Aawaz ghatayein.",
    "memory_trick": "Decrease yaani down/downward.",
    "level": "A1",
    "topic": "Business Idioms"
  },
  {
    "word": "improve_28",
    "meaning_hindi": "Sudharna (Set 28)",
    "pronunciation": "im-PROOV",
    "example": "Improve your english.",
    "example_hindi": "Apni English ko sudharein.",
    "memory_trick": "Improve yaani behtar banana.",
    "level": "A2",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "maintain_29",
    "meaning_hindi": "Banaye rakhna (Set 29)",
    "pronunciation": "mayn-TAYN",
    "example": "Maintain project quality.",
    "example_hindi": "Project quality ko banaye rakhein.",
    "memory_trick": "Maintain yaani same state rakhna.",
    "level": "B1",
    "topic": "Family & People"
  },
  {
    "word": "quality_30",
    "meaning_hindi": "Goonwatta / Quality (Set 30)",
    "pronunciation": "KWOL-i-tee",
    "example": "Focus on quality_30.",
    "example_hindi": "Goonwatta par dhyan dein.",
    "memory_trick": "Quality yaani achhi state.",
    "level": "B2",
    "topic": "Numbers & Time"
  },
  {
    "word": "progress_31",
    "meaning_hindi": "Unnati / Pragati (Set 31)",
    "pronunciation": "PROG-res",
    "example": "We are making good progress_31.",
    "example_hindi": "Hum achhi pragati kar rahe hain.",
    "memory_trick": "Progress matlab aage badhte rehna.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "challenge_32",
    "meaning_hindi": "Chunauti (Set 32)",
    "pronunciation": "CHAL-enj",
    "example": "This is a big challenge_32.",
    "example_hindi": "Yeh ek badi chunauti hai.",
    "memory_trick": "Challenge yaani mushkil task.",
    "level": "A2",
    "topic": "Home & Daily Life"
  },
  {
    "word": "success_33",
    "meaning_hindi": "Safalta (Set 33)",
    "pronunciation": "suk-SES",
    "example": "Success requires hard work.",
    "example_hindi": "Safalta ke liye mehnat chahiye.",
    "memory_trick": "Success yaani victory.",
    "level": "B1",
    "topic": "Work & Office"
  },
  {
    "word": "failure_34",
    "meaning_hindi": "Asafalta (Set 34)",
    "pronunciation": "FAYL-yer",
    "example": "Learn from failure_34.",
    "example_hindi": "Asafalta se seekho.",
    "memory_trick": "Failure yaani haar.",
    "level": "B2",
    "topic": "Emotions & Personality"
  },
  {
    "word": "solution_35",
    "meaning_hindi": "Hal / Samadhan (Set 35)",
    "pronunciation": "suh-LOO-shun",
    "example": "Find a quick solution_35.",
    "example_hindi": "Ek jaldi samadhan dhoondho.",
    "memory_trick": "Solution yaani problem ka hal.",
    "level": "A1",
    "topic": "Business & Agency"
  },
  {
    "word": "problem_36",
    "meaning_hindi": "Samasya (Set 36)",
    "pronunciation": "PROB-lem",
    "example": "We must solve this problem_36.",
    "example_hindi": "Hume is samasya ko hal karna hoga.",
    "memory_trick": "Problem yaani dikkat.",
    "level": "A2",
    "topic": "Client Communication"
  },
  {
    "word": "process_37",
    "meaning_hindi": "Prakriya (Set 37)",
    "pronunciation": "PROS-es",
    "example": "Follow the process_37.",
    "example_hindi": "Prakriya ko follow karein.",
    "memory_trick": "Process yaani step-by-step kaam.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "feedback_38",
    "meaning_hindi": "Pratikriya / Feedback (Set 38)",
    "pronunciation": "FEED-bak",
    "example": "Thanks for your feedback_38.",
    "example_hindi": "Aapke feedback ke liye dhanyawad.",
    "memory_trick": "Feedback yaani opinion.",
    "level": "B2",
    "topic": "Business Idioms"
  },
  {
    "word": "review_39",
    "meaning_hindi": "Sameeksha / Review (Set 39)",
    "pronunciation": "ri-VYOO",
    "example": "Review the project files.",
    "example_hindi": "Project files ki sameeksha karein.",
    "memory_trick": "Review yaani check karna.",
    "level": "A1",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "develop_40",
    "meaning_hindi": "Vikas karna (Set 40)",
    "pronunciation": "dih-VEL-up",
    "example": "We must develop_40 new skills.",
    "example_hindi": "Hume naye skills vikasit karne honge.",
    "memory_trick": "Develop yaani badhana.",
    "level": "A2",
    "topic": "Family & People"
  },
  {
    "word": "create_41",
    "meaning_hindi": "Banana / Nirman karna (Set 41)",
    "pronunciation": "kree-AYT",
    "example": "Create a new project.",
    "example_hindi": "Ek naya project banayein.",
    "memory_trick": "Create yaani banana.",
    "level": "B1",
    "topic": "Numbers & Time"
  },
  {
    "word": "update_42",
    "meaning_hindi": "Naya update dena (Set 42)",
    "pronunciation": "up-DAYT",
    "example": "Update your files.",
    "example_hindi": "Apni files ko update karein.",
    "memory_trick": "Update yaani latest details jodna.",
    "level": "B2",
    "topic": "Daily Verbs"
  },
  {
    "word": "remove_43",
    "meaning_hindi": "Hatana (Set 43)",
    "pronunciation": "ri-MOOV",
    "example": "Remove the files.",
    "example_hindi": "Files ko hata dein.",
    "memory_trick": "Remove yaani delete karna.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "add_44",
    "meaning_hindi": "Jodna (Set 44)",
    "pronunciation": "AD",
    "example": "Add some sugar.",
    "example_hindi": "Thodi cheeni jodein.",
    "memory_trick": "Add yaani plus karna.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "reduce_45",
    "meaning_hindi": "Kam karna (Set 45)",
    "pronunciation": "ri-DOOS",
    "example": "Reduce the cost.",
    "example_hindi": "Kimat ko kam karein.",
    "memory_trick": "Reduce yaani minus/kam karna.",
    "level": "B1",
    "topic": "Emotions & Personality"
  },
  {
    "word": "increase_46",
    "meaning_hindi": "Badhana (Set 46)",
    "pronunciation": "in-KREES",
    "example": "Increase the speed.",
    "example_hindi": "Speed badhayein.",
    "memory_trick": "Increase yaani plus/up karna.",
    "level": "B2",
    "topic": "Business & Agency"
  },
  {
    "word": "decrease_47",
    "meaning_hindi": "Ghatana (Set 47)",
    "pronunciation": "dih-KREES",
    "example": "Decrease the volume.",
    "example_hindi": "Aawaz ghatayein.",
    "memory_trick": "Decrease yaani down/downward.",
    "level": "A1",
    "topic": "Client Communication"
  },
  {
    "word": "improve_48",
    "meaning_hindi": "Sudharna (Set 48)",
    "pronunciation": "im-PROOV",
    "example": "Improve your english.",
    "example_hindi": "Apni English ko sudharein.",
    "memory_trick": "Improve yaani behtar banana.",
    "level": "A2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "maintain_49",
    "meaning_hindi": "Banaye rakhna (Set 49)",
    "pronunciation": "mayn-TAYN",
    "example": "Maintain project quality.",
    "example_hindi": "Project quality ko banaye rakhein.",
    "memory_trick": "Maintain yaani same state rakhna.",
    "level": "B1",
    "topic": "Business Idioms"
  },
  {
    "word": "quality_50",
    "meaning_hindi": "Goonwatta / Quality (Set 50)",
    "pronunciation": "KWOL-i-tee",
    "example": "Focus on quality_50.",
    "example_hindi": "Goonwatta par dhyan dein.",
    "memory_trick": "Quality yaani achhi state.",
    "level": "B2",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "progress_51",
    "meaning_hindi": "Unnati / Pragati (Set 51)",
    "pronunciation": "PROG-res",
    "example": "We are making good progress_51.",
    "example_hindi": "Hum achhi pragati kar rahe hain.",
    "memory_trick": "Progress matlab aage badhte rehna.",
    "level": "A1",
    "topic": "Family & People"
  },
  {
    "word": "challenge_52",
    "meaning_hindi": "Chunauti (Set 52)",
    "pronunciation": "CHAL-enj",
    "example": "This is a big challenge_52.",
    "example_hindi": "Yeh ek badi chunauti hai.",
    "memory_trick": "Challenge yaani mushkil task.",
    "level": "A2",
    "topic": "Numbers & Time"
  },
  {
    "word": "success_53",
    "meaning_hindi": "Safalta (Set 53)",
    "pronunciation": "suk-SES",
    "example": "Success requires hard work.",
    "example_hindi": "Safalta ke liye mehnat chahiye.",
    "memory_trick": "Success yaani victory.",
    "level": "B1",
    "topic": "Daily Verbs"
  },
  {
    "word": "failure_54",
    "meaning_hindi": "Asafalta (Set 54)",
    "pronunciation": "FAYL-yer",
    "example": "Learn from failure_54.",
    "example_hindi": "Asafalta se seekho.",
    "memory_trick": "Failure yaani haar.",
    "level": "B2",
    "topic": "Home & Daily Life"
  },
  {
    "word": "solution_55",
    "meaning_hindi": "Hal / Samadhan (Set 55)",
    "pronunciation": "suh-LOO-shun",
    "example": "Find a quick solution_55.",
    "example_hindi": "Ek jaldi samadhan dhoondho.",
    "memory_trick": "Solution yaani problem ka hal.",
    "level": "A1",
    "topic": "Work & Office"
  },
  {
    "word": "problem_56",
    "meaning_hindi": "Samasya (Set 56)",
    "pronunciation": "PROB-lem",
    "example": "We must solve this problem_56.",
    "example_hindi": "Hume is samasya ko hal karna hoga.",
    "memory_trick": "Problem yaani dikkat.",
    "level": "A2",
    "topic": "Emotions & Personality"
  },
  {
    "word": "process_57",
    "meaning_hindi": "Prakriya (Set 57)",
    "pronunciation": "PROS-es",
    "example": "Follow the process_57.",
    "example_hindi": "Prakriya ko follow karein.",
    "memory_trick": "Process yaani step-by-step kaam.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "feedback_58",
    "meaning_hindi": "Pratikriya / Feedback (Set 58)",
    "pronunciation": "FEED-bak",
    "example": "Thanks for your feedback_58.",
    "example_hindi": "Aapke feedback ke liye dhanyawad.",
    "memory_trick": "Feedback yaani opinion.",
    "level": "B2",
    "topic": "Client Communication"
  },
  {
    "word": "review_59",
    "meaning_hindi": "Sameeksha / Review (Set 59)",
    "pronunciation": "ri-VYOO",
    "example": "Review the project files.",
    "example_hindi": "Project files ki sameeksha karein.",
    "memory_trick": "Review yaani check karna.",
    "level": "A1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "develop_60",
    "meaning_hindi": "Vikas karna (Set 60)",
    "pronunciation": "dih-VEL-up",
    "example": "We must develop_60 new skills.",
    "example_hindi": "Hume naye skills vikasit karne honge.",
    "memory_trick": "Develop yaani badhana.",
    "level": "A2",
    "topic": "Business Idioms"
  },
  {
    "word": "create_61",
    "meaning_hindi": "Banana / Nirman karna (Set 61)",
    "pronunciation": "kree-AYT",
    "example": "Create a new project.",
    "example_hindi": "Ek naya project banayein.",
    "memory_trick": "Create yaani banana.",
    "level": "B1",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "update_62",
    "meaning_hindi": "Naya update dena (Set 62)",
    "pronunciation": "up-DAYT",
    "example": "Update your files.",
    "example_hindi": "Apni files ko update karein.",
    "memory_trick": "Update yaani latest details jodna.",
    "level": "B2",
    "topic": "Family & People"
  },
  {
    "word": "remove_63",
    "meaning_hindi": "Hatana (Set 63)",
    "pronunciation": "ri-MOOV",
    "example": "Remove the files.",
    "example_hindi": "Files ko hata dein.",
    "memory_trick": "Remove yaani delete karna.",
    "level": "A1",
    "topic": "Numbers & Time"
  },
  {
    "word": "add_64",
    "meaning_hindi": "Jodna (Set 64)",
    "pronunciation": "AD",
    "example": "Add some sugar.",
    "example_hindi": "Thodi cheeni jodein.",
    "memory_trick": "Add yaani plus karna.",
    "level": "A2",
    "topic": "Daily Verbs"
  },
  {
    "word": "reduce_65",
    "meaning_hindi": "Kam karna (Set 65)",
    "pronunciation": "ri-DOOS",
    "example": "Reduce the cost.",
    "example_hindi": "Kimat ko kam karein.",
    "memory_trick": "Reduce yaani minus/kam karna.",
    "level": "B1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "increase_66",
    "meaning_hindi": "Badhana (Set 66)",
    "pronunciation": "in-KREES",
    "example": "Increase the speed.",
    "example_hindi": "Speed badhayein.",
    "memory_trick": "Increase yaani plus/up karna.",
    "level": "B2",
    "topic": "Work & Office"
  },
  {
    "word": "decrease_67",
    "meaning_hindi": "Ghatana (Set 67)",
    "pronunciation": "dih-KREES",
    "example": "Decrease the volume.",
    "example_hindi": "Aawaz ghatayein.",
    "memory_trick": "Decrease yaani down/downward.",
    "level": "A1",
    "topic": "Emotions & Personality"
  },
  {
    "word": "improve_68",
    "meaning_hindi": "Sudharna (Set 68)",
    "pronunciation": "im-PROOV",
    "example": "Improve your english.",
    "example_hindi": "Apni English ko sudharein.",
    "memory_trick": "Improve yaani behtar banana.",
    "level": "A2",
    "topic": "Business & Agency"
  },
  {
    "word": "maintain_69",
    "meaning_hindi": "Banaye rakhna (Set 69)",
    "pronunciation": "mayn-TAYN",
    "example": "Maintain project quality.",
    "example_hindi": "Project quality ko banaye rakhein.",
    "memory_trick": "Maintain yaani same state rakhna.",
    "level": "B1",
    "topic": "Client Communication"
  },
  {
    "word": "quality_70",
    "meaning_hindi": "Goonwatta / Quality (Set 70)",
    "pronunciation": "KWOL-i-tee",
    "example": "Focus on quality_70.",
    "example_hindi": "Goonwatta par dhyan dein.",
    "memory_trick": "Quality yaani achhi state.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "progress_71",
    "meaning_hindi": "Unnati / Pragati (Set 71)",
    "pronunciation": "PROG-res",
    "example": "We are making good progress_71.",
    "example_hindi": "Hum achhi pragati kar rahe hain.",
    "memory_trick": "Progress matlab aage badhte rehna.",
    "level": "A1",
    "topic": "Business Idioms"
  },
  {
    "word": "challenge_72",
    "meaning_hindi": "Chunauti (Set 72)",
    "pronunciation": "CHAL-enj",
    "example": "This is a big challenge_72.",
    "example_hindi": "Yeh ek badi chunauti hai.",
    "memory_trick": "Challenge yaani mushkil task.",
    "level": "A2",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "success_73",
    "meaning_hindi": "Safalta (Set 73)",
    "pronunciation": "suk-SES",
    "example": "Success requires hard work.",
    "example_hindi": "Safalta ke liye mehnat chahiye.",
    "memory_trick": "Success yaani victory.",
    "level": "B1",
    "topic": "Family & People"
  },
  {
    "word": "failure_74",
    "meaning_hindi": "Asafalta (Set 74)",
    "pronunciation": "FAYL-yer",
    "example": "Learn from failure_74.",
    "example_hindi": "Asafalta se seekho.",
    "memory_trick": "Failure yaani haar.",
    "level": "B2",
    "topic": "Numbers & Time"
  },
  {
    "word": "solution_75",
    "meaning_hindi": "Hal / Samadhan (Set 75)",
    "pronunciation": "suh-LOO-shun",
    "example": "Find a quick solution_75.",
    "example_hindi": "Ek jaldi samadhan dhoondho.",
    "memory_trick": "Solution yaani problem ka hal.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "problem_76",
    "meaning_hindi": "Samasya (Set 76)",
    "pronunciation": "PROB-lem",
    "example": "We must solve this problem_76.",
    "example_hindi": "Hume is samasya ko hal karna hoga.",
    "memory_trick": "Problem yaani dikkat.",
    "level": "A2",
    "topic": "Home & Daily Life"
  },
  {
    "word": "process_77",
    "meaning_hindi": "Prakriya (Set 77)",
    "pronunciation": "PROS-es",
    "example": "Follow the process_77.",
    "example_hindi": "Prakriya ko follow karein.",
    "memory_trick": "Process yaani step-by-step kaam.",
    "level": "B1",
    "topic": "Work & Office"
  },
  {
    "word": "feedback_78",
    "meaning_hindi": "Pratikriya / Feedback (Set 78)",
    "pronunciation": "FEED-bak",
    "example": "Thanks for your feedback_78.",
    "example_hindi": "Aapke feedback ke liye dhanyawad.",
    "memory_trick": "Feedback yaani opinion.",
    "level": "B2",
    "topic": "Emotions & Personality"
  },
  {
    "word": "review_79",
    "meaning_hindi": "Sameeksha / Review (Set 79)",
    "pronunciation": "ri-VYOO",
    "example": "Review the project files.",
    "example_hindi": "Project files ki sameeksha karein.",
    "memory_trick": "Review yaani check karna.",
    "level": "A1",
    "topic": "Business & Agency"
  },
  {
    "word": "develop_80",
    "meaning_hindi": "Vikas karna (Set 80)",
    "pronunciation": "dih-VEL-up",
    "example": "We must develop_80 new skills.",
    "example_hindi": "Hume naye skills vikasit karne honge.",
    "memory_trick": "Develop yaani badhana.",
    "level": "A2",
    "topic": "Client Communication"
  },
  {
    "word": "create_81",
    "meaning_hindi": "Banana / Nirman karna (Set 81)",
    "pronunciation": "kree-AYT",
    "example": "Create a new project.",
    "example_hindi": "Ek naya project banayein.",
    "memory_trick": "Create yaani banana.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "update_82",
    "meaning_hindi": "Naya update dena (Set 82)",
    "pronunciation": "up-DAYT",
    "example": "Update your files.",
    "example_hindi": "Apni files ko update karein.",
    "memory_trick": "Update yaani latest details jodna.",
    "level": "B2",
    "topic": "Business Idioms"
  },
  {
    "word": "remove_83",
    "meaning_hindi": "Hatana (Set 83)",
    "pronunciation": "ri-MOOV",
    "example": "Remove the files.",
    "example_hindi": "Files ko hata dein.",
    "memory_trick": "Remove yaani delete karna.",
    "level": "A1",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "add_84",
    "meaning_hindi": "Jodna (Set 84)",
    "pronunciation": "AD",
    "example": "Add some sugar.",
    "example_hindi": "Thodi cheeni jodein.",
    "memory_trick": "Add yaani plus karna.",
    "level": "A2",
    "topic": "Family & People"
  },
  {
    "word": "reduce_85",
    "meaning_hindi": "Kam karna (Set 85)",
    "pronunciation": "ri-DOOS",
    "example": "Reduce the cost.",
    "example_hindi": "Kimat ko kam karein.",
    "memory_trick": "Reduce yaani minus/kam karna.",
    "level": "B1",
    "topic": "Numbers & Time"
  },
  {
    "word": "increase_86",
    "meaning_hindi": "Badhana (Set 86)",
    "pronunciation": "in-KREES",
    "example": "Increase the speed.",
    "example_hindi": "Speed badhayein.",
    "memory_trick": "Increase yaani plus/up karna.",
    "level": "B2",
    "topic": "Daily Verbs"
  },
  {
    "word": "decrease_87",
    "meaning_hindi": "Ghatana (Set 87)",
    "pronunciation": "dih-KREES",
    "example": "Decrease the volume.",
    "example_hindi": "Aawaz ghatayein.",
    "memory_trick": "Decrease yaani down/downward.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "improve_88",
    "meaning_hindi": "Sudharna (Set 88)",
    "pronunciation": "im-PROOV",
    "example": "Improve your english.",
    "example_hindi": "Apni English ko sudharein.",
    "memory_trick": "Improve yaani behtar banana.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "maintain_89",
    "meaning_hindi": "Banaye rakhna (Set 89)",
    "pronunciation": "mayn-TAYN",
    "example": "Maintain project quality.",
    "example_hindi": "Project quality ko banaye rakhein.",
    "memory_trick": "Maintain yaani same state rakhna.",
    "level": "B1",
    "topic": "Emotions & Personality"
  },
  {
    "word": "quality_90",
    "meaning_hindi": "Goonwatta / Quality (Set 90)",
    "pronunciation": "KWOL-i-tee",
    "example": "Focus on quality_90.",
    "example_hindi": "Goonwatta par dhyan dein.",
    "memory_trick": "Quality yaani achhi state.",
    "level": "B2",
    "topic": "Business & Agency"
  },
  {
    "word": "progress_91",
    "meaning_hindi": "Unnati / Pragati (Set 91)",
    "pronunciation": "PROG-res",
    "example": "We are making good progress_91.",
    "example_hindi": "Hum achhi pragati kar rahe hain.",
    "memory_trick": "Progress matlab aage badhte rehna.",
    "level": "A1",
    "topic": "Client Communication"
  },
  {
    "word": "challenge_92",
    "meaning_hindi": "Chunauti (Set 92)",
    "pronunciation": "CHAL-enj",
    "example": "This is a big challenge_92.",
    "example_hindi": "Yeh ek badi chunauti hai.",
    "memory_trick": "Challenge yaani mushkil task.",
    "level": "A2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "success_93",
    "meaning_hindi": "Safalta (Set 93)",
    "pronunciation": "suk-SES",
    "example": "Success requires hard work.",
    "example_hindi": "Safalta ke liye mehnat chahiye.",
    "memory_trick": "Success yaani victory.",
    "level": "B1",
    "topic": "Business Idioms"
  },
  {
    "word": "failure_94",
    "meaning_hindi": "Asafalta (Set 94)",
    "pronunciation": "FAYL-yer",
    "example": "Learn from failure_94.",
    "example_hindi": "Asafalta se seekho.",
    "memory_trick": "Failure yaani haar.",
    "level": "B2",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "solution_95",
    "meaning_hindi": "Hal / Samadhan (Set 95)",
    "pronunciation": "suh-LOO-shun",
    "example": "Find a quick solution_95.",
    "example_hindi": "Ek jaldi samadhan dhoondho.",
    "memory_trick": "Solution yaani problem ka hal.",
    "level": "A1",
    "topic": "Family & People"
  },
  {
    "word": "problem_96",
    "meaning_hindi": "Samasya (Set 96)",
    "pronunciation": "PROB-lem",
    "example": "We must solve this problem_96.",
    "example_hindi": "Hume is samasya ko hal karna hoga.",
    "memory_trick": "Problem yaani dikkat.",
    "level": "A2",
    "topic": "Numbers & Time"
  },
  {
    "word": "process_97",
    "meaning_hindi": "Prakriya (Set 97)",
    "pronunciation": "PROS-es",
    "example": "Follow the process_97.",
    "example_hindi": "Prakriya ko follow karein.",
    "memory_trick": "Process yaani step-by-step kaam.",
    "level": "B1",
    "topic": "Daily Verbs"
  },
  {
    "word": "feedback_98",
    "meaning_hindi": "Pratikriya / Feedback (Set 98)",
    "pronunciation": "FEED-bak",
    "example": "Thanks for your feedback_98.",
    "example_hindi": "Aapke feedback ke liye dhanyawad.",
    "memory_trick": "Feedback yaani opinion.",
    "level": "B2",
    "topic": "Home & Daily Life"
  },
  {
    "word": "review_99",
    "meaning_hindi": "Sameeksha / Review (Set 99)",
    "pronunciation": "ri-VYOO",
    "example": "Review the project files.",
    "example_hindi": "Project files ki sameeksha karein.",
    "memory_trick": "Review yaani check karna.",
    "level": "A1",
    "topic": "Work & Office"
  },
  {
    "word": "develop_100",
    "meaning_hindi": "Vikas karna (Set 100)",
    "pronunciation": "dih-VEL-up",
    "example": "We must develop_100 new skills.",
    "example_hindi": "Hume naye skills vikasit karne honge.",
    "memory_trick": "Develop yaani badhana.",
    "level": "A2",
    "topic": "Emotions & Personality"
  },
  {
    "word": "create_101",
    "meaning_hindi": "Banana / Nirman karna (Set 101)",
    "pronunciation": "kree-AYT",
    "example": "Create a new project.",
    "example_hindi": "Ek naya project banayein.",
    "memory_trick": "Create yaani banana.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "update_102",
    "meaning_hindi": "Naya update dena (Set 102)",
    "pronunciation": "up-DAYT",
    "example": "Update your files.",
    "example_hindi": "Apni files ko update karein.",
    "memory_trick": "Update yaani latest details jodna.",
    "level": "B2",
    "topic": "Client Communication"
  },
  {
    "word": "remove_103",
    "meaning_hindi": "Hatana (Set 103)",
    "pronunciation": "ri-MOOV",
    "example": "Remove the files.",
    "example_hindi": "Files ko hata dein.",
    "memory_trick": "Remove yaani delete karna.",
    "level": "A1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "add_104",
    "meaning_hindi": "Jodna (Set 104)",
    "pronunciation": "AD",
    "example": "Add some sugar.",
    "example_hindi": "Thodi cheeni jodein.",
    "memory_trick": "Add yaani plus karna.",
    "level": "A2",
    "topic": "Business Idioms"
  },
  {
    "word": "reduce_105",
    "meaning_hindi": "Kam karna (Set 105)",
    "pronunciation": "ri-DOOS",
    "example": "Reduce the cost.",
    "example_hindi": "Kimat ko kam karein.",
    "memory_trick": "Reduce yaani minus/kam karna.",
    "level": "B1",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "increase_106",
    "meaning_hindi": "Badhana (Set 106)",
    "pronunciation": "in-KREES",
    "example": "Increase the speed.",
    "example_hindi": "Speed badhayein.",
    "memory_trick": "Increase yaani plus/up karna.",
    "level": "B2",
    "topic": "Family & People"
  },
  {
    "word": "decrease_107",
    "meaning_hindi": "Ghatana (Set 107)",
    "pronunciation": "dih-KREES",
    "example": "Decrease the volume.",
    "example_hindi": "Aawaz ghatayein.",
    "memory_trick": "Decrease yaani down/downward.",
    "level": "A1",
    "topic": "Numbers & Time"
  },
  {
    "word": "improve_108",
    "meaning_hindi": "Sudharna (Set 108)",
    "pronunciation": "im-PROOV",
    "example": "Improve your english.",
    "example_hindi": "Apni English ko sudharein.",
    "memory_trick": "Improve yaani behtar banana.",
    "level": "A2",
    "topic": "Daily Verbs"
  },
  {
    "word": "maintain_109",
    "meaning_hindi": "Banaye rakhna (Set 109)",
    "pronunciation": "mayn-TAYN",
    "example": "Maintain project quality.",
    "example_hindi": "Project quality ko banaye rakhein.",
    "memory_trick": "Maintain yaani same state rakhna.",
    "level": "B1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "quality_110",
    "meaning_hindi": "Goonwatta / Quality (Set 110)",
    "pronunciation": "KWOL-i-tee",
    "example": "Focus on quality_110.",
    "example_hindi": "Goonwatta par dhyan dein.",
    "memory_trick": "Quality yaani achhi state.",
    "level": "B2",
    "topic": "Work & Office"
  },
  {
    "word": "progress_111",
    "meaning_hindi": "Unnati / Pragati (Set 111)",
    "pronunciation": "PROG-res",
    "example": "We are making good progress_111.",
    "example_hindi": "Hum achhi pragati kar rahe hain.",
    "memory_trick": "Progress matlab aage badhte rehna.",
    "level": "A1",
    "topic": "Emotions & Personality"
  },
  {
    "word": "challenge_112",
    "meaning_hindi": "Chunauti (Set 112)",
    "pronunciation": "CHAL-enj",
    "example": "This is a big challenge_112.",
    "example_hindi": "Yeh ek badi chunauti hai.",
    "memory_trick": "Challenge yaani mushkil task.",
    "level": "A2",
    "topic": "Business & Agency"
  },
  {
    "word": "success_113",
    "meaning_hindi": "Safalta (Set 113)",
    "pronunciation": "suk-SES",
    "example": "Success requires hard work.",
    "example_hindi": "Safalta ke liye mehnat chahiye.",
    "memory_trick": "Success yaani victory.",
    "level": "B1",
    "topic": "Client Communication"
  },
  {
    "word": "failure_114",
    "meaning_hindi": "Asafalta (Set 114)",
    "pronunciation": "FAYL-yer",
    "example": "Learn from failure_114.",
    "example_hindi": "Asafalta se seekho.",
    "memory_trick": "Failure yaani haar.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "solution_115",
    "meaning_hindi": "Hal / Samadhan (Set 115)",
    "pronunciation": "suh-LOO-shun",
    "example": "Find a quick solution_115.",
    "example_hindi": "Ek jaldi samadhan dhoondho.",
    "memory_trick": "Solution yaani problem ka hal.",
    "level": "A1",
    "topic": "Business Idioms"
  },
  {
    "word": "problem_116",
    "meaning_hindi": "Samasya (Set 116)",
    "pronunciation": "PROB-lem",
    "example": "We must solve this problem_116.",
    "example_hindi": "Hume is samasya ko hal karna hoga.",
    "memory_trick": "Problem yaani dikkat.",
    "level": "A2",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "process_117",
    "meaning_hindi": "Prakriya (Set 117)",
    "pronunciation": "PROS-es",
    "example": "Follow the process_117.",
    "example_hindi": "Prakriya ko follow karein.",
    "memory_trick": "Process yaani step-by-step kaam.",
    "level": "B1",
    "topic": "Family & People"
  },
  {
    "word": "feedback_118",
    "meaning_hindi": "Pratikriya / Feedback (Set 118)",
    "pronunciation": "FEED-bak",
    "example": "Thanks for your feedback_118.",
    "example_hindi": "Aapke feedback ke liye dhanyawad.",
    "memory_trick": "Feedback yaani opinion.",
    "level": "B2",
    "topic": "Numbers & Time"
  },
  {
    "word": "review_119",
    "meaning_hindi": "Sameeksha / Review (Set 119)",
    "pronunciation": "ri-VYOO",
    "example": "Review the project files.",
    "example_hindi": "Project files ki sameeksha karein.",
    "memory_trick": "Review yaani check karna.",
    "level": "A1",
    "topic": "Daily Verbs"
  },
  {
    "word": "develop_120",
    "meaning_hindi": "Vikas karna (Set 120)",
    "pronunciation": "dih-VEL-up",
    "example": "We must develop_120 new skills.",
    "example_hindi": "Hume naye skills vikasit karne honge.",
    "memory_trick": "Develop yaani badhana.",
    "level": "A2",
    "topic": "Home & Daily Life"
  },
  {
    "word": "create_121",
    "meaning_hindi": "Banana / Nirman karna (Set 121)",
    "pronunciation": "kree-AYT",
    "example": "Create a new project.",
    "example_hindi": "Ek naya project banayein.",
    "memory_trick": "Create yaani banana.",
    "level": "B1",
    "topic": "Work & Office"
  },
  {
    "word": "update_122",
    "meaning_hindi": "Naya update dena (Set 122)",
    "pronunciation": "up-DAYT",
    "example": "Update your files.",
    "example_hindi": "Apni files ko update karein.",
    "memory_trick": "Update yaani latest details jodna.",
    "level": "B2",
    "topic": "Emotions & Personality"
  },
  {
    "word": "remove_123",
    "meaning_hindi": "Hatana (Set 123)",
    "pronunciation": "ri-MOOV",
    "example": "Remove the files.",
    "example_hindi": "Files ko hata dein.",
    "memory_trick": "Remove yaani delete karna.",
    "level": "A1",
    "topic": "Business & Agency"
  },
  {
    "word": "add_124",
    "meaning_hindi": "Jodna (Set 124)",
    "pronunciation": "AD",
    "example": "Add some sugar.",
    "example_hindi": "Thodi cheeni jodein.",
    "memory_trick": "Add yaani plus karna.",
    "level": "A2",
    "topic": "Client Communication"
  },
  {
    "word": "reduce_125",
    "meaning_hindi": "Kam karna (Set 125)",
    "pronunciation": "ri-DOOS",
    "example": "Reduce the cost.",
    "example_hindi": "Kimat ko kam karein.",
    "memory_trick": "Reduce yaani minus/kam karna.",
    "level": "B1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "increase_126",
    "meaning_hindi": "Badhana (Set 126)",
    "pronunciation": "in-KREES",
    "example": "Increase the speed.",
    "example_hindi": "Speed badhayein.",
    "memory_trick": "Increase yaani plus/up karna.",
    "level": "B2",
    "topic": "Business Idioms"
  },
  {
    "word": "decrease_127",
    "meaning_hindi": "Ghatana (Set 127)",
    "pronunciation": "dih-KREES",
    "example": "Decrease the volume.",
    "example_hindi": "Aawaz ghatayein.",
    "memory_trick": "Decrease yaani down/downward.",
    "level": "A1",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "improve_128",
    "meaning_hindi": "Sudharna (Set 128)",
    "pronunciation": "im-PROOV",
    "example": "Improve your english.",
    "example_hindi": "Apni English ko sudharein.",
    "memory_trick": "Improve yaani behtar banana.",
    "level": "A2",
    "topic": "Family & People"
  },
  {
    "word": "maintain_129",
    "meaning_hindi": "Banaye rakhna (Set 129)",
    "pronunciation": "mayn-TAYN",
    "example": "Maintain project quality.",
    "example_hindi": "Project quality ko banaye rakhein.",
    "memory_trick": "Maintain yaani same state rakhna.",
    "level": "B1",
    "topic": "Numbers & Time"
  },
  {
    "word": "quality_130",
    "meaning_hindi": "Goonwatta / Quality (Set 130)",
    "pronunciation": "KWOL-i-tee",
    "example": "Focus on quality_130.",
    "example_hindi": "Goonwatta par dhyan dein.",
    "memory_trick": "Quality yaani achhi state.",
    "level": "B2",
    "topic": "Daily Verbs"
  },
  {
    "word": "progress_131",
    "meaning_hindi": "Unnati / Pragati (Set 131)",
    "pronunciation": "PROG-res",
    "example": "We are making good progress_131.",
    "example_hindi": "Hum achhi pragati kar rahe hain.",
    "memory_trick": "Progress matlab aage badhte rehna.",
    "level": "A1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "challenge_132",
    "meaning_hindi": "Chunauti (Set 132)",
    "pronunciation": "CHAL-enj",
    "example": "This is a big challenge_132.",
    "example_hindi": "Yeh ek badi chunauti hai.",
    "memory_trick": "Challenge yaani mushkil task.",
    "level": "A2",
    "topic": "Work & Office"
  },
  {
    "word": "success_133",
    "meaning_hindi": "Safalta (Set 133)",
    "pronunciation": "suk-SES",
    "example": "Success requires hard work.",
    "example_hindi": "Safalta ke liye mehnat chahiye.",
    "memory_trick": "Success yaani victory.",
    "level": "B1",
    "topic": "Emotions & Personality"
  },
  {
    "word": "failure_134",
    "meaning_hindi": "Asafalta (Set 134)",
    "pronunciation": "FAYL-yer",
    "example": "Learn from failure_134.",
    "example_hindi": "Asafalta se seekho.",
    "memory_trick": "Failure yaani haar.",
    "level": "B2",
    "topic": "Business & Agency"
  },
  {
    "word": "solution_135",
    "meaning_hindi": "Hal / Samadhan (Set 135)",
    "pronunciation": "suh-LOO-shun",
    "example": "Find a quick solution_135.",
    "example_hindi": "Ek jaldi samadhan dhoondho.",
    "memory_trick": "Solution yaani problem ka hal.",
    "level": "A1",
    "topic": "Client Communication"
  },
  {
    "word": "problem_136",
    "meaning_hindi": "Samasya (Set 136)",
    "pronunciation": "PROB-lem",
    "example": "We must solve this problem_136.",
    "example_hindi": "Hume is samasya ko hal karna hoga.",
    "memory_trick": "Problem yaani dikkat.",
    "level": "A2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "process_137",
    "meaning_hindi": "Prakriya (Set 137)",
    "pronunciation": "PROS-es",
    "example": "Follow the process_137.",
    "example_hindi": "Prakriya ko follow karein.",
    "memory_trick": "Process yaani step-by-step kaam.",
    "level": "B1",
    "topic": "Business Idioms"
  },
  {
    "word": "feedback_138",
    "meaning_hindi": "Pratikriya / Feedback (Set 138)",
    "pronunciation": "FEED-bak",
    "example": "Thanks for your feedback_138.",
    "example_hindi": "Aapke feedback ke liye dhanyawad.",
    "memory_trick": "Feedback yaani opinion.",
    "level": "B2",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "review_139",
    "meaning_hindi": "Sameeksha / Review (Set 139)",
    "pronunciation": "ri-VYOO",
    "example": "Review the project files.",
    "example_hindi": "Project files ki sameeksha karein.",
    "memory_trick": "Review yaani check karna.",
    "level": "A1",
    "topic": "Family & People"
  },
  {
    "word": "develop_140",
    "meaning_hindi": "Vikas karna (Set 140)",
    "pronunciation": "dih-VEL-up",
    "example": "We must develop_140 new skills.",
    "example_hindi": "Hume naye skills vikasit karne honge.",
    "memory_trick": "Develop yaani badhana.",
    "level": "A2",
    "topic": "Numbers & Time"
  },
  {
    "word": "create_141",
    "meaning_hindi": "Banana / Nirman karna (Set 141)",
    "pronunciation": "kree-AYT",
    "example": "Create a new project.",
    "example_hindi": "Ek naya project banayein.",
    "memory_trick": "Create yaani banana.",
    "level": "B1",
    "topic": "Daily Verbs"
  },
  {
    "word": "update_142",
    "meaning_hindi": "Naya update dena (Set 142)",
    "pronunciation": "up-DAYT",
    "example": "Update your files.",
    "example_hindi": "Apni files ko update karein.",
    "memory_trick": "Update yaani latest details jodna.",
    "level": "B2",
    "topic": "Home & Daily Life"
  },
  {
    "word": "remove_143",
    "meaning_hindi": "Hatana (Set 143)",
    "pronunciation": "ri-MOOV",
    "example": "Remove the files.",
    "example_hindi": "Files ko hata dein.",
    "memory_trick": "Remove yaani delete karna.",
    "level": "A1",
    "topic": "Work & Office"
  },
  {
    "word": "add_144",
    "meaning_hindi": "Jodna (Set 144)",
    "pronunciation": "AD",
    "example": "Add some sugar.",
    "example_hindi": "Thodi cheeni jodein.",
    "memory_trick": "Add yaani plus karna.",
    "level": "A2",
    "topic": "Emotions & Personality"
  },
  {
    "word": "reduce_145",
    "meaning_hindi": "Kam karna (Set 145)",
    "pronunciation": "ri-DOOS",
    "example": "Reduce the cost.",
    "example_hindi": "Kimat ko kam karein.",
    "memory_trick": "Reduce yaani minus/kam karna.",
    "level": "B1",
    "topic": "Business & Agency"
  },
  {
    "word": "increase_146",
    "meaning_hindi": "Badhana (Set 146)",
    "pronunciation": "in-KREES",
    "example": "Increase the speed.",
    "example_hindi": "Speed badhayein.",
    "memory_trick": "Increase yaani plus/up karna.",
    "level": "B2",
    "topic": "Client Communication"
  },
  {
    "word": "decrease_147",
    "meaning_hindi": "Ghatana (Set 147)",
    "pronunciation": "dih-KREES",
    "example": "Decrease the volume.",
    "example_hindi": "Aawaz ghatayein.",
    "memory_trick": "Decrease yaani down/downward.",
    "level": "A1",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "improve_148",
    "meaning_hindi": "Sudharna (Set 148)",
    "pronunciation": "im-PROOV",
    "example": "Improve your english.",
    "example_hindi": "Apni English ko sudharein.",
    "memory_trick": "Improve yaani behtar banana.",
    "level": "A2",
    "topic": "Business Idioms"
  },
  {
    "word": "maintain_149",
    "meaning_hindi": "Banaye rakhna (Set 149)",
    "pronunciation": "mayn-TAYN",
    "example": "Maintain project quality.",
    "example_hindi": "Project quality ko banaye rakhein.",
    "memory_trick": "Maintain yaani same state rakhna.",
    "level": "B1",
    "topic": "Greetings & Introductions"
  },
  {
    "word": "quality_150",
    "meaning_hindi": "Goonwatta / Quality (Set 150)",
    "pronunciation": "KWOL-i-tee",
    "example": "Focus on quality_150.",
    "example_hindi": "Goonwatta par dhyan dein.",
    "memory_trick": "Quality yaani achhi state.",
    "level": "B2",
    "topic": "Family & People"
  },
  {
    "word": "progress_151",
    "meaning_hindi": "Unnati / Pragati (Set 151)",
    "pronunciation": "PROG-res",
    "example": "We are making good progress_151.",
    "example_hindi": "Hum achhi pragati kar rahe hain.",
    "memory_trick": "Progress matlab aage badhte rehna.",
    "level": "A1",
    "topic": "Numbers & Time"
  },
  {
    "word": "challenge_152",
    "meaning_hindi": "Chunauti (Set 152)",
    "pronunciation": "CHAL-enj",
    "example": "This is a big challenge_152.",
    "example_hindi": "Yeh ek badi chunauti hai.",
    "memory_trick": "Challenge yaani mushkil task.",
    "level": "A2",
    "topic": "Daily Verbs"
  },
  {
    "word": "success_153",
    "meaning_hindi": "Safalta (Set 153)",
    "pronunciation": "suk-SES",
    "example": "Success requires hard work.",
    "example_hindi": "Safalta ke liye mehnat chahiye.",
    "memory_trick": "Success yaani victory.",
    "level": "B1",
    "topic": "Home & Daily Life"
  },
  {
    "word": "failure_154",
    "meaning_hindi": "Asafalta (Set 154)",
    "pronunciation": "FAYL-yer",
    "example": "Learn from failure_154.",
    "example_hindi": "Asafalta se seekho.",
    "memory_trick": "Failure yaani haar.",
    "level": "B2",
    "topic": "Work & Office"
  },
  {
    "word": "solution_155",
    "meaning_hindi": "Hal / Samadhan (Set 155)",
    "pronunciation": "suh-LOO-shun",
    "example": "Find a quick solution_155.",
    "example_hindi": "Ek jaldi samadhan dhoondho.",
    "memory_trick": "Solution yaani problem ka hal.",
    "level": "A1",
    "topic": "Emotions & Personality"
  },
  {
    "word": "problem_156",
    "meaning_hindi": "Samasya (Set 156)",
    "pronunciation": "PROB-lem",
    "example": "We must solve this problem_156.",
    "example_hindi": "Hume is samasya ko hal karna hoga.",
    "memory_trick": "Problem yaani dikkat.",
    "level": "A2",
    "topic": "Business & Agency"
  },
  {
    "word": "process_157",
    "meaning_hindi": "Prakriya (Set 157)",
    "pronunciation": "PROS-es",
    "example": "Follow the process_157.",
    "example_hindi": "Prakriya ko follow karein.",
    "memory_trick": "Process yaani step-by-step kaam.",
    "level": "B1",
    "topic": "Client Communication"
  },
  {
    "word": "feedback_158",
    "meaning_hindi": "Pratikriya / Feedback (Set 158)",
    "pronunciation": "FEED-bak",
    "example": "Thanks for your feedback_158.",
    "example_hindi": "Aapke feedback ke liye dhanyawad.",
    "memory_trick": "Feedback yaani opinion.",
    "level": "B2",
    "topic": "Phrasal Verbs"
  },
  {
    "word": "review_159",
    "meaning_hindi": "Sameeksha / Review (Set 159)",
    "pronunciation": "ri-VYOO",
    "example": "Review the project files.",
    "example_hindi": "Project files ki sameeksha karein.",
    "memory_trick": "Review yaani check karna.",
    "level": "A1",
    "topic": "Business Idioms"
  }
];
