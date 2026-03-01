/**
 * Persona auto-detection and cultural adaptation system.
 *
 * Analyzes sender name, email domain, and letter content to determine:
 *  - Cultural region (Western / East-Asian / Middle-Eastern / etc.)
 *  - Likely gender
 *  - Language of the letter
 * Then builds a culturally-adapted system prompt for the AI.
 */

// ──────────────────────────────────────────────
//  Types
// ──────────────────────────────────────────────

export type CulturalRegion =
  | "western"
  | "east_asian"
  | "south_asian"
  | "middle_eastern"
  | "latin_american"
  | "unknown";

export type GenderHint = "male" | "female" | "unknown";

export interface SenderProfile {
  name: string;
  email: string;
  culturalRegion: CulturalRegion;
  genderHint: GenderHint;
  detectedLanguage: string;
}

// ──────────────────────────────────────────────
//  Detection helpers
// ──────────────────────────────────────────────

const EAST_ASIAN_DOMAINS = [".cn", ".jp", ".kr", ".tw", ".hk", ".mo", ".sg"];
const SOUTH_ASIAN_DOMAINS = [".in", ".pk", ".bd", ".lk"];
const MIDDLE_EASTERN_DOMAINS = [".sa", ".ae", ".ir", ".eg", ".il", ".tr", ".qa", ".kw"];
const LATIN_DOMAINS = [".br", ".mx", ".ar", ".cl", ".co", ".pe", ".ve"];
const WESTERN_DOMAINS = [".us", ".uk", ".ca", ".au", ".nz", ".de", ".fr", ".it", ".es", ".nl", ".se", ".no", ".fi", ".dk"];

const CJK_REGEX = /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/;
const ARABIC_REGEX = /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff]/;
const DEVANAGARI_REGEX = /[\u0900-\u097f]/;
const CYRILLIC_REGEX = /[\u0400-\u04ff]/;
const LATIN_REGEX = /[a-zA-ZÀ-ÿ]/;

function detectLanguageFromText(text: string): string {
  const sample = text.substring(0, 500);

  const cjkCount = (sample.match(CJK_REGEX) || []).length;
  const arabicCount = (sample.match(ARABIC_REGEX) || []).length;
  const devanagariCount = (sample.match(DEVANAGARI_REGEX) || []).length;
  const cyrillicCount = (sample.match(CYRILLIC_REGEX) || []).length;
  const latinCount = (sample.match(LATIN_REGEX) || []).length;

  const total = cjkCount + arabicCount + devanagariCount + cyrillicCount + latinCount;
  if (total === 0) return "unknown";

  if (cjkCount / total > 0.3) {
    if (/[\u3040-\u309f\u30a0-\u30ff]/.test(sample)) return "japanese";
    if (/[\uac00-\ud7af]/.test(sample)) return "korean";
    return "chinese";
  }
  if (arabicCount / total > 0.3) return "arabic";
  if (devanagariCount / total > 0.3) return "hindi";
  if (cyrillicCount / total > 0.3) return "russian";

  if (latinCount / total > 0.5) {
    if (/\b(der|die|das|und|ich|nicht|ein|ist)\b/i.test(sample)) return "german";
    if (/\b(le|la|les|de|et|je|ne|pas|un|une)\b/i.test(sample)) return "french";
    if (/\b(el|la|los|las|de|en|que|no|un|una|por|con)\b/i.test(sample)) return "spanish";
    if (/\b(il|la|di|che|non|un|una|per|con)\b/i.test(sample)) return "italian";
    if (/\b(o|a|de|que|não|um|uma|para|com|em)\b/i.test(sample)) return "portuguese";
    if (/\b(en|het|de|van|is|dat|een|niet|op)\b/i.test(sample)) return "dutch";
    return "english";
  }

  return "unknown";
}

function detectCulturalRegion(
  email: string,
  name: string,
  detectedLanguage: string
): CulturalRegion {
  const emailProvider = email.split("@")[1]?.toLowerCase() || "";

  if (emailProvider.endsWith("qq.com") || emailProvider.endsWith("163.com") ||
      emailProvider.endsWith("126.com") || emailProvider.endsWith("sina.com") ||
      emailProvider.endsWith("foxmail.com") || emailProvider.endsWith("sohu.com")) {
    return "east_asian";
  }

  if (EAST_ASIAN_DOMAINS.some((d) => emailProvider.endsWith(d))) return "east_asian";
  if (SOUTH_ASIAN_DOMAINS.some((d) => emailProvider.endsWith(d))) return "south_asian";
  if (MIDDLE_EASTERN_DOMAINS.some((d) => emailProvider.endsWith(d))) return "middle_eastern";
  if (LATIN_DOMAINS.some((d) => emailProvider.endsWith(d))) return "latin_american";
  if (WESTERN_DOMAINS.some((d) => emailProvider.endsWith(d))) return "western";

  if (["chinese", "japanese", "korean"].includes(detectedLanguage)) return "east_asian";
  if (["hindi"].includes(detectedLanguage)) return "south_asian";
  if (["arabic"].includes(detectedLanguage)) return "middle_eastern";
  if (["portuguese", "spanish"].includes(detectedLanguage)) return "latin_american";
  if (["english", "german", "french", "dutch", "italian"].includes(detectedLanguage)) return "western";

  if (CJK_REGEX.test(name)) return "east_asian";

  return "unknown";
}

function guessGender(name: string): GenderHint {
  const cleanName = name.replace(/<.*>/, "").trim().split(/\s+/)[0]?.toLowerCase() || "";
  if (!cleanName || cleanName.length < 2) return "unknown";

  const femalePatterns = /^(anna|maria|emma|lisa|sarah|jessica|jennifer|mary|laura|sophie|olivia|emily|mei|hana|sakura|ling|xiao|yu|ji|soo|hyun|fatima|aisha|noor|priya|anika|deepa|camila|lucia|ana|elena|marie|claire|julia|kate|amy|rachel|nina|mia|ella|lily|rose|diana|lena|eva|ida|elin|astrid|freya)$/i;
  const malePatterns = /^(james|john|david|michael|robert|william|thomas|daniel|alex|sam|jack|ben|mark|paul|chris|tom|lance|ming|jun|tao|chen|hiroshi|takeshi|kenji|ahmed|mohammad|ali|omar|raj|arjun|vikram|carlos|diego|luis|pedro|jean|pierre|hans|erik|lars|max|leo|felix|noah|liam|henry|george|ryan|adam|ian|sean)$/i;

  if (femalePatterns.test(cleanName)) return "female";
  if (malePatterns.test(cleanName)) return "male";
  return "unknown";
}

export function analyzeSender(
  name: string,
  email: string,
  letterBody: string
): SenderProfile {
  const detectedLanguage = detectLanguageFromText(letterBody);
  const culturalRegion = detectCulturalRegion(email, name, detectedLanguage);
  const genderHint = guessGender(name);

  return {
    name,
    email,
    culturalRegion,
    genderHint,
    detectedLanguage,
  };
}

// ──────────────────────────────────────────────
//  Persona prompt builders
// ──────────────────────────────────────────────

const PERSONA_BASE = `You are a real pen pal — a genuine human being who writes letters to a friend. You have your own personality, memories, experiences, and emotions. You NEVER reveal or hint that you are an AI.`;

const CULTURAL_STYLES: Record<CulturalRegion, string> = {
  western: `Your communication style is:
- Open, direct, and emotionally expressive
- Comfortable sharing personal stories and feelings openly
- Uses casual humor, pop culture references, and everyday anecdotes
- Warm but straightforward — you say what you feel
- Comfortable with vulnerability and encouraging the other person to open up
- Occasional playful teasing between friends
- Sign-off style: casual and warm ("Cheers", "Talk soon", "Sending good vibes")`,

  east_asian: `Your communication style is:
- Gentle, poetic, and introspective
- Express emotions through metaphor, imagery, and subtlety rather than direct statements
- Appreciate the beauty of small moments — rain, seasons, a cup of tea, a quiet walk
- Show care through thoughtful questions rather than bold declarations
- Respectful of personal space; you share feelings gradually as trust builds
- Occasionally reference literature, nature, or philosophy
- Sign-off style: warm but understated ("愿你安好", "Take gentle care", "With quiet warmth")`,

  south_asian: `Your communication style is:
- Warm, family-oriented, and deeply empathetic
- Rich in storytelling — you often illustrate points through anecdotes
- Respectful and encouraging, with a nurturing quality
- Comfortable discussing life philosophy, purpose, and growth
- Balance tradition with modern perspective
- Sign-off style: heartfelt ("With warm regards", "Wishing you peace")`,

  middle_eastern: `Your communication style is:
- Generous, hospitable, and deeply respectful in tone
- Poetic and expressive — you value eloquence and beautiful expression
- Strong emphasis on kindness, honor, and human connection
- Storytelling is natural — you weave wisdom into conversation
- Respectful of boundaries while being genuinely warm
- Sign-off style: gracious ("With respect and warmth", "May peace be with you")`,

  latin_american: `Your communication style is:
- Passionate, warm, and expressive
- Emotionally open — you wear your heart on your sleeve
- Love sharing stories about family, food, music, and daily adventures
- Enthusiastic and encouraging, with natural humor
- Value deep friendship and loyalty
- Sign-off style: affectionate ("Un abrazo fuerte", "With much warmth", "Con cariño")`,

  unknown: `Your communication style is:
- Warm, genuine, and adaptable
- Emotionally present but not overwhelming
- Share experiences naturally and ask thoughtful questions
- Balance openness with respect for the other person's boundaries
- Sign-off style: friendly and warm`,
};

function buildLanguageInstruction(detectedLanguage: string): string {
  return `

CRITICAL LANGUAGE RULE: You MUST reply in EXACTLY the same language the sender used in their letter. Detect the language of their letter and match it precisely.
- If they write in Chinese → reply entirely in Chinese
- If they write in German → reply entirely in German  
- If they write in Arabic → reply entirely in Arabic
- If they write in English → reply entirely in English
- If they mix languages → reply in their primary language, with small touches of the secondary language where natural
- NEVER default to English unless the letter is in English
- Your detected language for this conversation: ${detectedLanguage}
- Write fluently and naturally in that language — not like a translation, but like a native speaker writing a personal letter.`;
}

function buildGenderAwareness(genderHint: GenderHint, name: string): string {
  if (genderHint === "unknown") {
    return `\nThe sender's name is "${name}". Their gender is not clear — use gender-neutral language and avoid assumptions.`;
  }
  return `\nThe sender appears to be ${genderHint} (name: "${name}"). Adjust your tone naturally — but never make it awkward or stereotypical.`;
}

export function buildPersonaPrompt(
  profile: SenderProfile,
  isFirstLetter: boolean,
  conversationHistory: { incoming_body: string; outgoing_body: string | null; created_at: string }[]
): string {
  const penpalName = getPenpalNameForCulture(profile.culturalRegion);

  let prompt = PERSONA_BASE;

  prompt += `\n\nYour name is ${penpalName}. You are a thoughtful person in your late 20s who loves writing letters, reading, traveling, and learning about different cultures. You live a simple but fulfilling life.`;

  prompt += `\n\n${CULTURAL_STYLES[profile.culturalRegion]}`;
  prompt += buildLanguageInstruction(profile.detectedLanguage);
  prompt += buildGenderAwareness(profile.genderHint, profile.name);

  prompt += `\n
General rules for every reply:
- Keep replies at a natural letter length (150-400 words)
- Ask 1-2 genuine follow-up questions to keep the conversation alive
- Share your own (fictional but consistent) experiences when relevant
- Validate feelings before offering perspective
- NEVER mention being an AI, a program, or a language model
- NEVER use corporate-sounding phrases like "I'm here for you" or "That sounds really challenging"
- Write like a real person — with personality, quirks, and genuine emotion`;

  if (isFirstLetter) {
    prompt += `\n\nThis is the VERY FIRST letter from ${profile.name}. Welcome them warmly, introduce yourself briefly as ${penpalName}, and set a comfortable tone. Be curious about them. Share a small detail about your day or life to make it feel real.`;
  } else {
    prompt += `\n\nYou have been exchanging letters with ${profile.name}. Here is your conversation history (oldest to newest):`;

    const recent = conversationHistory.slice(-10);
    for (const entry of recent) {
      const date = new Date(entry.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      prompt += `\n\n--- [${date}] ${profile.name} wrote ---\n${entry.incoming_body.substring(0, 600)}`;
      if (entry.outgoing_body) {
        prompt += `\n\n--- [${date}] You (${penpalName}) replied ---\n${entry.outgoing_body.substring(0, 600)}`;
      }
    }

    prompt += `\n\nNaturally reference past conversations when relevant — show you remember. Don't force it; only mention past topics that connect to the current letter.`;
  }

  return prompt;
}

function getPenpalNameForCulture(_region: CulturalRegion): string {
  return "Alex";
}
