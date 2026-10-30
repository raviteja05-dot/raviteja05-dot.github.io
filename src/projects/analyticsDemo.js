/**
 * PROJECT 06: FOOD DELIVERY DATA ANALYSIS DEMO
 * Interactive Chart.js analytics dashboard with sample food delivery dataset,
 * category & date window filters, total orders, average order value (AOV),
 * delivery time analysis, and revenue trends.
 */

import Chart from 'chart.js/auto';

const SAMPLE_DELIVERY_DATASET = {
  '7d': {
    label: 'Last 7 Days (Sample Dataset)',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    categories: {
      All: {
        orders: [142, 158, 165, 179, 230, 285, 264],
        revenue: [48280, 53720, 56100, 61755, 81650, 102600, 93720],
        avgTimeMins: 27.4,
        onTimeRate: '94.8%',
        timeBuckets: [18, 46, 26, 10] // <20m, 20-30m, 30-40m, >40m (%)
      },
      'Biryani & Indian': {
        orders: [58, 64, 68, 74, 96, 122, 115],
        revenue: [20880, 23040, 24480, 26640, 35520, 46360, 42550],
        avgTimeMins: 29.1,
        onTimeRate: '93.5%',
        timeBuckets: [14, 44, 30, 12]
      },
      'Pizza & Italian': {
        orders: [36, 40, 42, 46, 62, 78, 70],
        revenue: [14040, 15600, 16380, 17940, 24800, 31200, 28000],
        avgTimeMins: 26.2,
        onTimeRate: '95.6%',
        timeBuckets: [22, 48, 22, 8]
      },
      'Healthy Bowls': {
        orders: [28, 32, 31, 34, 40, 45, 42],
        revenue: [8400, 9600, 9300, 10200, 12000, 13500, 12600],
        avgTimeMins: 23.8,
        onTimeRate: '97.1%',
        timeBuckets: [29, 51, 15, 5]
      },
      'Desserts & Drinks': {
        orders: [20, 22, 24, 25, 32, 40, 37],
        revenue: [4960, 5480, 5940, 6975, 9330, 11540, 10570],
        avgTimeMins: 21.5,
        onTimeRate: '98.0%',
        timeBuckets: [38, 47, 11, 4]
      }
    }
  },
  '30d': {
    label: 'Last 30 Days (Sample Dataset)',
    days: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    categories: {
      All: {
        orders: [1320, 1445, 1510, 1680],
        revenue: [455400, 505750, 536050, 604800],
        avgTimeMins: 28.1,
        onTimeRate: '94.2%',
        timeBuckets: [17, 45, 27, 11]
      },
      'Biryani & Indian': {
        orders: [540, 595, 620, 690],
        revenue: [194400, 214200, 229400, 258750],
        avgTimeMins: 29.8,
        onTimeRate: '92.9%',
        timeBuckets: [13, 43, 31, 13]
      },
      'Pizza & Italian': {
        orders: [340, 370, 390, 440],
        revenue: [132600, 148000, 156000, 178200],
        avgTimeMins: 26.8,
        onTimeRate: '95.1%',
        timeBuckets: [20, 49, 23, 8]
      },
      'Healthy Bowls': {
        orders: [250, 270, 280, 305],
        revenue: [77500, 83700, 86800, 94550],
        avgTimeMins: 24.4,
        onTimeRate: '96.8%',
        timeBuckets: [27, 52, 16, 5]
      },
      'Desserts & Drinks': {
        orders: [190, 210, 220, 245],
        revenue: [50900, 59850, 63850, 73300],
        avgTimeMins: 22.0,
        onTimeRate: '97.7%',
        timeBuckets: [35, 48, 13, 4]
      }
    }
  }
};

export function mountAnalyticsDemo(container) {
  let period = '7d';
  let category = 'All';
  let revenueChart = null;
  let deliveryTimeChart = null;

  const categories = ['All', 'Biryani & Indian', 'Pizza & Italian', 'Healthy Bowls', 'Desserts & Drinks'];

  container.innerHTML = `
    <div class="demo-disclaimer-banner" style="border-color: rgba(41, 121, 255, 0.45); background: rgba(41, 121, 255, 0.1);">
      <span>
        <strong>SAMPLE DATA ANALYTICS NOTICE:</strong> All metrics, orders, delivery times, and revenue charts displayed below represent curated <strong>sample food delivery data</strong> for portfolio demonstration.
      </span>
      <div style="display:flex; gap:8px;">
        <button type="button" class="mini-hud-btn" id="period7dBtn">7 DAYS</button>
        <button type="button" class="mini-hud-btn" id="period30dBtn">30 DAYS</button>
      </div>
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:18px;">
      <div style="display:flex; gap:8px; flex-wrap:wrap;" id="analyticsCatButtons">
        ${categories
          .map(
            (cat) => `
            <button type="button" class="skill-filter-btn ${cat === category ? 'active' : ''}" data-cat="${cat}">
              ${cat.toUpperCase()}
            </button>
          `
          )
          .join('')}
      </div>
      <span id="analyticsDatasetLabel" style="font-family:var(--font-display); font-size:11px; color:var(--cyan);"></span>
    </div>

    <div class="analytics-kpi-grid">
      <div class="analytics-kpi-card">
        <small>TOTAL ORDERS (SAMPLE)</small>
        <strong id="kpiTotalOrders">0</strong>
      </div>
      <div class="analytics-kpi-card">
        <small>AVERAGE ORDER VALUE (AOV)</small>
        <strong id="kpiAvgOrderVal">₹0</strong>
      </div>
      <div class="analytics-kpi-card">
        <small>AVG DELIVERY TIME</small>
        <strong id="kpiAvgDeliveryTime">0 mins</strong>
      </div>
      <div class="analytics-kpi-card">
        <small>ON-TIME DELIVERY SLA</small>
        <strong id="kpiOnTimeRate" style="color: var(--emerald);">0%</strong>
      </div>
    </div>

    <div class="analytics-charts-grid">
      <div class="chart-panel">
        <div class="inspector-subheading" style="margin-bottom: 12px;">REVENUE (₹) & ORDER VOLUME TREND</div>
        <canvas id="revenueTrendCanvas" height="210"></canvas>
      </div>
      <div class="chart-panel">
        <div class="inspector-subheading" style="margin-bottom: 12px;">DELIVERY TIME DISTRIBUTION (% OF ORDERS)</div>
        <canvas id="deliveryTimeCanvas" height="210"></canvas>
      </div>
    </div>
  `;

  const revCanvas = container.querySelector('#revenueTrendCanvas');
  const timeCanvas = container.querySelector('#deliveryTimeCanvas');

  function updateDashboard() {
    const periodObj = SAMPLE_DELIVERY_DATASET[period];
    const data = periodObj.categories[category];

    const totalOrders = data.orders.reduce((a, b) => a + b, 0);
    const totalRevenue = data.revenue.reduce((a, b) => a + b, 0);
    const aov = Math.round(totalRevenue / Math.max(1, totalOrders));

    container.querySelector('#analyticsDatasetLabel').textContent = `${periodObj.label} · ${category}`;
    container.querySelector('#kpiTotalOrders').textContent = totalOrders.toLocaleString('en-IN');
    container.querySelector('#kpiAvgOrderVal').textContent = `₹${aov.toLocaleString('en-IN')}`;
    container.querySelector('#kpiAvgDeliveryTime').textContent = `${data.avgTimeMins} mins`;
    container.querySelector('#kpiOnTimeRate').textContent = data.onTimeRate;

    if (revenueChart) revenueChart.destroy();
    if (deliveryTimeChart) deliveryTimeChart.destroy();

    revenueChart = new Chart(revCanvas, {
      type: 'bar',
      data: {
        labels: periodObj.days,
        datasets: [
          {
            type: 'line',
            label: 'Orders Count',
            data: data.orders,
            borderColor: '#ff36c7',
            backgroundColor: '#ff36c7',
            yAxisID: 'y1',
            tension: 0.35
          },
          {
            type: 'bar',
            label: 'Revenue (₹)',
            data: data.revenue,
            backgroundColor: 'rgba(33, 244, 239, 0.55)',
            borderColor: '#21f4ef',
            borderWidth: 1,
            borderRadius: 6,
            yAxisID: 'y'
          }
        ]
      },
      options: {
        responsive: true,
        color: '#b3c0e0',
        scales: {
          x: { ticks: { color: '#b3c0e0' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: {
            position: 'left',
            ticks: { color: '#21f4ef' },
            grid: { color: 'rgba(255,255,255,0.06)' }
          },
          y1: {
            position: 'right',
            ticks: { color: '#ff36c7' },
            grid: { drawOnChartArea: false }
          }
        },
        plugins: {
          legend: { labels: { color: '#f2f7ff' } }
        }
      }
    });

    deliveryTimeChart = new Chart(timeCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Fast (< 20 mins)', 'Optimal (20–30 mins)', 'Moderate (30–40 mins)', 'Delayed (> 40 mins)'],
        datasets: [
          {
            data: data.timeBuckets,
            backgroundColor: ['#00f59b', '#21f4ef', '#c43cff', '#ff3b6b'],
            borderColor: '#080d21',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#f2f7ff', padding: 14 }
          }
        }
      }
    });
  }

  container.querySelectorAll('#analyticsCatButtons button').forEach((btn) => {
    btn.addEventListener('click', () => {
      category = btn.getAttribute('data-cat');
      container.querySelectorAll('#analyticsCatButtons button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      updateDashboard();
    });
  });

  container.querySelector('#period7dBtn').addEventListener('click', () => {
    period = '7d';
    updateDashboard();
  });

  container.querySelector('#period30dBtn').addEventListener('click', () => {
    period = '30d';
    updateDashboard();
  });

  updateDashboard();

  return function cleanup() {
    if (revenueChart) revenueChart.destroy();
    if (deliveryTimeChart) deliveryTimeChart.destroy();
  };
}

