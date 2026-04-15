"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

// Full-width animated gradient cycles through the brand palette:
// deep navy → primary blue → light blue → charcoal → deep navy.
// The animation runs slowly (18s) so the shift is ambient, not distracting.
const FOOTER_GRADIENT_STYLE: React.CSSProperties = {
  background:         "linear-gradient(-45deg, var(--color-primary-900), var(--color-primary-700), var(--color-primary), var(--color-accent), var(--color-secondary-700), var(--color-primary))",
  backgroundSize:     "400% 400%",
  animation:          "gradientFlow 18s ease infinite",
}

const FOOTER_LINKS = [
  {
    heading: "Product",
    links: [
      { label: "Features",           href: "/features" },
      { label: "Pricing",            href: "/pricing" },
      { label: "Browser Extension",  href: "/extension" },
      { label: "App Download",       href: "/download" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Blog",        href: "/blog" },
      { label: "Help Center", href: "/help" },
      { label: "API Docs",    href: "/docs/api" },
      { label: "Community",   href: "/community" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms of Use",   href: "/legal/terms" },
      { label: "Security",       href: "/legal/security" },
      { label: "Cookie Policy",  href: "/legal/cookies" },
    ],
  },
]

// Inline SVG brand icons — lucide-react does not ship social brand icons.
function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const SOCIAL_LINKS = [
  { Icon: TwitterIcon,   label: "Twitter",   href: "#" },
  { Icon: InstagramIcon, label: "Instagram", href: "#" },
  { Icon: LinkedInIcon,  label: "LinkedIn",  href: "#" },
]

export function Footer() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail("")
    }
  }

  return (
    <footer style={FOOTER_GRADIENT_STYLE}>
      {/* Main footer content */}
      <div className="max-w-300 mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-12 mb-16">

          {/* Left: Logo + tagline */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight block mb-3 transition-opacity hover:opacity-80"
              style={{ color: "white" }}
            >
              Archive
            </Link>
            <p
              className="text-sm leading-relaxed mb-8"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Where your taste becomes your legacy.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    color:           "rgba(255,255,255,0.7)",
                  }}
                  onMouseEnter={e => {
                    ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.2)"
                    ;(e.currentTarget as HTMLAnchorElement).style.color = "white"
                  }}
                  onMouseLeave={e => {
                    ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.1)"
                    ;(e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.7)"
                  }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Middle: Link columns */}
          {FOOTER_LINKS.map(({ heading, links }) => (
            <div key={heading} className="md:col-span-1">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-5"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {heading}
              </p>
              <ul className="flex flex-col gap-3.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm transition-colors duration-200"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                      onMouseEnter={e =>
                        ((e.currentTarget as HTMLAnchorElement).style.color = "white")
                      }
                      onMouseLeave={e =>
                        ((e.currentTarget as HTMLAnchorElement).style.color =
                          "rgba(255,255,255,0.6)")
                      }
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Right: Newsletter */}
          <div className="md:col-span-2 md:col-start-5">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Newsletter
            </p>
            <p
              className="text-sm leading-relaxed mb-5"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Thoughts on curation and digital memory.
            </p>

            {subscribed ? (
              <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
                You&apos;re on the list. Thank you.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 h-10 rounded-full px-4 text-sm outline-none min-w-0"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    border:          "1px solid rgba(255,255,255,0.2)",
                    color:           "white",
                  }}
                  onFocus={e =>
                    ((e.currentTarget as HTMLInputElement).style.borderColor =
                      "rgba(255,255,255,0.5)")
                  }
                  onBlur={e =>
                    ((e.currentTarget as HTMLInputElement).style.borderColor =
                      "rgba(255,255,255,0.2)")
                  }
                />
                <Button
                  type="submit"
                  className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-all hover:scale-105"
                  style={{ backgroundColor: "var(--brand-blue-500)", color: "white" }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-8" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          <p>© 2024 Archive. All rights reserved.</p>
          <p className="text-center">
            Designed and built by the Archive team. Hosted on Vercel. Powered by Convex and Clerk.
          </p>
        </div>
      </div>
    </footer>
  )
}
