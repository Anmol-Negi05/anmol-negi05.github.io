const form = document.querySelector(".contact-form");
const note = document.querySelector(".form-note");

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
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
   FULL PAGE FLOWING DOTS
========================== */

const canvas = document.getElementById("dotCanvas");
const ctx = canvas?.getContext("2d", { alpha: true });

const particleConfig = {
  spacing: 30,
  particleSize: 1.05,
  movementSpeed: 30,
  mouseRadius: 130,
  repulsionStrength: 58
};

const mouse = {
  x: -9999,
  y: -9999,
  active: false
};

let particles = [];
let canvasWidth = 0;
let canvasHeight = 0;
let dpr = 1;
let flowOffset = 0;
let lastFrameTime = performance.now();
let resizeFrame = 0;

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function getDocumentHeight() {
  return Math.ceil(
    Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight,
      window.innerHeight
    )
  );
}

function getSpacing() {
  return window.innerWidth < 700
    ? particleConfig.spacing + 8
    : particleConfig.spacing;
}

function buildParticles() {
  particles = [];

  const spacing = getSpacing();
  const columns = Math.ceil(canvasWidth / spacing) + 3;
  const rows = Math.ceil(canvasHeight / spacing) + 2;

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const stagger = row % 2 === 0 ? 0 : spacing * 0.5;
      const jitterX = (Math.random() - 0.5) * spacing * 0.22;
      const jitterY = (Math.random() - 0.5) * spacing * 0.22;

      particles.push({
        x: column * spacing - spacing + stagger + jitterX,
        y: row * spacing + jitterY,
        phase: Math.random() * Math.PI * 2
      });
    }
  }
}

function resizeCanvas() {
  if (!canvas || !ctx) return;

  canvasWidth = Math.ceil(window.innerWidth);
  canvasHeight = getDocumentHeight();
  dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.ceil(canvasWidth * dpr);
  canvas.height = Math.ceil(canvasHeight * dpr);
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  buildParticles();
}

function requestCanvasResize() {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(resizeCanvas);
}

function updateMouse(event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY + window.scrollY;
  mouse.active = true;
}

function clearMouse() {
  mouse.x = -9999;
  mouse.y = -9999;
  mouse.active = false;
}

function drawFrame(now) {
  if (!canvas || !ctx) return;

  const deltaSeconds = Math.min((now - lastFrameTime) / 1000, 0.05);
  lastFrameTime = now;

  if (getDocumentHeight() !== canvasHeight || window.innerWidth !== canvasWidth) {
    resizeCanvas();
  }

  if (!prefersReducedMotion.matches) {
    flowOffset += particleConfig.movementSpeed * deltaSeconds;
  }

  const spacing = getSpacing();
  const wrapWidth = canvasWidth + spacing * 3;
  const radius = window.innerWidth < 700
    ? particleConfig.mouseRadius * 0.78
    : particleConfig.mouseRadius;
  const radiusSquared = radius * radius;
  const size = window.innerWidth < 700
    ? particleConfig.particleSize * 0.9
    : particleConfig.particleSize;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = "rgba(255, 255, 255, 0.42)";
  ctx.beginPath();

  for (const particle of particles) {
    let x = ((particle.x + flowOffset + spacing) % wrapWidth) - spacing * 1.5;
    let y = particle.y + Math.sin(now * 0.00018 + particle.phase) * 0.65;

    if (mouse.active) {
      const dx = x - mouse.x;
      const dy = y - mouse.y;
      const distanceSquared = dx * dx + dy * dy;

      if (distanceSquared < radiusSquared) {
        const distance = Math.sqrt(distanceSquared) || 1;
        const influence = 1 - distance / radius;
        const push = influence * influence * particleConfig.repulsionStrength;
        x += (dx / distance) * push;
        y += (dy / distance) * push;
      }
    }

    ctx.moveTo(x + size, y);
    ctx.arc(x, y, size, 0, Math.PI * 2);
  }

  ctx.fill();
  requestAnimationFrame(drawFrame);
}

if (canvas && ctx) {
  resizeCanvas();
  requestAnimationFrame(drawFrame);

  window.addEventListener("resize", requestCanvasResize, { passive: true });
  window.addEventListener("orientationchange", requestCanvasResize, { passive: true });
  window.addEventListener("pointermove", updateMouse, { passive: true });
  window.addEventListener("pointerleave", clearMouse);
  window.addEventListener("blur", clearMouse);
  window.addEventListener("load", requestCanvasResize);

  if ("ResizeObserver" in window) {
    new ResizeObserver(requestCanvasResize).observe(document.body);
  }
}
