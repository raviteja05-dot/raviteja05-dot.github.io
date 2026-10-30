/**
 * ROBOT 01 — JARVIS (ADVANCED 3D HUMANOID AI ROBOT)
 * Appearance: Advanced humanoid AI robot with cyan glowing eyes, layered cyber-armor,
 *             counter-rotating arc reactor turbine, vocal equalizer, and holographic scanner.
 * Personality: Intelligent, professional and helpful.
 * Environment: Futuristic AI Control Room & Laboratory.
 * Interaction States: IDLE, GREETING, THINKING, SCANNING, TALKING, SLEEPING
 */

export const JARVIS_STATES = ['IDLE', 'GREETING', 'THINKING', 'SCANNING', 'TALKING', 'SLEEPING'];

export const jarvisMetadata = {
  id: 'jarvis',
  unitCode: 'UNIT-01 // JARVIS',
  name: 'JARVIS',
  projectTitle: 'JARVIS — Personal AI Assistant',
  shortTitle: 'Personal AI Assistant',
  appearance: 'Advanced humanoid AI robot with cyan glowing eyes, multi-ring arc reactor, and futuristic cyber-armor',
  personality: 'Intelligent, Professional & Helpful',
  environment: 'Futuristic AI Control Room',
  accentColor: '#21f4ef',
  quote: '"Greetings. I am JARVIS — Raviteja\'s personal AI assistant prototype. Switch my neural state or launch my live voice & chat console!"',
  description:
    'An intelligent personal assistant system focused on natural conversation, contextual command execution, voice recognition, text-to-speech synthesis, and smart task automation.',
  technologies: ['Python', 'JavaScript', 'Web Speech API', 'Speech Synthesis', 'AI Automation'],
  features: [
    'Interactive AI Chat Console with Typing Effect',
    'Browser Voice Input (Speech-to-Text)',
    'Neural-style Text-to-Speech Output',
    '6 Interactive 3D Robot States (Idle, Greeting, Thinking, Scanning, Talking, Sleeping)',
    'Contextual Portfolio & AI Knowledge',
    'Session Conversation History'
  ],
  demoId: 'jarvis'
};

export function createJarvisRobot(THREE) {
  const root = new THREE.Group();
  root.name = 'jarvisRobot';

  // Materials
  const armorMat = new THREE.MeshStandardMaterial({
    color: 0x101d3a,
    metalness: 0.86,
    roughness: 0.2
  });
  const darkMetalMat = new THREE.MeshStandardMaterial({
    color: 0x070d1e,
    metalness: 0.92,
    roughness: 0.26
  });
  const cyanGlowMat = new THREE.MeshStandardMaterial({
    color: 0x21f4ef,
    emissive: 0x21f4ef,
    emissiveIntensity: 1.9,
    roughness: 0.1
  });
  const purpleGlowMat = new THREE.MeshStandardMaterial({
    color: 0xc43cff,
    emissive: 0xc43cff,
    emissiveIntensity: 1.5,
    roughness: 0.15
  });
  const magentaGlowMat = new THREE.MeshStandardMaterial({
    color: 0xff36c7,
    emissive: 0xff36c7,
    emissiveIntensity: 1.7,
    roughness: 0.15
  });
  const holoMat = new THREE.MeshBasicMaterial({
    color: 0x21f4ef,
    wireframe: true,
    transparent: true,
    opacity: 0.28
  });
  const scanBeamMat = new THREE.MeshBasicMaterial({
    color: 0x21f4ef,
    transparent: true,
    opacity: 0.0,
    side: THREE.DoubleSide
  });
  const pulseRingMat = new THREE.MeshBasicMaterial({
    color: 0x21f4ef,
    transparent: true,
    opacity: 0.0,
    side: THREE.DoubleSide
  });

  // Character Body Group
  const bodyGroup = new THREE.Group();
  root.add(bodyGroup);

  // Upper Torso & Lower Waist Actuator
  const chestGeo = new THREE.CylinderGeometry(0.7, 0.48, 1.25, 8);
  const chest = new THREE.Mesh(chestGeo, armorMat);
  chest.position.y = 0.26;
  bodyGroup.add(chest);

  const waistRing = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.04, 12, 28), cyanGlowMat);
  waistRing.rotation.x = Math.PI / 2;
  waistRing.position.y = -0.35;
  bodyGroup.add(waistRing);

  const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.28, 0.42, 8), darkMetalMat);
  pelvis.position.y = -0.58;
  bodyGroup.add(pelvis);

  // Layered Chest Armor Plates & Collar Guard
  const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.68, 0.56), darkMetalMat);
  chestPlate.position.set(0, 0.38, 0.22);
  bodyGroup.add(chestPlate);

  const collarGuard = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.055, 12, 24), armorMat);
  collarGuard.rotation.x = Math.PI / 2;
  collarGuard.position.y = 0.88;
  bodyGroup.add(collarGuard);

  // Multi-Ring Arc Reactor Turbine on Chest
  const reactorGroup = new THREE.Group();
  reactorGroup.position.set(0, 0.38, 0.52);
  bodyGroup.add(reactorGroup);

  const coreOuter = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.032, 16, 32), cyanGlowMat);
  const coreMiddle = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.022, 12, 6), purpleGlowMat);
  const coreInner = new THREE.Mesh(new THREE.CircleGeometry(0.12, 24), cyanGlowMat);
  reactorGroup.add(coreOuter, coreMiddle, coreInner);

  // Shoulder Pauldrons & Articulated Arms
  const leftShoulderGroup = new THREE.Group();
  leftShoulderGroup.position.set(-0.9, 0.68, 0);
  const rightShoulderGroup = new THREE.Group();
  rightShoulderGroup.position.set(0.9, 0.68, 0);

  const pauldronGeo = new THREE.DodecahedronGeometry(0.33, 0);
  const leftPauldron = new THREE.Mesh(pauldronGeo, armorMat);
  const rightPauldron = new THREE.Mesh(pauldronGeo, armorMat);
  leftShoulderGroup.add(leftPauldron);
  rightShoulderGroup.add(rightPauldron);

  const stripGeo = new THREE.BoxGeometry(0.1, 0.44, 0.44);
  const leftStrip = new THREE.Mesh(stripGeo, cyanGlowMat);
  leftStrip.position.x = -0.19;
  const rightStrip = new THREE.Mesh(stripGeo, cyanGlowMat);
  rightStrip.position.x = 0.19;
  leftShoulderGroup.add(leftStrip);
  rightShoulderGroup.add(rightStrip);

  const upperArmGeo = new THREE.CylinderGeometry(0.15, 0.13, 0.7, 12);
  const forearmGeo = new THREE.CylinderGeometry(0.14, 0.11, 0.68, 12);
  const wristCuffGeo = new THREE.TorusGeometry(0.13, 0.025, 10, 20);
  const handGeo = new THREE.SphereGeometry(0.14, 14, 14);

  const leftArm = new THREE.Mesh(upperArmGeo, darkMetalMat);
  leftArm.position.y = -0.44;
  const leftForearm = new THREE.Mesh(forearmGeo, armorMat);
  leftForearm.position.set(0, -0.94, 0.12);
  leftForearm.rotation.x = -0.35;
  const leftCuff = new THREE.Mesh(wristCuffGeo, cyanGlowMat);
  leftCuff.rotation.x = Math.PI / 2;
  leftCuff.position.set(0, -1.2, 0.21);
  const leftHand = new THREE.Mesh(handGeo, cyanGlowMat);
  leftHand.position.set(0, -1.32, 0.25);
  leftShoulderGroup.add(leftArm, leftForearm, leftCuff, leftHand);

  const rightArm = new THREE.Mesh(upperArmGeo, darkMetalMat);
  rightArm.position.y = -0.44;
  const rightForearm = new THREE.Mesh(forearmGeo, armorMat);
  rightForearm.position.set(0, -0.94, 0.12);
  rightForearm.rotation.x = -0.35;
  const rightCuff = new THREE.Mesh(wristCuffGeo, cyanGlowMat);
  rightCuff.rotation.x = Math.PI / 2;
  rightCuff.position.set(0, -1.2, 0.21);
  const rightHand = new THREE.Mesh(handGeo, cyanGlowMat);
  rightHand.position.set(0, -1.32, 0.25);
  rightShoulderGroup.add(rightArm, rightForearm, rightCuff, rightHand);

  bodyGroup.add(leftShoulderGroup, rightShoulderGroup);

  // Neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.3, 12), darkMetalMat);
  neck.position.y = 0.98;
  bodyGroup.add(neck);

  // Head Group
  const headGroup = new THREE.Group();
  headGroup.position.y = 1.44;
  bodyGroup.add(headGroup);

  const helmet = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.74, 0.76), armorMat);
  headGroup.add(helmet);

  // Crown Crest & Forehead Neural Node
  const crest = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.24, 0.82), cyanGlowMat);
  crest.position.set(0, 0.37, 0);
  headGroup.add(crest);

  // Dark Visor Faceplate
  const faceplate = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.54, 0.1), darkMetalMat);
  faceplate.position.set(0, -0.01, 0.36);
  headGroup.add(faceplate);

  // Cyan Glowing Eyes with Optic Pupils
  const eyeGeo = new THREE.BoxGeometry(0.2, 0.085, 0.05);
  const leftEye = new THREE.Mesh(eyeGeo, cyanGlowMat);
  leftEye.position.set(-0.16, 0.07, 0.41);
  const rightEye = new THREE.Mesh(eyeGeo, cyanGlowMat);
  rightEye.position.set(0.16, 0.07, 0.41);
  headGroup.add(leftEye, rightEye);

  // 5-Bar Vocal Equalizer Mouth
  const vocalGroup = new THREE.Group();
  vocalGroup.position.set(0, -0.14, 0.415);
  const vocalBars = [];
  for (let i = 0; i < 5; i++) {
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.042, 0.04, 0.03),
      i % 2 === 0 ? cyanGlowMat : purpleGlowMat
    );
    bar.position.x = (i - 2) * 0.065;
    vocalGroup.add(bar);
    vocalBars.push(bar);
  }
  headGroup.add(vocalGroup);

  // Ear Comms Antennae
  const earGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.24, 12);
  const leftEar = new THREE.Mesh(earGeo, cyanGlowMat);
  leftEar.rotation.z = Math.PI / 2;
  leftEar.position.set(-0.43, 0.05, 0);
  const rightEar = leftEar.clone();
  rightEar.position.x = 0.43;
  headGroup.add(leftEar, rightEar);

  // Thinking Neural Halo above Head
  const thinkingHalo = new THREE.Group();
  thinkingHalo.position.y = 0.65;
  thinkingHalo.visible = false;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const dot = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.055, 0),
      i % 2 === 0 ? purpleGlowMat : cyanGlowMat
    );
    dot.position.set(Math.cos(a) * 0.52, 0, Math.sin(a) * 0.52);
    thinkingHalo.add(dot);
  }
  headGroup.add(thinkingHalo);

  // Holographic Scanning Laser Plane
  const scanLaserPlane = new THREE.Mesh(new THREE.RingGeometry(0.3, 1.75, 36), scanBeamMat);
  scanLaserPlane.rotation.x = -Math.PI / 2;
  scanLaserPlane.position.y = 0.4;
  root.add(scanLaserPlane);

  // Expanding Energy Pulse Wave Ring
  const energyPulseRing = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.035, 16, 48), pulseRingMat);
  energyPulseRing.rotation.x = Math.PI / 2;
  energyPulseRing.position.y = 0.35;
  root.add(energyPulseRing);

  // Environment Props: Futuristic AI Control Room Rings & Data Nodes
  const envGroup = new THREE.Group();
  root.add(envGroup);

  const labFloorRing = new THREE.Mesh(new THREE.RingGeometry(1.45, 1.56, 48), cyanGlowMat);
  labFloorRing.rotation.x = -Math.PI / 2;
  labFloorRing.position.y = -1.15;
  envGroup.add(labFloorRing);

  const holoSphere = new THREE.Mesh(new THREE.IcosahedronGeometry(1.92, 1), holoMat);
  holoSphere.position.y = 0.3;
  envGroup.add(holoSphere);

  const nodesGroup = new THREE.Group();
  envGroup.add(nodesGroup);
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const node = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.11, 0),
      i % 2 === 0 ? cyanGlowMat : i % 3 === 0 ? magentaGlowMat : purpleGlowMat
    );
    node.position.set(Math.cos(angle) * 1.52, 0.2 + (i % 3) * 0.45, Math.sin(angle) * 1.52);
    nodesGroup.add(node);
  }

  // State Machine Variables
  let currentState = 'IDLE';
  let stateTimer = 0;
  let pulseProgress = 0;

  function setState(newState, durationSec = 0) {
    const normalized = String(newState).toUpperCase();
    if (!JARVIS_STATES.includes(normalized)) return currentState;
    currentState = normalized;
    stateTimer = durationSec;
    if (normalized === 'GREETING' || normalized === 'SCANNING') {
      pulseProgress = 1.0;
    }
    return currentState;
  }

  return {
    group: root,
    metadata: jarvisMetadata,
    setState,
    getState() {
      return currentState;
    },
    interact() {
      setState('GREETING', 2.8);
    },
    update(elapsed, pointer = { x: 0, y: 0 }) {
      // Auto-return to IDLE if a timed state expires
      if (stateTimer > 0) {
        stateTimer = Math.max(0, stateTimer - 0.016);
        if (stateTimer === 0 && currentState !== 'SLEEPING') {
          currentState = 'IDLE';
        }
      }

      // Pulse Ring expansion effect
      if (pulseProgress > 0) {
        pulseProgress = Math.max(0, pulseProgress - 0.022);
        const s = 1 + (1 - pulseProgress) * 1.65;
        energyPulseRing.scale.set(s, s, 1);
        pulseRingMat.opacity = pulseProgress * 0.65;
      } else {
        pulseRingMat.opacity = 0;
      }

      // State-specific behaviors
      if (currentState === 'SLEEPING') {
        // Low-power slumber mode
        bodyGroup.position.y = Math.sin(elapsed * 1.1) * 0.04 - 0.06;
        headGroup.rotation.x += (0.38 - headGroup.rotation.x) * 0.06;
        headGroup.rotation.y += (0 - headGroup.rotation.y) * 0.06;
        leftEye.scale.y = 0.08;
        rightEye.scale.y = 0.08;
        cyanGlowMat.emissiveIntensity = 0.45 + Math.sin(elapsed * 1.5) * 0.15;
        rightShoulderGroup.rotation.z += (-0.12 - rightShoulderGroup.rotation.z) * 0.08;
        leftShoulderGroup.rotation.z += (0.12 - leftShoulderGroup.rotation.z) * 0.08;
        thinkingHalo.visible = false;
        scanBeamMat.opacity = 0;
        vocalBars.forEach((b) => {
          b.scale.y = 0.3;
        });
      } else {
        // Active power level
        cyanGlowMat.emissiveIntensity = 1.85 + Math.sin(elapsed * 3.5) * 0.25;
        bodyGroup.position.y = Math.sin(elapsed * 2.2) * 0.08;

        // Pointer Head Tracking
        let targetRotY = pointer.x * 0.48;
        let targetRotX = -pointer.y * 0.28 + Math.sin(elapsed * 1.5) * 0.04;

        if (currentState === 'THINKING') {
          targetRotZ(headGroup, Math.sin(elapsed * 2.5) * 0.12);
          targetRotX -= 0.12;
        } else {
          targetRotZ(headGroup, 0);
        }

        headGroup.rotation.y += (targetRotY - headGroup.rotation.y) * 0.09;
        headGroup.rotation.x += (targetRotX - headGroup.rotation.x) * 0.09;

        // Natural Blinking
        const blinkCycle = elapsed % 4.1;
        const isBlinking = blinkCycle > 3.96;
        leftEye.scale.y = isBlinking ? 0.1 : 1;
        rightEye.scale.y = isBlinking ? 0.1 : 1;

        // GREETING state
        if (currentState === 'GREETING') {
          rightShoulderGroup.rotation.z = 0.55 + Math.sin(elapsed * 11) * 0.32;
          leftShoulderGroup.rotation.z = -Math.sin(elapsed * 2.0) * 0.08;
        } else if (currentState === 'TALKING') {
          rightShoulderGroup.rotation.z = 0.18 + Math.sin(elapsed * 6) * 0.14;
          leftShoulderGroup.rotation.z = -0.18 - Math.cos(elapsed * 6) * 0.14;
        } else {
          rightShoulderGroup.rotation.z += (Math.sin(elapsed * 1.8) * 0.06 - rightShoulderGroup.rotation.z) * 0.1;
          leftShoulderGroup.rotation.z += (-Math.sin(elapsed * 1.8) * 0.06 - leftShoulderGroup.rotation.z) * 0.1;
        }

        // THINKING state
        thinkingHalo.visible = currentState === 'THINKING';
        if (currentState === 'THINKING') {
          thinkingHalo.rotation.y = elapsed * 3.8;
          thinkingHalo.rotation.z = Math.sin(elapsed * 2) * 0.2;
        }

        // SCANNING state
        if (currentState === 'SCANNING') {
          scanBeamMat.opacity = 0.42;
          scanLaserPlane.position.y = 0.35 + Math.sin(elapsed * 4.2) * 1.25;
          scanLaserPlane.rotation.z = elapsed * 2.5;
        } else {
          scanBeamMat.opacity = 0;
        }

        // TALKING & Vocalizer Equalizer animation
        vocalBars.forEach((bar, idx) => {
          if (currentState === 'TALKING' || currentState === 'GREETING') {
            bar.scale.y = 1.2 + Math.abs(Math.sin(elapsed * 16 + idx * 1.1)) * 2.8;
          } else if (currentState === 'THINKING') {
            bar.scale.y = 0.8 + Math.abs(Math.cos(elapsed * 8 + idx)) * 1.2;
          } else {
            bar.scale.y = 0.8 + Math.sin(elapsed * 3 + idx) * 0.25;
          }
        });
      }

      // Arc Reactor Turbine & Environment Rotation
      const reactorSpeed = currentState === 'THINKING' || currentState === 'SCANNING' ? 0.14 : 0.03;
      coreOuter.rotation.z += reactorSpeed;
      coreMiddle.rotation.z -= reactorSpeed * 1.4;

      holoSphere.rotation.y = elapsed * 0.18;
      holoSphere.rotation.x = Math.sin(elapsed * 0.3) * 0.15;
      nodesGroup.rotation.y = -elapsed * (currentState === 'THINKING' ? 1.1 : 0.45);
    }
  };
}

function targetRotZ(obj, val) {
  obj.rotation.z += (val - obj.rotation.z) * 0.08;
}
