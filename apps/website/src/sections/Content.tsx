import { useState } from "react";
import { CODE_EXAMPLES, STEPS } from "../data/code";
import { INSTALL, LINKS } from "../data/links";
import { CodeBlock, InstallCommand, Section } from "../components/ui";

export function HowItWorks() {
  return (
    <Section
      id="how"
      eyebrow="How it works"
      title="Three steps to a friendlier site"
      lead="No config files, no asset hosting, no tracking."
    >
      <ol className="grid gap-5 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-ink-700 dark:bg-ink-900"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-500/10 text-sm font-bold text-brand-600 dark:text-brand-300">
              {i + 1}
            </span>
            <h3 className="mt-4 font-semibold">{s.title}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{s.body}</p>
            <code className="mt-4 block overflow-x-auto rounded-lg bg-ink-900 px-3 py-2 font-mono text-xs text-slate-200">
              {s.code}
            </code>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function CodeExamples() {
  const [active, setActive] = useState(CODE_EXAMPLES[0]!.id);
  const example = CODE_EXAMPLES.find((e) => e.id === active)!;
  return (
    <Section
      id="code"
      eyebrow="Code"
      title="Fits the way you already build"
      lead="React components, a hook, and adapters for the tools you use."
      className="bg-slate-50/70 dark:bg-ink-900/40"
    >
      <div className="mx-auto max-w-3xl">
        <div role="tablist" aria-label="Code examples" className="mb-4 flex flex-wrap gap-2">
          {CODE_EXAMPLES.map((e) => (
            <button
              key={e.id}
              role="tab"
              type="button"
              aria-selected={e.id === active}
              onClick={() => setActive(e.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                e.id === active
                  ? "bg-brand-500 text-white shadow"
                  : "bg-white text-slate-600 hover:text-slate-900 dark:bg-ink-800 dark:text-slate-300 dark:hover:text-white"
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
        <div role="tabpanel">
          <CodeBlock code={example.code} file={example.file} />
        </div>
      </div>
    </Section>
  );
}

const FEATURES: { title: string; body: string; icon: string }[] = [
  {
    title: "Eight expressions",
    body: "Idle, happy, curious, thinking, surprised, confused, sad and sleepy, plus 7 animations.",
    icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8.5 14.5s1.3 2 3.5 2 3.5-2 3.5-2M9 9.5h.01M15 9.5h.01",
  },
  {
    title: "Multiple characters",
    body: "Eight original SVG companions, and an API to add your own.",
    icon: "M16 21v-2a4 4 0 0 0-8 0v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M2 21v-2a4 4 0 0 1 3-3.9",
  },
  {
    title: "Cursor tracking",
    body: "Eyes follow the pointer on a single rAF loop with zero React re-renders.",
    icon: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  },
  {
    title: "Form awareness",
    body: "Native forms, React Hook Form and Formik. Never reads field values.",
    icon: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  },
  {
    title: "API awareness",
    body: "fetch and Axios adapters. You decide which status codes count as errors.",
    icon: "M4 12h4l3-8 4 16 3-8h2",
  },
  {
    title: "Custom messages",
    body: "Speech bubbles per event, rotating lines, and multiple languages.",
    icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  },
  {
    title: "Custom positioning",
    body: "Corners, edges, coordinates, next to an element, or draggable.",
    icon: "M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  },
  {
    title: "TypeScript first",
    body: "Strict types and autocomplete for every prop, event and expression.",
    icon: "M4 4h16v16H4zM9 9h6M12 9v8",
  },
];

export function Features() {
  return (
    <Section id="features" eyebrow="Features" title="Small package, lots of character">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-brand-300 dark:border-ink-700 dark:bg-ink-900 dark:hover:border-brand-500/50"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={f.icon} />
              </svg>
            </span>
            <h3 className="mt-4 font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{f.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
        Respects <code className="font-mono">prefers-reduced-motion</code>, hidden from screen
        readers, no analytics, no network requests, SSR-safe.
      </p>
    </Section>
  );
}

export function Install() {
  return (
    <section id="install" className="px-4 py-20 sm:px-6">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-fuchsia-500 px-6 py-14 text-center text-white shadow-2xl shadow-brand-500/30">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to meet your pal?</h2>
        <p className="mx-auto mt-3 max-w-lg text-brand-100">
          One install, one component. Works with React 18 and 19, Vite and Next.js.
        </p>
        <div className="mt-8">
          <InstallCommand command={INSTALL} large />
        </div>
        <p className="mt-4 text-xs text-brand-100/80">
          The npm release is coming soon. Until then, the source is on{" "}
          <a
            href={LINKS.github}
            className="underline underline-offset-2"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </section>
  );
}

const DOC_TOPICS = [
  "Quick start",
  "Characters",
  "Expressions",
  "Cursor tracking",
  "Form awareness",
  "API awareness",
  "Messages",
  "Positioning",
  "React hooks",
  "Next.js",
  "Custom characters",
  "API reference",
];

export function Docs() {
  return (
    <Section
      id="docs"
      eyebrow="Documentation"
      title="Everything is documented"
      lead="Guides and a full TypeScript API reference live alongside the code."
    >
      <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2">
        {DOC_TOPICS.map((t) => (
          <a
            key={t}
            href={LINKS.docs}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:border-brand-400 hover:text-brand-600 dark:border-ink-700 dark:bg-ink-900 dark:text-slate-300 dark:hover:text-brand-300"
          >
            {t}
          </a>
        ))}
      </div>
    </Section>
  );
}

export function Footer() {
  const links: { label: string; href: string | null }[] = [
    { label: "GitHub", href: LINKS.github },
    { label: "npm (soon)", href: LINKS.npm },
    { label: "Documentation", href: LINKS.docs },
    { label: "Live demo", href: "#reactions" },
    { label: "MIT License", href: LINKS.license },
  ];
  return (
    <footer className="border-t border-slate-200 px-4 py-10 sm:px-6 dark:border-ink-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row dark:text-slate-400">
        <p>tinypal · Made with care for friendlier websites.</p>
        <nav className="flex flex-wrap justify-center gap-5">
          {links.map((l) =>
            l.href ? (
              <a
                key={l.label}
                href={l.href}
                {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                className="transition hover:text-slate-900 dark:hover:text-white"
              >
                {l.label}
              </a>
            ) : (
              <span key={l.label} className="cursor-default opacity-60">
                {l.label}
              </span>
            ),
          )}
        </nav>
      </div>
    </footer>
  );
}
