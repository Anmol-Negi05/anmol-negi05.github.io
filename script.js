const form = document.querySelector(".contact-form");
const note = document.querySelector(".form-note");
const glow = document.querySelector(".cursor-glow");

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

window.addEventListener("pointermove", (event) => {
  if (!glow) return;
  document.body.classList.add("pointer-active");
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

document.querySelectorAll("[data-tilt-card]").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--tilt-x", `${-y * 5}deg`);
    card.style.setProperty("--tilt-y", `${x * 7}deg`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  });
});

const modal = document.querySelector(".cert-modal");
const modalImage = modal?.querySelector("img");
const modalTitle = modal?.querySelector("#cert-modal-title");
const modalText = modal?.querySelector("p");

const openCertificate = (item) => {
  if (!modal || !modalImage || !modalTitle || !modalText) return;
  const title = item.dataset.certTitle || "Certificate Preview";
  const image = item.dataset.certImage || "";
  modalTitle.textContent = title;
  modalImage.src = image;
  modalImage.alt = `${title} screenshot preview`;
  modalText.textContent = "Verified completion record.";
  modal.hidden = false;
  document.body.classList.add("modal-open");
  modal.querySelector(".cert-close")?.focus();
};

const closeCertificate = () => {
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove("modal-open");
};

document.querySelectorAll(".cert-item").forEach((item) => {
  item.addEventListener("click", () => openCertificate(item));
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCertificate(item);
    }
  });
});

document.querySelectorAll("[data-close-cert]").forEach((closeControl) => {
  closeControl.addEventListener("click", closeCertificate);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCertificate();
  }
});
