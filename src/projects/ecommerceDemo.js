/**
 * PROJECT 04: E-COMMERCE MANAGEMENT SYSTEM DEMO
 * Product catalog, category filters, instant search, add/remove cart,
 * quantity management, dynamic price/GST calculation, and checkout simulation.
 */

const SAMPLE_PRODUCTS = [
  {
    id: 'prd-101',
    sku: 'AI-JETSON-01',
    name: 'Neural Edge AI Developer Kit',
    category: 'AI Hardware',
    price: 14500,
    stock: 12,
    description: 'Compact edge AI compute module for computer vision, robotics inference, and Python ML workloads.'
  },
  {
    id: 'prd-102',
    sku: 'ROB-SERVO-06',
    name: '6-DOF Programmable Robotic Arm Kit',
    category: 'Robotics Kits',
    price: 8900,
    stock: 8,
    description: 'Precision aluminum articulated robot arm with high-torque digital servos and controller board.'
  },
  {
    id: 'prd-103',
    sku: 'DEV-MECH-84',
    name: 'CyberDeck Mechanical Coding Keyboard',
    category: 'Developer Gear',
    price: 4200,
    stock: 25,
    description: 'Hot-swappable tactile mechanical keyboard with cyan-purple programmable backlight for developers.'
  },
  {
    id: 'prd-104',
    sku: 'ROB-LIDAR-02',
    name: '360° Autonomous SLAM LiDAR Sensor',
    category: 'Robotics Kits',
    price: 6800,
    stock: 15,
    description: 'High-frequency optical distance scanner for autonomous indoor robot mapping and obstacle avoidance.'
  },
  {
    id: 'prd-105',
    sku: 'BK-AIML-09',
    name: 'Applied Machine Learning & DBMS Handbook',
    category: 'Smart Books',
    price: 1250,
    stock: 40,
    description: 'Comprehensive engineering reference covering Python ML pipelines, SQL optimization, and system design.'
  },
  {
    id: 'prd-106',
    sku: 'AI-VOICE-04',
    name: 'Far-Field Neural Microphone Array',
    category: 'AI Hardware',
    price: 3600,
    stock: 19,
    description: '4-mic beamforming acoustic array designed for voice assistants like JARVIS and smart home automation.'
  }
];

function formatINR(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

export function mountEcommerceDemo(container) {
  let searchQuery = '';
  let activeCategory = 'All';
  let cart = [
    { product: SAMPLE_PRODUCTS[0], qty: 1 },
    { product: SAMPLE_PRODUCTS[4], qty: 2 }
  ];
  let checkoutMessage = null;

  const categories = ['All', 'AI Hardware', 'Robotics Kits', 'Developer Gear', 'Smart Books'];

  function render() {
    const filteredProducts = SAMPLE_PRODUCTS.filter((p) => {
      const matchesCat = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });

    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
    const tax = Math.round(subtotal * 0.18);
    const grandTotal = subtotal + tax;
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

    container.innerHTML = `
      <div class="demo-disclaimer-banner" style="border-color: rgba(255, 190, 46, 0.4); background: rgba(255, 190, 46, 0.08);">
        <span>
          <strong>DBMS & E-COMMERCE DEMO:</strong> Interactive catalog, inventory record filtering, cart state management, and order checkout simulation using sample products.
        </span>
      </div>

      ${
        checkoutMessage
          ? `
          <div style="margin-bottom: 18px; padding: 16px 20px; border-radius: 10px; background: rgba(0, 245, 155, 0.14); border: 1px solid var(--emerald); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div style="color:#ffffff; font-size:14.5px;">${checkoutMessage}</div>
            <button type="button" class="mini-hud-btn" id="dismissOrderMsgBtn">DISMISS ✓</button>
          </div>
        `
          : ''
      }

      <div class="ecom-toolbar">
        <input
          type="text"
          id="ecomSearchInput"
          class="jarvis-input"
          style="min-width: 240px; flex: 1;"
          placeholder="Search products by name, SKU, or description..."
          value="${searchQuery}"
        />
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          ${categories
            .map(
              (cat) => `
              <button
                type="button"
                class="skill-filter-btn ${activeCategory === cat ? 'active' : ''}"
                data-cat="${cat}"
              >
                ${cat.toUpperCase()}
              </button>
            `
            )
            .join('')}
        </div>
      </div>

      <div class="ecom-layout">
        <div class="ecom-products-grid" id="ecomProductsGrid">
          ${
            filteredProducts.length === 0
              ? `<div style="grid-column: 1 / -1; padding: 32px; text-align:center; color: var(--text-muted);">No matching products found in catalog.</div>`
              : filteredProducts
                  .map(
                    (p) => `
                  <div class="ecom-product-card">
                    <div>
                      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span class="tech-chip">${p.category}</span>
                        <small style="font-family:var(--font-tech); color:var(--text-muted);">SKU: ${p.sku}</small>
                      </div>
                      <h4 style="font-family:var(--font-display); font-size:15.5px; color:var(--cyan); margin-bottom:8px;">
                        ${p.name}
                      </h4>
                      <p style="font-size:13px; color:var(--text-secondary); line-height:1.6; margin-bottom:14px;">
                        ${p.description}
                      </p>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; padding-top:12px; border-top:1px solid rgba(255,255,255,0.08);">
                      <div>
                        <strong style="font-family:var(--font-display); font-size:17px; color:#ffffff;">${formatINR(p.price)}</strong>
                        <small style="display:block; font-size:11px; color:var(--emerald);">In Stock (${p.stock} units)</small>
                      </div>
                      <button type="button" class="btn btn-primary" style="padding:9px 15px; font-size:11px;" data-add-id="${p.id}">
                        + ADD TO CART
                      </button>
                    </div>
                  </div>
                `
                  )
                  .join('')
          }
        </div>

        <aside class="ecom-cart-panel">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:12px; margin-bottom:14px; border-bottom:1px solid rgba(33,244,239,0.2);">
              <h3 style="font-family:var(--font-display); font-size:15px; color:var(--cyan);">
                🛒 ACTIVE CART (${totalItems})
              </h3>
              ${
                cart.length > 0
                  ? `<button type="button" class="mini-hud-btn" id="clearCartBtn">EMPTY</button>`
                  : ''
              }
            </div>

            <div style="display:grid; gap:10px; max-height:270px; overflow-y:auto; margin-bottom:16px;">
              ${
                cart.length === 0
                  ? `<p style="color:var(--text-muted); font-size:13.5px; text-align:center; padding:24px 0;">Your shopping cart is empty. Add items from the catalog!</p>`
                  : cart
                      .map(
                        (item) => `
                        <div style="padding:10px 12px; border-radius:8px; background:rgba(255,255,255,0.04); border:1px solid rgba(33,244,239,0.16);">
                          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                            <strong style="font-size:13px; color:#ffffff;">${item.product.name}</strong>
                            <button type="button" style="background:none; border:none; color:#ff6b93; cursor:pointer; font-size:12px;" data-remove-id="${item.product.id}">✕</button>
                          </div>
                          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                            <div style="display:flex; align-items:center; gap:8px;">
                              <button type="button" class="mini-hud-btn" data-dec-id="${item.product.id}">−</button>
                              <span style="font-weight:700; font-size:13.5px;">${item.qty}</span>
                              <button type="button" class="mini-hud-btn" data-inc-id="${item.product.id}">+</button>
                            </div>
                            <span style="font-family:var(--font-display); font-size:13px; color:var(--cyan);">
                              ${formatINR(item.product.price * item.qty)}
                            </span>
                          </div>
                        </div>
                      `
                      )
                      .join('')
              }
            </div>
          </div>

          <div style="border-top:1px solid rgba(33,244,239,0.2); padding-top:14px;">
            <div style="display:flex; justify-content:space-between; font-size:13px; color:var(--text-secondary); margin-bottom:6px;">
              <span>Subtotal</span>
              <span>${formatINR(subtotal)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:13px; color:var(--text-secondary); margin-bottom:10px;">
              <span>Estimated GST (18%)</span>
              <span>${formatINR(tax)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-family:var(--font-display); font-size:16px; color:var(--cyan); margin-bottom:16px;">
              <span>TOTAL</span>
              <span>${formatINR(grandTotal)}</span>
            </div>
            <button
              type="button"
              class="btn btn-primary"
              id="checkoutOrderBtn"
              style="width:100%;"
              ${cart.length === 0 ? 'disabled style="width:100%; opacity:0.5; cursor:not-allowed;"' : ''}
            >
              COMPLETE CHECKOUT ↗
            </button>
          </div>
        </aside>
      </div>
    `;

    const searchEl = container.querySelector('#ecomSearchInput');
    searchEl.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      const pos = e.target.selectionStart;
      render();
      const newSearchEl = container.querySelector('#ecomSearchInput');
      if (newSearchEl) {
        newSearchEl.focus();
        newSearchEl.setSelectionRange(pos, pos);
      }
    });

    container.querySelectorAll('button[data-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeCategory = btn.getAttribute('data-cat');
        render();
      });
    });

    container.querySelectorAll('button[data-add-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pid = btn.getAttribute('data-add-id');
        const product = SAMPLE_PRODUCTS.find((p) => p.id === pid);
        if (!product) return;
        const existing = cart.find((c) => c.product.id === pid);
        if (existing) {
          existing.qty += 1;
        } else {
          cart.push({ product, qty: 1 });
        }
        render();
      });
    });

    container.querySelectorAll('button[data-inc-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pid = btn.getAttribute('data-inc-id');
        const item = cart.find((c) => c.product.id === pid);
        if (item) item.qty += 1;
        render();
      });
    });

    container.querySelectorAll('button[data-dec-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pid = btn.getAttribute('data-dec-id');
        const item = cart.find((c) => c.product.id === pid);
        if (item) {
          item.qty -= 1;
          if (item.qty <= 0) {
            cart = cart.filter((c) => c.product.id !== pid);
          }
        }
        render();
      });
    });

    container.querySelectorAll('button[data-remove-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pid = btn.getAttribute('data-remove-id');
        cart = cart.filter((c) => c.product.id !== pid);
        render();
      });
    });

    const clearBtn = container.querySelector('#clearCartBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        cart = [];
        render();
      });
    }

    const checkoutBtn = container.querySelector('#checkoutOrderBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        checkoutMessage = `✅ Order <strong>${orderId}</strong> simulated successfully! Processed ${totalItems} item(s) for a total of <strong>${formatINR(grandTotal)}</strong>.`;
        cart = [];
        render();
      });
    }

    const dismissBtn = container.querySelector('#dismissOrderMsgBtn');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        checkoutMessage = null;
        render();
      });
    }
  }

  render();
}

