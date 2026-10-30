/**
 * ROBOT MANAGER — THREE.JS 3D SCENE & CHARACTER ORCHESTRATOR
 * Manages:
 *  1. Hero 3D JARVIS Guardian Robot with 6 Interactive States
 *     (IDLE, GREETING, THINKING, SCANNING, TALKING, SLEEPING)
 *  2. Interactive Project Laboratory with all 6 Distinct 3D Robots,
 *     Raycast Hover Reactions, & Smooth Camera Transitions
 *  3. Contact Section Animated Comm-Link Robot
 *  4. WebGL Availability Detection & Graceful Holographic SVG Fallback
 */

import * as THREE from 'three';
import gsap from 'gsap';
import { createJarvisRobot, jarvisMetadata, JARVIS_STATES } from './jarvisRobot.js';
import { createMedibot, medibotMetadata } from './medibot.js';
import { createNeurobot, neurobotMetadata } from './neurobot.js';
import { createShopbot, shopbotMetadata } from './shopbot.js';
import { createSpacebot, spacebotMetadata } from './spacebot.js';
import { createDatabot, databotMetadata } from './databot.js';

export { JARVIS_STATES };

export const ALL_ROBOTS_META = [
  jarvisMetadata,
  medibotMetadata,
  neurobotMetadata,
  shopbotMetadata,
  spacebotMetadata,
  databotMetadata
];

export function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

function renderFallback(containerEl, labelText = '3D HOLOGRAPHIC CORE ACTIVE') {
  if (!containerEl) return;
  const fallback = document.createElement('div');
  fallback.className = 'webgl-fallback-box';
  fallback.innerHTML = `
    <svg class="fallback-robot-svg" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${labelText}">
      <circle cx="60" cy="60" r="52" stroke="#21f4ef" stroke-width="2" stroke-dasharray="6 4" />
      <rect x="34" y="32" width="52" height="44" rx="12" fill="#0d1836" stroke="#21f4ef" stroke-width="2.5" />
      <circle cx="48" cy="52" r="6" fill="#21f4ef" />
      <circle cx="72" cy="52" r="6" fill="#21f4ef" />
      <rect x="46" y="64" width="28" height="4" rx="2" fill="#c43cff" />
      <path d="M40 82 H80 L88 106 H32 L40 82Z" fill="#122044" stroke="#c43cff" stroke-width="2" />
    </svg>
    <strong style="font-family: var(--font-display); color: var(--cyan); font-size: 13px; letter-spacing: 1.5px;">${labelText}</strong>
    <p style="color: var(--text-secondary); font-size: 12.5px; margin-top: 6px; max-width: 320px;">
      Interactive 2D Holographic Mode enabled (WebGL hardware acceleration unavailable). All project demos and controls are 100% active.
    </p>
  `;
  containerEl.appendChild(fallback);
}

const STATE_MESSAGES = {
  IDLE: '"STATE [IDLE]: Optical sensors tracking your cursor. Select any state button below or enter the AI Laboratory!"',
  GREETING: '"STATE [GREETING]: Hello! Welcome to Raviteja\'s AI Universe. I am JARVIS, your interactive 3D guide."',
  THINKING: '"STATE [THINKING]: Neural halo engaged — processing AI, Machine Learning, and Python architecture matrices..."',
  SCANNING: '"STATE [SCANNING]: Holographic laser sweep active! Scanning all 6 laboratory project sectors..."',
  TALKING: '"STATE [TALKING]: Vocal synthesizer active! I can introduce Raviteja\'s B.Tech AIML journey and launch live demos."',
  SLEEPING: '"STATE [SLEEPING]: Low-power standby mode engaged... Zzz... Click any button or tap me to wake my neural core!"'
};

/**
 * 1. HERO 3D JARVIS GUARDIAN ROBOT STAGE (6 INTERACTION STATES)
 */
export function initHeroRobotStage(canvasEl, speechBubbleEl, onStateChange) {
  if (!canvasEl) return null;
  const parent = canvasEl.parentElement;

  let fallbackState = 'IDLE';
  if (!isWebGLAvailable()) {
    renderFallback(parent, 'JARVIS-PRIME // 6-STATE AI ROBOT');
    return {
      setRobotState(stateName) {
        const s = String(stateName).toUpperCase();
        if (JARVIS_STATES.includes(s)) {
          fallbackState = s;
          if (speechBubbleEl && STATE_MESSAGES[s]) {
            speechBubbleEl.textContent = STATE_MESSAGES[s];
          }
          if (onStateChange) onStateChange(s);
        }
      },
      getRobotState() {
        return fallbackState;
      },
      triggerReaction(mode) {
        this.setRobotState(mode === 'spin' ? 'SCANNING' : 'GREETING');
      },
      dispose() {}
    };
  }

  const renderer = new THREE.WebGLRenderer({
    canvas: canvasEl,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.55, 5.2);

  // Futuristic Neon Lighting
  const ambientLight = new THREE.AmbientLight(0x1a2855, 1.85);
  const cyanPoint = new THREE.PointLight(0x21f4ef, 4.4, 15);
  cyanPoint.position.set(3, 3.5, 4);
  const purplePoint = new THREE.PointLight(0xc43cff, 3.8, 15);
  purplePoint.position.set(-3.2, 2.2, 3.5);
  const magentaRim = new THREE.PointLight(0xff36c7, 2.6, 12);
  magentaRim.position.set(0, -2.5, -3);
  scene.add(ambientLight, cyanPoint, purplePoint, magentaRim);

  // Hero JARVIS Robot Character
  const heroBot = createJarvisRobot(THREE);
  heroBot.group.scale.setScalar(0.95);
  scene.add(heroBot.group);

  // Floating 3D Particle Field
  const particleCount = 95;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 5 - 1;
  }
  const partGeo = new THREE.BufferGeometry();
  partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const partMat = new THREE.PointsMaterial({
    color: 0x21f4ef,
    size: 0.055,
    transparent: true,
    opacity: 0.75
  });
  const particleSystem = new THREE.Points(partGeo, partMat);
  scene.add(particleSystem);

  const pointer = { x: 0, y: 0 };
  let isVisible = true;

  function setRobotState(newState) {
    const applied = heroBot.setState(newState, 0);
    if (speechBubbleEl && STATE_MESSAGES[applied]) {
      speechBubbleEl.textContent = STATE_MESSAGES[applied];
    }

    // Visual camera & scale micro-feedback per state
    if (applied === 'GREETING') {
      gsap.fromTo(
        heroBot.group.scale,
        { x: 1.05, y: 1.05, z: 1.05 },
        { x: 0.95, y: 0.95, z: 0.95, duration: 0.55, ease: 'back.out(2)' }
      );
    } else if (applied === 'SCANNING') {
      gsap.to(heroBot.group.rotation, {
        y: heroBot.group.rotation.y + Math.PI * 2,
        duration: 1.35,
        ease: 'power2.inOut'
      });
    } else if (applied === 'THINKING') {
      gsap.to(camera.position, { z: 4.85, duration: 0.5, ease: 'power2.out' });
    } else if (applied === 'SLEEPING') {
      gsap.to(camera.position, { z: 5.5, duration: 0.6, ease: 'power2.out' });
    } else {
      gsap.to(camera.position, { z: 5.2, duration: 0.5, ease: 'power2.out' });
    }

    if (onStateChange) onStateChange(applied);
    return applied;
  }

  function triggerReaction(mode = 'wave') {
    if (mode === 'spin') setRobotState('SCANNING');
    else if (mode === 'pulse') setRobotState('THINKING');
    else setRobotState('GREETING');
  }

  const onPointerMove = (e) => {
    const rect = canvasEl.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  canvasEl.addEventListener('click', () => {
    const current = heroBot.getState();
    const nextIdx = (JARVIS_STATES.indexOf(current) + 1) % JARVIS_STATES.length;
    setRobotState(JARVIS_STATES[nextIdx]);
  });

  function resize() {
    if (!parent) return;
    const w = parent.clientWidth || 500;
    const h = parent.clientHeight || 480;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
      });
    },
    { threshold: 0.05 }
  );
  io.observe(canvasEl);

  const clock = new THREE.Clock();
  let animFrameId = null;

  function animate() {
    animFrameId = requestAnimationFrame(animate);
    if (!isVisible) return;
    const elapsed = clock.getElapsedTime();
    heroBot.update(elapsed, pointer);
    const curState = heroBot.getState();
    particleSystem.rotation.y = elapsed * (curState === 'SLEEPING' ? 0.015 : 0.065);
    cyanPoint.intensity = curState === 'SLEEPING' ? 1.4 : 3.9 + Math.sin(elapsed * 2.5) * 0.6;
    renderer.render(scene, camera);
  }
  animate();

  return {
    setRobotState,
    getRobotState() {
      return heroBot.getState();
    },
    triggerReaction,
    dispose() {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', resize);
      io.disconnect();
      renderer.dispose();
    }
  };
}

/**
 * 2. INTERACTIVE 6-ROBOT PROJECT LABORATORY STAGE
 */
export function initLaboratoryStage(canvasEl, onSelectRobot, onHoverRobot) {
  if (!canvasEl) return null;
  const parent = canvasEl.parentElement;

  const creators = [
    createJarvisRobot,
    createMedibot,
    createNeurobot,
    createShopbot,
    createSpacebot,
    createDatabot
  ];

  let activeIndex = 0;
  let hoveredIndex = -1;
  let overviewMode = false;

  if (!isWebGLAvailable()) {
    renderFallback(parent, '6-ROBOT AI PROJECT LABORATORY');
    return {
      focusRobot(idOrIndex) {
        const idx =
          typeof idOrIndex === 'number'
            ? idOrIndex
            : ALL_ROBOTS_META.findIndex((m) => m.id === idOrIndex);
        if (idx >= 0) {
          activeIndex = idx;
          if (onSelectRobot) onSelectRobot(ALL_ROBOTS_META[activeIndex], activeIndex);
        }
      },
      toggleOverview(forceState) {
        overviewMode = typeof forceState === 'boolean' ? forceState : !overviewMode;
        return overviewMode;
      },
      isOverview() {
        return overviewMode;
      },
      interactActive() {}
    };
  }

  const renderer = new THREE.WebGLRenderer({
    canvas: canvasEl,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 120);
  camera.position.set(0, 0.85, 5.4);

  // Laboratory Lighting
  const ambient = new THREE.AmbientLight(0x1b2956, 2.0);
  const keyLight = new THREE.PointLight(0x21f4ef, 4.5, 25);
  keyLight.position.set(3.5, 4.5, 5.5);
  const fillLight = new THREE.PointLight(0xc43cff, 3.5, 25);
  fillLight.position.set(-4, 3, 4);
  const rimLight = new THREE.PointLight(0xff36c7, 2.5, 20);
  rimLight.position.set(0, 3, -5);
  scene.add(ambient, keyLight, fillLight, rimLight);

  // Futuristic Hexagonal Laboratory Floor Grid
  const labGridGroup = new THREE.Group();
  labGridGroup.position.y = -1.25;
  scene.add(labGridGroup);

  const gridHelper = new THREE.GridHelper(24, 24, 0x21f4ef, 0x162858);
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.25;
  labGridGroup.add(gridHelper);

  // Semicircle coordinates for all 6 robots in the Laboratory
  const stationPositions = [
    new THREE.Vector3(-5.2, 0, -2.2),
    new THREE.Vector3(-3.1, 0, -1.1),
    new THREE.Vector3(-1.05, 0, -0.4),
    new THREE.Vector3(1.05, 0, -0.4),
    new THREE.Vector3(3.1, 0, -1.1),
    new THREE.Vector3(5.2, 0, -2.2)
  ];

  const robotInstances = creators.map((createFn, idx) => {
    const instance = createFn(THREE);
    instance.group.userData = { robotIndex: idx, robotId: instance.metadata.id };

    // Add a glowing laboratory pedestal under each robot
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(1.15, 1.3, 0.16, 24),
      new THREE.MeshStandardMaterial({
        color: 0x0b1530,
        metalness: 0.85,
        roughness: 0.2
      })
    );
    pedestal.position.y = -1.16;
    instance.group.add(pedestal);
    instance.pedestal = pedestal;

    scene.add(instance.group);
    return instance;
  });

  function arrangeRobots(animateTransition = true) {
    robotInstances.forEach((bot, idx) => {
      let targetPos;
      let targetScale;

      if (overviewMode) {
        targetPos = stationPositions[idx];
        targetScale = idx === activeIndex ? 0.68 : 0.56;
      } else {
        if (idx === activeIndex) {
          targetPos = new THREE.Vector3(0, 0.05, 0.65);
          targetScale = 0.96;
        } else {
          const offsetIdx = idx - activeIndex;
          targetPos = new THREE.Vector3(offsetIdx * 2.25, -0.15, -3.2 - Math.abs(offsetIdx) * 0.45);
          targetScale = 0.48;
        }
      }

      if (animateTransition) {
        gsap.to(bot.group.position, {
          x: targetPos.x,
          y: targetPos.y,
          z: targetPos.z,
          duration: 0.75,
          ease: 'power3.out'
        });
        gsap.to(bot.group.scale, {
          x: targetScale,
          y: targetScale,
          z: targetScale,
          duration: 0.75,
          ease: 'power3.out'
        });
      } else {
        bot.group.position.copy(targetPos);
        bot.group.scale.setScalar(targetScale);
      }
    });

    const camZ = overviewMode ? 8.8 : 5.2;
    const camY = overviewMode ? 1.35 : 0.75;
    if (animateTransition) {
      gsap.to(camera.position, {
        x: 0,
        y: camY,
        z: camZ,
        duration: 0.8,
        ease: 'power2.out'
      });
    } else {
      camera.position.set(0, camY, camZ);
    }

    const activeMeta = ALL_ROBOTS_META[activeIndex];
    if (activeMeta && activeMeta.accentColor) {
      keyLight.color.set(activeMeta.accentColor);
    }
  }

  arrangeRobots(false);

  function focusRobot(idOrIndex, exitOverview = false) {
    const idx =
      typeof idOrIndex === 'number'
        ? idOrIndex
        : ALL_ROBOTS_META.findIndex((m) => m.id === idOrIndex);
    if (idx < 0 || idx >= robotInstances.length) return;
    if (exitOverview) overviewMode = false;
    activeIndex = idx;
    robotInstances[activeIndex].interact();
    arrangeRobots(true);
    if (onSelectRobot) {
      onSelectRobot(ALL_ROBOTS_META[activeIndex], activeIndex, overviewMode);
    }
  }

  function toggleOverview(forceState) {
    overviewMode = typeof forceState === 'boolean' ? forceState : !overviewMode;
    arrangeRobots(true);
    if (onSelectRobot) {
      onSelectRobot(ALL_ROBOTS_META[activeIndex], activeIndex, overviewMode);
    }
    return overviewMode;
  }

  // Raycaster for both Hover Reactions and Click Selection
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const pointer = { x: 0, y: 0 };

  function getHoveredRobotIndex(clientX, clientY) {
    const rect = canvasEl.getBoundingClientRect();
    if (!rect.width || !rect.height) return -1;
    mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);
    for (const hit of intersects) {
      let obj = hit.object;
      while (obj && obj.parent && obj.userData?.robotIndex === undefined) {
        obj = obj.parent;
      }
      if (obj && typeof obj.userData?.robotIndex === 'number') {
        return obj.userData.robotIndex;
      }
    }
    return -1;
  }

  const onPointerMove = (e) => {
    const rect = canvasEl.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    // Check if pointer is inside canvas bounds for hover detection
    if (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    ) {
      const hitIdx = getHoveredRobotIndex(e.clientX, e.clientY);
      if (hitIdx !== hoveredIndex) {
        hoveredIndex = hitIdx;
        canvasEl.style.cursor = hitIdx >= 0 ? 'pointer' : 'grab';
        if (onHoverRobot) {
          onHoverRobot(hitIdx >= 0 ? ALL_ROBOTS_META[hitIdx] : null, hitIdx);
        }
      }
    }
  };

  const onCanvasClick = (e) => {
    const clickedIdx = getHoveredRobotIndex(e.clientX, e.clientY);
    if (clickedIdx >= 0) {
      focusRobot(clickedIdx, true);
      return;
    }
    robotInstances[activeIndex].interact();
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  canvasEl.addEventListener('click', onCanvasClick);

  function resize() {
    if (!parent) return;
    const w = parent.clientWidth || 640;
    const h = parent.clientHeight || 540;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  let isVisible = true;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
      });
    },
    { threshold: 0.05 }
  );
  io.observe(canvasEl);

  const clock = new THREE.Clock();
  let animId = null;

  function animate() {
    animId = requestAnimationFrame(animate);
    if (!isVisible) return;
    const elapsed = clock.getElapsedTime();
    robotInstances.forEach((bot, idx) => {
      const botPointer = idx === activeIndex || idx === hoveredIndex ? pointer : { x: 0, y: 0 };
      bot.update(elapsed + idx * 0.7, botPointer);
    });
    renderer.render(scene, camera);
  }
  animate();

  return {
    focusRobot,
    toggleOverview,
    isOverview() {
      return overviewMode;
    },
    interactActive() {
      robotInstances[activeIndex].interact();
    },
    getActiveMetadata() {
      return ALL_ROBOTS_META[activeIndex];
    },
    dispose() {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', resize);
      canvasEl.removeEventListener('click', onCanvasClick);
      io.disconnect();
      renderer.dispose();
    }
  };
}

/**
 * 3. CONTACT SECTION ANIMATED COMM-LINK ROBOT
 */
export function initContactRobotStage(canvasEl) {
  if (!canvasEl) return null;
  const parent = canvasEl.parentElement;
  if (!isWebGLAvailable()) {
    renderFallback(parent, 'COMM-BOT // TRANSMISSION NODE');
    return null;
  }

  const renderer = new THREE.WebGLRenderer({
    canvas: canvasEl,
    antialias: true,
    alpha: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
  camera.position.set(0, 0.65, 4.9);

  const ambient = new THREE.AmbientLight(0x1f2d5a, 2.0);
  const cyanLight = new THREE.PointLight(0x21f4ef, 4.0, 15);
  cyanLight.position.set(2.5, 3, 4);
  const purpleLight = new THREE.PointLight(0xc43cff, 3.5, 15);
  purpleLight.position.set(-2.5, 2, 3.5);
  scene.add(ambient, cyanLight, purpleLight);

  const commBot = createJarvisRobot(THREE);
  commBot.group.scale.setScalar(0.9);
  scene.add(commBot.group);

  const pointer = { x: 0, y: 0 };
  const onPointerMove = (e) => {
    const rect = canvasEl.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  canvasEl.addEventListener('click', () => commBot.setState('GREETING', 2.5));

  function resize() {
    if (!parent) return;
    const w = parent.clientWidth || 420;
    const h = parent.clientHeight || 380;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  let isVisible = true;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
      });
    },
    { threshold: 0.05 }
  );
  io.observe(canvasEl);

  const clock = new THREE.Clock();
  let animId = null;

  function animate() {
    animId = requestAnimationFrame(animate);
    if (!isVisible) return;
    commBot.update(clock.getElapsedTime(), pointer);
    renderer.render(scene, camera);
  }
  animate();

  return {
    pulseSignal() {
      commBot.setState('TALKING', 2.2);
    }
  };
}
