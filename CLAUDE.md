@ AGENTS.md

<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->

---

## Code Style & Conventions

### General Guidelines

- **Language**: Keep all comments, documentation, and variable names in formal English. Use clear, professional terminology.
- **Emojis**: Never use emojis in code, comments, commit messages, or documentation. Maintain a professional appearance.
- **Minimalism**: Avoid hardcoded values and static data. Use configuration files, environment variables, and database records instead.
- **DRY Principle**: Extract reusable logic into utility functions. Avoid duplicating code patterns.
- **Layout System**: Do not use CSS Grid or Tailwind `grid` utilities anywhere. Use Flexbox (`flex`) for all layout work.
- **Inline Styles**: Do not use `style` attributes or inline style objects in JSX/TSX.
- **Color Tokens**: Use color variables from `src/app/globals.css` through Tailwind utility classes.

### Comment Style

- Write clear, informative comments that explain the "why", not just the "what".
- Use formal language in all comments.
- Keep comments concise and to the point.
- Update comments when code changes.

Example:
```typescript
// Validates that the user owns the item before allowing deletion.
// Returns early if authorization fails to prevent unintended data loss.
const userId = await auth.getUserId(ctx)
if (item.userId !== userId) {
  throw new Error("User is not authorized to delete this item")
}
```

### Code Organization

- Group related functions together in the same file.
- Use consistent function naming conventions (camelCase for functions, PascalCase for classes/types).
- Import statements at the top of the file, organized by: external packages, then internal modules.
- Keep functions focused on a single responsibility.

---

## Color System

### CSS Variables (from `src/styles/globals.css`)

Always use CSS variables for colors. Never hardcode color values in components.

**Variable Naming Convention:**
```css
--color-{category}-{intensity}
```

**Available Color Variables:**

#### Primary Blue
```css
--color-primary: #6B8BB8
--color-primary-light: #E6EBF5
--color-primary-hover: #4A5F80
--color-primary-dark: #3A4F70
```

#### Accent Charcoal
```css
--color-accent: #4A4A4A
--color-accent-light: #C0C0C0
--color-accent-dark: #2C2C2C
```

#### Text Colors
```css
--color-text-primary: #2C2C2C
--color-text-secondary: #7C7C8C
--color-text-light: #A8A8A8
--color-text-white: #FFFFFF
```

#### Background Colors
```css
--color-bg-primary: #FAFAF8
--color-bg-white: #FFFFFF
--color-bg-light: #E6EBF5
```

#### Semantic Colors
```css
--color-success: #22C55E
--color-error: #EF4444
--color-warning: #F59E0B
--color-info: #0EA5E9
```

#### Borders & Dividers
```css
--color-border: #E8E8E8
--color-border-light: #D4D4D4
```

### Usage in Components

**In Tailwind CSS classes:**
```typescript
<button className="bg-primary text-text-inverse hover:bg-primary-700">
  Save Item
</button>
```

**In CSS modules:**
```css
.button {
  background-color: var(--color-primary);
  color: var(--color-text-white);
}

.button:hover {
  background-color: var(--color-primary-hover);
}
```

Never use hardcoded colors like `#6B8BB8` directly in components. Always reference CSS variables.

---

## shadcn/ui Components

### Usage Guidelines

- Import shadcn components from the correct location: `@/components/ui/{component-name}`.
- Always use shadcn components for standard UI elements (buttons, inputs, dialogs, cards, etc.).
- Do not override shadcn component styles directly. Instead, use CSS classes and CSS variables.
- Compose multiple shadcn components to build complex UI patterns.

### Common Components

**Buttons:**
```typescript
import { Button } from '@/components/ui/button'

// Primary button (blue)
<Button className="bg-blue-500 hover:bg-blue-700">
  Save Item
</Button>

// Secondary button (gray)
<Button variant="outline" className="border-charcoal-200">
  Cancel
</Button>
```

**Cards:**
```typescript
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'

<Card className="border-blue-100">
  <CardHeader>
    <h3 className="text-charcoal-900">Title</h3>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

**Input Fields:**
```typescript
import { Input } from '@/components/ui/input'

<Input
  placeholder="Search items..."
  className="border-charcoal-200 focus:border-blue-500"
/>
```

**Dialog (Modal):**
```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create New Item</DialogTitle>
    </DialogHeader>
    {/* Form content */}
  </DialogContent>
</Dialog>
```

---

## Data Management

### Avoid Hardcoding Static Data

Instead of hardcoding values, use:

1. **Environment Variables** (for configuration):
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760')
```

2. **Configuration Files** (for feature flags, constants):
```typescript
// src/lib/config.ts
export const STORAGE_LIMITS = {
  free: 5 * 1024 * 1024 * 1024, // 5GB
  pro: 500 * 1024 * 1024 * 1024, // 500GB
  creator: 2 * 1024 * 1024 * 1024 * 1024, // 2TB
}

export const ITEM_TYPES = ['link', 'image', 'video', 'note', 'article']
```

3. **Database Records** (for dynamic data):
```typescript
// Instead of hardcoding user data or settings, fetch from Convex
const userSettings = await ctx.db.query('users').filter(...).first()
```

4. **API Responses** (for external data):
```typescript
// Instead of hardcoding movie data, fetch from TMDB API
const movieData = await fetchMovieData(movieId)
```

### Configuration Hierarchy

1. **Environment variables** - Deployment-specific settings
2. **Configuration files** - App-level constants
3. **Database** - User-specific or dynamic data
4. **Hardcoded values** - Only for genuinely static values (e.g., page margins, standard sizes)

---

## TypeScript & Type Safety

### Type Definitions

- Always define types for function parameters and return values.
- Use meaningful type names that clearly indicate what the type represents.
- Extract complex types into separate type definition files when they are reused.

```typescript
// src/lib/types.ts
export interface Item {
  _id: string
  userId: string
  title: string
  type: ItemType
  createdAt: number
}

export type ItemType = 'link' | 'image' | 'video' | 'note' | 'article'
```

### Interface vs Type

- Use `interface` for object shapes that might be extended.
- Use `type` for unions, intersections, and aliases.

```typescript
interface User {
  id: string
  email: string
}

type UserWithItems = User & {
  items: Item[]
}
```

---

## Convex Integration

### Mutations (Write Operations)

When writing Convex mutations:

1. Validate user authentication and authorization first.
2. Validate all inputs before database operations.
3. Use descriptive error messages for validation failures.
4. Return only necessary data to the client.

```typescript
// convex/items.ts
export const createItem = mutation({
  args: {
    title: v.string(),
    type: v.string(),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      throw new Error("User must be authenticated to create items")
    }

    if (args.title.trim().length === 0) {
      throw new Error("Item title cannot be empty")
    }

    const itemId = await ctx.db.insert("items", {
      userId,
      title: args.title.trim(),
      type: args.type,
      url: args.url,
      createdAt: Date.now(),
    })

    return { itemId }
  },
})
```

### Queries (Read Operations)

When writing Convex queries:

1. Filter by user ID to prevent unauthorized access.
2. Use indexes for fast queries.
3. Paginate large result sets.
4. Cache results when appropriate.

```typescript
export const getUserItems = query({
  args: {
    limit: v.number(),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      throw new Error("User must be authenticated to view items")
    }

    const items = await ctx.db
      .query("items")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(args.limit)

    return items
  },
})
```

### Actions (External API Calls)

Use actions for external API calls (TMDB, Cloudinary, etc.).

```typescript
export const searchMovies = action({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(args.query)}&api_key=${process.env.TMDB_API_KEY}`
    )

    if (!response.ok) {
      throw new Error("Failed to fetch from TMDB API")
    }

    const data = await response.json()
    return data.results
  },
})
```

---

## Error Handling

### Frontend Error Handling

- Catch errors from mutations and display user-friendly messages.
- Log errors to monitoring service (Sentry) for debugging.
- Never expose sensitive error details to users.

```typescript
try {
  await saveItem({ title, type, url })
  toast({
    title: "Success",
    description: "Item saved successfully",
  })
} catch (error) {
  console.error("Error saving item:", error)
  toast({
    title: "Error",
    description: "Failed to save item. Please try again.",
    variant: "destructive",
  })
}
```

### Backend Error Handling

- Validate inputs before processing.
- Return specific error messages for debugging.
- Use appropriate HTTP status codes (via Convex's error throwing).
- Log errors for monitoring.

```typescript
if (!userId) {
  throw new Error("User authentication failed")
}

if (args.title.length > 200) {
  throw new Error("Title exceeds maximum length of 200 characters")
}
```

---

## Performance Considerations

### Code Performance

- Use pagination for large lists (items, collections, etc.).
- Implement lazy loading for images and heavy content.
- Cache frequently accessed data (user profile, settings).
- Use indexes in Convex queries for fast lookups.

### Bundle Size

- Import only what you need from libraries.
- Use dynamic imports for large components that aren't immediately needed.
- Keep CSS class names minimal by using Tailwind utilities.

### Database Queries

- Always use indexes for frequently queried fields.
- Filter early and filter often to reduce data transfer.
- Use pagination to limit result sets.
- Denormalize data when queries would be too complex.

---

## File Structure

### Expected Directory Organization

```
archive/
├── convex/
│   ├── schema.ts              # Database schema
│   ├── items.ts               # Item mutations and queries
│   ├── folders.ts             # Folder operations
│   ├── users.ts               # User operations
│   ├── auth.ts                # Authentication utilities
│   └── _generated/            # Auto-generated files
│
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Landing page
│   │   ├── dashboard/         # Protected dashboard routes
│   │   └── (auth)/            # Auth pages (sign-in, sign-up)
│   │
│   ├── components/
│   │   ├── ui/                # shadcn components
│   │   ├── layout/            # Layout components
│   │   ├── features/          # Feature-specific components
│   │   └── common/            # Reusable components
│   │
│   ├── hooks/
│   │   ├── useItems.ts        # Item queries and mutations
│   │   ├── useFolders.ts      # Folder operations
│   │   └── useAuth.ts         # Auth utilities
│   │
│   ├── lib/
│   │   ├── config.ts          # Configuration constants
│   │   ├── types.ts           # TypeScript type definitions
│   │   ├── utils.ts           # Utility functions
│   │   ├── colors.ts          # Color constant exports
│   │   └── constants.ts       # App-wide constants
│   │
│   └── styles/
│       ├── globals.css        # Global styles and CSS variables
│       └── variables.css      # Additional CSS custom properties
│
├── docs/
│   ├── COLOR_THEMES.md
│   ├── COMPLETE_COLOR_PALETTE.md
│   ├── FINAL_COLOR_SYSTEM.md
│   └── (other documentation)
│
├── public/                     # Static assets
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
├── .env.local                 # Local environment variables
└── AGENTS.md                  # This file
```

---

## Testing Guidelines

### Unit Testing

- Test utility functions in isolation.
- Mock external dependencies (Convex, APIs).
- Keep tests focused on a single piece of functionality.

### Integration Testing

- Test component interactions with real Convex queries/mutations.
- Use test data from test fixtures, not hardcoded values.
- Clean up test data after each test.

### E2E Testing

- Test complete user workflows.
- Use page objects to abstract UI interaction patterns.
- Keep tests maintainable by extracting reusable functions.

---

## Documentation Standards

### Code Documentation

- Document public functions with JSDoc comments.
- Include parameter types and return types in comments.
- Explain non-obvious logic with inline comments.

```typescript
/**
 * Validates that a user has permission to access an item.
 * Throws an error if the user is not authenticated or does not own the item.
 *
 * @param ctx - Convex context object
 * @param userId - ID of the user attempting access
 * @param itemId - ID of the item being accessed
 * @throws Error if user is not authenticated or not authorized
 */
async function validateItemAccess(ctx, userId: string, itemId: string): Promise<void> {
  // Implementation
}
```

### README and Documentation

- Keep READMEs up-to-date with current setup instructions.
- Document environment variables and their purposes.
- Include troubleshooting guides for common issues.
- Update documentation when changing code patterns.

---



---

## Additional Resources

- **Convex Documentation**: https://docs.convex.dev
- **Shadcn/ui Documentation**: https://ui.shadcn.com
- **Tailwind CSS Documentation**: https://tailwindcss.com/docs
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

---

## Key Principles Summary

1. **No Hardcoding**: Use configuration, environment variables, or database records.
2. **Formal Language**: Keep all code comments and documentation professional.
3. **CSS Variables**: Always use color variables from globals.css.
4. **shadcn Components**: Use shadcn/ui for all standard UI elements.
5. **Type Safety**: Always define and use TypeScript types.
6. **Authorization First**: Check user permissions before any data operation.
7. **Error Handling**: Provide clear error messages without exposing sensitive data.
8. **DRY Code**: Extract reusable logic into utility functions.

---

This file should be reviewed and updated regularly as the project evolves and new patterns are established.