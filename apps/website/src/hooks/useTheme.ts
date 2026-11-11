import { useCallback, useEffect, useState } from "react";

export type SiteTheme = "light" | "dark";

/** Site colour scheme. The inline script in index.html sets the first value. */
export function useTheme() {
  const [theme, setTheme] = useState<SiteTheme>(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("tp-theme", theme);
    } catch {
      /* storage blocked: theme still works for this visit */
    }
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  return { theme, toggle };
}
