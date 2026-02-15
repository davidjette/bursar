# Bursar GA4 Tracking Implementation

## Overview
Complete GA4 event tracking for the Bursar compliance audit funnel, including e-commerce events for Stripe checkout conversion tracking.

---

## 1. Email Gate Submit Event

**Trigger:** When user submits email to see audit results

**File:** `docs/js/submit.js` (in `handleEmailSubmit()` function)

**Add after successful email submission:**

```javascript
// After email is successfully submitted and before showing results
gtag('event', 'email_gate_submit', {
  zone: zone,                    // 'Red', 'Yellow', or 'Green'
  score_pct: scorePercentage,    // e.g. 45
  gap_count: gapCount,           // e.g. 12
  email_domain: emailDomain      // e.g. 'gmail.com' (for analysis)
});
```

**Implementation Location:**
```javascript
function handleEmailSubmit() {
  // ... existing email validation ...
  
  // Submit to backend
  submitAuditData(email, name, answers)
    .then(response => {
      // NEW: Fire GA4 event
      const emailDomain = email.split('@')[1];
      gtag('event', 'email_gate_submit', {
        zone: zone,
        score_pct: scorePercentage,
        gap_count: gapCount,
        email_domain: emailDomain
      });
      
      // Then show results
      showResults();
    });
}
```

---

## 2. View Results Event

**Trigger:** When results page loads and user sees their score/zone

**File:** `docs/js/audit.js` (in `showResults()` function)

**Add when results are displayed:**

```javascript
// After results are rendered on screen
gtag('event', 'view_results', {
  zone: zone,                    // 'Red', 'Yellow', or 'Green'
  score_pct: scorePercentage,    // e.g. 45
  gap_count: gapCount,           // e.g. 12
  plan_price: planPrice,         // 149, 99, or 49
  result_time_seconds: Math.round((Date.now() - auditStartTime) / 1000)
});
```

**Implementation Location:**
```javascript
function showResults() {
  // ... existing results rendering ...
  
  // Calculate metrics
  const zone = getZone(scorePercentage);
  const gapCount = gaps.length;
  const planPrice = getPlanPrice(zone);
  
  // Render results UI
  document.getElementById('results-section').classList.remove('hidden');
  
  // NEW: Fire GA4 event after results are visible
  gtag('event', 'view_results', {
    zone: zone,
    score_pct: scorePercentage,
    gap_count: gapCount,
    plan_price: planPrice,
    result_time_seconds: Math.round((Date.now() - auditStartTime) / 1000)
  });
}
```

---

## 3. Purchase Event (E-commerce)

**Trigger:** On Stripe checkout success page load

**File:** `docs/audit/success/index.html` (new file)

**Add to page `<script>` section:**

```javascript
<script>
// Extract session data from URL or localStorage
const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('session_id');

// Retrieve audit data from localStorage (stored during audit)
const auditData = JSON.parse(localStorage.getItem('bursar_audit_data') || '{}');
const zone = auditData.zone;
const scorePercentage = auditData.score_pct;
const gapCount = auditData.gap_count;
const planPrice = auditData.plan_price;
const planName = getPlanName(zone);

// Fire GA4 purchase event
if (sessionId && zone) {
  gtag('event', 'purchase', {
    transaction_id: sessionId,
    value: planPrice,
    currency: 'USD',
    items: [{
      item_id: zone.toLowerCase() + '_plan',     // 'red_plan', 'yellow_plan', 'green_plan'
      item_name: planName,                       // 'Priority Compliance Package', etc.
      item_category: 'Compliance Software',
      price: planPrice,
      quantity: 1
    }],
    // Custom dimensions
    zone: zone,
    score_pct: scorePercentage,
    gap_count: gapCount,
    plan_price: planPrice
  });
}

// Helper function
function getPlanName(zone) {
  const plans = {
    'Red': 'Priority Compliance Package',
    'Yellow': 'Compliance Accelerator',
    'Green': 'Compliance Maintenance'
  };
  return plans[zone] || 'Unknown Plan';
}
</script>
```

---

## 4. Store Audit Data for Success Page

**Required:** Store audit data in localStorage so success page can access it

**File:** `docs/js/audit.js` (in `showResults()` or when payment CTA is clicked)

**Add before redirecting to Stripe:**

```javascript
function handleCheckout() {
  // Store audit data for success page
  const auditData = {
    zone: zone,
    score_pct: scorePercentage,
    gap_count: gapCount,
    plan_price: planPrice,
    timestamp: Date.now()
  };
  localStorage.setItem('bursar_audit_data', JSON.stringify(auditData));
  
  // Existing: Fire begin_checkout event
  gtag('event', 'begin_checkout', {
    zone: zone,
    plan_price: planPrice
  });
  
  // Redirect to Stripe (existing code continues)
  // ...
}
```

---

## 5. GA4 Custom Dimensions Configuration

**Required:** Create these custom dimensions in GA4 Admin

Navigate to: **GA4 Property → Configure → Custom Definitions → Create custom dimension**

| Display Name | Dimension Name (parameter) | Scope | Description |
|---|---|---|---|
| Zone | zone | Event | Compliance zone (Red/Yellow/Green) |
| Score Percentage | score_pct | Event | Audit score 0-100 |
| Gap Count | gap_count | Event | Number of compliance gaps |
| Plan Price | plan_price | Event | Monthly plan price |
| Email Domain | email_domain | Event | Email domain for segmentation |
| Result Time | result_time_seconds | Event | Time to complete audit |

**Steps:**
1. Admin → Custom definitions → Create custom dimension
2. Fill in Display Name, Dimension Name, Scope (Event), Description
3. Save
4. Repeat for all 6 dimensions

**Note:** Dimensions won't show data until events with those parameters start firing.

---

## 6. UTM Parameter Structure

**For all ad traffic:** Use these UTM parameters consistently

**Format:**
```
/bursar/audit/?utm_source={source}&utm_medium={medium}&utm_campaign={campaign}&utm_content={variant}
```

**Examples:**

**Google Ads:**
```
utm_source=google
utm_medium=cpc
utm_campaign=compliance-ca
utm_content=variant-a
```

**Facebook/Instagram:**
```
utm_source=facebook
utm_medium=paid-social
utm_campaign=invoice-pain
utm_content=variant-b
```

**LinkedIn:**
```
utm_source=linkedin
utm_medium=paid-social
utm_campaign=board-tools
utm_content=variant-c
```

**Organic/Email:**
```
utm_source=email
utm_medium=newsletter
utm_campaign=launch-announcement
```

**Implementation:** UTMs are automatically captured by GA4 as traffic source dimensions.

---

## 7. Testing Events (DebugView)

**Enable GA4 DebugView:**

**Option A: Browser Extension**
1. Install "GA Debugger" Chrome extension
2. Click extension icon to enable
3. Refresh page

**Option B: URL Parameter**
Add `?debug_mode=true` to URL: `/bursar/audit/?debug_mode=true`

**Option C: localStorage**
```javascript
localStorage.setItem('ga_debug', '1');
```

**View Events:**
1. GA4 → Configure → DebugView
2. Select your device/browser session
3. Watch events fire in real-time as you go through funnel

---

## 8. Verification Checklist

Before launch, verify each event fires with correct parameters:

**Email Gate Submit:**
- [ ] Event name: `email_gate_submit`
- [ ] Parameter `zone` = Red/Yellow/Green
- [ ] Parameter `score_pct` = numeric 0-100
- [ ] Parameter `gap_count` = numeric
- [ ] Parameter `email_domain` = string

**View Results:**
- [ ] Event name: `view_results`
- [ ] Parameter `zone` = Red/Yellow/Green
- [ ] Parameter `score_pct` = numeric
- [ ] Parameter `gap_count` = numeric
- [ ] Parameter `plan_price` = 149/99/49
- [ ] Parameter `result_time_seconds` = numeric

**Begin Checkout:**
- [ ] Event name: `begin_checkout` (already implemented)
- [ ] Parameter `zone` = Red/Yellow/Green
- [ ] Parameter `plan_price` = 149/99/49

**Purchase:**
- [ ] Event name: `purchase`
- [ ] Parameter `transaction_id` = Stripe session ID
- [ ] Parameter `value` = numeric price
- [ ] Parameter `currency` = USD
- [ ] Parameter `items` = array with item object
- [ ] Parameter `zone` = Red/Yellow/Green
- [ ] Parameter `score_pct` = numeric
- [ ] Parameter `gap_count` = numeric

---

## 9. Implementation Order

1. **Add localStorage storage** (audit.js) — stores data for success page
2. **Add email_gate_submit** (submit.js) — fires after email submission
3. **Add view_results** (audit.js) — fires when results load
4. **Test with DebugView** — verify all 3 events firing correctly
5. **Create custom dimensions in GA4** — enable data collection
6. **Create success page** (success/index.html) — after Stripe integration
7. **Add purchase event** (success/index.html) — fires on success page load
8. **Test end-to-end** with Stripe test mode

---

## 10. Expected Timeline

| Task | Owner | Time | Status |
|---|---|---|---|
| Draft tracking code | Ed | 1 hour | ✅ Done |
| Review tracking plan | Dave | 15 min | Pending |
| Implement events 1-3 | Dev | 1 hour | Pending |
| Create custom dimensions | Ed/Dave | 15 min | Pending |
| Test with DebugView | Dev | 30 min | Pending |
| Stripe integration | Dev | 2-3 hours | Pending |
| Create success page | Dev | 1 hour | Pending |
| Implement purchase event | Dev | 30 min | Pending |
| End-to-end test | Dev + Ed | 30 min | Pending |

**Total:** ~7 hours dev work + Stripe integration

**Unblocks:** Task 0.1 → March 3 ad campaign launch

---

## 11. Post-Launch Monitoring

**Week 1:** Check daily via GA4 DebugView
- Verify events firing consistently
- Check for data quality issues
- Confirm custom dimensions populating

**Week 2:** Build funnel report (see separate doc)
- Measure drop-off at each stage
- Analyze by zone, traffic source
- Calculate CPA by platform

**Week 3+:** Optimize based on data
- Shift budget to best-converting zones
- A/B test landing page variants
- Refine ad copy based on zone performance
