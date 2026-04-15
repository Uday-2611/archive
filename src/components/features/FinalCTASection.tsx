import Image from "next/image"
import { Button } from "@/components/ui/button"

export function FinalCTASection() {
  return (
    <footer className="relative h-[95vh] w-full overflow-hidden bg-primary-900 flex items-start justify-center pt-20">
      {/* Background image — path is relative to /public, never include "/public" in the src */}
      <Image
        src="/images/footer-background.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority
        unoptimized
      />

      {/* Content card */}
      <div className="relative z-10 flex h-[80%] w-[80%] flex-col items-center justify-between rounded-2xl bg-bg-dark px-8 py-12 text-center">

        {/* Top — brand name */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-[clamp(4rem,12vw,11rem)] font-black uppercase tracking-[0.06em] leading-none text-text-inverse">
            ARCHIVE
          </span>
          <p className=" font-medium uppercase tracking-[0.2em] text-text-inverse/40">
            Your personal collection, curated.
          </p>
        </div>

        {/* Middle — CTA copy + button */}
        <div className="flex flex-col items-center gap-5">
          <p className="max-w-md text-sm text-text-inverse/60 leading-relaxed">
            Everything worth saving — links, images, articles, ideas — in one beautifully organised space.
          </p>
          <Button className="rounded-lg bg-text-inverse px-10 py-5 text-base font-semibold tracking-wide text-bg-dark hover:bg-primary-100">
            GET EARLY ACCESS
          </Button>
        </div>

        {/* Bottom — socials */}
        <div className="flex items-center gap-6">
          {["Instagram", "Twitter", "Pinterest", "TikTok"].map((platform, i, arr) => (
            <div key={platform} className="flex items-center gap-6">
              <span className="cursor-pointer text-xs font-medium uppercase tracking-[0.16em] text-text-inverse/40 transition-colors hover:text-text-inverse">
                {platform}
              </span>
              {i < arr.length - 1 && (
                <span className="h-px w-4 bg-text-inverse/20" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>

      </div>

    </footer>
  )
}
