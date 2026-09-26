# BISYNC UI Rebuild Prompt (for Antigravity)

Copy everything below into Antigravity. It's written as one complete prompt.

---

## The task

I have a working AI assistant application — backend, RAG/vector search, and LLM connection are already fully implemented. Rebuild only the UI/frontend to match the design below, exactly, without touching or breaking any existing logic, API calls, state management, or event handlers.

**Critical constraint:** Preserve every existing function call, prop, and handler exactly. Only change JSX/HTML structure, CSS, layout, colors, typography, and animations. If a component needs restructuring, keep all logic intact and just move/re-style the markup.

**Brand:** BISYNC / "BISync AI"

I'm giving you exact specs for 4 confirmed screens below, plus a full design system. **I have more screens in my Figma prototype than I could capture precisely.** For any screen not explicitly described below, apply the design system tokens (colors, shapes, typography, gradient background, pill components) consistently and use the 4 confirmed screens as your stylistic reference — don't leave unmatched screens in their old style; restyle every screen in the app to this same visual language, inferring reasonable layouts from the current UI's existing structure.

---

## Design system (apply to every screen, confirmed and inferred alike)

**Color palette (exact hex, sampled directly from the design):**
- Deep indigo `#300060` — navbar background, dark icon/button fills, footer accents, send-button
- Primary vivid purple `#5D00B7` — main CTA buttons, section backgrounds, active states
- Purple gradient `#6A00C4` → `#300060` — used on pill buttons over the AI chat background
- Orange accent `#F16104` (text) / `#F17B32` (icon fill) — active nav link, one icon per feature card
- Black `#000000` — footer
- Light neutral `#F4F4F4` — neutral cards
- Lavender gradient `#C4B6CE` → `#D1B8E3` — catalog page banner
- AI chat background gradient: white `#FFFFFF` (corner) fading into vivid purple-magenta `#B14FE0`–`#CA83E6` (opposite corner) — **this gradient is the signature visual of the whole AI experience; use it as the background on every AI-assistant-related screen, not flat white**

**Typography:**
- Headlines mix a bold rounded/geometric sans-serif with an **italic serif** used only on emphasis words (e.g. "simpler.", "smarter." in the hero) — looks like Playfair Display italic or similar
- The AI assistant's "how can we help you today?" style headings are fully serif, black, large
- Body copy and nav links: clean sans-serif
- Active nav state: orange `#F16104`; inactive: white on dark navbar, dark gray elsewhere

**Shape language (apply everywhere):**
- Fully pill-shaped / rounded-full: navbar container itself (floats with margin, not edge-to-edge), all primary/secondary buttons, all tags and badges, chat input fields
- Large rounded corners (~16–24px) on cards and panels
- Soft, heavily-blurred purple circular blobs (`#300060`-ish) as recurring decorative background elements — reuse these on any new/inferred screen that needs visual interest in empty space

**Recurring components to reuse across all screens:**
- The floating pill navbar (logo, nav links, Language pill, "BISync AI" pill button)
- The two-tone Venn-circle icon style (one colored circle overlapping one gray circle) for any feature/category card
- The pill-shaped tag/badge (used for IS codes, filters, popular queries)
- The rounded, semi-translucent chat input with a small circular send button anchored to its right edge

---

## Confirmed screen specs

### Screen 1 — Marketing homepage
- Floating rounded navbar (`#300060`): "BISYNC" logo (letter-spaced), nav links (Home / Standards / BIS Services), outlined "Language" pill, white filled "BISync AI" pill button
- Hero: black headline "Standards made *simpler*. Compliance made *smarter*." (italic serif on emphasis words), gray subtext, solid purple `#5D00B7` pill "Start for free" + white pill outlined in `#5D00B7` "Log In"
- Hero right side: abstract vertical-stripe gradient (purple → orange → white/cream) in a soft triangular silhouette bleeding off the edge
- Features section: black heading "Everything you need to navigate Indian Standards." + 4 cards (2-col grid): one active card filled `#300060` with a large orange circular icon, white label "Ask BISync AI"; three neutral `#F4F4F4` cards with two-circle Venn icons and bold black labels ("Compliance Checker," "BIS Services," "Find my Standard")
- Blurred purple decorative circles behind this section and the next
- Product showcase: grayscale product photography with blurred purple circle overlays, bold heading "Find the right standard for your product."
- Newsletter band: solid `#5D00B7`, white bold heading, underline-style email input, white pill "Subscribe ↗"
- Footer: solid black, 3 label columns (Address / Email / Number) with repeated placeholder rows, purple pill "Let's Chat ↗" top-right, "BISYNC" wordmark bottom-left

### Screen 2 — Standards Catalog page
- Lavender gradient banner (`#C4B6CE` → `#D1B8E3`) with dark purple heading "Indian Standards Catalog" + subtitle
- Rounded gray search bar, placeholder "Search by IS code, product name, or keyword…"
- Filter pills: "All" active in solid `#300060` with white text; others neutral gray outlined
- "Showing N standard(s)" label
- 3-column card grid: `#F4F4F4` rounded cards, each with a small purple pill tag (e.g. "IS 1293:2019"), bold title, gray body text

### Screen 3 — AI Assistant empty state
- Full-bleed signature gradient background (white → purple-magenta)
- Small dark purple play/back triangle icon, top-left
- Top-right pill button, gradient fill `#6A00C4` → `#300060`, label "BISync AI"
- Centered large serif black heading "how can we help you today?", gray subtext
- Large rounded, semi-translucent purple-tinted chat input, placeholder "Ask about a product, standard, certification or compliance requirement…", small solid `#300060` circular send button (up-arrow icon) anchored to its right edge
- "Popular Queries:" label + 3 outlined/translucent pill buttons with sample queries

### Screen 4 — AI Assistant active conversation
- Same signature gradient background
- User message: right-aligned rounded gray pill/bubble
- AI response: plain left-aligned dark text directly on the gradient (no bubble), structured with numbered sections, bold sub-labels, bullet sub-points, generous line-height
- Same top bar persists (play icon top-left, gradient pill top-right)
- Same rounded input anchored at the bottom for follow-ups

---

## Extra / inferred screens — how to handle them

My Figma prototype has additional screens beyond the 4 above, including at least:
- **A conversation view with a persistent left sidebar** (solid purple `#5D00B7` or `#300060`, ~260–280px wide) containing a "New Chat" button, a "Search Chat" input, and a scrollable list of past chat titles (plain text list) — the main panel to its right keeps the same gradient background and message styling as Screen 4
- **A chat search view** — same sidebar, but the main panel shows a "Search chats…" input with results listed below instead of an active conversation

For these and any other screens in the prototype not covered above:
1. Reuse the exact color tokens, pill shapes, and typography from the design system — don't invent new colors or shapes
2. Reuse the signature gradient background on any screen that's part of the AI assistant flow
3. Reuse the sidebar's purple fill and plain-list styling to match the navbar/button purple already defined
4. Keep interactive elements (search chats, new chat, history items) simple, flat, and text-based — consistent with the minimal, content-forward feel of the confirmed screens
5. If a screen's exact layout is ambiguous, prioritize matching the *feel* (generous whitespace, pill everything, soft blurred purple accents, serif emphasis on key headings) over guessing exact pixel positions — and ask me if a specific piece of functionality doesn't map cleanly onto the new layout

---

## What to preserve exactly (do not touch)

- All RAG/vector search calls and LLM API integration
- Chat state management and history persistence logic
- Existing routing between screens
- Existing component/file names other parts of the app depend on

## Deliverable

Rebuilt components matching the exact colors, gradients, pill shapes, and typography described above — applied consistently across every screen in the app, confirmed or inferred — with zero regressions to existing functionality. Ask before guessing on anything ambiguous.
