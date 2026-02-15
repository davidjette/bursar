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
    .post { max-width: 720px; margin: 0 auto; padding: 120px 24px 80px; }
    .post h1 { font-size: 2.2rem; color: var(--primary); margin-bottom: 8px; line-height: 1.2; }
    .post-meta { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 32px; }
    .post-body { font-size: 1.05rem; line-height: 1.8; }
    .post-body h2 { font-size: 1.5rem; margin: 36px 0 12px; color: var(--primary); }
    .post-body h3 { font-size: 1.2rem; margin: 28px 0 10px; color: var(--primary); }
    .post-body p { margin-bottom: 18px; color: var(--text-light); }
    .post-body ul, .post-body ol { margin-bottom: 18px; padding-left: 24px; color: var(--text-light); }
    .post-body li { margin-bottom: 6px; }
    .post-body blockquote { border-left: 4px solid var(--accent); padding: 12px 20px; margin: 20px 0; background: var(--bg-alt); color: var(--text-light); font-style: italic; }
    .post-body code { background: var(--bg-alt); padding: 2px 6px; border-radius: 4px; font-size: 0.9rem; }
    .post-body a { color: var(--primary-light); }
    .post-cta { background: var(--bg-alt); padding: 30px; border-radius: var(--radius); margin-top: 40px; text-align: center; }
    .post-cta h3 { margin-bottom: 12px; }
    .back-link { display: inline-block; margin-bottom: 20px; color: var(--primary-light); text-decoration: none; font-size: 0.9rem; }
    .back-link:hover { text-decoration: underline; }
  </style>
</head>
<body>
<nav class="nav"><div class="nav-inner">
  <a href="/" class="logo">Bursar</a>
  <a href="/bursar/blog/" style="color:var(--text-light);text-decoration:none;margin-right:16px">Blog</a>
  <a href="/#waitlist" class="nav-cta">Join Waitlist</a>
</div></nav>
<article class="post">
  <a href="/bursar/blog/" class="back-link">← Back to Blog</a>
  <h1>${post.title}</h1>
  <div class="post-meta">${post.date} · ${post.author}${post.tags.length ? ' · ' + post.tags.join(', ') : ''}</div>
  <div class="post-body">${post.html}</div>
  <div class="post-cta">
    <h3>Is your HOA board compliant?</h3>
    <p>Take our free 5-minute compliance assessment.</p>
    <a href="/bursar/variants/compliance.html" class="nav-cta" style="display:inline-block;text-decoration:none;padding:12px 24px">Free Compliance Audit</a>
  </div>
</article>
<footer class="footer"><p>© 2026 Bursar · Purpose-built for California HOA boards</p></footer>
</body>
</html>`;
}

function indexPage(posts) {
  const cards = posts.map(p => `
    <article style="border-bottom:1px solid var(--border);padding:28px 0;">
      <a href="/bursar/blog/${p.slug}.html" style="text-decoration:none;">
        <h3 style="color:var(--primary);font-size:1.3rem;margin-bottom:6px;">${p.title}</h3>
      </a>
      <div style="color:var(--text-muted);font-size:0.85rem;margin-bottom:8px;">${p.date} · ${p.author}</div>
      <p style="color:var(--text-light);font-size:0.95rem;margin-bottom:8px;">${p.excerpt}</p>
      <a href="/bursar/blog/${p.slug}.html" style="color:var(--primary-light);font-size:0.9rem;">Read more →</a>
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
  <a href="/" class="logo">Bursar</a>
  <a href="/bursar/blog/" style="color:var(--text-light);text-decoration:none;margin-right:16px">Blog</a>
  <a href="/#waitlist" class="nav-cta">Join Waitlist</a>
</div></nav>
<div style="max-width:720px;margin:0 auto;padding:120px 24px 80px;">
  <h1 style="font-size:2rem;color:var(--primary);margin-bottom:8px;">Blog</h1>
  <p style="color:var(--text-light);margin-bottom:32px;">Insights for California HOA board members on compliance, operations, and best practices.</p>
  ${posts.length === 0 ? '<p style="color:var(--text-muted);">Coming soon — stay tuned.</p>' : cards}
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
