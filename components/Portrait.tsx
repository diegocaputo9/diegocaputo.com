import { site } from "@/content/site";

// Corner crop marks around the portrait, like the trim marks on a print sheet.
const mark = "absolute h-3.5 w-3.5 border-ink-3/70";

// Hero portrait, used once site.portrait is set: the cut-out photo stands
// straight on the page (no frame, no background) and fades out at the bottom.
// Until then the hero shows the profile card instead.
export function Portrait({ className = "" }: { className?: string }) {
  return (
    <figure className={`relative aspect-[4/5] w-full ${className}`}>
      <span aria-hidden className={`${mark} left-0 top-0 border-l border-t`} />
      <span aria-hidden className={`${mark} right-0 top-0 border-r border-t`} />
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, single pre-sized cut-out */}
      <img
        src={site.portrait}
        alt={`Portrait of ${site.name}`}
        width={900}
        height={1125}
        fetchPriority="high"
        className="portrait-fade absolute inset-0 h-full w-full object-contain object-bottom"
      />
    </figure>
  );
}
