# Public portfolio feed audit

## Sources

The existing production backend is `https://shouldcallpaul.replit.app`.
No backend or database changes were made.

Public pages already fetched these live feeds directly, with jQuery cache-busting:

- `/resume/workshops`: workshops grid, home program cards and stage tally, background category counts, speaking-page session tally.
- `/resume/speech`: speech grid and home stage tally.
- `/resume/projects`, `/resume/conference`, `/resume/hackathon`, `/resume/patent`: technology grid and legacy portfolio consumers.
- `/resume/races`: race grid and legacy portfolio consumer.
- `/speaker/speaker_menu`: server-rendered workshop catalog, with browser retry on server fetch failure.

No local JSON imports or build snapshots were found in these consumers.
Existing relative media-path resolution and custom display images remain unchanged.
Objects retain their original fields, nested details, galleries, links, and optional IDs.
Technology categories now render in fixed category order, retaining backend order within each category rather than depending on response timing.
Home program summaries retain their existing recent/upcoming date selection.

`/resume/awards` and `/resume/certificates` were tested but are not connected to a current dedicated public section. No new section or management screen was added.
Certificates return `certifications`; the other résumé feeds return `records`.

## Explicit testimonial exception

The original exception was superseded after the backend published all 18 entries and the user authorized the switch.
The testimonial page and homepage preview now fetch `/resume/testimonials`, without a static quote fallback.
They request fresh data on load/retry, refresh every five minutes while visible, and revalidate when returning to a page whose last request is at least five minutes old.
The full page groups records by the four specified categories, preserving feed order within each group; the homepage previews the first three records. Counts are dynamic, not capped at 18.
Quotes are rendered as text; legacy records do not need IDs. Existing local headshots remain presentation assets only.

## Freshness and failures

- Browser résumé requests fetch on page load (or existing lazy-load trigger), use cache-busting and a 15-second timeout. Reload to see backend edits; there is no background polling.
- The speaker menu has a five-minute server memory cache. After expiry, the next page request fetches fresh data. Expired data is never returned on failure.
- Catalog HTML is sent with `Cache-Control: no-cache, no-store, must-revalidate`.
- Public feed responses are validated before existing renderers run. Invalid authenticated-style wrappers trigger an error, not a misleading empty success.
- Grids distinguish empty published feeds from errors. Technology failures identify missing categories; successful categories can still render.
- Stage totals wait for both public feeds rather than showing a partial total; failed counts display “Unavailable.” Speaking session counts accept zero.
- No private CRM feeds or credentials were added, and no local JSON fallback is used.

## Verification

Anonymous browser fetches succeeded with HTTP 200 and working CORS for all ten résumé feeds.
Observed counts: workshops 33, speech 20, conference 8, hackathon 9, patent 3, projects 15, races 35, awards 8, certificates 2, testimonials 2.
Catalog rendered 20 offerings across three categories.
Browser checks confirmed workshops 33, speeches 20, technology 35, races 35 cards; category order; workshop modal nested attendance details and six images.
Simulated empty, HTTP 503, and invalid wrapper responses produced explicit empty/error messages. No page JavaScript errors occurred in those checks.
JavaScript syntax checks passed for the server and changed scripts.

Counts are observations, not hardcoded expectations for future content.
