# Design Spec — AI Code Assistant (Frontend)

Three surfaces, one product: a public **landing page**, **authentication**
(sign in / sign up), and the **app** (the one-page chat interface from the
original brief). This file is the source of truth for all three — colors,
type, layout, component behavior, and motion carry across all of them so the
product feels like one thing, not three separate builds. `agent.md`
references these section numbers; don't renumber without updating it.

---

## 1. Product framing

- **Subject:** a code assistant — developers land on a marketing page, sign
  up or sign in, then land in a chat interface where they paste/write code
  and prompts and the model answers with explanations and code blocks.
- **Audience:** developers. They want clarity, speed, and low visual noise.
- **Each surface's one job:**
  - Landing → convince a developer this is worth trying, in one screen's
    worth of scrolling, then get them to sign up.
  - Auth → get a returning or new user into the app with zero friction.
  - App → let someone start typing immediately and read the answer
    (especially code) without friction.

---

## 2. Site map

```
/                    -> Landing (public)
/sign-in             -> Auth
/sign-up             -> Auth
/chat                -> App (authenticated; the chat interface)
```

Unauthenticated visits to `/chat` redirect to `/sign-in`. After successful
sign in/up, redirect to `/chat`.

---

## 3. Design decisions (the "why")

Rejected on purpose:
- Warm cream background + terracotta accent (the generic "AI chat" look).
- Near-black background + neon green/acid accent (the generic "hacker AI" look).
- Any gradient, anywhere — including on landing CTAs or OAuth buttons.
- Rounded, colorful chat "bubbles" in the app.
- Split-screen auth pages with stock photography or abstract 3D art.

Instead:
- **Palette:** cool, quiet neutrals (paper, not cream) with a single confident
  accent — cobalt, not terracotta, not neon.
- **Type:** Geist Sans + Geist Mono — a deliberate nod to the Next.js/Vercel
  ecosystem the app is built on, used functionally (labels, code, captions),
  not decoratively.
- **Landing hero:** instead of an abstract illustration or a big stat, the
  hero *is the product* — a static/looping mock of the actual composer,
  mid-way through a real developer question, with the same blinking cobalt
  caret used in the app. This is the throughline between "marketing" and
  "product" — what you see is what you get, literally the same component.
- **Auth:** a single centered card, no imagery, no split panel — consistent
  with the "no decoration that doesn't serve the brief" rule. OAuth buttons
  are quiet outlined buttons with a small monochrome badge, never the
  providers' full-color logos or gradients.
- **App layout:** no chat bubbles. Assistant turns carry a thin left accent
  rule and a mono label, closer to an inline code-review comment than a
  messaging app.
- **Motion:** minimal, on purpose, everywhere. No hover-bounce, no looping
  ambient motion, no scroll-jacking on the landing page.

---

## 4. Design tokens

### Color

| Token       | Hex       | Use                                              |
|-------------|-----------|---------------------------------------------------|
| `ink`       | `#14161A` | Primary text, icons                               |
| `paper`     | `#F6F7F8` | Page background (all surfaces)                    |
| `surface`   | `#FFFFFF` | Cards, composer, sidebar, auth card, nav on scroll |
| `line`      | `#E4E6EA` | Borders, dividers, input outlines                 |
| `muted`     | `#6B7280` | Secondary text, timestamps, placeholders, captions |
| `accent`    | `#315DFF` | CTAs, links, active states, focus ring, caret      |
| `accent-ink`| `#1F3FBF` | Accent hover/pressed                              |
| `danger`    | `#C1432E` | Error states, form validation only                |

No gradients, on any surface. If more color is needed for syntax
highlighting inside code blocks (app + landing hero demo), use the
restrained 5-color code palette in §8.

### Type

- **Display / UI face:** `Geist Sans` (fallback: `system-ui, sans-serif`)
- **Mono / utility face:** `Geist Mono` (fallback: `ui-monospace, SFMono-Regular, monospace`)

| Role                        | Face        | Size / Line-height | Weight |
|------------------------------|-------------|---------------------|--------|
| Landing H1                    | Geist Sans  | 44px / 52px (mobile 32px/40px) | 600 |
| Landing subhead               | Geist Sans  | 18px / 28px         | 400    |
| Section labels (landing)      | Geist Mono  | 12px / 16px, uppercase, tracked +0.04em | 500 |
| Page title / logo (nav)       | Geist Sans  | 18px / 24px         | 600    |
| Auth card heading             | Geist Sans  | 24px / 32px         | 600    |
| Form label                    | Geist Sans  | 13px / 18px         | 500    |
| Message body (app)            | Geist Sans  | 15px / 24px         | 400    |
| Assistant label, meta (app)   | Geist Mono  | 12px / 16px, uppercase, tracked +0.04em | 500 |
| Composer input (app)          | Geist Mono  | 15px / 24px         | 400    |
| Code blocks                    | Geist Mono  | 13.5px / 22px       | 400    |
| Button label                    | Geist Sans  | 14px / 20px         | 500    |

### Space & shape

- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px (96 for landing
  section padding only).
- Radius: `6px` for inputs/buttons/code blocks/cards. No large "pill" radii.
- Border weight: 1px hairline everywhere (`line` token). No drop shadows on
  main surfaces; a shadow only on floating elements (mobile menu, dropdowns,
  auth card if it needs to lift off `paper`): `0 4px 16px rgba(20,22,26,0.08)`.

---

## 5. Landing page

Single scroll page, no gradient hero, no stock imagery.

```
Nav (64px, sticky) - logo, links, Sign in, Sign up
Hero - headline + subhead (left), composer mock with blinking caret (right)
Capability grid - 3-4 cards, icon + label + 1-line copy
Secondary proof section - real CodeBlock component, one good example
CTA band - one line + primary button, plain, no card
Footer - logo, muted links, no gradient socials
```

- **Nav:** transparent over `paper` at top; on scroll (past ~24px), animates
  to `surface` background + 1px `line` border-bottom (Framer Motion, driven
  by scroll position, one clean state change — not continuous parallax).
  Right side: "Sign in" (ghost) + "Sign up" (primary, `accent`). Below
  768px, links collapse behind a `hugeicons: menu-01` trigger into the same
  off-canvas drawer pattern used for the app sidebar (§10).
- **Hero:** headline states what the tool does in plain terms (e.g. "A code
  assistant that reads the whole file, not just the line"), one-sentence
  subhead in `muted`, then "Start free" (primary) + "Sign in" (ghost) side
  by side. The composer mock is the *actual* `Composer` + `MessageAssistant`
  components from the app, seeded with a real example exchange — not a
  separate illustration. This is the page's single signature moment.
- **Capability grid:** 3–4 plain cards (`surface`, 1px `line`, 6px radius, no
  shadow), each: one HugeIcons icon (20px, `accent`), a short label (Geist
  Sans 600), one line of body copy (`muted`). Not numbered 01/02/03 — these
  are parallel capabilities, not a sequence, so a grid (not a numbered list)
  is the honest structure.
- **Secondary proof section:** reuse the real `CodeBlock` component with a
  short, genuinely useful example (e.g. a diff-style bug fix) — reinforces
  that the product and the marketing page are the same visual language.
- **CTA band:** centered single line + primary button on plain `paper`, no
  card, no gradient overlay.
- **Footer:** `muted` text on `paper`, 1px `line` border-top, plain text
  links (Product, Sign in, Sign up, Privacy), no icons required.

---

## 6. Authentication (sign in / sign up)

- Centered card, `surface` background, 1px `line` border, 6px radius,
  max-width 400px, vertically centered on `paper` — no split panel, no
  imagery, same treatment on both `/sign-in` and `/sign-up`.
- **Header:** small logo/wordmark above the card (links back to `/`), then
  the card heading ("Sign in" / "Create your account").
- **OAuth first:** two outlined buttons stacked, full-width, 6px radius,
  1px `line` border, `surface` background, `ink` text:
  - `Continue with GitHub` — small monochrome GitHub mark (`ink`), never
    GitHub's colorful branding treatment.
  - `Continue with Google` — small monochrome "G" glyph or a neutral
    `hugeicons` account icon if a literal Google mark isn't appropriate to
    render; the label carries the meaning, not the icon.
- **Divider:** thin `line` rule with centered mono `muted` text: `or`.
- **Email/password form:**
  - Label above each field (Geist Sans 13px 500), not placeholder-as-label.
  - Email field, Password field with a show/hide toggle
    (`hugeicons: view-01` / `view-off-01`) at the right edge.
  - Inline validation: on blur/submit, invalid fields get a 1px `danger`
    border and a small mono caption below in `danger` (e.g. `Enter a valid
    email`). No shake animation — border/caption change only.
  - Primary submit button, full width, `accent` background: `Sign in` /
    `Create account`.
  - `/sign-in` only: `Forgot password?` link, right-aligned under the
    password field, `muted`, underline on hover.
- **Footer of card:** toggle line, e.g. `Don't have an account? Sign up` —
  the non-active word is an `accent` text link.
- **Legal line** (sign-up only): small `muted` caption under the submit
  button: `By continuing you agree to the Terms and Privacy Policy.` (link
  both, plain text links, no separate styling).
- **Errors from the server** (e.g. wrong password, account exists): a single
  `danger`-tinted inline banner at the top of the form, 1px `danger` border,
  soft `#FBEEEC` background, mono caption text — not a toast, not a modal.

---

## 7. App layout / page anatomy (`/chat`)

```
Header (56px) - logo, model name (mono, muted), new chat
Sidebar (240px, collapses <1024px) - chat list + account menu
Main - Message thread (scrollable, max-width 720px, centered)
       Composer (sticky bottom, max-width 720px, centered)
```

- **Header:** left = wordmark. Center-right = current model name in
  mono/muted, e.g. `code-assistant-v1`. Right = "New chat" (ghost button,
  icon: `hugeicons: add-01`).
- **Sidebar:** past conversations, plain list, no icons per row except a
  rename/delete affordance on hover. At the bottom, an account menu (avatar
  initial in a plain `ink`-on-`line` circle + name/email, opens a small
  dropdown: `Sign out`). Becomes an off-canvas panel below 1024px (§10).
- **Thread:** centered column, generous top padding, messages stack with
  24px gutter between turns. No visible container/card around each message.
- **Composer:** fixed to the bottom of the viewport, `surface` background,
  1px `line` border-top, safe-area padding on mobile. Auto-growing textarea,
  send button pinned bottom-right of the field.
- **Empty state (no messages yet):** vertically centered in the thread area.
  Mono eyebrow `> ready`, then a short prompt line ("Ask about a bug, paste
  a stack trace, or describe what you're building."), then 3–4 suggestion
  chips (outlined, not filled) a user can click to prefill the composer.

---

## 8. Components (shared across all three surfaces)

### Message — user turn
Plain text, `ink`, right-aligned within the 720px column, max-width 85%.
No background, no border, no bubble. Timestamp on hover only, mono, `muted`.

### Message — assistant turn
Left-aligned, full width of the column. 2px `accent` vertical rule on the
far left, 12px gap, then content. Small mono label above content:
`ASSISTANT`. Inline code in Geist Mono with a light chip background
(`#EEF1F5`, 4px radius). Fenced code blocks per below. Streaming state ends
in a blinking `accent` block caret (disabled under reduced motion).

### Code block
`surface` background, 1px `line` border, 6px radius. Header row: language
label (mono, `muted`) + "Copy" button (`hugeicons: copy-01` -> `tick-01` +
"Copied" for 1.5s, no toast). Syntax palette (code only, never UI chrome):
`#14161A` text · `#315DFF` keywords · `#0F7A5A` strings ·
`#8A5CF6` functions/types · `#8A8F98` comments. Horizontal scroll on
overflow, never wrap.

### Composer
`surface` field, 1px `line` border, 6px radius, focus = 1px `accent` border
+ 3px focus ring at 12% opacity. Mono placeholder: `Message the assistant…`.
Send button: square, 6px radius, `accent` background, `hugeicons:
arrow-right-01`, white icon. Disabled = `line` background, `muted` icon.
Enter = send, Shift+Enter = newline; hint text under field on desktop only.

### Form fields (auth)
Label above, `surface` input, 1px `line` border, 6px radius, same focus
treatment as the composer for consistency. Error = 1px `danger` border +
mono caption below in `danger`.

### Buttons (all surfaces)
- Primary: `accent` bg, white text, 6px radius, no shadow, hover =
  `accent-ink`.
- Ghost/secondary: transparent bg, 1px `line` border, `ink` text, hover =
  `paper` background.
- Outlined (OAuth): same as ghost, full-width, icon + label left-aligned,
  centered as a pair.
- All interactive elements: visible 2px focus ring in `accent` at 40%
  opacity, offset 2px — never remove focus outlines.

### Icons
HugeIcons only, stroke variant, 20px default (16px inline, 24px in landing
cards/empty state). Suggested set: `menu-01`, `add-01`, `arrow-right-01`,
`copy-01`, `tick-01`, `attachment-01`, `delete-02`, `edit-02`, `view-01`,
`view-off-01`, `logout-01`, `arrow-down-01`.

---

## 9. Motion (Framer Motion) — full spec, nothing beyond this

| Interaction                          | Motion                               | Duration | Easing   |
|----------------------------------------|-----------------------------------------|----------|----------|
| Message enters thread (app)             | translateY 8px->0, opacity 0->1         | 150ms    | easeOut  |
| Assistant streaming caret (app)         | opacity 1->0.2->1 loop                  | 900ms    | linear   |
| Sidebar/nav drawer open/close (mobile)  | translateX -100%->0 + scrim fade        | 200ms    | easeOut  |
| Nav background on scroll (landing)      | background/border opacity 0->1, once    | 150ms    | easeOut  |
| Landing sections into view              | translateY 12px->0, opacity 0->1, once  | 200ms    | easeOut  |
| Send button press                       | scale 1->0.96->1                        | 100ms    | easeOut  |
| Copy button confirm swap                | icon crossfade, no bounce               | 120ms    | easeOut  |
| Auth field error appears                | border/caption fade in (no shake)       | 100ms    | easeOut  |

Rules:
- No hover-lift, no parallax, no looping background motion, no
  scroll-jacking, no page-load choreography beyond the single once-off
  section reveal on landing.
- Respect `prefers-reduced-motion: reduce` globally: disable the caret
  blink and all transform-based entrances, keep only opacity fades at 1ms.

---

## 10. Responsive rules

- **Breakpoints:** mobile <640px, tablet 640–1023px, desktop ≥1024px.
- App sidebar permanently visible only ≥1024px; below that, off-canvas drawer.
- Landing nav links collapse to a drawer below 768px.
- Thread and composer max-width 720px, centered, 16px side padding mobile /
  24px tablet+.
- Auth card is full-width minus 24px gutters below 480px, fixed 400px above.
- Composer textarea caps at ~6 visible lines before internal scroll, at
  every breakpoint.
- Touch targets ≥40px on mobile for all icon buttons and OAuth buttons.

---

## 11. Accessibility

- Color contrast: `ink` on `paper`/`surface` and `accent` on white both meet
  WCAG AA at minimum, including auth error states.
- All icon-only buttons get an `aria-label` (e.g. "Copy code", "New chat",
  "Show password", "Open menu").
- Composer and auth inputs use real `<label>`/`<textarea>`/`<input>`
  elements, not styled `<div>`s.
- Live region (`aria-live="polite"`) around the assistant's streaming
  message so screen readers announce new content sensibly, not per-token.
- Auth form errors are associated to their field via `aria-describedby`.
- Full keyboard path across every surface: nav → hero CTA; auth fields →
  submit → toggle link; composer → send → code block copy buttons.

---

## 12. Voice & copy

- Sentence case everywhere, no title case buttons.
- Errors are specific and calm: `Couldn't reach the assistant. Check your
  connection and try again.` / `That email or password isn't right.` —
  never "Oops!" or an apology.
- Landing copy speaks to what the developer gets, not the tech stack
  underneath: "reads the whole file," not "leverages advanced context
  windows."
- Empty state and placeholders speak to what the user controls: "Ask about
  a bug," not "Get AI assistance."

---

## 13. Explicit don'ts

- No gradients anywhere — backgrounds, buttons, borders, text, OAuth buttons.
- No chat bubbles / rounded speech-bubble shapes.
- No stock photography, abstract 3D renders, or split-screen imagery on
  landing or auth.
- No full-color brand logos for GitHub/Google — monochrome only.
- No looping ambient animation, no confetti/celebration effects, no
  scroll-jacking on landing.
- No more than one accent hue in UI chrome, on any surface.
- No stock "robot" or "sparkle" iconography for the assistant identity —
  use the mono label instead.
