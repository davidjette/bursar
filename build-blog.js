#!/usr/bin/env node
/**
 * Bursar Blog Builder
 * Converts markdown posts in blog/posts/ → HTML in docs/blog/
 * Generates index page and RSS feed.
 */
const fs = require('fs');
const path = require('path');
const fm = require('front-matter');
const { marked } = require('marked');

const POSTS_DIR = path.join(__dirname, 'blog/posts');
const OUT_DIR = path.join(__dirname, 'docs/blog');
const SITE_URL = 'https://davidjette.github.io/bursar';

// Ensure output dir
fs.mkdirSync(OUT_DIR, { recursive: true });

// Read and parse all posts
const posts = fs.readdirSync(POSTS_DIR)
  .filter(f => f.endsWith('.md'))
  .map(file => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const { attributes, body } = fm(raw);
    const slug = file.replace(/\.md$/, '');
    return {
      slug,
      title: attributes.title || slug,
      date: attributes.date || '2026-01-01',
      author: attributes.author || 'Bursar Team',
      excerpt: attributes.excerpt || body.substring(0, 160).replace(/[#*\n]/g, '').trim() + '...',
      tags: attributes.tags || [],
      html: marked(body),
    };
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date));

console.log(`Found ${posts.length} posts`);

// HTML template
function postPage(post) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title} — Bursar Blog</title>
  <meta name="description" content="${post.excerpt}">
  <link rel="stylesheet" href="../../css/style.css">
  <style>
    .post { max-width: 680px; margin: 0 auto; padding: 120px 24px 80px; }
    .post h1 { font-size: 2.2rem; color: var(--primary); margin-bottom: 10px; line-height: 1.15; letter-spacing: -0.02em; font-weight: 800; }
    .post-meta { color: var(--text-muted); font-size: 0.85rem; margin-bottom: 36px; padding-bottom: 24px; border-bottom: 1px solid var(--border); font-weight: 500; }
    .post-body { font-size: 1.05rem; line-height: 1.85; }
    .post-body h2 { font-size: 1.4rem; margin: 40px 0 14px; color: var(--primary); font-weight: 700; letter-spacing: -0.01em; }
    .post-body h3 { font-size: 1.15rem; margin: 32px 0 10px; color: var(--primary); font-weight: 700; }
    .post-body p { margin-bottom: 20px; color: var(--text-secondary); }
    .post-body ul, .post-body ol { margin-bottom: 20px; padding-left: 24px; color: var(--text-secondary); }
    .post-body li { margin-bottom: 8px; line-height: 1.7; }
    .post-body blockquote { border-left: 3px solid var(--accent); padding: 16px 24px; margin: 24px 0; background: var(--bg-subtle); color: var(--text-secondary); border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }
    .post-body code { background: var(--bg-muted); padding: 2px 7px; border-radius: 4px; font-size: 0.88rem; }
    .post-body strong { color: var(--text); font-weight: 600; }
    .post-body a { color: var(--accent); text-decoration: none; }
    .post-body a:hover { text-decoration: underline; }
    .post-cta { background: var(--bg-subtle); padding: 36px; border-radius: var(--radius); margin-top: 48px; text-align: center; border: 1px solid var(--border); }
    .post-cta h3 { margin-bottom: 8px; font-size: 1.15rem; font-weight: 700; color: var(--primary); }
    .post-cta p { color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 16px; }
    .back-link { display: inline-flex; align-items: center; gap: 4px; margin-bottom: 24px; color: var(--text-muted); text-decoration: none; font-size: 0.85rem; font-weight: 500; transition: color var(--transition); }
    .back-link:hover { color: var(--accent); }
  </style>
</head>
<body>
<nav class="nav"><div class="nav-inner">
  <a href="/bursar/" class="logo">Bursar</a>
  <div style="display:flex;align-items:center;gap:24px;">
    <a href="/bursar/blog/" style="color:var(--text-secondary);text-decoration:none;font-size:0.9rem;font-weight:500;">Blog</a>
    <a href="/bursar/audit/" style="color:var(--text-secondary);text-decoration:none;font-size:0.9rem;font-weight:500;">Audit</a>
    <a href="/bursar/#waitlist" class="nav-cta">Join Waitlist</a>
  </div>
</div></nav>
<article class="post">
  <a href="/bursar/blog/" class="back-link">← Back to Blog</a>
  <h1>${post.title}</h1>
  <div class="post-meta">${post.date} · ${post.author}${post.tags.length ? ' · ' + post.tags.map(t => '<span style="background:var(--bg-muted);padding:2px 8px;border-radius:4px;font-size:0.8rem;">' + t + '</span>').join(' ') : ''}</div>
  <div class="post-body">${post.html}</div>
  <div class="post-cta">
    <h3>Is your HOA board compliant?</h3>
    <p>Take our free 5-minute compliance assessment and get personalized results.</p>
    <a href="/bursar/audit/" class="nav-cta" style="display:inline-block;text-decoration:none;padding:12px 28px;">Take Free Audit →</a>
  </div>
</article>
<footer class="footer"><p>© 2026 Bursar · Purpose-built for California HOA boards</p></footer>
</body>
</html>`;
}

function indexPage(posts) {
  const cards = posts.map(p => `
    <article style="padding:32px 0;border-bottom:1px solid var(--border);">
      <a href="/bursar/blog/${p.slug}.html" style="text-decoration:none;">
        <h3 style="color:var(--primary);font-size:1.25rem;margin-bottom:8px;font-weight:700;letter-spacing:-0.01em;line-height:1.3;">${p.title}</h3>
      </a>
      <div style="color:var(--text-muted);font-size:0.8rem;margin-bottom:10px;font-weight:500;">${p.date} · ${p.author}</div>
      <p style="color:var(--text-secondary);font-size:0.95rem;margin-bottom:12px;line-height:1.65;">${p.excerpt}</p>
      <a href="/bursar/blog/${p.slug}.html" style="color:var(--accent);font-size:0.9rem;font-weight:500;text-decoration:none;">Read article →</a>
    </article>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog — Bursar</title>
  <meta name="description" content="Insights for California HOA board members on compliance, operations, and best practices.">
  <link rel="stylesheet" href="../css/style.css">
  <link rel="alternate" type="application/rss+xml" href="/bursar/blog/feed.xml" title="Bursar Blog">
</head>
<body>
<nav class="nav"><div class="nav-inner">
  <a href="/bursar/" class="logo">Bursar</a>
  <div style="display:flex;align-items:center;gap:24px;">
    <a href="/bursar/blog/" style="color:var(--text-secondary);text-decoration:none;font-size:0.9rem;font-weight:500;">Blog</a>
    <a href="/bursar/audit/" style="color:var(--text-secondary);text-decoration:none;font-size:0.9rem;font-weight:500;">Audit</a>
    <a href="/bursar/#waitlist" class="nav-cta">Join Waitlist</a>
  </div>
</div></nav>
<div style="max-width:680px;margin:0 auto;padding:120px 24px 80px;">
  <h1 style="font-size:2.2rem;color:var(--primary);margin-bottom:8px;font-weight:800;letter-spacing:-0.02em;">Blog</h1>
  <p style="color:var(--text-secondary);margin-bottom:8px;font-size:1rem;">Insights for California HOA board members on compliance, operations, and best practices.</p>
  ${posts.length === 0 ? '<p style="color:var(--text-muted);margin-top:40px;">Coming soon — stay tuned.</p>' : cards}
</div>
<footer class="footer"><p>© 2026 Bursar · Purpose-built for California HOA boards</p></footer>
</body>
</html>`;
}

function rssFeed(posts) {
  const items = posts.slice(0, 20).map(p => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${SITE_URL}/blog/${p.slug}.html</link>
      <description><![CDATA[${p.excerpt}]]></description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <guid>${SITE_URL}/blog/${p.slug}.html</guid>
    </item>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Bursar Blog</title>
  <link>${SITE_URL}/blog/</link>
  <description>Insights for California HOA board members</description>
  <language>en-us</language>
  ${items}
</channel>
</rss>`;
}

// Generate all pages
posts.forEach(post => {
  const outPath = path.join(OUT_DIR, `${post.slug}.html`);
  fs.writeFileSync(outPath, postPage(post));
  console.log(`  → ${post.slug}.html`);
});

fs.writeFileSync(path.join(OUT_DIR, 'index.html'), indexPage(posts));
console.log('  → index.html');

fs.writeFileSync(path.join(OUT_DIR, 'feed.xml'), rssFeed(posts));
console.log('  → feed.xml');

console.log(`\nDone! ${posts.length} posts built.`);
