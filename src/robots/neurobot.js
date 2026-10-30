/**
 * ROBOT 03 — NEUROBOT
 * Appearance: Advanced AI robot with holographic brain-inspired visual elements.
 * Personality: Analytical and intelligent.
 * Environment: Adaptive assessment research laboratory.
 */

export const neurobotMetadata = {
  id: 'neurobot',
  unitCode: 'UNIT-03 // NEUROBOT',
  name: 'NEUROBOT',
  projectTitle: 'INCLUSEVAL — SIH1777 Adaptive Assessment',
  shortTitle: 'InclusEval (SIH1777)',
  appearance: 'Advanced AI robot with holographic brain-inspired visual elements',
  personality: 'Analytical & Intelligent',
  environment: 'Adaptive Assessment Research Laboratory',
  accentColor: '#c43cff',
  quote: '"Welcome to the InclusEval cognitive research node. I dynamically adapt assessment difficulty while ensuring accessibility for every learner."',
  description:
    'An AI-driven inclusive skill assessment platform concept (SIH Problem Statement SIH1777) designed to evaluate candidates fairly using adaptive difficulty progression and accessible interface controls.',
  technologies: ['Python', 'Flask', 'SQLite', 'Adaptive Assessment Logic', 'Accessible Web UI'],
  features: [
    'Candidate Profile & Assessment Briefing',
    'Dynamic Adaptive Difficulty Scaling',
    'Accessible Font Size & High-Contrast Mode',
    'Interactive Multiple-Choice Evaluation',
    'Real-Time Progress & Difficulty Telemetry',
    'Comprehensive Competency Result Summary'
  ],
  demoId: 'incluseval'
};

export function createNeurobot(THREE) {
  const root = new THREE.Group();
  root.name = 'neurobot';

  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x160f30,
    metalness: 0.85,
    roughness: 0.25
  });
  const glassDomeMat = new THREE.MeshPhysicalMaterial({
    color: 0xc43cff,
    transparent: true,
    opacity: 0.28,
    roughness: 0.08,
    metalness: 0.1
  });
  const purpleGlowMat = new THREE.MeshStandardMaterial({
    color: 0xc43cff,
    emissive: 0xc43cff,
    emissiveIntensity: 1.9
  });
  const cyanGlowMat = new THREE.MeshStandardMaterial({
    color: 0x21f4ef,
    emissive: 0x21f4ef,
    emissiveIntensity: 1.7
  });
  const magentaWireMat = new THREE.MeshBasicMaterial({
    color: 0xff36c7,
    wireframe: true,
    transparent: true,
    opacity: 0.55
  });

  const bodyGroup = new THREE.Group();
  root.add(bodyGroup);

  // Sleek tapered hovering analytical torso
  const torso = new THREE.Mesh(new THREE.ConeGeometry(0.66, 1.45, 6), chassisMat);
  torso.rotation.x = Math.PI;
  torso.position.y = 0.08;
  bodyGroup.add(torso);

  // Neural Rib Rings around Torso
  for (let i = 0; i < 3; i++) {
    const rib = new THREE.Mesh(
      new THREE.TorusGeometry(0.54 - i * 0.1, 0.025, 12, 28),
      i % 2 === 0 ? purpleGlowMat : cyanGlowMat
    );
    rib.rotation.x = Math.PI / 2;
    rib.position.y = 0.42 - i * 0.34;
    bodyGroup.add(rib);
  }

  // Floating Telekinetic Hand Orbs
  const leftOrb = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 1), cyanGlowMat);
  leftOrb.position.set(-0.95, 0.3, 0.2);
  const rightOrb = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 1), purpleGlowMat);
  rightOrb.position.set(0.95, 0.3, 0.2);
  bodyGroup.add(leftOrb, rightOrb);

  // Head Group with Translucent Cranial Dome & Holographic Brain Core
  const headGroup = new THREE.Group();
  headGroup.position.y = 1.32;
  bodyGroup.add(headGroup);

  const headBase = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.38, 0.36, 16), chassisMat);
  headBase.position.y = -0.22;
  headGroup.add(headBase);

  // Translucent Brain Dome
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.56, 24, 24), glassDomeMat);
  dome.position.y = 0.08;
  headGroup.add(dome);

  // Holographic Brain Left/Right Hemispheres inside Dome
  const brainGroup = new THREE.Group();
  brainGroup.position.y = 0.12;
  const leftHemi = new THREE.Mesh(new THREE.IcosahedronGeometry(0.26, 1), magentaWireMat);
  leftHemi.scale.set(0.85, 1, 1.25);
  leftHemi.position.x = -0.14;
  const rightHemi = leftHemi.clone();
  rightHemi.position.x = 0.14;
  brainGroup.add(leftHemi, rightHemi);

  // Synaptic Core Nodes inside Brain
  for (let i = 0; i < 5; i++) {
    const synapse = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 8, 8),
      i % 2 === 0 ? cyanGlowMat : purpleGlowMat
    );
    synapse.position.set((i - 2) * 0.09, Math.sin(i) * 0.1, Math.cos(i) * 0.1);
    brainGroup.add(synapse);
  }
  headGroup.add(brainGroup);

  // Analytical Dual-Optic Visor Eyes
  const eyeGeo = new THREE.BoxGeometry(0.18, 0.06, 0.06);
  const leftEye = new THREE.Mesh(eyeGeo, cyanGlowMat);
  leftEye.position.set(-0.15, -0.18, 0.42);
  const rightEye = new THREE.Mesh(eyeGeo, cyanGlowMat);
  rightEye.position.set(0.15, -0.18, 0.42);
  headGroup.add(leftEye, rightEye);

  // Environment: Orbiting Synaptic Rings
  const envGroup = new THREE.Group();
  root.add(envGroup);

  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.018, 12, 64), purpleGlowMat);
  ring1.rotation.x = 1.1;
  ring1.rotation.y = 0.4;
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.015, 12, 64), cyanGlowMat);
  ring2.rotation.x = -0.9;
  ring2.rotation.y = -0.5;
  envGroup.add(ring1, ring2);

  let scanBoost = 0;

  return {
    group: root,
    metadata: neurobotMetadata,
    interact() {
      scanBoost = 1.5;
    },
    update(elapsed, pointer = { x: 0, y: 0 }) {
      bodyGroup.position.y = Math.sin(elapsed * 2.0) * 0.09;

      headGroup.rotation.y += (pointer.x * 0.48 - headGroup.rotation.y) * 0.08;
      headGroup.rotation.x += (-pointer.y * 0.25 - headGroup.rotation.x) * 0.08;

      const speed = scanBoost > 0 ? 4.5 : 1.2;
      if (scanBoost > 0) scanBoost = Math.max(0, scanBoost - 0.02);

      brainGroup.rotation.y += 0.02 * speed;
      const brainScale = 1 + Math.sin(elapsed * 5) * 0.06;
      brainGroup.scale.set(brainScale, brainScale, brainScale);

      leftOrb.position.y = 0.3 + Math.sin(elapsed * 3.2) * 0.16;
      rightOrb.position.y = 0.3 + Math.cos(elapsed * 3.2) * 0.16;
      leftOrb.rotation.y = elapsed * 2;
      rightOrb.rotation.x = elapsed * 2;

      ring1.rotation.z = elapsed * 0.35 * speed;
      ring2.rotation.z = -elapsed * 0.28 * speed;
    }
  };
}

