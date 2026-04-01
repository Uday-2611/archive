# Archive Project Setup Guide

**Complete setup from zero to running locally**

---

## Prerequisites (10 min)

### Install Software
1. **Node.js** (v18+) from nodejs.org
2. **Git** from git-scm.com
3. **VS Code** (recommended)
4. Verify installation:
   ```bash
   node --version  # Should be v18+
   npm --version   # Should be 9+
   git --version   # Should be present
   ```

### Create Accounts (Free)
- GitHub (github.com)
- Convex (convex.dev)
- Clerk (clerk.com)
- Cloudinary (cloudinary.com)

---

## Step 1: Create GitHub Repository (5 min)

1. Go to github.com → Click "New" → Create repository
2. Name: `archive`
3. Description: "Universal Digital Memory Platform"
4. Choose: Private or Public (your choice)
5. Add .gitignore: Select "Node"
6. Click "Create repository"

**You now have a remote repo.** Copy the HTTPS URL (looks like `https://github.com/USERNAME/archive.git`)

---

## Step 2: Clone & Create Next.js Project (10 min)

```bash
# Navigate to where you want the project
cd ~/projects

# Clone the repo
git clone https://github.com/YOUR_USERNAME/archive.git
cd archive

# Create Next.js app with TypeScript & Tailwind
npx create-next-app@latest . --typescript --tailwind

# When prompted, answer:
# ✔ Use TypeScript: Yes
# ✔ Use ESLint: Yes
# ✔ Use Tailwind CSS: Yes
# ✔ Use src/ directory: Yes
# ✔ Use App Router: Yes
# ✔ Would you like to customize the import alias: No
```

This creates a Next.js app ready to go.

---

## Step 3: Install Required Packages (5 min)

```bash
# Backend & Database
npm install convex

# Authentication
npm install clerk next-clerk @clerk/nextjs

# Image Storage
npm install cloudinary next-cloudinary

# UI Components (shadcn)
npm install shadcn-ui

# Utilities
npm install zustand (for state management, optional)
```

---

## Step 4: Set Up Convex (5 min)

```bash
npx convex init
```

This will:
1. Open browser → Authenticate with Convex
2. Select "Create a new Convex team" (or existing)
3. Creates `convex.json` in your project root
4. Creates `convex/` folder

**Verify:**
- You should see a `convex/` folder with `_generated.ts`

---

## Step 5: Add Convex Database Schema (5 min)

1. **Copy the schema file** I provided (`archive-convex-schema.ts`)
2. **Paste it as** `convex/schema.ts`
3. In terminal, run:
   ```bash
   npm run convex:dev
   ```
   This watches for changes and syncs your schema to Convex.

**Verify in Convex Dashboard:**
- Go to convex.dev → Your project
- You should see all tables listed (users, items, folders, etc.)

---

## Step 6: Set Up Clerk (Authentication) (10 min)

### Get Keys from Clerk
1. Go to clerk.com → Dashboard
2. Click on "API Keys" (left sidebar)
3. Copy: `Publishable Key` and `Secret Key`

### Add to Environment Variables
Create `.env.local` in your project root:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_SECRET_HERE
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### Update Root Layout
Edit `src/app/layout.tsx`:

```tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

---

## Step 7: Set Up Cloudinary (Image Storage) (5 min)

### Get Keys from Cloudinary
1. Go to cloudinary.com → Dashboard
2. Find "Cloud Name" and "API Key"
3. Copy both

### Add to .env.local

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
```

---

## Step 8: Create Convex Functions (10 min)

Copy the functions file I provided (`archive-convex-functions.ts`) to:
```
convex/items.ts
```

This gives you mutations & queries to:
- Create items
- Update items
- Like items
- Search items
- Get collections

---

## Step 9: Run Locally (2 min)

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

**You should see:**
- Next.js default homepage (or custom landing page if you replaced it)
- No errors in terminal

**Test Convex Connection:**
Go to http://localhost:3000 → Open DevTools (F12) → Console
You should NOT see errors about Convex failing to connect.

---

## Step 10: Push to GitHub (2 min)

```bash
git add .
git commit -m "Initial setup: Next.js + Convex + Clerk + Cloudinary"
git push origin main
```

Code is now on GitHub.

---

## Step 11: Deploy to Vercel (Optional, but Recommended) (10 min)

### Deploy
1. Go to vercel.com → Login with GitHub
2. Click "Add New Project"
3. Select your `archive` repository
4. Vercel auto-detects it's a Next.js project
5. Click "Deploy"

### Add Environment Variables
1. After deployment starts, go to "Settings"
2. Add all variables from `.env.local`:
   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   - CLERK_SECRET_KEY
   - NEXT_PUBLIC_CLERK_SIGN_IN_URL
   - NEXT_PUBLIC_CLERK_SIGN_UP_URL
   - NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
   - NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
   - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY

3. Click "Deploy"

**Your site is now live at:** `https://archive-xxx.vercel.app`

---

## Troubleshooting

### "Convex connection failed"
- Check `CONVEX_DEPLOYMENT` in `.env.local` (should be auto-set)
- Run `npm run convex:dev` in another terminal

### "Clerk login not working"
- Check API keys are correct in `.env.local`
- Make sure you're using `NEXT_PUBLIC_` for public keys
- Restart dev server: `npm run dev`

### "Images not uploading to Cloudinary"
- Verify Cloud Name and API Key
- Check Cloudinary dashboard has the image

### "TypeError: Cannot find module"
- Run `npm install` again
- Delete `node_modules/` and `.next/`, then run `npm install`

---

## Next Steps After Setup

1. **Build Landing Page** (`src/app/page.tsx`)
   - Hero section
   - Features overview
   - Sign up CTA

2. **Build Auth Pages** (`src/app/sign-in` and `src/app/sign-up`)
   - Use Clerk's pre-built components

3. **Build Dashboard** (`src/app/dashboard/page.tsx`)
   - Protected route (Clerk middleware)
   - Sidebar with folders
   - Grid of items

4. **Create Convex Hooks** (`src/hooks/useItems.ts`, etc.)
   - React hooks to call Convex functions
   - Use `useQuery` for reading data
   - Use `useMutation` for writing data

5. **Build Components**
   - ItemCard
   - FolderTree
   - UploadButton
   - SearchBar

---

## Project Structure (After Setup)

```
archive/
├── .env.local                    # Environment variables (don't commit)
├── .gitignore                    # Git ignore file
├── convex/
│   ├── schema.ts                 # Database schema
│   ├── items.ts                  # Item functions
│   ├── _generated.ts             # Auto-generated by Convex
│   └── tsconfig.json
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout with providers
│   │   ├── page.tsx              # Landing page
│   │   ├── sign-in/[[...index]]/page.tsx    # Clerk sign-in
│   │   ├── sign-up/[[...index]]/page.tsx    # Clerk sign-up
│   │   └── dashboard/
│   │       ├── layout.tsx        # Dashboard layout
│   │       └── page.tsx          # Main dashboard
│   ├── components/               # React components
│   ├── lib/                      # Utilities
│   ├── hooks/                    # React hooks
│   └── styles/
├── public/                       # Static assets
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── convex.json                   # Convex config
└── README.md
```

---

## Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server (localhost:3000)

# Convex
npm run convex:dev      # Sync schema & run Convex locally

# Build
npm run build           # Build for production
npm start               # Start production build

# Git
git add .              # Stage changes
git commit -m "msg"    # Commit
git push origin main   # Push to GitHub
```

---

## Checklist

- [ ] Node.js installed (v18+)
- [ ] GitHub repo created
- [ ] Project cloned locally
- [ ] Next.js app created
- [ ] Packages installed
- [ ] Convex initialized
- [ ] Convex schema added
- [ ] Clerk keys in .env.local
- [ ] Cloudinary keys in .env.local
- [ ] Root layout updated with ClerkProvider
- [ ] npm run dev works
- [ ] Code pushed to GitHub
- [ ] Vercel deployed (optional)

---

## Support

If you get stuck:
1. Check the error message carefully (usually tells you what's wrong)
2. Check your API keys are correct
3. Restart the dev server
4. Delete `node_modules` and reinstall if something is broken

You're ready to start building! 🚀
