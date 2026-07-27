# GemmaCode — AI Code Assistant Frontend

This is the frontend for GemmaCode, an AI coding assistant that helps developers write, debug, and understand code. It's built as a Next.js app with three clean, consistent surfaces: a public landing page, authentication (sign in / sign up), and the chat interface where you actually interact with the assistant. The whole thing feels like one product, not three separate builds tied together.

The main idea is that a developer lands on the marketing page, signs up, and immediately gets into a distraction-free chat experience where they can paste errors, ask questions, and get back real working code blocks with syntax highlighting and one-click copy. The landing page even reuses the same chat components so what you see before signing up is exactly what you get inside the app.

## Features

- **Landing page** that shows the product in action, reusing the actual chat components instead of generic illustrations
- **Authentication** with email/password plus OAuth (GitHub and Google), all inside a centered card, no split panels or stock photos
- **Chat app** with a sidebar of past conversations, a message thread, and a composer that auto-grows and handles Shift+Enter for newlines
- **Real code blocks** with syntax highlighting for TypeScript, JavaScript, Python, and more, plus one-click copy to clipboard
- **Streaming responses** with a blinking caret so you see the assistant "think" in real time
- **Dark mode** toggle that respects your system preference and persists across the app
- **Responsive design** that works on mobile, tablet, and desktop, including an off-canvas sidebar and drawer navigation
- **Motion** handled by Framer Motion, but limited to subtle entrance fades and the streaming caret — no scroll-jacking or looping animations
- **Accessibility** built in from the start: proper labels, focus rings, live regions for streaming text, and full keyboard navigation
- **Mocked API seams** so you can run the whole thing without a real backend — easy to plug in real endpoints later

## Installation

Make sure you have Node.js and npm installed.

1. Clone the repo:

```bash
git clone https://github.com/FavourDarasimi/Gemma-Code-Frontend.git
cd Gemma-Code-Frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The app will be running at `http://localhost:3000`.

## Usage

Once the dev server is up, you can explore all three surfaces:

- **`/`** — The landing page with the hero, feature sections, FAQ, and CTA.
- **`/sign-in`** and **`/sign-up`** — Authentication pages with OAuth buttons and email/password forms.
- **`/chat`** — The main chat interface. If you're not signed in, you'll be redirected to `/sign-in`. The authentication is mocked in `lib/auth.ts`, so you can sign up with any email and a password of at least 8 characters, or use the OAuth buttons which simulate a successful login.

The chat UI includes a sidebar for switching conversations (stored in memory/localStorage), a composer that sends on Enter and supports Shift+Enter for newlines, code blocks with syntax highlighting and copy buttons, and streaming assistant responses powered by the mock in `lib/api.ts`.

To build and run for production:

```bash
npm run build
npm start
```

To lint the codebase:

```bash
npm run lint
```

There are no environment variables needed for the mock setup. When connecting a real backend, you'll only need to replace the two API seams (`lib/api.ts` for chat and `lib/auth.ts` for authentication). The component code doesn't need to change.

## Technologies Used

| Technology | Purpose |
|------------|---------|
| [Next.js](https://nextjs.org/) | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | Minimal, purposeful animations |
| [HugeIcons](https://hugeicons.com/) | Clean, stroke-based icon set |
| [Geist Font](https://vercel.com/font) | Typography, loaded via next/font |

## Contributing

Contributions are welcome. This is a frontend-only project with mocked backend seams, so changes should focus on the UI layer. If you want to add features, fix bugs, or improve responsiveness, feel free to open a pull request.

Make sure your code passes the existing lint setup (`npm run lint`) and follows the design tokens defined in the project's styling — no gradients, no emojis, no random colors.

## Badges

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://dokugen.samueltuoyo.com)