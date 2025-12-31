# ChatGPT Lab Onboard

A friendly, guided planning tool for hosting a one-hour, peer-led ChatGPT Lab on campus. It walks hosts through conceptual and logistics checklists, saves progress locally, and generates a clean event plan PDF at the end. ✨

## What’s inside (quick tour) 🧭
- **App Router flow:** pages live in `src/app` with a simple intro → conceptual → logistics → summary → outro path.
- **Content-driven copy:** checklist items and dialogue live in `src/content/*.json`.
- **Local-first data:** progress + event data are stored in `localStorage` via `src/lib/storage.ts`.
- **Reusable UI:** shared components in `src/components`, plus page transitions for a smooth feel.
- **PDF export:** built client-side with `@react-pdf/renderer` in `src/lib/planPdf.tsx`.
- **Assets:** images live in `public/assets` and are preloaded for faster transitions.

## Run it locally 🚀
Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build for production 📦
```bash
npm run build
npm run start
```

## Scripts 🧰
- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run start` – run the production server
- `npm run lint` – lint the codebase
