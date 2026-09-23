---
name: Academy presentation boundaries
description: Content-preservation decisions and external-media readiness constraints for Academy presentations.
---

Keep Academy homework assignments exactly unchanged during presentation/navigation work. Preserve the existing styling and interactive activities; student-specific names should not appear in slide content.

**Why:** The user explicitly approved a behavior-only conversion, not a content rewrite or redesign.

**How to apply:** For dense content, prefer scrolling inside the current slide over automatically shrinking text or splitting/rewording activities. Obtain approval before content restructuring; do not create downloadable exports unless requested.

Do not gate presentation controls on the entire window load event when third-party video embeds are present.

**Why:** External video loading can leave the legacy page preloader intercepting clicks even though the slides and controller are ready. A parent loading container can also report no visible bounds while its fixed child still blocks pointer events.

**How to apply:** Treat DOM/controller readiness separately from embedded media readiness. In browser checks, confirm actual control clicks work, not merely that the loading container has zero bounds.