/**
 * Bursar Data Submission Layer
 * Sends form data to Google Apps Script web app endpoint.
 * 
 * SETUP: Deploy a Google Apps Script with doPost() that writes to Sheets.
 * Set BURSAR_SUBMIT_URL below after deploying.
 */

// Google Apps Script Web App URL — set after deploying
const BURSAR_SUBMIT_URL = '';

async function submitData(type, data) {
  if (!BURSAR_SUBMIT_URL) {
    console.log(`[${type}] Would submit:`, data);
    return { ok: true, mock: true };
  }

  try {
    const res = await fetch(BURSAR_SUBMIT_URL, {
      method: 'POST',
      mode: 'no-cors', // Apps Script doesn't support CORS preflight
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, ...data, timestamp: new Date().toISOString() }),
    });
    return { ok: true };
  } catch (e) {
    console.error('Submit error:', e);
    return { ok: false, error: e.message };
  }
}

// Get UTM params from URL
function getUTM() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
  };
}
