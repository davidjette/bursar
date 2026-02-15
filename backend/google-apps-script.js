/**
 * Bursar — Google Apps Script Backend
 * Handles: form submissions, drip email scheduling, email sending
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com and create a new project
 * 2. Paste this entire file into Code.gs
 * 3. Update the config constants below with your IDs
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the deployment URL
 * 6. Paste it into docs/js/submit.js as BURSAR_SUBMIT_URL
 * 7. Run setupTriggers() once from the script editor to enable drip emails
 * 
 * SHEETS SETUP:
 * Create two Google Sheets:
 * 1. "Bursar — Waitlist Signups" with headers (Row 1):
 *    Timestamp | Email | Source Page | Variant | UTM Source | UTM Medium | UTM Campaign
 * 
 * 2. "Bursar — Audit Submissions" with headers (Row 1):
 *    Timestamp | Name | Email | Role | HOA Name | City | Score % | Score Earned | Score Possible | Zone | Gap Count | Answers JSON | Email 1 Sent | Email 2 Sent | Email 3 Sent
 * 
 * EMAIL SETUP (optional — for drip campaign):
 * - Uses Gmail's built-in MailApp (no external service needed!)
 * - Gmail limit: 100 emails/day for free accounts, 1500 for Workspace
 * - Set SEND_EMAILS = true below to enable
 * - Or set RESEND_API_KEY if you prefer Resend (higher limits)
 */

// ⚠️ REPLACE THESE
const WAITLIST_SHEET_ID = 'YOUR_WAITLIST_SHEET_ID_HERE';
const AUDIT_SHEET_ID = 'YOUR_AUDIT_SHEET_ID_HERE';

// Email config
const SEND_EMAILS = false; // Set true to enable drip emails
const FROM_NAME = 'Bursar';
const RESEND_API_KEY = ''; // Optional: leave empty to use Gmail MailApp

// ============ WEB ENDPOINTS ============

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.type === 'waitlist') {
      recordWaitlist(data);
    } else if (data.type === 'audit') {
      recordAudit(data);
      if (SEND_EMAILS) sendEmail1(data);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', service: 'Bursar Data Collection' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============ DATA RECORDING ============

function recordWaitlist(data) {
  const sheet = SpreadsheetApp.openById(WAITLIST_SHEET_ID).getActiveSheet();
  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.email || '',
    data.sourcePage || '',
    data.variant || '',
    data.utm_source || '',
    data.utm_medium || '',
    data.utm_campaign || '',
  ]);
}

function recordAudit(data) {
  const sheet = SpreadsheetApp.openById(AUDIT_SHEET_ID).getActiveSheet();
  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.name || '',
    data.email || '',
    data.role || '',
    data.hoa || '',
    data.city || '',
    data.scorePct || 0,
    data.scoreEarned || 0,
    data.scorePossible || 0,
    data.zone || '',
    data.gapCount || 0,
    JSON.stringify(data.answers || {}),
    '', // Email 1 Sent
    '', // Email 2 Sent
    '', // Email 3 Sent
  ]);
}

// ============ DRIP EMAIL ENGINE ============

/**
 * Run once from script editor: sets up time-based triggers for drip emails.
 * Menu: Run → setupTriggers
 */
function setupTriggers() {
  // Delete existing triggers to avoid duplicates
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  
  // Check every hour for pending drip emails
  ScriptApp.newTrigger('processDripEmails')
    .timeBased()
    .everyHours(1)
    .create();
  
  Logger.log('Drip email trigger created (hourly)');
}

/**
 * Hourly trigger: sends Email 2 (day 3) and Email 3 (day 7) to eligible leads.
 */
function processDripEmails() {
  if (!SEND_EMAILS) return;
  
  const sheet = SpreadsheetApp.openById(AUDIT_SHEET_ID).getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const now = new Date();
  
  // Column indices (0-based)
  const COL_TIMESTAMP = 0;
  const COL_NAME = 1;
  const COL_EMAIL = 2;
  const COL_SCORE = 6;
  const COL_ZONE = 9;
  const COL_GAPS = 10;
  const COL_EMAIL1 = 12;
  const COL_EMAIL2 = 13;
  const COL_EMAIL3 = 14;
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const submitted = new Date(row[COL_TIMESTAMP]);
    const email = row[COL_EMAIL];
    if (!email) continue;
    
    const daysSince = (now - submitted) / (1000 * 60 * 60 * 24);
    const lead = {
      name: row[COL_NAME] || 'there',
      email: email,
      score: row[COL_SCORE],
      zone: row[COL_ZONE],
      gapCount: row[COL_GAPS],
    };
    
    // Email 2: send after 3 days
    if (daysSince >= 3 && !row[COL_EMAIL2]) {
      sendEmail2(lead);
      sheet.getRange(i + 1, COL_EMAIL2 + 1).setValue(new Date().toISOString());
    }
    
    // Email 3: send after 7 days
    if (daysSince >= 7 && !row[COL_EMAIL3]) {
      sendEmail3(lead);
      sheet.getRange(i + 1, COL_EMAIL3 + 1).setValue(new Date().toISOString());
    }
  }
}

// ============ EMAIL TEMPLATES ============

function sendEmail1(data) {
  const name = data.name || 'there';
  const zone = (data.zone || 'Yellow').toLowerCase();
  const score = data.scorePct || 0;
  
  let headline, color, verdict;
  if (zone === 'green') {
    headline = '✅ Your Board Is In Good Shape'; color = '#059669';
    verdict = "Congratulations! Your HOA board is meeting most Davis-Stirling Act compliance requirements.";
  } else if (zone === 'red') {
    headline = '🚨 Immediate Action Needed'; color = '#dc2626';
    verdict = "Your board has significant compliance gaps that expose you to legal and financial risk.";
  } else {
    headline = '⚠️ Your Board Has Compliance Gaps'; color = '#d97706';
    verdict = "Your board is meeting some requirements but has gaps that could lead to problems.";
  }
  
  const subject = `Your HOA Compliance Score: ${score}% — ${zone === 'green' ? 'Looking Good' : zone === 'red' ? 'Action Needed' : 'Gaps Found'}`;
  const html = buildEmailShell(`
    <h1 style="color:#0f172a;font-size:24px;margin:0 0 16px;">Hi ${name},</h1>
    <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px;">Thanks for completing the Davis-Stirling Compliance Audit. Here are your results:</p>
    <div style="background:${color};border-radius:12px;padding:32px;text-align:center;margin:0 0 24px;">
      <div style="font-size:48px;font-weight:800;color:#fff;">${score}%</div>
      <div style="color:rgba(255,255,255,0.9);font-size:14px;margin-top:4px;">${headline}</div>
    </div>
    <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px;">${verdict}</p>
    <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px;">We'll send you specific guidance on your compliance gaps in a few days.</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="https://davidjette.github.io/bursar/#waitlist" style="background:#2563eb;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;">Join the Bursar Waitlist</a>
    </div>
  `);
  
  sendMail(data.email, subject, html);
  
  // Mark as sent in sheet
  try {
    const sheet = SpreadsheetApp.openById(AUDIT_SHEET_ID).getActiveSheet();
    const data_all = sheet.getDataRange().getValues();
    for (let i = 1; i < data_all.length; i++) {
      if (data_all[i][2] === data.email && !data_all[i][12]) {
        sheet.getRange(i + 1, 13).setValue(new Date().toISOString());
        break;
      }
    }
  } catch(e) {}
}

function sendEmail2(lead) {
  const subject = `The ${lead.gapCount || 3} compliance gaps we see most often`;
  const html = buildEmailShell(`
    <h1 style="color:#0f172a;font-size:24px;margin:0 0 16px;">Hi ${lead.name},</h1>
    <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px;">After reviewing compliance audits from dozens of California HOA boards, here are the most common gaps we see:</p>
    <div style="background:#fef2f2;border-left:4px solid #dc2626;padding:16px 20px;border-radius:0 8px 8px 0;margin:0 0 12px;">
      <strong style="color:#0f172a;">1. Late or Missing Budget Disclosures (65% of boards)</strong>
      <p style="color:#475569;font-size:14px;margin:8px 0 0;">Required 45-60 days before fiscal year. Penalty: $500+ per violation.</p>
    </div>
    <div style="background:#fffbeb;border-left:4px solid #d97706;padding:16px 20px;border-radius:0 8px 8px 0;margin:0 0 12px;">
      <strong style="color:#0f172a;">2. Outdated Reserve Studies (58% of boards)</strong>
      <p style="color:#475569;font-size:14px;margin:8px 0 0;">Must be updated every 3 years. Leads to underfunding and special assessments.</p>
    </div>
    <div style="background:#fffbeb;border-left:4px solid #d97706;padding:16px 20px;border-radius:0 8px 8px 0;margin:0 0 24px;">
      <strong style="color:#0f172a;">3. Informal Meeting Procedures (47% of boards)</strong>
      <p style="color:#475569;font-size:14px;margin:8px 0 0;">Missing notices, no open forum, no minutes = voidable decisions.</p>
    </div>
    <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px;">Your audit showed <strong>${lead.gapCount || 'several'} gaps</strong>. Focus on the areas where you scored 0 points first — those carry the highest risk.</p>
    <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px;">Read more on our blog:</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="https://davidjette.github.io/bursar/blog/" style="background:#2563eb;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;">Read Compliance Guides</a>
    </div>
  `);
  
  sendMail(lead.email, subject, html);
}

function sendEmail3(lead) {
  const subject = 'What if compliance tracking was automatic?';
  const html = buildEmailShell(`
    <h1 style="color:#0f172a;font-size:24px;margin:0 0 16px;">Hi ${lead.name},</h1>
    <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px;">You completed our compliance audit last week, and I want to share what we're building for boards like yours.</p>
    <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 8px;"><strong>The problem:</strong> Volunteer board members juggle full-time jobs, families, and HOA responsibilities. Tracking every Davis-Stirling deadline is overwhelming.</p>
    <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px;"><strong>What we're building:</strong> Bursar automates compliance tracking so you never miss a deadline:</p>
    <div style="margin:0 0 24px;">
      <p style="color:#0f172a;font-size:15px;margin:0 0 8px;">✅ <strong>Compliance Calendar</strong> — Every Davis-Stirling deadline tracked automatically</p>
      <p style="color:#0f172a;font-size:15px;margin:0 0 8px;">✅ <strong>Auto-Generated Disclosures</strong> — Budget disclosures and policy statements from your data</p>
      <p style="color:#0f172a;font-size:15px;margin:0 0 8px;">✅ <strong>Document Vault</strong> — All records in one searchable place</p>
      <p style="color:#0f172a;font-size:15px;margin:0 0 8px;">✅ <strong>Meeting Intelligence</strong> — Agendas, minutes, and notices automated</p>
      <p style="color:#0f172a;font-size:15px;margin:0 0 8px;">✅ <strong>Invoice Approval</strong> — Two-signer authorization with fraud detection</p>
    </div>
    <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px;">Your score was <strong>${lead.score}%</strong>. Bursar would close ${lead.gapCount || 'your'} compliance gaps automatically.</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="https://davidjette.github.io/bursar/#waitlist" style="background:#2563eb;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;">Join the Waitlist — Early Access</a>
    </div>
    <p style="color:#94a3b8;font-size:14px;margin:24px 0 0;">P.S. — We're offering free CPA-led compliance reviews for the first 10 boards who sign up. Just reply to this email if you're interested.</p>
  `);
  
  sendMail(lead.email, subject, html);
}

// ============ EMAIL INFRASTRUCTURE ============

function buildEmailShell(body) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
<tr><td style="padding:32px 40px 0;">
  <div style="font-size:20px;font-weight:700;color:#0f172a;margin-bottom:24px;">Bursar</div>
</td></tr>
<tr><td style="padding:0 40px 32px;">
  ${body}
</td></tr>
<tr><td style="padding:24px 40px;border-top:1px solid #e2e8f0;">
  <p style="color:#94a3b8;font-size:12px;margin:0;text-align:center;">
    © 2026 Bursar · Purpose-built for California HOA boards<br>
    <a href="{{unsubscribe_url}}" style="color:#94a3b8;">Unsubscribe</a>
  </p>
</td></tr>
</table>
</td></tr></table></body></html>`;
}

function sendMail(to, subject, htmlBody) {
  if (RESEND_API_KEY) {
    // Use Resend API
    UrlFetchApp.fetch('https://api.resend.com/emails', {
      method: 'POST',
      contentType: 'application/json',
      headers: { 'Authorization': 'Bearer ' + RESEND_API_KEY },
      payload: JSON.stringify({
        from: FROM_NAME + ' <onboarding@resend.dev>',
        to: [to],
        subject: subject,
        html: htmlBody,
      }),
    });
  } else {
    // Use Gmail MailApp (simplest — no setup needed)
    MailApp.sendEmail({
      to: to,
      subject: subject,
      htmlBody: htmlBody,
      name: FROM_NAME,
    });
  }
}
