// Builds every theme and captures its home page to .github/brand/screenshots/<theme>.png.
// Dev-only: needs Chrome ($CHROME or the usual install paths) and ~1 minute per theme.
import { execSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const siteJson = join(root, "content/site.json");
const outDir = join(root, ".github/brand/screenshots");
const PORT = 8788;
const DEBUG_PORT = 9333;

const chromePath = () => {
  const candidates = [
    process.env.CHROME,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);
  const found = candidates.find((p) => existsSync(p));
  if (!found) throw new Error("Chrome not found — set $CHROME to the binary");
  return found;
};

// Serves out/ like GitHub Pages: /x/ → /x/index.html, misses → 404.html.
function serve(dir) {
  const types = {
    html: "text/html",
    css: "text/css",
    js: "text/javascript",
    png: "image/png",
    svg: "image/svg+xml",
    json: "application/json",
    ico: "image/x-icon",
    pdf: "application/pdf",
    txt: "text/plain",
    xml: "application/xml",
    webmanifest: "application/manifest+json",
    woff2: "font/woff2",
  };
  const resolve = (path) => {
    const candidates = path.endsWith("/")
      ? [join(dir, path, "index.html")]
      : [join(dir, path), join(dir, `${path}.html`), join(dir, path, "index.html")];
    return candidates.find((f) => existsSync(f) && !f.endsWith("/"));
  };
  return createServer((req, res) => {
    const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const file = resolve(path);
    const target = file ?? join(dir, "404.html");
    const ext = target.split(".").pop();
    res.writeHead(file ? 200 : 404, { "Content-Type": types[ext] ?? "application/octet-stream" });
    res.end(readFileSync(target));
  }).listen(PORT);
}

async function cdp(fn) {
  const chrome = spawn(
    chromePath(),
    [
      "--headless=new",
      "--disable-gpu",
      `--remote-debugging-port=${DEBUG_PORT}`,
      `--user-data-dir=${join(root, ".next/chrome-profile")}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );
  await new Promise((r) => setTimeout(r, 1500));
  try {
    const tab = await (
      await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/new?about:blank`, { method: "PUT" })
    ).json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise((r) => (ws.onopen = r));
    let id = 0;
    const pending = new Map();
    ws.onmessage = (m) => {
      const d = JSON.parse(m.data);
      if (d.id && pending.has(d.id)) {
        pending.get(d.id)(d.result);
        pending.delete(d.id);
      }
    };
    const send = (method, params = {}) =>
      new Promise((r) => {
        pending.set(++id, r);
        ws.send(JSON.stringify({ id, method, params }));
      });
    await fn(send);
    ws.close();
  } finally {
    chrome.kill();
  }
}

async function main() {
  const source = readFileSync(siteJson, "utf8");
  const setTheme = (theme) =>
    writeFileSync(siteJson, source.replace(/"theme": "[a-z]+"/, `"theme": "${theme}"`));
  const themes = process.argv.slice(2).length
    ? process.argv.slice(2)
    : ["console", "terminal", "openapi", "git", "status", "rpg"];
  mkdirSync(outDir, { recursive: true });
  const server = serve(join(root, "out"));
  try {
    for (const theme of themes) {
      setTheme(theme);
      console.log(`building ${theme}…`);
      execSync("pnpm build", {
        cwd: root,
        stdio: "ignore",
        env: { NEXT_PUBLIC_SITE_URL: "https://example.github.io", ...process.env },
      });
      await cdp(async (send) => {
        await send("Emulation.setDeviceMetricsOverride", {
          width: 1280,
          height: 800,
          deviceScaleFactor: 1,
          mobile: false,
        });
        await send("Page.enable");
        await send("Page.navigate", { url: `http://localhost:${PORT}/en/?t=${Date.now()}` });
        await new Promise((r) => setTimeout(r, 3500));
        const shot = await send("Page.captureScreenshot", { format: "png" });
        writeFileSync(join(outDir, `${theme}.png`), Buffer.from(shot.data, "base64"));
      });
      console.log(`wrote .github/brand/screenshots/${theme}.png`);
    }
  } finally {
    writeFileSync(siteJson, source);
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
