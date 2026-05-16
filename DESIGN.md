# Design Brief: Booked Ranked Fundable — Premium SaaS + Analytics Dashboards

**Tone:** Premium dark SaaS. Purple-driven, urgent, refined. Information-dense productivity.  
**Aesthetic:** Dark mode only. High-contrast OKLCH tokens. Glassmorphism, gradient accents, smooth motion. Dense layouts optimized for power users and product analytics.
**New Focus (V140+):** Newsletter Management (`/newsletters`), Outreach Analytics Dashboard (`/outreach-analytics`). Dense table layouts, stat cards, engagement funnels, subscriber/lead/campaign tracking. 3D Property & Site Scanner for Real Estate, Roofing, Restoration.

## Palette (OKLCH)

| Token | Values | Use |
|-------|--------|-----|
| `--primary` | 0.58 0.22 290 | Purple CTAs, active states, focus ring |
| `--chart-1` (emerald) | 0.62 0.18 155 | Success, paid, completed, confirmations, "Schedule a Showing" CTA |
| `--chart-3` (amber) | 0.72 0.18 75 | Warning, pending, attention |
| `--destructive` (rose) | 0.58 0.22 25 | Errors, delete actions, critical |
| `--background` | 0.1 0.012 280 | Page bg |
| `--card` | 0.14 0.014 280 | Card surfaces |
| `--foreground` | 0.96 0.008 280 | Text (white) |
| `--muted-foreground` | 0.62 0.02 280 | Secondary text |

## Newsletter Management (`/newsletters` Page)

### Subscriber List
- **Layout:** Full-width table, alternating row backgrounds (`bg-card` / `bg-card` -6% darker); grid: Name | Email | Status | Subscribed Date | Actions
- **Subscriber Badges:** Active (emerald), Bounced (rose), Unsubscribed (muted grey); 0.7rem uppercase, 600wt
- **Search/Filter:** Input bar top, niche selector, status filter pills (purple on active)
- **Density:** 0.75rem padding, 0.875rem font, 1px bottom border on rows

### Campaign Composer
- **Container:** Gradient dark card (bg-card → bg darker), 2rem padding, rounded, border subtle
- **Fields:** Subject, From Name, Merge Tags selector, Body (textarea), Schedule Date/Time
- **Merge Tag Pills:** Small purple-accent pills (font 0.75rem), insertable into body
- **Actions:** Preview button (secondary), Schedule button (purple primary)

### Analytics Card Grid
- **Layout:** 4-up stat cards (mobile: 2-up, 1-up stack): Total Subscribers, Open Rate %, Click Rate %, Unsubscribe Rate %
- **Number:** 2rem 800wt, purple→emerald gradient text
- **Label:** 0.75rem uppercase grey, 600wt
- **Hover:** bg-card darker, border → purple 20%

### Recent Campaign Performance
- **Table:** Campaign name | Sent | Opened | Clicked | Bounce Rate | Actions
- **Rows:** Hoverable, alternating subtle bg, 0.75rem padding
- **Badges:** Draft, Scheduled, Active, Complete (status colors by semantic tokens)

## Outreach Analytics Dashboard (`/outreach-analytics` Page)

### Tab Navigation
- **Tabs:** Overview | Campaigns | Leads | Engagement
- **Style:** Flex row, underline active (purple), hover text brightens, 0.875rem 600wt
- **Interaction:** Tab switch shows relevant content, no page reload

### Overview Tab
- **Key Metrics Grid:** Total Outreach | Delivery Rate | Response Rate | Avg Response Time (4-card 250px min, responsive)
- **Recent Activity:** Last 5 campaigns/leads sent, mini list with timestamp

### Campaigns Tab
- **Performance Table:** Campaign Name | Status | Sent Count | Open % | Click % | Reply % | Actions (Pause/Resume/View)
- **Density:** 1rem padding, grid 6 cols, row hover bg brighter
- **Status Badge:** Active (purple), Paused (grey), Complete (emerald)

### Leads Tab
- **Filterable Lead List:** Name | Email | Status | Campaign | Bounce Status | Last Contact Date | Actions (View/Resend/Mark Bounced)
- **Bounce Indicators:** Bounce badge (rose), Sent badge (purple), Replied badge (emerald)
- **Search:** Filter by name/email/status top of table
- **Density:** 0.75rem padding, 0.875rem font, 1px borders

### Engagement Tab
- **Funnel Visualization:** Sent → Delivered → Opened → Clicked → Replied (5 stages)
- **Per Stage:** Label | Progress bar (purple→emerald gradient) | Count | Percentage
- **Bar Height:** 24px, gradient fill animated, label center-aligned in bar

## 3D Property & Site Scanner (V130 — Client Dashboard)

### Upload Zone
- **Layout:** Full-width drag-and-drop area with dashed purple border; 3rem padding; states: default (grey), hover (purple 70%), active (purple bg 10%)
- **Content:** Cloud upload icon (3rem), title "Upload Property Photos", description text (0.875rem), limit badge "8–60 photos max" (purple, uppercase, small font)
- **Interaction:** Drag photos or click to select; accepts JPEG, PNG, WebP; shows photo count incrementally
- **Mobile:** Tap-friendly, full-width, no scroll issues

### Photo Gallery
- **Layout:** Grid of thumbnails below upload zone; 120px min aspect ratio (1:1 square); responsive 4–6 cols on desktop, 2 cols on mobile
- **Per Thumbnail:** Image preview, emerald "Ready" badge (top-left), remove button (✕ in red circle, hidden until hover)
- **Behavior:** Thumbnail shows on file load; remove button slides in on hover; delete confirms before removing

### Processing Status Card
- **Display:** When photos uploading/processing
- **Content:** Processing icon (spinning 📍, 2.5rem), title "Processing Your Model", description, progress bar (purple→emerald gradient, `processing-fill` 3s)
- **Behavior:** Disappears on completion, model card appears in gallery

### Model Gallery
- **Layout:** Grid 280px min cards on desktop; staggered `fadeInUp` on arrival
- **Card Structure:** Thumbnail (200px height, dark gradient bg) | Info section (1.25rem padding)
- **Per Card:**
  - **Badge:** "Ready" (emerald top-left on thumbnail)
  - **Name:** Property/job address (1rem, 700wt, white, ellipsis overflow)
  - **Meta:** View count icon + number, Date icon + timestamp (0.75rem grey)
  - **Actions:** "View 3D" (purple), "Share" (purple), "Delete" (red on hover)
  - **Hover:** Translate -4px, shadow glow, border → purple 30%

### 3D Viewer Container
- **Size:** 16:9 aspect ratio, full-width max-width
- **Background:** Dark gradient (0.1 0.012 280), 2px border (1 0 0 / 10%)
- **Canvas:** 100% width/height, handles WebGL render

### Viewer Controls Bar
- **Position:** Fixed bottom center, 1.5rem above canvas bottom
- **Style:** Glassmorphic (bg 60% black, blur 10px, border 1 0 0 / 20%), purple accent border (optional)
- **Buttons:** Rotate ↻, Zoom In 🔍+, Zoom Out 🔍-, Pan ⊕ (40×40px each, purple hover state)
- **Interaction:** Click or tap to activate; cursor feedback (pointer)

### Lead Capture CTA Overlay
- **Position:** Fixed on viewer, bottom center, z-index 20, 2rem from bottom
- **Button:** Emerald gradient (0.62 0.18 155 → 0.58 0.2 145), 1rem padding 2rem, 700wt, white text
- **Niche-Specific Copy:**
  - Real Estate: "Schedule a Showing"
  - Roofing: "Get Your Free Estimate"
  - Restoration: "Request Damage Assessment"
- **Interaction:** Hover translates -2px, shadow grows; click opens lead capture form inline or modal
- **States:** Hover shadow glow (0.62 0.18 155 / 50%), active no translate

### Share Modal
- **Trigger:** "Share" button on model card opens overlay
- **Content:** Modal 500px max-width, centered
- **Sections:**
  - **Shareable URL:** Text input (dark bg, 0.875rem mono font), copy button (purple, small)
  - **Embed Code:** Dark code block (max-height 200px, overflow auto), monospace 0.75rem
- **Actions:** Close (✕), Copy to clipboard (toast confirmation)

### Super Admin Toggle (Module Access Control Table)
- **Location:** AdminPage.tsx Module Access Control table, new row for "3D Scanner"
- **Content:** Label | Toggle switch (off/on, purple when on) | Description "Enable 3D scanning for client"
- **Behavior:** Toggle updates backend feature flag per account; reflects immediately in client dashboard
- **Niche Gating:** Hidden unless account's niche is Real Estate, Roofing, or Restoration

### Empty State
- **Display:** When no models processed yet
- **Content:** Icon (📦 or 🎬, 3rem), title "No 3D Models Yet", text "Upload photos to get started"
- **Background:** Subtle accent bg, grey border, centered, 3rem padding

## Motion Choreography

| Animation | Duration | Timing | Use |
|-----------|----------|--------|-----|
| `waveform-pulse` | 0.6s | ease-in-out infinite | Phone audio bars |
| `slide-up` | 0.4s | cubic-bezier(0.34,1.56,0.64,1) | Green overlay entrance |
| `checkmark-bounce` | 0.6s | cubic-bezier(0.34,1.56,0.64,1) 0.2s delay | Confirmation checkmark |
| `fadeInUp` | 0.4s | ease-out | Card/text entrance, model cards |
| `fadeInLeft` | 0.5s | ease-out cascade | Revenue line items |
| `overlay-fade-in` | 0.3s | ease-out | Backdrop blur transition |
| `act-fill` | 1s | ease-out | Progress bar fill |
| `processing-fill` | 3s | ease-out | 3D processing bar |
| `pulse` | 2s | ease-in-out infinite | Processing icon animation |

## Component System — Analytics & Newsletter

**Subscriber Row:** Grid layout, alternating bg, 0.75rem padding, hover brightens  
**Subscriber Badges:** Active (emerald), Bounced (rose), Unsubscribed (grey); 0.7rem uppercase  
**Campaign Stat Card:** Center-aligned, 2rem gradient number, 0.75rem grey label, hover border  
**Campaign Table Row:** Grid 6-col, hover bg brighten, cursor pointer  
**Lead Row:** Grid 5-col, similar to campaign, status badges embedded  
**Engagement Funnel:** Stage name | gradient bar | percentage; animated fill  
**Analytics Tab:** Underline active (purple), flex row, 0.875rem 600wt labels  
**Overview Metrics:** 4-up grid (responsive), 250px min, dark cards, gradient numbers

## Component System — 3D Scanner

**Upload Zone:** Dashed purple border, hover brightens, active fills with purple tint  
**Photo Thumbnails:** 120px square, dark bg, white border, remove button on hover  
**Model Cards:** 280px min, dark surface, thumbnail top, info bottom, hover -4px + glow  
**Viewer Container:** 16:9 aspect, dark gradient bg, WebGL canvas, control bar bottom  
**Control Bar:** Glassmorphic fixed bottom, 4 control buttons, purple hover  
**CTA Button:** Emerald gradient, 1rem padding, shadow glow, niche-specific copy  
**Share Modal:** Centered 500px, URL input + code block, copy button  

## Backend (Motoko Stable Storage)

- **3D Scanner Feature Flag:** Per-account toggle, niche-locked (Real Estate/Roofing/Restoration only)
- **Model Metadata:** Property name, upload date, view count, processed status, shareable URL
- **Photo Storage:** Indexed by model ID, sorted by upload order
- **Lead Captures:** CTA clicks logged by model and niche

## Interaction Rules

- **No shift on load:** Upload zone renders full-width; photos load incrementally into grid below
- **Processing transparency:** Status card shows real-time progress; no hidden waits
- **Viewer immersion:** Canvas full 16:9; controls glassmorphic; CTA overlaid (not below)
- **Niche UX:** CTA copy changes by niche; no cross-niche templates
- **Mobile-first:** Stack vertically; thumbnail grid 2 cols; viewer full-width; controls centered bottom
- **Touch-friendly:** Buttons 40px+; spacing 0.75rem+; no hover-only functionality

## Integration Points — Analytics & Newsletter

- **Newsletter Page:** `/newsletters` route, tab in main nav or campaigns section; Stripe+SendGrid backend; subscriber import CSV
- **Outreach Analytics:** `/outreach-analytics` route, live dashboard pulling from campaign/lead/engagement tables; Twilio/email-raw integration
- **Email-Marketing Extension:** Used for SendGrid/Listmonk integration, unsubscribe management, bounce handling
- **Email-Raw Extension:** Bulk outreach sending, SMTP provider selection

## Integration Points — 3D Scanner

- **Super Admin:** Module Access Control table new row with toggle switch (AdminPage.tsx context)
- **Client Dashboard:** New "3D Scanner" tab in service suite (tab bar / sidebar nav)
- **Lead Capture:** CTA click → trigger CRM pipeline entry with "3D Viewer Lead" source tag
- **Shareable Links:** Public model URLs with embed code for websites

## Web Scraper Tool Admin Page (`/admin/scraper-tool`)

### Layout & Structure
- **Split Panel Design:** Left form (40%) + Right results (60%) on desktop; stacked mobile
- **Tab Navigation:** Scraper | History | Presets (underline active in purple)
- **Surface Depth:** Form/results cards on `bg-card` (0.14 OKLCH), output on `bg-background` (0.1 OKLCH)

### Scraper Tab (Active)
- **URL Input:** Full-width, focus ring purple 20%, placeholder guidance
- **Selector Input:** CSS or XPath field with placeholder examples
- **Preset Buttons:** 4-grid (Page Title, Links, Emails, Product Cards); purple/15% hover glow
- **Mode Selection:** Static | Dynamic | Stealth dropdown
- **Output Format:** Text | HTML | Both
- **Result Limit:** 1–250 number input
- **Run Button:** Full-width purple primary, 700wt, 0.75rem padding
- **Progress Bar:** Purple→emerald gradient, animated width 0.3s, shows % text below
- **Batch Scrape:** Textarea (one URL per line), secondary grey button

### Results Panel (Right)
- **Header:** "Results JSON" + Copy + Download buttons (disabled if no results)
- **Output:** Monospace 0.75rem, dark bg, 1px border, scrollable, min 300px height
- **Default:** "Results will appear here" centered, muted

### History Tab
- **Table:** Last 50 runs; columns: URL | Selector | Status | Count | Duration | Timestamp
- **Status Badges:** Success (emerald), Error (rose), Pending (amber); inline with icons
- **Row Hover:** Brightens background, cursor pointer for drill-down
- **Density:** 0.75rem padding, alternating subtle bg rows

### Presets Tab
- **Card Grid:** 2-col (1-col mobile), per preset: title | code block | type badge | "Use" button
- **Code Display:** Dark bg, purple text, monospace, breakable

### Floating Action Buttons
- **Position:** Fixed bottom-right, stacked column (mobile: wrapped row)
- **Buttons:** Push to CRM (purple) | Enrich AI (emerald) | Export (grey); shadow glow, -2px hover translate
- **Mobile:** Horizontal wrap at bottom, hide labels on <600px, text-xs

### Alerts & States
- **Error Alert:** Rose/10% bg, rose border/text, AlertCircle icon
- **Info Alert:** Purple/10% bg, purple border/text, InfoIcon
- **Usage:** Robots.txt blocks, timeouts, dynamic content detected

### Responsive Breakpoints
- Desktop (>1024px): 2-col grid, side-by-side
- Tablet (768–1024px): Single col or 2-col depending on space
- Mobile (<768px): Stack vertically, FABs → horizontal row

### CSS Utilities
- `.scraper-container`, `.scraper-form-panel`, `.scraper-results-panel`
- `.scraper-results-output`, `.scraper-preset-button`
- `.scraper-progress-bar`, `.scraper-history-table`, `.scraper-status-badge`
- `.scraper-fab-group`, `.scraper-fab`, `.scraper-fab.secondary`, `.scraper-fab.tertiary`
- `.scraper-error-alert`, `.scraper-info-alert`
- `.scraper-tab-nav`, `.scraper-tab-button`, `.scraper-tab-button.active`

### Backend Integration
- **POST `/api/scraper/single`** — Single URL scrape
- **POST `/api/scraper/batch`** — Batch scrape with progress
- **GET `/api/scraper/history`** — Last 50 runs
- **POST `/api/crm/import-scrape`** — Push to CRM

### Future Enhancements
- Selector A/B testing
- Saved profiles
- Scheduled scrapes
- Webhook alerts
- AI selector suggestion
