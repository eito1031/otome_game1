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
// CHARACTER SVG  (えいと — 22歳・男)
// ============================================================
function charSVG(expr) {
  const eyes = {
    neutral: `<ellipse cx="84" cy="118" rx="10" ry="9.5" fill="#4a5a8a"/>
      <circle cx="87" cy="114" r="3.5" fill="white"/>
      <ellipse cx="116" cy="118" rx="10" ry="9.5" fill="#4a5a8a"/>
      <circle cx="119" cy="114" r="3.5" fill="white"/>`,
    cold: `<ellipse cx="84" cy="117" rx="10" ry="7" fill="#4a5a8a"/>
      <circle cx="87" cy="114" r="3" fill="white"/>
      <ellipse cx="116" cy="117" rx="10" ry="7" fill="#4a5a8a"/>
      <circle cx="119" cy="114" r="3" fill="white"/>`,
    soft: `<ellipse cx="84" cy="120" rx="10" ry="10" fill="#5a6a9a"/>
      <circle cx="87" cy="116" r="4" fill="white"/>
      <ellipse cx="116" cy="120" rx="10" ry="10" fill="#5a6a9a"/>
      <circle cx="119" cy="116" r="4" fill="white"/>`,
  };
  const mouths = {
    neutral: `<path d="M90 140 Q100 143 110 140" stroke="#d4886a" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
    cold:    `<path d="M90 142 Q100 139 110 142" stroke="#d4886a" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
    soft:    `<path d="M90 138 Q100 146 110 138" stroke="#d4886a" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  };
  const e = expr || 'neutral';
  const blush = e === 'soft'
    ? `<ellipse cx="72" cy="128" rx="11" ry="7" fill="rgba(255,120,140,.22)"/>
       <ellipse cx="128" cy="128" rx="11" ry="7" fill="rgba(255,120,140,.22)"/>`
    : '';

  return `<svg viewBox="0 0 200 380" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="100" cy="377" rx="54" ry="7" fill="rgba(0,0,0,.08)"/>
  <rect x="72" y="272" width="22" height="88" rx="9" fill="#2e3d5e"/>
  <rect x="106" y="272" width="22" height="88" rx="9" fill="#2e3d5e"/>
  <ellipse cx="83" cy="360" rx="19" ry="9" fill="#2a2a2e"/>
  <ellipse cx="117" cy="360" rx="19" ry="9" fill="#2a2a2e"/>
  <path d="M58 190 Q54 234 52 276 L148 276 Q146 234 142 190 Z" fill="#7a8090"/>
  <path d="M58 197 Q32 216 28 270 Q40 274 46 270 Q46 228 63 209Z" fill="#7a8090"/>
  <path d="M142 197 Q168 216 172 270 Q160 274 154 270 Q154 228 137 209Z" fill="#7a8090"/>
  <ellipse cx="34" cy="273" rx="13" ry="9" fill="#ffd5b4"/>
  <ellipse cx="166" cy="273" rx="13" ry="9" fill="#ffd5b4"/>
  <path d="M72 238 Q100 244 128 238 L126 264 Q100 267 74 264 Z" fill="#686e7a"/>
  <path d="M76 185 Q100 198 124 185" stroke="#686e7a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <rect x="88" y="158" width="24" height="26" rx="8" fill="#ffd5b4"/>
  <ellipse cx="100" cy="110" rx="52" ry="55" fill="#ffd5b4"/>
  <ellipse cx="100" cy="72" rx="52" ry="38" fill="#1c1c1c"/>
  <path d="M50 85 Q46 102 48 138 Q54 142 60 138 Q57 107 56 88Z" fill="#1c1c1c"/>
  <path d="M150 85 Q154 102 152 138 Q146 142 140 138 Q143 107 144 88Z" fill="#1c1c1c"/>
  <path d="M50 90 Q57 53 100 51 Q143 53 150 90 Q138 62 100 60 Q62 62 50 90Z" fill="#1c1c1c"/>
  <path d="M82 57 Q87 42 93 56 Q88 48 82 57Z" fill="#1c1c1c"/>
  <path d="M97 50 Q104 34 110 50 Q105 42 97 50Z" fill="#1c1c1c"/>
  <path d="M114 55 Q121 42 126 57 Q120 48 114 55Z" fill="#1c1c1c"/>
  <path d="M68 97 Q80 92 94 97" stroke="#1c1c1c" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M106 97 Q120 92 132 97" stroke="#1c1c1c" stroke-width="4" fill="none" stroke-linecap="round"/>
  ${eyes[e] || eyes.neutral}
  <circle cx="100" cy="130" r="2.5" fill="#e8a07a"/>
  ${blush}
  ${mouths[e] || mouths.neutral}
</svg>`;
}

// ============================================================
// STORY  (大学・22歳のえいと)
// ============================================================
const SCENES = [
  {
    bg: 'park', expr: 'neutral',
    narration: '大学の中庭。\n風が強い日で、えいとのノートが飛んでいった。',
    speaker: 'えいと', text: '（舌打ちして、一人で拾い始める）',
    choices: [
      { label: '（黙って、一緒に拾う）',
        res: '...別に、一人でよかった\n*でも、受け取ってくれた*', resExpr: 'cold',
        d: { 安心度:3, 理解度:2 } },
      { label: '遠くに飛んだの、持ってきます',
        res: '...ああ\n*短く言って、目を逸らした*', resExpr: 'neutral',
        d: { 安心度:4, 理解度:1 } },
      { label: '大丈夫ですか？',
        res: '見ての通り\n*冷たく言った*', resExpr: 'cold',
        d: { 崩壊危険値:4, 拒絶度:2 } },
    ],
  },
  {
    bg: 'classroom', expr: 'neutral',
    narration: '翌週。ゼミに入ると、窓際にえいとがいた。',
    speaker: 'えいと', text: '...（一瞬、こちらを見た）',
    choices: [
      { label: '先週はありがとう（話しかける）',
        res: '...別に\n*すぐ目を逸らした*', resExpr: 'cold',
        d: { 安心度:2, 理解度:1 } },
      { label: '（目が合ったが、会釈だけ）',
        res: '...\n*少し、間があった*', resExpr: 'soft',
        d: { 安心度:5, 崩壊危険値:-2 } },
      { label: '隣いいですか？（席を指す）',
        res: '...好きにしろ\n*でも追い払わなかった*', resExpr: 'neutral',
        d: { 安心度:3, 崩壊危険値:2 } },
    ],
  },
  {
    bg: 'classroom', expr: 'neutral',
    narration: null,
    speaker: 'えいと', text: '（小声で）...ペン、ある？',
    choices: [
      { label: 'どうぞ（笑顔で渡す）',
        res: '...なんで笑ってんの\n*でも、受け取った*', resExpr: 'cold',
        d: { 安心度:2, 崩壊危険値:3 } },
      { label: '（黙って、そっと渡す）',
        res: '...ありがと\n*小さく、口角が動いた*', resExpr: 'soft',
        d: { 安心度:6, 自己開示率:2, 崩壊危険値:-2 } },
      { label: '後で返してね',
        res: '分かってる\n*短く言った*', resExpr: 'neutral',
        d: { 理解度:2, 安心度:2 } },
    ],
  },
  {
    bg: 'hallway', expr: 'neutral',
    narration: '混んだ学食。\n他に空席がなく、えいとの向かいに座るしかなかった。',
    speaker: 'えいと', text: '...（こちらを見て、何も言わない）',
    choices: [
      { label: '向かい、いいですか？',
        res: '...まあ\n*また食べ始めた*', resExpr: 'neutral',
        d: { 安心度:3, 理解度:2 } },
      { label: '（何も言わず座る）',
        res: '...*じろっと見たが、何も言わなかった*', resExpr: 'soft',
        d: { 安心度:5, 崩壊危険値:-2 } },
      { label: '（空席を探して立ち去る）',
        res: '...*なぜか、ちらっと見た*', resExpr: 'cold',
        d: { 崩壊危険値:2 } },
    ],
  },
  {
    bg: 'evening', expr: 'neutral',
    narration: '授業後、駅に向かっていると\nえいとが同じ方向を歩いていた。',
    speaker: 'えいと', text: '...（気づいている、でも何も言わない）',
    choices: [
      { label: '（隣に並ぶ）',
        res: '...なんで一緒に歩いてる\n*でも立ち止まらなかった*', resExpr: 'neutral',
        d: { 安心度:4, 理解度:3 } },
      { label: '（少し後ろから、同じ方向へ）',
        res: '...*ペースが合った*', resExpr: 'soft',
        d: { 安心度:6, 崩壊危険値:-3 } },
      { label: '（先を歩く）',
        res: '...*少し後ろから視線を感じた*', resExpr: 'cold',
        d: { 崩壊危険値:2 } },
    ],
  },
  {
    bg: 'classroom', expr: 'cold',
    narration: 'ある日、えいとがずっと窓の外を見ていた。\nいつもより少し、遠い目をしていた。',
    speaker: 'えいと', text: '...別に、何でもない',
    choices: [
      { label: 'どうしたの、顔色悪い',
        res: '余計なこと言うな\n*視線を逸らした*', resExpr: 'cold',
        d: { 崩壊危険値:8, 拒絶度:3 } },
      { label: '（何も言わず、隣にいる）',
        res: '...\n*少し、肩の力が抜けた*', resExpr: 'soft',
        d: { 安心度:7, 自己開示率:4, 崩壊危険値:-4 } },
      { label: 'しんどそうだね',
        res: 'うるさい\n*でも、逃げなかった*', resExpr: 'cold',
        d: { 崩壊危険値:9, 拒絶度:4, 安心度:-3 } },
    ],
  },
  {
    bg: 'night', expr: 'neutral',
    narration: '夜中の2時。スマホが鳴った。\nえいとからだった。',
    speaker: 'えいと', text: '起きてる？',
    choices: [
      { label: 'うん。どうした？',
        res: '...眠れなくて\n（しばらく後）でもいい、忘れて', resExpr: 'soft',
        d: { 安心度:6, 自己開示率:4, 崩壊危険値:-3, 依存度:2 } },
      { label: '（少し待ってから）起きてるよ',
        res: '...ごめん、こんな時間に\n*短く言った*', resExpr: 'neutral',
        d: { 安心度:4, 崩壊危険値:-1 } },
      { label: '何かありましたか？！',
        res: '...別に、確認しただけ\n*すぐ既読になったのに返信がなかった*', resExpr: 'cold',
        d: { 安心度:1, 崩壊危険値:1 } },
    ],
  },
  {
    bg: 'hallway', expr: 'neutral',
    narration: '大学近くの本屋。\nたまたまえいとがいた。',
    speaker: 'えいと', text: '（少し驚いた顔で）...何読んでるの',
    choices: [
      { label: '（本を見せる）',
        res: 'そっちか\n*少し、ページをめくった*', resExpr: 'soft',
        d: { 安心度:5, 自己開示率:2 } },
      { label: 'えいとは？（棚を指す）',
        res: '...別に\n*本を閉じた*', resExpr: 'cold',
        d: { 理解度:3, 崩壊危険値:2 } },
      { label: 'こういうとこ来るんだ',
        res: '悪いか\n*でも少し、口角が動いた*', resExpr: 'neutral',
        d: { 理解度:4, 安心度:2 } },
    ],
  },
  {
    bg: 'evening', expr: 'cold',
    narration: '夕暮れの屋上。\nえいとがひとりで空を見ていた。',
    speaker: 'えいと', text: '...消えたら、楽になれるのかな\n（こちらを向いて）冗談だよ',
    choices: [
      { label: 'そんなこと言わないで',
        res: '...うるさい\n*でも逃げなかった*', resExpr: 'cold',
        d: { 崩壊危険値:8, 拒絶度:3 } },
      { label: '（黙って、隣に立つ）',
        res: '...何も言わないの\n*少し、笑った気がした*', resExpr: 'soft',
        d: { 安心度:9, 自己開示率:5, 崩壊危険値:-6 } },
      { label: '楽になりたいって思ってるの？',
        res: '...分からない、俺も\n*小声だった*', resExpr: 'cold',
        d: { 崩壊危険値:5, 理解度:3 } },
    ],
  },
  {
    bg: 'spring', expr: 'neutral',
    narration: '桜の季節が来た。\nえいととの関係も、少しだけ変わった気がする。',
    speaker: 'えいと', text: '...（こちらを見る）',
    choices: [
      { label: '（静かに、隣に立つ）',
        res: '...壊れないかもしれない\n*小さく、呟いた*', resExpr: 'soft',
        d: { 安心度:5, 自己開示率:5, 崩壊危険値:-5 } },
      { label: 'えいとのこと、もっと知りたい',
        res: '...そういうの、怖い\nまあ、でも\n*少し間があった*', resExpr: 'neutral',
        d: { 理解度:4, 崩壊危険値:3, 自己開示率:3 } },
      { label: '今日も一緒にいていい？',
        res: '...別に\n*でも少し、微笑んだ気がした*', resExpr: 'soft',
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
    text:'えいとが、笑った。\n\nそれは本当に小さな変化で、\n気づかない人には気づかないくらいの。\n\nでも、あなたには見えた。\n\n「...壊れないかもしれない」\n\n男の人があんな風に笑うの、初めて見た気がした。\n隣にいても壊れないかもしれないと、\nえいとは初めてそう思えた。',
  },
  good_end: {
    cls:'ending-good', tag:'GOOD END', expr:'neutral',
    text:'えいととの距離は、まだ遠い。\n\nでも以前より、少しだけ近くなった。\n\n「...また来る？」\n\n素直じゃないけれど、それがえいとの精一杯だった。',
  },
  normal_end: {
    cls:'ending-normal', tag:'END', expr:'neutral',
    text:'えいとは今日も、一人でいる。\n\nあなたのことが嫌いなわけじゃない。\nただ、うまく距離が縮められなかった。\n\nそれだけのこと。',
  },
  bad_collapse: {
    cls:'ending-bad', tag:'BAD END', expr:'cold',
    text:'「大丈夫」\n\nえいとの口癖が、増えていった。\n\nある日、えいとは来なくなった。\n「大丈夫」と言ったまま、静かに消えた。',
  },
  bad_rejection: {
    cls:'ending-bad', tag:'BAD END', expr:'cold',
    text:'えいとは、笑わなくなった。\n\nあなたを見る目がどんどん遠くなった。\n\nそしてある日、席が空になっていた。',
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
    <div class="setup-logo">えいと</div>
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
    if (tbName) { tbName.textContent = 'えいと'; tbName.className = 'tb-name'; }
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
