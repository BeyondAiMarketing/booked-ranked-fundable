# Design Brief: Content Creation Studio + Master Agent + Lead AI Intelligence

## Direction

Premium command-center SaaS orchestrator combining Owl Alpha AI agent management with AI-powered creative content generation. Multi-tab creation studio (video, image, ad copy, blog), unified master agent god-view panel, and lead intelligence enrichment indicators.

## Tone

High-stakes orchestration interface for SaaS admins and agency partners — command-center premium, cinematic depth, glassmorphic luxury, visually distinctive per content type. Zero generic AI look.

## Differentiation

Content Creation tabs use distinct accent colors (video=cyan, image=gold, copy=purple, blog=emerald) with visual underline and icon tint. Master Agent panel shows god-view orchestrator with all agents, statuses, and neural-network-like connections. Lead scoring uses animated progress bars and enrichment badges. Owl Alpha is the AI backbone for all agent tasks, seamlessly wired into background.

## Color Palette

| Token | OKLCH | Role |
|-------|-------|------|
| `--content-tab-video-accent` | 0.62 0.2 200 | Video tab header underline & icon (cyan) |
| `--content-tab-image-accent` | 0.75 0.16 75 | Image tab header underline & icon (gold) |
| `--content-tab-copy-accent` | 0.58 0.22 290 | Ad copy tab header underline & icon (purple) |
| `--content-tab-blog-accent` | 0.62 0.18 155 | Blog tab header underline & icon (emerald) |
| `--master-agent-panel-bg` | 0.12 0.01 280 | Master Agent panel background (deep navy) |
| `--master-agent-border` | 0.62 0.2 200 | Master Agent border & accent (cyan) |
| `--lead-enriched-score` | 0.62 0.18 155 | Lead enrichment status (emerald) |
| `--lead-scoring-bar` | 0.75 0.16 75 | Scoring progress bar fill (gold) |
| `--lead-verified-badge` | 0.62 0.2 200 | AI-verified badge glow (cyan) |

## Typography

- Display: Space Grotesk, 1.5rem / 800wt — Master Agent title, content studio header
- Subhead: Space Grotesk, 1.125rem / 700wt — Tab buttons, agent names
- Body: Inter, 1rem / 500wt — Agent status text, lead enrichment labels
- Mono: GeistMono, 0.875rem / 500wt — Scoring percentages, status indicators

## Elevation & Depth

Master Agent panel is elevated container with 12px blur and dual-shadow (outer + inset glow). Content tabs have colored underlines instead of full background. Each tab's content area uses 6–8px blur glassmorphic cards. Lead scoring bars use gradient fills with smooth transitions. Agent cards float with cyan/purple accent glows on hover.

## Structural Zones

| Zone | Background | Border | Shadow | Notes |
|------|-----------|--------|--------|-------|
| Content Tab Header | 0.12 0.01 280 | Per-tab color / 30% | None | Flex layout, colored underline on active |
| Master Agent Container | 0.12 0.01 280 | 0.62 0.2 200 / 30% | 0 12px 40px | Elevated god-view panel, dual shadow |
| Agent Card (in Master) | 1 0 0 / 4% glass | 1 0 0 / 10% | 0 4px 12px | Hovers lift 4px, cyan accent glow |
| Lead Enrichment Row | 0.14 0.014 280 | None | None | Shows score bar + badge + verification dot |
| Content Workspace | 0.1 0.012 280 | 1 0 0 / 6% | Inset 0 2px 8px | Full-width white-space for creation |

## Spacing & Rhythm

Content tabs use full-width flex with 0px gap (tabs touch). Master Agent 2rem padding, header 1.5rem bottom padding. Agent cards in 280px+ grid, 1.5rem gap. Lead enrichment labels 0.375rem padding (compact), scoring bar 6px tall. Tab transitions use 250ms smooth easing.

## Component Patterns

- **Content Tab**: Flex button, colored border-bottom (3px), hover color tint, active state full opacity + bold weight
- **Master Agent Panel**: Glassmorphic container with inset glow, cyan border, elevated shadow
- **Agent Card**: 1.5rem padding, glassmorphic background, hover lifts 4px, status dot (active=emerald glow, idle=muted, attention=amber pulse, error=red)
- **Lead Enrichment**: Row layout with score label + progress bar (0–100% width) + badge + verification dot
- **Scoring Bar**: 6px height, gradient fill (amber→emerald), 0.4s smooth animation per update

## Motion

- **Tab switch**: 250ms color/border transition, no page reload animation
- **Master Agent**: Panel enters slide-in-left 0.4s on load, agent cards stagger 0.1s per card
- **Agent status dot**: Pulse 2s ease-in-out for active/attention states, no animation for idle
- **Lead scoring**: Progress bar fill animates 0.4s ease-out on data update
- **Content workspace**: 300ms fade-in on tab switch

## Constraints

- All content tabs render in same panel (no navigation away) — switching is tab toggle only
- Master Agent displays all accounts' agents in god-view (Super Admin only)
- Owl Alpha wiring is invisible in UI — no model selector in content creation (default to Owl Alpha)
- Lead scoring bars always visible next to lead names in lists
- Enrichment badges are read-only indicators (no click action)
- Tab underlines are always colored per tab, active state adds font weight + full text opacity

## Signature Details

1. **Multi-color tab system** — Each content tab (video, image, copy, blog) has its own accent color with visual underline, allowing users to instantly recognize which tool they're in
2. **Master Agent god-view** — Top-level orchestrator showing all agents in a grid, each with live status dot and connection to Owl Alpha (invisible wiring)
3. **Lead scoring animation** — Progress bars fill smoothly from left to right as enrichment happens, creating visual feedback without page reloads
4. **Cyan verification glow** — AI-verified leads get a subtle cyan dot with glow, signaling Owl Alpha enrichment completed
