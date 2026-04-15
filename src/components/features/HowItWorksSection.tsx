"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const STEPS = [
  {
    number:      "01",
    title:       "SAVE ANYTHING",
    description: "The browser extension captures any link, image, video, or article with a single click. No copying, no tagging, no friction.",
    gradient:    "from-secondary-50 to-secondary-100",
    delay:       "delay-[100ms]",
  },
  {
    number:      "02",
    title:       "ORGANIZE & SHARE",
    description: "Smart folders and tags surface naturally as your archive grows. Publish collections and share your taste with the world.",
    gradient:    "from-tertiary-50 to-tertiary-100",
    delay:       "delay-[200ms]",
  },
]

function WireframeBoxIcon() {
  return (
    <svg
      width="160"
      height="160"
      viewBox="0 0 160 160"
      className="animate-[float_4s_ease-in-out_infinite] text-primary"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top face */}
      <polygon
        points="80,20 130,48 80,76 30,48"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
      />
      {/* Left face */}
      <polygon
        points="30,48 80,76 80,140 30,112"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
      />
      {/* Right face */}
      <polygon
        points="80,76 130,48 130,112 80,140"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
      />
      {/* Inner depth lines */}
      <line x1="80" y1="20" x2="80" y2="76" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 3" />
      <line x1="30" y1="48" x2="80" y2="76" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 3" />
      <line x1="130" y1="48" x2="80" y2="76" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 3" />
    </svg>
  )
}

function StepCard({
  number,
  title,
  description,
  gradient,
  delay,
}: (typeof STEPS)[number]) {
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
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        "min-h-42.5 flex flex-1 flex-col justify-between rounded-2xl bg-linear-to-br px-4 py-5 transition-all duration-700 sm:px-6 sm:py-6 lg:min-h-0",
        gradient,
        delay,
        visible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0",
      )}
    >
      <p className="text-xs font-medium uppercase tracking-widest text-text-tertiary">{number}</p>
      <div>
        <h3 className="mb-2 text-2xl font-bold uppercase leading-tight text-text-primary sm:text-3xl">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-text-secondary sm:text-base">
          {description}
        </p>
      </div>
    </div>
  )
}

export function HowItWorksSection() {
  const leftRef = useRef<HTMLDivElement>(null)
  const [leftVisible, setLeftVisible] = useState(false)

  useEffect(() => {
    const el = leftRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLeftVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="w-full">
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-stretch">

        {/* Left: illustration card */}
        <div
          ref={leftRef}
          className={cn(
            "flex aspect-square w-full flex-col items-center justify-center gap-6 rounded-2xl bg-linear-to-br from-primary-50 to-primary-100 p-6 transition-all duration-700 sm:p-8 lg:w-1/2",
            leftVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0",
          )}
        >
          <WireframeBoxIcon />
          <div className="text-center">
            <p className="mb-1 text-xs uppercase tracking-widest text-text-tertiary">How it works</p>
            <p className="text-lg font-semibold uppercase leading-tight text-text-primary">
              Three steps.<br />Zero friction.
            </p>
          </div>
        </div>

        {/* Right: step cards */}
        <div className="flex w-full flex-col gap-4 lg:aspect-square lg:w-1/2">
          {STEPS.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>

      </div>
    </section>
  )
}
