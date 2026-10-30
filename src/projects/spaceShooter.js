/**
 * PROJECT 05: SPACE SHOOTER GAME DEMO
 * Playable HTML5 Canvas Space Shooter Game with keyboard & touch controls,
 * player spaceship, laser shooting, enemy waves, collision detection,
 * particle explosions, score counter, lives, game over screen, and restart.
 */

export function mountSpaceShooterDemo(container) {
  container.innerHTML = `
    <div class="demo-disclaimer-banner" style="border-color: rgba(255, 54, 199, 0.4); background: rgba(255, 54, 199, 0.08);">
      <span>
        <strong>SPACEBOT COMBAT SIMULATOR:</strong> Use <strong>Arrow Keys / WASD</strong> to maneuver and <strong>SPACE</strong> to fire lasers (or use the touch controls below).
      </span>
      <button type="button" class="mini-hud-btn" id="shooterRestartTopBtn">↻ RESTART MISSION</button>
    </div>

    <div class="shooter-arena-wrap">
      <div class="shooter-hud-bar">
        <span style="color: var(--cyan);">SCORE: <strong id="shooterScore">0</strong></span>
        <span style="color: var(--purple);">WAVE: <strong id="shooterWave">1</strong></span>
        <span style="color: var(--emerald);">SHIELDS / LIVES: <strong id="shooterLives">♥♥♥</strong></span>
        <span style="color: var(--amber);">HIGH SCORE: <strong id="shooterHighScore">0</strong></span>
      </div>

      <div class="shooter-canvas-box">
        <canvas id="spaceShooterCanvas" width="760" height="475"></canvas>

        <div id="shooterOverlay" style="position:absolute; inset:0; background:rgba(4,7,18,0.86); display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding:24px;">
          <div class="edu-status-tag" style="margin-bottom:12px;">ORBITAL DEFENSE SIMULATOR</div>
          <h3 id="shooterOverlayTitle" style="font-family:var(--font-display); font-size:28px; color:var(--cyan); margin-bottom:10px;">
            SPACE SHOOTER — SECTOR ALPHA
          </h3>
          <p id="shooterOverlayDesc" style="color:var(--text-secondary); max-width:440px; margin-bottom:22px; font-size:14.5px;">
            Pilot the Cyber-Viper starfighter, intercept incoming drone squadrons, and defend the AI Universe orbital station!
          </p>
          <button type="button" class="btn btn-primary" id="shooterStartBtn">
            🚀 LAUNCH STARFIGHTER
          </button>
        </div>
      </div>

      <div class="shooter-touch-controls">
        <button type="button" class="btn btn-outline" id="touchLeftBtn" style="padding:10px 18px;">◀ LEFT</button>
        <button type="button" class="btn btn-primary" id="touchFireBtn" style="padding:10px 24px;">⚡ FIRE LASER</button>
        <button type="button" class="btn btn-outline" id="touchRightBtn" style="padding:10px 18px;">RIGHT ▶</button>
      </div>
    </div>
  `;

  const canvas = container.querySelector('#spaceShooterCanvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = container.querySelector('#shooterScore');
  const waveEl = container.querySelector('#shooterWave');
  const livesEl = container.querySelector('#shooterLives');
  const highScoreEl = container.querySelector('#shooterHighScore');
  const overlayEl = container.querySelector('#shooterOverlay');
  const overlayTitleEl = container.querySelector('#shooterOverlayTitle');
  const overlayDescEl = container.querySelector('#shooterOverlayDesc');
  const startBtn = container.querySelector('#shooterStartBtn');

  let highScore = Number(localStorage.getItem('raviteja_spaceshooter_hi') || 0);
  highScoreEl.textContent = String(highScore);

  const W = canvas.width;
  const H = canvas.height;

  let running = false;
  let animId = null;
  let score = 0;
  let wave = 1;
  let lives = 3;
  let lastShotTime = 0;

  const keys = { left: false, right: false, up: false, down: false, fire: false };

  const player = {
    x: W / 2,
    y: H - 58,
    w: 44,
    h: 40,
    speed: 5.5
  };

  let bullets = [];
  let enemies = [];
  let particles = [];
  const stars = Array.from({ length: 65 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.6 + 0.5,
    s: Math.random() * 1.4 + 0.4
  }));

  function updateHUD() {
    scoreEl.textContent = String(score);
    waveEl.textContent = String(wave);
    livesEl.textContent = '♥'.repeat(Math.max(0, lives)) || 'DEPLETED';
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('raviteja_spaceshooter_hi', String(highScore));
      highScoreEl.textContent = String(highScore);
    }
  }

  function spawnEnemyWave() {
    const cols = Math.min(8, 4 + wave);
    for (let i = 0; i < cols; i++) {
      enemies.push({
        x: 70 + i * ((W - 140) / Math.max(1, cols - 1)),
        y: -30 - (i % 2) * 35,
        w: 36,
        h: 32,
        vy: 1.15 + wave * 0.22,
        vx: (i % 2 === 0 ? 1 : -1) * (0.6 + wave * 0.1),
        color: i % 2 === 0 ? '#ff36c7' : '#c43cff',
        hp: wave >= 3 && i % 3 === 0 ? 2 : 1
      });
    }
  }

  function createExplosion(x, y, color) {
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3.5 + 0.8;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        color
      });
    }
  }

  function fireBullet() {
    const now = performance.now();
    if (now - lastShotTime < 190) return;
    lastShotTime = now;
    bullets.push({
      x: player.x - 10,
      y: player.y - 18,
      vy: -8.5
    });
    bullets.push({
      x: player.x + 10,
      y: player.y - 18,
      vy: -8.5
    });
  }

  function startGame() {
    score = 0;
    wave = 1;
    lives = 3;
    player.x = W / 2;
    player.y = H - 58;
    bullets = [];
    enemies = [];
    particles = [];
    spawnEnemyWave();
    updateHUD();
    overlayEl.style.display = 'none';
    running = true;
  }

  function triggerGameOver() {
    running = false;
    overlayTitleEl.textContent = 'MISSION OVER // HULL BREACHED';
    overlayDescEl.innerHTML = `Final Score: <strong style="color:var(--cyan);">${score}</strong> &nbsp;|&nbsp; Reached Wave: <strong style="color:var(--purple);">${wave}</strong>`;
    startBtn.textContent = '↻ PLAY AGAIN';
    overlayEl.style.display = 'flex';
  }

  function drawPlayer() {
    ctx.save();
    ctx.translate(player.x, player.y);

    // Thruster flame
    ctx.fillStyle = '#ff36c7';
    ctx.beginPath();
    ctx.moveTo(-8, 18);
    ctx.lineTo(0, 29 + Math.random() * 8);
    ctx.lineTo(8, 18);
    ctx.closePath();
    ctx.fill();

    // Ship Hull
    ctx.fillStyle = '#21f4ef';
    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(22, 18);
    ctx.lineTo(6, 12);
    ctx.lineTo(-6, 12);
    ctx.lineTo(-22, 18);
    ctx.closePath();
    ctx.fill();

    // Cockpit
    ctx.fillStyle = '#050814';
    ctx.beginPath();
    ctx.arc(0, -2, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawEnemy(e) {
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.fillStyle = e.color;
    ctx.beginPath();
    ctx.moveTo(0, 16);
    ctx.lineTo(18, -12);
    ctx.lineTo(6, -6);
    ctx.lineTo(-6, -6);
    ctx.lineTo(-18, -12);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#21f4ef';
    ctx.fillRect(-5, -2, 10, 4);
    ctx.restore();
  }

  function loop() {
    animId = requestAnimationFrame(loop);

    // Draw background & starfield
    ctx.fillStyle = '#040612';
    ctx.fillRect(0, 0, W, H);

    stars.forEach((s) => {
      s.y += s.s;
      if (s.y > H) {
        s.y = 0;
        s.x = Math.random() * W;
      }
      ctx.fillStyle = 'rgba(33, 244, 239, 0.65)';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    if (!running) {
      drawPlayer();
      return;
    }

    // Player movement
    if (keys.left) player.x -= player.speed;
    if (keys.right) player.x += player.speed;
    if (keys.up) player.y -= player.speed;
    if (keys.down) player.y += player.speed;

    player.x = Math.max(28, Math.min(W - 28, player.x));
    player.y = Math.max(80, Math.min(H - 32, player.y));

    if (keys.fire) fireBullet();

    // Update & draw bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      b.y += b.vy;
      ctx.fillStyle = '#21f4ef';
      ctx.fillRect(b.x - 2, b.y - 8, 4, 14);
      if (b.y < -15) bullets.splice(i, 1);
    }

    // Update & draw enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      e.y += e.vy;
      e.x += e.vx;
      if (e.x < 28 || e.x > W - 28) e.vx *= -1;

      drawEnemy(e);

      // Check collision with bullets
      for (let j = bullets.length - 1; j >= 0; j--) {
        const b = bullets[j];
        if (Math.abs(b.x - e.x) < 20 && Math.abs(b.y - e.y) < 18) {
          bullets.splice(j, 1);
          e.hp -= 1;
          if (e.hp <= 0) {
            createExplosion(e.x, e.y, e.color);
            enemies.splice(i, 1);
            score += 100;
            updateHUD();
          }
          break;
        }
      }

      if (!enemies[i]) continue;

      // Check collision with player or bottom breach
      const hitPlayer = Math.abs(e.x - player.x) < 30 && Math.abs(e.y - player.y) < 28;
      if (hitPlayer || e.y > H + 15) {
        createExplosion(e.x, Math.min(H - 10, e.y), '#ff3b6b');
        enemies.splice(i, 1);
        lives -= 1;
        updateHUD();
        if (lives <= 0) {
          triggerGameOver();
          return;
        }
      }
    }

    if (enemies.length === 0) {
      wave += 1;
      score += 250;
      updateHUD();
      spawnEnemyWave();
    }

    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.035;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    drawPlayer();
  }

  const onKeyDown = (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
    if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = true;
    if (e.code === 'ArrowDown' || e.code === 'KeyS') keys.down = true;
    if (e.code === 'Space') {
      if (running) e.preventDefault();
      keys.fire = true;
    }
  };

  const onKeyUp = (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
    if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = false;
    if (e.code === 'ArrowDown' || e.code === 'KeyS') keys.down = false;
    if (e.code === 'Space') keys.fire = false;
  };

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  startBtn.addEventListener('click', startGame);
  container.querySelector('#shooterRestartTopBtn').addEventListener('click', startGame);

  // Touch / Mouse Hold Controls
  const bindHold = (btnEl, keyName) => {
    btnEl.addEventListener('pointerdown', () => {
      keys[keyName] = true;
    });
    btnEl.addEventListener('pointerup', () => {
      keys[keyName] = false;
    });
    btnEl.addEventListener('pointerleave', () => {
      keys[keyName] = false;
    });
  };
  bindHold(container.querySelector('#touchLeftBtn'), 'left');
  bindHold(container.querySelector('#touchRightBtn'), 'right');
  container.querySelector('#touchFireBtn').addEventListener('click', () => {
    if (!running) startGame();
    else fireBullet();
  });

  loop();

  return function cleanup() {
    running = false;
    cancelAnimationFrame(animId);
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
  };
}

