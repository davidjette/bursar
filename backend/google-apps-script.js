/**
 * Bursar — Google Apps Script Backend
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com and create a new project
 * 2. Paste this entire file into Code.gs
 * 3. Update WAITLIST_SHEET_ID and AUDIT_SHEET_ID with your Google Sheet IDs
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the deployment URL
 * 6. Paste it into docs/js/submit.js as BURSAR_SUBMIT_URL
 * 7. Commit and push to deploy
 * 
 * SHEETS SETUP:
 * Create two Google Sheets:
 * 1. "Bursar — Waitlist Signups" with headers:
 *    Timestamp | Email | Source Page | Variant | UTM Source | UTM Medium | UTM Campaign
 * 
 * 2. "Bursar — Audit Submissions" with headers:
 *    Timestamp | Name | Email | Role | HOA Name | City | Score % | Score Earned | Score Possible | Zone | Gap Count | Answers JSON
 */

// ⚠️ REPLACE THESE with your actual Google Sheet IDs
const WAITLIST_SHEET_ID = 'YOUR_WAITLIST_SHEET_ID_HERE';
const AUDIT_SHEET_ID = 'YOUR_AUDIT_SHEET_ID_HERE';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.type === 'waitlist') {
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
    } else if (data.type === 'audit') {
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
      ]);
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
