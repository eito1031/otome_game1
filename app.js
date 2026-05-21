'use strict';

// ============================================================
// METRICS
// ============================================================
const INITIAL_METRICS = {
  理解度: 5,
  安心度: 10,
  拒絶度: 30,
  依存度: 0,
  自己開示率: 5,
  崩壊危険値: 20,
};

const METRIC_COLORS = {
  理解度: '#5b7fd4',
  安心度: '#5bd490',
  拒絶度: '#d4a85b',
  依存度: '#bd5bd4',
  自己開示率: '#5bbdd4',
  崩壊危険値: '#d45b5b',
};

// ============================================================
// CHARACTER ENGINE
// ============================================================

function categorize(text) {
  if (!text || text.trim().replace(/[\s.…。、！？\-—]/g, '').length <= 1) return 'SILENT';
  const t = text;
  if (/好き|愛して|恋して|付き合って/.test(t)) return 'CONFESSION';
  if (/分かるよ|わかるよ|かわいそう|大変だった|つらいね|辛いね|大変だね|辛そう|同情/.test(t)) return 'EMPATHY_SHALLOW';
  if (/隣にい|一緒にい|ここにい|そばにい|傍にい|いるよ|一緒だよ/.test(t)) return 'PRESENT';
  if (/本当は|本音|気持ちを|どう思|何を感じ|なんで黙|話してよ|教えてよ|正直に|ちゃんと言/.test(t)) return 'PUSHES_IN';
  if (/行かなきゃ|帰る|さようなら|じゃあね|またね|バイバイ|もう行く|終わりにする/.test(t)) return 'LEAVING';
  return 'NEUTRAL';
}

function getMood(m) {
  if (m.崩壊危険値 >= 75) return 'CLOSED';
  if (m.崩壊危険値 >= 50 || m.拒絶度 >= 65) return 'GUARDED';
  if (m.自己開示率 >= 55 && m.安心度 >= 60 && m.崩壊危険値 < 30) return 'OPEN';
  if (m.安心度 >= 55 && m.崩壊危険値 < 40) return 'SOFT';
  return 'NEUTRAL';
}

const POOL = {
  CLOSED: {
    SILENT:          ['...', '*返信は来なかった*', '', '...'],
    PRESENT:         ['...', '*しばらく間があった*', '', '*既読になった*'],
    EMPATHY_SHALLOW: ['...', '', '*既読になった*', '...'],
    PUSHES_IN:       ['...', '大丈夫', '*返信は来なかった*', '...'],
    CONFESSION:      ['...', '*長い沈黙があった*', '大丈夫', '...'],
    LEAVING:         ['...', '*返事をしなかった*', '', '...'],
    NEUTRAL:         ['...', '大丈夫', '*既読になった。でも返信は来なかった*', '...'],
  },
  GUARDED: {
    SILENT:          ['...そ', '*少し、間があった*', '別に', '...'],
    PRESENT:         ['別に、来いとは言ってない', '...勝手にすれば', '*こちらを見なかった*', 'そう'],
    EMPATHY_SHALLOW: ['...分かんないでしょ', '別に', '*少し口を閉じた*', 'いい'],
    PUSHES_IN:       ['別に、関係ない', '...なんでそういうこと聞くの', '*顔を背けた*\n大丈夫', 'どうでもいい'],
    CONFESSION:      ['...何それ', '*少し間があった*\nそういうの、今はいい', '...別に', '*視線を外した*'],
    LEAVING:         ['そう', '別に', '*返事をしなかった*', '...うん'],
    NEUTRAL:         ['別に', 'そう', '...まあ', '*少し間があった*\nどうした', '関係ない', '...別に何でもない'],
  },
  NEUTRAL: {
    SILENT:          ['...どした', '*少し待った*', '...ん', '何'],
    PRESENT:         ['...そっか', '*少し間があった*', '別に、嫌とは言ってない', '...うん', '*こちらを一瞬見た*'],
    EMPATHY_SHALLOW: ['...別にそういうこと言わなくていい', '分かんないでしょ、そんなこと', '*少し、遠くなった気がした*', '...いい'],
    PUSHES_IN:       ['...別に、何でもない', '*少し間があった*\n大丈夫', 'なんでそういうこと聞くの', '...言わなくていいことがある', '*視線を逸らした*'],
    CONFESSION:      ['...は？', '*しばらく、黙っていた*', '急に何', '...それ、本気？', '*顔を背けた*\nそういうのは、困る'],
    LEAVING:         ['...そう', '別に', 'うん', '*返事が少し遅かった*\n...またね'],
    NEUTRAL:         ['...そう', 'まあ、そうかも', '*少し間があった*\nそっか', '別に', '...うん', 'どうした', 'そうだね'],
  },
  SOFT: {
    SILENT:          ['...何', '*少し、こちらを見た*', '...ん', '何かあった？'],
    PRESENT:         ['...うん', '*少しだけ、近くなった気がした*', '...邪魔じゃない', 'そっか', '*小さく頷いた*'],
    EMPATHY_SHALLOW: ['...そういうこと言わなくていい', '*少し、顔を背けた*\nでも、ありがとう', '分かんないけど...まあ、いい'],
    PUSHES_IN:       ['...別に', '*少し間があった*\nそういうの、難しい', '...まあ、聞かないでほしいけど', '今は、いい'],
    CONFESSION:      ['...は？', '*少し間があった*\n...そういうの、わかんない', '急に何', '*顔を背けた*\n...考えてない'],
    LEAVING:         ['...そう', '*少し、間があった*\nうん', '...またね', '気をつけて'],
    NEUTRAL:         ['...そっか', 'うん', '*小さく頷いた*', '...まあ、そう', 'そうだね', '*少し考えてから*\nそっか'],
  },
  OPEN: {
    SILENT:          ['...何', '*ちらっとこちらを見た*\nどうした', '...ん、何かあった？'],
    PRESENT:         ['...うん', '*少しだけ、距離が縮まった気がした*', '...邪魔じゃない。むしろ、', '*小さく息をついた*\n...いてくれていい'],
    EMPATHY_SHALLOW: ['...そういうこと言わなくていいって言ってるのに', '*少し、目が潤んだ気がした。すぐに逸らした*\n別に、大丈夫'],
    PUSHES_IN:       ['*少し間があった*\n...分かんない。自分でも', '...そういうこと、ちゃんと考えたことない', '*視線を落とした*\n答えられない'],
    CONFESSION:      ['*しばらく沈黙があった*\n...なんで、そういうこと言うの', '*顔を背けた*\n...困る。そういうの', '...やめて。壊れる気がする'],
    LEAVING:         ['...うん。またね', '*少し間があった*\n...気をつけて', '...来て、またいつか'],
    NEUTRAL:         ['...そっか', '*少し柔らかくなった*\nうん', 'そう、だね', '...まあ、悪くない', '*小さく笑った気がした*\n別に'],
  },
};

const NIGHT_ADD = [
  '\n...*夜だから、少しだけ*',
  '\n...深夜って、なんか変になる',
  '\n*窓の外を見ていた*',
  '\n...眠れない',
  '\n*静かだった*',
];

const recentUsed = [];

function pick(arr) {
  const avail = arr.filter(r => !recentUsed.includes(r));
  const src = avail.length > 0 ? avail : arr;
  const chosen = src[Math.floor(Math.random() * src.length)];
  recentUsed.push(chosen);
  if (recentUsed.length > 6) recentUsed.shift();
  return chosen;
}

function generateResponse(metrics, inputText) {
  const cat = categorize(inputText);
  const mood = getMood(metrics);
  const pool = POOL[mood]?.[cat] ?? POOL[mood]?.NEUTRAL ?? POOL.NEUTRAL.NEUTRAL;
  let display = pick(pool);

  if ((new Date().getHours() >= 23 || new Date().getHours() <= 3) && mood !== 'CLOSED' && Math.random() < 0.2) {
    display += pick(NIGHT_ADD);
  }

  return { display, delta: buildDelta(cat, mood) };
}

function buildDelta(cat, mood) {
  const d = { 理解度: 0, 安心度: 0, 拒絶度: 0, 依存度: 0, 自己開示率: 0, 崩壊危険値: 0 };
  switch (cat) {
    case 'SILENT':          d.安心度 = 4;  d.崩壊危険値 = -3; d.自己開示率 = 1;  break;
    case 'PRESENT':         d.安心度 = 6;  d.崩壊危険値 = -4; d.依存度 = 2; d.自己開示率 = 2; break;
    case 'EMPATHY_SHALLOW': d.崩壊危険値 = 9;  d.安心度 = -4; d.拒絶度 = 3;   break;
    case 'PUSHES_IN':       d.崩壊危険値 = 11; d.拒絶度 = 7;  d.安心度 = -5;  break;
    case 'CONFESSION':      d.崩壊危険値 = 8;  d.依存度 = 3;  d.安心度 = -3; d.自己開示率 = 1; break;
    case 'LEAVING':         d.拒絶度 = -4; d.安心度 = -7; d.崩壊危険値 = 3;  break;
    default:                d.理解度 = 2;  d.安心度 = 1;  d.崩壊危険値 = -1; break;
  }
  for (const k of Object.keys(d)) d[k] += Math.round((Math.random() - 0.48) * 3);
  if (mood === 'CLOSED') {
    for (const k of Object.keys(d)) d[k] = d[k] > 0 ? Math.floor(d[k] * 0.4) : Math.ceil(d[k] * 1.4);
  } else if (mood === 'OPEN' || mood === 'SOFT') {
    if (d.安心度 > 0) d.安心度 = Math.floor(d.安心度 * 1.4);
    if (d.崩壊危険値 < 0) d.崩壊危険値 = Math.floor(d.崩壊危険値 * 1.4);
  }
  return d;
}

function typingMs(metrics) {
  return 900 + (metrics.崩壊危険値 / 100) * 1800 + Math.random() * 700;
}

function readMs(metrics) {
  if (metrics.崩壊危険値 >= 70) return 1800 + Math.random() * 1200;
  if (metrics.崩壊危険値 >= 50) return 900 + Math.random() * 600;
  return 300 + Math.random() * 300;
}

// ============================================================
// GAME STATE
// ============================================================
class GameState {
  constructor() { this.load(); }

  load() {
    try {
      const raw = localStorage.getItem('nagi_v3');
      const d = raw ? JSON.parse(raw) : null;
      this.metrics = d?.metrics ? { ...INITIAL_METRICS, ...d.metrics } : { ...INITIAL_METRICS };
      this.messages = d?.messages ?? [];
      this.phase = d?.phase ?? 'setup';
      this.endingType = d?.endingType ?? null;
    } catch { this.reset(); }
  }

  save() {
    localStorage.setItem('nagi_v3', JSON.stringify({
      metrics: this.metrics,
      messages: this.messages,
      phase: this.phase,
      endingType: this.endingType,
    }));
  }

  reset() {
    this.metrics = { ...INITIAL_METRICS };
    this.messages = [];
    this.phase = 'setup';
    this.endingType = null;
    localStorage.removeItem('nagi_v3');
  }

  applyDelta(delta) {
    if (!delta) return;
    for (const k of Object.keys(INITIAL_METRICS)) {
      if (typeof delta[k] === 'number') {
        this.metrics[k] = Math.max(0, Math.min(100, this.metrics[k] + delta[k]));
      }
    }
  }

  checkEnding() {
    const m = this.metrics;
    const turns = this.messages.filter(x => x.role === 'user').length;
    if (m.崩壊危険値 >= 90) return 'bad_collapse';
    if (m.拒絶度 >= 90) return 'bad_rejection';
    if (turns > 55 && m.自己開示率 < 10) return 'bad_distance';
    if (m.理解度 >= 70 && m.自己開示率 >= 65 && m.崩壊危険値 <= 30 && m.安心度 >= 60) return 'true_end';
    return null;
  }
}

// ============================================================
// HELPERS
// ============================================================
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function fmt(text) {
  return esc(text).replace(/\*([^*\n]+)\*/g,'<em>$1</em>').replace(/\n/g,'<br>');
}

function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString('ja-JP', { hour:'2-digit', minute:'2-digit' });
}

// ============================================================
// UI
// ============================================================
class UI {
  constructor(app) {
    this.app = app;
    this.root = document.getElementById('app');
  }

  render() {
    const { phase } = this.app.state;
    if (phase === 'setup') this._setup();
    else if (phase === 'game') this._game();
    else if (phase === 'ending') this._ending();
  }

  _setup() {
    const hasSave = this.app.state.messages.length > 0;
    this.root.innerHTML = `
<div class="setup-screen">
  <div class="setup-content">
    <div class="setup-title">凪</div>
    <div class="setup-subtitle">完全には理解できない存在へ近づく物語</div>
    <div class="setup-desc">
      これは「攻略」ではない。<br>
      "他人という、最後まで完全には理解できない存在"へ<br>
      近づこうとするだけの話。
    </div>
    <button id="start-btn" class="btn-primary">はじめる</button>
    ${hasSave ? '<button id="cont-btn" class="btn-secondary">続きから</button>' : ''}
  </div>
</div>`;

    document.getElementById('start-btn').addEventListener('click', () => this.app.newGame());
    document.getElementById('cont-btn')?.addEventListener('click', () => {
      this.app.state.phase = 'game';
      this.app.state.save();
      this.render();
    });
  }

  _game() {
    this.root.innerHTML = `
<div class="game-screen">
  <header class="game-header">
    <div class="header-info">
      <div class="char-name">凪</div>
      <div class="char-status" id="char-status">${this._statusText()}</div>
    </div>
    <div class="header-actions">
      <button class="icon-btn" id="panel-btn" aria-label="ステータス">
        <svg viewBox="0 0 22 22" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
          <line x1="3" y1="6" x2="19" y2="6"/>
          <line x1="3" y1="11" x2="19" y2="11"/>
          <line x1="3" y1="16" x2="19" y2="16"/>
        </svg>
      </button>
    </div>
  </header>

  <div id="status-panel" class="status-panel collapsed">
    ${this._panelHTML()}
  </div>

  <div id="chat-wrap" class="chat-container">
    <div id="messages" class="messages">
      ${this.app.state.messages.map(m => this._msgHTML(m)).join('')}
    </div>
  </div>

  <footer class="chat-footer">
    <div id="typing-row" class="typing-row hidden">
      <div class="typing-dots"><span></span><span></span><span></span></div>
    </div>
    <div class="input-row">
      <textarea id="msg-input" class="msg-input" placeholder="..." rows="1" maxlength="300"></textarea>
      <button id="send-btn" class="send-btn" aria-label="送信">
        <svg viewBox="0 0 22 22" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>
  </footer>
</div>`;

    this._bindGame();
    this._scrollBottom();
    document.getElementById('panel-btn').addEventListener('click', () => {
      document.getElementById('status-panel').classList.toggle('collapsed');
    });
  }

  _panelHTML() {
    const m = this.app.state.metrics;
    return `
<div class="status-grid">
  ${Object.keys(INITIAL_METRICS).map(k => `
  <div class="status-item ${k === '崩壊危険値' && m[k] > 60 ? 'danger-high' : ''}">
    <div class="status-label">${k}</div>
    <div class="status-bar-wrap">
      <div class="status-bar" style="width:${m[k]}%;background:${METRIC_COLORS[k]}"></div>
    </div>
    <div class="status-value">${m[k]}</div>
  </div>`).join('')}
</div>
<div class="status-footer">
  <button class="btn-reset" id="reset-btn">最初から</button>
</div>`;
  }

  _msgHTML(msg) {
    const isChar = msg.role === 'assistant';
    return `
<div class="message ${isChar ? 'message-char' : 'message-player'} msg-animate">
  ${isChar ? `<div class="avatar"><svg viewBox="0 0 36 36" width="34" height="34"><circle cx="18" cy="18" r="18" fill="#1a1b2e"/><text x="18" y="23.5" text-anchor="middle" fill="#6a80c0" font-size="14" font-family="'Hiragino Mincho ProN',serif">凪</text></svg></div>` : ''}
  <div class="message-body">
    <div class="bubble">${fmt(msg.display)}</div>
    <div class="message-meta">${fmtTime(msg.timestamp)}${!isChar ? '　既読' : ''}</div>
  </div>
</div>`;
  }

  _bindGame() {
    const input = document.getElementById('msg-input');
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 108) + 'px';
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.app.send(); }
    });
    document.getElementById('send-btn').addEventListener('click', () => this.app.send());
    this.root.addEventListener('click', e => {
      if (e.target.id === 'reset-btn') {
        if (confirm('最初からやり直しますか？\nこの会話は失われます。')) this.app.reset();
      }
    });
  }

  _ending() {
    const endings = {
      true_end:      { tag: 'TRUE END', cls: 'ending-true', txt: '凪は、ほんの少しだけ振り返った。\n\n「...壊れないかもしれない」\n\n初めて、そう思えた夜だった。\nまだ何も解決していない。\nでも、隣にいても壊れないかもしれないと——\n凪は初めて、そう感じていた。' },
      bad_collapse:  { tag: 'BAD END',  cls: 'ending-bad',  txt: '「大丈夫」\n\n最後にそう言った。\nそれきり、凪は静かに閉じた。\n\n扉は内側から鍵がかかっていた。\nノックしても、もう音はしない。' },
      bad_rejection: { tag: 'BAD END',  cls: 'ending-bad',  txt: 'ある日、凪はいなくなった。\n\n痕跡も言葉も残さなかった。\nただ、最後に届いた一言。\n\n「ごめん」\n\nそれだけだった。' },
      bad_distance:  { tag: 'BAD END',  cls: 'ending-bad',  txt: '何度も言葉を交わしたのに、\n凪はまだ遠くにいた。\n\nどこかで歯車が狂っていた。\nいつかは、分からなかった。\n\n二人の間に、静かな砂漠が広がっていた。' },
    };
    const e = endings[this.app.state.endingType] ?? endings.bad_distance;
    this.root.innerHTML = `
<div class="ending-screen ${e.cls}">
  <div class="ending-content">
    <div class="ending-tag">${e.tag}</div>
    <div class="ending-text">${esc(e.txt).replace(/\n/g,'<br>')}</div>
    <button id="restart-btn" class="btn-primary">もう一度</button>
  </div>
</div>`;
    document.getElementById('restart-btn').addEventListener('click', () => this.app.reset());
  }

  addMsg(msg) {
    const wrap = document.getElementById('messages');
    if (!wrap) return;
    wrap.insertAdjacentHTML('beforeend', this._msgHTML(msg));
    this._scrollBottom();
  }

  updateStatus() {
    const panel = document.getElementById('status-panel');
    if (panel && !panel.classList.contains('collapsed')) panel.innerHTML = this._panelHTML();
    const el = document.getElementById('char-status');
    if (el) el.textContent = this._statusText();
  }

  setInputEnabled(on) {
    document.getElementById('msg-input')?.toggleAttribute('disabled', !on);
    const btn = document.getElementById('send-btn');
    if (btn) btn.disabled = !on;
  }

  clearInput() {
    const el = document.getElementById('msg-input');
    if (el) { el.value = ''; el.style.height = 'auto'; }
  }

  setTyping(on) {
    document.getElementById('typing-row')?.classList.toggle('hidden', !on);
    if (on) this._scrollBottom();
  }

  _scrollBottom() {
    const el = document.getElementById('chat-wrap');
    if (el) requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
  }

  _statusText() {
    const d = this.app.state.metrics.崩壊危険値;
    if (d >= 80) return '';
    if (d >= 55) return 'オフライン';
    return 'オンライン';
  }

  toast(msg, type = 'info') {
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.textContent = msg;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

// ============================================================
// APP
// ============================================================
class App {
  constructor() {
    this.state = new GameState();
    this.ui = new UI(this);
    this.busy = false;
  }

  start() {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
    this.ui.render();
  }

  newGame() {
    this.state.reset();
    this.state.phase = 'game';
    this.state.save();
    this.ui.render();
    setTimeout(() => this._opening(), 500);
  }

  _opening() {
    const seq = [
      { display: '*静かにそこにいた。あなたに気づいているのかどうか、分からなかった。*', delay: 0 },
      { display: '...', delay: 1300 },
    ];
    let t = 0;
    for (const item of seq) {
      t += item.delay;
      setTimeout(() => {
        const msg = { id: `o-${Date.now()}-${Math.random()}`, role: 'assistant', display: item.display, timestamp: Date.now(), isOpening: true };
        this.state.messages.push(msg);
        this.state.save();
        this.ui.addMsg(msg);
      }, t);
    }
  }

  async send() {
    if (this.busy) return;
    const input = document.getElementById('msg-input');
    const text = input?.value.trim();
    if (!text) return;

    this.busy = true;
    this.ui.setInputEnabled(false);
    this.ui.clearInput();

    const userMsg = { id: `u-${Date.now()}`, role: 'user', display: text, timestamp: Date.now() };
    this.state.messages.push(userMsg);
    this.state.save();
    this.ui.addMsg(userMsg);

    await sleep(readMs(this.state.metrics));
    this.ui.setTyping(true);
    await sleep(typingMs(this.state.metrics));
    this.ui.setTyping(false);

    const { display, delta } = generateResponse(this.state.metrics, text);

    const charMsg = { id: `c-${Date.now()}`, role: 'assistant', display, timestamp: Date.now() };
    this.state.messages.push(charMsg);
    this.state.applyDelta(delta);

    const ending = this.state.checkEnding();
    if (ending) { this.state.endingType = ending; this.state.phase = 'ending'; }

    this.state.save();
    this.ui.addMsg(charMsg);
    this.ui.updateStatus();

    if (ending) setTimeout(() => this.ui.render(), 2400);

    this.busy = false;
    this.ui.setInputEnabled(true);
    document.getElementById('msg-input')?.focus();
  }

  reset() {
    this.state.reset();
    this.state.save();
    this.busy = false;
    this.ui.render();
  }
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  window._app = new App();
  window._app.start();
});
