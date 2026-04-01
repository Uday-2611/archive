# Archive - Security & Compliance Document

**Version:** 1.0  
**Date:** 2025  
**Status:** MVP  

---

## Security Overview

Archive prioritizes user data security and privacy. This document outlines all security measures implemented.

**Security Principles:**
1. **Defense in depth** — Multiple layers of security
2. **Principle of least privilege** — Users only access their own data
3. **Secure by default** — All data private unless explicitly shared
4. **Transparency** — Clear privacy policy
5. **Continuous monitoring** — Error tracking & alerting

---

## Authentication & Authorization

### Authentication (Clerk)

**Handled by Clerk:**
- Email/password signup with bcrypt hashing
- OAuth (Google, GitHub, Apple)
- Email verification
- Password reset flow
- Session token management (JWT)
- Two-factor authentication (Phase 2)

**Archive does NOT:**
- Store passwords
- Handle password hashing
- Manage sessions manually

**JWT Token Validation:**
```typescript
// In Convex functions
import { getAuthUserId } from "convex/server"

export const getItems = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Not authenticated")
    // Proceed with authenticated request
  },
})
```

### Authorization

**Rule:** Users can only access their own data.

**Enforced in Every Mutation:**
```typescript
export const updateItem = mutation({
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    const item = await ctx.db.get(args.itemId)
    
    // Authorization check
    if (item.userId !== userId) {
      throw new Error("Not authorized to update this item")
    }
    
    // Safe to proceed
    await ctx.db.patch(args.itemId, args.updates)
  },
})
```

**Public Data Exceptions:**
- Public profiles: Read-only access
- Public collections: Read-only access
- Public items in collections: Read-only access

**Pattern:**
```typescript
// Check if collection is public before allowing read
export const getPublicCollection = query({
  handler: async (ctx, args) => {
    const collection = await ctx.db.get(args.collectionId)
    const folder = await ctx.db.get(collection.folderId)
    
    if (!folder.isPublic) {
      throw new Error("Collection is not public")
    }
    
    return collection
  },
})
```

---

## Data Encryption

### In Transit (TLS/HTTPS)

**Automatic with Vercel:**
- All traffic encrypted with TLS 1.2+
- Certificate: Let's Encrypt (auto-renewed)
- HSTS header set (forces HTTPS)

**Verification:**
- Visit `https://archive.app` (HTTPS enforced)
- Padlock icon in browser
- No HTTP fallback

### At Rest (Convex)

**Convex handles encryption:**
- Database encrypted at rest (AES-256)
- Backups encrypted
- User passwords hashed with bcrypt (Clerk)

**Archive responsibility:**
- No plaintext storage
- Sensitive data encrypted in transit only

### File Uploads (Cloudinary)

**Image encryption:**
- HTTPS only
- Stored in Cloudinary's secure servers
- Cloudinary handles encryption at rest

**We DON'T:**
- Decrypt images server-side
- Store encryption keys in code
- Send unencrypted files

---

## Environment Variables & Secrets

### Secure Management

**NEVER commit secrets:**
```bash
# .gitignore
.env.local
.env.production
```

**Local Development (.env.local):**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...  # NEVER public
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...        # NEVER public
```

**Production (Vercel):**
- Store in Vercel's "Environment Variables" dashboard
- Never in code
- Auto-injected at build time

**Access Control:**
- Only necessary secrets per environment
- Different keys for staging/production
- Rotate keys on team member departure

### Public vs. Private Keys

**Public Keys (safe to expose):**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Private Keys (NEVER expose):**
- `CLERK_SECRET_KEY`
- `CLOUDINARY_API_KEY`
- `STRIPE_SECRET_KEY`
- Database connection strings

**Rule:** Anything prefixed `NEXT_PUBLIC_` is embedded in frontend JavaScript. Anything without is server-side only.

---

## Input Validation & Sanitization

### Client-Side Validation (UX)

```typescript
// src/components/ItemForm.tsx
<input
  maxLength={200}
  placeholder="Title (max 200 chars)"
  value={title}
  onChange={(e) => setTitle(e.target.value.slice(0, 200))}
/>
```

**Not for security** — User can bypass this.

### Server-Side Validation (Security)

**In Convex mutations:**
```typescript
export const createItem = mutation({
  args: {
    title: v.string(),          // Type-checked
    description: v.optional(v.string()),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Convex validates types automatically
    
    // Additional validation
    if (args.title.length > 200) {
      throw new Error("Title too long")
    }
    
    if (args.title.trim().length === 0) {
      throw new Error("Title cannot be empty")
    }
    
    if (args.tags.length > 10) {
      throw new Error("Maximum 10 tags")
    }
    
    // Safe to use
    await ctx.db.insert("items", {
      userId,
      title: args.title.trim(),
      tags: args.tags.map(t => t.trim()),
      // ...
    })
  },
})
```

### XSS Prevention

**Stored XSS Prevention:**
- Convex validates all data types
- Store raw text, not HTML
- Sanitize on display (React auto-escapes)

```typescript
// SAFE: React auto-escapes
<p>{item.title}</p>
// Renders as text, not HTML

// UNSAFE: Never do this
<p dangerouslySetInnerHTML={{ __html: item.title }} />
// Could execute malicious JS
```

**Reflected XSS Prevention:**
- No URL parameters used in unsanitized output
- URL params validated before use

```typescript
// SAFE
const folderId = params.folderId
const folder = await db.get(folderId)  // Validates ID format

// UNSAFE
<div>{params.query}</div>  // Could contain malicious HTML
```

### SQL Injection Prevention

**Not applicable** — Using Convex (not SQL).
Convex handles all data access.

### CSRF Protection

**For POST requests:**
- Next.js built-in CSRF protection
- Server Actions have automatic tokens

```typescript
"use server"  // Server action
export async function saveItem(formData) {
  // CSRF token auto-validated
  const title = formData.get("title")
  // ...
}
```

**For Convex mutations:**
- Clerk session token required
- Cannot be called from different origin

---

## Rate Limiting

### API Rate Limits

**Vercel Edge Functions (automatic):**
- 30 requests per 10 seconds per IP
- Prevents brute force attacks

**External APIs:**
- TMDB: 40 requests/10 seconds ✅
- Open Library: 100 requests/second ✅
- Genius: 10 requests/second ✅
- All well within limits

### User-Level Rate Limiting (Phase 2)

```typescript
// Track requests per user
const key = `ratelimit:${userId}:${endpoint}`
const count = await redis.incr(key)
await redis.expire(key, 60)  // 1 minute window

if (count > 100) {
  throw new Error("Rate limit exceeded")
}
```

**Limits per user per minute:**
- Save item: 100/min
- Like item: 100/min
- Follow user: 50/min
- Create folder: 20/min

---

## CORS & Headers

### CORS Configuration

**Only allow archive.app domain:**
```typescript
// next.config.js
const headers = [
  {
    key: "Access-Control-Allow-Origin",
    value: "https://archive.app",
  },
  {
    key: "Access-Control-Allow-Methods",
    value: "GET, POST",
  },
]
```

**For browser extension:**
- Extension communicates directly to Convex
- Clerk handles authentication
- No CORS issues

### Security Headers

```typescript
// next.config.js
const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",  // Don't sniff MIME types
  },
  {
    key: "X-Frame-Options",
    value: "DENY",  // Prevent clickjacking
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",  // XSS protection
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
]
```

---

## Database Security

### Access Control

**Convex enforces:**
- Only authenticated users can call mutations
- Authorization checks in every mutation
- Users cannot directly query other users' data

**No SQL injection possible:**
- Convex uses type-safe queries
- No string interpolation

### Backups

**Convex automatic backups:**
- Daily snapshots
- 30-day retention
- Encrypted backups
- Can restore to any point in time

**Archive backup policy:**
- Rely on Convex backups (Phase 2: implement additional backups)

---

## API Security

### Clerk Authentication

**Every Convex mutation requires auth:**
```typescript
const userId = await getAuthUserId(ctx)
if (!userId) throw new Error("Not authenticated")
```

**Prevents:**
- Unauthenticated API calls
- Token replay attacks
- Forged requests

### API Key Rotation

**External API keys:**
- Cloudinary API key: Rotate annually
- Stripe API key: Rotate on team member departure
- Clerk keys: Auto-rotated by Clerk

**No hardcoded keys in code:**
- All keys in environment variables
- Keys never logged or exposed in errors

---

## Error Handling

### Safe Error Messages

**DO:**
```typescript
throw new Error("Item not found")
throw new Error("Not authorized")
```

**DON'T:**
```typescript
// Leaks database structure
throw new Error("No row in users table where id = 123")

// Leaks file paths
throw new Error("Failed to load /var/data/users.json")

// Leaks stack traces
throw new Error(error.stack)
```

### Error Logging

**Sentry (Phase 2):**
- Capture errors server-side
- Don't send error details to client
- Client sees generic message

```typescript
try {
  await db.get(itemId)
} catch (error) {
  Sentry.captureException(error)  // Log internally
  throw new Error("Failed to load item")  // Show to user
}
```

---

## File Upload Security

### Image Upload (Cloudinary)

**Validation:**
```typescript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 10 * 1024 * 1024  // 10MB

if (!ALLOWED_TYPES.includes(file.type)) {
  throw new Error("Invalid file type")
}

if (file.size > MAX_SIZE) {
  throw new Error("File too large")
}
```

**Cloudinary handles:**
- Virus scanning
- Malware detection
- Image format validation
- Automatic optimization

### PDF & Document Uploads (Phase 2)

**Validation:**
```typescript
const ALLOWED_TYPES = ['application/pdf']

if (!ALLOWED_TYPES.includes(file.type)) {
  throw new Error("Only PDFs allowed")
}
```

**Virus scanning:**
- Use ClamAV or similar
- Scan before storing
- Quarantine if infected

---

## Privacy & GDPR Compliance

### Data Collection

**We collect:**
- Email, username, password hash (via Clerk)
- Profile information (avatar, bio)
- Content saved (items, folders, collections)
- Activity logs (viewed items, follows)
- IP address (via Vercel logs)

**We DON'T collect:**
- Browser history
- Device information (except for analytics)
- Location data
- Third-party cookies

### Data Retention

**Active users:**
- Keep all data indefinitely

**Deleted accounts:**
- Soft delete account (accessible for 30 days)
- After 30 days: Hard delete all data
- Collections made private
- Backups retained for 30 days

**Data export:**
```typescript
// User can download all their data
GET /api/export
→ Returns ZIP file with:
  - user.json (profile)
  - items.json (all saved items)
  - folders.json (folder structure)
  - collections.json (public collections)
```

### Right to Data Deletion

**GDPR requirement:**
```typescript
// User requests account deletion
POST /api/delete-account
1. Verify user identity
2. Start 30-day grace period
3. Send confirmation email
4. After 30 days: Hard delete
```

### Data Processing Agreement (DPA)

**EU/GDPR users:**
- Sign DPA before processing data
- Document legal basis for processing
- Conduct DPIA (Data Protection Impact Assessment)
- Implement privacy by design

---

## Third-Party Services

### Clerk (Authentication)
- **Data:** Email, profile info, auth tokens
- **Privacy:** EU-US Privacy Shield compliant
- **Link:** https://clerk.com/privacy

### Convex (Database)
- **Data:** All user data
- **Privacy:** Encrypts at rest, ISO 27001 certified
- **Link:** https://convex.dev/privacy

### Cloudinary (Images)
- **Data:** Images and videos
- **Privacy:** GDPR compliant, SOC 2 certified
- **Link:** https://cloudinary.com/privacy

### Stripe (Payments) — Phase 2
- **Data:** Payment info, subscription
- **Privacy:** PCI DSS compliant
- **Link:** https://stripe.com/privacy

### Vercel (Hosting)
- **Data:** Application logs, error reports
- **Privacy:** GDPR compliant
- **Link:** https://vercel.com/privacy

---

## Privacy Policy & Terms

### Required Documents

**Privacy Policy:**
- What data we collect
- How we use it
- How long we keep it
- User rights (access, deletion, portability)
- Contact for questions

**Terms of Service:**
- Acceptable use (no illegal content, spam, harassment)
- Content ownership (users own their items)
- Liability limitations
- Dispute resolution

**Use Template:**
- iubenda.com (automatic policy generator)
- Termly.io (policy + cookie consent)

### User Consent

**On signup:**
- Accept Terms of Service
- Accept Privacy Policy
- Checkbox: "I agree..."

**For cookies:**
- Banner on first visit
- Explain what cookies are used
- Allow reject button
- Store consent preference

---

## Monitoring & Incident Response

### Error Tracking (Sentry)

```typescript
// Capture all errors
npm install @sentry/nextjs

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
})
```

**Alerts:**
- Spike in errors (> 10/min)
- Database errors
- Authentication failures
- Payment errors (Phase 2)

### Uptime Monitoring

**Uptime Robot:**
- Ping `https://archive.app` every 5 minutes
- Alert if down for > 5 minutes
- Check critical endpoints (login, save)

```
Status page: status.archive.app
History: 30-day uptime report
```

### Audit Logging (Phase 2)

```typescript
// Log all user actions
auditLog: defineTable({
  userId: v.id("users"),
  action: v.string(),        // "saveItem", "deleteItem", etc
  resourceType: v.string(),  // "item", "folder", "collection"
  resourceId: v.string(),
  changes: v.any(),          // What changed
  createdAt: v.number(),
})
```

**Queries:**
- User wants to see activity history
- Admin investigates suspicious activity
- Compliance audits

---

## Incident Response Plan

### In Case of Security Breach

1. **Detect:** Monitoring system alerts
2. **Isolate:** Immediately stop further damage
3. **Investigate:** Determine scope & impact
4. **Notify:** Contact affected users (within 72 hours for GDPR)
5. **Remediate:** Fix vulnerability
6. **Document:** Post-mortem analysis

### Communication Template

```
Subject: Important Security Notice

We discovered a security issue affecting your account.
Here's what happened: [Details]
What we did: [Actions taken]
What you should do: [Recommended steps]
Contact: security@archive.app
```

---

## Penetration Testing

**Before public launch:**
- Hire security firm for penetration test
- Test common vulnerabilities:
  - SQL injection
  - XSS
  - CSRF
  - Authentication bypass
  - Authorization bypass
  - File upload exploits

**Regular testing:**
- Annual penetration test (Phase 2+)
- Bug bounty program (Phase 3+)

---

## Secure Development Practices

### Code Review

**Before merging:**
- Another developer reviews code
- Security check:
  - No hardcoded secrets
  - Auth checks present
  - Input validation
  - Error handling

### Dependencies

**Keep dependencies updated:**
```bash
npm audit          # Check for vulnerabilities
npm audit fix      # Auto-fix where possible
npm outdated       # See outdated packages
```

**Policy:**
- Update monthly
- Security patches: immediately
- Major versions: test thoroughly before deploying

### Secure Coding Checklist

- [ ] All secrets in environment variables
- [ ] User input validated server-side
- [ ] Auth checks in every mutation
- [ ] No console.logs with sensitive data
- [ ] Error messages don't leak info
- [ ] SQL/NoSQL injection prevented
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] HTTPS enforced
- [ ] No hardcoded credentials

---

## Security Roadmap

### MVP (Now)
- ✅ HTTPS everywhere
- ✅ Input validation
- ✅ Authorization checks
- ✅ Environment variable secrets
- ✅ CORS configured
- ✅ Soft deletes (data recovery)

### Phase 2 (Month 2-3)
- [ ] Two-factor authentication
- [ ] Audit logging
- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring
- [ ] GDPR DPA
- [ ] Security headers

### Phase 3 (Month 4+)
- [ ] Penetration testing
- [ ] Bug bounty program
- [ ] End-to-end encryption (journals)
- [ ] API key rotation
- [ ] SOC 2 certification
- [ ] Advanced threat detection

---

## Contact

**Security inquiries:**
Email: security@archive.app

**Report vulnerability:**
Don't create public GitHub issue.
Email security team with:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (optional)

**Response time:** Within 24 hours

