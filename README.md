# Bursar

HOA compliance and operations platform for volunteer board members in California.

## What Is This

Bursar is a vertical SaaS platform ("Board Command Center") that automates the workflows consuming 6+ hours/week of unpaid volunteer board time: invoice approval, Davis-Stirling compliance, document management, and meeting intelligence.

**Target:** Self-managed California HOAs (15,000–20,000 boards, ~87,500 addressable seats).

## Current Status: Validation Sprint

8-week validation sprint. Budget: $3,800. Decision date: April 20, 2026.

### What's Built

| Asset | Status | URL |
|-------|--------|-----|
| Landing page (Variant B: Invoice Pain) | ✅ Live | [usebursar.com](https://usebursar.com) |
| Landing page (Platform variant) | ✅ Live | [usebursar.com/variants/platform.html](https://usebursar.com/variants/platform.html) |
| Landing page (Compliance variant) | ✅ Live | [usebursar.com/variants/compliance.html](https://usebursar.com/variants/compliance.html) |
| Compliance audit (20-question survey) | ✅ Live | [usebursar.com/audit/](https://usebursar.com/audit/) |
| Blog (4 posts + RSS) | ✅ Live | [usebursar.com/blog/](https://usebursar.com/blog/) |
| Product wireframes (5 screens) | ✅ Live | [usebursar.com/wireframes/](https://usebursar.com/wireframes/) |
| GA4 tracking | ✅ All pages | `G-5YBSD4N7N0` |
| Apps Script backend | ✅ Deployed | Waitlist + audit data capture |
| Drip email engine | 🔄 Needs redeploy | 3-email sequence (immediate results, day 3, day 7) |
| Ad campaigns | ⏳ Not launched | Google/FB/LinkedIn plans ready |

### Tech Stack

- **Hosting:** GitHub Pages from `/docs` directory, custom domain `usebursar.com`
- **Backend:** Google Apps Script (form submissions → Google Sheets + drip emails)
- **Analytics:** GA4 with 7 custom events (audit_start, audit_progress, audit_complete, etc.)
- **Blog:** Markdown → HTML build (`node build-blog.js`)
- **Design:** Inter font, slate navy (`#0f172a`) + blue accent (`#2563eb`)
- **Data stores:** Google Sheets (waitlist: `1I0gLzKEfBM...`, audit: `199Yod765uQ...`)

### GO/NO-GO Criteria (need 4 of 5)

1. 5%+ landing page conversion on best variant
2. 50+ compliance audits completed, 40%+ non-compliant
3. No incumbent with >20% adoption in board-facing tools
4. 10+ conversations confirming WTP of $99–199/mo
5. 1 CPA partner (verbal interest)

### Competitive Landscape

Key finding from Hans's research: **ZERO competitors automate Davis-Stirling compliance.** Strongroom validates invoice pain point. PayHOA closest competitor ($49–275/mo) but serves managers, not boards. No player holds >5% market share.

## Architecture

```
bursar/
├── docs/                    # GitHub Pages site root
│   ├── index.html           # Main landing (Variant B)
│   ├── audit/index.html     # Typeform-style compliance audit
│   ├── blog/                # Generated blog HTML + RSS
│   ├── wireframes/          # Interactive product wireframes
│   ├── variants/            # A/B test landing pages
│   ├── css/                 # style.css, audit.css
│   └── js/                  # main.js, audit.js, submit.js
├── blog/posts/              # Markdown blog source files
├── backend/                 # Apps Script (gitignored — contains API keys)
├── build-blog.js            # Blog build script
└── *.md                     # Research docs, analysis, project summary
```

## Research Documents

| Document | Description |
|----------|-------------|
| `BURSAR_HOA_PROJECT_SUMMARY.md` | Master plan — market, product, validation, financials |
| `HOA_CALIFORNIA_OPPORTUNITY_ANALYSIS.md` | CA market deep-dive, 50K+ HOAs |
| `CPA_Technology_Landscape_Research_2025 0.2.md` | CPA industry analysis |
| `INVESTMENT_ANALYSIS.md` | Critical assessment of original CPA roll-up thesis |
| `HOA_NEXT_STEPS_AND_VALIDATION_PLAN.md` | Original 780-line detailed plan |

## Financial Projections (Base Case)

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| HOAs on platform | 100 | 450 | 1,200 |
| Active seats | 280 | 1,710 | 5,400 |
| Platform ARR | $118K | $718K | $2.27M |
| CPA review revenue | $34K | $135K | $287K |
| **Total revenue** | **$152K** | **$853K** | **$2.55M** |

Pricing: $35/seat/month. CPA reviews: $995–1,495/year add-on.

## Built By

[EIR-OS](https://github.com/davidjette/eir-os) multi-agent system — 6 agents collaborated on this project:
- **Dev** — Site infrastructure, audit engine, GA4 wiring, Apps Script backend
- **Kurt** — Landing page copy, compliance audit questions, blog posts, drip email templates
- **Ed** — GA4 funnel plan, ad campaign strategy, UTM tracking
- **Hans** — Competitive intelligence (26KB report, 6 competitors analyzed)
- **Ada** — Financial modeling (5 business models, unit economics)
- **Coco** — Design review and visual polish

## Domains

- `usebursar.com` — Primary (GitHub Pages via CNAME)
- `usebursar.ai` — Redirects to `.com` via 301
