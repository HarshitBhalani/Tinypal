import { useMemo, useRef, useState } from "react";
import { MascotProvider, createMascotFetch, useMascot } from "tinypal";

/**
 * A fake server so the example runs offline. In a real app, leave out the
 * `fetch` option and createMascotFetch uses the browser's fetch.
 */
const fakeFetch: typeof fetch = async (input, init) => {
  const url = String(input);
  await new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, url.includes("slow") ? 4000 : 1000);
    init?.signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
  if (url.includes("offline")) throw new TypeError("Failed to fetch");
  const status = url.includes("404") ? 404 : url.includes("500") ? 500 : 200;
  return new Response(JSON.stringify({ status }), { status });
};

function Requests() {
  const mascot = useMascot();
  const [result, setResult] = useState("");
  const controller = useRef<AbortController | null>(null);

  // 404 counts as "fine" here (e.g. "no results"), 5xx as an error.
  const api = useMemo(
    () => createMascotFetch(mascot, { fetch: fakeFetch, isError: (r) => r.status >= 500 }),
    [mascot],
  );

  const call = async (path: string) => {
    controller.current = new AbortController();
    setResult(`GET ${path} ...`);
    try {
      const res = await api(path, { signal: controller.current.signal });
      setResult(`GET ${path} -> ${res.status}`);
    } catch (err) {
      setResult(`GET ${path} -> ${(err as Error).name}: ${(err as Error).message}`);
    }
  };

  return (
    <>
      <div className="row">
        <button onClick={() => call("/api/users")}>200 OK</button>
        <button onClick={() => call("/api/404")}>404 (treated as fine)</button>
        <button onClick={() => call("/api/500")}>500 error</button>
        <button onClick={() => call("/api/offline")}>Network error</button>
        <button onClick={() => call("/api/slow")}>Slow request</button>
        <button onClick={() => controller.current?.abort()}>Cancel</button>
      </div>
      <p>
        <code>{result || "Pick a request."}</code>
      </p>
      <h2>Manual events</h2>
      <div className="row">
        <button onClick={() => mascot.emit("api:loading")}>emit("api:loading")</button>
        <button onClick={() => mascot.emit("api:success")}>emit("api:success")</button>
        <button onClick={() => mascot.emit("api:error")}>emit("api:error")</button>
      </div>
    </>
  );
}

export function App() {
  return (
    <MascotProvider character="robot" position="bottom-right">
      <main>
        <h1>API interactions</h1>
        <p>
          Requests made through <code>createMascotFetch()</code> show loading, then success, error,
          network error or cancelled. Overlapping requests show one loading state and one final
          reaction.
        </p>
        <Requests />
      </main>
    </MascotProvider>
  );
}
