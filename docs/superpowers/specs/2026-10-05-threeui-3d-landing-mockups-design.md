# Yaad ThreeUI-Inspired 3D Landing + Mockups Design

## Goal
Upgrade the existing Yaad landing page and mockup page into a refined ThreeUI-inspired 3D experience while preserving the final Yaad light-blue visual identity, the current content hierarchy, the current product screenshots, and the exact existing public GitHub Pages URLs.

## Existing public URLs that must remain unchanged
- Landing: `https://viksidd9.github.io/yaad-financial-memory/`
- Mockups: `https://viksidd9.github.io/yaad-financial-memory/mockups/`

## Design intent
ThreeUI's strongest patterns are procedural Three.js/WebGL hero scenes, depth, pointer-reactive motion, glass surfaces, scroll-linked perspective, and cinematic spatial composition. Yaad should borrow those principles without becoming visually noisy or game-like.

The finished experience should feel like a premium fintech product explaining an invisible semantic layer: money movement becomes a spatial Financial Memory graph, while product screenshots remain readable and authentic.

## Core visual concept: Financial Memory in 3D
A procedural 3D memory network becomes the site's signature visual.

### Scene nodes
The landing hero network contains:
- central Yaad node;
- HDFC account node;
- SBI account node;
- Arjun Kumar node;
- UrbanStep node.

### Scene relationships
- HDFC ↔ SBI: self-transfer relationship;
- Yaad ↔ Arjun Kumar: shared-expense / receivable relationship;
- Yaad ↔ UrbanStep: expected-refund / open-obligation relationship.

Relationships are rendered as subtle luminous curves or lines. No 3D label may contradict the actual demo facts.

## Landing page redesign

### Hero
- Preserve current hero copy and CTA wording.
- Add a responsive WebGL canvas behind/adjacent to the hero content.
- Use a procedural node-and-orbit scene with restrained blue/cyan light.
- Pointer movement subtly changes camera/parallax; no aggressive camera motion.
- Current `home-final-light.png` remains visible as a floating glass product panel with CSS perspective, depth shadow and pointer tilt.
- The 3D network and screenshot should read as one composition, not as two unrelated widgets.

### Proof bar
- Retain the four proof statements.
- Convert cards into shallow glass layers with slight Z-offset/tilt on hover.
- Avoid excessive rotation; maximum visual tilt should stay subtle.

### Three-scenario section
- Preserve the current three scenarios and copy.
- Reframe as three spatial stages: `DECIDE`, `ASK`, `WAIT`.
- Use scroll entrance and depth staggering.
- Each stage receives a small orbit/connection motif tied to the hero's Financial Memory visual language.

### Money Due Back section
- Keep the authentic `money-due-back-final-light.png` screenshot.
- Place it in a dimensional glass frame with a slow floating/parallax effect.
- Add a non-interactive animated open-obligation path around the section to reinforce “still in motion”.

### Permission architecture section
- Preserve `SEE / UNDERSTAND / ASK / ACT` wording and descriptions.
- Present as four stacked spatial layers with increasing depth.
- `ACT` remains visually separate from the first three to reinforce that authority is not inferred from access.

### CTA / First 1,000
- Keep existing CTA copy and form behaviour.
- Use restrained luminous glass and a slow background field.
- Do not add fake backend persistence or imply a real PhonePe partnership.

## Mockup page redesign

### Hero
- Add a smaller version of the Financial Memory network.
- Keep current headline, explanatory copy, legend and design principle.
- Use the 3D scene as context, not as a distraction from the interaction map.

### Interaction gallery
- Preserve all 13 interaction states and current text.
- Convert flat cards to perspective-aware glass frames with scroll reveal.
- Wide screenshots remain wide and legible; no cropping that hides UI evidence.
- Pair cards can use alternating Z-depth to create rhythm.
- Pointer tilt applies only on capable desktop devices.

### Transient states
- Needs You, Gnani transcript, clarification result, and stale/partial states remain HTML/CSS rather than rasterised images.
- Give these panels dimensional glass treatment while preserving exact text.
- No animated effect may make read-only evidence look editable or imply additional functionality.

### Financial Memory focus
- The Financial Memory screenshot becomes the spatial anchor of the lower gallery.
- Nearby interaction states visually branch from it via decorative connection lines.

## Technical architecture

### Static-site constraint
The site remains a static GitHub Pages site. No framework migration is required.

### Files
Modify:
- `index.html`
- `mockups/index.html`
- `styles.css`

Create:
- `three-memory.js` — procedural Three.js scene used by both pages;
- `motion.js` — CSS/DOM pointer tilt, scroll reveal and graceful capability detection;
- `tests/site-3d.spec.mjs` — static/DOM-level regression checks for required hooks, fallback states and unchanged URLs/content.

### Three.js
Use a pinned stable Three.js ES-module build from a trusted CDN. Current npm stable at design time is `0.186.1`; implementation should pin the exact version rather than use an unversioned latest URL.

### Scene implementation
- Use procedural geometry only; no heavy downloaded 3D models.
- Use `WebGLRenderer` with alpha and antialiasing enabled when supported.
- Cap device pixel ratio to avoid unnecessary GPU load.
- Render only while the scene is visible using `IntersectionObserver`.
- Pause animation when the document is hidden.
- Resize via `ResizeObserver` or resize listener.
- Cleanly no-op if WebGL fails.

## Performance requirements
- No large external 3D asset packages.
- Existing screenshots remain the largest media assets.
- 3D JS should be small enough for fast GitHub Pages load.
- Canvas must not block text, links or form controls.
- Target smooth interaction on modern desktop browsers and acceptable operation on mid-range mobile devices.

## Accessibility and fallback
- Respect `prefers-reduced-motion: reduce`.
- On reduced motion, render a static frame or disable continuous animation while preserving the visual composition.
- If WebGL is unavailable, show a CSS-only gradient/network fallback.
- Canvas elements are decorative and `aria-hidden`.
- All original headings, links, form controls and screenshot `alt` text remain usable.
- Keyboard navigation remains unaffected.

## Responsive behaviour
### Desktop
- Full procedural hero network.
- Pointer camera parallax and panel tilt enabled.
- Scroll depth reveals enabled.

### Tablet
- Simplified scene density.
- Reduced tilt and depth.

### Mobile
- Lower node count / particle count.
- No pointer-dependent interactions.
- Product screenshot remains the primary hero visual.
- No horizontal overflow.

## Brand constraints
- Preserve final Yaad light-blue/white UI visual language.
- Keep current Yaad logo.
- Retain DM Sans + Manrope typography unless technically necessary to fall back.
- Blue/cyan is the main luminous 3D palette.
- Avoid purple/dark-theme regression.
- Avoid visual language that implies the site is an official PhonePe property; “A PhonePe concept” remains concept positioning only.

## Content constraints
Do not rewrite, expand, shrink or materially alter the existing landing-page and mockup-page claims unless a technical formatting change is required. In particular preserve:
- “Your month makes sense.”
- “Transactions tell you money moved. Yaad remembers what it meant.”
- the three scenario amounts and meanings;
- SEE / UNDERSTAND / ASK / ACT;
- all 13 human-interaction states;
- the exact public URLs.

## Testing and acceptance criteria
The redesign is complete only when all of the following are true:
1. Both existing public URLs still resolve at the same paths.
2. Landing and mockup pages load with JavaScript enabled.
3. Both pages remain readable with JavaScript disabled or WebGL unavailable.
4. `prefers-reduced-motion` disables continuous decorative motion.
5. No horizontal scrolling occurs at mobile width.
6. All existing navigation links and CTAs still work.
7. Signup form retains current prototype behaviour.
8. All current screenshots remain visible and uncropped enough to inspect.
9. All 13 mockup interaction states remain present.
10. Three.js scene visibly contains the Yaad financial-memory concept rather than generic decorative geometry.
11. Page content does not imply a live PhonePe partnership.
12. Local static tests pass before deployment.
13. GitHub Pages deployment is pushed to the existing `main` branch.
14. Both public URLs are re-opened after deployment and verified live.

## Non-goals
- Do not rebuild Yaad itself.
- Do not change the core product screenshots.
- Do not add a backend.
- Do not add login/authentication.
- Do not add payment execution.
- Do not copy proprietary ThreeUI Pro source.
- Do not create new public URLs or a separate microsite.

## Success standard
The page should create the immediate impression that Yaad is a working semantic financial-memory product with spatial depth and technical sophistication, while a judge can still understand the proposition and inspect the product evidence within seconds.