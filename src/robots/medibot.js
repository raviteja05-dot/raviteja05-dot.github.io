/**
 * ROBOT 02 — MEDIBOT
 * Appearance: Cute friendly healthcare companion robot with medical-themed glowing indicators.
 * Personality: Helpful, caring and friendly.
 * Environment: Futuristic healthcare laboratory.
 */

export const medibotMetadata = {
  id: 'medibot',
  unitCode: 'UNIT-02 // MEDIBOT',
  name: 'MEDIBOT',
  projectTitle: 'AI Medicine Reminder',
  shortTitle: 'AI Medicine Reminder',
  appearance: 'Cute friendly healthcare companion robot with medical-themed glowing indicators',
  personality: 'Helpful, Caring & Friendly',
  environment: 'Futuristic Healthcare Laboratory',
  accentColor: '#00f59b',
  quote: '"Hello there! I am MEDIBOT. I help elderly patients and families stay safe and on schedule with friendly medicine reminders!"',
  description:
    'An elderly-friendly healthcare companion web application designed to simplify daily medication management through clear schedules, dosage tracking, refill alerts, and high-visibility reminders.',
  technologies: ['JavaScript', 'HTML5', 'CSS3', 'LocalStorage API', 'Accessible Healthcare UI'],
  features: [
    'Add Medicine, Dosage & Time Schedule',
    'One-Tap Mark as Taken / Not Now',
    'Automated Refill Status Tracking',
    'Persistent LocalStorage History Log',
    'In-App Reminder Alert Banner',
    'Elderly-Friendly Large Buttons & Text'
  ],
  demoId: 'medicine'
};

export function createMedibot(THREE) {
  const root = new THREE.Group();
  root.name = 'medibot';

  // Materials — clean pearl white + emerald & cyan medical glow
  const pearlWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xeef7ff,
    metalness: 0.25,
    roughness: 0.2
  });
  const visorMat = new THREE.MeshStandardMaterial({
    color: 0x071526,
    metalness: 0.8,
    roughness: 0.15
  });
  const emeraldGlowMat = new THREE.MeshStandardMaterial({
    color: 0x00f59b,
    emissive: 0x00f59b,
    emissiveIntensity: 1.7,
    roughness: 0.15
  });
  const cyanGlowMat = new THREE.MeshStandardMaterial({
    color: 0x21f4ef,
    emissive: 0x21f4ef,
    emissiveIntensity: 1.5
  });
  const heartPinkMat = new THREE.MeshStandardMaterial({
    color: 0xff36c7,
    emissive: 0xff36c7,
    emissiveIntensity: 1.4
  });

  const bodyGroup = new THREE.Group();
  root.add(bodyGroup);

  // Cute rounded pill-shaped body
  const torso = new THREE.Mesh(new THREE.SphereGeometry(0.75, 28, 28), pearlWhiteMat);
  torso.scale.set(1, 1.12, 0.92);
  torso.position.y = 0.05;
  bodyGroup.add(torso);

  // Glowing Medical Cross Emblem on Chest
  const crossGroup = new THREE.Group();
  crossGroup.position.set(0, 0.12, 0.69);
  const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.34, 0.05), emeraldGlowMat);
  const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.11, 0.05), emeraldGlowMat);
  crossGroup.add(crossV, crossH);
  bodyGroup.add(crossGroup);

  // Cute rounded flipper-like caring arms
  const leftArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.48, 12, 16), pearlWhiteMat);
  leftArm.position.set(-0.88, 0.12, 0.1);
  leftArm.rotation.z = 0.35;

  const rightArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.48, 12, 16), pearlWhiteMat);
  rightArm.position.set(0.88, 0.12, 0.1);
  rightArm.rotation.z = -0.35;
  bodyGroup.add(leftArm, rightArm);

  // Cute Head Group
  const headGroup = new THREE.Group();
  headGroup.position.y = 1.15;
  bodyGroup.add(headGroup);

  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.56, 28, 24), pearlWhiteMat);
  headMesh.scale.set(1.18, 0.95, 1.0);
  headGroup.add(headMesh);

  // Dark Glass Face Visor
  const visor = new THREE.Mesh(new THREE.SphereGeometry(0.49, 24, 20), visorMat);
  visor.scale.set(1.12, 0.78, 0.65);
  visor.position.set(0, 0.02, 0.24);
  headGroup.add(visor);

  // Friendly Oval Eyes
  const eyeGeo = new THREE.SphereGeometry(0.085, 16, 16);
  const leftEye = new THREE.Mesh(eyeGeo, emeraldGlowMat);
  leftEye.scale.set(1, 1.25, 0.4);
  leftEye.position.set(-0.18, 0.06, 0.54);

  const rightEye = leftEye.clone();
  rightEye.position.x = 0.18;
  headGroup.add(leftEye, rightEye);

  // Rosy/Caring Cheek Indicators
  const cheekGeo = new THREE.CircleGeometry(0.055, 16);
  const leftCheek = new THREE.Mesh(cheekGeo, heartPinkMat);
  leftCheek.position.set(-0.3, -0.06, 0.52);
  leftCheek.rotation.y = -0.25;
  const rightCheek = new THREE.Mesh(cheekGeo, heartPinkMat);
  rightCheek.position.set(0.3, -0.06, 0.52);
  rightCheek.rotation.y = 0.25;
  headGroup.add(leftCheek, rightCheek);

  // Gentle Halo Sensor Ring above Head
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.03, 12, 32), cyanGlowMat);
  halo.rotation.x = Math.PI / 2;
  halo.position.y = 0.65;
  headGroup.add(halo);

  // Healthcare Laboratory Environment: Bio-rings & floating medicine capsules
  const envGroup = new THREE.Group();
  root.add(envGroup);

  const floorRing = new THREE.Mesh(new THREE.RingGeometry(1.35, 1.48, 48), emeraldGlowMat);
  floorRing.rotation.x = -Math.PI / 2;
  floorRing.position.y = -1.1;
  envGroup.add(floorRing);

  const floatingPills = new THREE.Group();
  envGroup.add(floatingPills);

  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const pill = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.08, 0.18, 8, 12),
      i % 2 === 0 ? emeraldGlowMat : cyanGlowMat
    );
    pill.position.set(Math.cos(angle) * 1.45, 0.2 + (i % 2) * 0.5, Math.sin(angle) * 1.45);
    pill.rotation.z = 0.6;
    floatingPills.add(pill);
  }

  let joyTime = 0;

  return {
    group: root,
    metadata: medibotMetadata,
    interact() {
      joyTime = 1.5;
    },
    update(elapsed, pointer = { x: 0, y: 0 }) {
      // Gentle cheerful bounce
      bodyGroup.position.y = Math.sin(elapsed * 2.8) * 0.11;
      bodyGroup.rotation.z = Math.sin(elapsed * 1.4) * 0.03;

      // Head follows pointer warmly
      headGroup.rotation.y += (pointer.x * 0.5 - headGroup.rotation.y) * 0.09;
      headGroup.rotation.x += (-pointer.y * 0.3 - headGroup.rotation.x) * 0.09;

      // Blinking
      const blink = (elapsed + 1.2) % 3.8 > 3.65;
      leftEye.scale.y = blink ? 0.12 : 1.25;
      rightEye.scale.y = blink ? 0.12 : 1.25;

      // Heartbeat pulse on medical cross
      const beat = 1 + Math.sin(elapsed * 6) * 0.12;
      crossGroup.scale.set(beat, beat, 1);

      if (joyTime > 0) {
        joyTime = Math.max(0, joyTime - 0.025);
        leftArm.rotation.z = -0.6 + Math.sin(elapsed * 14) * 0.4;
        rightArm.rotation.z = 0.6 - Math.sin(elapsed * 14) * 0.4;
      } else {
        leftArm.rotation.z = 0.35 + Math.sin(elapsed * 2.2) * 0.08;
        rightArm.rotation.z = -0.35 - Math.sin(elapsed * 2.2) * 0.08;
      }

      halo.position.y = 0.65 + Math.sin(elapsed * 3.5) * 0.05;
      floatingPills.rotation.y = elapsed * 0.5;
    }
  };
}

