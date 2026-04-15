"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "How is Archive different from Pinterest, Notion, or Pocket?",
    answer:
      "Archive focuses on curation, not consumption. Unlike Pinterest—algorithmic and commercial—Archive centers your taste. Unlike Notion, which requires you to impose structure, Archive auto-organizes. Unlike Pocket, a read-it-later inbox, Archive is forever: your permanent digital memory.",
  },
  {
    id: "faq-2",
    question: "Can I collaborate with others on collections?",
    answer:
      "Yes. Professional and Creator tiers support collaborative collections. Invite others to edit, organize, and add to shared collections. Granular permissions control who can view, comment, or edit.",
  },
  {
    id: "faq-3",
    question: "What happens to my data if I delete my account?",
    answer:
      "Deletion is permanent. We do not retain backups of deleted accounts. We recommend exporting your collections as JSON before deletion. If you are taking a break, consider freezing your account instead.",
  },
  {
    id: "faq-4",
    question: "How does Creator tier monetization work?",
    answer:
      "Creators earn in three ways: (1) 30% of subscription revenue from followers who upgrade because of your collections, (2) direct tips from community members, and (3) optional sponsored placements.",
  },
  {
    id: "faq-5",
    question: "Is there a team or organization plan?",
    answer:
      "Not yet. The Creator tier supports unlimited collaborators for teams working together. Enterprise plans are in development. Email founder@archive.com for early access conversations.",
  },
]

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null)

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section className="w-full">
      <div className="flex w-full flex-col gap-3 sm:gap-4 lg:flex-row lg:items-stretch">

        {/* Left: heading card */}
        <div
          className={cn(
            "flex w-full flex-col lg:w-1/2 transition-all duration-300",
            openId !== null && "blur-sm opacity-40 pointer-events-none",
          )}
        >
          <div className="h-full rounded-2xl px-6 py-8 sm:px-8 sm:py-10">
            <p className="mb-2 text-xs uppercase tracking-wide text-accent bg-secondary-100 inline-block px-2 py-1 rounded">
              Questions
            </p>
            <h2 className="text-4xl font-bold uppercase leading-tight text-text-primary sm:text-5xl">
              Everything<br />you need<br />to know.
            </h2>
          </div>
        </div>

        {/* Right: FAQ items */}
        <div className="relative w-full lg:w-1/2">
          <div className="flex flex-col gap-2">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openId === item.id
              const isBlurred = openId !== null && !isOpen

              return (
                <div
                  key={item.id}
                  className={cn(
                    "relative rounded-xl bg-bg-section transition-[transform,box-shadow,filter,opacity] duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                    isBlurred && "blur-sm opacity-40 pointer-events-none",
                    isOpen && "z-50 -translate-y-1 shadow-2xl scale-[1.018]",
                  )}
                  style={{ transitionDuration: "350ms" }}
                >
                  {/* Trigger — height never changes */}
                  <button
                    onClick={() => toggle(item.id)}
                    className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <span className="flex-1 text-base font-semibold leading-7 text-text-primary">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 text-text-secondary transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {/* Answer — always in DOM, animates in with opacity + slide */}
                  <div
                    className={cn(
                      "absolute left-0 right-0 top-full z-50 rounded-b-xl bg-bg-section px-4 shadow-2xl",
                      "transition-[opacity,transform,padding] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                      isOpen
                        ? "opacity-100 translate-y-0 pb-4 pointer-events-auto"
                        : "opacity-0 -translate-y-1 pb-0 pointer-events-none",
                    )}
                  >
                    <p className="text-base leading-7 text-text-secondary">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
