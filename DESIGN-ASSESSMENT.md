# Bursar Design Assessment & Improvement Plan

**Date:** February 14, 2026  
**Designer:** Coco (Designer Agent)  
**Project:** Bursar — HOA Board Management Platform  
**Live Site:** https://davidjette.github.io/bursar/

---

## Executive Summary

The current Bursar site demonstrates **solid foundational design** with a modern SaaS aesthetic. The brand identity is consistent, the code is clean, and the user experience is functional. However, there are opportunities to elevate the design from "good" to "exceptional" through refinements in visual hierarchy, typography scale, component polish, and cross-page consistency.

**Overall Grade:** B+ (Good, with clear path to A)

**Strengths:**
- Clean, modern aesthetic
- Consistent design system (CSS custom properties)
- Strong mobile-first approach
- Thoughtful micro-interactions and animations
- Accessible color contrast

**Areas for Improvement:**
- Typography scale needs refinement (some sizes feel arbitrary)
- Visual hierarchy could be stronger in dense sections
- Blog styling is inconsistent vs. landing pages
- Lack of visual interest on long-form content
- Some design tokens are underutilized

---

## Current Design System Catalogue

### Brand Identity

#### Typography
- **Font Family:** Inter (Google Fonts)
- **Weights Used:** 400, 500, 600, 700, 800, 900
- **Scale:** Custom (not on a modular scale)
  - Hero H1: `clamp(2.4rem, 5vw, 3.6rem)`
  - Section H2: `2rem`
  - Feature H3: `1.05rem`
  - Body: `1rem` (implied base)
  - Small: `0.8rem` - `0.95rem` (varies)

**Issue:** Typography scale is inconsistent — some headings use `1.15rem`, others `1.25rem`, others `1.4rem`. No clear system.

#### Color Palette
```css
Primary (Navy):     #0f172a (slate-900)
Primary Variants:   #1e293b, #334155, #475569 (700-500)
Accent (Blue):      #2563eb
Accent Hover:       #1d4ed8
Accent Light:       #dbeafe
Success:            #059669 (emerald-600)
Warning:            #ea580c (orange-600)
Danger:             #dc2626 (red-600)

Background:         #ffffff (white)
BG Subtle:          #f8fafc (slate-50)
BG Muted:           #f1f5f9 (slate-100)
BG Dark:            #0b1120 (custom dark navy)

Text:               #0f172a (same as primary)
Text Secondary:     #475569 (slate-600)
Text Muted:         #94a3b8 (slate-400)

Border:             #e2e8f0 (slate-200)
Border Light:       #f1f5f9 (slate-100)
```

**Strength:** Colors are well-chosen and accessible. Navy + blue is trustworthy and professional.

**Issue:** Dark mode colors defined (`--bg-dark`, `--bg-dark-700`) but not used consistently across all sections (only in testimonial and bottom CTA).

#### Spacing & Layout
- **Max Width:** `1140px`
- **Border Radius:** `16px` (cards), `12px` (buttons), `8px` (small)
- **Shadows:** 5 levels (sm, default, md, lg, accent-specific)
- **Grid Gaps:** `16px`, `20px`, `8px` (inconsistent)

**Strength:** Consistent use of custom properties throughout CSS.

**Issue:** Spacing values aren't on a systematic scale (e.g., 4px, 8px, 12px, 16px, 24px, 32px, 48px). Some arbitrary values like `28px`, `36px`, `56px` appear.

#### Shadows
```css
--shadow-sm:     0 1px 2px rgba(0,0,0,0.04)
--shadow:        0 4px 24px rgba(0,0,0,0.06)
--shadow-md:     0 8px 32px rgba(0,0,0,0.08)
--shadow-lg:     0 16px 48px rgba(0,0,0,0.1)
--shadow-accent: 0 8px 32px rgba(37,99,235,0.25)
```

**Strength:** Subtle, modern shadows. Good progression from sm → lg.

---

## Page-by-Page Assessment

### 1. Landing Page (`index.html`)

**Structure:** Hero → Social Proof → Pain Points → Features → Testimonial → Pricing → FAQ → Bottom CTA → Footer

**What Works:**
- Hero gradient background effect is subtle and modern
- Pain point cards (4-column grid with large numbers) create strong visual impact
- Feature cards have clear hierarchy (icon → title → description)
- Sticky CTA bar for mobile is smart UX
- Fade-up animations on scroll add polish

**What Needs Improvement:**

1. **Hero Spacing:** The badge → headline → subhead → CTA spacing feels cramped. Increase vertical rhythm.
2. **Social Proof Bar:** Numbers are strong, but dividers are barely visible. Consider stronger visual separation or remove dividers entirely.
3. **Pain Card Numbers:** `2.4rem` font size for numbers is big, but not *big* enough to feel impactful. Consider `3rem` or larger.
4. **Feature Icons:** Using emoji (📱, 🛡️, 📅) is playful but undermines professional tone. Consider custom SVG icons or icon font.
5. **Testimonial Section:** Dark background is good contrast, but the quote mark (`font-size: 4rem`) is visually distracting. Consider removing or reducing to `2rem`.
6. **Pricing Card:** "POPULAR" badge looks dated (absolute positioned pill). Consider inline badge or remove entirely for single-plan pricing.
7. **FAQ Arrows:** Right-aligned arrows are correct UX, but `font-size: 0.8rem` makes them feel weak. Use icon instead of character.

### 2. Landing Variants

**Compliance Variant (`variants/compliance.html`):** 6,843 bytes  
**Platform Variant (`variants/platform.html`):** 4,669 bytes

**Issue:** I haven't reviewed these variants yet, but likely suffer from same issues as main landing.

**Recommendation:** Audit these next to ensure consistency with any design improvements made to `index.html`.

### 3. Blog (`blog/index.html`)

**What Works:**
- Simple, clean article list
- RSS feed available (`feed.xml`)
- Consistent date/author formatting

**What Needs Major Improvement:**

1. **Inline Styles:** Blog index uses inline `style=""` attributes instead of classes. This breaks consistency with the design system.
   ```html
   <h1 style="font-size:2.2rem;color:var(--primary);...">
   ```
   **Fix:** Extract these styles into `.blog-index`, `.blog-article-card`, etc. classes in `style.css`.

2. **Visual Hierarchy:** Article cards have no hover state, no visual separation beyond a `border-bottom`. Feels flat.
   **Fix:** Add background cards with hover elevation (like feature cards on landing page).

3. **Typography:** Article titles are `1.25rem` but landing feature titles are `1.05rem`. Inconsistent hierarchy.

4. **Metadata:** Date/author line is `0.8rem` and faded, but could use a visual badge or separator to feel more polished.

5. **"Read article →" Links:** Plain blue links feel underdesigned. Consider button-style links or underline animations.

### 4. Blog Posts (`blog/*.html`)

**What Works:**
- Clean, readable article layout
- Good line-height (`1.85`) for body text
- Inline post styles are scoped (don't leak)
- Post-CTA box at bottom for conversion

**What Needs Improvement:**

1. **Inline Styles (Again):** Blog post styles are in `<style>` tags instead of external CSS. Hard to maintain consistency.
   **Fix:** Move `.post`, `.post-body`, `.post-meta`, etc. into `style.css` or new `blog.css`.

2. **Hero Spacing:** Post title and meta are cramped at top. Needs more breathing room.

3. **Body Copy:** `1.05rem` is readable, but `1.1rem` would be more comfortable for long-form content.

4. **Link Styles:** Underline-on-hover is standard, but consider subtle background color change for better visibility.

5. **Code Blocks:** Inline `<code>` has background, but no multi-line `<pre><code>` styles defined. If you add code snippets later, they'll break.

6. **Images:** No image styles defined. If you add blog post images, they'll need max-width, border-radius, shadow, and responsive behavior.

### 5. Compliance Audit (`audit/index.html`)

**What Works:**
- Typeform-style single-question flow is modern and engaging
- Progress bar with category indicator is clear UX
- Keyboard shortcuts (`1`, `2`, `3` for options) are power-user friendly
- Results screen with score ring and gap analysis is strong
- Email gate before results is conversion-optimized

**What Needs Improvement:**

1. **Progress Bar:** 4px height is very subtle. Consider 6px for better visibility.

2. **Question Card Transitions:** `translateX(40px)` slide animation is nice, but feels a bit aggressive. Consider `20px` for smoother feel.

3. **Option Hover State:** Background changes to `--accent-light`, but border changes to `--accent`. This creates a double-shift. Consider just border change or just background change, not both.

4. **Key Badges (1, 2, 3):** 28px circle is good size, but `border-radius: 6px` creates a rounded square, not a circle. Change to `border-radius: 50%` or increase size to 32px.

5. **Results Score Ring:** SVG ring is good, but no animation defined. Consider animating the stroke-dasharray on reveal for polish.

6. **Gap Cards:** Left border (`4px solid`) is strong visual, but cards have no hover state. Consider subtle lift on hover.

7. **Severity Badges:** "Critical" and "Moderate" text could use color coding in addition to border color (red text for critical, orange for moderate).

### 6. Product Wireframes (`wireframes/index.html`)

**Size:** 24,668 bytes (large file)

**Issue:** I haven't reviewed this page yet, but size suggests it's complex.

**Recommendation:** Audit this page separately for:
- Wireframe image optimization (are images too large?)
- Layout consistency with other pages
- Mobile responsiveness of wireframes

---

## Design System Issues

### 1. Typography Scale

**Current State:** No systematic scale. Sizes are chosen ad-hoc.

**Proposal:** Adopt a modular scale (1.25 ratio):
```css
--text-xs:   0.8rem;   /* 12.8px */
--text-sm:   0.875rem; /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg:   1.125rem; /* 18px */
--text-xl:   1.25rem;  /* 20px */
--text-2xl:  1.5rem;   /* 24px */
--text-3xl:  1.875rem; /* 30px */
--text-4xl:  2.25rem;  /* 36px */
--text-5xl:  3rem;     /* 48px */
--text-6xl:  3.75rem;  /* 60px */
```

**Mapping to Components:**
- Hero H1: `clamp(var(--text-4xl), 5vw, var(--text-6xl))`
- Section H2: `var(--text-3xl)`
- Feature H3: `var(--text-xl)`
- Body: `var(--text-base)` or `var(--text-lg)` for long-form
- Small: `var(--text-sm)` or `var(--text-xs)`

### 2. Spacing Scale

**Current State:** Arbitrary values (`28px`, `36px`, `56px`).

**Proposal:** 4px baseline scale:
```css
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

**Usage:**
```css
.hero { padding: var(--space-20) var(--space-6) var(--space-12); }
.feature-card { padding: var(--space-8) var(--space-7); }
```

### 3. Blog Styles

**Current State:** Inline styles, inconsistent with landing page design system.

**Proposal:** Extract all blog styles into `blog.css` or integrate into `style.css`:
```css
/* Blog Index */
.blog-index { max-width: 680px; margin: 0 auto; padding: 120px 24px 80px; }
.blog-index-title { font-size: var(--text-3xl); color: var(--primary); margin-bottom: 8px; font-weight: 800; }
.blog-index-intro { color: var(--text-secondary); margin-bottom: 32px; font-size: var(--text-base); }

.blog-article-card {
  padding: 32px 0;
  border-bottom: 1px solid var(--border);
  transition: transform var(--transition);
}
.blog-article-card:hover { transform: translateX(4px); }

.blog-article-title {
  color: var(--primary);
  font-size: var(--text-xl);
  margin-bottom: 8px;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.3;
  text-decoration: none;
}
.blog-article-title:hover { color: var(--accent); }

.blog-article-meta {
  color: var(--text-muted);
  font-size: var(--text-xs);
  margin-bottom: 10px;
  font-weight: 500;
}

.blog-article-excerpt {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  margin-bottom: 12px;
  line-height: 1.65;
}

.blog-article-link {
  color: var(--accent);
  font-size: var(--text-sm);
  font-weight: 500;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.blog-article-link:hover { text-decoration: underline; }

/* Blog Post */
.post { max-width: 680px; margin: 0 auto; padding: 120px 24px 80px; }
.post-title { font-size: var(--text-4xl); color: var(--primary); margin-bottom: 10px; line-height: 1.15; letter-spacing: -0.02em; font-weight: 800; }
.post-meta { color: var(--text-muted); font-size: var(--text-sm); margin-bottom: 36px; padding-bottom: 24px; border-bottom: 1px solid var(--border); font-weight: 500; display: flex; align-items: center; flex-wrap: wrap; gap: 6px; }
.post-tag { background: var(--bg-muted); padding: 2px 8px; border-radius: 4px; font-size: var(--text-xs); }
.post-body { font-size: var(--text-lg); line-height: 1.85; }
/* ...etc */
```

### 4. Icon System

**Current State:** Emoji icons (📱, 🛡️, 📅) in feature cards.

**Issue:** Emoji render inconsistently across browsers/OSes and undermine professional aesthetic.

**Proposal:** Replace with:
- **Option A:** Heroicons (MIT license, modern SVG icons) — https://heroicons.com
- **Option B:** Lucide (MIT license, Feather fork) — https://lucide.dev
- **Option C:** Custom SVG icons designed for brand

**Implementation:**
```html
<div class="icon">
  <svg width="24" height="24" fill="none" stroke="currentColor">
    <!-- icon path -->
  </svg>
</div>
```

Update CSS:
```css
.feature-card .icon svg {
  width: 24px;
  height: 24px;
  color: var(--accent);
}
```

---

## Improvement Plan

### Phase 1: Quick Wins (2-3 hours)

**Goal:** Fix inconsistencies and low-hanging fruit.

1. **Extract Blog Styles**
   - Move all inline `style=""` from `blog/index.html` into classes
   - Move `<style>` block from blog posts into `style.css` or `blog.css`
   - Ensure blog uses same design tokens as landing pages

2. **Typography Scale**
   - Define modular scale custom properties in `:root`
   - Replace arbitrary font sizes with scale variables
   - Test across all pages for readability

3. **Fix Emoji Icons**
   - Replace emoji with SVG icons (Heroicons or Lucide)
   - Ensure consistent size and color across feature cards

4. **Spacing Audit**
   - Define spacing scale custom properties
   - Replace arbitrary `padding` and `margin` values with scale variables
   - Ensure consistent vertical rhythm

5. **Mobile Test**
   - Test all pages on iPhone/Android viewport (375px, 768px)
   - Fix any layout breaks or font size issues

**Deliverable:** Style guide document showing typography scale, spacing scale, and color palette with usage examples.

---

### Phase 2: Visual Polish (4-5 hours)

**Goal:** Elevate visual design from good to great.

1. **Hero Refinement**
   - Increase spacing between badge, headline, subhead, and CTA
   - Test larger headline size (current max `3.6rem` → `4rem` or `4.5rem`)
   - Strengthen gradient background effect (increase opacity slightly)

2. **Social Proof Bar**
   - Remove dividers OR make them thicker/darker for visibility
   - Test alternative layout (4 stats in a row vs. 2x2 grid on mobile)

3. **Pain Point Cards**
   - Increase number font size (`2.4rem` → `3rem` or `3.5rem`)
   - Add subtle gradient to card borders on hover
   - Test alternative icon/visual instead of just numbers

4. **Feature Cards**
   - Replace emoji icons with SVG icons
   - Add subtle icon animation on card hover
   - Test 2-column grid on tablet (768px-1024px)

5. **Testimonial Section**
   - Reduce or remove giant quote mark (`4rem` → `2rem` or remove)
   - Add subtle avatar image placeholder for testimonial author
   - Test alternative background gradient

6. **Pricing Card**
   - Redesign "POPULAR" badge (inline or remove for single-plan)
   - Add visual comparison table if multiple plans exist later
   - Test alternative CTA button style (larger, more prominent)

7. **FAQ Section**
   - Replace arrow character with SVG chevron icon
   - Add subtle background color change on open state
   - Test smooth max-height transition (current `max-height: 200px` may clip long answers)

8. **Blog Index**
   - Add card-style article preview with hover elevation
   - Add featured image placeholder for each article
   - Test alternative grid layout (2-column on desktop)

9. **Blog Posts**
   - Increase body font size (`1.05rem` → `1.1rem`)
   - Add image styles (max-width, border-radius, shadow)
   - Add multi-line code block styles (`<pre><code>`)
   - Test table of contents for long posts

10. **Compliance Audit**
    - Animate score ring reveal (stroke-dasharray transition)
    - Add color coding to severity text (not just border)
    - Add hover state to gap cards
    - Test skip/back navigation on mobile

**Deliverable:** Annotated screenshots showing before/after for each component.

---

### Phase 3: New Components (6-8 hours)

**Goal:** Add missing elements that elevate the brand.

1. **Illustration System**
   - Commission or generate 3-5 custom illustrations for key sections
   - Hero illustration (HOA board member with laptop)
   - Pain point illustration (stressed board member with invoices)
   - Features illustration (mobile app mockup)
   - Alternative: Use AI image generation (Midjourney/DALL-E) with consistent style

2. **Photography**
   - Source or generate 3-5 stock photos of diverse people (board members, HOAs, California neighborhoods)
   - Use in testimonials, blog posts, about section
   - Apply consistent color grading (slightly warm, trustworthy)

3. **Icon Set**
   - Design or curate 12-15 custom icons for features, benefits, and navigation
   - Ensure consistent stroke width, rounded corners, and size
   - Export as SVG sprites for performance

4. **Loading States**
   - Add skeleton screens for CTA form submission
   - Add spinner or progress indicator for audit questions
   - Ensure smooth transitions between states

5. **Error States**
   - Design error message styles for form validation
   - Add empty state designs (e.g., blog with no posts)
   - Add 404 page design

6. **Micro-interactions**
   - Add button press animation (scale down slightly on click)
   - Add form input focus glow animation
   - Add checkbox/radio check animation in audit

7. **Social Proof Elements**
   - Add testimonial carousel if more testimonials collected
   - Add logo grid for "Trusted by" section (when customers exist)
   - Add trust badges (SOC 2, GDPR, etc. when applicable)

**Deliverable:** Component library document showing all new components with usage guidelines.

---

### Phase 4: Advanced Enhancements (8-10 hours)

**Goal:** Push the design to industry-leading quality.

1. **Dark Mode**
   - Implement full dark mode toggle
   - Test all components in dark mode
   - Ensure accessibility (contrast ratios)
   - Save preference to localStorage

2. **Animation System**
   - Audit and refine all animations (fade-up, slide-in, etc.)
   - Add scroll-triggered parallax effects (subtle)
   - Add cursor-follow gradient effect on hero
   - Ensure animations respect `prefers-reduced-motion`

3. **Responsive Images**
   - Implement `srcset` for all images
   - Add WebP format with fallback
   - Lazy load images below fold
   - Optimize all images (compress, resize)

4. **Performance Optimization**
   - Inline critical CSS for above-fold content
   - Defer non-critical CSS
   - Add preload for Google Fonts
   - Test Lighthouse score (target 95+ performance, 100 accessibility)

5. **Accessibility Audit**
   - Add skip-to-content link
   - Ensure all interactive elements have focus states
   - Add ARIA labels where needed
   - Test with screen reader (NVDA/JAWS)
   - Ensure keyboard navigation works everywhere

6. **SEO Optimization**
   - Add Open Graph tags for social sharing
   - Add Twitter Card tags
   - Add schema.org structured data (Organization, Product, BlogPosting)
   - Optimize meta descriptions
   - Add canonical URLs

7. **Print Styles**
   - Design print stylesheet for blog posts
   - Hide navigation, CTAs, and non-essential elements
   - Ensure readable typography and layout

**Deliverable:** Audit report with Lighthouse scores, accessibility test results, and performance metrics.

---

## Priority Recommendations

**If you only have time for 3 improvements, do these:**

### 1. Extract Blog Styles (1 hour)
Move all inline styles to external CSS. This will make future design changes 10x easier and ensure consistency across the site.

### 2. Replace Emoji Icons (1 hour)
Swap emoji (📱, 🛡️, 📅) with professional SVG icons. This single change will dramatically improve perceived quality.

### 3. Typography Scale (1 hour)
Define a modular scale and apply it consistently. This will improve visual hierarchy and make the site feel more polished.

**Total Time:** 3 hours  
**Impact:** High — these 3 changes will have the biggest visual impact for the least effort.

---

## Competitive Benchmark

### Competitors to Study:
- **PayHOA** — https://payhoa.com
- **Vantaca** — https://vantaca.com
- **AppFolio** — https://appfolio.com
- **Buildium** — https://buildium.com
- **Strongroom** — https://strongroom.ai

**Key Observations:**
- Most use **large, high-quality product screenshots** on landing pages
- Most have **customer logos** or testimonials above the fold
- Most use **professional photography** not stock images
- Most have **demo videos** or interactive tours
- Most have **comparison tables** vs. competitors

**Where Bursar Can Compete:**
- **Simplicity** — Your landing page is cleaner and less cluttered than competitors
- **California-specific** — You're the only one positioning explicitly for CA HOAs
- **Modern aesthetic** — Your design is more contemporary than AppFolio/Buildium
- **Mobile-first** — Your mobile experience is better than most competitors

**Where Bursar Needs to Catch Up:**
- **Product visuals** — No screenshots or mockups on landing page (only in wireframes page)
- **Social proof** — No customer logos or testimonials yet
- **Content depth** — Blog is good start, but competitors have 50-100+ articles

---

## Next Steps

1. **Review this document** — Mark which improvements resonate most
2. **Choose a phase** — Start with Phase 1 (Quick Wins) or cherry-pick high-impact items
3. **Prioritize** — What's blocking launch? What can wait?
4. **Timeline** — When do you want these improvements done by?
5. **Resources** — Do you need help with:
   - Photography/illustrations?
   - Icon design?
   - Copywriting for new sections?
   - Development (if design changes require JS)?

**My Recommendation:**
- **This week:** Phase 1 (Quick Wins) — 3 hours — Fix inconsistencies
- **Next week:** Phase 2 (Visual Polish) — 5 hours — Elevate components
- **Month 1:** Phase 3 (New Components) — 8 hours — Add missing elements
- **Month 2:** Phase 4 (Advanced) — 10 hours — Push to industry-leading

**Total Estimated Time:** 26 hours over 2 months to reach world-class design quality.

---

## Questions for Dave

1. **Launch Timeline:** When do you want to launch? Does that change priority?
2. **Resources:** Do you have budget for stock photos, illustrations, or icon sets? Or should I use free/AI-generated assets?
3. **Product Screenshots:** Do you have product mockups/screenshots ready, or should I design those as part of wireframes?
4. **Testimonials:** Do you have any beta testers or early customers who could provide testimonials?
5. **Competitors:** Have you used any of these tools (PayHOA, Vantaca, etc.)? What do you like/dislike about their design?
6. **Scope:** Are there any features or pages you're planning to add soon that I should design for now?

---

**Prepared by:** Coco (Designer Agent)  
**Date:** February 14, 2026  
**Next Action:** Awaiting your review and direction on which phase to start.
