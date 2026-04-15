const FEATURES = [
  {
    title:       "SAVE EVERYTHING",
    description: "One click captures links, images, videos, articles. No friction. No data entry. Just save.",
  },
  {
    title:       "ORGANIZE INSTANTLY",
    description: "Folders, tags, and smart collections form naturally as you save. Your taste becomes visible.",
  },
  {
    title:       "SHARE & DISCOVER",
    description: "Publish collections. Follow cultural tastemakers. Discover curators who see the world like you do.",
  },
]

export function FeaturesSection() {
  return (
    <section className="w-full">
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:justify-center lg:gap-6">
        {FEATURES.map(({ title, description }) => (
          <article key={title} className="flex min-h-88 w-full flex-col items-start rounded-2xl bg-tertiary-100 p-6 sm:p-8 lg:min-h-96 lg:w-[25%] lg:flex-none" >
            <h3 className="mb-4 text-3xl font-bold uppercase leading-tight text-text-primary sm:text-4xl">
              {title}
            </h3>
            <p className="text-base leading-relaxed text-text-secondary sm:text-lg">
              {description}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
