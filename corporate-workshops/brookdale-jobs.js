(() => {
  const slides = [...document.querySelectorAll(".brookdale-jobs .slide")];
  const controller = window.initWorkshopController({
    slides,
    onKeydown(event) {
      // Keep native keyboard activation for links and slide navigation buttons.
      return event.target instanceof HTMLElement &&
        (!!event.target.closest("button, a, input, textarea, select") || event.target.isContentEditable);
    }
  });
  function syncSlides() {
    slides.forEach((slide, index) => {
      slide.setAttribute("aria-hidden", String(index !== controller.current));
    });
    document.getElementById("previous").disabled = controller.current === 0;
    document.getElementById("next").disabled = controller.current === slides.length - 1;
  }
  new MutationObserver(syncSlides).observe(document.querySelector(".deck"), {
    subtree: true, attributes: true, attributeFilter: ["class"]
  });
  syncSlides();

})();
