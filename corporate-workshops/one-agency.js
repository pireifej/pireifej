(() => {
  const $ = (id) => document.getElementById(id);
  const notes = $("notes");
  const deck = document.querySelector(".deck");
  const nav = document.querySelector(".nav");
  let lastFocus;

  if (notes) {
    notes.setAttribute("role", "dialog");
    notes.setAttribute("aria-modal", "true");
    notes.setAttribute("aria-labelledby", "notesTitle");
    notes.querySelector("h2").id = "notesTitle";
  }

  function isEditingTarget(target) {
    return target instanceof HTMLElement && (
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
      target.isContentEditable
    );
  }

  function focusableNotes() {
    return [...notes.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
      .filter((element) => !element.hasAttribute("disabled"));
  }

  function setModal(open) {
    if (!notes) return;
    if (open) {
      lastFocus = document.activeElement;
      notes.classList.add("open");
      notes.setAttribute("aria-hidden", "false");
      deck.inert = true;
      nav.inert = true;
      $("notesClose").focus();
      return;
    }
    notes.classList.remove("open");
    notes.setAttribute("aria-hidden", "true");
    deck.inert = false;
    nav.inert = false;
    lastFocus?.focus();
  }

  const workshopController = window.initWorkshopController({
    onKeydown(event) {
      if (notes?.classList.contains("open")) {
        if (event.key === "Escape") setModal(false);
        if (event.key === "Tab") {
          const focusable = focusableNotes();
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
        return true;
      }

      if (isEditingTarget(document.activeElement)) return true;
      if (!document.body.classList.contains("one-agency-staff") && event.key.toLowerCase() === "m") {
        event.preventDefault();
        const megaSlide = $("megaInput")?.closest(".slide");
        const megaIndex = megaSlide ? workshopController.slides.indexOf(megaSlide) : -1;
        workshopController.show(megaIndex >= 0 ? megaIndex : workshopController.current);
        setTimeout(() => $("megaInput").focus(), 0);
        return true;
      }
      return false;
    }
  });

  $("notesOpen")?.addEventListener("click", () => setModal(true));
  $("notesClose")?.addEventListener("click", () => setModal(false));

  const email = $("email");
  document.querySelectorAll("[data-email]").forEach((button) => {
    button.onclick = () => {
      const constructive = button.dataset.email === "b";
      email.classList.toggle("constructive", constructive);
      document.querySelectorAll("[data-email]").forEach((toggle) => {
        toggle.setAttribute("aria-pressed", String(toggle === button));
      });
    };
  });

  const input = $("megaInput");
  const output = $("megaOutput");
  const staffDeck = document.body.classList.contains("one-agency-staff");
  function fitMegaphone() {
    if (staffDeck) {
      if (!output.clientWidth || !output.clientHeight) return;
      // Reset to the stylesheet's original size before measuring each rewrite.
      output.style.removeProperty("font-size");
      const style = getComputedStyle(output);
      const maximum = parseFloat(style.fontSize);
      const availableWidth = output.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const availableHeight = output.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      const range = document.createRange();
      range.selectNodeContents(output);
      const fits = (size) => {
        output.style.fontSize = `${size}px`;
        const text = range.getBoundingClientRect();
        return text.width <= availableWidth && text.height <= availableHeight;
      };
      if (fits(maximum)) return;
      let low = 1;
      let high = maximum;
      while (high - low > 0.5) {
        const middle = (low + high) / 2;
        if (fits(middle)) low = middle;
        else high = middle;
      }
      output.style.fontSize = `${low}px`;
      return;
    }
    let size = Math.min(window.innerWidth * 0.09, 160);
    output.style.fontSize = `${size}px`;
    while ((output.scrollHeight > output.clientHeight || output.scrollWidth > output.clientWidth) && size > 12) {
      size -= 2;
      output.style.fontSize = `${size}px`;
    }
  }
  input.addEventListener("input", () => {
    output.textContent = input.value || "Type a rewrite.";
    fitMegaphone();
  });
  window.addEventListener("resize", fitMegaphone);
  if (staffDeck) {
    const scheduleFit = () => requestAnimationFrame(fitMegaphone);
    new ResizeObserver(scheduleFit).observe(output);
    new MutationObserver(scheduleFit).observe(output.closest(".slide"), {
      attributes: true, attributeFilter: ["class"]
    });
    document.addEventListener("fullscreenchange", scheduleFit);
    document.fonts.ready.then(scheduleFit);
  }
  $("megaClear").onclick = () => {
    input.value = "";
    output.textContent = "Type a rewrite.";
    input.focus();
    fitMegaphone();
  };

  document.querySelectorAll("[data-qr]").forEach((slot) => {
    const file = $(`${slot.dataset.qr}File`);
    const image = $(`${slot.dataset.qr}Img`);
    const remove = $(`${slot.dataset.qr}Remove`);
    const destination = $(`${slot.dataset.qr}Url`);
    const destinationLink = $(`${slot.dataset.qr}Link`);
    const destinationError = $(`${slot.dataset.qr}UrlError`);

    file.addEventListener("change", () => {
      const selected = file.files[0];
      if (!selected) return;
      if (!/^image\/(png|jpeg|webp)$/.test(selected.type)) {
        file.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        image.src = reader.result;
        image.hidden = false;
        slot.querySelector(".qr-copy").hidden = true;
      };
      reader.readAsDataURL(selected);
    });
    remove.onclick = () => {
      file.value = "";
      image.removeAttribute("src");
      image.hidden = true;
      slot.querySelector(".qr-copy").hidden = false;
    };

    const updateDestination = () => {
      const value = destination.value.trim();
      destinationLink.hidden = true;
      destinationLink.removeAttribute("href");
      destinationLink.textContent = "";
      destinationError.textContent = "";
      if (!value) return;
      try {
        const url = new URL(value);
        if (!["http:", "https:"].includes(url.protocol)) throw new Error("Unsupported URL scheme");
        destinationLink.href = url.href;
        destinationLink.textContent = `Open destination: ${url.href}`;
        destinationLink.hidden = false;
      } catch {
        destinationError.textContent = "Use an http(s) URL.";
      }
    };
    destination.addEventListener("input", updateDestination);
    destination.addEventListener("change", updateDestination);
  });

  document.querySelectorAll("[data-countdown]").forEach((box) => {
    let left = Number(box.dataset.seconds);
    let timer;
    const label = box.querySelector(".timer");
    const render = () => { label.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")} TIMER`; };
    render();
    box.querySelector(".start").onclick = () => {
      if (timer) return;
      timer = setInterval(() => {
        if (left) { left -= 1; render(); }
        else { clearInterval(timer); timer = null; }
      }, 1000);
    };
    box.querySelector(".pause").onclick = () => { clearInterval(timer); timer = null; };
    box.querySelector(".reset").onclick = () => {
      clearInterval(timer);
      timer = null;
      left = Number(box.dataset.seconds);
      render();
    };
  });
})();