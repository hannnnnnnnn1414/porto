// ROCKET
(function () {
  const rocketCanvas = document.createElement("canvas");
  rocketCanvas.style.cssText =
    "position:absolute;top:0;left:0;width:100%;height:100%;z-index:2;pointer-events:none;";
  const heroSection = document.getElementById("hero");
  heroSection.prepend(rocketCanvas);
  const rctx = rocketCanvas.getContext("2d");

  const scoreBoard = document.createElement("div");
  scoreBoard.id = "scoreBoard";
  document.body.appendChild(scoreBoard);

  const exitBtn = document.createElement("button");
  exitBtn.id = "exitGameBtn";
  exitBtn.textContent = "EXIT GAME";
  document.body.appendChild(exitBtn);

  let isGameMode = false;
  let score = 0;
  let enemies = [];
  let bossBullets = [];
  let isGameOver = false;
  let isGameWon = false;
  let boss = null;

  function initGame() {
    document.body.classList.add("game-mode");
    isGameMode = true;
    score = 0;
    enemies = [];
    bossBullets = [];
    isGameOver = false;
    isGameWon = false;
    boss = null;
    scoreBoard.textContent = "SCORE: 0";
    rocketCanvas.style.position = "fixed";
    rocketCanvas.style.pointerEvents = "auto";
    r.x = window.innerWidth / 2;
    r.y = window.innerHeight - 100;
    resize();
  }

  function exitGame() {
    document.body.classList.remove("game-mode");
    isGameMode = false;
    isGameOver = false;
    isGameWon = false;
    boss = null;
    enemies = [];
    bossBullets = [];
    rocketCanvas.style.position = "absolute";
    rocketCanvas.style.pointerEvents = "none";
    r.x = heroSection.offsetWidth * 0.72;
    r.y = heroSection.offsetHeight * 0.38;
    r.angle = -Math.PI / 2;
    resize();
  }

  const playBtn = document.getElementById("playBtn");
  if (playBtn) playBtn.addEventListener("click", initGame);
  exitBtn.addEventListener("click", exitGame);

  function resize() {
    if (isGameMode) {
      rocketCanvas.width = window.innerWidth;
      rocketCanvas.height = window.innerHeight;
    } else {
      rocketCanvas.width = heroSection.offsetWidth;
      rocketCanvas.height = heroSection.offsetHeight;
    }
  }
  window.addEventListener("resize", resize);
  resize();

  let mouse = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.8,
  };

  window.addEventListener("mousemove", (e) => {
    if (isGameMode) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    } else {
      const rect = heroSection.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
  });

  heroSection.addEventListener("mouseleave", () => {
    if (!isGameMode) {
      mouse.x = heroSection.offsetWidth * 0.7;
      mouse.y = heroSection.offsetHeight * 0.4;
      isFiring = false;
    }
  });

  let bullets = [];
  let isFiring = false;
  let fireCooldown = 0;

  window.addEventListener("mousedown", () => {
    if (isGameMode && (isGameOver || isGameWon)) {
      initGame();
      return;
    }
    isFiring = true;
  });
  window.addEventListener("mouseup", () => (isFiring = false));

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

  function drawEnemy(ctx, x, y, radius) {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      let angle = (Math.PI / 4) * i;
      let r2 = i % 2 === 0 ? radius : radius * 0.5;
      ctx.lineTo(x + Math.cos(angle) * r2, y + Math.sin(angle) * r2);
    }
    ctx.closePath();
    ctx.fillStyle = "#ff6a88";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function animate() {
    rctx.clearRect(0, 0, rocketCanvas.width, rocketCanvas.height);
    const isLight = document.body.classList.contains("light");

    if (isGameMode && !isGameOver && !isGameWon) {
      if (score >= 200 && !boss) {
        boss = {
          x: rocketCanvas.width / 2,
          y: -100,
          radius: 45,
          hp: 200,
          maxHp: 200,
          vx: 4,
          vy: 1,
        };
      }

      if (!boss && Math.random() < 0.04) {
        enemies.push({
          x: Math.random() * rocketCanvas.width,
          y: -30,
          radius: 12 + Math.random() * 15,
          speed: 2 + Math.random() * 4,
        });
      }
    }

    if (boss && !isGameOver && !isGameWon) {
      boss.x += boss.vx;
      boss.y += boss.vy;

      if (
        boss.x - boss.radius < 0 ||
        boss.x + boss.radius > rocketCanvas.width
      ) {
        boss.vx *= -1;
      }
      if (boss.y > 150) {
        boss.vy = 0;
      }

      if (Math.random() < 0.03) {
        let angle = Math.atan2(r.y - boss.y, r.x - boss.x);
        bossBullets.push({
          x: boss.x,
          y: boss.y,
          vx: Math.cos(angle) * 7,
          vy: Math.sin(angle) * 7,
        });
      }

      rctx.save();
      rctx.translate(boss.x, boss.y);
      rctx.beginPath();
      rctx.moveTo(0, boss.radius);
      rctx.lineTo(-boss.radius, 0);
      rctx.lineTo(-boss.radius * 0.5, -boss.radius);
      rctx.lineTo(boss.radius * 0.5, -boss.radius);
      rctx.lineTo(boss.radius, 0);
      rctx.closePath();
      rctx.fillStyle = "#ff3366";
      rctx.fill();
      rctx.strokeStyle = "#ffffff";
      rctx.lineWidth = 3;
      rctx.stroke();
      rctx.beginPath();
      rctx.arc(0, 0, boss.radius * 0.3, 0, Math.PI * 2);
      rctx.fillStyle = "#1a1208";
      rctx.fill();
      rctx.restore();

      rctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      rctx.fillRect(boss.x - 50, boss.y - boss.radius - 20, 100, 8);
      rctx.fillStyle = "#6affcb";
      rctx.fillRect(
        boss.x - 50,
        boss.y - boss.radius - 20,
        100 * (boss.hp / boss.maxHp),
        8,
      );

      let dist = Math.hypot(r.x - boss.x, r.y - boss.y);
      if (dist < 12 + boss.radius) {
        isGameOver = true;
      }
    }

    for (let i = bossBullets.length - 1; i >= 0; i--) {
      let bb = bossBullets[i];
      bb.x += bb.vx;
      bb.y += bb.vy;

      rctx.beginPath();
      rctx.arc(bb.x, bb.y, 5, 0, Math.PI * 2);
      rctx.fillStyle = "#ff3366";
      rctx.fill();
      rctx.strokeStyle = "#ffffff";
      rctx.lineWidth = 1.5;
      rctx.stroke();

      if (
        bb.x < 0 ||
        bb.x > rocketCanvas.width ||
        bb.y < 0 ||
        bb.y > rocketCanvas.height
      ) {
        bossBullets.splice(i, 1);
        continue;
      }

      let dist = Math.hypot(bb.x - r.x, bb.y - r.y);
      if (dist < 12 + 5) {
        isGameOver = true;
      }
    }

    if (isFiring && fireCooldown <= 0 && !isGameOver && !isGameWon) {
      const bulletSpeed = 12;
      const offsetX = Math.cos(r.angle) * 15;
      const offsetY = Math.sin(r.angle) * 15;
      bullets.push({
        x: r.x + offsetX,
        y: r.y + offsetY,
        vx: Math.cos(r.angle) * bulletSpeed,
        vy: Math.sin(r.angle) * bulletSpeed,
      });
      fireCooldown = 6;
    }
    if (fireCooldown > 0) fireCooldown--;

    for (let i = bullets.length - 1; i >= 0; i--) {
      let b = bullets[i];
      b.x += b.vx;
      b.y += b.vy;

      rctx.beginPath();
      rctx.arc(b.x, b.y, 2.5, 0, Math.PI * 2);
      rctx.fillStyle = isLight ? "#c7580a" : "#ffffff";
      rctx.fill();

      if (
        b.x < 0 ||
        b.x > rocketCanvas.width ||
        b.y < 0 ||
        b.y > rocketCanvas.height
      ) {
        bullets.splice(i, 1);
        continue;
      }

      let hit = false;

      if (boss && !isGameOver && !isGameWon) {
        let dist = Math.hypot(b.x - boss.x, b.y - boss.y);
        if (dist < 2.5 + boss.radius) {
          boss.hp -= 5;
          bullets.splice(i, 1);
          hit = true;
          if (boss.hp <= 0) {
            boss = null;
            isGameWon = true;
            score += 500;
            scoreBoard.textContent = "SCORE: " + score;
          }
          continue;
        }
      }

      if (isGameMode && !isGameOver && !isGameWon && !hit) {
        for (let j = enemies.length - 1; j >= 0; j--) {
          let e = enemies[j];
          let dist = Math.hypot(b.x - e.x, b.y - e.y);
          if (dist < 2.5 + e.radius) {
            enemies.splice(j, 1);
            bullets.splice(i, 1);
            score += 10;
            scoreBoard.textContent = "SCORE: " + score;
            break;
          }
        }
      }
    }

    if (isGameMode && !isGameOver && !isGameWon) {
      for (let i = enemies.length - 1; i >= 0; i--) {
        let e = enemies[i];
        e.y += e.speed;
        drawEnemy(rctx, e.x, e.y, e.radius);

        if (e.y > rocketCanvas.height + e.radius) {
          enemies.splice(i, 1);
        }

        let dist = Math.hypot(r.x - e.x, r.y - e.y);
        if (dist < 12 + e.radius) {
          isGameOver = true;
        }
      }
    }

    if (isGameOver || isGameWon) {
      rctx.fillStyle = isLight ? "#1a1208" : "#ffffff";
      rctx.font = "bold 40px 'Space Mono', monospace";
      rctx.textAlign = "center";
      if (isGameWon) {
        rctx.fillStyle = "#6affcb";
        rctx.fillText(
          "YOU WIN!",
          rocketCanvas.width / 2,
          rocketCanvas.height / 2,
        );
      } else {
        rctx.fillStyle = "#ff6a88";
        rctx.fillText(
          "GAME OVER",
          rocketCanvas.width / 2,
          rocketCanvas.height / 2,
        );
      }
      rctx.fillStyle = isLight ? "#1a1208" : "#ffffff";
      rctx.font = "20px 'Space Mono', monospace";
      rctx.fillText(
        "Click anywhere to Restart",
        rocketCanvas.width / 2,
        rocketCanvas.height / 2 + 40,
      );
      rctx.fillText(
        "or click EXIT GAME",
        rocketCanvas.width / 2,
        rocketCanvas.height / 2 + 70,
      );
    } else {
      let dx, dy, speed;
      if (isGameMode) {
        dx = mouse.x - r.x;
        dy = mouse.y - r.y;
        let dist = Math.hypot(dx, dy);
        speed = Math.min(dist * 0.08, 12);
        r.velocity.x = (dx / dist) * speed || 0;
        r.velocity.y = (dy / dist) * speed || 0;
      } else {
        dx = mouse.x - r.x;
        dy = mouse.y - r.y;
        let dist = Math.hypot(dx, dy);
        speed = Math.min(dist * 0.002, 0.08);
        r.velocity.x = dx * speed;
        r.velocity.y = dy * speed;
      }

      r.x += r.velocity.x;
      r.y += r.velocity.y;

      const targetAngle = isGameMode
        ? -Math.PI / 2
        : Math.atan2(r.velocity.y, r.velocity.x);
      let diff = targetAngle - r.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      r.angle += diff * (isGameMode ? 0.3 : 0.1);
    }

    if (!isGameOver && !isGameWon) {
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
    }

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
  pct += Math.floor(Math.random() * 5) + 2;

  if (pct >= 100) {
    pct = 100;
    clearInterval(ticker);

    setTimeout(() => {
      loader.classList.add("hide-content");
    }, 400);

    setTimeout(() => {
      loader.classList.add("show-line");
    }, 900);

    setTimeout(() => {
      loader.classList.add("open-curtain");
    }, 1400);

    setTimeout(() => {
      loader.classList.add("hidden");
    }, 2600);
  }

  loaderPercent.textContent = pct.toString().padStart(2, "0");
}, 100);

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

window.addEventListener("scroll", () => {
  const scrollProgress = document.getElementById("scrollProgress");
  const scrollTotal =
    document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / scrollTotal) * 100;

  scrollProgress.style.width = scrolled + "%";
});

// MOON EXPLOSION EFFECT
const moonContainer = document.querySelector(".moon-container");
const moonSvg = document.querySelector(".moon");
let isMoonExploding = false;

moonContainer.addEventListener("mouseenter", () =>
  document.getElementById("cursorRing").classList.add("hovered"),
);
moonContainer.addEventListener("mouseleave", () =>
  document.getElementById("cursorRing").classList.remove("hovered"),
);

moonContainer.addEventListener("click", () => {
  if (isMoonExploding) return;
  isMoonExploding = true;

  moonSvg.style.transition = "opacity 0.1s";
  moonSvg.style.opacity = "0";

  const mCanvas = document.createElement("canvas");
  mCanvas.width = 300;
  mCanvas.height = 300;
  mCanvas.style.position = "absolute";
  mCanvas.style.top = "-95px";
  mCanvas.style.left = "-95px";
  mCanvas.style.pointerEvents = "none";
  moonContainer.appendChild(mCanvas);

  const mCtx = mCanvas.getContext("2d");
  const particles = [];
  const colors = ["#f0f0ff", "#d0d0e8", "#e0e0f8", "#ffffff"];

  for (let i = 0; i < 80; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 45;

    const startX = 150 + Math.cos(angle) * radius;
    const startY = 150 + Math.sin(angle) * radius;
    const speed = Math.random() * 6 + 2;

    particles.push({
      x: startX,
      y: startY,
      originX: startX,
      originY: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 3.5 + 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  const startTime = Date.now();

  function animateExplosion() {
    const elapsed = Date.now() - startTime;
    mCtx.clearRect(0, 0, mCanvas.width, mCanvas.height);

    particles.forEach((p) => {
      if (elapsed < 1400) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.93;
        p.vy *= 0.93;
      } else if (elapsed < 3000) {
        const returnSpeed = 0.08;
        p.x += (p.originX - p.x) * returnSpeed;
        p.y += (p.originY - p.y) * returnSpeed;
      }

      mCtx.beginPath();
      mCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      mCtx.fillStyle = p.color;
      mCtx.fill();
    });

    if (elapsed < 3000) {
      requestAnimationFrame(animateExplosion);
    } else {
      mCanvas.remove();
      moonSvg.style.opacity = "1";
      isMoonExploding = false;
    }
  }

  animateExplosion();
});

// --- TOUCH EVENTS UNTUK MOBILE ---

window.addEventListener(
  "touchstart",
  (e) => {
    if (isGameMode && (isGameOver || isGameWon)) {
      initGame();
      e.preventDefault();
      return;
    }

    isFiring = true;

    const touch = e.touches[0];
    if (isGameMode) {
      mouse.x = touch.clientX;
      mouse.y = touch.clientY;
      e.preventDefault();
    } else {
      const rect = heroSection.getBoundingClientRect();
      mouse.x = touch.clientX - rect.left;
      mouse.y = touch.clientY - rect.top;
    }
  },
  { passive: false },
);

window.addEventListener(
  "touchmove",
  (e) => {
    const touch = e.touches[0];
    if (isGameMode) {
      mouse.x = touch.clientX;
      mouse.y = touch.clientY;
      e.preventDefault();
    } else {
      const rect = heroSection.getBoundingClientRect();
      mouse.x = touch.clientX - rect.left;
      mouse.y = touch.clientY - rect.top;
    }
  },
  { passive: false },
);

window.addEventListener(
  "touchend",
  (e) => {
    if (isGameMode) {
      e.preventDefault();
    }
    isFiring = false;
  },
  { passive: false },
);

window.addEventListener("touchcancel", () => {
  isFiring = false;
});
