import { site } from "@/content/site";

// Footer laid out like the title block of an engineering drawing.
export function Footer() {
  const cells = [
    ["Name", site.name],
    ["Discipline", site.role],
    ["Location", site.location],
    ["Sheet", `© ${new Date().getFullYear()}`],
  ];
  return (
    <footer className="mx-auto max-w-6xl px-5 pb-12 pt-4 md:px-8">
      <dl className="grid grid-cols-2 border border-line md:grid-cols-4">
        {cells.map(([k, v], i) => (
          <div
            key={k}
            className={`px-4 py-3 ${i % 2 === 1 ? "border-l border-line" : ""} ${i > 1 ? "border-t border-line md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}
          >
            <dt className="text-[12px] font-medium uppercase tracking-[0.08em] text-ink-3">{k}</dt>
            <dd className="mt-1 text-[14px] text-ink-2">{v}</dd>
          </div>
        ))}
      </dl>
    </footer>
  );
}
