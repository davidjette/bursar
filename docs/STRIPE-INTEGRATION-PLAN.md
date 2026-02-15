# Stripe Integration Plan — Bursar Compliance Audit

## Overview
Connect Stripe Checkout to the post-audit payment screen. Zone-based dynamic pricing sends users to the right plan automatically.

## Stripe Setup (Dave)
1. Create Stripe account or use existing → toggle to **Test Mode**
2. Create 3 Products + Prices (monthly recurring):

| Product Name | Price | Zone |
|---|---|---|
| Priority Compliance Package | $149/mo | Red (<50%) |
| Compliance Accelerator | $99/mo | Yellow (50-79%) |
| Compliance Maintenance | $49/mo | Green (80%+) |

3. Copy each Price ID (`price_xxx`) and the publishable key (`pk_test_xxx`)
4. Send to Dev — I'll wire them in

## Implementation Plan

### Phase 1: Client-Side Checkout (Stripe Checkout Sessions)
**File:** `docs/js/audit.js` → `handleCheckout()`

```
Flow:
1. User clicks "Get Started" on payment screen
2. JS calls our backend (Apps Script) with: zone, email, name, price_id
3. Backend creates Stripe Checkout Session via API
4. User redirected to Stripe hosted checkout page
5. On success → redirect to /bursar/audit/success/
6. On cancel → redirect back to /bursar/audit/ with results restored
```

### Phase 2: Backend (Google Apps Script)
**File:** `backend/google-apps-script.js` — add endpoint

```
New function: createCheckoutSession(zone, email, name)
- Maps zone → Stripe Price ID
- Creates Checkout Session with:
  - customer_email: prefilled from audit
  - metadata: { zone, score, audit_date }
  - success_url: /bursar/audit/success/?session_id={CHECKOUT_SESSION_ID}
  - cancel_url: /bursar/audit/?resumed=true
- Returns session URL
```

### Phase 3: Success Page
**File:** `docs/audit/success/index.html` (new)

Content:
- ✅ "You're In!" confirmation
- Order summary (plan name, price)
- "What happens next" timeline:
  1. Welcome email within 1 hour
  2. Onboarding call scheduled within 48 hours (Red) / 1 week (Yellow/Green)
  3. Dashboard access link
- Share CTA: "Know another board that needs this?"

### Phase 4: Webhook Handler
**File:** `backend/google-apps-script.js` — add webhook

```
Handle: checkout.session.completed
- Log to "Bursar Payments" Google Sheet
- Columns: date, email, name, zone, plan, amount, stripe_customer_id, stripe_subscription_id
- Trigger welcome email (via Resend/SendGrid)
- Update audit submission row with payment status
```

## Price IDs Map (fill in after Stripe setup)
```javascript
const STRIPE_PRICES = {
  Red:    'price_PLACEHOLDER_red',
  Yellow: 'price_PLACEHOLDER_yellow',
  Green:  'price_PLACEHOLDER_green',
};
const STRIPE_PK = 'pk_test_PLACEHOLDER';
```

## Test Flow
1. Complete audit → email gate → results → click CTA
2. Payment screen shows correct zone/price
3. "Get Started" → Stripe Checkout (test mode)
4. Use test card: `4242 4242 4242 4242`
5. Verify: success page loads, Sheet updated, welcome email sent

## Files to Create/Modify
- `docs/js/audit.js` — replace `handleCheckout()` placeholder
- `docs/audit/success/index.html` — new success page
- `backend/google-apps-script.js` — add checkout session + webhook endpoints
- `docs/js/submit.js` — add Stripe.js loader
