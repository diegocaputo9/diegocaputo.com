import {
  Brain,
  ClipboardText,
  Factory,
  GlobeHemisphereEast,
  Package,
  PresentationChart,
} from "@phosphor-icons/react/dist/ssr";
import { projects, type Project } from "@/content/site";
import { ValueStream } from "./Blueprint";
import { GlassCard } from "./GlassCard";
import { Reveal } from "./Reveal";

// Bento rhythm: 7/5, 5/7, 6/6 on a 12-col grid.
const spans = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7", "md:col-span-6", "md:col-span-6"];

const icon = {
  germany: GlobeHemisphereEast,
  plant: Factory,
  ai: Brain,
  asrs: Package,
  standard: ClipboardText,
  poster: PresentationChart,
};

// Each tile gets its own drafting texture so the bento never reads as identical cards.
const texture: Record<Project["visual"], string> = {
  germany: "bg-[repeating-radial-gradient(circle_at_85%_120%,var(--grid)_0_1px,transparent_1px_22px)]",
  plant: "bg-[repeating-linear-gradient(90deg,var(--grid)_0_1px,transparent_1px_64px)]",
  ai: "tile-grid",
  asrs: "bg-[repeating-linear-gradient(0deg,var(--grid)_0_1px,transparent_1px_18px),repeating-linear-gradient(90deg,var(--grid)_0_1px,transparent_1px_54px)]",
  standard: "bg-[repeating-linear-gradient(0deg,var(--grid)_0_1px,transparent_1px_14px)]",
  poster: "bg-[repeating-linear-gradient(135deg,var(--grid)_0_1px,transparent_1px_16px)]",
};

export function Work() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 pt-5 md:px-8 md:pb-20">
      <ul className="grid grid-cols-1 gap-5 md:grid-cols-12">
        {projects.map((p, i) => {
          const Icon = icon[p.visual];
          return (
            <Reveal as="li" key={p.title} delay={(i % 2) * 0.08} className={spans[i]}>
              <GlassCard tilt={2.5} className="group flex flex-col rounded-[28px] p-3">
                <div
                  className={`relative h-28 overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-100/80 to-zinc-200/40 dark:from-zinc-800/50 dark:to-zinc-900/30 ${texture[p.visual]}`}
                >
                  <Icon
                    size={38}
                    weight="thin"
                    className="absolute bottom-4 left-4 text-ink-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1"
                  />
                  <span className="absolute right-4 top-3 font-mono text-[11px] text-ink-3">{p.year}</span>
                </div>
                <div className="px-3 pb-3 pt-5">
                  <p className="text-[13px] text-ink-3">{p.kind}</p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight text-ink">{p.title}</h3>
                  <p className="mt-2 max-w-[52ch] text-[15px] leading-relaxed text-ink-2">{p.summary}</p>
                </div>
              </GlassCard>
            </Reveal>
          );
        })}
      </ul>
      {/* value stream strip: its own row below the grid */}
      <div aria-hidden className="mt-20 hidden md:block">
        <ValueStream className="mx-auto w-full max-w-[720px]" />
      </div>
    </section>
  );
}
