(() => {
  function initWorkshopController(options = {}) {
    const root = options.root || document;
    const get = (id) => (root.getElementById ? root.getElementById(id) : root.querySelector(`#${id}`));
    const slides = options.slides || [...root.querySelectorAll(".slide")];
    const bar = options.bar || get("bar");
    const count = options.count || get("count");
    const previous = options.previous || get("previous");
    const next = options.next || get("next");
    const fullscreen = options.fullscreen || get("fullscreen");
    let current = Math.max(0, Math.min(slides.length - 1, Number(options.initialIndex) || 0));

    function show(index) {
      if (!slides.length) return current;
      current = Math.max(0, Math.min(slides.length - 1, index));
      slides.forEach((slide, slideIndex) => slide.classList.toggle("active", slideIndex === current));
      if (bar) bar.style.width = `${((current + 1) / slides.length) * 100}%`;
      if (count) count.textContent = `${String(current + 1).padStart(2, "0")} / ${slides.length}`;
      slides[current].focus?.();
      return current;
    }

    previous?.addEventListener("click", () => show(current - 1));
    next?.addEventListener("click", () => show(current + 1));
    fullscreen?.addEventListener("click", () => {
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      } else {
        document.documentElement.requestFullscreen?.();
      }
    });

    if (options.keyboard !== false) {
      document.addEventListener("keydown", (event) => {
        if (options.onKeydown?.(event) === true) return;
        if (event.key === "ArrowLeft") show(current - 1);
        if (event.key === "ArrowRight" || event.key === " ") {
          event.preventDefault();
          show(current + 1);
        }
        if (event.key === "Home") show(0);
        if (event.key === "End") show(slides.length - 1);
      });
    }

    show(current);
    return {
      show,
      get current() {
        return current;
      },
      getCurrent: () => current,
      slides
    };
  }

  window.initWorkshopController = initWorkshopController;
})();