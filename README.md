# Mindful PenPal

AI-powered pen pal service — users send emails to `penpal@mindfulpenpal.com` and receive warm, culturally-adapted replies in their own language.

## Architecture

```
User email → ImprovMX → Gmail (inbox) → Cron fetch → AI reply → Brevo → User inbox
                                              ↕
                                          Supabase DB
```

| Layer | Service |
|-------|---------|
| Email receiving | ImprovMX forwards `penpal@mindfulpenpal.com` → Gmail |
| Email sending | Brevo SMTP (from `penpal@mindfulpenpal.com`) |
| AI generation | Deepseek / OpenAI-compatible API |
| Payment | Creem.io (subscriptions + one-time credits) |
| Database & Auth | Supabase |
| Frontend | Next.js (App Router) |

## Core Features

### Email Pipeline

Two-phase processing triggered by cron:

1. **Intake** — Fetches unread Gmail messages, validates sender, deducts credits, schedules reply
2. **Dispatch** — Generates AI reply when scheduled time arrives, sends via Brevo

Reply delays vary by tier:

| Tier | Delay |
|------|-------|
| Free credits | 5–6 hours |
| Paid credit packs | 3–4 hours |
| Monthly subscription | 2–4 hours |
| Unlimited subscription | 1–2 hours |

### AI Persona System

Automatic cultural detection and language matching:

- **Language detection** — Replies in the sender's language (Chinese, German, French, Spanish, Japanese, Korean, Arabic, etc.)
- **Cultural adaptation** — Western users get open/direct style; East Asian users get poetic/subtle style; plus South Asian, Middle Eastern, and Latin American styles
- **Gender/name detection** — Subtle tone adjustments based on sender profile
- **Conversation memory** — Past letters are fed to the AI for continuity

### Payment & Credits

- New users: 3 free credits on registration
- Credit packs: 1 / 3 / 10 / 25 letters (one-time purchase)
- Subscriptions: Monthly Pen Pal (8 letters/month), Unlimited Letters
- Credits deducted at intake, prioritizing free credits first

## Project Structure

```
app/
  api/
    cron/process-emails/   # Cron endpoint for email processing
    credits/               # GET/POST user credits
    creem/
      create-checkout/     # Create Creem checkout session
      customer-portal/     # Creem billing portal
    webhooks/creem/        # Creem payment webhooks
  webhooks/creem/          # Webhook alias (same handler)
  dashboard/               # User dashboard
lib/
  ai.ts                    # AI reply generation + multilingual templates
  persona.ts               # Cultural detection + persona prompt builder
  gmail.ts                 # Gmail API (fetch + mark as read)
  brevo.ts                 # Brevo SMTP (send replies)
  email-processor.ts       # Two-phase email pipeline orchestrator
  creem.ts                 # Creem SDK client
config/
  subscriptions.ts         # Product tiers and pricing
types/
  creem.ts                 # Creem API types
  subscriptions.ts         # App subscription types
utils/supabase/
  subscriptions.ts         # DB operations: customers, subscriptions, credits
  service-role.ts          # Supabase service-role client
  middleware.ts            # Auth session refresh
proxy.ts                   # Request proxy (replaces deprecated middleware.ts)
supabase/migrations/       # Database schema
```

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd simple_saas
pnpm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

Required services:
- **Supabase** — Create project, get URL + keys
- **Creem.io** — Create products matching `config/subscriptions.ts`, get API key + webhook secret
- **Gmail API** — OAuth2 credentials for reading the forwarded inbox
- **Brevo** — API key for sending emails, verify `penpal@mindfulpenpal.com` as sender
- **Deepseek/OpenAI** — API key for AI generation

### 3. Database

Run the migrations in order against your Supabase project:

```bash
# Via Supabase CLI
supabase db push

# Or manually apply each file in supabase/migrations/
```

### 4. ImprovMX

Configure `penpal@mindfulpenpal.com` to forward to your Gmail account.

### 5. Creem Webhooks

Set webhook URL in Creem dashboard:

```
https://your-domain.com/webhooks/creem
```

### 6. Cron Job

Set up an external cron (e.g. cron-job.org, Vercel cron) to hit:

```
POST https://your-domain.com/api/cron/process-emails
Authorization: Bearer <CRON_SECRET>
```

Recommended interval: every 5 minutes.

## Deployment (Vercel)

```bash
vercel --prod
```

Set all `.env.example` variables in Vercel project settings. Key production values:

| Variable | Production Value |
|----------|-----------------|
| `BASE_URL` | `https://mindfulpenpal.com` |
| `CREEM_SUCCESS_URL` | `https://mindfulpenpal.com/dashboard` |
| `CREEM_API_URL` | `https://api.creem.io/v1` |
| `CREEM_API_KEY` | `creem_live_xxx` (live key) |

Do **not** set `HTTPS_PROXY` in production (only needed for development behind firewalls).

## Development

```bash
pnpm dev
```

For local testing with webhooks, use ngrok:

```bash
ngrok http 3000
```

Then update `BASE_URL` and `CREEM_SUCCESS_URL` in `.env.local` to the ngrok URL, and update the webhook URL in the Creem dashboard.

## License

Private — All rights reserved.
