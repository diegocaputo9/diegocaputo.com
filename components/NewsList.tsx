import { ArrowUpRight, Newspaper } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { news } from "@/content/site";

// Press coverage. Phones get compact two-column cards (photo, date, headline);
// larger screens get full rows with the source and a note.
// phoneLimit: on phones show only the first N and link to /news/ for the rest.
export function NewsList({ phoneLimit }: { phoneLimit?: number }) {
  return (
    <>
      <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-5 md:hidden">
        {news.map((n, i) => (
          <li key={n.href} className={phoneLimit !== undefined && i >= phoneLimit ? "hidden" : undefined}>
            <a href={n.href} target="_blank" rel="noreferrer" hrefLang={n.lang} className="group block">
              <span className="block overflow-hidden rounded-[14px] border border-line bg-bg-2">
                {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized responsive webp */}
                <img
                  src={`/news/${n.image}-320.webp`}
                  srcSet={`/news/${n.image}-320.webp 320w, /news/${n.image}-640.webp 640w`}
                  sizes="46vw"
                  alt={n.imageAlt}
                  width={320}
                  height={180}
                  loading="lazy"
                  decoding="async"
                  className="aspect-video w-full object-cover"
                />
              </span>
              <span className="mt-2 block font-mono text-[12px] text-ink-3">{n.date}</span>
              <span
                lang={n.lang}
                className="mt-0.5 line-clamp-3 text-[14px] font-medium leading-snug text-ink transition-colors group-hover:text-accent"
              >
                {n.title}
              </span>
            </a>
          </li>
        ))}
      </ul>
      <ul className="mt-5 hidden md:block">
        {news.map((n) => (
          <li key={n.href} className="border-t border-line last:border-b">
            <a
              href={n.href}
              target="_blank"
              rel="noreferrer"
              hrefLang={n.lang}
              className="group grid grid-cols-[112px_1fr] gap-x-4 gap-y-1.5 py-5 sm:grid-cols-[176px_1fr] sm:gap-x-6 md:grid-cols-[110px_208px_1fr_auto] md:items-center md:gap-x-8"
            >
              <p className="col-start-2 row-start-1 font-mono text-[12px] text-ink-3 md:col-start-1">{n.date}</p>
              <div className="col-start-1 row-span-2 row-start-1 self-start overflow-hidden rounded-[14px] border border-line bg-bg-2 md:col-start-2 md:row-span-1 md:self-center">
                {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized responsive webp */}
                <img
                  src={`/news/${n.image}-320.webp`}
                  srcSet={`/news/${n.image}-320.webp 320w, /news/${n.image}-640.webp 640w`}
                  sizes="(min-width: 768px) 208px, (min-width: 640px) 176px, 112px"
                  alt={n.imageAlt}
                  width={320}
                  height={180}
                  loading="lazy"
                  decoding="async"
                  className="aspect-video w-full object-cover transition-transform duration-700 ease-glide group-hover:scale-[1.04]"
                />
              </div>
              <div className="col-start-2 md:col-start-3 md:row-start-1">
                <p lang={n.lang} className="text-[16px] font-medium leading-snug text-ink transition-colors group-hover:text-accent">
                  {n.title}
                </p>
                <p className="mt-1 text-[14px] leading-relaxed text-ink-2">
                  <span className="inline-flex items-center gap-1 text-ink-3">
                    <Newspaper size={13} />
                    {n.source}
                  </span>
                  <span className="text-ink-3"> / </span>
                  {n.note}
                </p>
              </div>
              <ArrowUpRight
                size={18}
                className="hidden text-ink-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink md:col-start-4 md:row-start-1 md:block"
              />
            </a>
          </li>
        ))}
      </ul>
      {phoneLimit !== undefined && news.length > phoneLimit && (
        <Link
          href="/news/"
          className="group mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-ink-2 transition-colors hover:text-accent md:hidden"
        >
          All news ({news.length})
          <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      )}
    </>
  );
}
