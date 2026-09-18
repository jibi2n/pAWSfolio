# pAWSfolio

**pAWSfolio** is a showcase where members of **AWS Builders - UST** post what they've built with AWS, browse each other's work, bump the builds they like, and leave comments. Think of it as one shared portfolio for the whole org.

Built as my submission for the AWS Builders - UST developer assessment. The design is inspired by the [AWS Builders - UST website](https://www.aws-ust.org).

<!-- Screenshot / demo GIF goes here -->

## The Assessment

Build a blog-style application with the following features:

| #   | Feature              | Requirement                                                                     | In pAWSfolio                                                                                   |
| --- | -------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 1   | **Create a Post**    | Users can create their own post. Each post must have a title and a description. | **Post a build** with a title, description, image or GIF, optional link, AWS service tags, and status |
| 2   | **View All Posts**   | Shows all the posts that were created.                                          | The **feed** on `/`, with search, tag filters, sorting, and pagination                         |
| 3   | **View Single Post** | Users can view a single post, along with all of its comments.                   | `/builds/[id]` shows the full build and its comments                                           |
| 4   | **Add Comment**      | Users can add a comment to a post.                                              | Any logged-in member can comment on a build                                                    |
| 5   | **Delete Comment**   | Users can delete comments made on their post.                                   | A build's owner can delete any comment on it, and commenters can delete their own              |

**Rules:** Any resources or frameworks are allowed (React, jQuery, Bootstrap, etc.), but **no templates**, not even for components (headers, footers, shadcn, etc.).

### Beyond the brief

- **Edit and delete your own builds.** Deleting a build also removes its comments and uploaded image.
- **Accounts.** Sign up, log in, and log out. Guests can browse; posting, commenting, and bumping need an account.
- **Bumps.** Like a build once per account. The feed can sort by most bumped.
- **Image and GIF uploads** up to 10MB.
- **Responsive**, from a 390px phone to a desktop.
- **Interactive hero clouds.** Soft, see-through Vanta.js clouds on the landing page, login, and signup drift toward your mouse or finger (off when the device asks for reduced motion).
- **Purple mode.** A toggle in the nav switches to a dark purple theme. It remembers your choice and follows your device's dark mode setting by default.

## Tech Stack

| Layer     | Choice                                                                                                   |
| --------- | -------------------------------------------------------------------------------------------------------- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Server Components, Server Actions)                         |
| UI        | React 19 and TypeScript                                                                                  |
| Styling   | Tailwind CSS v4, with design tokens from [DESIGN.md](DESIGN.md) in `app/globals.css`                     |
| Backgrounds | [Vanta.js](https://www.vantajs.com) CLOUDS effect on [three.js](https://threejs.org): interactive clouds behind the hero, login, and signup |
| Fonts     | Poppins, JetBrains Mono, and Gochi Hand, loaded with `next/font`                                         |
| Data      | A JSON file on disk (`data/db.json`). No database server to set up                                       |
| Images    | Saved to `data/uploads/` and served by a route handler                                                   |
| Auth      | Session cookie (`httpOnly`) holding a random token that maps to a user                                   |

No component libraries or UI kits: every component (nav, cards, forms, modal, and so on) is hand-written. The design was mocked up in Figma first; see [DESIGN.md](DESIGN.md) for the design system.

## Getting Started

**Prerequisites:** Node.js 20.9 or newer.

```bash
cd pawsfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Demo account:** `mariasantos@ust.edu.ph` / `password123`. All 8 demo users share the password `password123`, or you can sign up for a new account.

**Reset the data:** delete `pawsfolio/data/db.json` (and `pawsfolio/data/uploads/` for uploaded images). The next request recreates it from `data/seed.json`.

**Production build:**

```bash
npm run build
npm start
```

Other scripts: `npm run lint`.

> Data is stored on the local disk, so run it on your machine or on a single server with persistent storage (such as an EC2 instance). Serverless hosts like Vercel reset the filesystem, which would wipe posts and uploads.

## Project Structure

```
pAWSfolio/
├── DESIGN.md                   Design system: colors, type, components, screens
├── IDEA.md                     Original project idea
└── pawsfolio/                  The Next.js app
    ├── app/
    │   ├── layout.tsx          Fonts, nav, current user
    │   ├── page.tsx            Feed: hero, search, filters, grid, pagination
    │   ├── actions.ts          Server actions: auth, builds, comments, bumps (with ownership checks)
    │   ├── builds/
    │   │   ├── new/            Create a build
    │   │   └── [id]/           View a build (+ edit/ for the owner)
    │   ├── me/                 My builds
    │   ├── login/  signup/     Auth pages
    │   ├── uploads/[name]/     Serves uploaded images
    │   ├── not-found.tsx       404 page
    │   └── globals.css         Tailwind theme and shared styles
    ├── components/             Nav, feed, post card, build detail, form, comments, modal, shared UI
    ├── lib/
    │   ├── db.ts               Reads and writes data/db.json
    │   ├── auth.ts             Sessions and the current user
    │   └── types.ts            Data types and AWS service tags
    └── data/
        ├── seed.json           Demo users and builds (committed)
        ├── db.json             Live data, created on first run (gitignored)
        └── uploads/            Uploaded images (gitignored)
```

## How It Works

- **Pages are server-rendered.** Each page reads `data/db.json` and the logged-in user on the server, so only one page of builds is sent to the browser.
- **Every change goes through a server action** in `app/actions.ts`. Each action checks who is logged in and whether they own the build or comment before changing anything, so hiding a button in the UI is never the only protection.
- **The feed's search, tags, sort, and page live in the URL** (for example `/?tags=S3,Lambda&sort=bumped&page=2`), so the back button works and filtered views can be shared.

## Known Limitations

This is an MVP meant to demonstrate CRUD and design. Before real use, it would need:

- **Password hashing.** Passwords are currently stored as plain text, and the login page says so.
- **A real database.** The JSON file is rewritten on every change with no locking, which is fine for a demo but not for many simultaneous users. SQLite or Postgres would be the next step.
- **Image optimization.** Images use plain `<img>` tags rather than `next/image`.
