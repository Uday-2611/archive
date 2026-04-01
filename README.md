# Archive

Archive is a digital memory and social curation platform where users can save anything from the web, organize it into folders, and share curated collections.

The product is designed to combine personal knowledge management (save and organize) with social discovery (follow curators, explore collections).

## What This Project Includes

- Next.js app with App Router and TypeScript
- Clerk authentication wired into the root layout
- Convex schema for users, folders, items, collections, follows, likes, comments, notifications, and billing events
- Tailwind CSS and shadcn-based UI foundation
- Product and architecture documentation in the docs folder

## Current Status

This repository is in active setup/foundation stage:

- Core stack and project structure are in place
- Convex data model is defined
- Main product flows are documented
- Most feature routes and Convex functions are still to be implemented

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Auth: Clerk
- Backend and database: Convex
- Media: Cloudinary
- UI primitives/components: Radix and shadcn

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm run dev
```

3. Open:

http://localhost:3000

## Documentation

See the docs folder for full planning and architecture details:

- Product requirements and goals
- App flow and user journeys
- Frontend design guidelines
- Backend schema design
- Security and implementation roadmap
