/**
 * ROBOT 05 — SPACEBOT
 * Appearance: Futuristic space exploration robot.
 * Personality: Energetic and adventurous.
 * Environment: Space station with animated stars and planets.
 */

export const spacebotMetadata = {
  id: 'spacebot',
  unitCode: 'UNIT-05 // SPACEBOT',
  name: 'SPACEBOT',
  projectTitle: 'Space Shooter Game',
  shortTitle: 'Space Shooter Game',
  appearance: 'Futuristic space exploration robot with thruster wings and orbital visor',
  personality: 'Energetic & Adventurous',
  environment: 'Space Station with Animated Stars & Planets',
  accentColor: '#ff36c7',
  quote: '"Thrusters online! Ready to pilot our starfighter through enemy squadrons? Launch the Space Shooter simulator!"',
  description:
    'An interactive arcade space shooter game inspired by C++ & SFML game engineering principles, featuring player starfighter controls, plasma weapon systems, enemy waves, collision physics, score tracking, and shield lives.',
  technologies: ['C++ Concept', 'SFML Architecture', 'OOP', 'HTML5 Canvas', 'Game Loop Physics'],
  features: [
    'Playable Real-Time Starfighter Combat',
    'Keyboard (WASD / Arrows + Space) & Touch Controls',
    'Enemy Squadron Waves & Boss Cruisers',
    'Precision Bounding-Box Collision Detection',
    'Live Score Counter, Combo & Shield Lives',
    'Instant Game Over & Mission Restart'
  ],
  demoId: 'spaceshooter'
};

export function createSpacebot(THREE) {
  const root = new THREE.Group();
  root.name = 'spacebot';

  const suitMat = new THREE.MeshStandardMaterial({
    color: 0x1c2548,
    metalness: 0.7,
    roughness: 0.25
  });
  const goldVisorMat = new THREE.MeshStandardMaterial({
    color: 0x0a1026,
    metalness: 0.95,
    roughness: 0.1
  });
  const magentaGlowMat = new THREE.MeshStandardMaterial({
    color: 0xff36c7,
    emissive: 0xff36c7,
    emissiveIntensity: 1.85
  });
  const cyanGlowMat = new THREE.MeshStandardMaterial({
    color: 0x21f4ef,
    emissive: 0x21f4ef,
    emissiveIntensity: 1.75
  });

  const bodyGroup = new THREE.Group();
  root.add(bodyGroup);

  // Space Suit Pressurized Torso
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.48, 0.56, 16, 20), suitMat);
  torso.position.y = 0.12;
  bodyGroup.add(torso);

  // Jetpack & Dual Delta Wings on Back
  const jetpack = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.72, 0.38), suitMat);
  jetpack.position.set(0, 0.18, -0.44);
  bodyGroup.add(jetpack);

  // Aerodynamic Energy Wings
  const wingGeo = new THREE.BoxGeometry(0.88, 0.28, 0.06);
  const leftWing = new THREE.Mesh(wingGeo, magentaGlowMat);
  leftWing.position.set(-0.78, 0.25, -0.45);
  leftWing.rotation.z = 0.28;
  const rightWing = new THREE.Mesh(wingGeo, magentaGlowMat);
  rightWing.position.set(0.78, 0.25, -0.45);
  rightWing.rotation.z = -0.28;
  bodyGroup.add(leftWing, rightWing);

  // Thruster Flame Cones
  const flameGeo = new THREE.ConeGeometry(0.14, 0.42, 12);
  const leftFlame = new THREE.Mesh(flameGeo, cyanGlowMat);
  leftFlame.rotation.x = Math.PI;
  leftFlame.position.set(-0.22, -0.35, -0.44);
  const rightFlame = leftFlame.clone();
  rightFlame.position.x = 0.22;
  bodyGroup.add(leftFlame, rightFlame);

  // Astronaut Arms
  const armGeo = new THREE.CapsuleGeometry(0.13, 0.42, 10, 12);
  const leftArm = new THREE.Mesh(armGeo, suitMat);
  leftArm.position.set(-0.66, 0.18, 0.12);
  leftArm.rotation.z = 0.42;
  const rightArm = new THREE.Mesh(armGeo, suitMat);
  rightArm.position.set(0.66, 0.18, 0.12);
  rightArm.rotation.z = -0.42;
  bodyGroup.add(leftArm, rightArm);

  // Astronaut Helmet Group
  const headGroup = new THREE.Group();
  headGroup.position.y = 1.1;
  bodyGroup.add(headGroup);

  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 24), suitMat);
  headGroup.add(helmet);

  const domeVisor = new THREE.Mesh(new THREE.SphereGeometry(0.49, 24, 20), goldVisorMat);
  domeVisor.position.set(0, 0.02, 0.14);
  headGroup.add(domeVisor);

  // Adventurous Star-Visor Eyes
  const leftEye = new THREE.Mesh(new THREE.OctahedronGeometry(0.085, 0), cyanGlowMat);
  leftEye.position.set(-0.16, 0.06, 0.58);
  const rightEye = leftEye.clone();
  rightEye.position.x = 0.16;
  headGroup.add(leftEye, rightEye);

  // Environment: Orbiting Ringed Planet & Mini Starfield
  const envGroup = new THREE.Group();
  root.add(envGroup);

  const orbitPivot = new THREE.Group();
  envGroup.add(orbitPivot);

  const planetGroup = new THREE.Group();
  planetGroup.position.set(1.55, 0.75, -0.4);
  const planet = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), magentaGlowMat);
  const planetRing = new THREE.Mesh(new THREE.RingGeometry(0.32, 0.46, 32), cyanGlowMat);
  planetRing.rotation.x = 1.2;
  planetGroup.add(planet, planetRing);
  orbitPivot.add(planetGroup);

  // Starfield nodes
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const star = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.05, 0),
      i % 2 === 0 ? cyanGlowMat : magentaGlowMat
    );
    star.position.set(Math.cos(angle) * 1.65, -0.7 + (i % 5) * 0.45, Math.sin(angle) * 1.65);
    orbitPivot.add(star);
  }

  let boostTime = 0;

  return {
    group: root,
    metadata: spacebotMetadata,
    interact() {
      boostTime = 1.5;
    },
    update(elapsed, pointer = { x: 0, y: 0 }) {
      // Energetic zero-gravity hover
      bodyGroup.position.y = Math.sin(elapsed * 3.2) * 0.14;
      bodyGroup.rotation.z = Math.sin(elapsed * 1.8) * 0.07;

      headGroup.rotation.y += (pointer.x * 0.55 - headGroup.rotation.y) * 0.1;
      headGroup.rotation.x += (-pointer.y * 0.32 - headGroup.rotation.x) * 0.1;

      const flameScale = (boostTime > 0 ? 1.8 : 1.0) + Math.sin(elapsed * 24) * 0.25;
      if (boostTime > 0) boostTime = Math.max(0, boostTime - 0.025);
      leftFlame.scale.y = flameScale;
      rightFlame.scale.y = flameScale;

      orbitPivot.rotation.y = elapsed * 0.42;
      planetGroup.rotation.y = elapsed * 0.9;
    }
  };
}

