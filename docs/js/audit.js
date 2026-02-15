// Bursar Compliance Audit — Question Engine
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

let currentQ = -1; // -1 = intro
const answers = {};

function startAudit() {
  document.getElementById('intro').classList.remove('active');
  document.getElementById('progress-wrap').style.display = 'block';
  document.getElementById('q-total').textContent = QUESTIONS.length;
  currentQ = 0;
  renderQuestion();
}

function renderQuestion() {
  const q = QUESTIONS[currentQ];
  document.getElementById('q-num').textContent = currentQ + 1;
  document.getElementById('progress-bar').style.width = ((currentQ + 1) / QUESTIONS.length * 100) + '%';

  const container = document.getElementById('questions');
  container.innerHTML = `
    <div class="question active">
      <div class="category">${q.cat}</div>
      <h2>${q.q}</h2>
      ${q.ref ? `<div class="ref">${q.ref}</div>` : ''}
      <div class="options">
        ${q.opts.map((o, i) => `
          <div class="option ${answers[q.id] === i ? 'selected' : ''}" onclick="selectOption(${q.id}, ${i})">
            <div class="dot"></div>
            <span>${o.text}</span>
          </div>
        `).join('')}
      </div>
      <div class="q-nav">
        <button class="btn btn-back" onclick="prevQ()" ${currentQ === 0 ? 'style="visibility:hidden"' : ''}>← Back</button>
        <button class="btn btn-next" id="next-btn" onclick="nextQ()" ${answers[q.id] === undefined ? 'disabled' : ''}>${currentQ === QUESTIONS.length - 1 ? 'See Results' : 'Next →'}</button>
      </div>
    </div>
  `;
}

function selectOption(qId, optIdx) {
  answers[qId] = optIdx;
  document.querySelectorAll('.option').forEach((el, i) => {
    el.classList.toggle('selected', i === optIdx);
  });
  document.getElementById('next-btn').disabled = false;
}

function prevQ() {
  if (currentQ > 0) { currentQ--; renderQuestion(); }
}

function nextQ() {
  if (answers[QUESTIONS[currentQ].id] === undefined) return;
  if (currentQ < QUESTIONS.length - 1) {
    currentQ++;
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    // Show email gate
    document.getElementById('questions').innerHTML = '';
    document.getElementById('progress-wrap').style.display = 'none';
    document.getElementById('email-gate').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function calculateScore() {
  let earned = 0, possible = 0;
  const gaps = [];
  QUESTIONS.forEach(q => {
    const optIdx = answers[q.id];
    if (optIdx === undefined) return;
    const opt = q.opts[optIdx];
    if (opt.pts === -1) return; // N/A
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
  if (!email) { document.getElementById('field-email').style.borderColor = '#e53e3e'; return; }

  const info = {
    name: document.getElementById('field-name').value,
    email,
    role: document.getElementById('field-role').value,
    hoa: document.getElementById('field-hoa').value,
    city: document.getElementById('field-city').value,
  };

  // Log submission (replace with real endpoint)
  console.log('Audit submission:', { ...info, answers, score: calculateScore() });

  // Track conversion
  if (typeof gtag !== 'undefined') {
    gtag('event', 'compliance_audit_complete', {
      event_category: 'conversion',
      event_label: 'audit',
      value: 1,
    });
  }

  document.getElementById('email-gate').classList.remove('active');
  const { earned, possible, pct, gaps } = calculateScore();

  let zone, zoneClass, headline, verdict;
  if (pct >= 80) {
    zone = 'Green'; zoneClass = 'score-green';
    headline = '✅ Your Board Is In Good Shape';
    verdict = 'Congratulations! Your HOA board is meeting most Davis-Stirling Act compliance requirements. You\'re ahead of the majority of California HOAs.';
  } else if (pct >= 50) {
    zone = 'Yellow'; zoneClass = 'score-yellow';
    headline = '⚠️ Your Board Has Compliance Gaps';
    verdict = 'Your board is meeting some requirements but has gaps that could lead to problems. You\'re not alone — most boards score in this range.';
  } else {
    zone = 'Red'; zoneClass = 'score-red';
    headline = '🚨 Immediate Action Needed';
    verdict = 'Your board has significant compliance gaps that expose you to legal and financial risk. These need to be addressed urgently.';
  }

  const gapHtml = gaps
    .sort((a, b) => a.pts - b.pts)
    .map(g => {
      const cls = g.pts === 0 ? 'gap-red' : 'gap-yellow';
      return `<div class="gap-item ${cls}">
        <div><div class="gap-label">${g.cat}${g.ref ? ' — ' + g.ref : ''}</div>
        <div class="gap-text">${g.q}</div>
        <div class="gap-text" style="margin-top:4px;"><em>Your answer: ${g.answer}</em></div></div>
      </div>`;
    }).join('');

  document.getElementById('results').classList.add('active');
  document.getElementById('results').innerHTML = `
    <div class="score-circle ${zoneClass}">
      ${pct}%
      <div class="label">${earned}/${possible} pts</div>
    </div>
    <h2>${headline}</h2>
    <p class="verdict">${verdict}</p>
    ${gaps.length > 0 ? `
      <h3 style="font-size:1.1rem;color:var(--primary);margin-bottom:16px;">Your Compliance Gaps (${gaps.length})</h3>
      <div class="gap-list">${gapHtml}</div>
    ` : ''}
    <div class="results-cta">
      <a href="/bursar/#waitlist" class="btn btn-next" style="text-decoration:none;display:inline-block;">Join the Bursar Waitlist</a>
      <p style="font-size:0.85rem;color:var(--text-muted);margin-top:12px;">We'll email your detailed results to ${email}</p>
    </div>
  `;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
