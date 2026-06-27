# Booked Ranked Fundable (BRF)

**BRF is a premium all-in-one platform for reputation management, social media marketing, and business automation** — built for local service businesses and white-label agencies.

## What BRF Does

BRF brings together every tool a modern local business or agency needs to get found, build trust, and grow:

### Reputation Management
- Automated review request campaigns across Google, Yelp, and more
- Reputation inbox with AI-powered sentiment monitoring and reply suggestions
- Review flow automation with niche-specific messaging
- Social proof pipeline that turns reviews into shareable content

### Social Media Marketing & Automation
- Multi-platform social scheduler with content calendar
- AI social content generator tailored to your niche
- Social engagement automation and audience growth tools
- Social lead capture funnels with ROI dashboards
- Social proof pipeline for turning engagement into conversions

### AI Agents & Automation
- AI inbound voice agent (ElevenLabs voices) with full call logging
- AI chat widget and website agent with custom training
- SMS autopilot and bulk messaging automation
- Outreach engine with drip campaigns, bounce handling, and lead segmentation
- Reply intelligence inbox for automated lead nurturing

### CRM & Lead Generation
- Full CRM with Kanban pipeline, calendar sync, and deal tracking
- AI lead intelligence and B2B lead discovery
- CSV lead import and filtering
- Client health dashboards and weekly reporting
- Competitive intelligence tools

### SEO & Local Visibility
- GBP (Google Business Profile) management and optimization
- AI geo-targeted SEO agent
- Browser-based SEO audit with actionable recommendations
- Niche website studio and landing page builder with AI content generation

### Agency & White-Label Tools
- White-label hub with fully branded dashboards
- Client onboarding wizard with step-by-step setup
- Multi-tenant role-based access (Super Admin, Agency, Client, Demo)
- Go Live dashboard with 25+ third-party integrations

### Additional Modules
- Newsletter module with subscriber management, merge tags, scheduling, and analytics
- Business credit builder and fundability scoring
- 3D property and site scanner for Real Estate, Roofing, and Restoration
- Estimates, appointments, and invoicing tools
- Open-source AI gateway with multi-provider routing (OpenRouter, NVIDIA, Ollama)

---

## Tech Stack

- **Frontend:** React, TanStack Router, Tailwind CSS (OKLCH design tokens), Vite, pnpm
- **Backend:** Motoko on Internet Computer Protocol (ICP)
- **AI Gateway:** Node.js, multi-provider routing with circuit breaker and rate limiting
- **Infrastructure:** ICP canisters, Dockerfile for gateway deployment

## Development

```bash
# Frontend (from src/frontend/)
pnpm install --prefer-offline
pnpm typecheck
pnpm build

# Backend (from src/backend/)
mops install
mops check --fix
mops build

# Restricted sandbox fallback (skips mops network failures after retries)
MOPS_ALLOW_OFFLINE=1 bash ../../scripts/mopsw.sh check-with-retry --fix
MOPS_ALLOW_OFFLINE=1 bash ../../scripts/mopsw.sh build-with-retry

# Generate frontend bindings (from root)
pnpm bindgen
```

---

*This source code was exported from [Caffeine](https://caffeine.ai/)*
