import { site } from "@/content/site";

// Corner crop marks around the portrait area, like the trim marks on a print sheet.
const mark = "absolute h-3.5 w-3.5 border-ink-3/70";

// Hero portrait. With site.portrait set, the cut-out photo stands straight on
// the page (no frame, no background) and fades out at the bottom edge. Until
// then a drafted bust holds the space: outline, centre line and eye line, the
// way a portrait is blocked out before it is drawn.
export function Portrait({ className = "" }: { className?: string }) {
  return (
    <figure className={`relative aspect-[4/5] w-full ${className}`}>
      <span aria-hidden className={`${mark} left-0 top-0 border-l border-t`} />
      <span aria-hidden className={`${mark} right-0 top-0 border-r border-t`} />
      {site.portrait ? (
        // eslint-disable-next-line @next/next/no-img-element -- static export, single pre-sized cut-out
        <img
          src={site.portrait}
          alt={`Portrait of ${site.name}`}
          width={900}
          height={1125}
          fetchPriority="high"
          className="portrait-fade absolute inset-0 h-full w-full object-contain object-bottom"
        />
      ) : (
        <svg
          aria-hidden
          viewBox="0 0 320 400"
          style={{ "--label": "11px" } as React.CSSProperties}
          className="sketch portrait-fade pointer-events-none absolute inset-0 h-full w-full select-none"
        >
          {/* the bust is filled with the page color so it covers the drawing behind it, as the photo will */}
          <path
           
            style={{ fill: "var(--bg)" }}
            d="M134 214 Q96 232 62 248 Q26 266 20 322 L16 400 L304 400 L300 322 Q294 266 258 248 Q224 232 186 214 Q160 244 134 214 Z"
          />
          <path style={{ fill: "var(--bg)" }} d="M138 186 L134 216 Q160 244 186 216 L182 186 Z" />
          <path
           
            style={{ fill: "var(--bg)" }}
            d="M160 60 C197 60 213 90 213 124 C213 160 196 196 160 198 C124 196 107 160 107 124 C107 90 123 60 160 60 Z"
          />
          {/* construction: centre line, eye line, shoulder line */}
          <line className="dash" x1={160} y1={36} x2={160} y2={392} />
          <line className="dash" x1={100} y1={122} x2={232} y2={122} />
          <line className="dash" x1={36} y1={262} x2={284} y2={262} />
          <g className="dim">
            <line x1={84} y1={60} x2={84} y2={198} />
            <line x1={79} y1={60} x2={89} y2={60} />
            <line x1={79} y1={198} x2={89} y2={198} />
            <text x={76} y={133} textAnchor="end">
              4 : 5
            </text>
          </g>
          <text x={14} y={30}>PORTRAIT / PLACEHOLDER</text>
        </svg>
      )}
    </figure>
  );
}
