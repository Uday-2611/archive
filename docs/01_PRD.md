# Archive - Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** 2025  
**Status:** MVP Ready  

---

## Executive Summary

Archive is a universal digital memory and social curation platform where users can save anything from the internet (articles, images, videos, code, colors, music, movies, books, notes, stories) into organized folders, share curated collections with their community, and build reputation as a curator.

**Core Value Proposition:**
- One place for everything you want to remember (no app switching)
- Powerful organization (nested folders, tags, search)
- Social discovery (follow curators, explore trending collections)
- Creator economy (build audience, earn from recommendations)

**Target Users:**
- Designers, developers, researchers (save inspiration, code, design systems)
- Film enthusiasts, book readers, music lovers (track watched/read/listened)
- Finance & business professionals (save research, articles, data)
- Students & learners (build personal knowledge base)
- General consumers (save anything useful)

**Market Positioning:**
Archive is the bridge between personal productivity tools (Notion, Obsidian) and social discovery platforms (Pinterest, Twitter). It's curation-focused, not creation-focused.

---

## Core Product Vision

### Problem Statement

Users constantly discover amazing things online—articles, videos, images, code, quotes, designs—but:
1. **No unified place:** Content scattered across browser bookmarks, notes, messages, screenshots
2. **No organization:** Can't find saved items later (browser history is useless)
3. **No social layer:** Can't share what they've discovered or learn from others' taste
4. **No monetization:** Curators can't build audience or earn from their recommendations

### Solution

Archive provides:
1. **Universal capture:** Save anything from the web (links, images, videos, text, code, etc.)
2. **Smart organization:** Nested folders, tags, full-text search across everything
3. **Social curation:** Public profiles, follow other curators, explore trending collections
4. **Creator economy:** Build audience, earn through affiliate links, sponsorships, premium collections

### Success Metrics (MVP)

- **Growth:** 100 signups in first month → 1000 active users by month 3
- **Engagement:** 50+ items per active user, 30+ day retention > 50%
- **Quality:** Average 4.5+ stars if we add ratings, positive user feedback
- **Revenue:** Free tier gets 80% users, 5-10% upgrade to Pro within 3 months

---

## User Personas

### Persona 1: Aria (Designer/Creative)
- **Age:** 27, Product Designer
- **Pain:** Saves design inspiration from Dribbble, Pinterest, websites but can't organize or reference it
- **Jobs:** Build mood boards, create design systems, track color palettes, reference typography
- **Uses Archive for:** Saving design systems, color palettes, UI components, inspiration images
- **Success:** "I have one place for all my design assets and inspiration" 

### Persona 2: Dev (Engineer/Builder)
- **Age:** 31, Full-stack Developer
- **Pain:** Finds great code snippets, techniques, libraries but loses them or can't remember which file
- **Jobs:** Build projects, learn new tech, stay updated on trends
- **Uses Archive for:** Saving code snippets, GitHub repos, tutorials, tech articles, architecture diagrams
- **Success:** "I found that Redux pattern I saved 6 months ago in seconds"

### Persona 3: Fin (Analyst/Researcher)
- **Age:** 28, Financial Analyst
- **Pain:** Saves research papers, articles, datasets but they're scattered across multiple tools
- **Jobs:** Research investments, track market trends, build investment theses
- **Uses Archive for:** Save research papers, financial articles, market data, competitor analysis
- **Success:** "Everything for my research in one searchable place"

### Persona 4: Nova (Creator/Curator)
- **Age:** 25, Instagram influencer / Design entrepreneur
- **Pain:** Wants to share her taste with audience but no platform gives her control & monetization
- **Jobs:** Build personal brand, monetize influence, create content around her expertise
- **Uses Archive for:** Share trend analysis, design inspiration, curated collections, build audience
- **Success:** "I built a following around my taste and earned money from it"

---

## Core Features (MVP)

### 1. Save & Capture (Critical)

**User can save:**
- Links (articles, websites, videos)
- Images (upload or screenshot)
- Text (notes, quotes, code snippets)
- Videos (YouTube links or uploads)
- Files (PDFs, documents)
- Manual entries (movie title, book name, song, recipe)

**How they save:**
- Web app: Paste link, upload image, type note
- Browser extension: One-click save from any page
- Email: Save items sent to archive@[domain]
- Mobile: Web app on mobile browsers

**Auto-capture:**
- Extract metadata (title, description, image thumbnail)
- Parse URLs to show preview
- OCR on screenshots (Phase 2)

### 2. Organization (Critical)

**Folders:**
- Infinite nesting (Folder → Subfolder → Sub-subfolder)
- Drag-drop reorganization
- Color-coding (optional)
- Bulk operations

**Tags:**
- Add unlimited tags per item
- Search by tags
- Tag suggestions (auto-complete)

**Search:**
- Full-text search (title, description, content)
- Filter by type (link, image, video, note)
- Filter by date range
- Filter by folder
- Saved searches (Phase 2)

### 3. Collections & Sharing (Important)

**Collections:**
- Make folder public (creates shareable collection)
- Custom collection title & description
- Collection stats (views, likes, followers)
- Collection URL: archive.app/@username/collection/name

**Sharing:**
- Generate shareable link for any collection
- Embed collections on external websites (Phase 2)
- Download collection as CSV/JSON (Phase 2)

### 4. Social Features (Important)

**Profiles:**
- Public profile: archive.app/@username
- Profile info: Bio, interests, follower count
- Profile stats: Total items archived, collections, followers
- Verification badges (Phase 2)

**Following:**
- Follow other users → See their activity in your feed
- Follower count on profile
- Block users (Phase 2)

**Feed:**
- Following feed: Recent items/collections from people you follow
- Explore feed: Trending collections, top curators
- Discovery: Find curators by interest tags

**Engagement:**
- Like items and collections
- Comment on items in public collections
- Reply to comments (Phase 2)

### 5. Account & Settings (Important)

**Authentication:**
- Sign up with email/Google/GitHub
- Password reset
- Two-factor authentication (Phase 2)

**Profile Settings:**
- Edit bio, profile picture, interests
- Privacy settings: public/private profile, allow follows
- Notification preferences
- Connected services (Spotify, for music sync) (Phase 2)

**Account:**
- Storage usage display
- Download all data (GDPR requirement)
- Delete account (with data retention period)

### 6. Monetization (Phase 2, Optional for MVP)

**Free Tier:**
- 5GB storage
- Unlimited items
- Create 10 folders
- Basic search
- Private collections only

**Pro Tier ($9.99/month):**
- 500GB storage
- Unlimited folders
- Advanced search (OCR, image recognition)
- Public collections
- Follow & follower system
- View analytics on public collections

**Creator Tier ($24.99/month):**
- 2TB storage
- Everything in Pro
- Monetization dashboard (affiliate links, sponsorships)
- Premium collections (charge followers to access)
- API access
- Custom domain for collections (Phase 3)

---

## Core User Flows

### Flow 1: Save an Item (30 seconds)

1. User finds article online
2. Clicks browser extension
3. Pop-up opens → Auto-fills title, image, URL
4. User picks folder
5. User adds tags (optional)
6. Clicks "Save"
7. Item appears in dashboard

**Success:** Item is saved and searchable

### Flow 2: Organize Archive

1. User goes to dashboard
2. Sees all items in grid/list view
3. Creates new folder (drag-drop or menu)
4. Drags items into folders
5. Adds tags to items
6. Uses search to find item later

**Success:** User can find saved item in 3 seconds using search

### Flow 3: Share a Collection

1. User creates public folder (e.g., "Design Inspiration")
2. Clicks "Make Public" → Folder becomes collection
3. Gets public URL: archive.app/@username/design-inspiration
4. Shares URL with friends/social media
5. Other users can view, like, follow, save collection

**Success:** Collection gets views and followers

### Flow 4: Discover & Follow

1. User visits Explore page
2. Sees trending collections, top curators
3. Clicks on curator → Views public profile
4. Clicks "Follow" → Sees their activity in feed
5. Sees new items they save in their feed

**Success:** User discovers new people and content

---

## Non-Functional Requirements

### Performance
- Page load: < 2 seconds (Vercel + Cloudinary CDN)
- Search results: < 500ms (indexed queries)
- Image loading: < 1 second (Cloudinary optimization)
- Database queries: < 100ms (Convex indexes)

### Scalability
- Support 100k concurrent users (Vercel auto-scales)
- Support 1TB data per user (Cloudinary scales)
- Real-time sync across devices (Convex real-time)

### Security
- All data encrypted in transit (HTTPS)
- User data encrypted at rest (Convex)
- No passwords stored (Clerk handles auth)
- GDPR compliant (data export, deletion, privacy policy)

### Reliability
- 99.9% uptime (Vercel SLA)
- Automatic backups (Convex)
- Error tracking & alerting (Sentry)

### Accessibility
- WCAG 2.1 AA compliant (keyboard nav, color contrast, alt text)
- Screen reader compatible
- Mobile responsive (all features on mobile)

---

## Out of Scope (Phase 2+)

- Mobile native apps (iOS/Android)
- AI-powered recommendations
- Advanced collaboration features
- Teams/organizations
- Custom integrations
- API for third-party developers
- Email digest newsletters
- Video hosting (use YouTube links only)
- Advanced analytics dashboard
- Marketplace for collections

---

## Success Criteria

### MVP Launch
- ✅ Users can save items (all types)
- ✅ Organize with folders & tags
- ✅ Search items
- ✅ Create public collections
- ✅ Follow users & see feed
- ✅ Like & comment on items
- ✅ Free tier works perfectly
- ✅ No critical bugs

### Post-Launch (Month 2)
- 100+ active users
- 50+ avg items per user
- 30+ day retention > 40%
- <2 second page load
- Zero critical bugs

### Month 3+
- 1000+ active users
- 5% Pro conversion rate
- 50+ day retention > 60%
- Positive user testimonials
- Growing trending collections

---

## Competitive Analysis

| Feature | Archive | Notion | Pinterest | Pocket |
|---------|---------|--------|-----------|--------|
| Save everything | ✅ | ❌ | ✅ (visual only) | ✅ (articles only) |
| Organize with folders | ✅ | ✅ | ❌ | ❌ |
| Social profiles | ✅ | ❌ | ✅ | ❌ |
| Public collections | ✅ | ❌ | ✅ | ❌ |
| Follow users | ✅ | ❌ | ✅ | ❌ |
| Comments | ✅ | ✅ | ✅ | ❌ |
| Search | ✅ | ✅ | ✅ | ✅ |
| Monetization | ✅ | ❌ | ❌ | ❌ |

**Archive wins on:** Universal capture + organization + social + monetization

---

## Appendix: Glossary

- **Item:** Any saved thing (link, image, note, video, code, etc.)
- **Folder:** Container for items (nested structure)
- **Collection:** Public folder that others can view & follow
- **Curator:** User with public collections & followers
- **Archive:** Your entire personal saved library
- **Tag:** Label applied to items for categorization
- **Storage:** Total space used (5GB free, 500GB Pro, 2TB Creator)

