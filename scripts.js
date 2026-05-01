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
  let particles = [];
  let enemyBullets = [];
  let bossBullets = [];
  let isGameOver = false;
  let isGameWon = false;
  let boss = null;

  function createEnemyCache(radius) {
    const cacheCanvas = document.createElement("canvas");
    const padding = 40;
    cacheCanvas.width = radius * 3 + padding;
    cacheCanvas.height = radius * 3 + padding;
    const ctxCache = cacheCanvas.getContext("2d");

    ctxCache.translate(cacheCanvas.width / 2, cacheCanvas.height / 2);

    ctxCache.shadowBlur = 10;
    ctxCache.shadowColor = "#ffc640";

    ctxCache.beginPath();
    ctxCache.arc(0, -radius * 0.1, radius * 0.35, 0, Math.PI * 2);
    ctxCache.fillStyle = "#ffc640";
    ctxCache.fill();

    ctxCache.beginPath();
    ctxCache.arc(-radius * 0.05, -radius * 0.1, radius * 0.35, 0, Math.PI * 2);
    ctxCache.fillStyle = "#1a1208";
    ctxCache.fill();

    ctxCache.shadowBlur = 0;

    ctxCache.beginPath();
    ctxCache.moveTo(0, radius);
    ctxCache.lineTo(radius * 0.6, -radius * 0.6);
    ctxCache.lineTo(-radius * 0.6, -radius * 0.6);
    ctxCache.closePath();
    ctxCache.fillStyle = "#1a1208";
    ctxCache.fill();

    ctxCache.beginPath();
    ctxCache.moveTo(-radius * 0.4, -radius * 0.8);
    ctxCache.lineTo(-radius * 0.2, -radius * 1.1);
    ctxCache.lineTo(0, -radius * 0.9);
    ctxCache.lineTo(radius * 0.2, -radius * 1.1);
    ctxCache.lineTo(radius * 0.4, -radius * 0.8);
    ctxCache.closePath();
    ctxCache.fillStyle = "#1a1208";
    ctxCache.fill();
    ctxCache.strokeStyle = "#ffffff";
    ctxCache.lineWidth = 1.5;
    ctxCache.stroke();

    ctxCache.beginPath();
    ctxCache.moveTo(radius * 0.6, -radius * 0.2);
    ctxCache.bezierCurveTo(
      radius * 1.5,
      -radius * 0.5,
      radius * 1.3,
      radius,
      radius * 0.8,
      radius,
    );
    ctxCache.lineTo(radius * 0.7, radius * 0.8);
    ctxCache.lineTo(radius * 0.9, radius * 0.8);
    ctxCache.lineTo(radius * 0.8, radius * 0.6);
    ctxCache.lineTo(radius * 1.0, radius * 0.6);
    ctxCache.lineTo(radius * 0.9, radius * 0.4);
    ctxCache.lineTo(radius * 1.1, radius * 0.4);
    ctxCache.lineTo(radius * 1.0, radius * 0.2);
    ctxCache.lineTo(radius * 1.2, radius * 0.2);
    ctxCache.lineTo(radius * 0.6, -radius * 0.2);
    ctxCache.closePath();
    ctxCache.fillStyle = "#1a1208";
    ctxCache.fill();
    ctxCache.stroke();

    ctxCache.beginPath();
    ctxCache.moveTo(-radius * 0.6, -radius * 0.2);
    ctxCache.bezierCurveTo(
      -radius * 1.5,
      -radius * 0.5,
      -radius * 1.3,
      radius,
      -radius * 0.8,
      radius,
    );
    ctxCache.lineTo(-radius * 0.7, radius * 0.8);
    ctxCache.lineTo(-radius * 0.9, radius * 0.8);
    ctxCache.lineTo(-radius * 0.8, radius * 0.6);
    ctxCache.lineTo(-radius * 1.0, radius * 0.6);
    ctxCache.lineTo(-radius * 0.9, radius * 0.4);
    ctxCache.lineTo(-radius * 1.1, radius * 0.4);
    ctxCache.lineTo(-radius * 1.0, radius * 0.2);
    ctxCache.lineTo(-radius * 1.2, radius * 0.2);
    ctxCache.lineTo(-radius * 0.6, -radius * 0.2);
    ctxCache.closePath();
    ctxCache.fillStyle = "#1a1208";
    ctxCache.fill();
    ctxCache.stroke();

    ctxCache.beginPath();
    ctxCache.moveTo(radius * 0.8, -radius * 0.1);
    ctxCache.bezierCurveTo(
      radius * 1.2,
      -radius * 0.3,
      radius * 1.1,
      radius * 0.6,
      radius * 0.9,
      radius * 0.6,
    );
    ctxCache.strokeStyle = "#ff3366";
    ctxCache.lineWidth = 3;
    ctxCache.stroke();

    ctxCache.beginPath();
    ctxCache.moveTo(-radius * 0.8, -radius * 0.1);
    ctxCache.bezierCurveTo(
      -radius * 1.2,
      -radius * 0.3,
      -radius * 1.1,
      radius * 0.6,
      -radius * 0.9,
      radius * 0.6,
    );
    ctxCache.strokeStyle = "#ff3366";
    ctxCache.stroke();

    return cacheCanvas;
  }

  const enemyShooterImage = createEnemyCache(22);
  const enemyKamikazeImage = createEnemyCache(14);

  window.initGame = function initGame() {
    document.body.classList.add("game-mode");
    isGameMode = true;
    score = 0;
    enemies = [];
    bossBullets = [];
    particles = [];
    enemyBullets = [];
    isGameOver = false;
    isGameWon = false;
    boss = null;
    scoreBoard.textContent = "SCORE: 0/200";
    rocketCanvas.style.position = "fixed";
    rocketCanvas.style.pointerEvents = "auto";
    r.x = window.innerWidth / 2;
    r.y = window.innerHeight - 100;
    resize();
  };

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
  if (playBtn) playBtn.addEventListener("click", window.initGame);
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
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;
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

  const rocketBodyPath = new Path2D(
    "M0,-25 C-8,-20 -9,-10 -9,0 L-9,15 Q0,20 9,15 L9,0 C9,-10 8,-20 0,-25 Z",
  );
  const leftWingPath = new Path2D("M-9,10 L-18,20 L-9,18 Z");
  const rightWingPath = new Path2D("M9,10 L18,20 L9,18 Z");

  function drawRocket(ctx, x, y, angle, scale) {
    const isLight = document.body.classList.contains("light");
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2);
    ctx.scale(scale, scale);
    ctx.globalAlpha = 1;

    ctx.fillStyle = isLight ? "#c7580a" : "#ffffff";
    ctx.fill(rocketBodyPath);

    ctx.fillStyle = isLight ? "#e07b3a" : "#c8b6ff";
    ctx.fill(leftWingPath);
    ctx.fill(rightWingPath);

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
    const img = radius === 22 ? enemyShooterImage : enemyKamikazeImage;

    ctx.drawImage(img, x - img.width / 2, y - img.height / 2);
  }

  function createExplosion(x, y, color) {
    if (particles.length > 100) return;
    for (let i = 0; i < 15; i++) {
      particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 1,
        color: color,
      });
    }
  }

  // --- ANALOG JOYSTICK LOGIC ---
  if (isTouchDevice) {
    document.body.classList.add("is-touch");
  }

  const joystickZone = document.getElementById("joystickZone");
  const joystickKnob = document.getElementById("joystickKnob");

  let joyActive = false;
  let joyVector = { x: 0, y: 0 };
  let joyCenter = { x: 0, y: 0 };

  if (joystickZone) {
    joystickZone.addEventListener("touchstart", handleJoyStart, {
      passive: false,
    });
    joystickZone.addEventListener("touchmove", handleJoyMove, {
      passive: false,
    });
    joystickZone.addEventListener("touchend", handleJoyEnd);
    joystickZone.addEventListener("touchcancel", handleJoyEnd);
  }

  function handleJoyStart(e) {
    e.stopPropagation();
    e.preventDefault();
    joyActive = true;
    const rect = joystickZone.getBoundingClientRect();
    joyCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    updateJoyVector(e.touches[0]);
  }

  function handleJoyMove(e) {
    e.stopPropagation();
    e.preventDefault();
    if (!joyActive) return;
    updateJoyVector(e.touches[0]);
  }

  function handleJoyEnd(e) {
    e.stopPropagation();
    joyActive = false;
    joyVector = { x: 0, y: 0 };
    joystickKnob.style.transform = `translate(-50%, -50%)`;
  }

  function updateJoyVector(touch) {
    let dx = touch.clientX - joyCenter.x;
    let dy = touch.clientY - joyCenter.y;
    const maxRadius = 60;
    let dist = Math.hypot(dx, dy);

    if (dist > maxRadius) {
      dx = (dx / dist) * maxRadius;
      dy = (dy / dist) * maxRadius;
    }

    joystickKnob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;

    joyVector.x = dx / maxRadius;
    joyVector.y = dy / maxRadius;
  }

  let lastTime = 0;
  const targetFPS = 60;
  const frameInterval = 1000 / targetFPS;

  function animate(currentTime) {
    requestAnimationFrame(animate);

    if (!currentTime) currentTime = performance.now();
    const deltaTime = currentTime - lastTime;

    if (deltaTime >= frameInterval) {
      lastTime = currentTime - (deltaTime % frameInterval);

      rctx.clearRect(0, 0, rocketCanvas.width, rocketCanvas.height);

      rctx.globalAlpha = 1;
      rctx.globalCompositeOperation = "source-over";
      rctx.shadowBlur = 0;

      const isLight = document.body.classList.contains("light");

      if (isGameMode && !isGameOver && !isGameWon) {
        if (score >= 200 && !boss) {
          boss = {
            x: rocketCanvas.width / 2,
            y: -150,
            radius: 80,
            hp: 800,
            maxHp: 800,
            vx: 3,
            vy: 1.5,
            attackTimer: 0,
            laserActive: false,
            laserDuration: 0,
            laserWarnTimer: 0,
            isUltimate: false,
            ultimateTimer: 0,
          };
        }

        if (!boss && Math.random() < 0.04) {
          let isShooter = Math.random() < 0.3;
          enemies.push({
            x: Math.random() * rocketCanvas.width,
            y: -30,
            radius: isShooter ? 22 : 14,
            speed: isShooter
              ? 1.5 + Math.random() * 1.5
              : 3 + Math.random() * 3,
            type: isShooter ? "shooter" : "kamikaze",
            shootTimer: 0,
          });
        }
      }

      if (boss && !isGameOver && !isGameWon) {
        if (!boss.isUltimate) {
          // --- MODE NORMAL ---
          if (boss.y < 150) {
            boss.y += boss.vy;
          } else {
            boss.x += boss.vx;
            if (
              boss.x - boss.radius < 0 ||
              boss.x + boss.radius > rocketCanvas.width
            ) {
              boss.vx *= -1;
            }
          }

          boss.attackTimer++;

          if (
            boss.attackTimer % 50 === 0 &&
            !boss.laserActive &&
            boss.laserWarnTimer <= 0
          ) {
            let baseAngle = Math.atan2(r.y - boss.y, r.x - boss.x);
            for (let i = -2; i <= 2; i++) {
              let angle = baseAngle + i * 0.25;
              bossBullets.push({
                x: boss.x,
                y: boss.y + boss.radius * 0.5,
                vx: Math.cos(angle) * 6,
                vy: Math.sin(angle) * 6,
              });
            }
          }

          if (boss.attackTimer === 150) {
            boss.laserWarnTimer = 40;
            boss.vx = 0;
          }

          if (boss.laserWarnTimer > 0) {
            boss.laserWarnTimer--;
            if (boss.laserWarnTimer === 0) {
              boss.laserActive = true;
              boss.laserDuration = 50;
            }
          }

          if (boss.laserActive) {
            boss.laserDuration--;
            if (boss.laserDuration <= 0) {
              boss.laserActive = false;
              boss.attackTimer = 0;
              boss.vx = Math.random() > 0.5 ? 3 : -3;
            }
          }

          let dist = Math.hypot(r.x - boss.x, r.y - boss.y);
          if (dist < 12 + boss.radius * 0.8) {
            isGameOver = true;
          }
        } else {
          // --- MODE ULTIMATE KIAMAT ---
          boss.ultimateTimer++;

          if (boss.ultimateTimer > 120 && boss.ultimateTimer % 4 === 0) {
            let spiralOffset1 = boss.ultimateTimer * 0.12;
            let spiralOffset2 = -boss.ultimateTimer * 0.12;

            for (let i = 0; i < 18; i++) {
              let angle = spiralOffset1 + (i * (Math.PI * 2)) / 18;
              bossBullets.push({
                x: boss.x + Math.cos(angle) * (boss.radius * 0.8),
                y: boss.y + Math.sin(angle) * (boss.radius * 0.8),
                vx: Math.cos(angle) * 3.5,
                vy: Math.sin(angle) * 3.5,
              });
            }

            for (let i = 0; i < 18; i++) {
              let angle = spiralOffset2 + (i * (Math.PI * 2)) / 18;
              bossBullets.push({
                x: boss.x + Math.cos(angle) * (boss.radius * 0.8),
                y: boss.y + Math.sin(angle) * (boss.radius * 0.8),
                vx: Math.cos(angle) * 3.5,
                vy: Math.sin(angle) * 3.5,
              });
            }
          }

          let distToCore = Math.hypot(r.x - boss.x, r.y - boss.y);
          if (distToCore < boss.radius * 0.8) {
            isGameOver = true;
          }

          let portalX = rocketCanvas.width - 60;
          let portalY = rocketCanvas.height - 60;
          let portalDist = Math.hypot(r.x - portalX, r.y - portalY);

          if (portalDist < 25 && boss.ultimateTimer > 120) {
            createExplosion(boss.x, boss.y, "#ff3366");
            createExplosion(boss.x + 30, boss.y - 20, "#ffc640");
            createExplosion(boss.x - 30, boss.y + 20, "#ffffff");
            createExplosion(portalX, portalY, "#c8b6ff");

            boss = null;
            isGameWon = true;
            score += 1500;
            scoreBoard.textContent = "SCORE: " + score;
          }
        }

        // --- DRAWING PORTAL RAHASIA ---
        if (boss.isUltimate && boss.ultimateTimer > 60) {
          let portalX = rocketCanvas.width - 60;
          let portalY = rocketCanvas.height - 60;
          let pRadius = 15 + Math.sin(boss.ultimateTimer * 0.1) * 4;

          rctx.save();
          rctx.globalAlpha = 0.35 + Math.sin(boss.ultimateTimer * 0.05) * 0.15;

          rctx.beginPath();
          rctx.arc(portalX, portalY, pRadius, 0, Math.PI * 2);
          rctx.fillStyle = "#1a1208";
          rctx.fill();

          rctx.strokeStyle = "#c8b6ff";
          rctx.lineWidth = 1.5;
          rctx.setLineDash([4, 4]);
          rctx.stroke();

          rctx.fillStyle = "#ffffff";
          rctx.globalAlpha = 0.8;
          rctx.fillRect(portalX - 4, portalY - 3, 1.5, 1.5);
          rctx.fillRect(portalX + 5, portalY + 4, 1.5, 1.5);
          rctx.fillRect(portalX - 2, portalY + 6, 1.5, 1.5);

          rctx.restore();
        }

        // --- DRAWING BOS ---
        rctx.save();
        rctx.translate(boss.x, boss.y);

        if (boss.isUltimate) {
          rctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);

          rctx.beginPath();
          rctx.arc(0, 0, boss.radius, 0, Math.PI * 2);
          rctx.fillStyle =
            "rgba(255, 51, 102, " + (0.1 + Math.random() * 0.3) + ")";
          rctx.fill();
        }

        rctx.beginPath();
        rctx.moveTo(0, boss.radius);
        rctx.lineTo(boss.radius, 0);
        rctx.lineTo(boss.radius * 0.6, -boss.radius * 0.8);
        rctx.lineTo(-boss.radius * 0.6, -boss.radius * 0.8);
        rctx.lineTo(-boss.radius, 0);
        rctx.closePath();
        rctx.fillStyle = "#1a1208";
        rctx.fill();
        rctx.strokeStyle = "#ff3366";
        rctx.lineWidth = 3;
        rctx.stroke();

        rctx.beginPath();
        rctx.moveTo(0, boss.radius);
        rctx.lineTo(0, -boss.radius * 0.8);
        rctx.moveTo(-boss.radius * 0.5, -boss.radius * 0.2);
        rctx.lineTo(boss.radius * 0.5, -boss.radius * 0.2);
        rctx.strokeStyle = "rgba(255, 51, 102, 0.5)";
        rctx.stroke();

        rctx.beginPath();
        rctx.arc(0, -boss.radius * 0.1, boss.radius * 0.35, 0, Math.PI * 2);
        rctx.fillStyle =
          boss.laserWarnTimer > 0 || boss.laserActive ? "#6affcb" : "#ff3366";
        rctx.fill();

        rctx.beginPath();
        rctx.arc(0, -boss.radius * 0.1, boss.radius * 0.15, 0, Math.PI * 2);
        rctx.fillStyle = "#ffffff";
        rctx.fill();

        rctx.fillStyle = "#6affcb";
        rctx.fillRect(-boss.radius * 0.8, -10, 8, 20);
        rctx.fillRect(boss.radius * 0.8 - 8, -10, 8, 20);
        rctx.restore();

        if (boss.laserWarnTimer > 0) {
          rctx.beginPath();
          rctx.moveTo(boss.x, boss.y + boss.radius);
          rctx.lineTo(boss.x, rocketCanvas.height);
          rctx.strokeStyle = "rgba(255, 51, 102, 0.4)";
          rctx.lineWidth = 2;
          rctx.setLineDash([15, 15]);
          rctx.stroke();
          rctx.setLineDash([]);
        }

        if (boss.laserActive) {
          let laserWidth = 50 + Math.random() * 15;
          rctx.fillStyle = "rgba(106, 255, 203, 0.9)";
          rctx.shadowBlur = 20;
          rctx.shadowColor = "#6affcb";
          rctx.fillRect(
            boss.x - laserWidth / 2,
            boss.y + boss.radius * 0.5,
            laserWidth,
            rocketCanvas.height,
          );
          rctx.shadowBlur = 0;

          if (
            r.x > boss.x - laserWidth / 2 - 12 &&
            r.x < boss.x + laserWidth / 2 + 12 &&
            r.y > boss.y
          ) {
            isGameOver = true;
          }
        }

        rctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        rctx.fillRect(boss.x - 75, boss.y - boss.radius - 25, 150, 8);
        rctx.fillStyle = "#6affcb";
        rctx.fillRect(
          boss.x - 75,
          boss.y - boss.radius - 25,
          150 * (boss.hp / boss.maxHp),
          8,
        );

        let dist = Math.hypot(r.x - boss.x, r.y - boss.y);
        if (dist < 12 + boss.radius * 0.8) {
          isGameOver = true;
        }
      }

      for (let i = bossBullets.length - 1; i >= 0; i--) {
        let bb = bossBullets[i];
        bb.x += bb.vx;
        bb.y += bb.vy;

        rctx.save();

        rctx.beginPath();
        rctx.arc(bb.x, bb.y, 9, 0, Math.PI * 2);
        rctx.fillStyle = "rgba(255, 51, 102, 0.4)";
        rctx.fill();

        rctx.beginPath();
        rctx.arc(bb.x, bb.y, 4, 0, Math.PI * 2);
        rctx.fillStyle = "#ff3366";
        rctx.fill();

        rctx.strokeStyle = "#ffffff";
        rctx.lineWidth = 1.5;
        rctx.stroke();

        rctx.restore();

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

      const canShoot =
        (isFiring || (isGameMode && isTouchDevice)) &&
        !isGameOver &&
        !isGameWon;

      if (canShoot && fireCooldown <= 0) {
        const bulletSpeed = 12;
        const offsetX = Math.cos(r.angle) * 15;
        const offsetY = Math.sin(r.angle) * 15;

        bullets.push({
          x: r.x + offsetX,
          y: r.y + offsetY,
          vx: Math.cos(r.angle) * bulletSpeed,
          vy: Math.sin(r.angle) * bulletSpeed,
        });

        if (window.rocketBuffActive) {
          bullets.push({
            x: r.x + offsetX,
            y: r.y + offsetY,
            vx: Math.cos(r.angle - 0.2) * bulletSpeed,
            vy: Math.sin(r.angle - 0.2) * bulletSpeed,
          });
          bullets.push({
            x: r.x + offsetX,
            y: r.y + offsetY,
            vx: Math.cos(r.angle + 0.2) * bulletSpeed,
            vy: Math.sin(r.angle + 0.2) * bulletSpeed,
          });
        }

        fireCooldown = 6;
      }
      if (fireCooldown > 0) fireCooldown--;

      for (let i = bullets.length - 1; i >= 0; i--) {
        let b = bullets[i];
        b.x += b.vx;
        b.y += b.vy;

        let angle = Math.atan2(b.vy, b.vx);

        rctx.save();
        rctx.translate(b.x, b.y);
        rctx.rotate(angle);

        rctx.fillRect(-12, -6, 24, 12);

        rctx.fillStyle = "#ffffff";
        rctx.fillRect(-8, -2, 16, 4);

        rctx.restore();

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

        const moonEl = document.querySelector(".moon-container");
        if (moonEl && !hit && window.isMoonExploding !== true) {
          const moonRect = moonEl.getBoundingClientRect();
          const canvasRect = rocketCanvas.getBoundingClientRect();

          const bAbsX = b.x + canvasRect.left;
          const bAbsY = b.y + canvasRect.top;

          const moonCX = moonRect.left + moonRect.width / 2;
          const moonCY = moonRect.top + moonRect.height / 2;
          const moonR = (moonRect.width / 2) * 0.9;

          if (Math.hypot(bAbsX - moonCX, bAbsY - moonCY) < moonR) {
            if (typeof window.triggerMoonExplosion === "function") {
              window.triggerMoonExplosion();
            }
            createExplosion(b.x, b.y, "#f0f0ff");

            bullets.splice(i, 1);
            hit = true;
            continue;
          }
        }

        if (boss && !isGameOver && !isGameWon) {
          let dist = Math.hypot(b.x - boss.x, b.y - boss.y);
          if (dist < 2.5 + boss.radius) {
            if (!boss.isUltimate) {
              boss.hp -= 5;
              createExplosion(b.x, b.y, "#6affcb");
              bullets.splice(i, 1);
              hit = true;

              if (boss.hp <= 0) {
                boss.hp = 1;
                boss.isUltimate = true;
                boss.ultimateTimer = 0;
                boss.vx = 0;
                boss.laserActive = false;
                boss.laserWarnTimer = 0;
              }
            } else {
              createExplosion(b.x, b.y, "#ffffff");
              bullets.splice(i, 1);
              hit = true;
            }
            continue;
          }
        }

        if (isGameMode && !isGameOver && !isGameWon && !hit) {
          for (let j = enemies.length - 1; j >= 0; j--) {
            let e = enemies[j];
            let dist = Math.hypot(b.x - e.x, b.y - e.y);
            if (dist < 2.5 + e.radius) {
              createExplosion(e.x, e.y, "#ffc640");

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

      if (isGameMode && !isGameOver && !isGameWon) {
        for (let i = enemies.length - 1; i >= 0; i--) {
          let e = enemies[i];

          if (e.type === "shooter") {
            e.shootTimer++;
            if (e.shootTimer > 60 && Math.random() < 0.05 && e.y < r.y) {
              let angle = Math.atan2(r.y - e.y, r.x - e.x);
              enemyBullets.push({
                x: e.x,
                y: e.y + e.radius,
                vx: Math.cos(angle) * 6,
                vy: Math.sin(angle) * 6,
              });
              e.shootTimer = 0;
            }
          }
        }
      }

      for (let i = enemyBullets.length - 1; i >= 0; i--) {
        let eb = enemyBullets[i];
        eb.x += eb.vx;
        eb.y += eb.vy;

        let angle = Math.atan2(eb.vy, eb.vx);

        rctx.save();
        rctx.translate(eb.x, eb.y);
        rctx.rotate(angle);

        rctx.shadowBlur = 15;
        rctx.shadowColor = "#ff3366";

        rctx.fillStyle = "#ffffff";
        rctx.fillRect(-6, -1.5, 12, 3);

        rctx.fillStyle = "rgba(255, 51, 102, 0.5)";
        rctx.fillRect(-8, -2.5, 16, 5);

        rctx.restore();

        if (
          eb.x < 0 ||
          eb.x > rocketCanvas.width ||
          eb.y < 0 ||
          eb.y > rocketCanvas.height
        ) {
          enemyBullets.splice(i, 1);
          continue;
        }

        let dist = Math.hypot(eb.x - r.x, eb.y - r.y);
        if (dist < 12 + 3) {
          createExplosion(r.x, r.y, "#ff6a88");
          isGameOver = true;
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.04;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        rctx.globalAlpha = p.life;
        rctx.fillStyle = p.color;
        rctx.beginPath();
        rctx.arc(p.x, p.y, 2 + p.life * 2, 0, Math.PI * 2);
        rctx.fill();
        rctx.globalAlpha = 1;
      }

      if (isGameOver || isGameWon) {
        rctx.fillStyle = isLight ? "#1a1208" : "#ffffff";
        rctx.font = "bold 40px 'Space Mono', monospace";
        rctx.textAlign = "center";
        if (isGameWon) {
          if (Math.random() < 0.1) {
            const randomX = Math.random() * rocketCanvas.width;
            const randomY = Math.random() * (rocketCanvas.height * 0.6);
            const colors = [
              "#6affcb",
              "#ff3366",
              "#ffc640",
              "#ffffff",
              "#39ff14",
            ];
            const randomColor =
              colors[Math.floor(Math.random() * colors.length)];
            createExplosion(randomX, randomY, randomColor);
          }

          rctx.shadowBlur = 20;
          rctx.shadowColor = "#6affcb";
          rctx.fillStyle = "#ffffff";
          rctx.font = "bold 50px 'Space Mono', monospace";
          rctx.fillText(
            "SYSTEM CLEARED!",
            rocketCanvas.width / 2,
            rocketCanvas.height / 2 - 40,
          );

          rctx.shadowBlur = 0;

          rctx.fillStyle = "#ffc640";
          rctx.font = "bold 24px 'Space Mono', monospace";
          rctx.fillText(
            "FINAL SCORE: " + score,
            rocketCanvas.width / 2,
            rocketCanvas.height / 2 + 10,
          );

          rctx.fillStyle = isLight ? "#1a1208" : "#ffffff";
          rctx.font = "italic 16px 'Space Mono', monospace";
          rctx.fillText(
            "// GACOR KANG.",
            rocketCanvas.width / 2,
            rocketCanvas.height / 2 + 60,
          );

          rctx.font = "14px 'Space Mono', monospace";
          rctx.globalAlpha = 0.6;
          rctx.fillText(
            "Click anywhere to Restart or click EXIT GAME",
            rocketCanvas.width / 2,
            rocketCanvas.height / 2 + 130,
          );
          rctx.globalAlpha = 1;
        } else {
          rctx.shadowBlur = 20;
          rctx.shadowColor = "#ff6a88";
          rctx.fillStyle = "#ffffff";
          rctx.font = "bold 50px 'Space Mono', monospace";
          rctx.fillText(
            "GAME OVER",
            rocketCanvas.width / 2,
            rocketCanvas.height / 2 - 20,
          );

          rctx.shadowBlur = 0;
          rctx.fillStyle = isLight ? "#1a1208" : "#ffffff";
          rctx.font = "20px 'Space Mono', monospace";
          rctx.fillText(
            "Click anywhere to Restart",
            rocketCanvas.width / 2,
            rocketCanvas.height / 2 + 30,
          );
          rctx.fillText(
            "or click EXIT GAME",
            rocketCanvas.width / 2,
            rocketCanvas.height / 2 + 60,
          );
        }
      } else {
        let dx, dy, speed;
        if (isGameMode) {
          if (joyActive) {
            speed = Math.min(Math.hypot(joyVector.x, joyVector.y) * 7, 7);
            let angle = Math.atan2(joyVector.y, joyVector.x);
            r.velocity.x = Math.cos(angle) * speed || 0;
            r.velocity.y = Math.sin(angle) * speed || 0;

            if (speed > 0.5) {
              mouse.x = r.x + r.velocity.x * 10;
              mouse.y = r.y + r.velocity.y * 10;
            }
          } else {
            r.velocity.x = (mouse.x - r.x) * 0.35;
            r.velocity.y = (mouse.y - r.y) * 0.35;
          }
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

        if (isGameMode) {
          const padding = 20;

          if (r.x < padding) r.x = padding;
          if (r.x > rocketCanvas.width - padding)
            r.x = rocketCanvas.width - padding;

          if (r.y < padding) r.y = padding;
          if (r.y > rocketCanvas.height - padding)
            r.y = rocketCanvas.height - padding;
        }

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
          rctx.fillStyle = isLight
            ? `rgba(245,166,35,1)`
            : `rgba(165,180,252,1)`;
          rctx.beginPath();
          rctx.arc(t.x, t.y, 3 * ratio, 0, Math.PI * 2);
          rctx.fill();
        }
        drawRocket(rctx, r.x, r.y, r.angle, r.scale);
      }
    }
  }
  new ResizeObserver(resize).observe(heroSection);
  requestAnimationFrame(animate);
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
  if (typeof isGameMode !== "undefined" && isGameMode) {
    requestAnimationFrame(drawStars);
    return;
  }
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

// // THEME
// function syncLabels(isLight) {
//   const icon = isLight ? "☀️" : "🌙",
//     label = isLight ? "dark" : "light";
//   document.getElementById("themeToggle").textContent = `${icon} ${label}`;
//   document.getElementById("themeToggleMobile").textContent = `${icon} ${label}`;
// }
// function toggleTheme() {
//   document.body.classList.toggle("light");
//   syncLabels(document.body.classList.contains("light"));
// }
// document.getElementById("themeToggle").addEventListener("click", toggleTheme);
// document
//   .getElementById("themeToggleMobile")
//   .addEventListener("click", toggleTheme);

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
document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll(".reveal");

  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  };

  const revealOnScroll = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible");
      }
    });
  }, revealOptions);

  reveals.forEach((reveal) => {
    revealOnScroll.observe(reveal);
  });
});

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

const moonContainer = document.querySelector(".moon-container");
const moonSvg = document.querySelector(".moon");

window.isMoonExploding = false;

window.triggerMoonExplosion = function () {
  if (!moonContainer || !moonSvg || window.isMoonExploding) return;
  window.isMoonExploding = true;

  moonContainer.classList.add("exploded");

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
      window.isMoonExploding = false;
      moonContainer.classList.remove("exploded");
    }
  }
  animateExplosion();
};

// --- VIRTUAL ASSISTANT CHATBOT WIDGET ---

// (function initChatbot() {
//   const style = document.createElement("style");
//   style.innerHTML = `
//     .chatbot-toggle {
//       position: fixed; bottom: 30px; right: 30px; width: 55px; height: 55px;
//       border-radius: 50%; background: var(--accent); color: #fff; border: none;
//       cursor: pointer; box-shadow: 0 4px 15px rgba(124, 106, 255, 0.4);
//       z-index: 9999; display: flex; align-items: center; justify-content: center;
//       transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
//     }
//     .chatbot-toggle:hover { transform: scale(1.1); }
//     .chatbot-toggle svg { width: 28px; height: 28px; fill: none; stroke: currentColor; stroke-width: 2; }

//     .chatbot-window {
//       position: fixed; bottom: 100px; right: 30px; width: 320px; height: 450px;
//       background: var(--bg2); border: 1px solid var(--border); border-radius: 8px;
//       box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 9999; display: flex;
//       flex-direction: column; overflow: hidden;
//       transition: opacity 0.3s, transform 0.3s; transform-origin: bottom right;
//     }
//     .chatbot-window.hidden { opacity: 0; transform: scale(0.8); pointer-events: none; }

//     .chatbot-header {
//       background: var(--bg3); padding: 15px; border-bottom: 1px solid var(--border);
//       display: flex; justify-content: space-between; align-items: center;
//       font-family: var(--mono); font-size: 0.85rem; color: var(--accent); font-weight: bold;
//     }
//     .chatbot-header span { display: flex; align-items: center; gap: 8px; }
//     .chatbot-header span::before { content: ''; display: block; width: 8px; height: 8px; background: #ffffff; border-radius: 50%; box-shadow: 0 0 5px #ffffff; }
//     .chatbot-close { background: none; border: none; color: var(--text); font-size: 1.5rem; cursor: pointer; line-height: 1; }

//     .chatbot-messages {
//       flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px;
//     }
//     /* Sembunyiin scrollbar tapi tetep bisa scroll */
//     .chatbot-messages::-webkit-scrollbar { width: 4px; }
//     .chatbot-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

//     .chat-msg {
//       max-width: 85%; padding: 10px 14px; border-radius: 8px; font-size: 0.85rem; line-height: 1.5; word-wrap: break-word;
//     }
//     .chat-msg.bot { background: var(--bg3); color: var(--text); align-self: flex-start; border-bottom-left-radius: 2px; }
//     .chat-msg.user { background: var(--accent); color: #fff; align-self: flex-end; border-bottom-right-radius: 2px; }
//     .chat-msg a { color: var(--accent3); text-decoration: none; font-weight: bold; }

//     .chatbot-input-area {
//       display: flex; padding: 10px; border-top: 1px solid var(--border); background: var(--bg); gap: 8px;
//     }
//     .chatbot-input-area input {
//       flex: 1; background: transparent; border: none; color: var(--text);
//       font-family: var(--sans); font-size: 0.9rem; outline: none; padding: 5px;
//     }
//     .chatbot-input-area button {
//       background: var(--accent); color: #fff; border: none; border-radius: 4px; width: 35px;
//       cursor: pointer; font-family: var(--mono); font-weight: bold; transition: opacity 0.2s;
//     }
//     .chatbot-input-area button:hover { opacity: 0.8; }

//     @media (max-width: 768px) {
//       .chatbot-window { width: calc(100vw - 40px); right: 20px; bottom: 90px; height: 400px; }
//       .chatbot-toggle { bottom: 20px; right: 20px; }
//     }
//   `;
//   document.head.appendChild(style);

//   const toggleBtn = document.createElement("button");
//   toggleBtn.className = "chatbot-toggle";
//   toggleBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;

//   const chatWindow = document.createElement("div");
//   chatWindow.className = "chatbot-window hidden";
//   chatWindow.innerHTML = `
//     <div class="chatbot-header">
//       <span>HFR_BOT v1.0</span>
//       <button class="chatbot-close">&times;</button>
//     </div>
//     <div class="chatbot-messages" id="chatMsgs"></div>
//     <div class="chatbot-input-area">
//       <input type="text" id="chatInput" placeholder="Ketik sesuatu..." autocomplete="off">
//       <button id="chatSend">➤</button>
//     </div>
//   `;

//   document.body.appendChild(toggleBtn);
//   document.body.appendChild(chatWindow);

//   const chatMsgs = document.getElementById("chatMsgs");
//   const chatInput = document.getElementById("chatInput");
//   const chatSend = document.getElementById("chatSend");
//   const closeBtn = chatWindow.querySelector(".chatbot-close");

//   let isFirstOpen = true;

//   toggleBtn.addEventListener("click", () => {
//     chatWindow.classList.remove("hidden");
//     toggleBtn.style.transform = "scale(0)";
//     if (isFirstOpen) {
//       setTimeout(
//         () =>
//           addMessage(
//             "bot",
//             "Halo! Gua asisten virtualnya Hanif. Ada yang bisa gua bantu? Lu bisa nanya soal <b>skills</b>, <b>projects</b>, atau <b>contact</b>.",
//           ),
//         300,
//       );
//       isFirstOpen = false;
//     }
//     setTimeout(() => chatInput.focus(), 300);
//   });

//   closeBtn.addEventListener("click", () => {
//     chatWindow.classList.add("hidden");
//     toggleBtn.style.transform = "scale(1)";
//   });

//   function addMessage(sender, text) {
//     const msg = document.createElement("div");
//     msg.className = `chat-msg ${sender}`;
//     msg.innerHTML = text;
//     chatMsgs.appendChild(msg);
//     chatMsgs.scrollTop = chatMsgs.scrollHeight;
//   }

//   function handleSend() {
//     const val = chatInput.value.trim();
//     if (!val) return;

//     addMessage("user", val);
//     chatInput.value = "";

//     setTimeout(() => {
//       botResponse(val.toLowerCase());
//     }, 600);
//   }

//   chatSend.addEventListener("click", handleSend);
//   chatInput.addEventListener("keypress", (e) => {
//     if (e.key === "Enter") handleSend();
//   });

//   function botResponse(input) {
//     let reply = "";

//     if (
//       input.includes("skill") ||
//       input.includes("bisa apa") ||
//       input.includes("tech")
//     ) {
//       reply =
//         "Hanif itu Full Stack Developer. Dia biasa pakai <b>Node.js, Express, Laravel, TypeScript</b>, sama database kayak <b>PostgreSQL & MySQL</b>.";
//     } else if (
//       input.includes("project") ||
//       input.includes("proyek") ||
//       input.includes("bikin apa")
//     ) {
//       reply =
//         "Banyak bro! Mulai dari sistem budget, OCR Stock Opname, sampai API Tracker pakai Prisma. Cek aja bagian <a href='#projects'>Projects</a> di web ini.";
//     } else if (
//       input.includes("contact") ||
//       input.includes("hubungi") ||
//       input.includes("email") ||
//       input.includes("linkedin")
//     ) {
//       reply =
//         "Lu bisa email dia di <b>haniffathurrahmanrustanto@gmail.com</b> atau langsung mampir ke <a href='https://www.linkedin.com/in/hanif-fathurrahman-rustanto' target='_blank'>LinkedIn-nya</a>.";
//     } else if (
//       input.includes("kerja") ||
//       input.includes("intern") ||
//       input.includes("kayaba")
//     ) {
//       reply =
//         "Sekarang dia lagi asik nge-intern di <b>PT Kayaba Indonesia</b> (sejak Jan 2025). Dia handle banyak internal web system di sana yang kepake langsung sama departemen-departemen.";
//     } else if (
//       input.includes("halo") ||
//       input.includes("hai") ||
//       input.includes("hi") ||
//       input.includes("pagi") ||
//       input.includes("malam")
//     ) {
//       reply = "Halo juga! Mau nanya-nanya apa nih seputar portofolionya Hanif?";
//     } else if (
//       input.includes("kuliah") ||
//       input.includes("kampus") ||
//       input.includes("stmi")
//     ) {
//       reply =
//         "Hanif lagi kuliah tingkat akhir di <b>Politeknik STMI Jakarta</b>, ambil jurusan Sistem Informasi Industri Otomotif. Udah semester 8 nih!";
//     } else {
//       reply =
//         "Waduh, gua cuma bot sederhana bro, agak kurang paham maksud lu 😅. Coba ketik keyword kayak <b>skills</b>, <b>projects</b>, atau <b>contact</b>.";
//     }

//     addMessage("bot", reply);
//   }
// })();

// --- TERMINAL EASTER EGG (CLASSIC MODE) ---
(function initTerminalEasterEgg() {
  const terminalBtn = document.getElementById("terminalBtn");
  const heroTitle = document.querySelector("h1");
  let keyBuffer = "";
  const secretCode = "sudo";
  let tapCount = 0;
  let tapTimer;

  const heroInput = document.getElementById("heroTerminalInput");

  if (heroInput) {
    document.getElementById("hero").addEventListener("click", () => {
      heroInput.focus();
    });

    heroInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const command = heroInput.value.toLowerCase().trim();

        switch (command) {
          case "sudo":
          case "terminal":
            if (typeof openTerminal === "function") openTerminal();
            break;
          case "projects":
          case "dir":
            document
              .getElementById("projects")
              .scrollIntoView({ behavior: "smooth" });
            break;
          case "contact":
          case "mail":
            document
              .getElementById("contact")
              .scrollIntoView({ behavior: "smooth" });
            break;
          case "about":
            document
              .getElementById("about")
              .scrollIntoView({ behavior: "smooth" });
            break;
          case "cls":
          case "clear":
            heroInput.value = "";
            break;
          default:
            heroInput.style.color = "var(--accent2)";
            setTimeout(() => (heroInput.style.color = "var(--text)"), 500);
        }

        if (command !== "") heroInput.value = "";
      }
    });
  }

  if (terminalBtn) {
    terminalBtn.addEventListener("click", openTerminal);
  }

  // if (heroTitle) {
  //   heroTitle.style.cursor = "pointer";
  //   heroTitle.title = "Click me 5 times...";
  //   heroTitle.addEventListener("click", () => {
  //     tapCount++;
  //     clearTimeout(tapTimer);
  //     if (tapCount >= 5) {
  //       openTerminal();
  //       tapCount = 0;
  //     } else {
  //       tapTimer = setTimeout(() => {
  //         tapCount = 0;
  //       }, 400);
  //     }
  //   });
  // }

  document.addEventListener("keydown", (e) => {
    if (
      e.target.tagName.toLowerCase() === "input" ||
      e.target.tagName.toLowerCase() === "textarea"
    )
      return;

    if (e.ctrlKey && e.key === "`") {
      e.preventDefault();
      openTerminal();
      return;
    }

    keyBuffer += e.key.toLowerCase();
    if (keyBuffer.length > secretCode.length) {
      keyBuffer = keyBuffer.slice(-secretCode.length);
    }
    if (keyBuffer === secretCode) {
      openTerminal();
      keyBuffer = "";
    }
  });

  console.log(
    "%cHello there, curious dev! 🕵️‍♂️",
    "color: #ffffff; font-size: 20px; font-weight: bold; background: #1a1208; padding: 10px; border-radius: 5px;",
  );
  console.log(
    "%cLooking under the hood? Try typing 'sudo' anywhere on the page, or hit Ctrl + ` to access the mainframe.",
    "color: #ff3366; font-size: 14px;",
  );

  function openTerminal() {
    if (document.getElementById("terminalContainer")) return;

    document.body.classList.add("game-mode");

    const termContainer = document.createElement("div");
    termContainer.id = "terminalContainer";
    termContainer.style.cssText = `
      position: fixed; inset: 0; z-index: 99999; background: rgba(10, 10, 15, 0.98);
      backdrop-filter: blur(10px); display: flex; flex-direction: column;
      padding: 2rem; font-family: 'Space Mono', monospace; color: #ffffff;
      overflow-y: auto; font-size: 0.95rem; line-height: 1.6;
    `;

    const outputContainer = document.createElement("div");
    outputContainer.id = "terminalOutput";
    outputContainer.style.cssText =
      "margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.5rem;";

    const inputWrapper = document.createElement("div");
    inputWrapper.style.cssText =
      "display: flex; gap: 0.8rem; align-items: center;";

    const promptStr = "hfr@dev:~$";
    const promptEl = document.createElement("span");
    promptEl.textContent = promptStr;
    promptEl.style.color = "#ffffff";

    const inputEl = document.createElement("input");
    inputEl.type = "text";
    inputEl.style.cssText = `
      flex: 1; background: transparent; border: none; color: #ffffff;
      font-family: 'Space Mono', monospace; font-size: 0.95rem; outline: none;
    `;
    inputEl.autocomplete = "off";
    inputEl.spellcheck = false;

    inputWrapper.appendChild(promptEl);
    inputWrapper.appendChild(inputEl);

    termContainer.appendChild(outputContainer);
    termContainer.appendChild(inputWrapper);

    const exitBtn = document.createElement("button");
    exitBtn.textContent = "EXIT TERMINAL";
    exitBtn.style.cssText = `
      position: fixed; top: 20px; right: 30px; background: transparent;
      color: #ff3366; border: 1px solid #ff3366; padding: 0.5rem 1rem;
      font-family: 'Space Mono', monospace; cursor: pointer; z-index: 100000;
      border-radius: 3px; font-size: 0.8rem;
    `;
    exitBtn.addEventListener("click", closeTerminal);
    termContainer.appendChild(exitBtn);

    document.body.appendChild(termContainer);
    inputEl.focus();

    printToTerminal("Booting HFR OS v1.0.0...");
    setTimeout(() => printToTerminal("Loading modules: [OK]"), 300);
    setTimeout(() => printToTerminal("Connecting to database: [OK]"), 600);
    setTimeout(() => {
      printToTerminal("System Ready. Type 'help' to see available commands.");
      printToTerminal("--------------------------------------------------");
    }, 900);

    termContainer.addEventListener("click", () => inputEl.focus());

    inputEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        const val = this.value.trim();
        if (val) {
          printToTerminal(
            `<span style="color: #ff3366;">${promptStr}</span> ${val}`,
            true,
          );
          processCommand(val);
        }
        this.value = "";
        termContainer.scrollTop = termContainer.scrollHeight;
      }
    });

    function closeTerminal() {
      document.body.classList.remove("game-mode");
      termContainer.style.transition = "opacity 0.5s ease";
      termContainer.style.opacity = "0";
      setTimeout(() => termContainer.remove(), 500);
    }

    function printToTerminal(text, isHtml = false) {
      const line = document.createElement("div");
      if (isHtml) line.innerHTML = text;
      else line.textContent = text;
      outputContainer.appendChild(line);
      termContainer.scrollTop = termContainer.scrollHeight;
    }

    function processCommand(cmd) {
      const args = cmd.split(" ");
      const mainCmd = args[0].toLowerCase();

      switch (mainCmd) {
        case "help":
          printToTerminal("Available commands:");
          printToTerminal("  whoami     - Display current user information");
          printToTerminal("  skills     - List technical stack & languages");
          printToTerminal("  experience - Show professional timeline");
          printToTerminal("  status     - Check current availability");
          printToTerminal("  projects   - Show current active deployments");
          printToTerminal(
            "  project    - View details (e.g., project ocr, project budget)",
          );
          printToTerminal("  contact    - Retrieve communication links");
          printToTerminal("  email      - Send an email to me directly");
          printToTerminal("  cv         - Download my resume / CV");
          printToTerminal("  github     - Open my GitHub profile");
          printToTerminal("  spotify     - Open my Spotify profile");
          printToTerminal("  linkedin   - Open my LinkedIn profile");
          printToTerminal("  Instagram   - Open my Instagram");
          printToTerminal("  clear      - Clear the terminal screen");
          printToTerminal("  exit       - Terminate session");
          printToTerminal(
            "Try other dev commands too! (git, npm, php, ping, rm, matrix, buff, neofetch, analyze-site)",
          );
          printToTerminal("--------------------------------------------------");
          break;

        case "experience":
        case "exp":
          printToTerminal(
            "<span style='color: #ffc640;'>[Jan 2025 - Present (1 yr 4 mos)]</span> Full Stack Developer Intern @ PT Kayaba Indonesia",
            true,
          );
          printToTerminal(
            "Location : Cikarang Barat, Jawa Barat, Indonesia (On-site)",
          );
          printToTerminal(
            "Role     : Contributed to the development and enhancement of internal web-based systems using Laravel, Bootstrap, HTML, CSS, JS, and MySQL.",
          );
          printToTerminal(
            "           Translated business requirements into system workflows, handled troubleshooting, and managed version control using Git.",
          );
          printToTerminal("--------------------------------------------------");
          printToTerminal(
            "<span style='color: #ffc640;'>[2022 - Present]</span> Information Systems Student @ Politeknik STMI Jakarta",
            true,
          );
          break;

        case "status":
          printToTerminal(
            "Current Phase : 8th Semester Student & Full Stack Dev Intern at Kayaba Indonesia",
          );
          printToTerminal(
            "Availability  : Wrapping up projects at PT Kayaba Indonesia. Now open for full-time opportunities and interesting collaborations.",
          );
          printToTerminal("Location      : Jakarta, Indonesia");
          break;

        case "email":
          printToTerminal("Opening default mail client...");
          printToTerminal(
            "Initiating secure connection to haniffathurrahmanrustanto@gmail.com",
          );
          setTimeout(() => {
            window.location.href = "mailto:haniffathurrahmanrustanto@gmail.com";
          }, 800);
          break;

        case "project":
          const projName = args[1] ? args[1].toLowerCase() : "";

          if (projName === "ocr") {
            printToTerminal(
              "<span style='color: #6affcb;'>[Stock Opname OCR Monitoring System]</span>",
              true,
            );
            printToTerminal(
              "Stack: Laravel, MySQL, Bootstrap, HTML/CSS/JS, Verihubs OCR API",
            );
            printToTerminal(
              "Desc : Internal system to streamline stock opname by automating data extraction.",
            );
            printToTerminal(
              "  > Developed data extraction system integrating Verihubs OCR API.",
            );
            printToTerminal(
              "  > Built a verification dashboard for real-time extraction monitoring.",
            );
            printToTerminal(
              "  > Improved input efficiency by significantly reducing manual data entry.",
            );
          } else if (projName === "recruitment") {
            printToTerminal(
              "<span style='color: #6affcb;'>[Recruitment System Enhancement]</span>",
              true,
            );
            printToTerminal(
              "Stack: Laravel, MySQL, Bootstrap, HTML/CSS/JS, Verihubs OCR API",
            );
            printToTerminal(
              "Desc : System enhancement to accelerate selection and secure applicant documents.",
            );
            printToTerminal(
              "  > Enhanced security by implementing sensitive data encryption for applicant documents.",
            );
            printToTerminal(
              "  > Integrated Verihubs OCR API for automatic verification of KTP and diplomas.",
            );
            printToTerminal(
              "  > Assisted HR in accelerating document validation and minimizing input errors.",
            );
          } else if (projName === "budget") {
            printToTerminal(
              "<span style='color: #6affcb;'>[Digitalized Master Budget System]</span>",
              true,
            );
            printToTerminal("Stack: Laravel, MySQL, Bootstrap, HTML/CSS/JS");
            printToTerminal(
              "Desc : Web-based budget submission system replacing manual Excel workflows.",
            );
            printToTerminal(
              "  > Developed a web-based system to replace manual Excel-based budget processes.",
            );
            printToTerminal(
              "  > Implemented document import/export features using supporting libraries.",
            );
            printToTerminal(
              "  > Applied a structured multi-level approval workflow (Staff to Kadept).",
            );
            printToTerminal(
              "  > Accelerated budget preparation from months to just a few days.",
            );
          } else if (projName === "monitoring" || projName === "supplier") {
            printToTerminal(
              "<span style='color: #6affcb;'>[Stock Monitoring System (Dashboard & API)]</span>",
              true,
            );
            printToTerminal(
              "Stack: Laravel, MySQL, Bootstrap, HTML/CSS/JS, RESTful API",
            );
            printToTerminal(
              "Desc : End-to-end stock monitoring system with internal dashboard and supplier API.",
            );
            printToTerminal(
              "  > Developed dashboard to monitor stock levels, trends, and real-time discrepancies.",
            );
            printToTerminal(
              "  > Built RESTful API enabling suppliers to securely push and pull stock data.",
            );
            printToTerminal(
              "  > Implemented manual input and Excel import/export for operational flexibility.",
            );
            printToTerminal(
              "  > Improved data accuracy and synchronization between internal and supplier systems.",
            );
            printToTerminal(
              "  > Supported multi-supplier integration with consistent endpoint management.",
            );
          } else if (projName === "employee" || projName === "hr") {
            printToTerminal(
              "<span style='color: #6affcb;'>[Employee Performance Assessment System]</span>",
              true,
            );
            printToTerminal("Stack: Laravel, MySQL, Bootstrap, HTML/CSS/JS");
            printToTerminal(
              "Desc : Digital assessment system for HR to monitor employee performance.",
            );
            printToTerminal(
              "  > Developed a summary dashboard for performance and behavior evaluation.",
            );
            printToTerminal(
              "  > Implemented a multi-criteria scoring system for objective measurement.",
            );
            printToTerminal(
              "  > Supported manual input and Excel import/export to accelerate workflow.",
            );
            printToTerminal(
              "  > Reduced reliance on document-based processes, improving evaluation efficiency.",
            );
            printToTerminal(
              "  > Ensured data security and consistency through validation and access control.",
            );
          } else if (projName === "document" || projName === "qms") {
            printToTerminal(
              "<span style='color: #6affcb;'>[Document Control System]</span>",
              true,
            );
            printToTerminal("Stack: Laravel, MySQL, Bootstrap, HTML/CSS/JS");
            printToTerminal(
              "Desc : Web-based QMS document management with structured approval workflow.",
            );
            printToTerminal(
              "  > Developed a structured workflow for document upload, review, approval, and distribution.",
            );
            printToTerminal(
              "  > Applied QMS review mechanisms to ensure company quality standards are met.",
            );
            printToTerminal(
              "  > Implemented cross-departmental access features based on operational roles.",
            );
            printToTerminal(
              "  > Enhanced document accuracy and traceability through centralized storage.",
            );
            printToTerminal(
              "  > Streamlined document distribution via automated delivery and notifications.",
            );
          } else {
            printToTerminal("Usage: project [name]");
            printToTerminal(
              "Available options: ocr, recruitment, budget, monitoring, employee, document",
            );
          }
          break;
        case "whoami":
          printToTerminal("Name   : Hanif Fathurrahman Rustanto");
          printToTerminal("Role   : Full Stack Developer");
          printToTerminal(
            "Status : Engineering systems at PT Kayaba Indonesia.",
          );
          printToTerminal(
            "Desc   : Turning complex business processes into clean, efficient digital workflows.",
          );
          break;
        case "skills":
          printToTerminal("--- [ TECHNICAL STACK ] ---");
          printToTerminal(
            "> Frontend     : HTML5, CSS3, JavaScript (ES6+), Blade, React",
          );
          printToTerminal(
            "> Frameworks   : Laravel, Tailwind CSS, Bootstrap, Express",
          );
          printToTerminal(
            "> Backend      : PHP, Node.js, Python (Anaconda, Jupyter)",
          );
          printToTerminal(
            "> Database     : MySQL, PostgreSQL, Prisma ORM, Eloquent",
          );

          printToTerminal("\n--- [ DATA & SYSTEMS ] ---");
          printToTerminal(
            "> Data Science : Machine Learning, Data Visualization (Tableau/Weka)",
          );
          printToTerminal(
            "> System Design: MVC, RESTful API, SDLC (XP Workflow)",
          );
          printToTerminal(
            "> Deployment   : Ubuntu Linux, VPS, VirtualBox, WinSCP",
          );

          printToTerminal("\n--- [ TOOLS & FLOW ] ---");
          printToTerminal(
            "> Dev Tools    : Git, GitHub, Postman, VS Code, Figma",
          );
          printToTerminal(
            "> Workflow     : Troubleshooting, Debugging, API Integration",
          );
          break;
        case "projects":
          printToTerminal("Fetching repositories...");
          printToTerminal(" [1] Stock Opname OCR Monitoring System");
          printToTerminal(" [2] Backend Subscription Tracker API");
          printToTerminal(" [3] Event Guest Registration & Display System");
          printToTerminal(" [4] Digitalized Master Budget Workflow");
          break;
        case "contact":
          printToTerminal("Email  : haniffathurrahmanrustanto@gmail.com");
          printToTerminal("Phone  : +62 877 8053 6163");
          break;
        case "resume":
        case "cv":
          printToTerminal("Downloading CV/Resume...");
          const link = document.createElement("a");
          link.href = "CV Hanif Fathurrahman.pdf";
          link.download = "CV Hanif Fathurrahman.pdf";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          break;
        case "github":
          printToTerminal("Opening GitHub...");
          window.open("https://github.com/hannnnnnnnn1414/", "_blank");
          break;
        case "linkedin":
          printToTerminal("Opening LinkedIn...");
          window.open(
            "https://www.linkedin.com/in/hanif-fathurrahman-rustanto/",
            "_blank",
          );
          break;
        case "spotify":
          printToTerminal("Opening Spotify...");
          window.open(
            "https://open.spotify.com/user/31as2gyqrbpx4yjkd5yf52x63hqm",
            "_blank",
          );
          break;
        case "instagram":
        case "ig":
          printToTerminal("Opening Instagram...");
          window.open("https://www.instagram.com/haniv_fr", "_blank");
          break;
        case "eca":
          printToTerminal("Opening Eca...");
          window.open("https://raisakmal.vercel.app/", "_blank");
          break;
        case "gleam":
          printToTerminal("Opening Gleam...");
          window.open("https://www.gleam.web.id/", "_blank");
          break;
        case "sawung":
          printToTerminal("Opening Sawung...");
          window.open("https://urat-waras.vercel.app/", "_blank");
          break;
        case "faiq":
          printToTerminal("Opening Faiq...");
          window.open("https://faiqam.vercel.app/", "_blank");
          break;
        case "rm":
          if (args[1] === "-rf") {
            printToTerminal(
              "<span style='color: #ff3366;'>CRITICAL: Initiating self-destruct sequence...</span>",
              true,
            );
            printToTerminal(
              "<span style='color: #ff3366;'>Deleting root filesystem...</span>",
              true,
            );

            setTimeout(() => {
              document.body.innerHTML =
                "<h1 style='color:#ff3366; text-align:center; margin-top:40vh; font-family:monospace; text-shadow: 0 0 20px #ff3366;'>SYSTEM DESTROYED.</h1><p style='color:#fff; text-align:center; font-family:monospace;'>Rebooting in 3 seconds...</p>";
              setTimeout(() => location.reload(), 3000);
            }, 1500);
          } else {
            printToTerminal(
              "rm: missing operand. Try 'rm -rf /' if you are brave.",
            );
          }
          break;
        case "git":
          printToTerminal("On branch main. Working tree clean.");
          break;
        case "ping":
          printToTerminal("PING kayaba.co.id (142.250.191.46): 56 data bytes");
          setTimeout(
            () =>
              printToTerminal(
                "64 bytes from 142.250.191.46: icmp_seq=0 ttl=116 time=14.2 ms",
              ),
            500,
          );
          setTimeout(
            () =>
              printToTerminal(
                "64 bytes from 142.250.191.46: icmp_seq=1 ttl=116 time=12.1 ms",
              ),
            1000,
          );
          setTimeout(
            () =>
              printToTerminal(
                "--- kayaba.co.id ping statistics ---\n2 packets transmitted, 2 packets received, 0.0% packet loss",
              ),
            1500,
          );
          break;
        case "npm":
          if (args[1] === "run" && args[2] === "dev") {
            printToTerminal(
              "<span style='color: #ffffff;'>  VITE v4.3.9</span> ready in 345 ms",
              true,
            );
          } else {
            printToTerminal("npm ERR! Missing script: " + (args[2] || ""));
          }
          break;
        case "php":
          if (args[1] === "artisan" && args[2] === "serve") {
            printToTerminal(
              "<span style='color: #ffffff;'>INFO</span> Server running on [http://127.0.0.1:8000].",
              true,
            );
          } else {
            printToTerminal("Could not open input file: artisan");
          }
          break;
        case "clear":
          outputContainer.innerHTML = "";
          break;
        case "exit":
          printToTerminal("Closing connection...");
          setTimeout(closeTerminal, 600);
          break;
        case "analyze-site":
          printToTerminal(
            "<span style='color: #ffc640;'>[INIT]</span> Starting site analysis...",
          );
          setTimeout(
            () =>
              printToTerminal(
                "<span style='color: #ffffff;'>[SCANNING]</span> DOM Elements... 142 detected.",
              ),
            600,
          );
          setTimeout(
            () =>
              printToTerminal(
                "<span style='color: #ffffff;'>[CHECKING]</span> Tech Stack... Frontend optimized. Canvas active.",
              ),
            1400,
          );
          setTimeout(
            () =>
              printToTerminal(
                "<span style='color: #ffffff;'>[VERIFYING]</span> Backend Architecture... TypeScript/Express endpoints validated.",
              ),
            2200,
          );
          setTimeout(
            () =>
              printToTerminal(
                "<span style='color: #ff3366;'>[RESULT]</span> Performance: OVER 9000. Creativity: OVERFLOW.",
              ),
            3000,
          );
          break;

        case "git":
          if (args[1] === "log") {
            printToTerminal(
              "<span style='color: #ffc640;'>commit 8f3a1b</span> (HEAD -> main) fixed 'moon' explosion logic... again.",
            );
            printToTerminal(
              "<span style='color: #ffc640;'>commit 2c9b4e</span> deployed Stock Opname OCR system to PT Kayaba staging.",
            );
            printToTerminal(
              "<span style='color: #ffc640;'>commit 5d7a2f</span> refactored MIS department dashboard.",
            );
            printToTerminal(
              "<span style='color: #ffc640;'>commit 1a0d7c</span> setting up TypeScript environment for semester 8 final project.",
            );
            printToTerminal(
              "<span style='color: #ffc640;'>commit 000000</span> (root) Initial commit: Hello World.",
            );
          } else {
            printToTerminal(
              "On branch main. Working tree clean. Type 'git log' to see history.",
            );
          }
          break;

        case "buff":
          if (args[1] === "--skills") {
            window.rocketBuffActive = true;
            printToTerminal(
              "<span style='color: #ffffff;'>[BUFF APPLIED]</span> Weapon systems upgraded. Triple-shot engaged!",
            );
            printToTerminal(
              "Try clicking on the screen outside the terminal now.",
            );
          } else {
            printToTerminal("Usage: buff --skills");
          }
          break;

        case "neofetch":
          const asciiArt = `
<pre style='color: #ffffff; margin: 0; font-family: inherit; line-height: 1.2;'>
   __   __  _____  ___ 
  / / / / / ___/ / _ \\
 / /_/ / / __/  / , _/
/ __  / / /    / /| | 
\\/ /_/ /_/    /_/ |_| 
</pre>`;
          printToTerminal(asciiArt, true);
          printToTerminal("-------------------");
          printToTerminal("<b>OS:</b> HanifOS v1.0 / Politeknik STMI", true);
          printToTerminal("<b>Kernel:</b> Coffee & TypeScript", true);
          printToTerminal("<b>Uptime:</b> 8 Semesters", true);
          printToTerminal("<b>Shell:</b> Zsh (Zuper Skilled Human)", true);
          printToTerminal(
            "<b>Stack:</b> Laravel, Node.js, Express, Prisma",
            true,
          );
          printToTerminal("<b>Role:</b> Full Stack Developer", true);
          break;

        case "matrix":
          printToTerminal("Entering the Matrix... (Press ESC to exit)");
          setTimeout(startMatrixEffect, 500);
          break;
        case "sudo":
          printToTerminal(
            "Nice try. This incident will be reported to the sysadmin.",
          );
          break;
        default:
          if (cmd !== "")
            printToTerminal(
              `Command not found: ${mainCmd}. Type 'help' for a list of commands.`,
            );
      }
    }

    let matrixInterval;
    function startMatrixEffect() {
      if (document.getElementById("matrixCanvas")) return;

      const mCanvas = document.createElement("canvas");
      mCanvas.id = "matrixCanvas";
      mCanvas.style.cssText =
        "position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; opacity: 0.3; pointer-events: none;";
      termContainer.insertBefore(mCanvas, outputContainer);

      const mCtx = mCanvas.getContext("2d");
      mCanvas.width = termContainer.offsetWidth;
      mCanvas.height = termContainer.offsetHeight;

      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
      const fontSize = 16;
      const columns = mCanvas.width / fontSize;
      const drops = [];
      for (let x = 0; x < columns; x++) drops[x] = 1;

      function drawMatrix() {
        mCtx.fillStyle = "rgba(10, 10, 15, 0.1)";
        mCtx.fillRect(0, 0, mCanvas.width, mCanvas.height);
        mCtx.fillStyle = "#39ff14";
        mCtx.font = fontSize + "px 'Space Mono', monospace";

        for (let i = 0; i < drops.length; i++) {
          const text = letters.charAt(
            Math.floor(Math.random() * letters.length),
          );
          mCtx.fillText(text, i * fontSize, drops[i] * fontSize);
          if (drops[i] * fontSize > mCanvas.height && Math.random() > 0.975)
            drops[i] = 0;
          drops[i]++;
        }
      }
      matrixInterval = setInterval(drawMatrix, 33);

      const stopMatrix = (e) => {
        if (e.key === "Escape") {
          clearInterval(matrixInterval);
          mCanvas.remove();
          printToTerminal(
            "<span style='color: #ffc640;'>Matrix effect terminated.</span>",
            true,
          );
          document.removeEventListener("keydown", stopMatrix);
        }
      };
      document.addEventListener("keydown", stopMatrix);
    }
  }
})();

// =========================================
// TERMINAL SUGGESTION FADE EFFECT
// =========================================
const heroInput = document.getElementById("heroTerminalInput");
const suggestion = document.getElementById("terminalSuggestion");

if (heroInput && suggestion) {
  heroInput.addEventListener("input", function () {
    if (this.value.length > 0) {
      suggestion.style.opacity = "0";
    } else {
      suggestion.style.opacity = "0.7";
    }
  });
}

const music = document.getElementById("bgMusic");
const toggleBtn = document.getElementById("musicToggle");
const musicIcon = document.getElementById("musicIcon");

music.volume = 0.3;

let isPlaying = false;

function tryAutoplay() {
  const playPromise = music.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        isPlaying = true;
        musicIcon.classList.add("playing");
        musicIcon.classList.remove("paused");
      })
      .catch(() => {
        isPlaying = false;
        musicIcon.classList.add("paused");
        musicIcon.classList.remove("playing");
      });
  }
}

window.addEventListener("load", () => {
  tryAutoplay();
});

document.addEventListener(
  "click",
  () => {
    if (!isPlaying) {
      music
        .play()
        .then(() => {
          isPlaying = true;
          musicIcon.classList.add("playing");
          musicIcon.classList.remove("paused");
        })
        .catch(() => {});
    }
  },
  { once: true },
);

document.addEventListener(
  "keydown",
  () => {
    if (!isPlaying) tryAutoplay();
  },
  { once: true },
);

toggleBtn.addEventListener("click", () => {
  if (isPlaying) {
    music.pause();
    musicIcon.classList.remove("playing");
    musicIcon.classList.add("paused");
  } else {
    music.play();
    musicIcon.classList.remove("paused");
    musicIcon.classList.add("playing");
  }
  isPlaying = !isPlaying;
});

if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
  const moonContainerEl = document.querySelector(".moon-container");
  if (moonContainerEl) {
    moonContainerEl.addEventListener("touchend", function (e) {
      e.preventDefault();

      if (window.isMoonExploding) return;

      const playBtnEl = document.getElementById("playBtn");
      const touch = e.changedTouches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);

      if (playBtnEl && playBtnEl.contains(target)) {
        if (typeof window.initGame === "function") window.initGame();
        return;
      }

      if (typeof window.triggerMoonExplosion === "function") {
        window.triggerMoonExplosion();
      }
    });
  }
}
