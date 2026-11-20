# ThinkEat.org — Google Analytics 4 setup

## Web data stream

- Measurement ID: `G-87F9GWFM7L`
- Stream: ThinkEat.org website (Web only)
- Google tag: installed via the existing `analytics.js` integration (do **not** paste a second tag snippet).
- Configuration: `analytics-config.js` has `enabled: true`.

## Privacy: opt-in before collection

The website uses a small, first-party **basic consent** implementation:

1. Before a visitor explicitly allows analytics, Google Analytics/Google Tag Manager scripts are **not loaded** and no website analytics hits are sent to Google.
2. The site shows an optional analytics banner with **Decline** and **Allow analytics** and a Privacy Policy link.
3. The choice is stored as `thinkeat.analytics.consent.v1` in the browser's localStorage, when available.
4. A persistent **Analytics preferences** button in the footer lets visitors review or change their choice.
5. If permission is withdrawn, the code switches analytics consent to denied, attempts to clear GA cookies, and reloads the page to stop the loaded tag.
6. Advertising storage, ad user data, and ad personalization remain denied; this installation measures aggregate website activity and outbound App Store interest only.

This is a minimal first-party implementation; confirm its legal adequacy for the jurisdictions where the website is marketed. If a full Consent Management Platform is required, replace this implementation rather than layering another consent banner on top.

## Events

- `page_view`: automatically collected when analytics is permitted.
- `ios_app_store_click`: sent when a visitor *clicks* a website link to `https://apps.apple.com/us/app/thinkeat/id6796200052`, including the iOS download button and web-clickable QR image.
- GA4 Enhanced Measurement may also produce the generic outbound `click` event. **Do not create a second rule that produces `ios_app_store_click` from that generic event**.
- Scanning a QR with a separate phone camera goes directly to the App Store and is *not* captured by the website click listener.
- No Android app store event until the public Google Play listing exists.
- A click is *not* a verified installation.

## Manual steps in Google Analytics

1. In GA4 Admin, open the ThinkEat Website Web stream and verify the measurement ID is `G-87F9GWFM7L`.
2. Enable Enhanced Measurement if desired. The custom iOS click event is sent by website code regardless.
3. Visit the site with a fresh browser profile and verify there is no request to `googletagmanager.com` or `google-analytics.com` before choosing a consent option.
4. Choose **Decline**, reload, and verify the tag does not load.
5. Choose **Analytics preferences → Allow analytics**; verify a `page_view` appears in GA4 **Realtime**.
6. Use **DebugView** (or browser debug mode) to verify **one `ios_app_store_click`** per click on the iOS App Store button and one per web-clicked iOS QR link. Scan-based opens aren't tracked.
7. Go to **Admin → Data display → Events**, find `ios_app_store_click`, and mark it as a **Key Event**. This is an account-level action that website code cannot perform.
8. Check `Analytics preferences → Decline` after opting in; verify collection stops and previously set analytics cookies are cleared when possible.
9. Link GA4 to the ThinkEat Google Ads / Ad Grants account when ready; evaluate qualifying, meaningful conversion goals before making any event a *primary* Ads conversion.

## Deployment checks

- Each HTML page includes `analytics-config.js` **before** `analytics.js`, both marked `defer`.
- The privacy page explains opt-in and the footer preference control.
- The consent stylesheet loads only when the GA4 feature is enabled.
- **Never** paste the Google-provided tag snippet directly into the HTML alongside this integration.
- Do not send personal information such as phone numbers, email addresses, or inventory data as GA4 event parameters.

## Rollback

Set `enabled: false` in `analytics-config.js` to prevent the consent manager and all GA4 analytics requests from loading, regardless of the visitor's previous consent choice.
