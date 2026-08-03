type Channel = "web" | "youtube" | "rss" | "github";

interface ResearchRequest {
  channel?: Channel;
  target?: string;
  maxItems?: number;
}

interface ResearchResult {
  ok: boolean;
  channel: Channel;
  backend: string;
  target: string;
  collectedAt: string;
  title?: string;
  text?: string;
  items?: Array<Record<string, unknown>>;
  warnings: string[];
  error?: string;
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

function authorized(request: Request): boolean {
  const expected = Netlify.env.get("BRF_INTERNAL_RESEARCH_TOKEN");
  if (!expected) return false;
  return request.headers.get("authorization") === `Bearer ${expected}`;
}

function normalizePublicUrl(value: string): URL {
  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  const url = new URL(candidate);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("UNSUPPORTED_PROTOCOL");
  const host = url.hostname.toLowerCase();
  if (
    host === "localhost" || host === "0.0.0.0" || host === "::1" ||
    /^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host)
  ) throw new Error("PRIVATE_NETWORK_BLOCKED");
  return url;
}

async function limitedText(response: Response, limit = 250_000): Promise<string> {
  const text = await response.text();
  return text.slice(0, limit);
}

function cleanXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(block: string, name: string): string {
  const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, "i"));
  return match ? cleanXml(match[1]) : "";
}

async function readWeb(target: string): Promise<ResearchResult> {
  const url = normalizePublicUrl(target);
  const readerUrl = `https://r.jina.ai/http://${url.host}${url.pathname}${url.search}`;
  const response = await fetch(readerUrl, {
    headers: { accept: "text/markdown", "user-agent": "BRF-Keyless-Research/1.0" },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`JINA_READER_${response.status}`);
  const text = await limitedText(response);
  const title = text.match(/^Title:\s*(.+)$/mi)?.[1]?.trim() || url.hostname;
  return { ok: true, channel: "web", backend: "jina-reader", target: url.toString(), collectedAt: new Date().toISOString(), title, text, warnings: [] };
}

function youtubeId(target: string): string {
  const url = normalizePublicUrl(target);
  if (url.hostname.includes("youtu.be")) return url.pathname.split("/").filter(Boolean)[0] || "";
  return url.searchParams.get("v") || url.pathname.match(/\/(?:shorts|embed)\/([^/?]+)/)?.[1] || "";
}

async function readYouTube(target: string): Promise<ResearchResult> {
  const id = youtubeId(target);
  if (!/^[A-Za-z0-9_-]{6,20}$/.test(id)) throw new Error("INVALID_YOUTUBE_URL");
  const canonical = `https://www.youtube.com/watch?v=${id}`;
  const metaResponse = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(canonical)}&format=json`, {
    signal: AbortSignal.timeout(12_000),
  });
  const meta = metaResponse.ok ? await metaResponse.json() as Record<string, unknown> : {};
  const captionResponse = await fetch(`https://www.youtube.com/api/timedtext?lang=en&fmt=srv3&v=${encodeURIComponent(id)}`, {
    headers: { "user-agent": "Mozilla/5.0" },
    signal: AbortSignal.timeout(18_000),
  });
  const xml = captionResponse.ok ? await limitedText(captionResponse) : "";
  const transcript = Array.from(xml.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/gi)).map((m) => cleanXml(m[1])).filter(Boolean).join(" ");
  const warnings = transcript ? [] : ["English public captions were unavailable; metadata only was returned."];
  return {
    ok: true,
    channel: "youtube",
    backend: transcript ? "youtube-timedtext" : "youtube-oembed",
    target: canonical,
    collectedAt: new Date().toISOString(),
    title: String(meta.title || `YouTube ${id}`),
    text: transcript || undefined,
    items: [{ author: meta.author_name || null, thumbnail: meta.thumbnail_url || null }],
    warnings,
  };
}

async function readRss(target: string, maxItems: number): Promise<ResearchResult> {
  const url = normalizePublicUrl(target);
  const response = await fetch(url, {
    headers: { accept: "application/rss+xml, application/atom+xml, application/xml, text/xml", "user-agent": "BRF-Keyless-Research/1.0" },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`RSS_FETCH_${response.status}`);
  const xml = await limitedText(response);
  const blocks = Array.from(xml.matchAll(/<(item|entry)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi)).slice(0, maxItems);
  const items = blocks.map((match) => {
    const block = match[2];
    const href = block.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1] || tag(block, "link");
    return {
      title: tag(block, "title"),
      link: href,
      published: tag(block, "pubDate") || tag(block, "published") || tag(block, "updated"),
      summary: tag(block, "description") || tag(block, "summary") || tag(block, "content"),
    };
  });
  return { ok: true, channel: "rss", backend: "native-fetch", target: url.toString(), collectedAt: new Date().toISOString(), title: tag(xml, "title") || url.hostname, items, warnings: items.length ? [] : ["The feed was reachable but no RSS/Atom entries were found."] };
}

async function readGithub(target: string): Promise<ResearchResult> {
  const match = target.trim().replace(/^https?:\/\/github\.com\//i, "").match(/^([^/\s]+)\/([^/\s#?]+?)(?:\.git)?(?:\/.*)?$/);
  if (!match) throw new Error("INVALID_GITHUB_REPOSITORY");
  const [owner, repo] = [match[1], match[2]];
  const headers = { accept: "application/vnd.github+json", "user-agent": "BRF-Keyless-Research/1.0" };
  const repoResponse = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, { headers, signal: AbortSignal.timeout(15_000) });
  if (!repoResponse.ok) throw new Error(`GITHUB_REPO_${repoResponse.status}`);
  const data = await repoResponse.json() as Record<string, unknown>;
  const readmeResponse = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`, { headers: { ...headers, accept: "application/vnd.github.raw+json" }, signal: AbortSignal.timeout(15_000) });
  const readme = readmeResponse.ok ? await limitedText(readmeResponse, 100_000) : "";
  return {
    ok: true,
    channel: "github",
    backend: "github-public-rest",
    target: `https://github.com/${owner}/${repo}`,
    collectedAt: new Date().toISOString(),
    title: String(data.full_name || `${owner}/${repo}`),
    text: readme || undefined,
    items: [{ description: data.description || null, stars: data.stargazers_count || 0, forks: data.forks_count || 0, openIssues: data.open_issues_count || 0, defaultBranch: data.default_branch || null, license: (data.license as Record<string, unknown> | null)?.spdx_id || null }],
    warnings: readme ? [] : ["Repository metadata was returned, but no README was available."],
  };
}

export default async (request: Request): Promise<Response> => {
  if (request.method !== "POST") return json(405, { error: "METHOD_NOT_ALLOWED" });
  if (!authorized(request)) return json(401, { error: "INTERNAL_AUTH_REQUIRED" });
  try {
    const body = await request.json() as ResearchRequest;
    const channel = body.channel;
    const target = String(body.target || "").trim();
    const maxItems = Math.min(Math.max(Number(body.maxItems || 10), 1), 25);
    if (!channel || !["web", "youtube", "rss", "github"].includes(channel)) return json(400, { error: "INVALID_CHANNEL" });
    if (!target) return json(400, { error: "TARGET_REQUIRED" });
    const result = channel === "web" ? await readWeb(target)
      : channel === "youtube" ? await readYouTube(target)
      : channel === "rss" ? await readRss(target, maxItems)
      : await readGithub(target);
    console.info("BRF keyless fallback", { channel, backend: result.backend, ok: result.ok });
    return json(200, result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn("BRF keyless fallback failed", { error: message });
    return json(502, { ok: false, error: message.slice(0, 500) });
  }
};
