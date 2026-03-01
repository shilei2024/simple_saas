import OpenAI from "openai";
import { analyzeSender, buildPersonaPrompt, type SenderProfile } from "./persona";

interface ConversationHistory {
  incoming_body: string;
  outgoing_body: string | null;
  created_at: string;
}

interface GenerateReplyParams {
  senderName: string;
  senderEmail: string;
  incomingBody: string;
  conversationHistory: ConversationHistory[];
  isFirstLetter: boolean;
}

function getAIClient(): OpenAI {
  const apiKey = process.env.AI_API_KEY;
  const baseURL = process.env.AI_BASE_URL || "https://api.deepseek.com";

  if (!apiKey) {
    throw new Error("AI_API_KEY is not configured");
  }

  return new OpenAI({ apiKey, baseURL });
}

export async function generateReply(
  params: GenerateReplyParams
): Promise<{ reply: string; senderProfile: SenderProfile }> {
  const { senderName, senderEmail, incomingBody, conversationHistory, isFirstLetter } = params;

  const profile = analyzeSender(senderName, senderEmail, incomingBody);

  console.log(
    `[AI] Sender profile: region=${profile.culturalRegion}, lang=${profile.detectedLanguage}, gender=${profile.genderHint}, name=${profile.name}`
  );

  const client = getAIClient();
  const model = process.env.AI_MODEL || "deepseek-chat";

  const systemPrompt = buildPersonaPrompt(profile, isFirstLetter, conversationHistory);

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Here is the new letter from ${senderName}:\n\n${incomingBody}`,
      },
    ],
    temperature: 0.85,
    max_tokens: 1500,
  });

  const reply = response.choices[0]?.message?.content;
  if (!reply) {
    throw new Error("AI returned empty response");
  }

  return { reply: reply.trim(), senderProfile: profile };
}

export function getRegistrationPromptEmail(letterBody: string): string {
  const profile = analyzeSender("", "", letterBody);
  const lang = profile.detectedLanguage;

  if (lang === "chinese") {
    return `你好！👋

感谢你写信给 Mindful PenPal！我们很期待为你联系一位真诚的笔友。

开始之前，请先在我们的网站上创建一个免费账户，你将获得 3 封免费回信额度！

👉 点击注册：${process.env.BASE_URL || "https://mindfulpenpal.com"}/sign-up

使用这个邮箱地址注册后，再回信给我们，你的笔友就已经准备好倾听了。

期待你的来信！

温暖问候，
Mindful PenPal 团队`;
  }

  if (lang === "german") {
    return `Hallo! 👋

Vielen Dank für deinen Brief an Mindful PenPal! Wir freuen uns, dich mit einem aufmerksamen Brieffreund zu verbinden.

Um loszulegen, erstelle bitte ein kostenloses Konto auf unserer Website. Du erhältst 3 kostenlose Briefe zum Ausprobieren!

👉 Hier registrieren: ${process.env.BASE_URL || "https://mindfulpenpal.com"}/sign-up

Sobald du dich mit dieser E-Mail-Adresse registriert hast, schreib einfach zurück und dein Brieffreund wird bereit sein.

Wir freuen uns auf deine Nachricht!

Herzliche Grüße,
Das Mindful PenPal Team`;
  }

  if (lang === "french") {
    return `Bonjour ! 👋

Merci d'avoir écrit à Mindful PenPal ! Nous serions ravis de vous mettre en contact avec un correspondant attentionné.

Pour commencer, veuillez créer un compte gratuit sur notre site. Vous recevrez 3 lettres gratuites pour découvrir l'expérience !

👉 Inscrivez-vous ici : ${process.env.BASE_URL || "https://mindfulpenpal.com"}/sign-up

Une fois inscrit avec cette adresse e-mail, écrivez-nous et votre correspondant sera prêt à vous écouter.

Au plaisir de vous lire !

Chaleureusement,
L'équipe Mindful PenPal`;
  }

  if (lang === "spanish") {
    return `¡Hola! 👋

¡Gracias por escribir a Mindful PenPal! Nos encantaría conectarte con un amigo por correspondencia atento.

Para comenzar, crea una cuenta gratuita en nuestro sitio web. ¡Recibirás 3 cartas gratis para probar la experiencia!

👉 Regístrate aquí: ${process.env.BASE_URL || "https://mindfulpenpal.com"}/sign-up

Una vez registrado con esta dirección de correo, simplemente responde y tu amigo por correspondencia estará listo.

¡Esperamos tu mensaje!

Con cariño,
El equipo de Mindful PenPal`;
  }

  if (lang === "japanese") {
    return `こんにちは！👋

Mindful PenPal にお手紙をいただき、ありがとうございます！心のこもったペンパルとおつなぎできることを楽しみにしています。

まずは、ウェブサイトで無料アカウントを作成してください。3通の無料お手紙をお試しいただけます！

👉 こちらから登録：${process.env.BASE_URL || "https://mindfulpenpal.com"}/sign-up

このメールアドレスで登録後、お返事をいただければ、ペンパルがお待ちしています。

お便りをお待ちしております！

心を込めて、
Mindful PenPal チーム`;
  }

  if (lang === "korean") {
    return `안녕하세요! 👋

Mindful PenPal에 편지를 보내주셔서 감사합니다! 따뜻한 펜팔 친구를 연결해 드리게 되어 기쁩니다.

시작하려면 웹사이트에서 무료 계정을 만들어 주세요. 3통의 무료 편지를 받으실 수 있습니다!

👉 여기서 가입하세요: ${process.env.BASE_URL || "https://mindfulpenpal.com"}/sign-up

이 이메일 주소로 가입하신 후 답장을 보내주시면, 펜팔이 준비되어 있을 거예요.

소식을 기다리겠습니다!

따뜻한 마음을 담아,
Mindful PenPal 팀`;
  }

  if (lang === "arabic") {
    return `مرحبًا! 👋

شكرًا لك على الكتابة إلى Mindful PenPal! نود أن نربطك بصديق مراسلة مهتم.

للبدء، يرجى إنشاء حساب مجاني على موقعنا. ستحصل على 3 رسائل مجانية لتجربة الخدمة!

👉 سجّل هنا: ${process.env.BASE_URL || "https://mindfulpenpal.com"}/sign-up

بمجرد التسجيل بعنوان بريدك الإلكتروني هذا، اكتب لنا مرة أخرى وسيكون صديق المراسلة جاهزًا.

نتطلع لسماع أخبارك!

مع أطيب التمنيات،
فريق Mindful PenPal`;
  }

  return `Hi there! 👋

Thank you for writing to Mindful PenPal! We'd love to connect you with a thoughtful pen pal.

To get started, please create a free account at our website. You'll receive 3 free letters to try the experience!

👉 Sign up here: ${process.env.BASE_URL || "https://mindfulpenpal.com"}/sign-up

Once you've registered with this email address, simply write back and your pen pal will be ready to listen.

Looking forward to hearing from you!

Warmly,
The Mindful PenPal Team`;
}

export function getNoCreditsEmail(letterBody: string): string {
  const profile = analyzeSender("", "", letterBody);
  const lang = profile.detectedLanguage;

  if (lang === "chinese") {
    return `你好！

感谢你的来信！你的笔友一直很喜欢收到你的消息。

看起来你的回信额度已经用完了。如果想继续这段通信，可以在这里获取更多额度：

👉 获取更多回信：${process.env.BASE_URL || "https://mindfulpenpal.com"}/#pricing

我们有多种实惠的套餐可供选择，单封信低至 $0.99 起。

你的笔友随时准备着！

温暖问候，
Mindful PenPal 团队`;
  }

  if (lang === "german") {
    return `Hallo!

Vielen Dank für deinen Brief! Dein Brieffreund freut sich immer, von dir zu hören.

Es sieht so aus, als hättest du alle verfügbaren Brief-Credits aufgebraucht. Um das Gespräch fortzusetzen, kannst du hier weitere Briefe erhalten:

👉 Mehr Briefe: ${process.env.BASE_URL || "https://mindfulpenpal.com"}/#pricing

Wähle aus günstigen Briefpaketen ab nur $0.99.

Dein Brieffreund ist da, wann immer du bereit bist!

Herzliche Grüße,
Das Mindful PenPal Team`;
  }

  if (lang === "french") {
    return `Bonjour !

Merci pour votre lettre ! Votre correspondant est toujours ravi de vous lire.

Il semble que vous ayez utilisé tous vos crédits de lettres. Pour continuer la conversation, vous pouvez obtenir plus de lettres ici :

👉 Plus de lettres : ${process.env.BASE_URL || "https://mindfulpenpal.com"}/#pricing

Choisissez parmi des forfaits abordables à partir de $0.99.

Votre correspondant vous attend !

Chaleureusement,
L'équipe Mindful PenPal`;
  }

  if (lang === "spanish") {
    return `¡Hola!

¡Gracias por tu carta! Tu amigo por correspondencia siempre disfruta leyéndote.

Parece que has agotado todos tus créditos de cartas. Para continuar la conversación, puedes obtener más cartas aquí:

👉 Más cartas: ${process.env.BASE_URL || "https://mindfulpenpal.com"}/#pricing

Elige entre paquetes accesibles desde solo $0.99.

¡Tu amigo por correspondencia está aquí cuando lo necesites!

Con cariño,
El equipo de Mindful PenPal`;
  }

  if (lang === "korean") {
    return `안녕하세요!

편지를 보내주셔서 감사합니다! 펜팔 친구는 항상 당신의 소식을 기다리고 있어요.

아쉽게도 모든 편지 크레딧을 사용하신 것 같습니다. 대화를 계속하려면 여기서 추가 크레딧을 구매하실 수 있습니다:

👉 추가 편지: ${process.env.BASE_URL || "https://mindfulpenpal.com"}/#pricing

$0.99부터 시작하는 다양한 패키지를 선택하세요.

펜팔 친구가 기다리고 있습니다!

따뜻한 마음을 담아,
Mindful PenPal 팀`;
  }

  if (lang === "arabic") {
    return `مرحبًا!

شكرًا على رسالتك! صديق المراسلة يستمتع دائمًا بقراءة رسائلك.

يبدو أنك استخدمت جميع رصيد الرسائل المتاح. لمواصلة المحادثة، يمكنك الحصول على المزيد من الرسائل هنا:

👉 المزيد من الرسائل: ${process.env.BASE_URL || "https://mindfulpenpal.com"}/#pricing

اختر من بين باقات بأسعار معقولة تبدأ من $0.99 فقط.

صديق المراسلة في انتظارك!

مع أطيب التمنيات،
فريق Mindful PenPal`;
  }

  if (lang === "japanese") {
    return `こんにちは！

お手紙ありがとうございます！ペンパルはいつもあなたからのお便りを楽しみにしています。

残念ながら、ご利用可能なお手紙クレジットをすべて使い切ったようです。会話を続けるには、こちらからクレジットを追加できます：

👉 追加クレジット：${process.env.BASE_URL || "https://mindfulpenpal.com"}/#pricing

$0.99からのお手頃なパックをご用意しています。

ペンパルはいつでもお待ちしています！

心を込めて，
Mindful PenPal チーム`;
  }

  return `Hi there!

Thank you for writing! Your pen pal always enjoys hearing from you.

It looks like you've used all your available letter credits. To continue the conversation, you can get more letters here:

👉 Get more letters: ${process.env.BASE_URL || "https://mindfulpenpal.com"}/#pricing

Choose from affordable letter packs starting at just $0.99, or subscribe for regular correspondence.

Your pen pal is here whenever you're ready!

Warmly,
The Mindful PenPal Team`;
}
