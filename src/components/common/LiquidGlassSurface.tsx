import { type CSSProperties, type ElementType, type HTMLAttributes, type ReactNode } from "react"

import { cn } from "@/lib/utils"

const DEFAULT_FILTER_ID = "glass-distortion"

interface LiquidGlassFilterDefsProps {
  filterId?: string
  turbulenceFrequency?: string
  turbulenceOctaves?: number
  turbulenceSeed?: number
  noiseBlur?: number
  displacementScale?: number
}

interface LiquidGlassSurfaceProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  children: ReactNode
  contentClassName?: string
  filterId?: string
  includeFilterDefs?: boolean
  blurAmount?: number
  saturation?: number
  distortionScale?: number
}

export function LiquidGlassFilterDefs({
  filterId = DEFAULT_FILTER_ID,
  turbulenceFrequency = "0.006 0.006",
  turbulenceOctaves = 2,
  turbulenceSeed = 92,
  noiseBlur = 2,
  displacementScale = 45,
}: LiquidGlassFilterDefsProps) {
  return (
    <svg
      width="0"
      height="0"
      className="pointer-events-none absolute"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={turbulenceFrequency}
            numOctaves={turbulenceOctaves}
            seed={turbulenceSeed}
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation={noiseBlur} result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale={displacementScale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  )
}

export function LiquidGlassSurface({
  as: Component = "div",
  className,
  contentClassName,
  children,
  filterId = DEFAULT_FILTER_ID,
  includeFilterDefs = true,
  blurAmount = 18,
  saturation = 135,
  distortionScale = 45,
  style,
  ...props
}: LiquidGlassSurfaceProps) {
  // Outer container: no opaque background — the backdrop-filter on the distortion
  // layer provides the frosted-glass effect. Only a subtle border and outer glow
  // are applied here to define the card boundary.
  const surfaceStyle: CSSProperties = {
    border: "1px solid color-mix(in srgb, var(--color-text-inverse) 24%, transparent)",
    boxShadow: "0 0 21px -8px color-mix(in srgb, var(--color-text-inverse) 30%, transparent)",
    ...style,
  }

  // Distortion layer: applies the backdrop blur and SVG displacement filter.
  // Kept free of background fills so the blur effect is the sole visual treatment.
  const distortionLayerStyle: CSSProperties = {
    backdropFilter: `blur(${blurAmount}px) saturate(${saturation}%)`,
    WebkitBackdropFilter: `blur(${blurAmount}px) saturate(${saturation}%)`,
    filter: `url(#${filterId})`,
    WebkitFilter: `url(#${filterId})`,
  }

  // Tint layer: a soft inner glow that adds the characteristic glass highlight
  // along the inner edge without adding an opaque fill.
  const tintLayerStyle: CSSProperties = {
    boxShadow: "inset 0 0 6px -3px color-mix(in srgb, var(--color-text-inverse) 70%, transparent)",
  }

  return (
    <>
      {includeFilterDefs ? (
        <LiquidGlassFilterDefs filterId={filterId} displacementScale={distortionScale} />
      ) : null}

      <Component
        className={cn("relative isolate overflow-hidden", className)}
        style={surfaceStyle}
        {...props}
      >
        {/* Backdrop blur + distortion sits below the tint and content layers. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
          style={distortionLayerStyle}
        />

        {/* Inner-glow tint sits above the blur layer. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
          style={tintLayerStyle}
        />

        <div className={cn("relative z-20 h-full w-full", contentClassName)}>{children}</div>
      </Component>
    </>
  )
}
