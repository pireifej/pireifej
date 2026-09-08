---
name: Canonical public hostname
description: Production URL and QR-code hostname choice for Should Call Paul.
---

Use `https://www.shouldcallpaul.com` for production links, printed URLs, and QR-code destinations. As of September 8, 2026, the apex `https://shouldcallpaul.com` host fails TLS while the `www` host is healthy and matches the sitemap’s canonical URLs.

**Why:** A presentation QR originally used the apex host and decoded correctly, but the destination could not establish a secure connection.

**How to apply:** Prefer the `www` hostname for public-facing assets. Recheck both hosts if DNS or certificate configuration changes.