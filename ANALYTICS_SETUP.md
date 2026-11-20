# ThinkEat website analytics setup

The site includes an intentionally **disabled** GA4 implementation. No analytics network
requests occur until it is configured and explicitly enabled.

## Before enabling
1. Create or locate the ThinkEat GA4 property and web data stream for `www.thinkeat.org`.
2. Verify the analytics privacy notice, applicable consent requirements, and data-retention settings. Do not enable the tag where those prerequisites are unmet.
3. Set `measurementId` to the public `G-...` measurement ID and set `enabled: true` in `analytics-config.js`.

## Measurement
- Every page loads `analytics-config.js` and `analytics.js` with deferred script tags.
- GA4 automatically records page views when enabled.
- A click on the ThinkEat iOS App Store URL emits `ios_app_store_click`.
- If Enhanced Measurement's outbound clicks are enabled, GA4 may ALSO record its ordinary `click` event. This is a separate event, not a duplicate `ios_app_store_click`.
- In GA4 Admin, mark `ios_app_store_click` as a Key Event; this GA4-admin step cannot be completed by site code alone.
- Validate one `ios_app_store_click` per click in GA4 DebugView and inspect Realtime.
- Treat the event as outbound interest, **not** a verified app download or installation.
- Do not make this the sole primary Google Ads conversion without checking Ad Grants conversion requirements. Keep it secondary until a suitable campaign goal is determined.

## Test before publication
- With configuration disabled, confirm no request to `googletagmanager.com` or GA4.
- With a test GA4 ID and privacy requirements satisfied, confirm page views and iOS click events.
- Verify that links still navigate, even if analytics is disabled or blocked by the browser.
- Recheck the privacy notice when enabling, removing, or changing analytics services.
