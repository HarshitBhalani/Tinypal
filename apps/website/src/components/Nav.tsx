import { LINKS } from "../data/links";
import type { SiteTheme } from "../hooks/useTheme";

const NAV = [
  { href: "#characters", label: "Characters" },
  { href: "#reactions", label: "Live demo" },
  { href: "#playground", label: "Playground" },
  { href: "#code", label: "Code" },
  { href: "#docs", label: "Docs" },
];

export function Nav({
  theme,
  onToggleTheme,
  mascotHidden,
  onToggleMascot,
}: {
  theme: SiteTheme;
  onToggleTheme: () => void;
  mascotHidden: boolean;
  onToggleMascot: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/75 backdrop-blur-lg dark:border-ink-800 dark:bg-ink-950/75">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500 text-white">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <circle cx="8.5" cy="11" r="2.2" fill="currentColor" />
              <circle cx="15.5" cy="11" r="2.2" fill="currentColor" />
              <path
                d="M8.5 16q3.5 2.5 7 0"
                stroke="currentColor"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>
          tinypal
        </a>
        <nav className="hidden items-center gap-7 text-sm text-slate-600 md:flex dark:text-slate-400">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="transition hover:text-slate-900 dark:hover:text-white"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleMascot}
            className="rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-ink-800"
          >
            {mascotHidden ? "Show mascot" : "Hide mascot"}
          </button>
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="grid h-9 w-9 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-ink-800"
          >
            {theme === "dark" ? (
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            )}
          </button>
          <a
            href={LINKS.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            className="grid h-9 w-9 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-ink-800"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
