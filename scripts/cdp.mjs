/**
 * Dev tool: drive a real headless Chrome via the DevTools protocol.
 * Usage: node scripts/cdp.mjs <url> <width> <height> <script.js>
 * The script file is evaluated in the page (async, may `return` a value),
 * and its JSON result is printed. Console errors are printed too.
 */
import { spawn } from "node:child_process";
import { readFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [url, w = "1280", h = "900", scriptPath] = process.argv.slice(2);
const CHROME = process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const port = 9300 + Math.floor(Math.random() * 500);
const profile = mkdtempSync(join(tmpdir(), "tp-cdp-"));
const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  `--window-size=${w},${h}`,
  "about:blank",
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 50 && !target; i++) {
  await sleep(200);
  try {
    const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    target = list.find((t) => t.type === "page");
  } catch {
    /* not up yet */
  }
}
if (!target) throw new Error("Chrome did not start");

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0;
const pending = new Map();
const errors = [];
ws.addEventListener("message", (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  } else if (msg.method === "Runtime.exceptionThrown") {
    errors.push(msg.params.exceptionDetails.exception?.description ?? "exception");
  } else if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") {
    errors.push(msg.params.args.map((a) => a.value ?? a.description).join(" "));
  }
});
const send = (method, params = {}) =>
  new Promise((r) => {
    const i = ++id;
    pending.set(i, r);
    ws.send(JSON.stringify({ id: i, method, params }));
  });

await send("Runtime.enable");
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: Number(w),
  height: Number(h),
  deviceScaleFactor: 1,
  mobile: Number(w) < 600,
});
await send("Page.navigate", { url });
await sleep(2500);

if (scriptPath) {
  const body = readFileSync(scriptPath, "utf8");
  const res = await send("Runtime.evaluate", {
    expression: `(async () => { ${body} })()`,
    awaitPromise: true,
    returnByValue: true,
    userGesture: true,
  });
  const r = res.result;
  if (r.exceptionDetails) console.log("SCRIPT ERROR:", r.exceptionDetails.exception?.description);
  else console.log(JSON.stringify(r.result.value, null, 2));
}
if (process.env.SHOT) {
  const { writeFileSync } = await import("node:fs");
  const shot = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  });
  writeFileSync(process.env.SHOT, Buffer.from(shot.result.data, "base64"));
  console.log("screenshot:", process.env.SHOT);
}
if (errors.length) console.log("PAGE ERRORS:", errors);
ws.close();
chrome.kill();
