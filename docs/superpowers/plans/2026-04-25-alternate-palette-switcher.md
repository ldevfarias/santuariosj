# Alternate Palette Switcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Igreja Azul" alternate color palette — extracted from the real church facade (cobalt blue, crimson dome, sky-white) — with a floating toggle button so the client can compare it live against the traditional burgundy/gold palette.

**Architecture:** CSS custom property override via `[data-theme="alternativo"]` attribute on `<html>`. A fixed-position switcher button injected in `index.html` drives a JS toggle (inside the existing IIFE) that writes the attribute and persists the choice in `localStorage`. No build tools — pure HTML/CSS/JS.

**Tech Stack:** CSS custom properties, vanilla JS ES6+, localStorage

> **Note on TDD:** This project has no test framework. Verification steps use manual browser testing instead of automated test runs.

---

## Reference: Church Image Palette Extraction

From the sanctuary photo, the "Igreja Azul" palette maps the existing CSS variables to the church's real colors:

| Variable | Tradicional | Igreja Azul | Source |
|---|---|---|---|
| `--burgundy` | `#6b1a1a` | `#1c5fa5` | Façade cobalt blue |
| `--burgundy-dk` | `#4a0f0f` | `#0d3d70` | Deep navy (topbar/footer/hover) |
| `--gold` | `#b8860b` | `#c42b2b` | Dome crimson |
| `--gold-light` | `#d4a017` | `#d94444` | Dome red mid-tone |
| `--gold-pale` | `#f5e6b8` | `#fce8e8` | Pale crimson tint |
| `--gold-bright` | `#f0c040` | `#e84545` | Bright crimson accent |
| `--cream` | `#faf6ef` | `#f0f6ff` | Sky-white background |
| `--cream-dk` | `#f0e8d8` | `#deeaf8` | Light sky-blue sections |
| `--text` | `#2a2218` | `#1a2540` | Dark navy text |
| `--text-soft` | `#5a4a3a` | `#3a4f70` | Soft navy text |

---

## Files

| Action | File | What changes |
|---|---|---|
| Modify | `css/style.css` | Add `[data-theme="alternativo"]` override block after `:root`; add `.theme-switcher` component styles at end of file |
| Modify | `index.html` | Add `<button id="theme-switcher">` after the `#back-to-top` button (line 627) |
| Modify | `js/main.js` | Add theme toggle + localStorage block before the closing `})();` (line 215) |

---

## Task 1: CSS — Alternative palette override block

**Files:**
- Modify: `css/style.css` — add right after the closing `}` of `:root` (after line 30)

- [ ] **Step 1: Add the `[data-theme="alternativo"]` block to `css/style.css`**

Insert this block immediately after the closing `}` of `:root` (between `:root { ... }` and `html { scroll-behavior: smooth; ... }`):

```css
/* ── PALETA ALTERNATIVA: Igreja Azul ──
   Extraída da fachada real do santuário:
   azul cobalto (fachada), vermelho (cúpula), branco (detalhes)
   Ativar via: document.documentElement.setAttribute('data-theme', 'alternativo')
   ─────────────────────────────────────────────────────────────── */
[data-theme="alternativo"] {
  --burgundy:    #1c5fa5;
  --burgundy-dk: #0d3d70;
  --gold:        #c42b2b;
  --gold-light:  #d94444;
  --gold-pale:   #fce8e8;
  --gold-bright: #e84545;
  --cream:       #f0f6ff;
  --cream-dk:    #deeaf8;
  --text:        #1a2540;
  --text-soft:   #3a4f70;
}
```

- [ ] **Step 2: Verify the block works in isolation**

Open `index.html` in a browser. In DevTools console, run:
```javascript
document.documentElement.setAttribute('data-theme', 'alternativo')
```
Expected: the entire site shifts to blue/crimson tones — header, footer, buttons, titles, ornaments. No elements should remain burgundy.

Run this to revert:
```javascript
document.documentElement.removeAttribute('data-theme')
```
Expected: site returns to full burgundy/gold palette.

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "feat: add Igreja Azul alternate palette via [data-theme] CSS override"
```

---

## Task 2: CSS — Theme switcher button styles

**Files:**
- Modify: `css/style.css` — append at the very end of the file, after the `/* ====... BACK TO TOP */` block

- [ ] **Step 1: Append theme switcher styles to `css/style.css`**

Add at the end of `css/style.css`:

```css
/* ============================================================
   THEME SWITCHER
   ============================================================ */
.theme-switcher {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: var(--white);
  border: 2px solid var(--cream-dk);
  border-radius: 50px;
  padding: 0.4rem 0.85rem 0.4rem 0.65rem;
  box-shadow: var(--shadow-md);
  font-family: var(--font-body);
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--text-soft);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: box-shadow var(--transition), transform var(--transition), border-color var(--transition);
  z-index: 1000;
  cursor: pointer;
  user-select: none;
}
.theme-switcher:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
  border-color: var(--burgundy);
}
.theme-switcher-label {
  line-height: 1;
  margin-right: 0.15rem;
}
.theme-swatch {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: border-color var(--transition), box-shadow var(--transition);
  flex-shrink: 0;
}
/* swatches always show their fixed colors regardless of active theme */
.theme-swatch-a { background: #6b1a1a; }
.theme-swatch-b { background: #1c5fa5; }

/* active swatch ring: tracks whichever theme is live on <html> */
:root:not([data-theme="alternativo"]) .theme-swatch-a,
[data-theme="alternativo"] .theme-swatch-b {
  border-color: #1a2540;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, .20);
}

@media (max-width: 768px) {
  .theme-switcher { bottom: 1rem; left: 1rem; }
}
```

- [ ] **Step 2: Visual check in browser**

Reload `index.html`. Expected: a small floating pill in the bottom-left corner showing the label "PALETA" plus two colored circles (dark red | cobalt blue). The dark-red circle should have a ring (traditional is active by default).

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "feat: add theme switcher button styles"
```

---

## Task 3: HTML — Theme switcher button element

**Files:**
- Modify: `index.html` — insert after `#back-to-top` (after line 627)

- [ ] **Step 1: Add the theme switcher button to `index.html`**

After the `#back-to-top` button block (line 627), insert:

```html
  <!-- ===== BOTÃO PALETA DE CORES ===== -->
  <button class="theme-switcher" id="theme-switcher"
          aria-label="Paleta ativa: Tradicional. Clique para alternar">
    <span class="theme-switcher-label">Paleta</span>
    <span class="theme-swatch theme-swatch-a" aria-hidden="true"></span>
    <span class="theme-swatch theme-swatch-b" aria-hidden="true"></span>
  </button>
```

- [ ] **Step 2: Visual check in browser**

Reload `index.html`. The switcher pill is visible at bottom-left with label + two swatches. The button has correct aria-label. No layout breaks on desktop or simulated mobile (DevTools responsive mode).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add theme switcher button to markup"
```

---

## Task 4: JS — Theme toggle + localStorage persistence

**Files:**
- Modify: `js/main.js` — insert block before the final `})();` closing line (before line 215)

- [ ] **Step 1: Add theme switcher logic to `js/main.js`**

Insert this block immediately before the final `})();` at the end of the file (before line 215). Keep it inside the IIFE:

```javascript
  /* ── THEME SWITCHER ── */
  const THEME_KEY      = 'santuario-theme';
  const rootEl         = document.documentElement;
  const themeSwitcherBtn = document.getElementById('theme-switcher');

  function applyTheme(theme) {
    if (theme === 'alternativo') {
      rootEl.setAttribute('data-theme', 'alternativo');
      themeSwitcherBtn.setAttribute(
        'aria-label',
        'Paleta ativa: Igreja Azul. Clique para ver paleta Tradicional'
      );
    } else {
      rootEl.removeAttribute('data-theme');
      themeSwitcherBtn.setAttribute(
        'aria-label',
        'Paleta ativa: Tradicional. Clique para ver paleta Igreja Azul'
      );
    }
  }

  // Restore saved preference on load
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) applyTheme(savedTheme);

  themeSwitcherBtn.addEventListener('click', () => {
    const next = rootEl.getAttribute('data-theme') === 'alternativo'
      ? 'tradicional'
      : 'alternativo';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });
```

- [ ] **Step 2: Test toggle in browser**

1. Reload `index.html`. Site opens in traditional palette (dark red circle has ring).
2. Click the switcher pill. Expected: full site shifts to blue/crimson palette, cobalt swatch gets ring.
3. Click again. Expected: returns to traditional palette.

- [ ] **Step 3: Test localStorage persistence**

1. Click switcher to activate "Igreja Azul".
2. Close the browser tab.
3. Reopen `index.html`.
4. Expected: page loads already in blue palette (persisted preference).

In DevTools > Application > Local Storage, verify key `santuario-theme` = `"alternativo"`.

Run in console to clear preference:
```javascript
localStorage.removeItem('santuario-theme')
```
Reload. Expected: traditional palette (no saved preference = default).

- [ ] **Step 4: Commit**

```bash
git add js/main.js
git commit -m "feat: wire theme switcher toggle with localStorage persistence"
```

---

## Task 5: Final cross-browser verification

- [ ] **Step 1: Full visual pass — Paleta Tradicional**

Scroll through the entire page with the traditional palette active. Check: topbar, header, hero buttons, section titles, ornaments, cards, footer. All should use burgundy/gold. No blue elements visible.

- [ ] **Step 2: Full visual pass — Paleta Igreja Azul**

Activate the blue palette and repeat the scroll. Check: topbar is dark navy, header uses cobalt, buttons are cobalt/crimson, titles are cobalt, footer is dark navy. No burgundy elements visible.

- [ ] **Step 3: Mobile check**

Resize DevTools to 375px width. Verify switcher pill repositions to `bottom: 1rem; left: 1rem;` and does not overlap the back-to-top button. Test toggle works on touch (DevTools touch simulation).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: complete alternate palette switcher — ready for client review"
```
