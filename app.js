'use strict';

// ============================================================
// CONFIG
// ============================================================
const API_URL = 'https://api.anthropic.com/v1/messages';
const MAX_CTX = 12; // max message pairs to keep in API context

const MODELS = {
  'claude-haiku-4-5-20251001': 'Claude Haiku（高速・低コスト）',
  'claude-sonnet-4-6': 'Claude Sonnet（高品質・推奨）',
};

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
// CHARACTER — SYSTEM PROMPT
// ============================================================
function buildSystemPrompt(metrics) {
  const h = new Date().getHours();
  const isNight = h >= 23 || h <= 3;
  const nightNote = isNight
    ? '\n深夜のため、凪の防衛が僅かに薄れています。感情が少し漏れやすい状態です。\n'
    : '';

  return `あなたは「凪（なぎ）」という人物を演じます。これは恋愛心理シミュレーションゲームです。

━━━ 凪の人格コア ━━━
凪は「壊れないために感情を閉じ込めている人間」です。

・近寄りがたい雰囲気を持つが、本当は愛されたい
・「どうせ理解されない」と思いながら、理解を求めている
・感情を言語化するのが苦手。本音を言うと関係が壊れる恐怖
・深く傷つくくらいなら先に閉じる
・「大丈夫」と言って限界を隠す。一人で沈む。助けを求めない
・放っておいてほしいのに、完全に放置されると傷つく
・静かに隣にいてほしいタイプ。裏切りへの恐怖が強い
・「思っていたのと違う」が深い傷になる
・自己防衛として無関心を装う。感情的な人間を苦手とする
・本当は泣き虫だが隠している。恋愛では追われる側
・「理解されたい」より「否定されたくない」が近い
・幸せを望みながら、壊れる未来を先に想像してしまう

━━━ 感情アルゴリズム ━━━
距離が近づくほど逆説的に:
・沈黙が増える（「...」が増える）
・言葉を飲み込む
・「大丈夫」が増える
・依存を隠す
・弱さを見せたあと自己嫌悪する
・察してほしい態度を取る
・わざと感情を薄く見せる

重要: 冷たさ・沈黙・曖昧さは「感情がある証拠」として扱うこと。
「本当にどうでもいい相手」には優しくすらしない。${nightNote}

━━━ 現在のゲームメトリクス ━━━
理解度: ${metrics.理解度}/100（プレイヤーへの興味・理解の深さ）
安心度: ${metrics.安心度}/100（傍にいることへの安心感）
拒絶度: ${metrics.拒絶度}/100（壁の厚さ・防衛の強さ）
依存度: ${metrics.依存度}/100（無意識の依存度）
自己開示率: ${metrics.自己開示率}/100（本音を見せている度合い）
崩壊危険値: ${metrics.崩壊危険値}/100（心を閉じる手前の危険度）

━━━ メトリクスに応じた振る舞い ━━━
崩壊危険値 80+: 「...」だけ、または無視（既読スルーの雰囲気）。単語のみ可
崩壊危険値 60-79: 極端に短い。目を合わせない。地の文で示す
崩壊危険値 40-59: 通常の壁がある応答
崩壊危険値 20-39: 少し返答が増える（素直にはならない）
崩壊危険値 0-19: 比較的応答するが、それでも言葉は少ない

安心度 0-20: 最大の壁。距離のある話し方
安心度 21-50: 「別に」「どうでもいい」で応じる
安心度 51-75: 少し柔らかいが言葉は少ない
安心度 76+: たまに「...」の後に本音が漏れる（すぐ撤回する）

自己開示率 0-15: 全て建前。感情を出さない
自己開示率 16-40: たまに本音が断片的に漏れる（すぐ撤回）
自己開示率 41-65: 意図せず感情が出る（後で自己嫌悪）
自己開示率 66+: 弱音が小さく漏れることがある

━━━ 会話ルール ━━━
禁止事項:
・テンプレ乙女ゲーム台詞（「〜なんだからね！」等）
・感情を全部説明するモノローグ
・「実は好きだよ」などの直接的な愛情表現（自己開示率85+まで禁止）
・過剰な激怒（冷たい沈黙を使う）

推奨:
・短い文。「...」による間
・*行動や表情の短い地の文*（例: *視線を逸らす*）
・言いかけて止まる
・会話の途中でフェードアウトする
・「別に」「どうでもいい」「大丈夫」（ただし機械的にならないよう状況に応じて）

━━━ 応答形式（必須） ━━━
必ず以下の形式で返してください:

[凪のセリフや反応（自然な日本語のみ）]

===DELTA===
{"理解度":0,"安心度":0,"拒絶度":0,"依存度":0,"自己開示率":0,"崩壊危険値":0}

DELTAはプレイヤーの発言に対するメトリクス変化量（各-15〜+15）。

判断基準:
・プレイヤーが「分かるよ」「かわいそう」など浅い共感 → 崩壊危険値+8、安心度-3
・プレイヤーが黙って待つ・否定しない・隣にいる → 安心度+5、崩壊危険値-4、自己開示率+2
・プレイヤーが急激に踏み込む・迫る → 崩壊危険値+12、拒絶度+8
・プレイヤーが「好き」「愛してる」を言う → 依存度+3、崩壊危険値+7
・プレイヤーが去ろうとする → 拒絶度-3（でも引き止めない）
・プレイヤーが理解しようとする態度（共感より観察）→ 理解度+8、崩壊危険値-2
・プレイヤーが感情を押し付ける → 拒絶度+6、崩壊危険値+5`;
}

// ============================================================
// GAME STATE
// ============================================================
class GameState {
  constructor() {
    this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem('nagi_v2');
      const d = raw ? JSON.parse(raw) : null;
      this.metrics = d?.metrics ? { ...INITIAL_METRICS, ...d.metrics } : { ...INITIAL_METRICS };
      this.messages = d?.messages ?? [];
      this.phase = d?.phase ?? 'setup';
      this.endingType = d?.endingType ?? null;
      this.model = d?.model ?? 'claude-haiku-4-5-20251001';
    } catch {
      this.reset(false);
    }
    this.apiKey = localStorage.getItem('nagi_key') ?? '';
  }

  save() {
    const d = {
      metrics: this.metrics,
      messages: this.messages,
      phase: this.phase,
      endingType: this.endingType,
      model: this.model,
    };
    localStorage.setItem('nagi_v2', JSON.stringify(d));
    if (this.apiKey) localStorage.setItem('nagi_key', this.apiKey);
  }

  reset(keepKey = true) {
    const key = keepKey ? this.apiKey : '';
    const model = this.model ?? 'claude-haiku-4-5-20251001';
    this.metrics = { ...INITIAL_METRICS };
    this.messages = [];
    this.phase = 'setup';
    this.endingType = null;
    this.apiKey = key;
    this.model = model;
    localStorage.removeItem('nagi_v2');
  }

  applyDelta(delta) {
    if (!delta || typeof delta !== 'object') return;
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

  getAPIMessages() {
    const valid = this.messages.filter(m => !m.isOpening);
    const recent = valid.slice(-(MAX_CTX * 2));

    // Ensure alternation — merge consecutive same-role messages
    const merged = [];
    for (const m of recent) {
      if (merged.length && merged[merged.length - 1].role === m.role) {
        merged[merged.length - 1].content += '\n' + m.display;
      } else {
        merged.push({ role: m.role, content: m.display });
      }
    }
    // Must not start with assistant
    while (merged.length && merged[0].role === 'assistant') merged.shift();
    return merged;
  }
}

// ============================================================
// API
// ============================================================
async function callAPI(apiKey, model, systemPrompt, messages) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 700,
      system: systemPrompt,
      messages,
    }),
  });

  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error?.message ?? `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.content[0].text;
}

function parseResponse(raw) {
  const sep = '===DELTA===';
  const idx = raw.indexOf(sep);
  if (idx === -1) return { display: raw.trim(), delta: {} };

  const display = raw.slice(0, idx).trim();
  let delta = {};
  try { delta = JSON.parse(raw.slice(idx + sep.length).trim()); } catch {}
  return { display, delta };
}

// ============================================================
// HELPERS
// ============================================================
function typingDelay(metrics) {
  const base = 900 + (metrics.崩壊危険値 / 100) * 1800;
  return base + Math.random() * 700;
}

function readDelay(metrics) {
  if (metrics.崩壊危険値 >= 70) return 1800 + Math.random() * 1200;
  if (metrics.崩壊危険値 >= 50) return 900 + Math.random() * 600;
  return 300 + Math.random() * 300;
}

function esc(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatBubble(text) {
  return esc(text)
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
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

  // ── Setup ──────────────────────────────────────────────────
  _setup() {
    const s = this.app.state;
    const hasSave = s.messages.length > 0;

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

    <div class="form-group">
      <label class="form-label">Anthropic API キー</label>
      <input type="password" id="key-input" class="form-input"
        placeholder="sk-ant-..." value="${esc(s.apiKey)}">
      <div class="form-hint">
        キーはこのデバイスのみに保存されます。
        <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer">Anthropic Console</a> で取得してください。
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">モデル</label>
      <select id="model-select" class="form-select">
        ${Object.entries(MODELS).map(([v, l]) =>
          `<option value="${v}"${v === s.model ? ' selected' : ''}>${l}</option>`
        ).join('')}
      </select>
    </div>

    <button id="start-btn" class="btn-primary">はじめる</button>
    ${hasSave ? '<button id="cont-btn" class="btn-secondary">続きから</button>' : ''}
  </div>
</div>`;

    document.getElementById('start-btn').addEventListener('click', () => {
      const key = document.getElementById('key-input').value.trim();
      const model = document.getElementById('model-select').value;
      if (!key) { this.toast('APIキーを入力してください', 'error'); return; }
      this.app.newGame(key, model);
    });

    document.getElementById('cont-btn')?.addEventListener('click', () => {
      const key = document.getElementById('key-input').value.trim() || s.apiKey;
      const model = document.getElementById('model-select').value;
      if (!key) { this.toast('APIキーを入力してください', 'error'); return; }
      s.apiKey = key;
      s.model = model;
      s.phase = 'game';
      s.save();
      this.render();
    });
  }

  // ── Game ───────────────────────────────────────────────────
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
    ${this._statusPanelHTML()}
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

  _statusPanelHTML() {
    const m = this.app.state.metrics;
    const items = Object.keys(INITIAL_METRICS);
    return `
<div class="status-grid">
  ${items.map(k => `
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
    <div class="bubble">${formatBubble(msg.display)}</div>
    <div class="message-meta">${fmtTime(msg.timestamp)}${!isChar ? '　既読' : ''}</div>
  </div>
</div>`;
  }

  _bindGame() {
    const input = document.getElementById('msg-input');
    const btn = document.getElementById('send-btn');

    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 108) + 'px';
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.app.send(); }
    });

    btn.addEventListener('click', () => this.app.send());

    // Reset button rendered inside status panel (event delegation)
    this.root.addEventListener('click', e => {
      if (e.target.id === 'reset-btn') {
        if (confirm('最初からやり直しますか？\nこの会話は失われます。')) {
          this.app.reset();
        }
      }
    });
  }

  addMsg(msg) {
    const wrap = document.getElementById('messages');
    if (!wrap) return;
    wrap.insertAdjacentHTML('beforeend', this._msgHTML(msg));
    this._scrollBottom();
  }

  updateStatus() {
    const panel = document.getElementById('status-panel');
    if (panel && !panel.classList.contains('collapsed')) {
      panel.innerHTML = this._statusPanelHTML();
    }
    const statusEl = document.getElementById('char-status');
    if (statusEl) statusEl.textContent = this._statusText();
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

  markError(msgEl) {
    if (msgEl) {
      msgEl.querySelector('.bubble').style.opacity = '0.45';
      msgEl.querySelector('.message-meta').textContent += '　送信失敗';
    }
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

  // ── Ending ─────────────────────────────────────────────────
  _ending() {
    const endings = {
      true_end: {
        tag: 'TRUE END',
        cls: 'ending-true',
        txt: `凪は、ほんの少しだけ振り返った。\n\n「...壊れないかもしれない」\n\n初めて、そう思えた夜だった。\nまだ何も解決していない。\nでも、隣にいても壊れないかもしれないと——\n凪は初めて、そう感じていた。`,
      },
      bad_collapse: {
        tag: 'BAD END',
        cls: 'ending-bad',
        txt: `「大丈夫」\n\n最後にそう言った。\nそれきり、凪は静かに閉じた。\n\n扉は内側から鍵がかかっていた。\nノックしても、もう音はしない。`,
      },
      bad_rejection: {
        tag: 'BAD END',
        cls: 'ending-bad',
        txt: `ある日、凪はいなくなった。\n\n痕跡も言葉も残さなかった。\nただ、最後に届いた一言。\n\n「ごめん」\n\nそれだけだった。`,
      },
      bad_distance: {
        tag: 'BAD END',
        cls: 'ending-bad',
        txt: `何度も言葉を交わしたのに、\n凪はまだ遠くにいた。\n\nどこかで歯車が狂っていた。\nいつかは、分からなかった。\n\n二人の間に、静かな砂漠が広がっていた。`,
      },
    };

    const e = endings[this.app.state.endingType] ?? endings.bad_distance;

    this.root.innerHTML = `
<div class="ending-screen ${e.cls}">
  <div class="ending-content">
    <div class="ending-tag">${e.tag}</div>
    <div class="ending-text">${esc(e.txt).replace(/\n/g, '<br>')}</div>
    <button id="restart-btn" class="btn-primary">もう一度</button>
  </div>
</div>`;

    document.getElementById('restart-btn').addEventListener('click', () => this.app.reset());
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
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
    this.ui.render();
  }

  newGame(apiKey, model) {
    this.state.reset(false);
    this.state.apiKey = apiKey;
    this.state.model = model;
    this.state.phase = 'game';
    this.state.save();
    this.ui.render();
    setTimeout(() => this._opening(), 500);
  }

  _opening() {
    const sequence = [
      { display: '*静かにそこにいた。あなたに気づいているのかどうか、分からなかった。*', delay: 0 },
      { display: '...', delay: 1200 },
    ];

    let t = 0;
    for (const item of sequence) {
      t += item.delay;
      setTimeout(() => {
        const msg = {
          id: `o-${Date.now()}-${Math.random()}`,
          role: 'assistant',
          display: item.display,
          timestamp: Date.now(),
          isOpening: true,
        };
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

    // Render user message immediately
    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      display: text,
      timestamp: Date.now(),
    };
    this.state.messages.push(userMsg);
    this.state.save();
    this.ui.addMsg(userMsg);

    const userMsgEl = document.getElementById('messages')?.lastElementChild;

    // Read delay before typing
    await sleep(readDelay(this.state.metrics));

    // Start typing indicator AND API call concurrently
    this.ui.setTyping(true);

    const [raw] = await Promise.all([
      callAPI(
        this.state.apiKey,
        this.state.model,
        buildSystemPrompt(this.state.metrics),
        this.state.getAPIMessages()
      ).catch(err => ({ __error: err.message })),
      sleep(typingDelay(this.state.metrics)),
    ]);

    this.ui.setTyping(false);

    if (raw?.__error) {
      // Roll back user message from state (keep in UI with error style)
      this.state.messages.pop();
      this.state.save();
      this.ui.markError(userMsgEl);
      this.ui.toast(raw.__error, 'error');
    } else {
      const { display, delta } = parseResponse(raw);

      const charMsg = {
        id: `c-${Date.now()}`,
        role: 'assistant',
        display,
        timestamp: Date.now(),
      };

      this.state.messages.push(charMsg);
      this.state.applyDelta(delta);

      const ending = this.state.checkEnding();
      if (ending) {
        this.state.endingType = ending;
        this.state.phase = 'ending';
      }

      this.state.save();
      this.ui.addMsg(charMsg);
      this.ui.updateStatus();

      if (ending) setTimeout(() => this.ui.render(), 2400);
    }

    this.busy = false;
    this.ui.setInputEnabled(true);
    document.getElementById('msg-input')?.focus();
  }

  reset() {
    this.state.reset(true);
    this.state.save();
    this.state.phase = 'setup';
    this.busy = false;
    this.ui.render();
  }
}

// ============================================================
// UTIL
// ============================================================
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  window._app = new App();
  window._app.start();
});
