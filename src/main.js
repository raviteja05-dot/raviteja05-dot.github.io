/**
 * RAVITEJA.AI — THE AI UNIVERSE
 * Main Application Entry Point
 * Developer: Hari Kumar Raviteja Nagireddy
 */

import {
  ALL_ROBOTS_META,
  initHeroRobotStage,
  initLaboratoryStage,
  initContactRobotStage
} from './robots/robotManager.js';
import { initProjectExplorer } from './components/projectExplorer.js';
import { initNavigation } from './components/navigation.js';
import {
  initBootSequence,
  initAmbientParticles,
  initScrollAnimations,
  initSkillsFilter,
  initTypewriterTicker,
  initHoloParallax
} from './components/animations.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Futuristic Boot-up Intro Sequence (with Skip Option)
  initBootSequence();

  // 2. Navigation & Scroll-Spy HUD
  initNavigation();

  // 3. Ambient Background Cyber Network, Typewriter Ticker & Parallax
  initAmbientParticles();
  initTypewriterTicker();
  initHoloParallax();

  // 4. Hero 3D JARVIS Guardian Robot Stage (6 Interactive States)
  const heroCanvas = document.getElementById('heroRobotCanvas');
  const heroSpeech = document.getElementById('heroRobotSpeech');
  const heroStateBadge = document.getElementById('heroStateBadge');
  const heroStateBtns = document.querySelectorAll('#heroStateDeck button[data-jarvis-state]');

  const syncHeroStateUI = (activeState) => {
    if (heroStateBadge) {
      heroStateBadge.textContent = `STATE // ${activeState}`;
    }
    heroStateBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-jarvis-state') === activeState);
    });
  };

  const heroStage = initHeroRobotStage(heroCanvas, heroSpeech, syncHeroStateUI);

  heroStateBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetState = btn.getAttribute('data-jarvis-state');
      if (targetState) {
        heroStage?.setRobotState(targetState);
      }
    });
  });

  // 5. Interactive 6-Robot Project Laboratory Stage & Explorer
  const labCanvas = document.getElementById('labRobotCanvas');
  const labHoverStatusEl = document.getElementById('labHoverStatus');
  let explorerRef = null;
  let currentRobotIdx = 0;

  const labStage = initLaboratoryStage(
    labCanvas,
    (meta, idx, isOverview) => {
      currentRobotIdx = idx;
      if (explorerRef) {
        explorerRef.updateInspector(meta, idx, isOverview);
      }
    },
    (hoveredMeta) => {
      if (!labHoverStatusEl) return;
      if (hoveredMeta) {
        labHoverStatusEl.innerHTML = `<strong style="color: ${hoveredMeta.accentColor};">◈ TARGET LOCK: ${hoveredMeta.unitCode}</strong> — ${hoveredMeta.projectTitle} (Click to inspect &amp; animate)`;
      } else {
        labHoverStatusEl.textContent =
          '💡 Tip: Hover or click any 3D robot in the laboratory to trigger its reaction animation and inspect its project.';
      }
    }
  );

  explorerRef = initProjectExplorer(labStage);

  // Laboratory Camera & Robot Cycle Controls
  const overviewBtn = document.getElementById('labToggleOverviewBtn');
  overviewBtn?.addEventListener('click', () => {
    if (!labStage) return;
    labStage.toggleOverview();
  });

  document.getElementById('labPrevRobotBtn')?.addEventListener('click', () => {
    const prevIdx = (currentRobotIdx - 1 + ALL_ROBOTS_META.length) % ALL_ROBOTS_META.length;
    if (labStage) labStage.focusRobot(prevIdx);
  });

  document.getElementById('labNextRobotBtn')?.addEventListener('click', () => {
    const nextIdx = (currentRobotIdx + 1) % ALL_ROBOTS_META.length;
    if (labStage) labStage.focusRobot(nextIdx);
  });

  // Hero "TALK TO JARVIS AI" quick button
  document.getElementById('heroLaunchJarvisBtn')?.addEventListener('click', () => {
    heroStage?.setRobotState('TALKING');
    if (explorerRef) {
      explorerRef.openLiveDemo(ALL_ROBOTS_META[0]);
    }
  });

  // 6. Interactive Skills Filter
  initSkillsFilter();

  // 7. Contact 3D Comm-Link Robot Stage
  const contactCanvas = document.getElementById('contactRobotCanvas');
  const contactStage = initContactRobotStage(contactCanvas);

  document.querySelectorAll('.contact-channel-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      contactStage?.pulseSignal();
    });
  });

  // 8. Scroll Reveal Animations
  initScrollAnimations();

  // 9. Footer Year
  const yearEl = document.getElementById('footerYear');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
});
