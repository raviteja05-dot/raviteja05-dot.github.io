/**
 * PROJECT 01: JARVIS — PERSONAL AI ASSISTANT DEMO
 * Interactive chat, realistic character/word typing animation, Web Speech API recognition,
 * SpeechSynthesis TTS, animated listening/thinking indicators, sample commands, session history.
 */

const SESSION_KEY = 'raviteja_jarvis_history_v1';

const SAMPLE_COMMANDS = [
  'Introduce yourself.',
  'Tell me about Raviteja.',
  'Show his projects.',
  'Explain Artificial Intelligence.',
  'What can you do?',
  'Show available commands.'
];

function generateJarvisResponse(rawInput) {
  const text = rawInput.trim().toLowerCase();

  if (text.includes('introduce') || text.includes('who are you') || text === 'hi' || text === 'hello') {
    return `Greetings! I am **JARVIS** (Just A Rather Very Intelligent System — Portfolio Edition), an interactive personal AI assistant prototype created by **Hari Kumar Raviteja Nagireddy**. I run directly in your browser using deterministic intent analysis, Web Speech Recognition, and Speech Synthesis to guide you through Raviteja's AI Universe.`;
  }

  if (text.includes('raviteja') || text.includes('about him') || text.includes('developer') || text.includes('education') || text.includes('university')) {
    return `**Hari Kumar Raviteja Nagireddy** is an undergraduate student pursuing **B.Tech in Artificial Intelligence and Machine Learning** at **Aditya University, Surampalem, Andhra Pradesh, India**. His core interests include Artificial Intelligence, Machine Learning, Python Development, Software Engineering, Automation, Data Analytics, and Intelligent Applications.`;
  }

  if (text.includes('project') || text.includes('built') || text.includes('portfolio')) {
    return `Raviteja's AI Universe features **6 interactive project demonstrations** represented by unique robots:\n1. **JARVIS** — Personal AI Assistant (Voice & Chat)\n2. **MEDIBOT** — AI Medicine Reminder (Elderly-friendly healthcare scheduler)\n3. **NEUROBOT** — InclusEval SIH1777 (Adaptive & accessible skill assessment)\n4. **SHOPBOT** — E-Commerce Management System (Catalog, search & cart engine)\n5. **SPACEBOT** — Space Shooter Game (Playable HTML5 Canvas arcade game)\n6. **DATABOT** — Food Delivery Data Analysis (Interactive Chart.js dashboard)`;
  }

  if (text.includes('explain artificial intelligence') || text.includes('what is ai') || text.includes('machine learning') || text.includes('artificial intelligence')) {
    return `**Artificial Intelligence (AI)** is the branch of computer science dedicated to building systems capable of performing tasks that typically require human intelligence — such as perception, reasoning, natural language understanding, and decision-making. **Machine Learning (ML)** is a subset of AI where algorithms learn patterns directly from data rather than following only static hard-coded rules.`;
  }

  if (text.includes('what can you do') || text.includes('capabilities') || text.includes('features')) {
    return `In this live demonstration, I can:\n• Answer questions about **Hari Kumar Raviteja Nagireddy**, his AIML education, skills, and projects.\n• Accept **Voice Commands** via your browser microphone (when supported).\n• Speak responses aloud using **Text-to-Speech (TTS)** synthesis.\n• Explain core AI, ML, Python, and software engineering concepts.\n• Maintain your conversation history throughout this browser session.`;
  }

  if (text.includes('available commands') || text.includes('help') || text.includes('command')) {
    return `Here are the primary sample commands you can click or speak:\n• *"Introduce yourself."*\n• *"Tell me about Raviteja."*\n• *"Show his projects."*\n• *"Explain Artificial Intelligence."*\n• *"What can you do?"*\n• *"Tell me about his skills or contact details."*`;
  }

  if (text.includes('skill') || text.includes('tech') || text.includes('python')) {
    return `Raviteja works across **Programming** (Python, C, C++, JavaScript), **AI & ML** (Artificial Intelligence, Machine Learning), **Databases** (SQL, SQLite, DBMS), **Web Development** (HTML, CSS, JavaScript, Flask), and **Tools** (Git, GitHub, VS Code).`;
  }

  if (text.includes('contact') || text.includes('email') || text.includes('github') || text.includes('linkedin')) {
    return `You can connect with Raviteja via:\n• **Email:** tejanagireddy05@gmail.com\n• **GitHub:** github.com/raviteja05-dot\n• **LinkedIn:** linkedin.com/in/hari-kumar-raviteja-nagireddy-540910373/\n• **Instagram:** @__r_i_s_k_e_r_a_v_i__`;
  }

  return `I processed your query: *"${rawInput}"*. As an honest client-side portfolio demonstration (without an external cloud LLM backend), I specialize in Raviteja's profile, his 6 AI & engineering projects, and AI fundamentals. Try asking *"Tell me about Raviteja"* or *"Show his projects"*!`;
}

function formatMessageHTML(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--cyan);">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

export function mountJarvisDemo(container) {
  let history = [];
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) history = JSON.parse(saved);
  } catch {
    history = [];
  }

  if (history.length === 0) {
    history.push({
      sender: 'JARVIS',
      role: 'bot',
      text: 'System online. Welcome to the **JARVIS Personal AI Assistant** interactive demonstration. Select a sample command on the left, type a message below, or click the microphone button to speak!'
    });
  }

  let ttsEnabled = true;
  let recognition = null;
  let isListening = false;
  let typingInterval = null;

  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  const speechSupported = Boolean(SpeechRecognitionAPI);

  container.innerHTML = `
    <div class="demo-disclaimer-banner">
      <span><strong>SIMULATION NOTICE:</strong> Interactive client-side JARVIS demonstration using browser speech APIs &amp; local intent engine (honest fallback — no external paid AI API required).</span>
      <div style="display:flex; gap:8px;">
        <button type="button" class="mini-hud-btn" id="jarvisTtsToggle">🔊 VOICE: ON</button>
        <button type="button" class="mini-hud-btn" id="jarvisClearBtn">CLEAR SESSION</button>
      </div>
    </div>

    <div class="jarvis-workspace">
      <aside class="jarvis-sidebar">
        <div class="jarvis-orb-wrap">
          <div class="jarvis-core-orb" id="jarvisOrb">
            <span style="font-family: var(--font-display); font-size: 10px; color: #04060f; font-weight: 800;">J.A.R.V.I.S</span>
          </div>
          <div class="jarvis-state-indicators" id="jarvisWave">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
          <small id="jarvisStateLabel" style="font-family: var(--font-display); font-size: 11px; color: var(--cyan); margin-top: 6px; letter-spacing: 1.5px;">
            STATUS: STANDBY
          </small>
        </div>

        <div>
          <div class="inspector-subheading" style="margin-bottom: 8px;">SAMPLE COMMANDS</div>
          <div class="jarvis-cmd-list" id="jarvisCmdList">
            ${SAMPLE_COMMANDS.map(
              (cmd) => `<button type="button" class="jarvis-cmd-chip" data-cmd="${cmd}">▸ ${cmd}</button>`
            ).join('')}
          </div>
        </div>
      </aside>

      <div class="jarvis-chat-main">
        <div class="jarvis-messages" id="jarvisMessages" aria-live="polite"></div>
        <form class="jarvis-input-bar" id="jarvisForm">
          <input
            type="text"
            class="jarvis-input"
            id="jarvisInput"
            placeholder="Ask JARVIS a question or select a command..."
            autocomplete="off"
            aria-label="Message JARVIS"
          />
          <button
            type="button"
            class="btn btn-outline"
            id="jarvisMicBtn"
            title="${speechSupported ? 'Voice Input (Browser Speech Recognition)' : 'Speech Recognition not supported in this browser'}"
            style="padding: 10px 15px;"
          >
            🎤 ${speechSupported ? 'VOICE' : 'NO MIC'}
          </button>
          <button type="submit" class="btn btn-primary" style="padding: 10px 20px;">
            SEND ↗
          </button>
        </form>
      </div>
    </div>
  `;

  const messagesEl = container.querySelector('#jarvisMessages');
  const formEl = container.querySelector('#jarvisForm');
  const inputEl = container.querySelector('#jarvisInput');
  const orbEl = container.querySelector('#jarvisOrb');
  const waveEl = container.querySelector('#jarvisWave');
  const stateLabelEl = container.querySelector('#jarvisStateLabel');
  const ttsToggleBtn = container.querySelector('#jarvisTtsToggle');
  const clearBtn = container.querySelector('#jarvisClearBtn');
  const micBtn = container.querySelector('#jarvisMicBtn');

  function saveHistory() {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(history));
    } catch {
      // ignore storage quota errors
    }
  }

  function setVisualState(mode, label) {
    orbEl.classList.remove('listening', 'thinking');
    waveEl.classList.remove('active');
    if (mode === 'listening') {
      orbEl.classList.add('listening');
      waveEl.classList.add('active');
    } else if (mode === 'thinking' || mode === 'speaking') {
      orbEl.classList.add('thinking');
      waveEl.classList.add('active');
    }
    stateLabelEl.textContent = label;
  }

  function speakResponse(rawText) {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = rawText.replace(/\*\*/g, '').replace(/\*/g, '').replace(/•/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.04;
      utterance.pitch = 0.96;
      utterance.onstart = () => setVisualState('speaking', 'STATUS: SPEAKING RESPONSE');
      utterance.onend = () => setVisualState('idle', 'STATUS: STANDBY');
      utterance.onerror = () => setVisualState('idle', 'STATUS: STANDBY');
      window.speechSynthesis.speak(utterance);
    } catch {
      setVisualState('idle', 'STATUS: STANDBY');
    }
  }

  function renderMessages() {
    messagesEl.innerHTML = history
      .map(
        (m) => `
        <div class="chat-msg ${m.role}">
          <span class="chat-msg-sender">${m.sender}</span>
          <div>${formatMessageHTML(m.text)}</div>
        </div>
      `
      )
      .join('');
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function streamBotReply(fullText) {
    if (typingInterval) clearInterval(typingInterval);

    const msgWrap = document.createElement('div');
    msgWrap.className = 'chat-msg bot';
    msgWrap.innerHTML = `
      <span class="chat-msg-sender">JARVIS // AI CORE</span>
      <div class="streaming-text"></div>
    `;
    messagesEl.appendChild(msgWrap);
    const contentDiv = msgWrap.querySelector('.streaming-text');

    const words = fullText.split(' ');
    let idx = 0;
    setVisualState('speaking', 'STATUS: TYPING RESPONSE...');

    typingInterval = setInterval(() => {
      idx += 2;
      const slice = words.slice(0, idx).join(' ');
      contentDiv.innerHTML = formatMessageHTML(slice) + (idx < words.length ? ' <span style="color:var(--cyan);">▋</span>' : '');
      messagesEl.scrollTop = messagesEl.scrollHeight;

      if (idx >= words.length) {
        clearInterval(typingInterval);
        typingInterval = null;
        history.push({ sender: 'JARVIS // AI CORE', role: 'bot', text: fullText });
        saveHistory();
        renderMessages();
        setVisualState('idle', 'STATUS: STANDBY');
        speakResponse(fullText);
      }
    }, 32);
  }

  function handleUserCommand(commandText) {
    const trimmed = commandText.trim();
    if (!trimmed) return;

    if (typingInterval) {
      clearInterval(typingInterval);
      typingInterval = null;
    }

    history.push({ sender: 'VISITOR', role: 'user', text: trimmed });
    saveHistory();
    renderMessages();
    inputEl.value = '';

    setVisualState('thinking', 'STATUS: ANALYZING QUERY...');

    setTimeout(() => {
      const reply = generateJarvisResponse(trimmed);
      streamBotReply(reply);
    }, 340);
  }

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    handleUserCommand(inputEl.value);
  });

  container.querySelectorAll('.jarvis-cmd-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      handleUserCommand(btn.getAttribute('data-cmd'));
    });
  });

  ttsToggleBtn.addEventListener('click', () => {
    ttsEnabled = !ttsEnabled;
    ttsToggleBtn.textContent = ttsEnabled ? '🔊 VOICE: ON' : '🔇 VOICE: MUTED';
    if (!ttsEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setVisualState('idle', 'STATUS: STANDBY');
    }
  });

  clearBtn.addEventListener('click', () => {
    if (typingInterval) clearInterval(typingInterval);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    history = [
      {
        sender: 'JARVIS',
        role: 'bot',
        text: 'Conversation memory cleared. Ready for new commands!'
      }
    ];
    saveHistory();
    renderMessages();
    setVisualState('idle', 'STATUS: STANDBY');
  });

  if (speechSupported) {
    recognition = new SpeechRecognitionAPI();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isListening = true;
      micBtn.textContent = '⏹ LISTENING...';
      setVisualState('listening', 'STATUS: LISTENING TO MIC...');
    };

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      if (transcript) {
        inputEl.value = transcript;
        handleUserCommand(transcript);
      }
    };

    recognition.onerror = () => {
      isListening = false;
      micBtn.textContent = '🎤 VOICE';
      setVisualState('idle', 'STATUS: MIC READY');
    };

    recognition.onend = () => {
      isListening = false;
      micBtn.textContent = '🎤 VOICE';
      if (stateLabelEl.textContent.includes('LISTENING')) {
        setVisualState('idle', 'STATUS: STANDBY');
      }
    };

    micBtn.addEventListener('click', () => {
      if (isListening) {
        recognition.stop();
      } else {
        try {
          recognition.start();
        } catch {
          // already started
        }
      }
    });
  } else {
    micBtn.addEventListener('click', () => {
      history.push({
        sender: 'SYSTEM',
        role: 'bot',
        text: 'Your current browser does not expose the Web Speech Recognition API. Please type a message or click any sample command chip on the left!'
      });
      renderMessages();
    });
  }

  renderMessages();

  return function cleanup() {
    if (typingInterval) clearInterval(typingInterval);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (recognition && isListening) {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
    }
  };
}
