"use client"

import { useEffect, useRef, useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

const TIERS = [
  {
    name:     "Essentials",
    price:    "Free Forever",
    sub:      "Perfect for those starting their archive.",
    callout:  "Start collecting. No time limit. No hidden limits.",
    featured: false,
    cta:      { label: "Start Free", href: "/sign-up", primary: false },
    features: [
      "Unlimited saves",
      "2 GB storage",
      "Basic organization — folders and tags",
      "Browser extension",
      "Web dashboard",
      "Unlimited public collections",
      "Community discovery",
    ],
    muted: ["Creator monetization — not available"],
  },
  {
    name:     "Professional",
    price:    "$12",
    priceSub: "per month",
    sub:      "For serious collectors building influence.",
    callout:  "Most curators on Archive use this tier. Build an audience.",
    featured: true,
    cta:      { label: "Start Free Trial", href: "/sign-up", primary: true },
    features: [
      "Everything in Essentials, plus:",
      "100 GB storage",
      "Advanced AI-powered organization",
      "Collaborative collections",
      "Advanced analytics",
      "Priority discovery ranking",
      "Comment moderation tools",
      "Custom collection landing pages",
      "Creator monetization starts here",
      "24/7 email support",
      "Early access to new features",
    ],
    muted: [],
  },
  {
    name:     "Creator",
    price:    "$48",
    priceSub: "per month",
    sub:      "For those turning taste into income.",
    callout:  "Turn your curation into a sustainable business.",
    featured: false,
    cta:      { label: "Contact Sales", href: "mailto:founder@archive.com", primary: false },
    features: [
      "Everything in Professional, plus:",
      "500 GB storage",
      "White-label collection pages",
      "Revenue share — 30% of subscriber spend",
      "Direct tips from community",
      "Sponsored placement options",
      "API access",
      "Advanced metrics dashboard",
      "Unlimited collaborators",
      "Dedicated creator success manager",
      "Monthly strategy calls",
      "Feature request priority",
      "24/7 priority support",
    ],
    muted: [],
  },
]

// Static delay classes so Tailwind can detect and generate them at build time.
const CARD_DELAYS = ["delay-0", "delay-[120ms]", "delay-[240ms]"] as const

function PricingCard({
  name,
  price,
  priceSub,
  sub,
  callout,
  featured,
  cta,
  features,
  muted,
  delayClass,
}: (typeof TIERS)[number] & { delayClass: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative flex flex-1 flex-col">
      {featured && (
        <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-4 py-1 text-xs font-semibold uppercase tracking-wider text-text-inverse">
          Most Popular
        </div>
      )}

      <div
        ref={ref}
        className={cn(
          "flex flex-1 flex-col rounded-2xl p-8 transition-all duration-650 hover:-translate-y-2",
          delayClass,
          featured
            ? "border-2 border-primary bg-bg-primary shadow-lg"
            : "border border-border-primary bg-bg-primary",
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        )}
      >
        {/* Tier name */}
        <p
          className={cn(
            "mb-4 text-xs font-medium uppercase tracking-widest",
            featured ? "text-primary" : "text-text-secondary",
          )}
        >
          {name}
        </p>

        {/* Price */}
        <div className="mb-2 flex items-baseline gap-1">
          <span className="text-4xl font-semibold leading-none text-text-primary">{price}</span>
          {priceSub && (
            <span className="text-sm text-text-secondary">{priceSub}</span>
          )}
        </div>

        <p className="mb-8 text-sm leading-relaxed text-text-secondary">{sub}</p>

        {/* CTA button */}
        {cta.primary ? (
          <Button
            className="mb-8 h-11 w-full rounded-full bg-primary text-sm font-medium text-text-inverse transition-all hover:scale-[1.02] hover:bg-primary-600"
            asChild
          >
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        ) : (
          <Button
            variant="outline"
            className="mb-8 h-11 w-full rounded-full border-border-primary text-sm font-medium text-text-primary transition-all hover:scale-[1.02] hover:border-primary"
            asChild
          >
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        )}

        {/* Divider */}
        <div className="mb-8 h-px bg-border-primary" />

        {/* Features list */}
        <ul className="flex flex-1 flex-col gap-3">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-3">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-sm leading-relaxed text-text-primary">{f}</span>
            </li>
          ))}
          {muted.map((f) => (
            <li key={f} className="flex items-start gap-3 opacity-40">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-text-secondary" />
              <span className="text-sm leading-relaxed text-text-secondary">{f}</span>
            </li>
          ))}
        </ul>

        {/* Callout */}
        <p className="mt-8 text-xs italic text-text-tertiary">{callout}</p>
      </div>
    </div>
  )
}

export function PricingSection() {
  return (
    <section className="w-full">
      {/* Header */}
      <div className="mb-16 text-center">
        <p className="mb-2 inline-block rounded bg-secondary-100 px-2 py-1 text-xs uppercase tracking-wide text-accent">
          Pricing
        </p>
        <h2 className="mt-4 text-4xl font-bold uppercase leading-tight text-text-primary sm:text-5xl">
          Built for Every Collector.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary">
          Choose the Archive experience that matches your ambition.
        </p>
      </div>

      {/* Tier cards */}
      <div className="flex flex-col gap-6 pt-6 lg:flex-row lg:items-stretch">
        {TIERS.map((tier, i) => (
          <PricingCard key={tier.name} {...tier} delayClass={CARD_DELAYS[i]} />
        ))}
      </div>
    </section>
  )
}
