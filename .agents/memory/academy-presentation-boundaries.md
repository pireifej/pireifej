---
name: Academy presentation boundaries
description: Content-preservation decisions and external-media readiness constraints for Academy presentations.
---

Keep Academy homework assignments exactly unchanged during presentation/navigation work. Preserve the existing styling and interactive activities; student-specific names should not appear in slide content.

**Why:** The user wants the existing teaching material and visual identity preserved, while allowing long topics to be separated into presentation-sized slides.

**How to apply:** The user rejected internal slide scrolling and approved fixed 16:9 Reveal.js slides with very large text. Split frameworks, examples, and activities into separate slides instead of shrinking text or adding scrolling. Preserve homework wording exactly. Impromptu Speaking is the review-first pilot; wait for approval before converting the other Academy decks. Do not create downloadable exports unless requested.

Do not gate presentation controls on the entire window load event when third-party video embeds are present.

**Why:** External video loading can leave the legacy page preloader intercepting clicks even though the slides and controller are ready. A parent loading container can also report no visible bounds while its fixed child still blocks pointer events.

**How to apply:** Treat DOM/controller readiness separately from embedded media readiness. Place essential navigation before optional legacy scripts and initialize when slide markup exists, rather than waiting for all later scripts. In browser checks, deliberately stall video and legacy-script requests and confirm actual control clicks work, not merely that the loading container has zero bounds.