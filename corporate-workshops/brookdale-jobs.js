(() => {
  const slides = [...document.querySelectorAll(".brookdale-jobs .slide")];
  const controller = window.initWorkshopController({
    slides,
    onKeydown(event) {
      // Keep native keyboard activation for links and independent widget buttons.
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

  const revealButtons = [...document.querySelectorAll("[data-reveal]")];
  revealButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      document.getElementById(button.dataset.reveal).hidden = expanded;
      button.textContent = expanded ? "Reveal prediction" : "Hide prediction";
    });
  });
  document.getElementById("reset-predictions").addEventListener("click", () => {
    revealButtons.forEach((button) => {
      button.setAttribute("aria-expanded", "false");
      button.textContent = "Reveal prediction";
      document.getElementById(button.dataset.reveal).hidden = true;
    });
  });

  // Existing countdown widget pattern, with a wall-clock deadline to avoid drift.
  document.querySelectorAll("[data-countdown]").forEach((box) => {
    const duration = Number(box.dataset.seconds);
    const label = box.querySelector(".timer");
    const start = box.querySelector(".start");
    const pause = box.querySelector(".pause");
    const status = document.getElementById("timer-status");
    let remaining = duration;
    let deadline = 0;
    let interval = null;
    function render() {
      label.textContent = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`;
      start.disabled = interval !== null || remaining === 0;
      pause.disabled = interval === null;
    }
    function stop() {
      clearInterval(interval);
      interval = null;
    }
    function tick() {
      remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      if (remaining === 0) {
        stop();
        status.textContent = "Time is up. Finish your bullet and review it with your instructor.";
      }
      render();
    }
    start.addEventListener("click", () => {
      if (interval !== null || remaining === 0) return;
      deadline = Date.now() + remaining * 1000;
      interval = setInterval(tick, 250);
      status.textContent = "Timer running. Raise your hand if you need assistance.";
      start.textContent = "Resume";
      render();
    });
    pause.addEventListener("click", () => {
      tick();
      stop();
      status.textContent = "Timer paused. Press Resume when you are ready.";
      render();
    });
    box.querySelector(".reset").addEventListener("click", () => {
      stop();
      remaining = duration;
      start.textContent = "Start";
      status.textContent = "25 minutes to practice. Your facts. Your voice.";
      render();
    });
    render();
  });
})();
