//ROCKET
(function () {
  const rocketCanvas = document.createElement("canvas");
  rocketCanvas.style.cssText =
    "position:absolute;top:0;left:0;width:100%;height:100%;z-index:2;pointer-events:none;";
  const heroSection = document.getElementById("hero");
  heroSection.prepend(rocketCanvas);
  const rctx = rocketCanvas.getContext("2d");
  function resize() {
    rocketCanvas.width = heroSection.offsetWidth;
    rocketCanvas.height = heroSection.offsetHeight;
  }
  window.addEventListener("resize", resize);
  resize();
  let mouse = {
    x: heroSection.offsetWidth * 0.7,
    y: heroSection.offsetHeight * 0.4,
  };
  heroSection.addEventListener("mousemove", (e) => {
    const rect = heroSection.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  heroSection.addEventListener("mouseleave", () => {
    mouse.x = heroSection.offsetWidth * 0.7;
    mouse.y = heroSection.offsetHeight * 0.4;
  });
  let r = {
    x: heroSection.offsetWidth * 0.72,
    y: heroSection.offsetHeight * 0.38,
    angle: -Math.PI / 2,
    velocity: { x: 0, y: 0 },
    scale: 0.45,
    trail: [],
  };
  function drawRocket(ctx, x, y, angle, scale) {
    const isLight = document.body.classList.contains("light");
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2);
    ctx.scale(scale, scale);
    ctx.globalAlpha = 1;
    ctx.fillStyle = isLight ? "#c7580a" : "#ffffff";
    ctx.fill(
      new Path2D(
        "M0,-25 C-8,-20 -9,-10 -9,0 L-9,15 Q0,20 9,15 L9,0 C9,-10 8,-20 0,-25 Z",
      ),
    );
    ctx.fillStyle = isLight ? "#e07b3a" : "#c8b6ff";
    ctx.fill(new Path2D("M-9,10 L-18,20 L-9,18 Z"));
    ctx.fill(new Path2D("M9,10 L18,20 L9,18 Z"));
    ctx.globalAlpha = 0.7 + Math.random() * 0.3;
    ctx.fillStyle = isLight ? "#f5a623" : "#fff";
    const flen = 12 + Math.random() * 10;
    ctx.beginPath();
    ctx.moveTo(-3, 15);
    ctx.lineTo(3, 15);
    ctx.lineTo(0, 15 + flen);
    ctx.fill();
    ctx.restore();
  }
  function animate() {
    rctx.clearRect(0, 0, rocketCanvas.width, rocketCanvas.height);
    const isLight = document.body.classList.contains("light");
    const dx = mouse.x - r.x,
      dy = mouse.y - r.y,
      dist = Math.hypot(dx, dy),
      speed = Math.min(dist * 0.002, 0.08);
    r.velocity.x = dx * speed;
    r.velocity.y = dy * speed;
    r.x += r.velocity.x;
    r.y += r.velocity.y;
    const targetAngle = Math.atan2(r.velocity.y, r.velocity.x);
    let diff = targetAngle - r.angle;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    r.angle += diff * 0.1;
    r.trail.push({ x: r.x, y: r.y });
    if (r.trail.length > 20) r.trail.shift();
    for (let i = 0; i < r.trail.length; i++) {
      const t = r.trail[i],
        ratio = i / r.trail.length;
      rctx.globalAlpha = ratio * 0.25;
      rctx.fillStyle = isLight ? `rgba(245,166,35,1)` : `rgba(165,180,252,1)`;
      rctx.beginPath();
      rctx.arc(t.x, t.y, 3 * ratio, 0, Math.PI * 2);
      rctx.fill();
    }
    drawRocket(rctx, r.x, r.y, r.angle, r.scale);
    requestAnimationFrame(animate);
  }
  new ResizeObserver(resize).observe(heroSection);
  animate();
})();

// PARTICLES
const canvas = document.createElement("canvas");
canvas.style.cssText = "position:fixed;inset:0;z-index:0;pointer-events:none;";
document.body.prepend(canvas);
const ctx = canvas.getContext("2d");
let stars = [];
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
function initStars() {
  stars = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.2 + 0.2,
    opacity: Math.random() * 0.5 + 0.1,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5,
    twinkle: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.02 + 0.005,
  }));
}
initStars();
function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const isLight = document.body.classList.contains("light");
  stars.forEach((s) => {
    s.twinkle += s.twinkleSpeed;
    const alpha = s.opacity + Math.sin(s.twinkle) * 0.15;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = isLight
      ? `rgba(200,140,60,${Math.max(0, alpha * 0.35)})`
      : `rgba(200,200,255,${Math.max(0, alpha)})`;
    ctx.fill();
    s.x += s.speedX;
    s.y += s.speedY;
    if (s.x < 0) s.x = canvas.width;
    if (s.x > canvas.width) s.x = 0;
    if (s.y < 0) s.y = canvas.height;
    if (s.y > canvas.height) s.y = 0;
  });
  requestAnimationFrame(drawStars);
}
drawStars();

// LOADER
const loader = document.getElementById("loader");
const loaderPercent = document.getElementById("loaderPercent");
let pct = 0;

const ticker = setInterval(() => {
  // Angka naik secara organik
  pct += Math.floor(Math.random() * 5) + 2;

  if (pct >= 100) {
    pct = 100;
    clearInterval(ticker);

    // TIMELINE ANIMASI SINEMATIK:

    // 1. Teks memudar (setelah jeda 400ms di angka 100)
    setTimeout(() => {
      loader.classList.add("hide-content");
    }, 400);

    // 2. Garis tengah menjalar (setelah teks hilang)
    setTimeout(() => {
      loader.classList.add("show-line");
    }, 900);

    // 3. Tirai terbuka ke atas dan bawah
    setTimeout(() => {
      loader.classList.add("open-curtain");
    }, 1400);

    // 4. Sembunyikan kontainer loader sepenuhnya
    setTimeout(() => {
      loader.classList.add("hidden");
    }, 2600);
  }

  // Format angka agar selalu 2 digit
  loaderPercent.textContent = pct.toString().padStart(2, "0");
}, 100); // Sedikit dipercepat supaya angkanya ngalir lebih smooth

// CURSOR
const dot = document.getElementById("cursorDot");
const ring = document.getElementById("cursorRing");
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;
document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
  dot.style.left = mx + "px";
  dot.style.top = my + "px";
});
(function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + "px";
  ring.style.top = ry + "px";
  requestAnimationFrame(animateRing);
})();
document.querySelectorAll("a,button,.proj-card,.skill-chip").forEach((el) => {
  el.addEventListener("mouseenter", () => ring.classList.add("hovered"));
  el.addEventListener("mouseleave", () => ring.classList.remove("hovered"));
});

// THEME
function syncLabels(isLight) {
  const icon = isLight ? "☀️" : "🌙",
    label = isLight ? "dark" : "light";
  document.getElementById("themeToggle").textContent = `${icon} ${label}`;
  document.getElementById("themeToggleMobile").textContent = `${icon} ${label}`;
}
function toggleTheme() {
  document.body.classList.toggle("light");
  syncLabels(document.body.classList.contains("light"));
}
document.getElementById("themeToggle").addEventListener("click", toggleTheme);
document
  .getElementById("themeToggleMobile")
  .addEventListener("click", toggleTheme);

// TYPING
const typingTarget = document.getElementById("typingTarget");
const typingText = "Fathurrahman.";
let ti = 0,
  del = false;
function typeLoop() {
  typingTarget.textContent = typingText.slice(0, ti);
  if (!del && ti === typingText.length) {
    setTimeout(() => {
      del = true;
      typeLoop();
    }, 2000);
    return;
  }
  if (del && ti === 0) {
    del = false;
    setTimeout(typeLoop, 600);
    return;
  }
  ti += del ? -1 : 1;
  setTimeout(typeLoop, del ? 45 : 80);
}
setTimeout(typeLoop, 900);

// REVEAL
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting)
        setTimeout(() => entry.target.classList.add("visible"), i * 80);
    });
  },
  { threshold: 0.1 },
);
reveals.forEach((el) => observer.observe(el));

// NAV ACTIVE
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((s) => {
    if (window.scrollY >= s.offsetTop - 150) current = s.id;
  });
  navLinks.forEach((a) => {
    a.style.color =
      a.getAttribute("href") === "#" + current ? "var(--text)" : "";
  });
});

// FORM
document
  .getElementById("contactForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const status = document.getElementById("formStatus");
    const btn = this.querySelector('button[type="submit"]');
    btn.textContent = "Sending...";
    btn.disabled = true;
    try {
      const res = await fetch("https://formspree.io/f/mnjgrddr", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(this),
      });
      if (res.ok) {
        status.textContent = "// Message sent successfully!";
        status.className = "form-status success";
        this.reset();
      } else throw new Error();
    } catch {
      status.textContent = "// Failed to send. Try emailing directly.";
      status.className = "form-status error";
    }
    btn.textContent = "Send Message";
    btn.disabled = false;
  });

// HAMBURGER
const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileMenu = document.getElementById("mobileMenu");
hamburgerBtn.addEventListener("click", () => {
  hamburgerBtn.classList.toggle("open");
  mobileMenu.classList.toggle("open");
});
document.querySelectorAll(".mobile-nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburgerBtn.classList.remove("open");
    mobileMenu.classList.remove("open");
  });
});
