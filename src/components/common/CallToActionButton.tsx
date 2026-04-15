import type { ReactNode } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type CallToActionButtonVariant = "solid" | "glass"

interface CallToActionButtonProps {
  href: string
  children: ReactNode
  variant?: CallToActionButtonVariant
  className?: string
}

const ctaButtonClasses: Record<CallToActionButtonVariant, string> = {
  solid:
    "bg-bg-dark text-text-inverse shadow-sm hover:bg-text-inverse hover:text-text-inverse [a]:hover:bg-text-secondary",
  glass:
    "border-text-inverse/30 bg-text-inverse/10 text-text-inverse shadow-sm backdrop-blur-sm hover:bg-text-inverse/20",
}

export function CallToActionButton({
  href,
  children,
  variant = "solid",
  className,
}: CallToActionButtonProps) {
  return (
    <Button
      asChild
      className={cn(
        "h-12 rounded-lg border px-4 py-3 text-sm font-semibold tracking-[0.03em] transition-all hover:opacity-90 sm:h-11 sm:px-6 sm:text-base",
        ctaButtonClasses[variant],
        className
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  )
}