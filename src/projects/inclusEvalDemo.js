/**
 * PROJECT 03: INCLUSEVAL — SIH1777 ADAPTIVE ASSESSMENT DEMO
 * Candidate intro, adaptive difficulty progression (Level 1 -> Level 2 -> Level 3),
 * accessibility controls (font scaling, high contrast, screen reader TTS),
 * progress tracking, and comprehensive competency result summary.
 */

const QUESTION_BANK = {
  1: [
    {
      id: 'q1-1',
      difficulty: 1,
      difficultyLabel: 'FOUNDATIONAL (LEVEL 1)',
      topic: 'Python Fundamentals',
      question: 'Which Python data structure stores key-value pairs and provides O(1) average lookup time?',
      options: ['List', 'Tuple', 'Dictionary (dict)', 'String'],
      correctIndex: 2,
      explanation: 'A Python dictionary (dict) uses a hash table to map unique keys to values with O(1) average lookup complexity.'
    },
    {
      id: 'q1-2',
      difficulty: 1,
      difficultyLabel: 'FOUNDATIONAL (LEVEL 1)',
      topic: 'AI & ML Basics',
      question: 'In Supervised Machine Learning, what does the training dataset include?',
      options: [
        'Only unlabeled raw images',
        'Input features paired with known target labels',
        'Only reward signals without data',
        'Database schema definitions only'
      ],
      correctIndex: 1,
      explanation: 'Supervised learning trains models on labeled examples (input features X paired with ground-truth target labels y).'
    },
    {
      id: 'q1-3',
      difficulty: 1,
      difficultyLabel: 'FOUNDATIONAL (LEVEL 1)',
      topic: 'Relational Databases',
      question: 'Which SQL clause is used to filter rows returned by a SELECT query based on a condition?',
      options: ['ORDER BY', 'WHERE', 'GROUP BY', 'JOIN'],
      correctIndex: 1,
      explanation: 'The WHERE clause filters records before grouping or ordering.'
    }
  ],
  2: [
    {
      id: 'q2-1',
      difficulty: 2,
      difficultyLabel: 'INTERMEDIATE (LEVEL 2)',
      topic: 'Machine Learning Evaluation',
      question: 'When evaluating a classification model on a highly imbalanced medical dataset, why can accuracy alone be misleading?',
      options: [
        'Accuracy cannot be computed for binary classes',
        'A model predicting only the majority class can still achieve high accuracy while missing positive cases',
        'Accuracy is always lower than Precision',
        'Accuracy requires neural networks'
      ],
      correctIndex: 1,
      explanation: 'On imbalanced datasets, F1-score, Precision, Recall, and ROC-AUC provide much more reliable insights than raw accuracy.'
    },
    {
      id: 'q2-2',
      difficulty: 2,
      difficultyLabel: 'INTERMEDIATE (LEVEL 2)',
      topic: 'Algorithmic Complexity',
      question: 'What is the time complexity of Binary Search on a sorted array of N elements?',
      options: ['O(N)', 'O(N log N)', 'O(log N)', 'O(N²)'],
      correctIndex: 2,
      explanation: 'Binary Search halves the search interval at every step, resulting in logarithmic O(log N) time complexity.'
    },
    {
      id: 'q2-3',
      difficulty: 2,
      difficultyLabel: 'INTERMEDIATE (LEVEL 2)',
      topic: 'Accessible Systems',
      question: 'In an inclusive adaptive assessment platform, how does Computerized Adaptive Testing (CAT) improve candidate evaluation?',
      options: [
        'By giving every candidate the exact same static paper test',
        'By dynamically tailoring question difficulty to the candidate’s demonstrated ability level',
        'By removing all time indicators and feedback',
        'By restricting keyboard navigation'
      ],
      correctIndex: 1,
      explanation: 'Adaptive testing adjusts item difficulty after each response to accurately measure proficiency with fewer questions and reduced test anxiety.'
    }
  ],
  3: [
    {
      id: 'q3-1',
      difficulty: 3,
      difficultyLabel: 'ADVANCED (LEVEL 3)',
      topic: 'Deep Learning & Optimization',
      question: 'What problem occurs during backpropagation when gradients become extremely small in deep neural networks, preventing early layers from learning?',
      options: [
        'Overfitting Variance Explosion',
        'Vanishing Gradient Problem',
        'K-Means Centroid Drift',
        'SQL Deadlock Contention'
      ],
      correctIndex: 1,
      explanation: 'The Vanishing Gradient problem occurs with saturating activations (like sigmoid/tanh) and is mitigated by ReLU, Residual Connections, and Batch Normalization.'
    },
    {
      id: 'q3-2',
      difficulty: 3,
      difficultyLabel: 'ADVANCED (LEVEL 3)',
      topic: 'Database Transactions',
      question: 'In DBMS ACID properties, which property guarantees that a transaction either completes in its entirety or has no effect at all?',
      options: ['Isolation', 'Durability', 'Atomicity', 'Consistency'],
      correctIndex: 2,
      explanation: 'Atomicity ("all or nothing") ensures that partial transactions are rolled back if any step fails.'
    }
  ]
};

export function mountInclusEvalDemo(container) {
  let stage = 'intro'; // 'intro' | 'quiz' | 'result'
  let candidateName = 'Explorer Candidate';
  let currentDifficulty = 1; // starts at 1, adapts between 1, 2, 3
  let stepIndex = 0;
  const totalSteps = 5;
  let score = 0;
  let selectedOption = null;
  let feedbackState = null; // null | { isCorrect, explanation, nextDifficulty }
  let usedQuestionIds = new Set();
  let currentQuestion = null;
  let historyLog = [];
  let fontScale = 1;
  let highContrast = false;

  function pickQuestionForDifficulty(diff) {
    const pool = QUESTION_BANK[diff] || QUESTION_BANK[1];
    const available = pool.filter((q) => !usedQuestionIds.has(q.id));
    const chosen = available.length > 0 ? available[0] : pool[Math.floor(Math.random() * pool.length)];
    usedQuestionIds.add(chosen.id);
    return chosen;
  }

  function speakText(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.0;
    window.speechSynthesis.speak(u);
  }

  function render() {
    container.innerHTML = `
      <div class="demo-disclaimer-banner" style="border-color: rgba(196, 60, 255, 0.45); background: rgba(196, 60, 255, 0.09);">
        <span>
          <strong>INCLUSEVAL (SIH1777) CONCEPT DEMO:</strong> Sample adaptive assessment demonstrating dynamic difficulty scaling and accessibility tools (not connected to the original SIH deployment).
        </span>
      </div>

      <div class="incluseval-container ${highContrast ? 'high-contrast' : ''}" style="font-size: ${fontScale * 100}%;">
        <div class="incluseval-a11y-bar">
          <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
            <span style="font-family:var(--font-display); font-size:11px; color:var(--cyan); letter-spacing:1.5px;">
              ♿ ACCESSIBILITY SUITE:
            </span>
            <button type="button" class="mini-hud-btn" id="a11yFontNormal">TEXT 100%</button>
            <button type="button" class="mini-hud-btn" id="a11yFontLarge">TEXT 115%</button>
            <button type="button" class="mini-hud-btn" id="a11yContrastBtn">
              ${highContrast ? '◐ STANDARD THEME' : '◑ HIGH CONTRAST'}
            </button>
            <button type="button" class="mini-hud-btn" id="a11yReadAloudBtn">🔊 READ SCREEN ALOUD</button>
          </div>
          <div style="font-family:var(--font-display); font-size:12px; color:var(--purple);">
            ADAPTIVE ENGINE: ONLINE
          </div>
        </div>

        <div id="inclusevalStageContent"></div>
      </div>
    `;

    const stageEl = container.querySelector('#inclusevalStageContent');

    if (stage === 'intro') {
      stageEl.innerHTML = `
        <div style="max-width: 680px; margin: 12px auto; text-align: center;">
          <div class="edu-status-tag" style="display:inline-block; margin-bottom:14px;">PROBLEM STATEMENT // SIH1777</div>
          <h3 style="font-family: var(--font-display); font-size: 24px; color: var(--cyan); margin-bottom: 12px;">
            INCLUSEVAL — ADAPTIVE & ACCESSIBLE SKILL ASSESSMENT
          </h3>
          <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 22px;">
            This demonstration evaluates technical proficiency across <strong>5 adaptive questions</strong>.
            When you answer correctly, <strong>NEUROBOT</strong> increases the difficulty level (Foundational → Intermediate → Advanced) and awards higher competency points. If a question is missed, the difficulty recalibrates to support steady mastery.
          </p>

          <div style="max-width: 420px; margin: 0 auto 22px; text-align: left;">
            <label for="candidateInput" style="display:block; font-size:13px; color:var(--cyan); font-family:var(--font-display); margin-bottom:8px;">
              CANDIDATE NAME / ID
            </label>
            <input
              type="text"
              id="candidateInput"
              class="jarvis-input"
              style="width:100%;"
              value="${candidateName}"
              placeholder="Enter your name"
            />
          </div>

          <button type="button" class="btn btn-primary" id="startAssessmentBtn">
            BEGIN ADAPTIVE ASSESSMENT ↗
          </button>
        </div>
      `;

      stageEl.querySelector('#startAssessmentBtn').addEventListener('click', () => {
        const val = stageEl.querySelector('#candidateInput').value.trim();
        if (val) candidateName = val;
        stage = 'quiz';
        currentDifficulty = 1;
        stepIndex = 0;
        score = 0;
        usedQuestionIds.clear();
        historyLog = [];
        selectedOption = null;
        feedbackState = null;
        currentQuestion = pickQuestionForDifficulty(currentDifficulty);
        render();
      });
    } else if (stage === 'quiz') {
      const progressPct = Math.round(((stepIndex + 1) / totalSteps) * 100);
      const diffColor =
        currentQuestion.difficulty === 3
          ? 'var(--magenta)'
          : currentQuestion.difficulty === 2
          ? 'var(--purple)'
          : 'var(--cyan)';

      stageEl.innerHTML = `
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
            <div>
              <span style="font-family:var(--font-display); font-size:12px; color:var(--text-muted);">
                QUESTION ${stepIndex + 1} OF ${totalSteps} &nbsp;·&nbsp; TOPIC: ${currentQuestion.topic.toUpperCase()}
              </span>
            </div>
            <div style="display:flex; gap:12px; align-items:center;">
              <span style="padding:5px 12px; border-radius:99px; border:1px solid ${diffColor}; color:${diffColor}; font-family:var(--font-display); font-size:11px;">
                ⚡ ${currentQuestion.difficultyLabel}
              </span>
              <span style="font-family:var(--font-display); font-size:13px; color:var(--emerald);">
                SCORE: ${score} PTS
              </span>
            </div>
          </div>

          <div class="boot-progress-wrap" style="margin-bottom: 22px;">
            <div class="boot-progress-bar" style="width: ${progressPct}%;"></div>
          </div>

          <h4 style="font-size: 19px; color: #ffffff; line-height: 1.5; margin-bottom: 18px;">
            ${currentQuestion.question}
          </h4>

          <div id="mcqOptionsWrap">
            ${currentQuestion.options
              .map(
                (opt, idx) => `
                <button
                  type="button"
                  class="mcq-option-btn ${selectedOption === idx ? 'selected' : ''}"
                  data-idx="${idx}"
                  ${feedbackState ? 'disabled' : ''}
                >
                  <strong style="color:var(--cyan); margin-right:10px;">${String.fromCharCode(65 + idx)}.</strong> ${opt}
                </button>
              `
              )
              .join('')}
          </div>

          ${
            feedbackState
              ? `
              <div style="margin-top: 16px; padding: 16px; border-radius: 10px; background: ${
                feedbackState.isCorrect ? 'rgba(0, 245, 155, 0.12)' : 'rgba(255, 59, 107, 0.12)'
              }; border: 1px solid ${feedbackState.isCorrect ? 'var(--emerald)' : 'var(--crimson)'};">
                <strong style="color: ${feedbackState.isCorrect ? 'var(--emerald)' : '#ff6b93'}; display:block; margin-bottom:6px;">
                  ${
                    feedbackState.isCorrect
                      ? `✓ CORRECT! (+${currentQuestion.difficulty * 20} pts) — Adaptive Engine escalating difficulty to Level ${feedbackState.nextDifficulty}.`
                      : `✕ INCORRECT — Adaptive Engine calibrating difficulty to Level ${feedbackState.nextDifficulty} for reinforcement.`
                  }
                </strong>
                <p style="font-size: 14px; color: var(--text-secondary);">${feedbackState.explanation}</p>
              </div>
            `
              : ''
          }

          <div style="display:flex; justify-content:flex-end; gap:12px; margin-top: 20px;">
            ${
              !feedbackState
                ? `<button type="button" class="btn btn-primary" id="submitAnswerBtn" ${
                    selectedOption === null ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''
                  }>SUBMIT ANSWER ✓</button>`
                : `<button type="button" class="btn btn-purple" id="nextQuestionBtn">
                    ${stepIndex + 1 >= totalSteps ? 'VIEW FINAL ASSESSMENT REPORT ↗' : 'NEXT ADAPTIVE QUESTION →'}
                  </button>`
            }
          </div>
        </div>
      `;

      stageEl.querySelectorAll('.mcq-option-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (feedbackState) return;
          selectedOption = Number(btn.getAttribute('data-idx'));
          render();
        });
      });

      const submitBtn = stageEl.querySelector('#submitAnswerBtn');
      if (submitBtn) {
        submitBtn.addEventListener('click', () => {
          if (selectedOption === null) return;
          const isCorrect = selectedOption === currentQuestion.correctIndex;
          const earned = isCorrect ? currentQuestion.difficulty * 20 : 0;
          score += earned;

          const nextDiff = isCorrect
            ? Math.min(3, currentDifficulty + 1)
            : Math.max(1, currentDifficulty - 1);

          historyLog.push({
            step: stepIndex + 1,
            topic: currentQuestion.topic,
            difficulty: currentQuestion.difficultyLabel,
            isCorrect,
            earned
          });

          feedbackState = {
            isCorrect,
            explanation: currentQuestion.explanation,
            nextDifficulty: nextDiff
          };
          currentDifficulty = nextDiff;
          render();
        });
      }

      const nextBtn = stageEl.querySelector('#nextQuestionBtn');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          stepIndex += 1;
          if (stepIndex >= totalSteps) {
            stage = 'result';
          } else {
            selectedOption = null;
            feedbackState = null;
            currentQuestion = pickQuestionForDifficulty(currentDifficulty);
          }
          render();
        });
      }
    } else if (stage === 'result') {
      const correctCount = historyLog.filter((h) => h.isCorrect).length;
      const accuracy = Math.round((correctCount / totalSteps) * 100);

      stageEl.innerHTML = `
        <div style="text-align: center; max-width: 720px; margin: 0 auto;">
          <div class="edu-status-tag" style="display:inline-block; margin-bottom:12px;">ASSESSMENT COMPLETED</div>
          <h3 style="font-family: var(--font-display); font-size: 25px; color: var(--cyan); margin-bottom: 8px;">
            CANDIDATE REPORT: ${candidateName.toUpperCase()}
          </h3>
          <p style="color: var(--text-secondary); margin-bottom: 22px;">
            Adaptive Score: <strong style="color: var(--emerald); font-size: 20px;">${score} PTS</strong> &nbsp;|&nbsp;
            Accuracy: <strong style="color: var(--cyan);">${correctCount} / ${totalSteps} (${accuracy}%)</strong>
          </p>

          <div style="text-align:left; display:grid; gap:10px; margin-bottom:24px;">
            ${historyLog
              .map(
                (item) => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; border-radius:8px; background:rgba(255,255,255,0.04); border-left: 3px solid ${
                  item.isCorrect ? 'var(--emerald)' : 'var(--crimson)'
                };">
                  <div>
                    <strong>Q${item.step}: ${item.topic}</strong>
                    <small style="display:block; color:var(--text-muted);">${item.difficulty}</small>
                  </div>
                  <span style="font-family:var(--font-display); font-size:12px; color:${
                    item.isCorrect ? 'var(--emerald)' : '#ff6b93'
                  };">
                    ${item.isCorrect ? `✓ +${item.earned} PTS` : '✕ 0 PTS'}
                  </span>
                </div>
              `
              )
              .join('')}
          </div>

          <button type="button" class="btn btn-primary" id="restartAssessmentBtn">
            ↻ RESTART ADAPTIVE ASSESSMENT
          </button>
        </div>
      `;

      stageEl.querySelector('#restartAssessmentBtn').addEventListener('click', () => {
        stage = 'intro';
        render();
      });
    }

    // Bind Accessibility Toolbar Buttons
    container.querySelector('#a11yFontNormal').addEventListener('click', () => {
      fontScale = 1;
      render();
    });
    container.querySelector('#a11yFontLarge').addEventListener('click', () => {
      fontScale = 1.15;
      render();
    });
    container.querySelector('#a11yContrastBtn').addEventListener('click', () => {
      highContrast = !highContrast;
      render();
    });
    container.querySelector('#a11yReadAloudBtn').addEventListener('click', () => {
      if (stage === 'quiz' && currentQuestion) {
        const optsText = currentQuestion.options
          .map((o, i) => `Option ${String.fromCharCode(65 + i)}: ${o}`)
          .join('. ');
        speakText(`${currentQuestion.difficultyLabel}. Question: ${currentQuestion.question}. ${optsText}`);
      } else {
        speakText(stageEl.innerText);
      }
    });
  }

  render();

  return function cleanup() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };
}

