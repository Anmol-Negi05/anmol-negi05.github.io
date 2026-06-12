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
/* ==========================
   FLOWING DOT BACKGROUND
========================== */

const canvas = document.getElementById("dotCanvas");
const ctx = canvas.getContext("2d");

const spacing = 28;
const speed = 0.15;
const mouseRadius = 180;

let dots = [];

let mouse = {
  x: -9999,
  y: -9999
};

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  dots = [];

  for (let x = 0; x < canvas.width + spacing; x += spacing) {
    for (let y = 0; y < canvas.height + spacing; y += spacing) {
      dots.push({
        baseX: x,
        baseY: y,
        offset: Math.random() * 1000,
        x: x,
        y: y
      });
    }
  }
}

window.addEventListener("resize", resizeCanvas);

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("mouseleave", () => {
  mouse.x = -9999;
  mouse.y = -9999;
});

let time = 0;

function animateDots() {
  time += 0.01;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const dot of dots) {

    const flowX =
      dot.baseX +
      ((time * 40 + dot.offset) % (canvas.width + spacing));

    let x = flowX % (canvas.width + spacing);
    let y = dot.baseY;

    const dx = x - mouse.x;
    const dy = y - mouse.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouseRadius) {
      const force = (mouseRadius - distance) / mouseRadius;

      const angle = Math.atan2(dy, dx);

      x += Math.cos(angle) * force * 80;
      y += Math.sin(angle) * force * 80;
    }

    ctx.beginPath();
    ctx.arc(x, y, 1.2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.fill();
  }

  requestAnimationFrame(animateDots);
}

resizeCanvas();
animateDots();
