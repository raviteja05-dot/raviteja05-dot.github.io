/**
 * ANIMATIONS, BOOT SEQUENCE, AMBIENT PARTICLES, TYPEWRITER & PARALLAX CONTROLLER
 * Respects prefers-reduced-motion settings.
 */

import gsap from 'gsap';

export function initBootSequence() {
  const bootScreen = document.getElementById('bootScreen');
  const bootLogsEl = document.getElementById('bootLogs');
  const bootBarEl = document.getElementById('bootProgressBar');
  const bootPctEl = document.getElementById('bootPercent');
  const skipBtn = document.getElementById('skipIntroBtn');

  if (!bootScreen) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const bootSteps = [
    { pct: 25, tag: '[CORE]', msg: 'Initializing RAVITEJA.AI // THE AI UNIVERSE Neural Kernel...' },
    { pct: 55, tag: '[3D-LAB]', msg: 'Calibrating 6 Autonomous Robot Units (JARVIS, MEDIBOT, NEUROBOT, SHOPBOT, SPACEBOT, DATABOT)...' },
    { pct: 82, tag: '[STATES]', msg: 'Loading 6-State JARVIS Neural Engine & Lazy-Loaded Project Simulators...' },
    { pct: 100, tag: '[READY]', msg: 'All systems nominal. Welcome to the AI Universe of Hari Kumar Raviteja Nagireddy.' }
  ];

  let dismissed = false;
  const timeouts = [];

  function finishBoot() {
    if (dismissed) return;
    dismissed = true;
    timeouts.forEach((t) => clearTimeout(t));
    bootScreen.classList.add('hidden');
    animateHeroEntrance();
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', finishBoot);
  }

  if (prefersReducedMotion) {
    finishBoot();
    return;
  }

  bootSteps.forEach((step, idx) => {
    const t = setTimeout(() => {
      if (dismissed) return;
      if (bootLogsEl) {
        const line = document.createElement('div');
        line.className = 'boot-log-line';
        line.innerHTML = `<span class="tag">${step.tag}</span> <span>${step.msg}</span>`;
        bootLogsEl.appendChild(line);
      }
      if (bootBarEl) bootBarEl.style.width = `${step.pct}%`;
      if (bootPctEl) bootPctEl.textContent = `${step.pct}%`;

      if (idx === bootSteps.length - 1) {
        const endTimer = setTimeout(finishBoot, 380);
        timeouts.push(endTimer);
      }
    }, idx * 300);
    timeouts.push(t);
  });
}

export function animateHeroEntrance() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  gsap.fromTo(
    '.hero-anim-item',
    { opacity: 0, y: 26 },
    {
      opacity: 1,
      y: 0,
      duration: 0.72,
      stagger: 0.09,
      ease: 'power3.out'
    }
  );
}

export function initTypewriterTicker() {
  const tickerEl = document.getElementById('heroDynamicTicker');
  if (!tickerEl) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const phrases = [
    'Artificial Intelligence & Machine Learning',
    'Python & Software Engineering',
    'Intelligent Automation & Data Analytics',
    'Interactive 3D AI Systems'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
      charIndex = Math.max(0, charIndex - 1);
    } else {
      charIndex = Math.min(currentPhrase.length, charIndex + 1);
    }

    tickerEl.textContent = currentPhrase.slice(0, charIndex);

    let delay = isDeleting ? 32 : 58;
    if (!isDeleting && charIndex === currentPhrase.length) {
      delay = 1900;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 320;
    }

    setTimeout(tick, delay);
  }

  tick();
}

export function initHoloParallax() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const cards = document.querySelectorAll('.telemetry-card, .skill-category-card');
  cards.forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      if (window.innerWidth < 960) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

export function initScrollAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const revealTargets = document.querySelectorAll(
    '.holo-card, .skill-category-card, .education-holo-card, .robot-summary-card, .section-heading'
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.fromTo(
            entry.target,
            { opacity: 0, y: 26 },
            { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out', overwrite: 'auto' }
          );
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((el) => observer.observe(el));
}

export function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('#skillsFilterBar .skill-filter-btn');
  const skillCards = document.querySelectorAll('#skillsGrid .skill-category-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-skill-cat');
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      skillCards.forEach((card) => {
        const cardCat = card.getAttribute('data-category');
        const show = cat === 'all' || cardCat === cat;
        card.style.display = show ? 'block' : 'none';
        if (show) {
          gsap.fromTo(card, { opacity: 0.3, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.3 });
        }
      });
    });
  });
}

export function initAmbientParticles() {
  const canvas = document.getElementById('ambientParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  let particles = [];

  function createParticles() {
    const count = Math.min(55, Math.floor(width / 24));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.32,
      vy: (Math.random() - 0.5) * 0.32,
      r: Math.random() * 1.6 + 0.5
    }));
  }

  const onResize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  };

  window.addEventListener('resize', onResize, { passive: true });
  createParticles();

  function renderParticles() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(33, 244, 239, 0.7)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(33, 244, 239, ${0.11 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(renderParticles);
  }
  renderParticles();
}
