# 🌌 RAVITEJA — THE AI UNIVERSE

**Futuristic 3D Animated AI & ML Developer Portfolio of Hari Kumar Raviteja Nagireddy**

- **Live Website:** [https://raviteja05-dot.github.io/](https://raviteja05-dot.github.io/)
- **Education:** B.Tech — Artificial Intelligence and Machine Learning, Aditya University, Surampalem, Andhra Pradesh, India
- **GitHub:** [https://github.com/raviteja05-dot](https://github.com/raviteja05-dot)
- **LinkedIn:** [Hari Kumar Raviteja Nagireddy](https://www.linkedin.com/in/hari-kumar-raviteja-nagireddy-540910373)

---

## 🤖 Six Unique 3D Robots & Live Project Demonstrations

| Unit | Robot Character | Project Title | Live Demonstration Features |
| :--- | :--- | :--- | :--- |
| **01** | **JARVIS** | **JARVIS — Personal AI Assistant** | Interactive chat console, Web Speech API voice input, SpeechSynthesis TTS, listening/thinking core, sample commands, session history |
| **02** | **MEDIBOT** | **AI Medicine Reminder** | Elderly-friendly schedule manager, Add medicine/dosage/time, Mark Taken / Not Now, Refill counter, `localStorage` history, alert banner |
| **03** | **NEUROBOT** | **InclusEval — SIH1777** | Adaptive assessment simulator (Foundational → Intermediate → Advanced), accessibility toolbar (font scaling, high contrast, TTS), score report |
| **04** | **SHOPBOT** | **E-Commerce Management System** | Product catalog, category filters, instant search, live shopping cart, quantity controls, dynamic GST/total calculation, checkout simulation |
| **05** | **SPACEBOT** | **Space Shooter Game** | Playable HTML5 Canvas starfighter arcade game with keyboard & touch controls, enemy squadrons, laser combat, particle explosions, score & lives |
| **06** | **DATABOT** | **Food Delivery Data Analysis** | Interactive Chart.js analytics dashboard with sample food delivery dataset, cuisine category & date filters, total orders, AOV, and SLA metrics |

---

## 🛠️ Tech Stack & Project Structure

- **Frontend & 3D:** HTML5, CSS3, ES6+ JavaScript, **Three.js**, **GSAP**, **Chart.js**, **Vite**
- **Deployment:** GitHub Actions (`.github/workflows/deploy.yml`) + GitHub Pages (`https://raviteja05-dot.github.io/`)

```text
├── index.html
├── package.json
├── vite.config.js
├── public/
│   ├── images/favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
└── src/
    ├── main.js
    ├── robots/
    │   ├── robotManager.js
    │   ├── jarvisRobot.js
    │   ├── medibot.js
    │   ├── neurobot.js
    │   ├── shopbot.js
    │   ├── spacebot.js
    │   └── databot.js
    ├── projects/
    │   ├── jarvisDemo.js
    │   ├── medicineDemo.js
    │   ├── inclusEvalDemo.js
    │   ├── ecommerceDemo.js
    │   ├── spaceShooter.js
    │   └── analyticsDemo.js
    ├── components/
    │   ├── navigation.js
    │   ├── animations.js
    │   └── projectExplorer.js
    └── styles/
        ├── main.css
        ├── robots.css
        ├── animations.css
        └── responsive.css
```

## 🚀 Local Development & Build

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build production bundle into dist/
npm run build

# Preview production build locally
npm run preview
```
