"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpLeft } from "@phosphor-icons/react";
import { site } from "@/content/site";

const PREV = "route:prev";
const CUR = "route:cur";

// Mounted once in the layout: remembers the previous path in this tab so
// BackHome knows whether the visitor came from the home page.
export function RouteMemory() {
  const pathname = usePathname();
  useEffect(() => {
    try {
      const cur = sessionStorage.getItem(CUR);
      if (cur !== pathname) {
        sessionStorage.setItem(PREV, cur ?? "");
        sessionStorage.setItem(CUR, pathname);
      }
    } catch {
      /* storage blocked: BackHome falls back to a plain link */
    }
  }, [pathname]);
  return null;
}

// Quiet "Diego Caputo" link at the end of sub-pages. If the visitor came from
// the home page it goes back in history, which restores where they were
// reading; otherwise it opens the home page at the related section.
export function BackHome({ fallback = "/" }: { fallback?: string }) {
  const router = useRouter();

  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    let prev = "";
    try {
      prev = sessionStorage.getItem(PREV) ?? "";
    } catch {}
    if (prev === "/") {
      e.preventDefault();
      router.back();
    }
  }

  return (
    <div className="mx-auto flex max-w-[1360px] justify-center px-5 pb-6 pt-16 md:px-8 md:pt-20">
      <a
        href={fallback}
        onClick={onClick}
        style={{ "--nudge": "-2px -2px" } as React.CSSProperties}
        className="btn btn-frame font-semibold tracking-tight"
      >
        <ArrowUpLeft size={15} className="text-ink-3" />
        {site.name}
        <span className="sr-only">Back to the home page</span>
      </a>
    </div>
  );
}
