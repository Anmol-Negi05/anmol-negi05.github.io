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
   FULL PAGE FLOWING DOTS
========================== */

const canvas = document.getElementById("dotCanvas");
const ctx = canvas.getContext("2d");

const spacing = 12;
const speed = 0.35;
const mouseRadius = 150;

let dots = [];

const mouse = {
  x: -9999,
  y: -9999
};

function buildDots() {

  canvas.width = window.innerWidth;

  canvas.height = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    window.innerHeight
  );

  dots = [];

  for (let x = 0; x <= canvas.width; x += spacing) {
    for (let y = 0; y <= canvas.height; y += spacing) {

      dots.push({
        baseX: x,
        baseY: y,
        x: x,
        y: y,
        drift: Math.random() * canvas.width
      });

    }
  }
}

window.addEventListener("resize", buildDots);

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.pageY;
});

window.addEventListener("mouseleave", () => {
  mouse.x = -9999;
  mouse.y = -9999;
});

let flow = 0;

function animate() {

  const requiredHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    window.innerHeight
  );

  if (requiredHeight !== canvas.height) {
    buildDots();
  }

  flow += speed;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const dot of dots) {

    const movingX =
      (dot.baseX + dot.drift + flow) %
      (canvas.width + spacing);

    const targetX = movingX;
    const targetY = dot.baseY;

    dot.x += (targetX - dot.x) * 0.08;
    dot.y += (targetY - dot.y) * 0.08;

    const dx = dot.x - mouse.x;
    const dy = dot.y - mouse.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouseRadius) {

      const force =
        (mouseRadius - distance) / mouseRadius;

      const angle = Math.atan2(dy, dx);

      dot.x += Math.cos(angle) * force * 25;
      dot.y += Math.sin(angle) * force * 25;
    }

    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 1.2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.fill();
  }

  requestAnimationFrame(animate);
}

buildDots();
animate();
