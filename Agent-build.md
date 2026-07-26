# Agent Prompt — Build the Frontend

Paste this whole file into your coding agent (Claude Code, Cursor, etc.) as the
task prompt. It assumes `design.md` sits next to this file in the same repo/
context — the agent should read it before writing any code.

---

## Context

You're building the **frontend only** for an AI code assistant product with
three surfaces: a public landing page, authentication (sign in / sign up,
email+password and OAuth), and the chat app itself. A teammate is building
the model separately; it currently runs locally and will be reachable
through a backend API (not built yet, or built minimally alongside this).
Your job is the UI across all three surfaces — polished and consistent, not
three separately-styled builds.

**Read `design.md` in full before writing code.** It is the single source of
truth for colors, type, layout, component behavior, and motion, across the
landing page, auth, and app. Do not invent new visual choices outside of it.
If something isn't covered there, make the smallest reasonable extension
consistent with its tone (quiet, precise, developer-focused, no gradients,
minimal animation).

---

## Stack (fixed — do not substitute)

- **Framework:** Next.js (App Router, latest stable)
- **Styling:** Tailwind CSS — configure the design tokens from `design.md`
  §4 as Tailwind theme extensions (colors, fontFamily, borderRadius), don't
  hardcode hex values in components.
- **Icons:** HugeIcons (`@hugeicons/react` or the current official package) —
  the *only* icon set used. No inline SVGs from elsewhere, no emoji-as-icon.
- **Animation:** Framer Motion — used only for the interactions listed in
  `design.md` §9. Nothing beyond that list.
- **Fonts:** Geist Sans + Geist Mono, loaded via `next/font/google` or
  `next/font/local` per whichever is officially distributed at build time.
- Language: TypeScript.

---

## Scope

Build all three surfaces as a working UI with realistic mock behavior, wired
to two isolated API seams (chat + auth) so a real backend can be dropped in
later without touching component code.

**In scope:**
- **Landing page (`/`)** — nav, hero (with the real composer/message
  components as the hero visual), capability grid, secondary proof section,
  CTA band, footer — per `design.md` §5.
- **Auth (`/sign-in`, `/sign-up`)** — OAuth buttons (GitHub, Google — UI
  and click handlers only, no real provider wiring), email/password form
  with client-side + mock server-side validation, per `design.md` §6.
- **App (`/chat`)** — header, sidebar (with mobile drawer + account menu),
  message thread, composer, empty state — per `design.md` §7.
- All components in `design.md` §8, matching states (default, hover, focus,
  disabled, streaming, error).
- **Chat API seam** (`lib/api.ts`) — one function, e.g. `sendMessage(messages:
  Message[]): AsyncIterable<string>`, streaming via `fetch` + `ReadableStream`
  to `POST /api/chat`. Mocked for now (see below); trivial to point at the
  real backend later.
- **Auth API seam** (`lib/auth.ts`) — functions for `signInWithPassword`,
  signUpWithPassword`, `signInWithOAuth(provider)`, `signOut`, `getSession`.
  Mocked with an in-memory/`localStorage`-backed session for now; keep the
  function signatures realistic (async, return `{ user } | { error }`) so
  swapping in real auth (e.g. NextAuth, Clerk, or a custom backend) later is
  a one-file change.
- **Route protection:** unauthenticated visits to `/chat` redirect to
  `/sign-in`; successful sign in/up redirects to `/chat` (per `design.md`
  §2). A simple client-side check against the mocked session is enough for
  this phase — don't build real middleware/JWT verification.
- Local chat state (React state/context) — current conversation, sidebar
  list of past conversations (in-memory or `localStorage`).
- Responsive behavior at all three breakpoints from `design.md` §10.
- Accessibility requirements from `design.md` §11.

**Out of scope (do not build):**
- The model itself, or any inference code.
- Real OAuth provider integration, real password hashing/storage, real
  session/JWT handling, or a real database.
- Password reset email flow (the "Forgot password?" link can go to a
  placeholder page/state).
- Any settings/admin surfaces beyond what's described in `design.md`.

---

## Suggested file structure

```
app/
  layout.tsx                 - fonts, global providers (session context)
  page.tsx                   - landing page
  (auth)/
    sign-in/page.tsx
    sign-up/page.tsx
  chat/
    page.tsx                 - assembles Header + Sidebar + Thread + Composer
  globals.css                 - Tailwind base + CSS vars for tokens
components/
  landing/
    Nav.tsx
    Hero.tsx
    CapabilityGrid.tsx
    ProofSection.tsx
    CtaBand.tsx
    Footer.tsx
  auth/
    AuthCard.tsx
    OAuthButtons.tsx
    PasswordField.tsx
  chat/
    Header.tsx
    Sidebar.tsx
    MobileDrawer.tsx
    Thread.tsx
    MessageUser.tsx
    MessageAssistant.tsx
    CodeBlock.tsx
    Composer.tsx
    EmptyState.tsx
  ui/
    Button.tsx
    IconButton.tsx
    TextField.tsx
lib/
  api.ts                      - sendMessage(), chat streaming boundary
  auth.ts                     - mocked auth functions, session boundary
  types.ts                    - Message, Conversation, User types
  storage.ts                  - localStorage helpers (chat history + session)
tailwind.config.ts             - theme tokens from design.md §4
```

Adjust as needed, but keep `lib/api.ts` and `lib/auth.ts` as the only two
seams that know about network calls — these are where the real backend
gets plugged in later.

---

## Build order

1. **Scaffold** — Next.js + Tailwind + fonts configured with tokens from
   `design.md` §4. Verify palette and type scale on a blank page first.
2. **Shared UI primitives** — `Button`, `IconButton`, `TextField`, matching
   `design.md` §8, used by all three surfaces.
3. **Chat components** — build the app surface first since the landing
   page's hero reuses it: `Composer`, `MessageUser`, `MessageAssistant`,
   `CodeBlock`, `EmptyState`, per `design.md` §7–§8.
4. **App shell + state** — `Header`, `Sidebar`, `MobileDrawer`, wire up
   `lib/api.ts` (mocked streaming) so `/chat` is fully functional end to end.
5. **Auth** — `AuthCard`, `OAuthButtons`, password field with show/hide,
   validation states, `/sign-in` and `/sign-up` pages, wired to mocked
   `lib/auth.ts`, per `design.md` §6.
6. **Route protection** — redirect logic between `/chat` and `/sign-in`
   based on the mocked session (`design.md` §2).
7. **Landing page** — `Nav` (with scroll-driven background change), `Hero`
   (reusing the real `Composer`/`MessageAssistant` components, seeded with
   a static example), `CapabilityGrid`, `ProofSection` (reusing `CodeBlock`),
   `CtaBand`, `Footer`, per `design.md` §5.
8. **Motion pass** — apply exactly the Framer Motion interactions in
   `design.md` §9, and confirm `prefers-reduced-motion` is respected.
9. **Responsive pass** — verify all three breakpoints from `design.md` §10,
   across all three surfaces.
10. **Accessibility pass** — aria-labels, live region for streaming text,
    aria-describedby on auth errors, full keyboard traversal, focus rings —
    per `design.md` §11.
11. **Self-review** — check the result against `design.md` §13 (explicit
    don'ts): no gradients, no bubbles, no stock imagery, no full-color OAuth
    logos, no ambient looping motion, single accent hue.

---

## Mocking chat + auth (until the real backend exists)

- `lib/api.ts`: stream a canned or echoed response token-by-token (e.g.
  split a placeholder string and drive it out via an async generator),
  matching the shape the real backend will eventually use.
- `lib/auth.ts`: accept any well-formed email/password as a successful sign
  up; treat one or two hardcoded credentials as a valid sign in and
  everything else as an error, so the error-state UI is exercisable.
  `signInWithOAuth` can just simulate a short delay then "succeed" into a
  mock session — no real redirect to a provider is required yet.
- Persist the mock session in `localStorage` so refreshing `/chat` doesn't
  bounce the user back to `/sign-in` during development.

---

## Definition of done

- Matches `design.md` on colors, type, spacing, and component states across
  landing, auth, and app — no ad-hoc colors or fonts introduced.
- Fully responsive per §10, keyboard-accessible per §11, on all three
  surfaces.
- Only the Framer Motion interactions listed in §9 are present — nothing
  extra, and the landing hero doesn't scroll-jack.
- Only HugeIcons are used for iconography; OAuth buttons are monochrome.
- `lib/api.ts` and `lib/auth.ts` are the only places that know about
  network calls, so swapping in the real backend later is a two-file change.
- Unauthenticated users can't reach `/chat`; the redirect flow works.
- No gradients, no chat bubbles, no console errors/warnings on build.
