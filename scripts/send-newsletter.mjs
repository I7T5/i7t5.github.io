import { readFileSync } from "node:fs";
import { basename } from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeCallouts from "rehype-callouts";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";

const SITE = "https://i7t5.com";
const FROM = process.env.FROM_EMAIL ?? "hello@i7t5.com";
const REPLY_TO = process.env.REPLY_TO ?? "hello@i7t5.com";
const API_KEY = process.env.RESEND_API_KEY;
const AUDIENCE_ID = process.env.AUDIENCE_ID;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const files = args.filter((a) => !a.startsWith("--"));

if (files.length === 0) {
  console.log("no files to process");
  process.exit(0);
}

if (!dryRun && (!API_KEY || !AUDIENCE_ID)) {
  console.error("RESEND_API_KEY and AUDIENCE_ID required (or use --dry-run)");
  process.exit(1);
}

function rewriteUrls() {
  return (tree) => {
    visit(tree, "element", (node) => {
      const attr = node.tagName === "a" ? "href" : node.tagName === "img" ? "src" : null;
      if (!attr) return;
      const url = node.properties?.[attr];
      if (typeof url !== "string") return;
      if (url.startsWith("/")) node.properties[attr] = SITE + url;
    });
  };
}

function hasClass(node, name) {
  const c = node.properties?.className;
  return Array.isArray(c) ? c.includes(name) : c === name;
}

function flattenCallouts() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "details" && hasClass(node, "callout")) {
        node.tagName = "div";
        delete node.properties?.open;
        for (const child of node.children) {
          if (child.type !== "element") continue;
          if (child.tagName === "summary") {
            child.tagName = "div";
            child.children = child.children.filter(
              (c) => !(c.type === "element" && hasClass(c, "callout-fold-icon")),
            );
          }
        }
      }
    });
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeKatex)
  .use(rehypeCallouts)
  .use(flattenCallouts)
  .use(rewriteUrls)
  .use(rehypeStringify, { allowDangerousHtml: true });

function wrap({ title, description, tags, bodyHtml, postUrl }) {
  const descHtml = description
    ? `<p class="description">${escape(description)}</p>`
    : "";
  const tagsHtml = tags?.length
    ? `<p class="tags">${tags.map((t) => `#${escape(t)}`).join(" ")}</p>`
    : "";
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${escape(title)}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.27/dist/katex.min.css">
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 640px; margin: 2rem auto; padding: 0 1rem; color: #222; line-height: 1.6; }
  a { color: #0d59f2; }
  pre, code { font-family: ui-monospace, "SF Mono", Menlo, monospace; background: #f6f6f6; }
  pre { padding: 0.75rem; overflow-x: auto; }
  code { padding: 0.1rem 0.25rem; border-radius: 3px; }
  pre code { padding: 0; background: none; }
  img { max-width: 100%; height: auto; }
  blockquote { border-left: 3px solid #ddd; padding-left: 1rem; color: #555; margin-left: 0; }
  .callout { background: #f6f6f6; border-left: 3px solid #999; padding: 0.5rem 1rem; margin: 1rem 0; }
  .callout-title { display: flex; align-items: center; gap: 0.4rem; font-weight: 600; margin-bottom: 0.25rem; }
  .callout-title-icon { display: inline-flex; }
  .callout-title-icon svg { width: 1em; height: 1em; }
  .callout-content > :first-child { margin-top: 0; }
  .callout-content > :last-child { margin-bottom: 0; }
  .description { color: #555; font-style: italic; margin: 0 0 0.5rem; }
  .tags { color: #999; font-size: 0.875rem; margin: 0 0 1.5rem; }
  .footer { color: #999; font-size: 0.875rem; margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #eee; }
</style>
</head>
<body>
<h1>${escape(title)}</h1>
${descHtml}
${tagsHtml}
${bodyHtml}
<div class="footer">
  Read on <a href="${postUrl}">i7t5.com</a>.
  This was sent automatically when a new post was published.
</div>
</body>
</html>`;
}

function escape(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

async function resend(path, body, method = "POST") {
  const res = await fetch(`https://api.resend.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${path} → ${res.status}: ${text}`);
  return text ? JSON.parse(text) : {};
}

async function audienceHasContacts() {
  const res = await resend(`/audiences/${AUDIENCE_ID}/contacts`, null, "GET");
  return Array.isArray(res.data) && res.data.length > 0;
}

for (const file of files) {
  if (!file.endsWith(".md")) {
    console.log(`skip ${file} (not markdown)`);
    continue;
  }
  const raw = readFileSync(file, "utf8");
  const { data: fm, content } = matter(raw);
  if (fm.isDraft) {
    console.log(`skip ${file} (draft)`);
    continue;
  }
  if (!fm.title) {
    console.error(`skip ${file} (missing title)`);
    continue;
  }

  const slug = basename(file, ".md");
  const postUrl = `${SITE}/posts/${slug}`;
  const bodyHtml = String(await processor.process(content));
  const html = wrap({
    title: fm.title,
    description: fm.description,
    tags: fm.tags,
    bodyHtml,
    postUrl,
  });

  if (dryRun) {
    console.log(`--- ${file} ---`);
    console.log(html);
    continue;
  }

  if (!(await audienceHasContacts())) {
    console.log(`skip ${file} (audience has no contacts)`);
    continue;
  }

  const created = await resend("/broadcasts", {
    audience_id: AUDIENCE_ID,
    from: FROM,
    reply_to: REPLY_TO,
    subject: fm.title,
    html,
  });
  await resend(`/broadcasts/${created.id}/send`);
  console.log(`sent ${file} → broadcast ${created.id}`);
}
