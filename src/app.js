// Views, routing, keyboard and dialogs. Logic lives in quiz.js, data in content.js.
import { SKILLS, FAMILIES, BANDS, SOURCES } from './content.js';
import { drawRun, scoreRun, scenario, band, weakest, encodeShare, decodeShare } from './quiz.js';
import * as store from './store.js';

const REPO = 'https://github.com/amalmehta/HowGoodAreYourTeachingSkills';
const view = document.getElementById('view');
let state = store.load();

// ── Icons (24px line icons, stroke = currentColor) ──────────────
const P = {
  explain: '<path d="M4 5h16v11H10l-5 4v-4H4z"/><path d="M8 9h8M8 12h5"/>',
  examples: '<rect x="3" y="8" width="12" height="12" rx="2"/><path d="M8 8V5a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-5"/>',
  check: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.3-4.3"/>',
  feedback: '<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/>',
  practice: '<path d="M17 3l3 3-3 3"/><path d="M4 11V9a3 3 0 0 1 3-3h13"/><path d="M7 21l-3-3 3-3"/><path d="M20 13v2a3 3 0 0 1-3 3H4"/>',
  difficulty: '<path d="M3 20h5v-5h5v-5h5V5h3"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  play: '<path d="M7 4l13 8-13 8z"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  redo: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  msg: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  chart: '<path d="M4 20V4M4 20h16"/><path d="M7 15l4-4 3 3 5-6"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
};
const icon = (name, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[name]}</svg>`;

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const skillById = Object.fromEntries(SKILLS.map((k) => [k.id, k]));
const color = (id) => `--c: var(--${id})`;
const sourceLink = (key) => {
  const s = SOURCES[key];
  const href = s.doi ? `https://doi.org/${s.doi}` : s.url;
  return `<a href="${href}" target="_blank" rel="noopener">${esc(s.cite.split(').')[0])})</a>`;
};
const fmtDate = (iso) => new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

function persist() { store.save(state); }

// ── Router ──────────────────────────────────────────────────────
const routes = {
  '': renderHome,
  quiz: renderQuiz,
  result: renderResult,
  r: renderShared,
  method: renderMethod,
};

function render() {
  const [, name = '', arg] = (location.hash.match(/^#\/?([^/]*)\/?(.*)$/) || []);
  const fn = routes[name] || renderHome;
  view.classList.remove('view-enter');
  view.classList.toggle('wide', name === 'method');
  fn(arg);
  void view.offsetWidth; // restart the enter animation
  view.classList.add('view-enter');
  document.querySelectorAll('[data-nav]').forEach((a) => a.toggleAttribute('aria-current', a.dataset.nav === name));
  window.scrollTo(0, 0);
  view.focus({ preventScroll: true });
}

// ── Home ────────────────────────────────────────────────────────
function renderHome() {
  const p = state.inProgress;
  const last = state.history.at(-1);
  const startBtns = p
    ? `<a class="btn primary" href="#/quiz">${icon('play')} Resume, question ${p.index + 1} of ${p.items.length}</a>
       <button class="btn" data-act="start">${icon('redo')} Start over</button>`
    : `<button class="btn primary" data-act="start">${icon('play')} Start the quiz <kbd>Enter</kbd></button>
       <a class="btn quiet" href="#/method">${icon('book')} How it's scored</a>`;

  view.innerHTML = `
    <section class="hero">
      <h1>How good are your teaching skills?</h1>
      <p class="lede">18 short teaching scenarios, about 8 minutes. You pick what you'd do, see what research says after each one,
      and finish with the one skill to practise next.</p>
      <div class="row">${startBtns}</div>
      <div class="honest">${icon('info')}<p><strong>What this measures:</strong> teaching <em>judgment</em>, meaning whether you'd choose
      the move that research supports. Knowing the right move isn't the same as making it live, so every result comes with a drill to try the next time you teach.</p></div>
    </section>

    ${last ? lastResultCard(last) : ''}

    <div class="section-title">${icon('list')} The six skills</div>
    <div class="skills-grid">
      ${SKILLS.map((k) => `
        <div class="skill-tile" style="${color(k.id)}">
          <div class="fam">${FAMILIES[k.family].name}</div>
          <div class="name">${icon(k.id)} ${k.name}</div>
          <p>${k.short}</p>
        </div>`).join('')}
    </div>

    ${last ? '' : samplePreview()}
  `;
}

function lastResultCard(last) {
  const w = weakest(last.scores);
  return `
    <div class="section-title">${icon('chart')} Your last result</div>
    <div class="card row" style="justify-content:space-between">
      <div>
        <div class="big" style="font-size:2.6rem">${last.overall}<small> / 100</small></div>
        <div class="muted small">${fmtDate(last.date)} · ${band(last.overall).name} · practise next: <strong style="color:var(--${w.id})">${w.name}</strong></div>
      </div>
      <a class="btn" href="#/result">${icon('arrow')} View result</a>
    </div>`;
}

function samplePreview() {
  return `
    <div class="section-title">${icon('msg')} What a question looks like</div>
    <div class="card preview" aria-hidden="true">
      <span class="chip" style="${color('check')}">${icon('check')} Checking understanding</span>
      <p class="prompt" style="margin-bottom:14px">You finish explaining recursion. You ask, "Does that make sense?" Everyone nods. What do you do next?</p>
      <div class="options">
        <div class="opt"><kbd>1</kbd><span class="txt">Move on, since everyone has said they understand it</span></div>
        <div class="opt"><kbd>2</kbd><span class="txt">Ask them to trace factorial(3) aloud, step by step</span></div>
      </div>
      <div class="fade"></div>
    </div>`;
}

function startQuiz() {
  state.inProgress = { items: drawRun(state.seen), answers: {}, index: 0 };
  persist();
  if (location.hash === '#/quiz') render(); else location.hash = '#/quiz';
}

// ── Quiz ────────────────────────────────────────────────────────
function renderQuiz() {
  const p = state.inProgress;
  if (!p) return startQuiz();
  const item = p.items[p.index];
  const s = scenario(item.id);
  if (!s) { console.warn('[quiz] unknown scenario, restarting', item.id); return startQuiz(); }
  const k = skillById[s.skill];
  const n = p.items.length;

  view.innerHTML = `
    <div class="progress" aria-label="Question ${p.index + 1} of ${n}">
      <div class="bar"><i style="width:${(p.index / n) * 100}%"></i></div><span>${p.index + 1} / ${n}</span>
    </div>
    <span class="chip" style="${color(k.id)}">${icon(k.id)} ${k.name}</span>
    <p class="prompt">${esc(s.prompt)}</p>
    <div class="options" id="opts">
      ${item.order.map((orig, pos) => `
        <button class="opt" data-orig="${orig}">
          <kbd>${pos + 1}</kbd>
          <span class="txt">${esc(s.options[orig].text)}<span class="note" hidden></span></span>
          <span class="pts">${s.options[orig].points === 3 ? 'Best · 3' : s.options[orig].points + (s.options[orig].points === 1 ? ' pt' : ' pts')}</span>
        </button>`).join('')}
    </div>
    <div id="why"></div>
    <div class="quiz-foot">
      <a class="btn quiet" href="#/">${icon('back')} Save and exit <kbd>Esc</kbd></a>
      <span id="next-slot"></span>
    </div>`;
  requestAnimationFrame(() => {
    const bar = view.querySelector('.progress i'); // gone if the view changed in between
    if (bar) bar.style.width = `${((p.index + 1) / n) * 100}%`;
  });
  if (p.answers[s.id] != null) showAnswer(s, p.answers[s.id]);
}

function choose(orig) {
  const p = state.inProgress;
  const s = scenario(p.items[p.index].id);
  if (p.answers[s.id] != null) return;
  p.answers[s.id] = orig;
  persist();
  if (state.prefs.explainAfterEach) showAnswer(s, orig);
  else setTimeout(next, 160); // brief beat so the pick registers visually
  if (!state.prefs.explainAfterEach) view.querySelector(`[data-orig="${orig}"]`)?.classList.add('picked', 'best');
}

// Update in place (no re-render) so the response is instant.
function showAnswer(s, picked) {
  const opts = view.querySelector('#opts');
  opts.classList.add('answered');
  opts.querySelectorAll('.opt').forEach((btn) => {
    const o = +btn.dataset.orig;
    btn.disabled = true;
    btn.classList.toggle('best', s.options[o].points === 3);
    btn.classList.toggle('picked', o === picked);
    if (o === picked || s.options[o].points === 3) {
      const note = btn.querySelector('.note');
      note.textContent = s.options[o].note;
      note.hidden = false;
    }
  });
  const pts = s.options[picked].points;
  const verdict = pts === 3 ? 'Best move.' : pts > 0 ? `Defensible: ${pts} of 3 points.` : 'Usually backfires: 0 of 3 points.';
  view.querySelector('#why').innerHTML = `
    <div class="why">
      <p><strong>${verdict}</strong> ${esc(s.lesson)}</p>
      <p class="src">${icon('book')} ${s.sources.map(sourceLink).join(' · ')}</p>
    </div>`;
  const last = state.inProgress.index === state.inProgress.items.length - 1;
  view.querySelector('#next-slot').innerHTML =
    `<button class="btn primary" data-act="next">${last ? 'See my result' : 'Next'} ${icon('arrow')} <kbd>Enter</kbd></button>`;
  view.querySelector('[data-act="next"]').focus({ preventScroll: true });
}

function next() {
  const p = state.inProgress;
  if (!p || p.answers[p.items[p.index].id] == null) return;
  if (p.index + 1 < p.items.length) {
    p.index++;
    persist();
    render();
  } else finish();
}

function finish() {
  const { items, answers } = state.inProgress;
  const { scores, overall } = scoreRun(items, answers);
  state.history.push({ date: new Date().toISOString(), scores, overall, items, answers });
  state.history = state.history.slice(-50);
  state.seen = [...new Set([...state.seen, ...items.map((i) => i.id)])];
  state.inProgress = null;
  persist();
  location.hash = '#/result';
}

// ── Results ─────────────────────────────────────────────────────
function bars(scores, weakId) {
  return `<div class="bars">${SKILLS.map((k) => `
    <div class="bar-row ${k.id === weakId ? 'weak' : ''}" style="${color(k.id)}">
      <div class="label">${icon(k.id)} ${k.name}</div>
      <div class="track"><i data-w="${scores[k.id]}"></i></div>
      <div class="val">${scores[k.id]}<span>${band(scores[k.id]).name}</span></div>
    </div>`).join('')}</div>`;
}

function animateBars() {
  requestAnimationFrame(() => view.querySelectorAll('.track i').forEach((i) => { i.style.width = `${i.dataset.w}%`; }));
}

function renderResult() {
  const entry = state.history.at(-1);
  if (!entry) {
    view.innerHTML = `
      <div class="empty">
        ${emptyArt()}
        <h2>No result yet</h2>
        <p class="muted">Answer 18 short scenarios, about 8 minutes, and your profile appears here.</p>
        <button class="btn primary" data-act="start">${icon('play')} Start the quiz</button>
      </div>`;
    return;
  }
  const w = weakest(entry.scores);
  const b = band(entry.overall);
  const checks = state.selfChecks[w.id] || [false, false];

  view.innerHTML = `
    <div class="score-head">
      <div><div class="muted small">Teaching judgment · ${fmtDate(entry.date)}</div>
      <div class="big">${entry.overall}<small> / 100</small></div></div>
      <div style="padding-bottom:8px"><span class="band-tag">${b.name}</span>
      <div class="muted small" style="margin-top:6px">${b.note}</div></div>
    </div>

    <div class="section-title">${icon('target')} ${entry.scores[w.id] >= 78 ? 'All strong. Your lowest skill, to keep sharp' : 'Practise next'}</div>
    <div class="card focus-card" style="${color(w.id)}">
      <span class="chip">${icon(w.id)} ${w.name} · ${entry.scores[w.id]}</span>
      <h2 style="margin-top:8px">${esc(w.short)}</h2>
      <dl>
        <dt>The idea</dt><dd>${esc(w.idea)}</dd>
        <dt>Like…</dt><dd>${esc(w.analogy)}</dd>
        <dt>Why it works</dt><dd>${esc(w.why)}</dd>
        <dt>When it doesn't</dt><dd>${esc(w.fails)}</dd>
      </dl>
      <div class="drill"><strong>Try this, live:</strong> ${esc(w.drill)}</div>
      <div style="margin-top:14px"><div class="muted small">Afterwards, check:</div>
        ${w.selfCheck.map((q, i) => `<label class="check-item"><input type="checkbox" data-check="${w.id}:${i}" ${checks[i] ? 'checked' : ''}> ${esc(q)}</label>`).join('')}
      </div>
      <p class="principle" style="margin:14px 0 0">${esc(w.principle)}</p>
    </div>

    <div class="section-title">${icon('chart')} All six skills</div>
    <div class="card">
      ${bars(entry.scores, w.id)}
      <p class="muted small" style="margin:16px 0 0">Each skill rests on 3 questions, so one answer can move it by up to 33 points.
      Read the bands as rough signals. <span class="label-est">Our thresholds</span> 0–44 Start here · 45–77 Solid · 78–100 Strong. These are not research norms.</p>
    </div>

    <div class="row" style="margin-top:20px">
      <button class="btn primary" data-act="share">${icon('link')} Copy share link</button>
      <button class="btn" data-act="start">${icon('redo')} Retake</button>
      <a class="btn quiet" href="#/method">${icon('book')} How it's scored</a>
    </div>
    <p class="muted small" style="margin-top:8px">The link holds only your six scores. No answers, no name.</p>

    ${historyBlock()}
    ${reviewBlock(entry)}
  `;
  animateBars();
}

function historyBlock() {
  const h = state.history.slice(-12);
  if (h.length < 2) {
    return `<div class="section-title">${icon('chart')} Progress</div>
      <p class="muted">Retake in a week or two to start a trend line. Each retake prefers scenarios you haven't seen.</p>`;
  }
  const W = 600, H = 140, pad = 24;
  const x = (i) => pad + (i * (W - 2 * pad)) / (h.length - 1);
  const y = (v) => H - pad - (v / 100) * (H - 2 * pad);
  const pts = h.map((e, i) => `${x(i).toFixed(1)},${y(e.overall).toFixed(1)}`).join(' ');
  return `
    <div class="section-title">${icon('chart')} Progress</div>
    <div class="card history">
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Overall score over ${h.length} runs">
        ${[0, 50, 100].map((v) => `<line class="grid" x1="${pad}" x2="${W - pad}" y1="${y(v)}" y2="${y(v)}"/><text x="0" y="${y(v) + 4}">${v}</text>`).join('')}
        <polyline class="ln" points="${pts}"/>
        ${h.map((e, i) => `<circle class="dot" cx="${x(i)}" cy="${y(e.overall)}" r="4"><title>${fmtDate(e.date)}: ${e.overall}</title></circle>`).join('')}
      </svg>
      <p class="muted small" style="margin:8px 0 0">Rises partly reflect having seen some questions before (the practice effect), not only better teaching.</p>
    </div>`;
}

function reviewBlock(entry) {
  if (!entry.items) return '';
  return `
    <div class="section-title">${icon('list')} Your answers</div>
    <details class="review card">
      <summary>Review all ${entry.items.length} answers</summary>
      ${entry.items.map(({ id }) => {
        const s = scenario(id);
        if (!s) return '';
        const pick = s.options[entry.answers[id]];
        const best = s.options.find((o) => o.points === 3);
        return `<div class="review-item">
          <div class="q">${esc(s.prompt)}</div>
          <div><span class="mark ${pick?.points === 3 ? 'ok' : 'no'}">${pick ? pick.points : 0}/3</span> You: ${esc(pick?.text ?? 'No answer')}</div>
          ${pick?.points === 3 ? '' : `<div class="muted">Best: ${esc(best.text)}</div>`}
          <div class="muted small">${esc(s.lesson)} ${s.sources.map(sourceLink).join(' · ')}</div>
        </div>`;
      }).join('')}
    </details>`;
}

function renderShared(code) {
  const r = decodeShare(decodeURIComponent(code || ''));
  if (!r) {
    view.innerHTML = `
      <div class="empty">${emptyArt()}
        <h2>This link doesn't hold a valid result</h2>
        <p class="muted">It may have been cut off when copied. You can still take the quiz yourself.</p>
        <button class="btn primary" data-act="start">${icon('play')} Take it yourself</button>
      </div>`;
    return;
  }
  const w = weakest(r.scores);
  view.innerHTML = `
    <div class="score-head">
      <div><div class="muted small">A shared result · teaching judgment</div>
      <div class="big">${r.overall}<small> / 100</small></div></div>
      <div style="padding-bottom:8px"><span class="band-tag">${band(r.overall).name}</span>
      <div class="muted small" style="margin-top:6px">Practising next: <strong style="color:var(--${w.id})">${w.name}</strong></div></div>
    </div>
    <div class="card" style="margin-top:20px">${bars(r.scores, w.id)}</div>
    <div class="card" style="margin-top:20px">
      <h3>How would you do?</h3>
      <p class="muted">18 scenarios, about 8 minutes. You'll see the research behind every answer as you go.</p>
      <button class="btn primary" data-act="start">${icon('play')} Take it yourself</button>
    </div>`;
  animateBars();
}

function emptyArt() {
  return `<svg class="art" viewBox="0 0 160 110" aria-hidden="true">
    <rect x="20" y="14" width="110" height="66" rx="12" fill="var(--surface-2)" stroke="var(--line)"/>
    <path d="M44 80l-8 20 26-20" fill="var(--surface-2)" stroke="var(--line)"/>
    <path d="M40 36h70M40 50h50M40 64h30" stroke="var(--muted)" stroke-width="5" stroke-linecap="round" opacity=".35"/>
    <circle cx="128" cy="76" r="18" fill="var(--accent)"/>
    <path d="M120 76l6 6 10-11" stroke="var(--surface)" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

// ── Method ──────────────────────────────────────────────────────
function renderMethod() {
  const eq = (tex, fallback) => `<div class="eq" data-tex="${esc(tex)}"><span class="eq-fallback">${fallback}</span></div>`;
  const used = new Set(SKILLS.length ? Object.keys(SOURCES) : []);
  view.innerHTML = `
    <h1 style="margin-top:20px">How it's scored</h1>
    <p class="lede muted" style="font-size:1.1rem">This is a situational judgment test. Each question describes a teaching moment and you
    pick a move. Points come from what research says works, and every answer key cites its source.</p>

    <div class="honest">${icon('info')}<p><strong>What this can and can't tell you.</strong> A driving theory test checks whether you know the rules of the road,
    not whether you can drive in snow. This quiz is the theory test for teaching: it measures judgment, not performance.
    It has had <em>no psychometric validation</em> (no study yet shows that scores predict how well people actually learn from you).
    Use it as a structured self-check.</p></div>

    <h2 style="margin-top:36px">The formula</h2>
    <p>Each option is worth 0–3 points. The best move scores 3, a defensible one 1–2, and one that usually backfires 0.</p>
    ${eq('S_k = \\frac{100}{9}\\sum_{i=1}^{3} p_{k,i}', 'S<sub>k</sub> = (100 / 9) × (p<sub>k,1</sub> + p<sub>k,2</sub> + p<sub>k,3</sub>)')}
    <ul class="defs">
      <li><strong>S<sub>k</sub></strong>: your score for skill k, from 0 to 100 (a percentage, no units)</li>
      <li><strong>p<sub>k,i</sub></strong>: points for your answer to question i of skill k, from 0 to 3</li>
      <li><strong>9</strong>: the most points one skill can earn (3 questions × 3 points)</li>
    </ul>
    <p>In words: your skill score is the share of the best possible points you earned.</p>
    ${eq('\\bar{S} = \\frac{1}{6}\\sum_{k=1}^{6} S_k', 'S̄ = (S<sub>1</sub> + … + S<sub>6</sub>) / 6')}
    <ul class="defs"><li><strong>S̄</strong>: overall teaching judgment, 0–100, the plain average of the six skill scores</li></ul>

    <h3 style="margin-top:24px">Worked example</h3>
    <ol>
      <li>On Checking understanding you score 3, 2 and 0 points.</li>
      <li>That's 5 of 9 points.</li>
      <li>100 × 5 / 9 = 55.6, which rounds to <strong>56</strong>, in the Solid band.</li>
    </ol>

    <h3 style="margin-top:24px">How precise is it?</h3>
    ${eq('\\Delta S_k \\le \\frac{100 \\times 3}{9} \\approx 33', 'ΔS<sub>k</sub> ≤ 100 × 3 / 9 ≈ 33')}
    <ul class="defs"><li><strong>ΔS<sub>k</sub></strong>: how much one answer can change a skill score</li></ul>
    <p>In words: with only three questions per skill, a single answer can swing a skill score by a third. That is why skills are shown in bands.
    Read your weakest skill as "worth looking at first", not as a diagnosis.</p>

    <table class="bands">
      <tr><th>Band <span class="label-est">our thresholds</span></th><th>Score</th><th>Meaning</th></tr>
      ${BANDS.map((b, i) => `<tr><td>${b.name}</td><td>${b.min}–${i === 0 ? 100 : BANDS[i - 1].min - 1}</td><td class="muted">${b.note}</td></tr>`).join('')}
    </table>
    <p class="muted small" style="margin-top:8px">These cut-offs are invented for readability. They are not drawn from research norms.</p>

    <h3 style="margin-top:24px">Retakes</h3>
    <p>There are 36 scenarios, two for each of the 18 question slots. Each run draws 18 and prefers the ones you haven't seen.
    Your score can still rise from familiarity (the practice effect), so trends are labelled that way.</p>

    <h2 style="margin-top:36px">The six skills, explained</h2>
    ${SKILLS.map((k) => `
      <div class="card focus-card" style="${color(k.id)}; margin-bottom:16px">
        <span class="chip">${icon(k.id)} ${FAMILIES[k.family].name}</span>
        <h3 style="margin-top:6px">${k.name}</h3>
        <dl>
          <dt>The idea</dt><dd>${esc(k.idea)}</dd>
          <dt>Like…</dt><dd>${esc(k.analogy)}</dd>
          <dt>Why it works</dt><dd>${esc(k.why)}</dd>
          <dt>When it doesn't</dt><dd>${esc(k.fails)}</dd>
        </dl>
        <p class="principle" style="margin:0">${esc(k.principle)}</p>
      </div>`).join('')}

    <h2 style="margin-top:36px">Sources</h2>
    <ol class="sources">
      ${[...used].map((key) => {
        const s = SOURCES[key];
        const href = s.doi ? `https://doi.org/${s.doi}` : s.url;
        return `<li>${esc(s.cite)} <a href="${href}" target="_blank" rel="noopener">${s.doi ? 'doi:' + s.doi : 'PDF'}</a></li>`;
      }).join('')}
    </ol>
    <p class="muted small">Some best answers reflect active debates, such as productive failure. Each explanation names its source so you can judge for yourself.</p>
    <div class="row" style="margin-top:24px"><button class="btn primary" data-act="start">${icon('play')} Start the quiz</button></div>
  `;
  if (window.katex) {
    view.querySelectorAll('.eq').forEach((el) => {
      try { window.katex.render(el.dataset.tex, el, { displayMode: true, throwOnError: true }); }
      catch (err) { console.warn('[katex] kept fallback:', err); }
    });
  }
}

// ── Settings ────────────────────────────────────────────────────
const settingsDlg = document.getElementById('settings');

function applyPrefs() {
  const t = state.prefs.theme;
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
  else delete document.documentElement.dataset.theme;
  document.documentElement.classList.toggle('reduce-motion', !!state.prefs.reduceMotion);
}

function openSettings() {
  const pr = state.prefs;
  const runs = state.history.length;
  settingsDlg.innerHTML = `
    <div class="dlg">
      <header><h2 id="settings-title">Settings</h2><button class="icon-btn" data-act="close" aria-label="Close">${icon('x')}</button></header>
      <div class="setting"><div><div class="t">Appearance</div></div>
        <div class="seg" role="group" aria-label="Theme">
          ${['system', 'light', 'dark'].map((t) => `<button data-theme-set="${t}" aria-pressed="${pr.theme === t}">${t[0].toUpperCase() + t.slice(1)}</button>`).join('')}
        </div></div>
      <label class="setting"><div><div class="t">Explain after each answer</div><div class="d">Show the best move and its source right away. Turn off to see answers only at the end.</div></div>
        <input type="checkbox" class="switch" data-pref="explainAfterEach" ${pr.explainAfterEach ? 'checked' : ''}></label>
      <label class="setting"><div><div class="t">Reduce motion</div><div class="d">Turns off fades and slides.</div></div>
        <input type="checkbox" class="switch" data-pref="reduceMotion" ${pr.reduceMotion ? 'checked' : ''}></label>
      <div class="setting"><div><div class="t">Your data</div><div class="d">${runs} saved run${runs === 1 ? '' : 's'}, stored only in this browser. Nothing is sent anywhere.</div></div>
        <button class="btn" data-act="clear">Clear</button></div>
      <p class="muted small" style="margin:12px 0 0">Shortcut: <kbd>⌘</kbd> <kbd>,</kbd> opens this panel.</p>
    </div>`;
  if (!settingsDlg.open) settingsDlg.showModal();
}

settingsDlg.addEventListener('click', (e) => {
  if (e.target === settingsDlg) return settingsDlg.close(); // backdrop click
  const t = e.target.closest('[data-theme-set]');
  if (t) {
    state.prefs.theme = t.dataset.themeSet;
    persist(); applyPrefs();
    settingsDlg.querySelectorAll('[data-theme-set]').forEach((b) => b.setAttribute('aria-pressed', b === t));
  }
  const act = e.target.closest('[data-act]')?.dataset.act;
  if (act === 'close') settingsDlg.close();
  if (act === 'clear') {
    const btn = e.target.closest('button');
    if (btn.dataset.armed) {
      const prefs = state.prefs;
      store.clear();
      state = store.defaults();
      state.prefs = prefs;
      persist();
      settingsDlg.close();
      toast('History cleared');
      render();
    } else {
      btn.dataset.armed = '1';
      btn.textContent = 'Click again to clear';
    }
  }
});
settingsDlg.addEventListener('change', (e) => {
  const key = e.target.dataset.pref;
  if (!key) return;
  state.prefs[key] = e.target.checked;
  persist(); applyPrefs();
});

// ── Feedback ────────────────────────────────────────────────────
const feedbackDlg = document.getElementById('feedback');
function openFeedback() {
  feedbackDlg.innerHTML = `
    <div class="dlg">
      <header><h2 id="feedback-title">Feedback</h2><button class="icon-btn" data-act="close" aria-label="Close">${icon('x')}</button></header>
      <p class="muted small">Disagree with an answer key, spotted a bug, or have an idea? This opens a prefilled GitHub issue in a new tab
      (you'll need a GitHub account). Nothing is sent until you submit it there.</p>
      <textarea id="fb-text" placeholder="e.g. In the wait-time scenario, I think option 3 deserves more credit because…"></textarea>
      <div class="row" style="margin-top:12px;justify-content:flex-end">
        <button class="btn quiet" data-act="close">Cancel</button>
        <button class="btn primary" data-act="send-feedback">${icon('arrow')} Open on GitHub</button>
      </div>
    </div>`;
  feedbackDlg.showModal();
  feedbackDlg.querySelector('textarea').focus();
}
feedbackDlg.addEventListener('click', (e) => {
  if (e.target === feedbackDlg) return feedbackDlg.close();
  const act = e.target.closest('[data-act]')?.dataset.act;
  if (act === 'close') feedbackDlg.close();
  if (act === 'send-feedback') {
    const text = feedbackDlg.querySelector('textarea').value.trim();
    const body = `${text || '(describe your feedback)'}\n\n---\nPage: ${location.hash || '#/'}`;
    window.open(`${REPO}/issues/new?title=${encodeURIComponent('Feedback: ' + (text.slice(0, 50) || 'quiz'))}&body=${encodeURIComponent(body)}`, '_blank', 'noopener');
    feedbackDlg.close();
  }
});

// ── Share / toast ───────────────────────────────────────────────
let toastTimer;
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

async function share() {
  const entry = state.history.at(-1);
  const url = `${location.origin}${location.pathname}#/r/${encodeShare(entry.scores)}`;
  try {
    await navigator.clipboard.writeText(url);
    toast('Link copied');
  } catch {
    window.prompt('Copy this link:', url);
  }
}

// ── Events ──────────────────────────────────────────────────────
view.addEventListener('click', (e) => {
  const opt = e.target.closest('.opt[data-orig]');
  if (opt && !opt.disabled) return choose(+opt.dataset.orig);
  const act = e.target.closest('[data-act]')?.dataset.act;
  if (act === 'start') startQuiz();
  if (act === 'next') next();
  if (act === 'share') share();
});
view.addEventListener('change', (e) => {
  const c = e.target.dataset.check;
  if (!c) return;
  const [id, i] = c.split(':');
  state.selfChecks[id] = state.selfChecks[id] || [false, false];
  state.selfChecks[id][+i] = e.target.checked;
  persist();
});

document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === ',') { e.preventDefault(); return openSettings(); }
  if (document.querySelector('dialog[open]') || e.metaKey || e.ctrlKey || e.altKey) return;
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
  const route = location.hash.split('/')[1] || '';
  if (route === 'quiz' && state.inProgress) {
    if (/^[1-4]$/.test(e.key)) {
      const btn = view.querySelectorAll('.opt')[+e.key - 1];
      if (btn && !btn.disabled) choose(+btn.dataset.orig);
    } else if ((e.key === 'Enter' || e.key === 'ArrowRight') && view.querySelector('[data-act="next"]')) {
      e.preventDefault(); next();
    } else if (e.key === 'Escape') location.hash = '#/';
  } else if (route === '' && e.key === 'Enter' && (e.target === document.body || e.target === view)) {
    state.inProgress ? (location.hash = '#/quiz') : startQuiz();
  }
});

document.getElementById('open-settings').innerHTML = icon('gear');
document.getElementById('open-settings').addEventListener('click', openSettings);
const fbTab = document.getElementById('open-feedback');
fbTab.innerHTML = `${icon('msg')}<span>Feedback</span>`;
fbTab.addEventListener('click', openFeedback);

window.addEventListener('hashchange', render);
applyPrefs();
render();
