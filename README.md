# ChatGPT Lab Onboard

A guided planning tool that helps students prepare and host a one-hour, peer-led ChatGPT workshop on campus. I built it as part of my application to work in student community at OpenAI.

## About the project

Hosting a workshop involves more than knowing the tool. This walks students through what they want people to learn, the practical details of running the event, and a final plan they can take with them.

- Work through guided conceptual and logistics checklists.
- Return to a saved plan in the same browser.
- Export an event plan as a PDF.

## Built with

- **Next.js, TypeScript, and Tailwind CSS** for the interface, with App Router pages following the planning sequence from introduction to summary.
- **JSON-driven content** separates checklist items and dialogue from the page components, making workshop copy easier to revise.

## Links

[Try the planner](https://hostastudentlab.com/intro)

## Run locally

```sh
npm install
npm run dev
```

Open `http://localhost:3000`. For a production build, run `npm run build`, then `npm run start`.
