/**
 * ROBOT 04 — SHOPBOT
 * Appearance: Compact futuristic service robot.
 * Personality: Smart and customer-friendly.
 * Environment: Futuristic digital shopping centre.
 */

export const shopbotMetadata = {
  id: 'shopbot',
  unitCode: 'UNIT-04 // SHOPBOT',
  name: 'SHOPBOT',
  projectTitle: 'E-Commerce Management System',
  shortTitle: 'E-Commerce System',
  appearance: 'Compact futuristic service robot',
  personality: 'Smart & Customer-Friendly',
  environment: 'Futuristic Digital Shopping Centre',
  accentColor: '#ffbe2e',
  quote: '"Welcome to the Digital Commerce Hub! I organize product catalogs, inventory records, cart calculations, and instant checkouts."',
  description:
    'A database-inspired e-commerce management application demonstrating product catalog organization, category filtering, live search, cart state management, dynamic pricing, and order checkout.',
  technologies: ['SQL', 'DBMS', 'Database Design', 'JavaScript', 'State Management'],
  features: [
    'Interactive Product Catalog & Descriptions',
    'Category Filtering & Instant Search',
    'Live Shopping Cart Add / Remove',
    'Dynamic Quantity & Price Calculation',
    'Inventory Stock & SKU Indicators',
    'Interactive Order Checkout Receipt'
  ],
  demoId: 'ecommerce'
};

export function createShopbot(THREE) {
  const root = new THREE.Group();
  root.name = 'shopbot';

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x1a2442,
    metalness: 0.75,
    roughness: 0.25
  });
  const trimMat = new THREE.MeshStandardMaterial({
    color: 0x0b1022,
    metalness: 0.85,
    roughness: 0.2
  });
  const amberGlowMat = new THREE.MeshStandardMaterial({
    color: 0xffbe2e,
    emissive: 0xffbe2e,
    emissiveIntensity: 1.7
  });
  const cyanGlowMat = new THREE.MeshStandardMaterial({
    color: 0x21f4ef,
    emissive: 0x21f4ef,
    emissiveIntensity: 1.6
  });

  const bodyGroup = new THREE.Group();
  root.add(bodyGroup);

  // Compact service chassis (rounded cube with display screen on chest)
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.95, 0.82), bodyMat);
  chassis.position.y = -0.05;
  bodyGroup.add(chassis);

  // Front Digital Kiosk Screen on Torso
  const screenFrame = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.56, 0.08), trimMat);
  screenFrame.position.set(0, -0.02, 0.41);
  bodyGroup.add(screenFrame);

  const screenGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.64, 0.44), cyanGlowMat);
  screenGlow.position.set(0, -0.02, 0.46);
  bodyGroup.add(screenGlow);

  // Twin Omni-Wheels at Base
  const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.18, 20);
  const leftWheel = new THREE.Mesh(wheelGeo, trimMat);
  leftWheel.rotation.z = Math.PI / 2;
  leftWheel.position.set(-0.62, -0.62, 0);
  const rightWheel = leftWheel.clone();
  rightWheel.position.x = 0.62;
  bodyGroup.add(leftWheel, rightWheel);

  const leftHub = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.03, 12, 24), amberGlowMat);
  leftHub.rotation.y = Math.PI / 2;
  leftHub.position.set(-0.72, -0.62, 0);
  const rightHub = leftHub.clone();
  rightHub.position.x = 0.72;
  bodyGroup.add(leftHub, rightHub);

  // Service Tray Arms carrying a Holographic Parcel
  const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.65), bodyMat);
  leftArm.position.set(-0.64, 0.05, 0.28);
  const rightArm = leftArm.clone();
  rightArm.position.x = 0.64;
  bodyGroup.add(leftArm, rightArm);

  // Compact Friendly Head
  const headGroup = new THREE.Group();
  headGroup.position.y = 0.82;
  bodyGroup.add(headGroup);

  const headBox = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.52, 0.62), bodyMat);
  headGroup.add(headBox);

  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.34, 0.06), trimMat);
  visor.position.set(0, 0, 0.3);
  headGroup.add(visor);

  // Expressive Barcode/Scanner Eyes
  const leftEye = new THREE.Mesh(new THREE.CircleGeometry(0.085, 16), amberGlowMat);
  leftEye.position.set(-0.17, 0.02, 0.34);
  const rightEye = new THREE.Mesh(new THREE.CircleGeometry(0.085, 16), amberGlowMat);
  rightEye.position.set(0.17, 0.02, 0.34);
  headGroup.add(leftEye, rightEye);

  // Top Beacon Antenna
  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.25, 8), trimMat);
  antenna.position.y = 0.36;
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), amberGlowMat);
  beacon.position.y = 0.5;
  headGroup.add(antenna, beacon);

  // Environment: Floating Holographic Product Cubes
  const envGroup = new THREE.Group();
  root.add(envGroup);

  const floorRing = new THREE.Mesh(new THREE.RingGeometry(1.38, 1.5, 48), amberGlowMat);
  floorRing.rotation.x = -Math.PI / 2;
  floorRing.position.y = -1.02;
  envGroup.add(floorRing);

  const parcelsGroup = new THREE.Group();
  envGroup.add(parcelsGroup);
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.24, 0.24),
      i % 2 === 0 ? amberGlowMat : cyanGlowMat
    );
    cube.position.set(Math.cos(angle) * 1.48, 0.2 + (i % 2) * 0.4, Math.sin(angle) * 1.48);
    parcelsGroup.add(cube);
  }

  let spinBoost = 0;

  return {
    group: root,
    metadata: shopbotMetadata,
    interact() {
      spinBoost = 1.4;
    },
    update(elapsed, pointer = { x: 0, y: 0 }) {
      bodyGroup.position.y = Math.sin(elapsed * 3.0) * 0.06;

      headGroup.rotation.y += (pointer.x * 0.5 - headGroup.rotation.y) * 0.1;
      headGroup.rotation.x += (-pointer.y * 0.25 - headGroup.rotation.x) * 0.1;

      const blink = (elapsed + 0.5) % 3.5 > 3.35;
      leftEye.scale.y = blink ? 0.15 : 1;
      rightEye.scale.y = blink ? 0.15 : 1;

      if (spinBoost > 0) {
        spinBoost = Math.max(0, spinBoost - 0.025);
        beacon.scale.setScalar(1.5 + Math.sin(elapsed * 20) * 0.3);
      } else {
        beacon.scale.setScalar(1.0);
      }

      parcelsGroup.rotation.y = elapsed * 0.55;
      parcelsGroup.children.forEach((cube, idx) => {
        cube.rotation.x = elapsed * 1.2 + idx;
        cube.rotation.y = elapsed * 1.5 + idx;
      });
    }
  };
}

