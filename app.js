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
// CHARACTER IMAGE  (えいと — chara.png を使用)
// ============================================================
function charSVG(expr) {
  const e = expr || 'neutral';
  const filters = {
    neutral: 'saturate(0.88) brightness(0.97)',
    cold:    'saturate(0.45) brightness(0.86) hue-rotate(5deg)',
    soft:    'saturate(1.08) brightness(1.02)',
  };
  return `<img src="chara.png" class="chara-img" alt="えいと"
    style="filter:${filters[e] || filters.neutral}"/>`;
}

// ============================================================
// STORY  (社会人1年目のえいと × 別会社の主人公)
// ============================================================
const SCENES = [
  {
    bg: 'evening', expr: 'neutral',
    narration: '共通の友人の飲み会。\nにぎやかな席の端に、ひとり座っている人がいた。',
    speaker: 'えいと', text: '...（視線が合う）',
    choices: [
      { label: '（隣に座る）',
        res: '...勝手にすれば\n*少し、椅子をずらした*', resExpr: 'cold',
        d: { 安心度:3, 理解度:2 } },
      { label: '乾杯しませんか？',
        res: '...まあ\n*グラスを軽く合わせた*', resExpr: 'soft',
        d: { 安心度:5, 崩壊危険値:-2 } },
      { label: '（向かいに座って、別の会話をする）',
        res: '...*気づいたら、こちらを見ていた*', resExpr: 'cold',
        d: { 理解度:2, 崩壊危険値:2 } },
    ],
  },
  {
    bg: 'night', expr: 'neutral',
    narration: '飲み会の帰り道。\nホームで待っていると、えいとが来た。',
    speaker: 'えいと', text: '...（気づいているが、何も言わない）',
    choices: [
      { label: '（隣に並ぶ）',
        res: '偶然だな\n*短く言った*', resExpr: 'neutral',
        d: { 安心度:4, 理解度:1 } },
      { label: '（向こうが話すまで待つ）',
        res: '...乗り換え、どこ\n*小声だった*', resExpr: 'soft',
        d: { 安心度:6, 崩壊危険値:-3 } },
      { label: '同じ方向ですか？（明るく）',
        res: '...みたいだな\n*窓の外を向いた*', resExpr: 'cold',
        d: { 安心度:2, 崩壊危険値:2 } },
    ],
  },
  {
    bg: 'hallway', expr: 'neutral',
    narration: '週末のカフェ。\nまたえいとがいた。',
    speaker: 'えいと', text: '...また会ったな',
    choices: [
      { label: '縁がありますね（笑顔で）',
        res: '...そういうの信じない\n*でも少し、口元が動いた*', resExpr: 'neutral',
        d: { 理解度:3, 安心度:2 } },
      { label: '（黙って、向かいに座る）',
        res: '...\n*なぜか、追い払わなかった*', resExpr: 'soft',
        d: { 安心度:5, 崩壊危険値:-2 } },
      { label: '奇遇ですね！（大きい声で）',
        res: '...うるさい\n*耳を塞ぐ仕草をした*', resExpr: 'cold',
        d: { 崩壊危険値:4, 安心度:-1 } },
    ],
  },
  {
    bg: 'classroom', expr: 'neutral',
    narration: '次に会った時、えいとの表情が少し固かった。',
    speaker: 'えいと', text: '仕事、どう。\n（急に聞いてくる）',
    choices: [
      { label: 'えいとは？（聞き返す）',
        res: '...別に\n*でも少し、間があった*', resExpr: 'soft',
        d: { 安心度:5, 自己開示率:2 } },
      { label: '大変だけど頑張ってます！',
        res: '...そっか\n*どこか遠い目をした*', resExpr: 'neutral',
        d: { 安心度:3, 理解度:2 } },
      { label: '普通かな。えいとこそ大丈夫？',
        res: '...関係ない\n*視線を逸らした*', resExpr: 'cold',
        d: { 崩壊危険値:4, 拒絶度:2 } },
    ],
  },
  {
    bg: 'park', expr: 'neutral',
    narration: '休日の公園。\n珍しく、えいとが先に声をかけてきた。',
    speaker: 'えいと', text: '...なんでここにいるの',
    choices: [
      { label: 'えいとこそ（笑）',
        res: '...散歩\n*それ以上は言わなかった*', resExpr: 'neutral',
        d: { 安心度:4, 理解度:3 } },
      { label: '（何も言わず、隣に並ぶ）',
        res: '...*しばらく、二人で歩いた*', resExpr: 'soft',
        d: { 安心度:7, 崩壊危険値:-3 } },
      { label: '偶然です！びっくりした',
        res: '...そう\n*少し、前を向いた*', resExpr: 'cold',
        d: { 崩壊危険値:2 } },
    ],
  },
  {
    bg: 'classroom', expr: 'cold',
    narration: 'ある日、えいとの様子がおかしかった。\n目の下に隈があった。',
    speaker: 'えいと', text: '...別に、何でもない',
    choices: [
      { label: '顔色悪いよ',
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
        res: '...別に、確認しただけ\n*返信が来なくなった*', resExpr: 'cold',
        d: { 安心度:1, 崩壊危険値:1 } },
    ],
  },
  {
    bg: 'rain', expr: 'neutral',
    narration: '急な雨。\n軒下にえいとがいた。',
    speaker: 'えいと', text: '...（こちらに気づく）',
    choices: [
      { label: '（黙って、隣に入る）',
        res: '...狭い\n*でもずれなかった*', resExpr: 'soft',
        d: { 安心度:6, 自己開示率:2, 崩壊危険値:-3 } },
      { label: '傘、一緒に入りますか？',
        res: '...別にいい\n*でも一緒に歩き始めた*', resExpr: 'neutral',
        d: { 安心度:4, 理解度:2 } },
      { label: '（先に走り去る）',
        res: '...*ずっと雨の中に立っていた*', resExpr: 'cold',
        d: { 崩壊危険値:3 } },
    ],
  },
  {
    bg: 'evening', expr: 'cold',
    narration: '仕事終わり。\nビルの屋上でえいとが空を見ていた。',
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
    narration: '桜の季節。\nえいととの関係は、少しだけ変わった気がする。',
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
    text:'えいとが、笑った。\n\nそれは本当に小さな変化で、\n気づかない人には気づかないくらいの。\n\nでも、あなたには見えた。\n\n「...壊れないかもしれない」\n\n隣にいても壊れないかもしれないと、\nえいとは初めてそう思えた。',
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
    text:'えいとは、笑わなくなった。\n\nあなたを見る目がどんどん遠くなった。\n\nそしてある日、連絡が途絶えた。',
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
      const d = JSON.parse(localStorage.getItem('eito_vn1') || 'null');
      this.metrics     = d?.metrics     ? { ...INITIAL_METRICS, ...d.metrics } : { ...INITIAL_METRICS };
      this.phase       = d?.phase       ?? 'setup';
      this.sceneIndex  = d?.sceneIndex  ?? 0;
      this.endingType  = d?.endingType  ?? null;
    } catch { this.reset(); }
  }

  save() {
    localStorage.setItem('eito_vn1', JSON.stringify({
      metrics: this.metrics, phase: this.phase,
      sceneIndex: this.sceneIndex, endingType: this.endingType,
    }));
  }

  reset() {
    this.metrics    = { ...INITIAL_METRICS };
    this.phase      = 'setup';
    this.sceneIndex = 0;
    this.endingType = null;
    localStorage.removeItem('eito_vn1');
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
    this._skip  = { val: false };
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

    document.querySelectorAll('.choice-btn').forEach((b, idx) => {
      if (idx === i) b.classList.add('selected');
    });
    await sleep(300);

    const area = document.getElementById('choices-area');
    if (area) area.classList.add('hidden');

    this.state.applyDelta(choice.d);

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
