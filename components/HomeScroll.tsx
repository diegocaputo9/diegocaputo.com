"use client";

import { useEffect } from "react";
import { HOME_RESTORE, HOME_Y } from "./homeReturn";

// Mounted on the home page: saves the scroll position as the visitor reads,
// and puts them back there when they return through a "back home" link.
export function HomeScroll() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(HOME_RESTORE) === "1") {
        sessionStorage.removeItem(HOME_RESTORE);
        const y = Number(sessionStorage.getItem(HOME_Y) ?? 0);
        const go = () => window.scrollTo({ top: y, behavior: "instant" });
        go();
        requestAnimationFrame(go);
        // images and reveals settle the layout; re-apply a couple of times
        const t1 = setTimeout(go, 120);
        const t2 = setTimeout(go, 450);
        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
        };
      }
    } catch {}
  }, []);

  useEffect(() => {
    let raf = 0;
    const save = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        try {
          sessionStorage.setItem(HOME_Y, String(Math.round(window.scrollY)));
        } catch {}
      });
    };
    // don't overwrite the saved spot with 0 before the restore has run
    const start = setTimeout(() => {
      save();
      window.addEventListener("scroll", save, { passive: true });
    }, 500);
    return () => {
      clearTimeout(start);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", save);
    };
  }, []);

  return null;
}
