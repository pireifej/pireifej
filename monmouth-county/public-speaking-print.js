// Printing is an admin action; every slide remains static without JavaScript.
(() => {
  async function printDeck() {
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) =>
      image.complete ? Promise.resolve() : new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      })
    ));
    window.print();
  }
  document.getElementById("printDeck")?.addEventListener("click", printDeck);
  if (new URLSearchParams(window.location.search).get("print") === "1") {
    window.addEventListener("load", printDeck, { once: true });
  }
})();