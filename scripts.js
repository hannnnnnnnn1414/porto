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

  function initGame() {
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
    const img = radius === 22 ? enemyShooterImage : enemyKamikazeImage;

    ctx.drawImage(img, x - img.width / 2, y - img.height / 2);
  }

  function createExplosion(x, y, color) {
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

  function animate() {
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
          hp: 1,
          maxHp: 800,
          vx: 3,
          vy: 1.5,
          attackTimer: 0,
          laserActive: false,
          laserDuration: 0,
          laserWarnTimer: 0,
        };
      }

      if (!boss && Math.random() < 0.04) {
        let isShooter = Math.random() < 0.3;
        enemies.push({
          x: Math.random() * rocketCanvas.width,
          y: -30,
          radius: isShooter ? 22 : 14,
          speed: isShooter ? 1.5 + Math.random() * 1.5 : 3 + Math.random() * 3,
          type: isShooter ? "shooter" : "kamikaze",
          shootTimer: 0,
        });
      }
    }

    if (boss && !isGameOver && !isGameWon) {
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

      rctx.save();
      rctx.translate(boss.x, boss.y);

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
      rctx.globalCompositeOperation = "lighter";
      rctx.shadowBlur = 20;
      rctx.shadowColor = "#ff3366";

      rctx.beginPath();
      rctx.arc(bb.x, bb.y, 5, 0, Math.PI * 2);
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
      (isFiring || (isGameMode && isTouchDevice)) && !isGameOver && !isGameWon;

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

      rctx.globalCompositeOperation = "lighter";
      rctx.shadowBlur = 15;
      rctx.shadowColor = "#39ff14";

      rctx.fillStyle = "#ffffff";
      rctx.fillRect(-8, -2, 16, 4);

      rctx.fillStyle = "rgba(57, 255, 20, 0.5)";
      rctx.fillRect(-10, -4, 20, 8);

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

      if (boss && !isGameOver && !isGameWon) {
        let dist = Math.hypot(b.x - boss.x, b.y - boss.y);
        if (dist < 2.5 + boss.radius) {
          boss.hp -= 5;

          createExplosion(b.x, b.y, "#6affcb");

          bullets.splice(i, 1);
          hit = true;
          if (boss.hp <= 0) {
            createExplosion(boss.x, boss.y, "#ff3366");
            createExplosion(boss.x + 30, boss.y - 20, "#ffc640");
            createExplosion(boss.x - 30, boss.y + 20, "#ffffff");

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

      rctx.globalCompositeOperation = "lighter";
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
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
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
        // rctx.fillText(
        //   "// Now scroll down to see my real Full Stack projects.",
        //   rocketCanvas.width / 2,
        //   rocketCanvas.height / 2 + 85,
        // );

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

const moonContainer = document.querySelector(".moon-container");
const moonSvg = document.querySelector(".moon");
const playBtn = document.getElementById("playBtn");
let isMoonExploding = false;

if (moonContainer && moonSvg) {
  moonContainer.addEventListener("click", (e) => {
    if (e.target.closest("#playBtn")) return;

    if (isMoonExploding) return;
    isMoonExploding = true;

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
        isMoonExploding = false;
        moonContainer.classList.remove("exploded");
      }
    }
    animateExplosion();
  });
}
