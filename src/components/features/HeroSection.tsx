import Image from "next/image"

import { CallToActionButton } from "@/components/common/CallToActionButton"

export function HeroSection() {
  return (
    <section className="relative flex min-h-[80vh] w-full overflow-hidden rounded-xl bg-bg-dark lg:min-h-[90vh]">
      {/* Full-bleed background image */}
      <Image
        src="/images/hero-section.png"
        alt="Archive figure"
        fill
        className="object-cover object-center opacity-70"
        priority
      />

      {/* Gradient overlay — darkens the bottom so text stays legible */}
      <div className="absolute inset-0 bg-linear-to-t from-bg-dark via-bg-dark/60 to-transparent" />

      {/* Content — anchored to the bottom-left */}
      <div className="relative flex w-full flex-col justify-end gap-4 px-6 py-10 sm:px-10 lg:max-w-2xl lg:px-12 lg:py-14">
        <h1 className="font-black uppercase leading-[0.88] tracking-tight text-5xl text-text-inverse sm:text-6xl xl:text-[5.3vw]">
          CURATE YOUR SPACE
          <br />
          CURATE YOUR LIFE
        </h1>

        <CallToActionButton href="/sign-up" variant="glass" className="self-start">
          GET STARTED
        </CallToActionButton>
      </div>
    </section>
  )
}
