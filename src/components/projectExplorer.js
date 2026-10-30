/**
 * INTERACTIVE PROJECT LABORATORY & DEMO LAUNCHER COMPONENT
 * Connects the 6 3D Robot Characters to the Holographic Inspector Panel
 * and lazy-loads each of the 6 live working project demonstrations on demand.
 */

import gsap from 'gsap';
import { ALL_ROBOTS_META } from '../robots/robotManager.js';

// Lazy-loaded dynamic imports for optimal initial bundle performance
const DEMO_LOADERS = {
  jarvis: () => import('../projects/jarvisDemo.js').then((m) => m.mountJarvisDemo),
  medicine: () => import('../projects/medicineDemo.js').then((m) => m.mountMedicineDemo),
  incluseval: () => import('../projects/inclusEvalDemo.js').then((m) => m.mountInclusEvalDemo),
  ecommerce: () => import('../projects/ecommerceDemo.js').then((m) => m.mountEcommerceDemo),
  spaceshooter: () => import('../projects/spaceShooter.js').then((m) => m.mountSpaceShooterDemo),
  analytics: () => import('../projects/analyticsDemo.js').then((m) => m.mountAnalyticsDemo)
};

export function initProjectExplorer(labController) {
  const dockEl = document.getElementById('robotSelectorDock');
  const inspectorEl = document.getElementById('labInspectorPanel');
  const summaryGridEl = document.getElementById('robotSummaryGrid');
  const envBadgeEl = document.getElementById('labEnvBadge');
  const activeUnitBadgeEl = document.getElementById('labActiveUnitBadge');
  const modalBackdropEl = document.getElementById('demoModalBackdrop');
  const modalBadgeEl = document.getElementById('demoModalBadge');
  const modalTitleEl = document.getElementById('demoModalTitle');
  const modalBodyEl = document.getElementById('demoModalBody');
  const modalCloseBtn = document.getElementById('demoModalCloseBtn');
  const modalBackBtn = document.getElementById('demoModalBackBtn');

  let activeCleanupFn = null;
  let currentMeta = ALL_ROBOTS_META[0];

  // 1. Render 6-Robot Selector Dock
  if (dockEl) {
    dockEl.innerHTML = ALL_ROBOTS_META.map(
      (meta, idx) => `
      <button
        type="button"
        class="robot-dock-card ${idx === 0 ? 'active' : ''}"
        data-robot-index="${idx}"
        style="--robot-accent: ${meta.accentColor};"
        aria-label="Select ${meta.name} — ${meta.projectTitle}"
      >
        <div class="dock-unit-id">
          <span>0${idx + 1} // ${meta.name}</span>
          <span>●</span>
        </div>
        <div class="dock-robot-name">${meta.name}</div>
        <div class="dock-project-short">${meta.shortTitle}</div>
      </button>
    `
    ).join('');

    dockEl.querySelectorAll('.robot-dock-card').forEach((card) => {
      card.addEventListener('click', () => {
        const idx = Number(card.getAttribute('data-robot-index'));
        if (labController) {
          labController.focusRobot(idx, true);
        } else {
          updateInspector(ALL_ROBOTS_META[idx], idx);
        }
      });
    });
  }

  // 2. Render 6-Robot Quick-Launch Summary Cards
  if (summaryGridEl) {
    summaryGridEl.innerHTML = ALL_ROBOTS_META.map(
      (meta, idx) => `
      <article class="robot-summary-card" style="border-color: ${meta.accentColor}44;">
        <div>
          <div class="robot-summary-top">
            <span class="unit-code" style="color: ${meta.accentColor};">${meta.unitCode}</span>
            <span class="unit-personality">${meta.personality}</span>
          </div>
          <h4>${meta.projectTitle}</h4>
          <p>${meta.description}</p>
          <div class="inspector-tech-tags" style="margin-bottom: 18px;">
            ${meta.technologies.map((t) => `<span class="tech-chip">${t}</span>`).join('')}
          </div>
        </div>
        <div class="robot-summary-btns">
          <button type="button" class="btn btn-outline" data-focus-robot="${idx}">
            INSPECT 3D ROBOT
          </button>
          <button type="button" class="btn btn-primary" data-launch-demo="${meta.id}">
            LIVE DEMO ↗
          </button>
        </div>
      </article>
    `
    ).join('');

    summaryGridEl.querySelectorAll('button[data-focus-robot]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-focus-robot'));
        const arena = document.getElementById('labArenaAnchor');
        if (arena) arena.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (labController) labController.focusRobot(idx, true);
        else updateInspector(ALL_ROBOTS_META[idx], idx);
      });
    });

    summaryGridEl.querySelectorAll('button[data-launch-demo]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-launch-demo');
        const meta = ALL_ROBOTS_META.find((m) => m.id === id);
        if (meta) openLiveDemo(meta);
      });
    });
  }

  // 3. Update Holographic Inspector Panel
  function updateInspector(meta, idx, isOverview = false) {
    currentMeta = meta;

    if (dockEl) {
      dockEl.querySelectorAll('.robot-dock-card').forEach((card, i) => {
        card.classList.toggle('active', i === idx);
      });
    }

    if (envBadgeEl) {
      envBadgeEl.textContent = isOverview
        ? 'ENVIRONMENT // FULL 6-ROBOT AI LABORATORY OVERVIEW'
        : `ENVIRONMENT // ${meta.environment.toUpperCase()}`;
      envBadgeEl.style.color = meta.accentColor;
    }

    if (activeUnitBadgeEl) {
      activeUnitBadgeEl.textContent = `ACTIVE ROBOT // ${meta.unitCode}`;
    }

    const overviewToggleBtn = document.getElementById('labToggleOverviewBtn');
    if (overviewToggleBtn) {
      overviewToggleBtn.textContent = isOverview
        ? '🔍 FOCUS ACTIVE ROBOT'
        : '🌌 VIEW ALL 6 IN LAB';
    }

    if (!inspectorEl) return;

    inspectorEl.innerHTML = `
      <div>
        <div class="inspector-unit-header">
          <span class="unit-code" style="color: ${meta.accentColor};">${meta.unitCode}</span>
          <span class="unit-personality">${meta.personality}</span>
        </div>

        <h3 class="inspector-project-title">${meta.projectTitle}</h3>

        <div class="inspector-robot-quote" style="border-left-color: ${meta.accentColor}; color: ${meta.accentColor};">
          ${meta.quote}
        </div>

        <p class="inspector-description">${meta.description}</p>

        <div class="inspector-subheading">ROBOT APPEARANCE &amp; DEDICATED ENVIRONMENT</div>
        <p style="font-size: 13px; color: var(--text-main); margin-bottom: 16px;">
          <strong>Appearance:</strong> ${meta.appearance}<br>
          <strong>Environment:</strong> ${meta.environment}
        </p>

        <div class="inspector-subheading">KEY PROJECT FEATURES</div>
        <ul class="inspector-features-list">
          ${meta.features.map((f) => `<li>${f}</li>`).join('')}
        </ul>

        <div class="inspector-subheading">TECHNOLOGY STACK</div>
        <div class="inspector-tech-tags">
          ${meta.technologies.map((t) => `<span class="tech-chip">${t}</span>`).join('')}
        </div>
      </div>

      <div class="inspector-actions">
        <button type="button" class="btn btn-primary" id="inspectorLaunchDemoBtn" style="flex: 1.3;">
          🚀 LIVE DEMO (${meta.name}) ↗
        </button>
        <button type="button" class="btn btn-outline" id="inspectorAnimateRobotBtn" style="flex: 0.7;">
          ⚡ ANIMATE ${meta.name}
        </button>
        <button type="button" class="mini-hud-btn" id="inspectorBackOverviewBtn" style="width: 100%; padding: 9px 12px; margin-top: 4px;">
          ${isOverview ? '🔍 ZOOM INTO ' + meta.name + ' STATION' : '← BACK TO ALL 6 ROBOTS OVERVIEW'}
        </button>
      </div>
    `;

    gsap.fromTo(
      inspectorEl,
      { opacity: 0.45, y: 10 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
    );

    inspectorEl.querySelector('#inspectorLaunchDemoBtn')?.addEventListener('click', () => {
      openLiveDemo(meta);
    });

    inspectorEl.querySelector('#inspectorAnimateRobotBtn')?.addEventListener('click', () => {
      if (labController) labController.interactActive();
    });

    inspectorEl.querySelector('#inspectorBackOverviewBtn')?.addEventListener('click', () => {
      if (labController) {
        labController.toggleOverview();
      }
    });
  }

  // 4. Open / Close Live Demo Modal with Lazy Loading & Loading Animation
  async function openLiveDemo(meta) {
    if (!modalBackdropEl || !modalBodyEl) return;

    if (activeCleanupFn) {
      try {
        activeCleanupFn();
      } catch {
        // ignore
      }
      activeCleanupFn = null;
    }

    modalBadgeEl.textContent = meta.unitCode;
    modalBadgeEl.style.color = meta.accentColor;
    modalBadgeEl.style.borderColor = meta.accentColor;
    modalTitleEl.textContent = meta.projectTitle;

    // Show holographic loading state while lazy-loading demo module
    modalBodyEl.innerHTML = `
      <div class="demo-loading-state">
        <div class="boot-core-ring" style="width:52px; height:52px; margin-bottom:14px;">
          <div class="boot-core-inner" style="width:26px; height:26px;"></div>
        </div>
        <strong style="font-family:var(--font-display); color:var(--cyan); letter-spacing:2px; font-size:13px;">
          INITIALIZING ${meta.name} SIMULATION MODULE...
        </strong>
      </div>
    `;

    modalBackdropEl.classList.add('open');
    document.body.style.overflow = 'hidden';

    try {
      const loader = DEMO_LOADERS[meta.demoId];
      if (loader) {
        const mountFn = await loader();
        activeCleanupFn = mountFn(modalBodyEl) || null;
      }
    } catch (err) {
      modalBodyEl.innerHTML = `
        <div style="padding:24px; text-align:center; color:#ff6b93;">
          Unable to load demonstration module. Please refresh and try again.
        </div>
      `;
      console.error(err);
    }
  }

  function closeLiveDemo() {
    if (!modalBackdropEl) return;
    modalBackdropEl.classList.remove('open');
    document.body.style.overflow = '';
    if (activeCleanupFn) {
      try {
        activeCleanupFn();
      } catch {
        // ignore
      }
      activeCleanupFn = null;
    }
  }

  modalCloseBtn?.addEventListener('click', closeLiveDemo);
  modalBackBtn?.addEventListener('click', closeLiveDemo);

  modalBackdropEl?.addEventListener('click', (e) => {
    if (e.target === modalBackdropEl) closeLiveDemo();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdropEl?.classList.contains('open')) {
      closeLiveDemo();
    }
  });

  // Initialize Inspector with Robot 01 (JARVIS)
  updateInspector(currentMeta, 0, false);

  return {
    updateInspector,
    openLiveDemo,
    closeLiveDemo
  };
}
