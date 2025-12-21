(function () {
  const menuBtn = document.getElementById("menuBtn");
  const drawer = document.getElementById("drawer");
  const closeDrawer = document.getElementById("closeDrawer");
  const backdrop = document.getElementById("backdrop");

  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");
  const modalBody = document.getElementById("modalBody");
  const modalTitle = document.getElementById("modalTitle");
  const modalLink = document.getElementById("modalLink");

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    menuBtn?.setAttribute("aria-expanded", "true");
    if (backdrop) {
      backdrop.hidden = false;
      backdrop.addEventListener("click", closeDrawerFn, { once: true });
    }
    document.body.style.overflow = "hidden";
  }

  function closeDrawerFn() {
    if (!drawer) return;
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    menuBtn?.setAttribute("aria-expanded", "false");
    if (backdrop) backdrop.hidden = true;
    document.body.style.overflow = "";
  }

  menuBtn?.addEventListener("click", () => {
    if (drawer.classList.contains("open")) closeDrawerFn();
    else openDrawer();
  });

  closeDrawer?.addEventListener("click", closeDrawerFn);

  // Modal
  function openModal() {
    if (!modal) return;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModalFn() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    modalBody && (modalBody.innerHTML = "");
  }

  closeModal?.addEventListener("click", closeModalFn);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDrawerFn();
      closeModalFn();
    }
  });

  async function fetchArticleById(id) {
    const res = await fetch("articles.html", { cache: "no-store" });
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const el = doc.getElementById(id);
    return el ? el.outerHTML : null;
  }

  async function handleOpen(id) {
    const html = await fetchArticleById(id);
    if (!html) return;

    // Put the article into modal
    modalBody.innerHTML = html;

    // Title from the fetched article
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const t = tmp.querySelector(".story__title");
    modalTitle.textContent = t ? t.textContent : "جريدة الهرج والمرج";

    modalLink.setAttribute("href", `articles.html#${id}`);
    openModal();
  }

  // Buttons on homepage (data-open="article-x")
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-open]");
    if (!btn) return;
    const id = btn.getAttribute("data-open");
    if (!id) return;
    handleOpen(id);
  });

  // Close modal by clicking outside
  modal?.addEventListener("click", (e) => {
    const panel = e.target.closest(".modal__panel");
    if (!panel) closeModalFn();
  });
})();
