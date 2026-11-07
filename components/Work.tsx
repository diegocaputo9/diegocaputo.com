import { ArrowUpRight, ChartLineUp, Cube, Factory, Plant } from "@phosphor-icons/react/dist/ssr";
import { projects, type Project } from "@/content/site";
import { GlassCard } from "./GlassCard";
import { Reveal } from "./Reveal";

const span: Record<Project["size"], string> = {
  lg: "md:col-span-7",
  md: "md:col-span-5",
  sm: "md:col-span-4",
};

const icon = {
  flow: Factory,
  grid: Cube,
  rings: Plant,
  bars: ChartLineUp,
};

// Each tile gets its own texture so the bento never reads as identical cards.
function Visual({ kind }: { kind: Project["visual"] }) {
  const Icon = icon[kind];
  const texture = {
    grid: "tile-grid",
    flow: "bg-[repeating-linear-gradient(90deg,var(--grid)_0_1px,transparent_1px_72px)]",
    rings:
      "bg-[repeating-radial-gradient(circle_at_70%_120%,var(--grid)_0_1px,transparent_1px_22px)]",
    bars: "bg-[repeating-linear-gradient(0deg,var(--grid)_0_1px,transparent_1px_18px)]",
  }[kind];
  return (
    <div
      className={`relative h-40 overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-100/80 to-zinc-200/40 md:h-48 dark:from-zinc-800/50 dark:to-zinc-900/30 ${texture}`}
    >
      <Icon
        size={44}
        weight="thin"
        className="absolute bottom-5 left-5 text-ink-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1"
      />
    </div>
  );
}

export function Work() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
      <Reveal>
        <h2 className="text-4xl font-semibold tracking-[-0.03em] text-ink md:text-5xl">Selected work</h2>
        <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-ink-2">
          Operations, research and improvement programs I have worked on.
        </p>
      </Reveal>

      <ul className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-12">
        {projects.map((p, i) => (
          <Reveal as="li" key={p.title} delay={(i % 2) * 0.08} className={span[p.size]}>
            <GlassCard tilt={2.5} className="group rounded-[28px] p-3">
              <Visual kind={p.visual} />
              <div className="flex items-start justify-between gap-4 px-3 pb-3 pt-5">
                <div>
                  <p className="text-[13px] text-ink-3">{p.kind}</p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight text-ink">{p.title}</h3>
                  <p className="mt-2 max-w-[48ch] text-[15px] leading-relaxed text-ink-2">{p.summary}</p>
                </div>
                {p.href && (
                  <a
                    href={p.href}
                    aria-label={`Open ${p.title}`}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink-2 transition-colors after:absolute after:inset-0 hover:text-ink"
                  >
                    <ArrowUpRight size={18} />
                  </a>
                )}
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
