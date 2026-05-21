'use strict';

// ============================================================
// METRICS
// ============================================================
const INITIAL_METRICS = {
  理解度: 5, 安心度: 10, 拒絶度: 30,
  依存度: 0, 自己開示率: 5, 崩壊危険値: 20,
};
const M_COLORS = {
  理解度:'#5b7fd4', 安心度:'#5bd490', 拒絶度:'#d4a85b',
  依存度:'#bd5bd4', 自己開示率:'#5bbdd4', 崩壊危険値:'#d45b5b',
};

// ============================================================
// CHARACTER SVG
// ============================================================
function charSVG(expr) {
  const eyes = {
    neutral: `<ellipse cx="84" cy="118" rx="10" ry="11" fill="#4a5a8a"/>
      <ellipse cx="84" cy="118" rx="10" ry="11" fill="#4a5a8a"/>
      <circle cx="87" cy="114" r="4" fill="white"/>
      <ellipse cx="116" cy="118" rx="10" ry="11" fill="#4a5a8a"/>
      <circle cx="119" cy="114" r="4" fill="white"/>`,
    cold: `<ellipse cx="84" cy="117" rx="10" ry="8.5" fill="#4a5a8a"/>
      <circle cx="87" cy="114" r="3.5" fill="white"/>
      <ellipse cx="116" cy="117" rx="10" ry="8.5" fill="#4a5a8a"/>
      <circle cx="119" cy="114" r="3.5" fill="white"/>`,
    soft: `<ellipse cx="84" cy="120" rx="10" ry="11" fill="#5a6a9a"/>
      <circle cx="87" cy="116" r="4" fill="white"/>
      <ellipse cx="116" cy="120" rx="10" ry="11" fill="#5a6a9a"/>
      <circle cx="119" cy="116" r="4" fill="white"/>`,
  };
  const mouths = {
    neutral: `<path d="M92 140 Q100 143 108 140" stroke="#d4886a" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
    cold:    `<path d="M92 142 Q100 139 108 142" stroke="#d4886a" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
    soft:    `<path d="M92 138 Q100 145 108 138" stroke="#d4886a" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  };
  const e = expr || 'neutral';
  const blush = e === 'soft'
    ? `<ellipse cx="72" cy="127" rx="11" ry="7" fill="rgba(255,120,140,.25)"/>
       <ellipse cx="128" cy="127" rx="11" ry="7" fill="rgba(255,120,140,.25)"/>`
    : '';

  return `<svg viewBox="0 0 200 380" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="100" cy="377" rx="54" ry="7" fill="rgba(0,0,0,.08)"/>
  <rect x="74" y="272" width="20" height="82" rx="9" fill="#2d2d42"/>
  <rect x="106" y="272" width="20" height="82" rx="9" fill="#2d2d42"/>
  <ellipse cx="84" cy="356" rx="16" ry="9" fill="#1e1e2e"/>
  <ellipse cx="116" cy="356" rx="16" ry="9" fill="#1e1e2e"/>
  <path d="M62 188 Q58 230 56 275 L144 275 Q142 230 138 188 Z" fill="#eef2ff"/>
  <path d="M88 170 L100 208 L112 170 Q106 176 100 174 Q94 176 88 170Z" fill="#e85a6a"/>
  <path d="M62 188 Q58 230 56 275 L82 275 L82 182Z" fill="#3a4778"/>
  <path d="M118 182 L118 275 L144 275 Q142 230 138 188Z" fill="#3a4778"/>
  <path d="M62 196 Q38 210 32 260 Q40 266 46 262 Q50 220 66 206Z" fill="#3a4778"/>
  <path d="M138 196 Q162 210 168 260 Q160 266 154 262 Q150 220 134 206Z" fill="#3a4778"/>
  <ellipse cx="38" cy="265" rx="11" ry="9" fill="#ffd5b4"/>
  <ellipse cx="162" cy="265" rx="11" ry="9" fill="#ffd5b4"/>
  <circle cx="100" cy="216" r="2.5" fill="#2a3560"/>
  <circle cx="100" cy="236" r="2.5" fill="#2a3560"/>
  <circle cx="100" cy="256" r="2.5" fill="#2a3560"/>
  <path d="M82 175 L88 170 L100 176 L112 170 L118 175 L118 183 L100 189 L82 183Z" fill="#eef2ff"/>
  <rect x="88" y="158" width="24" height="23" rx="8" fill="#ffd5b4"/>
  <ellipse cx="100" cy="110" rx="52" ry="55" fill="#ffd5b4"/>
  <ellipse cx="100" cy="75" rx="55" ry="42" fill="#2a1f1f"/>
  <path d="M48 82 Q44 100 46 142 Q52 147 58 142 Q55 106 55 85Z" fill="#2a1f1f"/>
  <path d="M152 82 Q156 100 154 142 Q148 147 142 142 Q145 106 145 85Z" fill="#2a1f1f"/>
  <path d="M52 88 Q58 54 100 51 Q142 54 148 88 Q138 64 100 62 Q62 64 52 88Z" fill="#2a1f1f"/>
  <path d="M73 100 Q83 95 93 100" stroke="#1a0f0f" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M107 100 Q117 95 127 100" stroke="#1a0f0f" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  ${eyes[e] || eyes.neutral}
  <circle cx="100" cy="129" r="2.5" fill="#e8a07a"/>
  ${blush}
  ${mouths[e] || mouths.neutral}
</svg>`;
}

// ============================================================
// STORY
// ============================================================
const SCENES = [
  {
    bg: 'rain', expr: 'neutral',
    narration: '放課後。気づけば空が暗くなっていた。\n傘を持っていないことに、今さら気づく。',
    speaker: '凪', text: '...傘、持ってないの。\nよかったら、使って',
    choices: [
      { label: 'ありがとうございます！助かります',
        res: '...そう', resExpr: 'cold',
        d: { 安心度:2, 理解度:1 } },
      { label: '...一緒に入っても、いいですか？',
        res: '別に\n*少し、傘を傾けた*', resExpr: 'soft',
        d: { 安心度:5, 崩壊危険値:-2, 依存度:1 } },
      { label: '急に声かけないでください',
        res: '...そう\n*静かに、傘を戻した*', resExpr: 'cold',
        d: { 拒絶度:8, 崩壊危険値:6 } },
    ],
  },
  {
    bg: 'classroom', expr: 'neutral',
    narration: '翌日。教室に入ると、窓際の席に昨日の人がいた。',
    speaker: '凪', text: '...昨日の',
    choices: [
      { label: '昨日はありがとうございました！',
        res: '...別に。困ってそうだったから', resExpr: 'cold',
        d: { 安心度:2, 理解度:1 } },
      { label: '（黙って、会釈する）',
        res: '...\n*少し、こちらを見た*', resExpr: 'soft',
        d: { 安心度:5, 崩壊危険値:-3 } },
      { label: '隣の席、空いてますか？',
        res: '...好きにすれば', resExpr: 'neutral',
        d: { 崩壊危険値:3, 安心度:1 } },
    ],
  },
  {
    bg: 'classroom', expr: 'neutral',
    narration: null,
    speaker: '凪', text: '（小声で）\n...消しゴム、ある？',
    choices: [
      { label: 'あります！どうぞ！（大きい声で）',
        res: '...声、でかい', resExpr: 'cold',
        d: { 崩壊危険値:4, 安心度:-1 } },
      { label: '（黙って、そっと差し出す）',
        res: '...ありがと\n*小さく、口角が上がった*', resExpr: 'soft',
        d: { 安心度:6, 自己開示率:2, 崩壊危険値:-2 } },
      { label: '半分ずつ使いますか？',
        res: 'は？...いい\n*でも口元が少し動いた*', resExpr: 'neutral',
        d: { 理解度:3, 安心度:1 } },
    ],
  },
  {
    bg: 'rooftop', expr: 'neutral',
    narration: '昼休み。屋上に来ると、凪が一人でいた。',
    speaker: '凪', text: '...なに',
    choices: [
      { label: '一緒に食べてもいいですか？',
        res: '...勝手にすれば', resExpr: 'neutral',
        d: { 崩壊危険値:4, 安心度:1 } },
      { label: '邪魔でしたか（去ろうとする）',
        res: '...別に、邪魔じゃない\n*小声で言った*', resExpr: 'soft',
        d: { 安心度:6, 自己開示率:2 } },
      { label: '（並んで、景色を見る）',
        res: '...まあ\n*少し、間があった*', resExpr: 'neutral',
        d: { 安心度:5, 崩壊危険値:-2 } },
    ],
  },
  {
    bg: 'hallway', expr: 'neutral',
    narration: '放課後の廊下。\n凪が窓際で一人、本を読んでいた。',
    speaker: '凪', text: '...あ',
    choices: [
      { label: '何読んでるんですか？',
        res: '...別に、ただの本\n*少し、本を閉じた*', resExpr: 'cold',
        d: { 理解度:4, 崩壊危険値:2 } },
      { label: 'ごめん、邪魔したね（立ち去る）',
        res: '...待って\n*小声だった*', resExpr: 'soft',
        d: { 安心度:5, 自己開示率:3, 崩壊危険値:-3 } },
      { label: '（隣に、静かに座る）',
        res: '...\n*しばらく、二人で黙っていた*', resExpr: 'soft',
        d: { 安心度:8, 崩壊危険値:-4, 自己開示率:2 } },
    ],
  },
  {
    bg: 'classroom', expr: 'cold',
    narration: 'ある日、凪がずっと窓の外を見ていた。\nいつもより少し、遠い目をしていた。',
    speaker: '凪', text: '...別に、何でもない',
    choices: [
      { label: 'どうしたんですか？何かあったの？',
        res: '何でもないって言った', resExpr: 'cold',
        d: { 崩壊危険値:8, 拒絶度:3 } },
      { label: '（何も言わず、隣に座る）',
        res: '...\n*少し、肩の力が抜けた*', resExpr: 'soft',
        d: { 安心度:7, 自己開示率:4, 崩壊危険値:-4 } },
      { label: '分かるよ、つらいよね',
        res: '分からないでしょ\n*冷たく言った*', resExpr: 'cold',
        d: { 崩壊危険値:9, 拒絶度:4, 安心度:-3 } },
    ],
  },
  {
    bg: 'night', expr: 'neutral',
    narration: '深夜。スマホに通知が来た。\n凪からだった。',
    speaker: '凪', text: '起きてる？',
    choices: [
      { label: '起きてます！何かありましたか？',
        res: '...別に、確認しただけ', resExpr: 'cold',
        d: { 安心度:1, 崩壊危険値:1 } },
      { label: 'うん。どうした？',
        res: '...眠れなくて\n（しばらく後）別に、何でもない', resExpr: 'soft',
        d: { 安心度:6, 自己開示率:4, 崩壊危険値:-3, 依存度:2 } },
      { label: '（すぐには返信しない）',
        res: '...ごめん、変な時間に', resExpr: 'neutral',
        d: { 崩壊危険値:2, 安心度:2 } },
    ],
  },
  {
    bg: 'park', expr: 'neutral',
    narration: '休日、公園で偶然会った。\n凪は少し驚いた様子だった。',
    speaker: '凪', text: '...なんで私のそばにいるの',
    choices: [
      { label: '一緒にいたいから',
        res: '...それ、困る', resExpr: 'cold',
        d: { 崩壊危険値:8, 依存度:2 } },
      { label: 'なんとなく、かな',
        res: '...そっか\n*少し、間があった*', resExpr: 'neutral',
        d: { 安心度:4, 理解度:5 } },
      { label: '（何も言わず、隣を歩く）',
        res: '...\n*そのまま、二人で歩いた*', resExpr: 'soft',
        d: { 安心度:7, 自己開示率:3, 崩壊危険値:-4 } },
    ],
  },
  {
    bg: 'evening', expr: 'cold',
    narration: '夕暮れの屋上。\n凪がぼんやりと空を見ていた。',
    speaker: '凪', text: '...ここから落ちたら、楽になれるのかな\n（こちらを見る）冗談だよ',
    choices: [
      { label: 'そんなこと言わないで！',
        res: '...大げさ', resExpr: 'cold',
        d: { 崩壊危険値:8, 拒絶度:3 } },
      { label: '（黙って、隣に立つ）',
        res: '...何も言わないの\n*少し、笑った気がした*', resExpr: 'soft',
        d: { 安心度:9, 自己開示率:5, 崩壊危険値:-6 } },
      { label: '楽になりたいって思ってるの？',
        res: '...うるさい\n*でも、逃げなかった*', resExpr: 'cold',
        d: { 崩壊危険値:5, 理解度:3 } },
    ],
  },
  {
    bg: 'spring', expr: 'neutral',
    narration: '季節が変わった。\n凪との関係も、少しだけ変わった気がする。',
    speaker: '凪', text: '...（こちらを見る）',
    choices: [
      { label: '（静かに、隣に立つ）',
        res: '...壊れないかもしれない\n*小さく、呟いた*', resExpr: 'soft',
        d: { 安心度:5, 自己開示率:5, 崩壊危険値:-5 } },
      { label: '凪のこと、もっと知りたい',
        res: '...そういうの、怖い\nでも、まあ', resExpr: 'neutral',
        d: { 理解度:4, 崩壊危険値:3, 自己開示率:3 } },
      { label: '今日も一緒にいていい？',
        res: '...別に\n*でも、少し微笑んだ気がした*', resExpr: 'soft',
        d: { 安心度:4, 依存度:2 } },
    ],
  },
];

// ============================================================
// ENDINGS
// ============================================================
const ENDINGS = {
  best_end: {
    cls:'ending-best', tag:'BEST END', expr:'soft',
    text:'凪は、初めて笑った。\n\nそれは本当に小さな変化で、\n気づかない人には気づかないくらいの。\n\nでも、あなたには見えた。\n\n「...壊れないかもしれない」\n\n隣にいても壊れないかもしれないと、\n凪は初めて、そう思えた。',
  },
  good_end: {
    cls:'ending-good', tag:'GOOD END', expr:'neutral',
    text:'凪との距離は、まだ遠い。\n\nでも以前より、少しだけ近くなった。\n\n「...また来る？」\n\nそれが、凪の精一杯だった。',
  },
  normal_end: {
    cls:'ending-normal', tag:'END', expr:'neutral',
    text:'凪は今日も、一人でいる。\n\nあなたのことが嫌いなわけじゃない。\nただ、うまく距離が縮められなかった。\n\nそれだけの話。',
  },
  bad_collapse: {
    cls:'ending-bad', tag:'BAD END', expr:'cold',
    text:'「大丈夫」\n\n凪の口癖が、増えていった。\n\nある日、凪は来なくなった。\n「大丈夫」と言ったまま、静かに消えた。',
  },
  bad_rejection: {
    cls:'ending-bad', tag:'BAD END', expr:'cold',
    text:'凪は、笑わなくなった。\n\nあなたを見る目が、どんどん遠くなった。\n\nそしてある日、席が空になっていた。',
  },
};

function getEnding(metrics, sceneIdx) {
  const m = metrics;
  if (m.崩壊危険値 >= 80) return 'bad_collapse';
  if (m.拒絶度 >= 80) return 'bad_rejection';
  if (sceneIdx >= SCENES.length) {
    if (m.安心度 >= 52 && m.自己開示率 >= 42 && m.崩壊危険値 <= 45) return 'best_end';
    if (m.安心度 >= 32 && m.崩壊危険値 <= 65) return 'good_end';
    return 'normal_end';
  }
  return null;
}

// ============================================================
// GAME STATE
// ============================================================
class GameState {
  constructor() { this.load(); }

  load() {
    try {
      const d = JSON.parse(localStorage.getItem('nagi_vn1') || 'null');
      this.metrics     = d?.metrics     ? { ...INITIAL_METRICS, ...d.metrics } : { ...INITIAL_METRICS };
      this.phase       = d?.phase       ?? 'setup';
      this.sceneIndex  = d?.sceneIndex  ?? 0;
      this.endingType  = d?.endingType  ?? null;
    } catch { this.reset(); }
  }

  save() {
    localStorage.setItem('nagi_vn1', JSON.stringify({
      metrics: this.metrics, phase: this.phase,
      sceneIndex: this.sceneIndex, endingType: this.endingType,
    }));
  }

  reset() {
    this.metrics    = { ...INITIAL_METRICS };
    this.phase      = 'setup';
    this.sceneIndex = 0;
    this.endingType = null;
    localStorage.removeItem('nagi_vn1');
  }

  applyDelta(d) {
    if (!d) return;
    for (const k of Object.keys(INITIAL_METRICS)) {
      if (typeof d[k] === 'number')
        this.metrics[k] = Math.max(0, Math.min(100, this.metrics[k] + d[k]));
    }
  }
}

// ============================================================
// HELPERS
// ============================================================
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function fmtText(s) {
  return esc(s)
    .replace(/\*([^*\n]+)\*/g,'<em>$1</em>')
    .replace(/\n/g,'<br>');
}

// Typewriter effect — skipRef.val = true to instantly complete
async function typewrite(el, text, speed, skipRef) {
  let cur = '';
  el.innerHTML = '';
  for (const ch of text) {
    if (skipRef?.val) break;
    cur += ch;
    el.innerHTML = fmtText(cur);
    await sleep(speed);
  }
  el.innerHTML = fmtText(text);
}

// ============================================================
// APP
// ============================================================
class App {
  constructor() {
    this.state  = new GameState();
    this.root   = document.getElementById('app');
    this.busy   = false;
    this.phase  = null;
    this._skip  = { val: false }; // set to true mid-type to show full text instantly
  }

  start() {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
    this.render();
  }

  render() {
    if (this.state.phase === 'setup')   this._renderSetup();
    else if (this.state.phase === 'game')   this._renderScene();
    else if (this.state.phase === 'ending') this._renderEnding();
  }

  // ── SETUP ────────────────────────────────────────
  _renderSetup() {
    const hasSave = this.state.sceneIndex > 0;
    this.root.innerHTML = `
<div class="setup-screen">
  <div class="setup-wrap">
    <div class="setup-logo">凪</div>
    <div class="setup-tagline">完全には理解できない存在へ近づく物語</div>
    <div class="setup-card">
      これは「攻略」ではない。<br>
      ただ、隣にいようとするだけの話。
    </div>
    <button id="start-btn" class="btn-start">はじめる</button>
    ${hasSave ? '<button id="cont-btn" class="btn-cont">続きから</button>' : ''}
  </div>
</div>`;
    document.getElementById('start-btn').addEventListener('click', () => this._newGame());
    document.getElementById('cont-btn')?.addEventListener('click', () => {
      this.state.phase = 'game';
      this.state.save();
      this._renderScene();
    });
  }

  _newGame() {
    this.state.reset();
    this.state.phase = 'game';
    this.state.sceneIndex = 0;
    this.state.save();
    this._renderScene();
  }

  // ── SCENE ────────────────────────────────────────
  _renderScene() {
    const si = this.state.sceneIndex;
    if (si >= SCENES.length) { this._triggerEnding(); return; }
    const scene = SCENES[si];

    this.root.innerHTML = `
<div class="vn-screen scene-fade">
  <div class="scene-bg bg-${scene.bg}" id="scene-bg">
    <div class="char-area" id="char-area">${charSVG(scene.expr)}</div>
    <div class="vn-hud">
      <div class="scene-label">SCENE ${si + 1} / ${SCENES.length}</div>
      <button class="btn-menu" id="menu-btn">メニュー</button>
    </div>
  </div>

  <div class="choices-area hidden" id="choices-area"></div>

  <div class="textbox" id="textbox">
    <div class="tb-name narrator" id="tb-name">ナレーション</div>
    <div class="tb-text" id="tb-text"></div>
    <div class="tb-continue" id="tb-cont">タップして続ける ▼</div>
  </div>
</div>`;

    document.getElementById('menu-btn').addEventListener('click', () => this._showMenu());
    document.getElementById('tb-cont').addEventListener('click', () => this._onTap());
    document.getElementById('scene-bg').addEventListener('click', (e) => {
      if (!e.target.closest('.choice-btn') && !e.target.closest('.btn-menu')) {
        this._onTap();
      }
    });
    document.getElementById('textbox').addEventListener('click', (e) => {
      if (!e.target.closest('.tb-continue')) this._onTap();
    });

    this._step = 0;
    this._scene = scene;
    this._phase = scene.narration ? 'narration' : 'dialogue';
    this._runStep();
  }

  async _runStep() {
    if (this.busy) return;
    this.busy = true;

    const tbName = document.getElementById('tb-name');
    const tbText = document.getElementById('tb-text');
    const tbCont = document.getElementById('tb-cont');

    if (this._phase === 'narration') {
      tbName.textContent = 'ナレーション';
      tbName.className = 'tb-name narrator';
      tbCont.classList.add('hidden');
      this._skip.val = false;
      await typewrite(tbText, this._scene.narration, 60, this._skip);
      this._skip.val = false;
      tbCont.classList.remove('hidden');
      this._phase = 'dialogue';
    } else if (this._phase === 'dialogue') {
      tbName.textContent = this._scene.speaker;
      tbName.className = 'tb-name';
      tbCont.classList.add('hidden');
      this._skip.val = false;
      await typewrite(tbText, this._scene.text, 70, this._skip);
      this._skip.val = false;
      tbCont.classList.add('hidden');
      this._phase = 'choices';
      this._showChoices();
    }

    this.busy = false;
  }

  _showChoices() {
    const area = document.getElementById('choices-area');
    const tbCont = document.getElementById('tb-cont');
    if (!area) return;
    tbCont.classList.add('hidden');
    area.innerHTML = this._scene.choices.map((c, i) =>
      `<button class="choice-btn" data-i="${i}">${esc(c.label)}</button>`
    ).join('');
    area.classList.remove('hidden');
    area.querySelectorAll('.choice-btn').forEach(btn => {
      btn.addEventListener('click', () => this._pickChoice(+btn.dataset.i));
    });
  }

  async _pickChoice(i) {
    if (this.busy) return;
    this.busy = true;

    const choice = this._scene.choices[i];

    // Highlight selected
    document.querySelectorAll('.choice-btn').forEach((b, idx) => {
      if (idx === i) b.classList.add('selected');
    });
    await sleep(300);

    // Hide choices
    const area = document.getElementById('choices-area');
    if (area) area.classList.add('hidden');

    // Apply metrics
    this.state.applyDelta(choice.d);

    // Check for early bad end
    const early = getEnding(this.state.metrics, this.state.sceneIndex);
    if (early && (early === 'bad_collapse' || early === 'bad_rejection')) {
      this.state.endingType = early;
      this.state.phase = 'ending';
      this.state.save();
      await sleep(600);
      this._renderEnding();
      this.busy = false;
      return;
    }

    // Show character response
    const charArea = document.getElementById('char-area');
    if (charArea) charArea.innerHTML = charSVG(choice.resExpr);

    const tbName = document.getElementById('tb-name');
    const tbText = document.getElementById('tb-text');
    const tbCont = document.getElementById('tb-cont');
    if (tbName) { tbName.textContent = '凪'; tbName.className = 'tb-name'; }
    if (tbCont) tbCont.classList.add('hidden');

    await sleep(400);
    if (tbText) {
      this._skip.val = false;
      await typewrite(tbText, choice.res, 65, this._skip);
      this._skip.val = false;
    }
    if (tbCont) { tbCont.textContent = '次へ ▶'; tbCont.classList.remove('hidden'); }

    this._phase = 'next';
    this.busy = false;
  }

  _onTap() {
    // If currently typing → skip to full text
    if (this.busy) {
      this._skip.val = true;
      return;
    }
    if (this._phase === 'narration' || this._phase === 'dialogue') {
      this._runStep();
    } else if (this._phase === 'next') {
      this._nextScene();
    }
  }

  _nextScene() {
    this.state.sceneIndex++;
    const ending = getEnding(this.state.metrics, this.state.sceneIndex);
    if (ending) {
      this.state.endingType = ending;
      this.state.phase = 'ending';
      this.state.save();
      this._renderEnding();
    } else {
      this.state.save();
      this._renderScene();
    }
  }

  _triggerEnding() {
    const ending = getEnding(this.state.metrics, this.state.sceneIndex) || 'normal_end';
    this.state.endingType = ending;
    this.state.phase = 'ending';
    this.state.save();
    this._renderEnding();
  }

  // ── ENDING ───────────────────────────────────────
  _renderEnding() {
    const e = ENDINGS[this.state.endingType] ?? ENDINGS.normal_end;
    const m = this.state.metrics;
    this.root.innerHTML = `
<div class="ending-screen ${e.cls}">
  <div class="ending-wrap">
    <div class="ending-tag">${e.tag}</div>
    <div class="ending-char">${charSVG(e.expr)}</div>
    <div class="ending-text">${esc(e.text).replace(/\n/g,'<br>')}</div>
    <div class="ending-metrics">
      ${Object.entries(m).map(([k,v]) =>
        `<div class="em-item">
          <div class="em-dot" style="background:${M_COLORS[k]}"></div>
          ${k} ${v}
        </div>`
      ).join('')}
    </div>
    <button id="restart-btn" class="btn-start" style="margin-top:.5rem">もう一度</button>
  </div>
</div>`;
    document.getElementById('restart-btn').addEventListener('click', () => {
      this.state.reset();
      this.render();
    });
  }

  // ── MENU ─────────────────────────────────────────
  _showMenu() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `position:fixed;inset:0;background:rgba(60,20,60,.7);backdrop-filter:blur(6px);z-index:100;display:flex;align-items:center;justify-content:center;`;
    overlay.innerHTML = `
<div style="background:#fff;border-radius:20px;padding:1.8rem 2rem;min-width:240px;text-align:center;display:flex;flex-direction:column;gap:.9rem;">
  <div style="font-size:1rem;font-weight:600;color:#3a2040;letter-spacing:.05em">メニュー</div>
  <button id="close-menu" style="padding:.7rem 1.5rem;background:#fce4ec;border:1.5px solid #f06292;border-radius:50px;color:#e91e8a;font-size:.9rem;cursor:pointer;">閉じる</button>
  <button id="restart-m" style="padding:.7rem 1.5rem;background:transparent;border:1.5px solid #ccc;border-radius:50px;color:#888;font-size:.9rem;cursor:pointer;">最初から</button>
</div>`;
    document.body.appendChild(overlay);
    document.getElementById('close-menu').addEventListener('click', () => overlay.remove());
    document.getElementById('restart-m').addEventListener('click', () => {
      overlay.remove();
      if (confirm('最初からやり直しますか？')) {
        this.state.reset();
        this.busy = false;
        this.render();
      }
    });
  }
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  window._app = new App();
  window._app.start();
});
