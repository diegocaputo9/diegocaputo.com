import { ArrowUpRight, Certificate } from "@phosphor-icons/react/dist/ssr";

// A quiet inline link that opens a certificate PDF in a new tab.
export function CertLink({ label, href, className = "" }: { label: string; href: string; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`group/cert inline-flex items-center gap-1.5 text-[13px] text-ink-3 transition-colors hover:text-accent ${className}`}
    >
      <Certificate size={15} className="shrink-0" />
      <span className="underline decoration-line underline-offset-4 group-hover/cert:decoration-accent/50">{label}</span>
      <ArrowUpRight
        size={12}
        className="shrink-0 transition-transform duration-300 group-hover/cert:-translate-y-0.5 group-hover/cert:translate-x-0.5"
      />
    </a>
  );
}
