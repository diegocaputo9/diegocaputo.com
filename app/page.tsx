import { About } from "@/components/About";
import { Backdrop } from "@/components/Backdrop";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Work } from "@/components/Work";
import { site } from "@/content/site";

export default function Home() {
  return (
    <>
      <Backdrop />
      <Nav />
      <main>
        <Hero />
        <Work />
        <About />
        <Contact />
      </main>
      <footer className="mx-auto flex max-w-6xl flex-col gap-2 px-5 pb-12 pt-4 text-sm text-ink-3 sm:flex-row sm:justify-between md:px-8">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p>{site.location}</p>
      </footer>
    </>
  );
}
