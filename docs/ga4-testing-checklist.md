# GA4 Tracking Implementation - Testing Checklist

## Pre-Implementation

- [ ] **Read tracking implementation doc** (`ga4-tracking-code.md`)
- [ ] **Confirm GA4 property ID** is correct in gtag config
- [ ] **Enable DebugView** (add `?debug_mode=true` to URL or use GA Debugger extension)
- [ ] **Open GA4 DebugView** in separate tab (GA4 → Configure → DebugView)

---

## Phase 1: LocalStorage Setup (audit.js)

**Goal:** Store audit data for success page retrieval

### Implementation
- [ ] Add `localStorage.setItem()` in `handleCheckout()` function
- [ ] Store: zone, score_pct, gap_count, plan_price, timestamp

### Test
- [ ] Complete audit through to payment screen
- [ ] Open browser DevTools → Application → Local Storage
- [ ] Verify `bursar_audit_data` exists with correct JSON:
  ```json
  {
    "zone": "Red",
    "score_pct": 45,
    "gap_count": 12,
    "plan_price": 149,
    "timestamp": 1708051234567
  }
  ```
- [ ] Try all 3 zones (Red, Yellow, Green) to verify dynamic values

---

## Phase 2: Email Gate Submit Event (submit.js)

**Goal:** Track when user submits email to see results

### Implementation
- [ ] Add `gtag('event', 'email_gate_submit', {...})` after successful email submission
- [ ] Include parameters: zone, score_pct, gap_count, email_domain

### Test - Happy Path
- [ ] Complete audit, click "See Results"
- [ ] Enter valid email (e.g., `test@example.com`)
- [ ] Submit form
- [ ] **Check DebugView:** Look for `email_gate_submit` event (within 1-2 seconds)
- [ ] **Verify parameters:**
  - `zone` = "Red" (or Yellow/Green)
  - `score_pct` = numeric (e.g., 45)
  - `gap_count` = numeric (e.g., 12)
  - `email_domain` = "example.com"

### Test - Edge Cases
- [ ] Test with Gmail address → `email_domain` = "gmail.com"
- [ ] Test with corporate email → `email_domain` = "company.com"
- [ ] Test Red zone (< 50%) → verify `zone` = "Red", `plan_price` = 149
- [ ] Test Yellow zone (50-79%) → verify `zone` = "Yellow", `plan_price` = 99
- [ ] Test Green zone (80%+) → verify `zone` = "Green", `plan_price` = 49

### Troubleshooting
- [ ] If event doesn't fire: Check browser console for JS errors
- [ ] If wrong parameters: Verify zone/score calculation logic
- [ ] If event fires twice: Check for duplicate gtag calls

---

## Phase 3: View Results Event (audit.js)

**Goal:** Track when results page is shown to user

### Implementation
- [ ] Add `gtag('event', 'view_results', {...})` in `showResults()` function
- [ ] Include parameters: zone, score_pct, gap_count, plan_price, result_time_seconds
- [ ] Fire AFTER results are rendered (DOM updated)

### Test - Happy Path
- [ ] Complete audit + email gate
- [ ] Wait for results to load
- [ ] **Check DebugView:** Look for `view_results` event
- [ ] **Verify parameters:**
  - `zone` = correct zone
  - `score_pct` = matches displayed score
  - `gap_count` = matches number of red/yellow items
  - `plan_price` = matches CTA button price
  - `result_time_seconds` = reasonable (30-300 seconds)

### Test - Timing
- [ ] Complete audit slowly (2+ minutes) → verify `result_time_seconds` > 120
- [ ] Complete audit quickly (< 1 minute) → verify `result_time_seconds` < 60

### Test - Multiple Zones
- [ ] Red zone audit → verify `plan_price` = 149
- [ ] Yellow zone audit → verify `plan_price` = 99
- [ ] Green zone audit → verify `plan_price` = 49

### Troubleshooting
- [ ] If event fires before results visible: Move gtag call to end of showResults()
- [ ] If result_time_seconds = 0: Verify auditStartTime is set when audit begins
- [ ] If plan_price wrong: Check getPlanPrice() logic

---

## Phase 4: Begin Checkout Event (audit.js)

**Goal:** Track when user clicks payment CTA

**Note:** This should already be implemented per Dave's message, but verify it's correct.

### Test
- [ ] View results page
- [ ] Click "Get Started" / payment CTA
- [ ] **Check DebugView:** Look for `begin_checkout` event
- [ ] **Verify parameters:**
  - `zone` = correct zone
  - `plan_price` = matches button

### Troubleshooting
- [ ] If missing: Add gtag call before Stripe redirect
- [ ] If fires twice: Check for duplicate event listeners

---

## Phase 5: GA4 Custom Dimensions Setup

**Goal:** Enable custom dimension data collection

### Implementation (in GA4 Admin)
- [ ] Navigate to Admin → Data display → Custom definitions
- [ ] Click "Create custom dimension"
- [ ] Create 6 dimensions (see table below)

| Display Name | Dimension Name | Scope | Description |
|---|---|---|---|
| Zone | zone | Event | Compliance zone (Red/Yellow/Green) |
| Score Percentage | score_pct | Event | Audit score 0-100 |
| Gap Count | gap_count | Event | Number of compliance gaps |
| Plan Price | plan_price | Event | Monthly plan price |
| Email Domain | email_domain | Event | Email domain for segmentation |
| Result Time | result_time_seconds | Event | Time to complete audit |

### Verification
- [ ] All 6 dimensions created
- [ ] Scope set to "Event" for all
- [ ] Dimension names match parameter names in code (exact match, case-sensitive)

### Note
- Dimensions won't show data until events with those parameters fire
- May take 24-48 hours for dimensions to appear in reports
- Use DebugView to verify parameters are being sent (dimensions will populate later)

---

## Phase 6: End-to-End Funnel Test

**Goal:** Verify complete tracking flow before Stripe integration

### Full Flow Test
- [ ] Start fresh (clear localStorage, new incognito window)
- [ ] Complete all 20 audit questions
- [ ] Submit email at gate
- [ ] View results page
- [ ] Click payment CTA

### DebugView Verification
- [ ] **3 events should fire in order:**
  1. `email_gate_submit`
  2. `view_results`
  3. `begin_checkout`
- [ ] All parameters present on each event
- [ ] Zone/score/gaps consistent across all 3 events
- [ ] No duplicate events

### Data Quality Check
- [ ] Zone values are only: "Red", "Yellow", "Green" (not lowercase, not null)
- [ ] Score is 0-100 (not percentage like "45%", just "45")
- [ ] Gap count is integer (not decimal)
- [ ] Plan price is 149, 99, or 49 (not formatted like "$149")
- [ ] Email domain has no "@" symbol (just "gmail.com", not "@gmail.com")

---

## Phase 7: Purchase Event (Post-Stripe Integration)

**Goal:** Track successful Stripe checkout completions

### Prerequisites
- [ ] Stripe integration complete
- [ ] Success page created at `/bursar/audit/success/`
- [ ] Success page includes purchase event code

### Implementation
- [ ] Add purchase event to success page `<script>` section
- [ ] Retrieve audit data from localStorage
- [ ] Include transaction_id from URL param `session_id`
- [ ] Use GA4 e-commerce format with items array

### Test - Stripe Test Mode
- [ ] Complete audit flow
- [ ] Click payment CTA → Stripe Checkout
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Expiry: any future date, CVC: any 3 digits
- [ ] Complete checkout

### Success Page Verification
- [ ] Success page loads at `/bursar/audit/success/?session_id=cs_test_...`
- [ ] **Check DebugView:** Look for `purchase` event
- [ ] **Verify parameters:**
  - `transaction_id` = Stripe session ID (starts with "cs_test_" or "cs_live_")
  - `value` = numeric price (149, 99, or 49)
  - `currency` = "USD"
  - `items[0].item_id` = "red_plan" (or yellow/green)
  - `items[0].item_name` = plan name
  - `items[0].price` = matches value
  - `zone`, `score_pct`, `gap_count` = from audit

### Test All Zones
- [ ] Red zone purchase → verify `value` = 149, `item_id` = "red_plan"
- [ ] Yellow zone purchase → verify `value` = 99, `item_id` = "yellow_plan"
- [ ] Green zone purchase → verify `value` = 49, `item_id` = "green_plan"

### Troubleshooting
- [ ] If event doesn't fire: Check localStorage has audit data
- [ ] If transaction_id missing: Verify URL param extraction
- [ ] If wrong price: Check zone mapping in localStorage
- [ ] If items array empty: Check item construction logic

---

## Phase 8: UTM Parameter Testing

**Goal:** Verify traffic source tracking for ad campaigns

### Test URLs
Create test URLs for each platform:

**Google Ads:**
```
/bursar/audit/?utm_source=google&utm_medium=cpc&utm_campaign=compliance-ca&utm_content=variant-a
```

**Facebook:**
```
/bursar/audit/?utm_source=facebook&utm_medium=paid-social&utm_campaign=invoice-pain&utm_content=variant-b
```

**LinkedIn:**
```
/bursar/audit/?utm_source=linkedin&utm_medium=paid-social&utm_campaign=board-tools&utm_content=variant-c
```

### Verification
- [ ] Visit each test URL
- [ ] Complete audit + email gate
- [ ] **Check DebugView:** Look for session_start event
- [ ] **Verify parameters:**
  - `source` = correct (google/facebook/linkedin)
  - `medium` = correct (cpc/paid-social)
  - `campaign` = correct
  - `content` = correct (variant-a/b/c)

### Note
- UTM parameters are automatically captured by GA4
- They persist for the entire session
- All subsequent events inherit the same source/medium/campaign

---

## Phase 9: Production Smoke Test

**Goal:** Verify tracking in production after deployment

### Pre-Launch
- [ ] Disable DebugView/debug_mode for production traffic
- [ ] Verify gtag property ID is PRODUCTION (not test property)
- [ ] Test with real Stripe production mode (small test purchase if needed)

### Post-Launch (Day 1)
- [ ] Check GA4 Realtime report → Events
- [ ] Verify events appearing: email_gate_submit, view_results, begin_checkout
- [ ] Check event parameters are populating
- [ ] Monitor for any error spikes in browser console logs

### Post-Launch (Day 2-3)
- [ ] Check GA4 Reports → Engagement → Events
- [ ] Verify event counts look reasonable (no massive spikes/drops)
- [ ] Check custom dimensions are populating in Explorations
- [ ] No huge gaps in data (missing hours/days)

---

## Common Issues & Fixes

### Event not appearing in DebugView
- **Check:** Is DebugView enabled? Look for green "DebugView" indicator
- **Check:** Is your device/browser selected in DebugView dropdown?
- **Check:** Browser console for JavaScript errors
- **Check:** Ad blockers disabled (can block gtag)

### Event fires but missing parameters
- **Check:** Parameter name spelling (case-sensitive: `zone` not `Zone`)
- **Check:** Variable is defined before gtag call
- **Check:** Value is not `undefined` or `null`

### Event fires multiple times
- **Check:** Duplicate gtag calls in code
- **Check:** Multiple event listeners triggering same function
- **Check:** Page reload or navigation triggering event again

### Purchase event not firing
- **Check:** localStorage has audit data (`bursar_audit_data` key exists)
- **Check:** Success page URL has `session_id` parameter
- **Check:** Script runs after DOM loaded (or use defer/async correctly)

### Custom dimensions not showing in reports
- **Wait:** 24-48 hours for data to populate
- **Check:** Dimension names in GA4 match parameter names exactly
- **Check:** Events with those parameters are actually firing
- **Check:** Scope is set to "Event" not "User"

---

## Sign-Off

**Before considering tracking "done":**

- [ ] All Phase 1-6 tests passed (pre-Stripe)
- [ ] Custom dimensions created in GA4
- [ ] Phase 7 (purchase) tests passed (post-Stripe)
- [ ] UTM tracking verified
- [ ] Production smoke test completed
- [ ] Funnel report created and showing data
- [ ] Ed (Marketer) confirmed tracking is working
- [ ] Dave approved to proceed with ad campaign launch

**Estimated Total Testing Time:** 3-4 hours (spread across implementation phases)

**Blocker Status:** Once all boxes checked above, Task 0.1 is COMPLETE → unblocks March 3 ad launch
