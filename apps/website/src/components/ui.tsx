import type { ReactNode } from "react";
import { useCopy } from "../hooks/useCopy";

export function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`px-4 py-20 sm:px-6 sm:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          {eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-500 dark:text-brand-400">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
          {lead && <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">{lead}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

export function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const { copied, copy } = useCopy();
  return (
    <button
      type="button"
      onClick={() => copy(text)}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className={`rounded-md px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-white/10 hover:text-white ${className}`}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export function InstallCommand({ command, large = false }: { command: string; large?: boolean }) {
  return (
    <div
      className={`inline-flex items-center gap-3 rounded-xl border border-slate-800 bg-ink-900 font-mono text-slate-100 shadow-lg shadow-brand-500/5 ${
        large ? "px-5 py-4 text-base sm:text-lg" : "px-4 py-2.5 text-sm"
      }`}
    >
      <span className="select-none text-brand-400">$</span>
      <span>{command}</span>
      <CopyButton text={command} />
    </div>
  );
}

export function CodeBlock({ code, file }: { code: string; file?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-ink-900 shadow-xl dark:border-ink-700">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          {file && <span className="ml-3 font-mono text-xs text-slate-400">{file}</span>}
        </div>
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function Button({
  href,
  onClick,
  children,
  variant = "primary",
}: {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  const cls =
    variant === "primary"
      ? "bg-brand-500 text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600"
      : "border border-slate-300 bg-white/70 text-slate-800 hover:border-slate-400 dark:border-ink-700 dark:bg-ink-900/70 dark:text-slate-100 dark:hover:border-slate-500";
  const base = `inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${cls}`;
  return href ? (
    <a href={href} className={base}>
      {children}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={base}>
      {children}
    </button>
  );
}
