// Bursar Compliance Audit — Typeform-Style Question Engine
const QUESTIONS = [
  { id: 1, cat: 'Financial Reporting', q: 'Does your board send the annual budget disclosure to all members 45-60 days before your fiscal year begins?', ref: 'Civil Code §5300', opts: [
    { text: 'Yes, every year on time', pts: 5 },
    { text: 'We send it, but sometimes late', pts: 2 },
    { text: 'No, we don\'t send annual budget disclosures', pts: 0 },
    { text: 'Not sure', pts: 0 },
  ]},
  { id: 2, cat: 'Financial Reporting', q: 'Is your reserve study current (updated within the last 3 years)?', ref: 'Civil Code §5550', opts: [
    { text: 'Yes, updated within the last 3 years', pts: 5 },
    { text: 'It\'s 3-5 years old', pts: 2 },
    { text: 'It\'s more than 5 years old', pts: 0 },
    { text: 'We don\'t have a reserve study', pts: 0 },
    { text: 'Not sure', pts: 0 },
  ]},
  { id: 3, cat: 'Financial Reporting', q: 'Does your board retain financial records for at least 7 years?', ref: 'Civil Code §5210', opts: [
    { text: 'Yes, organized records going back 7+ years', pts: 5 },
    { text: 'Some records but gaps exist', pts: 2 },
    { text: 'No, we don\'t keep records that long', pts: 0 },
    { text: 'Not sure / records are disorganized', pts: 0 },
  ]},
  { id: 4, cat: 'Financial Reporting', q: 'Does your HOA conduct an annual review of its financial statements?', ref: 'Civil Code §5305', opts: [
    { text: 'Yes, by a CPA', pts: 5 },
    { text: 'Yes, by the board or internal review', pts: 3 },
    { text: 'No annual review', pts: 0 },
    { text: 'Not sure', pts: 0 },
    { text: 'N/A — Our HOA is exempt (under 50 units)', pts: -1 },
  ]},
  { id: 5, cat: 'Board Meetings', q: 'Does your board send meeting notices at least 4 days in advance?', ref: 'Civil Code §4930', opts: [
    { text: 'Yes, always', pts: 5 },
    { text: 'Usually, but sometimes late', pts: 2 },
    { text: 'No, we often meet with less than 4 days\' notice', pts: 0 },
    { text: 'We don\'t hold regular board meetings', pts: 0 },
  ]},
  { id: 6, cat: 'Board Meetings', q: 'Does your board provide an open forum for member participation at regular board meetings?', ref: 'Civil Code §4925', opts: [
    { text: 'Yes, at every regular board meeting', pts: 5 },
    { text: 'Sometimes, but not consistently', pts: 2 },
    { text: 'No, we don\'t offer open forum', pts: 0 },
    { text: 'Not sure', pts: 0 },
  ]},
  { id: 7, cat: 'Board Meetings', q: 'Does your board prepare and retain minutes for all board meetings?', ref: 'Civil Code §4950', opts: [
    { text: 'Yes, detailed minutes for every meeting', pts: 5 },
    { text: 'We take notes but they\'re informal', pts: 2 },
    { text: 'No, we don\'t keep minutes', pts: 0 },
    { text: 'Not sure', pts: 0 },
  ]},
  { id: 8, cat: 'Board Meetings', q: 'When your board holds executive (closed) sessions, are they limited to authorized topics only?', ref: 'Litigation, personnel, discipline, contracts', opts: [
    { text: 'Yes, only for authorized topics', pts: 5 },
    { text: 'Not sure what\'s allowed in executive session', pts: 0 },
    { text: 'We discuss most topics in closed session', pts: 0 },
    { text: 'We don\'t hold executive sessions', pts: 5 },
  ]},
  { id: 9, cat: 'Document Management', q: 'When homeowners request documents, does your board respond within 10 business days?', ref: 'Civil Code §5200', opts: [
    { text: 'Yes, always within 10 business days', pts: 5 },
    { text: 'Usually, but sometimes late', pts: 2 },
    { text: 'No, it often takes longer', pts: 0 },
    { text: 'We rarely receive document requests', pts: 3 },
  ]},
  { id: 10, cat: 'Document Management', q: 'Are your HOA\'s governing documents, contracts, meeting minutes, and financial records organized and easily accessible?', ref: '', opts: [
    { text: 'Yes, fully organized in a central system', pts: 5 },
    { text: 'Somewhat organized, spread across multiple locations', pts: 2 },
    { text: 'No, our documents are disorganized', pts: 0 },
    { text: 'Not sure where everything is stored', pts: 0 },
  ]},
  { id: 11, cat: 'Insurance', q: 'Does your HOA maintain current general liability and property insurance coverage?', ref: '', opts: [
    { text: 'Yes, current and reviewed annually', pts: 5 },
    { text: 'Yes, but haven\'t reviewed in 2+ years', pts: 2 },
    { text: 'No, coverage lapsed', pts: 0 },
    { text: 'Not sure', pts: 0 },
  ]},
  { id: 12, cat: 'Insurance', q: 'Does your board have Directors & Officers (D&O) liability insurance?', ref: '', opts: [
    { text: 'Yes, with adequate coverage limits', pts: 5 },
    { text: 'Yes, but coverage limits may be low', pts: 3 },
    { text: 'No D&O insurance', pts: 0 },
    { text: 'Not sure', pts: 0 },
  ]},
  { id: 13, cat: 'Reserve Funding', q: 'Is your HOA\'s reserve fund adequately funded according to your reserve study recommendations?', ref: '', opts: [
    { text: 'Yes, at or above recommended levels', pts: 5 },
    { text: 'Partially funded (50-80%)', pts: 2 },
    { text: 'Underfunded (less than 50%)', pts: 0 },
    { text: 'We don\'t have a reserve fund', pts: 0 },
    { text: 'Not sure', pts: 0 },
  ]},
  { id: 14, cat: 'Reserve Funding', q: 'When your board spends reserve funds, are the expenditures disclosed to members and tracked properly?', ref: '', opts: [
    { text: 'Yes, all reserve expenditures are disclosed', pts: 5 },
    { text: 'Sometimes, for major projects only', pts: 2 },
    { text: 'No, we don\'t specifically disclose reserve spending', pts: 0 },
    { text: 'Not sure', pts: 0 },
  ]},
  { id: 15, cat: 'Assessments', q: 'Does your board follow proper procedures when collecting delinquent assessments?', ref: 'Civil Code §5650-5730', opts: [
    { text: 'Yes, we follow pre-lien notice requirements', pts: 5 },
    { text: 'We send late notices but unsure about legal requirements', pts: 2 },
    { text: 'No formal collection process', pts: 0 },
    { text: 'We don\'t have delinquencies', pts: 5 },
  ]},
  { id: 16, cat: 'Assessments', q: 'Does your board offer payment plans to homeowners experiencing financial hardship?', ref: 'Civil Code §5665', opts: [
    { text: 'Yes, we have a payment plan policy', pts: 5 },
    { text: 'We handle it case-by-case', pts: 3 },
    { text: 'No, we don\'t offer payment plans', pts: 0 },
    { text: 'Not sure', pts: 0 },
  ]},
  { id: 17, cat: 'Safety Inspections', q: 'Has your HOA completed the required inspections of balconies, decks, and elevated structures?', ref: 'SB 326 / Civil Code §5551', opts: [
    { text: 'Yes, inspections completed and repairs scheduled', pts: 5 },
    { text: 'Inspections are in progress', pts: 3 },
    { text: 'No, inspections not done yet', pts: 0 },
    { text: 'N/A — No elevated structures', pts: -1 },
  ]},
  { id: 18, cat: 'Disclosures', q: 'Does your board send an annual policy statement to all members?', ref: 'Civil Code §5310', opts: [
    { text: 'Yes, every year', pts: 5 },
    { text: 'Sometimes, not consistently', pts: 2 },
    { text: 'No, we don\'t send annual policy statements', pts: 0 },
    { text: 'Not sure', pts: 0 },
  ]},
  { id: 19, cat: 'Elections', q: 'When your board holds elections, do you use secret ballots and appoint an independent inspector of elections?', ref: 'Civil Code §5100-5145', opts: [
    { text: 'Yes, we follow all election requirements', pts: 5 },
    { text: 'Secret ballots but unsure about inspector requirements', pts: 2 },
    { text: 'No formal election procedures', pts: 0 },
    { text: 'We haven\'t held elections recently', pts: 3 },
  ]},
  { id: 20, cat: 'Architectural Review', q: 'Does your board have a documented architectural review process (if your CC&Rs require it)?', ref: '', opts: [
    { text: 'Yes, written guidelines and formal process', pts: 5 },
    { text: 'Case-by-case without written guidelines', pts: 2 },
    { text: 'No formal process exists', pts: 0 },
    { text: 'N/A — CC&Rs don\'t require architectural review', pts: -1 },
  ]},
];

// State
let currentQ = -1;
const answers = {};
const STORAGE_KEY = 'bursar_audit';

// Restore saved progress
function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      Object.assign(answers, data.answers || {});
      return data.currentQ || 0;
    }
  } catch(e) {}
  return 0;
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentQ, answers }));
  } catch(e) {}
}

function clearProgress() {
  try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
}

// Initialize
function startAudit() {
  const savedQ = loadProgress();
  const hasProgress = Object.keys(answers).length > 0;

  document.getElementById('intro').classList.remove('active');
  document.getElementById('audit-main').style.display = 'block';
  document.getElementById('q-total').textContent = QUESTIONS.length;

  currentQ = hasProgress ? savedQ : 0;
  renderQuestion('forward');
}

function renderQuestion(direction) {
  const q = QUESTIONS[currentQ];
  document.getElementById('q-num').textContent = currentQ + 1;
  const pct = ((currentQ + 1) / QUESTIONS.length * 100);
  document.getElementById('progress-bar').style.width = pct + '%';
  document.getElementById('progress-cat').textContent = q.cat;

  const container = document.getElementById('questions');
  const slideClass = direction === 'forward' ? 'slide-in-right' : 'slide-in-left';

  container.innerHTML = `
    <div class="tf-question ${slideClass}">
      <div class="tf-meta">
        <span class="tf-cat">${q.cat}</span>
        <span class="tf-qnum">${currentQ + 1} of ${QUESTIONS.length}</span>
      </div>
      <h2 class="tf-title">${q.q}</h2>
      ${q.ref ? `<p class="tf-ref">${q.ref}</p>` : ''}
      <div class="tf-options">
        ${q.opts.map((o, i) => `
          <button class="tf-option ${answers[q.id] === i ? 'selected' : ''}"
                  onclick="selectOption(${q.id}, ${i})" data-idx="${i}">
            <span class="tf-key">${String.fromCharCode(65 + i)}</span>
            <span class="tf-option-text">${o.text}</span>
            <span class="tf-check">✓</span>
          </button>
        `).join('')}
      </div>
      <div class="tf-nav">
        <button class="tf-btn-back" onclick="prevQ()" ${currentQ === 0 ? 'style="visibility:hidden"' : ''}>
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 12L6 8l4-4"/></svg>
          Back
        </button>
        <button class="tf-btn-next" id="next-btn" onclick="nextQ()" ${answers[q.id] === undefined ? 'disabled' : ''}>
          ${currentQ === QUESTIONS.length - 1 ? 'See Results' : 'Next'}
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4l4 4-4 4"/></svg>
        </button>
      </div>
      <p class="tf-hint">Press <kbd>A</kbd>-<kbd>${String.fromCharCode(65 + q.opts.length - 1)}</kbd> to select, <kbd>Enter</kbd> to continue</p>
    </div>
  `;

  // Trigger animation
  requestAnimationFrame(() => {
    const el = container.querySelector('.tf-question');
    if (el) el.classList.add('visible');
  });

  saveProgress();
}

function selectOption(qId, optIdx) {
  answers[qId] = optIdx;
  document.querySelectorAll('.tf-option').forEach((el, i) => {
    el.classList.toggle('selected', i === optIdx);
  });
  document.getElementById('next-btn').disabled = false;

  // Auto-advance after short delay
  setTimeout(() => {
    if (currentQ < QUESTIONS.length - 1) nextQ();
  }, 400);
}

function prevQ() {
  if (currentQ > 0) { currentQ--; renderQuestion('back'); }
}

function nextQ() {
  if (answers[QUESTIONS[currentQ].id] === undefined) return;
  if (currentQ < QUESTIONS.length - 1) {
    currentQ++;
    renderQuestion('forward');
  } else {
    showEmailGate();
  }
}

function showEmailGate() {
  document.getElementById('questions').innerHTML = '';
  document.getElementById('progress-wrap').style.display = 'none';
  const gate = document.getElementById('email-gate');
  gate.classList.add('active');
  gate.querySelector('input[type="email"]').focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function calculateScore() {
  let earned = 0, possible = 0;
  const gaps = [];
  QUESTIONS.forEach(q => {
    const optIdx = answers[q.id];
    if (optIdx === undefined) return;
    const opt = q.opts[optIdx];
    if (opt.pts === -1) return;
    possible += 5;
    earned += opt.pts;
    if (opt.pts < 5) {
      gaps.push({ q: q.q, cat: q.cat, ref: q.ref, pts: opt.pts, answer: opt.text });
    }
  });
  const pct = possible > 0 ? Math.round((earned / possible) * 100) : 0;
  return { earned, possible, pct, gaps };
}

function showResults() {
  const email = document.getElementById('field-email').value;
  if (!email || !email.includes('@')) {
    document.getElementById('field-email').style.borderColor = '#e53e3e';
    document.getElementById('field-email').focus();
    return;
  }

  const info = {
    name: document.getElementById('field-name').value,
    email,
    role: document.getElementById('field-role').value,
    hoa: document.getElementById('field-hoa').value,
    city: document.getElementById('field-city').value,
  };

  const { earned, possible, pct, gaps } = calculateScore();
  const zone = pct >= 80 ? 'Green' : pct >= 50 ? 'Yellow' : 'Red';
  const utm = typeof getUTM === 'function' ? getUTM() : {};

  submitData('audit', {
    ...info, scorePct: pct, scoreEarned: earned, scorePossible: possible,
    zone, gapCount: gaps.length, answers, ...utm,
  });

  if (typeof gtag !== 'undefined') {
    gtag('event', 'compliance_audit_complete', {
      event_category: 'conversion', event_label: zone, value: pct,
    });
  }

  document.getElementById('email-gate').classList.remove('active');

  let zoneClass, headline, verdict, ctaText, ctaClass;
  if (pct >= 80) {
    zoneClass = 'zone-green';
    headline = 'Your Board Is In Good Shape';
    verdict = 'Congratulations! Your HOA board is meeting most Davis-Stirling Act compliance requirements. You\'re ahead of the majority of California HOAs.';
    ctaText = 'Stay Compliant with Bursar';
    ctaClass = 'cta-green';
  } else if (pct >= 50) {
    zoneClass = 'zone-yellow';
    headline = 'Your Board Has Compliance Gaps';
    verdict = 'Your board is meeting some requirements but has gaps that could lead to problems. You\'re not alone — most boards score in this range.';
    ctaText = 'Close Your Gaps with Bursar';
    ctaClass = 'cta-yellow';
  } else {
    zoneClass = 'zone-red';
    headline = 'Immediate Action Needed';
    verdict = 'Your board has significant compliance gaps that expose you to legal and financial risk. These need to be addressed urgently.';
    ctaText = 'Get Priority Access to Bursar';
    ctaClass = 'cta-red';
  }

  const gapHtml = gaps
    .sort((a, b) => a.pts - b.pts)
    .map(g => {
      const severity = g.pts === 0 ? 'critical' : 'moderate';
      return `<div class="gap-card gap-${severity}">
        <div class="gap-header">
          <span class="gap-severity">${severity === 'critical' ? '🔴 Critical' : '🟡 Moderate'}</span>
          <span class="gap-cat">${g.cat}</span>
        </div>
        <p class="gap-question">${g.q}</p>
        ${g.ref ? `<p class="gap-ref">${g.ref}</p>` : ''}
        <p class="gap-answer">Your answer: <em>${g.answer}</em></p>
      </div>`;
    }).join('');

  const results = document.getElementById('results');
  results.classList.add('active');
  results.innerHTML = `
    <div class="results-container">
      <div class="score-reveal ${zoneClass}">
        <div class="score-ring">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="8"/>
            <circle cx="60" cy="60" r="54" fill="none" stroke="#fff" stroke-width="8"
              stroke-dasharray="${Math.round(339.3 * pct / 100)} 339.3"
              stroke-linecap="round" transform="rotate(-90 60 60)"
              class="score-ring-fill"/>
          </svg>
          <div class="score-number">
            <span class="score-pct" data-target="${pct}">0</span>%
          </div>
        </div>
        <p class="score-detail">${earned} of ${possible} points</p>
      </div>

      <h2 class="results-headline">${headline}</h2>
      <p class="results-verdict">${verdict}</p>

      ${gaps.length > 0 ? `
        <div class="gaps-section">
          <h3 class="gaps-title">${gaps.length} Compliance Gap${gaps.length !== 1 ? 's' : ''} Found</h3>
          <div class="gaps-grid">${gapHtml}</div>
        </div>
      ` : '<p class="no-gaps">No compliance gaps detected. Keep up the great work!</p>'}

      <div class="results-actions">
        <button onclick="showPayment('${zone}', ${pct})" class="results-cta ${ctaClass}" style="border:none;cursor:pointer;">${ctaText}</button>
        <button class="results-share" onclick="shareResults(${pct}, '${zone}')">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v4h16v-4M12 3v10M8 7l4-4 4 4"/></svg>
          Share with Your Board
        </button>
      </div>

      <p class="results-email-note">We'll send your detailed results to <strong>${email}</strong></p>
    </div>
  `;

  // Animate score counter
  animateScore(pct);
  clearProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function animateScore(target) {
  const el = document.querySelector('.score-pct');
  if (!el) return;
  let current = 0;
  const step = Math.max(1, Math.floor(target / 40));
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 30);
}

function shareResults(pct, zone) {
  const text = `I just scored ${pct}% on the Bursar HOA Compliance Audit. How does your board stack up?`;
  const url = window.location.origin + '/bursar/audit/';
  if (navigator.share) {
    navigator.share({ title: 'HOA Compliance Audit Results', text, url });
  } else {
    navigator.clipboard.writeText(`${text}\n${url}`).then(() => {
      const btn = document.querySelector('.results-share');
      btn.textContent = '✓ Link copied!';
      setTimeout(() => { btn.innerHTML = '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v4h16v-4M12 3v10M8 7l4-4 4 4"/></svg> Share with Your Board'; }, 2000);
    });
  }
}

// Payment / Success Screen
function showPayment(zone, pct) {
  document.getElementById('results').classList.remove('active');
  const payment = document.getElementById('payment');
  payment.classList.add('active');

  const isRed = zone === 'Red';
  const isYellow = zone === 'Yellow';

  const planName = isRed ? 'Priority Compliance Package' : isYellow ? 'Compliance Accelerator' : 'Compliance Maintenance';
  const price = isRed ? '149' : isYellow ? '99' : '49';
  const tagline = isRed
    ? 'Your board scored ' + pct + '% — get back on track fast with priority onboarding.'
    : isYellow
    ? 'Close your compliance gaps before they become problems.'
    : 'Stay ahead with automated compliance monitoring.';

  const features = isRed ? [
    'Priority onboarding within 48 hours',
    'Full Davis-Stirling compliance remediation plan',
    'Document templates for every gap identified',
    'Dedicated compliance advisor for 90 days',
    'Automated compliance monitoring dashboard',
    'Board training session (1 hour)',
  ] : isYellow ? [
    'Onboarding within 1 week',
    'Targeted remediation plan for your gaps',
    'Document templates for gaps identified',
    'Compliance monitoring dashboard',
    'Email support for 60 days',
    'Quarterly compliance check-ins',
  ] : [
    'Automated compliance monitoring',
    'Annual compliance audit refresh',
    'Document template library access',
    'Email alerts for regulatory changes',
    'Community best practices newsletter',
  ];

  payment.innerHTML = `
    <div class="payment-container">
      <div class="payment-success-icon">🎯</div>
      <div class="payment-badge">Recommended for your score</div>
      <h2 class="payment-title">${planName}</h2>
      <p class="payment-sub">${tagline}</p>

      <div class="payment-card">
        <div class="payment-card-header">
          <span class="payment-card-title">${planName}</span>
          <span class="payment-card-price">$${price}<span>/mo</span></span>
        </div>
        <ul class="payment-features">
          ${features.map(f => '<li>' + f + '</li>').join('')}
        </ul>
      </div>

      <button class="payment-btn" onclick="handleCheckout('${zone}', ${price})">
        Get Started — $${price}/mo
      </button>
      <p class="payment-note">🔒 Secure checkout · Cancel anytime · 30-day money-back guarantee</p>
    </div>
  `;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleCheckout(zone, price) {
  // TODO: Connect Stripe Checkout here
  // For now, show a placeholder
  const btn = document.querySelector('.payment-btn');
  btn.textContent = '✓ Stripe checkout coming soon!';
  btn.disabled = true;
  btn.style.opacity = '0.6';

  if (typeof gtag !== 'undefined') {
    gtag('event', 'begin_checkout', {
      event_category: 'conversion', event_label: zone, value: price,
    });
  }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (currentQ < 0) return;
  if (document.getElementById('email-gate').classList.contains('active')) {
    if (e.key === 'Enter') { showResults(); e.preventDefault(); }
    return;
  }
  if (document.getElementById('results').classList.contains('active')) return;

  const q = QUESTIONS[currentQ];
  if (!q) return;

  // A-Z keys to select options
  const keyIdx = e.key.toUpperCase().charCodeAt(0) - 65;
  if (keyIdx >= 0 && keyIdx < q.opts.length && !e.ctrlKey && !e.metaKey) {
    selectOption(q.id, keyIdx);
    e.preventDefault();
    return;
  }

  if (e.key === 'Enter') { nextQ(); e.preventDefault(); }
  if (e.key === 'ArrowLeft' || e.key === 'Backspace') { prevQ(); e.preventDefault(); }
  if (e.key === 'ArrowRight') { nextQ(); e.preventDefault(); }
});
