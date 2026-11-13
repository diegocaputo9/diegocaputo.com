"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { markHomeReturn } from "./homeReturn";

// "Home" link on sub-pages: back to the saved spot on the home page if there
// is one, otherwise to the related section.
export function HomeLink({ fallback, className, children }: { fallback: string; className?: string; children: ReactNode }) {
  const router = useRouter();
  return (
    <Link
      href={fallback}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (markHomeReturn()) {
          e.preventDefault();
          router.push("/", { scroll: false });
        }
      }}
    >
      {children}
    </Link>
  );
}
