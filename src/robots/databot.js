/**
 * ROBOT 06 — DATABOT
 * Appearance: Small intelligent analytics robot surrounded by floating charts.
 * Personality: Analytical and data-focused.
 * Environment: Futuristic data analytics command centre.
 */

export const databotMetadata = {
  id: 'databot',
  unitCode: 'UNIT-06 // DATABOT',
  name: 'DATABOT',
  projectTitle: 'Food Delivery Data Analysis',
  shortTitle: 'Food Delivery Analytics',
  appearance: 'Small intelligent analytics robot surrounded by floating 3D charts',
  personality: 'Analytical & Data-Focused',
  environment: 'Futuristic Data Analytics Command Centre',
  accentColor: '#2979ff',
  quote: '"Analyzing food delivery telemetry! Filter by cuisine category and date window to inspect order volume, AOV, and delivery speed."',
  description:
    'An interactive data analytics dashboard exploring food delivery metrics, order categories, delivery time distributions, average order value (AOV), and revenue trends using Chart.js.',
  technologies: ['Python Data Science Concept', 'Chart.js', 'Data Analytics', 'Visualization', 'JavaScript'],
  features: [
    'Interactive Sample Food Delivery Dataset',
    'Total Orders & Average Order Value KPIs',
    'Delivery Time Distribution Analysis',
    'Dynamic Revenue & Category Charts',
    'Cuisine Category & Date Range Filters',
    'Instant Telemetry Recalculation'
  ],
  demoId: 'analytics'
};

export function createDatabot(THREE) {
  const root = new THREE.Group();
  root.name = 'databot';

  const coreShellMat = new THREE.MeshStandardMaterial({
    color: 0x101d3b,
    metalness: 0.85,
    roughness: 0.2
  });
  const blueGlowMat = new THREE.MeshStandardMaterial({
    color: 0x2979ff,
    emissive: 0x2979ff,
    emissiveIntensity: 1.8
  });
  const cyanGlowMat = new THREE.MeshStandardMaterial({
    color: 0x21f4ef,
    emissive: 0x21f4ef,
    emissiveIntensity: 1.8
  });
  const purpleGlowMat = new THREE.MeshStandardMaterial({
    color: 0xc43cff,
    emissive: 0xc43cff,
    emissiveIntensity: 1.6
  });

  const bodyGroup = new THREE.Group();
  root.add(bodyGroup);

  // Compact Floating Analytical Pod Body
  const pod = new THREE.Mesh(new THREE.OctahedronGeometry(0.68, 2), coreShellMat);
  pod.position.y = 0.25;
  bodyGroup.add(pod);

  // Gyroscopic Equatorial Ring
  const gyroRing = new THREE.Mesh(new THREE.TorusGeometry(0.84, 0.035, 16, 48), cyanGlowMat);
  gyroRing.rotation.x = Math.PI / 2;
  gyroRing.position.y = 0.25;
  bodyGroup.add(gyroRing);

  // Analytical Head Unit & Optic Lens
  const headGroup = new THREE.Group();
  headGroup.position.y = 1.15;
  bodyGroup.add(headGroup);

  const headCube = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.56, 0.64), coreShellMat);
  headGroup.add(headCube);

  // Dual Analytical Monocle + Matrix Eye
  const leftLens = new THREE.Mesh(new THREE.RingGeometry(0.07, 0.13, 20), cyanGlowMat);
  leftLens.position.set(-0.16, 0.02, 0.33);
  const leftPupil = new THREE.Mesh(new THREE.CircleGeometry(0.05, 16), purpleGlowMat);
  leftPupil.position.set(-0.16, 0.02, 0.335);

  const rightEye = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.04), cyanGlowMat);
  rightEye.position.set(0.16, 0.02, 0.33);
  headGroup.add(leftLens, leftPupil, rightEye);

  // Environment: Floating 3D Bar Charts Around DATABOT
  const chartsGroup = new THREE.Group();
  root.add(chartsGroup);

  const barHeights = [0.45, 0.8, 0.6, 1.05, 0.72, 0.9];
  barHeights.forEach((h, idx) => {
    const angle = (idx / barHeights.length) * Math.PI * 2;
    const barMat = idx % 3 === 0 ? cyanGlowMat : idx % 3 === 1 ? blueGlowMat : purpleGlowMat;
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.18, h, 0.18), barMat);
    bar.position.set(Math.cos(angle) * 1.45, -0.4 + h / 2, Math.sin(angle) * 1.45);
    bar.userData = { baseHeight: h, idx };
    chartsGroup.add(bar);
  });

  const floorRing = new THREE.Mesh(new THREE.RingGeometry(1.35, 1.52, 48), blueGlowMat);
  floorRing.rotation.x = -Math.PI / 2;
  floorRing.position.y = -1.05;
  root.add(floorRing);

  let crunchTime = 0;

  return {
    group: root,
    metadata: databotMetadata,
    interact() {
      crunchTime = 1.6;
    },
    update(elapsed, pointer = { x: 0, y: 0 }) {
      bodyGroup.position.y = Math.sin(elapsed * 2.5) * 0.08;
      gyroRing.rotation.z = elapsed * 0.9;
      gyroRing.rotation.x = Math.PI / 2 + Math.sin(elapsed * 1.5) * 0.22;

      headGroup.rotation.y += (pointer.x * 0.5 - headGroup.rotation.y) * 0.1;
      headGroup.rotation.x += (-pointer.y * 0.28 - headGroup.rotation.x) * 0.1;

      const mult = crunchTime > 0 ? 2.5 : 1.0;
      if (crunchTime > 0) crunchTime = Math.max(0, crunchTime - 0.025);

      chartsGroup.rotation.y = elapsed * 0.38 * mult;
      chartsGroup.children.forEach((bar) => {
        const s = 0.75 + Math.abs(Math.sin(elapsed * 2.4 * mult + bar.userData.idx)) * 0.55;
        bar.scale.y = s;
      });
    }
  };
}

