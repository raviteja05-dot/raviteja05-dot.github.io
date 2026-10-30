/**
 * PROJECT 02: AI MEDICINE REMINDER DEMO
 * Elderly-friendly healthcare schedule & reminder demo with LocalStorage persistence,
 * Taken / Not Now tracking, Refill status counter, History log, and in-app Alert banner.
 */

const STORAGE_KEY = 'raviteja_medibot_demo_v1';

const DEFAULT_DATA = {
  medicines: [
    {
      id: 'med-1',
      name: 'Vitamin D3 Supplement',
      dosage: '1000 IU (1 Tablet)',
      time: '08:30',
      schedule: 'Daily — After Breakfast',
      status: 'Pending',
      pillsLeft: 14
    },
    {
      id: 'med-2',
      name: 'Amlodipine (BP Care)',
      dosage: '5 mg (1 Tablet)',
      time: '13:00',
      schedule: 'Daily — Afternoon',
      status: 'Taken',
      pillsLeft: 4
    },
    {
      id: 'med-3',
      name: 'Metformin XR',
      dosage: '500 mg (1 Tablet)',
      time: '20:00',
      schedule: 'Daily — After Dinner',
      status: 'Pending',
      pillsLeft: 22
    }
  ],
  history: [
    {
      id: 'h-1',
      medicine: 'Amlodipine (BP Care) — 5 mg',
      action: 'Marked as Taken',
      timestamp: 'Today, 01:02 PM'
    }
  ]
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.medicines) && Array.isArray(parsed.history)) {
        return parsed;
      }
    }
  } catch {
    // fallback to default
  }
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

export function mountMedicineDemo(container) {
  let state = loadState();

  container.innerHTML = `
    <div class="demo-disclaimer-banner" style="border-color: rgba(0, 245, 155, 0.4); background: rgba(0, 245, 155, 0.08);">
      <span style="font-size: 14px; color: #eafff6;">
        <strong>HEALTHCARE DEMO NOTICE:</strong> This is an interactive portfolio demonstration with browser LocalStorage — not a real medical service or clinical prescription tool.
      </span>
      <div style="display:flex; gap:8px;">
        <button type="button" class="mini-hud-btn" id="medTriggerAlertBtn">🔔 SIMULATE REMINDER ALERT</button>
        <button type="button" class="mini-hud-btn" id="medResetBtn">RESET SAMPLE DATA</button>
      </div>
    </div>

    <div id="medAlertBanner" style="display:none; margin-bottom: 18px; padding: 16px 20px; border-radius: 12px; background: linear-gradient(90deg, rgba(0,245,155,0.22), rgba(33,244,239,0.22)); border: 2px solid var(--emerald); align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
      <div style="font-size: 17px; font-weight: 700; color: #ffffff;" id="medAlertText">
        ⏰ Reminder: Time to take your scheduled medicine!
      </div>
      <button type="button" class="med-btn-large med-btn-taken" id="medDismissAlertBtn">OK, GOT IT ✓</button>
    </div>

    <div class="med-demo-grid">
      <div class="med-card">
        <h3>+ ADD NEW MEDICINE</h3>
        <form id="addMedForm">
          <div class="med-form-group">
            <label for="medName">Medicine Name</label>
            <input type="text" id="medName" class="med-input" placeholder="e.g., Calcium Plus" required />
          </div>
          <div class="med-form-group">
            <label for="medDosage">Dosage Instruction</label>
            <input type="text" id="medDosage" class="med-input" placeholder="e.g., 500 mg (1 Tablet)" required />
          </div>
          <div class="med-form-group">
            <label for="medTime">Reminder Time</label>
            <input type="time" id="medTime" class="med-input" value="09:00" required />
          </div>
          <div class="med-form-group">
            <label for="medSchedule">Medicine Schedule</label>
            <select id="medSchedule" class="med-input">
              <option value="Daily — Morning">Daily — Morning</option>
              <option value="Daily — Afternoon">Daily — Afternoon</option>
              <option value="Daily — Night">Daily — Night</option>
              <option value="Before Meals">Before Meals</option>
              <option value="Weekly Supplement">Weekly Supplement</option>
            </select>
          </div>
          <button type="submit" class="med-btn-large med-btn-taken" style="width: 100%; margin-top: 6px; font-size: 16px;">
            + SAVE TO SCHEDULE
          </button>
        </form>
      </div>

      <div style="display:flex; flex-direction:column; gap:18px;">
        <div class="med-card">
          <h3>TODAY'S MEDICINE SCHEDULE (ELDERLY-FRIENDLY VIEW)</h3>
          <div class="med-schedule-list" id="medScheduleList"></div>
        </div>

        <div class="med-card">
          <h3>RECENT MEDICINE HISTORY LOG</h3>
          <div id="medHistoryList" style="display:grid; gap:8px;"></div>
        </div>
      </div>
    </div>
  `;

  const scheduleListEl = container.querySelector('#medScheduleList');
  const historyListEl = container.querySelector('#medHistoryList');
  const formEl = container.querySelector('#addMedForm');
  const alertBannerEl = container.querySelector('#medAlertBanner');
  const alertTextEl = container.querySelector('#medAlertText');

  function showReminderBanner(message) {
    alertTextEl.textContent = message;
    alertBannerEl.style.display = 'flex';
  }

  function render() {
    scheduleListEl.innerHTML = state.medicines
      .map((med) => {
        const lowRefill = med.pillsLeft <= 5;
        const statusColor =
          med.status === 'Taken'
            ? 'var(--emerald)'
            : med.status === 'Not Now'
            ? 'var(--amber)'
            : 'var(--cyan)';
        return `
          <div class="med-item-card">
            <div class="med-item-info">
              <h4>💊 ${med.name} <span style="font-size:15px; color:${statusColor};">[${med.status.toUpperCase()}]</span></h4>
              <div class="med-item-meta">
                <strong>Dosage:</strong> ${med.dosage} &nbsp;|&nbsp;
                <strong>Time:</strong> ${med.time} &nbsp;|&nbsp;
                <strong>Schedule:</strong> ${med.schedule}
              </div>
              <div style="margin-top: 6px; font-size: 14px; color: ${lowRefill ? '#ff6b93' : '#a8ffd8'};">
                <strong>Refill Status:</strong> ${med.pillsLeft} doses remaining
                ${lowRefill ? '⚠️ (Low supply — Refill recommended!)' : '✓ (Supply OK)'}
              </div>
            </div>
            <div class="med-large-actions">
              <button type="button" class="med-btn-large med-btn-taken" data-action="taken" data-id="${med.id}">
                ✓ MARK TAKEN
              </button>
              <button type="button" class="med-btn-large med-btn-later" data-action="later" data-id="${med.id}">
                ⏳ NOT NOW
              </button>
              <button type="button" class="med-btn-large med-btn-refill" data-action="refill" data-id="${med.id}">
                + REFILL (+15)
              </button>
            </div>
          </div>
        `;
      })
      .join('');

    if (state.history.length === 0) {
      historyListEl.innerHTML = `<p style="color: var(--text-muted); font-size: 15px;">No actions logged yet.</p>`;
    } else {
      historyListEl.innerHTML = state.history
        .slice(0, 6)
        .map(
          (item) => `
          <div style="display:flex; justify-content:space-between; padding:10px 14px; border-radius:8px; background:rgba(255,255,255,0.04); font-size:14.5px;">
            <span><strong>${item.medicine}</strong> — ${item.action}</span>
            <span style="color: var(--cyan);">${item.timestamp}</span>
          </div>
        `
        )
        .join('');
    }
  }

  scheduleListEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const action = btn.getAttribute('data-action');
    const med = state.medicines.find((m) => m.id === id);
    if (!med) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (action === 'taken') {
      med.status = 'Taken';
      med.pillsLeft = Math.max(0, med.pillsLeft - 1);
      state.history.unshift({
        id: 'h-' + Date.now(),
        medicine: `${med.name} (${med.dosage})`,
        action: 'Marked as Taken ✓',
        timestamp: `Today, ${timeStr}`
      });
    } else if (action === 'later') {
      med.status = 'Not Now';
      state.history.unshift({
        id: 'h-' + Date.now(),
        medicine: `${med.name} (${med.dosage})`,
        action: 'Snoozed (Not Now ⏳)',
        timestamp: `Today, ${timeStr}`
      });
      showReminderBanner(`⏳ Snoozed: We will remind you again about ${med.name} (${med.dosage}) shortly.`);
    } else if (action === 'refill') {
      med.pillsLeft += 15;
      state.history.unshift({
        id: 'h-' + Date.now(),
        medicine: `${med.name}`,
        action: 'Refilled +15 Doses 📦',
        timestamp: `Today, ${timeStr}`
      });
    }

    saveState(state);
    render();
  });

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = container.querySelector('#medName').value.trim();
    const dosage = container.querySelector('#medDosage').value.trim();
    const time = container.querySelector('#medTime').value;
    const schedule = container.querySelector('#medSchedule').value;
    if (!name || !dosage) return;

    state.medicines.unshift({
      id: 'med-' + Date.now(),
      name,
      dosage,
      time,
      schedule,
      status: 'Pending',
      pillsLeft: 20
    });

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    state.history.unshift({
      id: 'h-' + Date.now(),
      medicine: `${name} (${dosage})`,
      action: `Added to schedule for ${time}`,
      timestamp: `Today, ${timeStr}`
    });

    saveState(state);
    formEl.reset();
    container.querySelector('#medTime').value = '09:00';
    render();
    showReminderBanner(`✅ Added "${name}" (${dosage}) scheduled at ${time}!`);
  });

  container.querySelector('#medTriggerAlertBtn').addEventListener('click', () => {
    const pendingMed = state.medicines.find((m) => m.status !== 'Taken') || state.medicines[0];
    if (pendingMed) {
      showReminderBanner(
        `🔔 MEDIBOT ALERT: It is time to take ${pendingMed.name} — ${pendingMed.dosage} (${pendingMed.schedule})!`
      );
    }
  });

  container.querySelector('#medDismissAlertBtn').addEventListener('click', () => {
    alertBannerEl.style.display = 'none';
  });

  container.querySelector('#medResetBtn').addEventListener('click', () => {
    state = JSON.parse(JSON.stringify(DEFAULT_DATA));
    saveState(state);
    render();
  });

  render();
}

