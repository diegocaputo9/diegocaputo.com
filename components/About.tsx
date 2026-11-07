import { about } from "@/content/site";
import { Reveal } from "./Reveal";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
      <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <Reveal>
          <h2 className="text-4xl font-semibold tracking-[-0.03em] text-ink md:text-5xl">About</h2>
          <p className="mt-6 max-w-[38ch] text-2xl leading-snug tracking-tight text-ink-2 md:text-[28px]">
            {about.body}
          </p>
        </Reveal>

        <ol className="grid grid-cols-1 gap-x-10 gap-y-10 self-end sm:grid-cols-2">
          {about.pillars.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.06} className="border-t border-line pt-5">
              <h3 className="text-base font-semibold tracking-tight text-ink">{p.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{p.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
