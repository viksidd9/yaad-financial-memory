# Yaad ThreeUI-Inspired 3D Landing + Mockups Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the existing Yaad landing and mockup pages with restrained Three.js/CSS 3D depth while preserving all current content, screenshots, interactions and the same two GitHub Pages URLs.

**Architecture:** Keep the site static. Add one shared procedural Three.js scene module for the Financial Memory network, one DOM motion module for tilt/reveal/capability detection, and augment the existing HTML/CSS with progressive-enhancement hooks. If JavaScript, WebGL or motion is unavailable, the original readable light-blue site remains fully usable.

**Tech Stack:** Static HTML/CSS, vanilla ES modules, Three.js `0.186.1` from a pinned jsDelivr URL, Node.js static regression tests, Git/GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-10-05-threeui-3d-landing-mockups-design.md`

## Global Constraints

- Preserve the exact public URLs: `/` and `/mockups/` on `https://viksidd9.github.io/yaad-financial-memory/`.
- Preserve the final light-blue/white Yaad identity, logo, DM Sans + Manrope typography, current screenshots and current copy.
- Do not imply an official PhonePe partnership; retain “A PhonePe concept” wording only.
- Preserve all 13 mockup interaction states.
- Use procedural geometry only; no downloaded 3D models.
- Canvas is decorative, non-blocking and `aria-hidden`.
- Respect `prefers-reduced-motion` and provide a CSS-only fallback if WebGL fails.
- No backend, login, payment execution or separate microsite.
- Deploy by pushing the existing `main` branch only after local verification.

## Review Focus

1. **Three.js CDN failure:** page must remain readable and screenshots/links/forms usable without the module.
2. **Reduced-motion users:** continuous animation and tilt must be disabled while preserving static depth styling.
3. **Mobile viewport ≤650px:** no horizontal overflow; screenshot remains primary visual; pointer tilt disabled.
4. **WebGL unavailable/context creation failure:** CSS fallback network must remain visible and no uncaught exception may break the page.
5. **Mockup completeness:** all 13 existing interaction states and exact key claims must remain present after markup changes.

---

### Task 1: Add regression tests for protected content and progressive-enhancement hooks

**Files:**
- Create: `tests/site-3d.spec.mjs`
- Read: `index.html`
- Read: `mockups/index.html`
- Read: `styles.css`

**Interfaces:**
- Consumes: current static page source.
- Produces: one Node test script that exits non-zero on content/path/accessibility regressions and validates future 3D hooks.

- [ ] **Step 1: Write the failing static regression test**

Test assertions must cover:
- landing contains `Your month makes sense.` and the current three scenario amounts;
- landing contains `SEE`, `UNDERSTAND`, `ASK`, `ACT`;
- mockups contains exactly 13 `screen-card` articles;
- both pages reference `three-memory.js` and `motion.js` as ES modules;
- both pages contain a `[data-three-scene]` container with `aria-hidden="true"`;
- `styles.css` contains a `prefers-reduced-motion` rule and `.three-fallback` styling;
- no absolute link changes away from the existing relative `/` and `/mockups/` paths.

- [ ] **Step 2: Run the test and verify it fails before implementation**

Run: `node tests/site-3d.spec.mjs`
Expected: FAIL because the new module hooks and fallback CSS do not yet exist.

- [ ] **Step 3: Commit only the failing test**

```bash
git add tests/site-3d.spec.mjs
git commit -m "test: protect Yaad 3d site requirements"
```

---

### Task 2: Build the shared Financial Memory Three.js scene

**Files:**
- Create: `three-memory.js`
- Modify: `index.html`
- Modify: `mockups/index.html`
- Test: `tests/site-3d.spec.mjs`

**Interfaces:**
- Consumes: elements matching `[data-three-scene]` and optional `data-three-variant="hero|mockup"`.
- Produces: `initFinancialMemoryScene(root: HTMLElement) -> { destroy(): void } | null` and automatic initialisation for every scene container on DOM ready.

- [ ] **Step 1: Add scene containers and module references to both pages**

Landing hero receives the main scene container; mockup hero receives the compact scene container. Both include a nested `.three-fallback` DOM network containing labels `Yaad`, `HDFC`, `SBI`, `Arjun Kumar`, `UrbanStep` so the semantic concept survives without WebGL.

- [ ] **Step 2: Implement `three-memory.js` with pinned Three.js `0.186.1`**

Requirements:
- `WebGLRenderer({ alpha: true, antialias: true })`;
- DPR capped at `min(devicePixelRatio, 1.75)` desktop and lower on small screens;
- central Yaad sphere plus HDFC, SBI, Arjun Kumar and UrbanStep nodes;
- lines/curves representing self-transfer, receivable and refund relationships;
- blue/cyan palette only;
- subtle pointer camera parallax only when `(hover:hover) and (pointer:fine)`;
- `IntersectionObserver` pauses off-screen rendering;
- `visibilitychange` pauses when document hidden;
- resize handling;
- reduced-motion renders a static frame without continuous animation;
- any renderer/import/init failure leaves `.three-fallback` visible.

- [ ] **Step 3: Run the static regression test**

Run: `node tests/site-3d.spec.mjs`
Expected: remaining failures should now concern CSS/motion requirements only, not scene hooks/content.

- [ ] **Step 4: Commit the scene layer**

```bash
git add index.html mockups/index.html three-memory.js tests/site-3d.spec.mjs
git commit -m "feat: add financial memory threejs scene"
```

---

### Task 3: Add CSS 3D depth, glass framing and motion controller

**Files:**
- Create: `motion.js`
- Modify: `styles.css`
- Modify: `index.html`
- Modify: `mockups/index.html`
- Test: `tests/site-3d.spec.mjs`

**Interfaces:**
- Consumes: `[data-tilt]`, `[data-reveal]`, `[data-depth]` attributes.
- Produces: capability-aware pointer tilt and scroll reveal that no-op on touch, reduced-motion or unsupported browsers.

- [ ] **Step 1: Extend tests for motion/accessibility hooks**

Assert:
- key screenshot frames carry `data-tilt`;
- scenario cards and mockup cards carry `data-reveal`;
- CSS includes `@media (prefers-reduced-motion: reduce)` disabling transitions/animations/transforms that depend on motion;
- CSS includes mobile overflow protection and `canvas { pointer-events:none; }` for scene canvases.

- [ ] **Step 2: Implement `motion.js`**

Requirements:
- pointer tilt max visual rotation ≤4deg;
- reveal using `IntersectionObserver` and `.is-visible` class;
- disabled under reduced motion, coarse pointer or mobile width;
- transform values set through CSS custom properties so base layout remains readable without JS.

- [ ] **Step 3: Restyle shared surfaces in `styles.css`**

Implement:
- hero composition integrating WebGL network + floating home screenshot;
- glass proof cards with shallow hover depth;
- DECIDE / ASK / WAIT spatial scenario styling;
- Money Due Back open-obligation decorative path;
- SEE / UNDERSTAND / ASK / ACT depth stack, with ACT visually separated;
- luminous restrained CTA background field;
- dimensional mockup frames and transient HTML panels;
- Financial Memory lower-gallery anchor styling;
- `.three-fallback` semantic CSS network;
- responsive tablet/mobile reductions.

- [ ] **Step 4: Run the static regression test**

Run: `node tests/site-3d.spec.mjs`
Expected: PASS.

- [ ] **Step 5: Commit the interaction layer**

```bash
git add index.html mockups/index.html styles.css motion.js tests/site-3d.spec.mjs
git commit -m "feat: add spatial glass motion system"
```

---

### Task 4: Local browser verification and visual QA

**Files:**
- Verify only; modify files only if defects are discovered.

**Interfaces:**
- Consumes: completed static site.
- Produces: evidence that both pages work with and without motion/WebGL assumptions.

- [ ] **Step 1: Run all static tests from a clean working tree**

Run: `node tests/site-3d.spec.mjs`
Expected: PASS.

- [ ] **Step 2: Start a local static server**

Run from repo root: `python -m http.server 8765`
Expected: `http://127.0.0.1:8765/` and `/mockups/` both return 200.

- [ ] **Step 3: Headless-browser desktop smoke test if Edge/Chrome is available**

Open both pages at desktop width, capture screenshots, verify:
- WebGL canvas is present or fallback appears;
- no content overlap;
- screenshots remain uncropped and readable;
- all navigation/CTA links remain present;
- form submit still reveals confirmation text.

- [ ] **Step 4: Mobile smoke test at ~390px width**

Verify no horizontal overflow and no pointer-dependent layout requirement.

- [ ] **Step 5: Reduced-motion/fallback verification**

Verify the CSS media query exists and scene code detects reduced motion; temporarily force WebGL init failure in a local test or block the CDN and confirm the fallback remains visible and page controls still work.

- [ ] **Step 6: Fix any discovered defects and rerun Steps 1–5**

- [ ] **Step 7: Commit only if QA required code changes**

```bash
git add index.html mockups/index.html styles.css three-memory.js motion.js tests/site-3d.spec.mjs
git commit -m "fix: polish Yaad 3d responsive qa"
```

---

### Task 5: Deploy to the same GitHub Pages URLs and verify live

**Files:**
- Git deployment only.

**Interfaces:**
- Consumes: verified `main` branch.
- Produces: unchanged live landing and mockup URLs with the new 3D design.

- [ ] **Step 1: Verify repository state**

Run: `git status --short && git log -5 --oneline`
Expected: no unintended files or secrets; only intended committed changes.

- [ ] **Step 2: Push the existing `main` branch**

Run: `git push origin main`
Expected: successful push to `viksidd9/yaad-financial-memory`.

- [ ] **Step 3: Verify the same public landing URL**

Open: `https://viksidd9.github.io/yaad-financial-memory/`
Expected: HTTP 200 and new 3D hooks/content present.

- [ ] **Step 4: Verify the same public mockup URL**

Open: `https://viksidd9.github.io/yaad-financial-memory/mockups/`
Expected: HTTP 200, all 13 interaction states present, new 3D hero/gallery styling loaded.

- [ ] **Step 5: Final live regression check**

Confirm both URLs preserve the original key copy, current screenshots, signup interaction and the final light Yaad identity.
