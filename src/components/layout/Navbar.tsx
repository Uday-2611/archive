"use client"

import Link from "next/link"
import { useRef, useState } from "react"
import { motion, AnimatePresence, type Transition } from "framer-motion"

import { CallToActionButton } from "@/components/common/CallToActionButton"

const navLinks = [
  { label: "about", href: "/about" },
  { label: "features", href: "/features" },
  { label: "pricing", href: "/pricing" },
  { label: "contact", href: "/contact" },
]

// How long the width expansion takes.
const EXPAND_DURATION = 0.5
// How long the content slide-in takes once the box is open.
const CONTENT_DURATION = 0.3

const expandTransition: Transition = { duration: EXPAND_DURATION, ease: [0.25, 0.1, 0.25, 1] }
const contentTransition: Transition = { duration: CONTENT_DURATION, ease: [0.25, 0.1, 0.25, 1] }

export function Navbar() {
  const [expanded, setExpanded] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setExpanded(true)
    // Show content only after the box has fully opened.
    timerRef.current = setTimeout(() => setContentVisible(true), EXPAND_DURATION * 1000)
  }

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    // Hide content first, then collapse the box.
    setContentVisible(false)
    timerRef.current = setTimeout(() => setExpanded(false), CONTENT_DURATION * 1000)
  }

  return (
    <footer className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <motion.nav
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={expanded ? { width: "75vw" } : { width: "auto" }}
        transition={expandTransition}
        className="relative flex items-center justify-center overflow-hidden bg-bg-dark/80 backdrop-blur-md rounded-2xl"
        aria-label="Primary"
      >
        {/* Logo + divider — absolute left edge */}
        <AnimatePresence>
          {contentVisible && (
            <motion.div
              key="logo"
              initial={{ x: -10 }}
              animate={{ x: 0 }}
              exit={{ x: -10 }}
              transition={contentTransition}
              className="absolute left-7 flex items-center gap-5"
            >
              <Link
                href="/"
                className="whitespace-nowrap text-base font-bold uppercase tracking-[0.14em] text-text-inverse"
              >
                ARCHIVE
              </Link>
              <span className="h-5 w-px bg-text-inverse/20" aria-hidden="true" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav links — always centered */}
        <div className="flex items-center gap-7 px-9 py-5">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="whitespace-nowrap text-sm uppercase tracking-[0.08em] text-text-inverse/60 transition-colors hover:text-tertiary-300"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Divider + Login + Get Started — absolute right edge */}
        <AnimatePresence>
          {contentVisible && (
            <motion.div
              key="actions"
              initial={{ x: 10 }}
              animate={{ x: 0 }}
              exit={{ x: 10 }}
              transition={contentTransition}
              className="absolute right-7 flex items-center gap-4"
            >
              <span className="h-5 w-px bg-text-inverse/20" aria-hidden="true" />
              <Link
                href="/sign-in"
                className="whitespace-nowrap text-sm uppercase tracking-[0.08em] text-text-inverse/60 transition-colors hover:text-tertiary-300"
              >
                Login
              </Link>
              <CallToActionButton href="/sign-up" variant="solid" className="min-w-24 whitespace-nowrap">
                Get Started
              </CallToActionButton>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </footer>
  )
}
