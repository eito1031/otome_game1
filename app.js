'use strict';

// ============================================================
// METRICS
// ============================================================
const INITIAL_METRICS = {
  理解度: 5, 安心度: 10, 拒絶度: 30,
  依存度: 0, 自己開示率: 5, 無関心度: 20,
};
const M_COLORS = {
  理解度:'#5b7fd4', 安心度:'#5bd490', 拒絶度:'#d4a85b',
  依存度:'#bd5bd4', 自己開示率:'#5bbdd4', 無関心度:'#d45b5b',
};

const INITIAL_METRICS_2 = {
  親密度: 20, 信頼度: 20, 素直さ: 10, ドキドキ: 15, 安定度: 20,
};
const M_COLORS_2 = {
  親密度:'#f06292', 信頼度:'#5b7fd4', 素直さ:'#5bd490',
  ドキドキ:'#d45b5b', 安定度:'#bd5bd4',
};

// ============================================================
// CHARACTER IMAGE  (えいと — chara.jpeg, Canvas白抜き)
// ============================================================
let _charaUrl = 'chara.jpeg';

function _processCharaImage() {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const id = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = id.data;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i+1], b = d[i+2];
      const max = Math.max(r, g, b);
      const sat = max - Math.min(r, g, b);
      if (r > 238 && g > 238 && b > 238 && sat < 18) {
        d[i+3] = 0;
      } else if (r > 220 && g > 220 && b > 220 && sat < 25) {
        d[i+3] = Math.round((max - 220) / 35 * 255);
        d[i+3] = 255 - d[i+3];
      }
    }
    ctx.putImageData(id, 0, 0);
    _charaUrl = canvas.toDataURL('image/png');
  };
  img.src = 'chara.jpeg';
}

function charSVG(expr) {
  const e = expr || 'neutral';
  const filters = {
    neutral: 'saturate(0.9) brightness(1.0)',
    cold:    'saturate(0.4) brightness(0.88) hue-rotate(5deg)',
    soft:    'saturate(1.1) brightness(1.04)',
  };
  return `<img src="${_charaUrl}" class="chara-img" alt="えいと" style="filter:${filters[e] || filters.neutral}">`;
}

// ============================================================
// STORY  (社会人1年目のえいと × 別会社の主人公)
// ============================================================
const SCENES = [
  {
    bg: 'hallway', expr: 'neutral',
    narration: '出会い系アプリで知り合ったえいと。\n初めて実際に会う日だった。',
    speaker: 'えいと', text: '...来たんだ\n（思ったより、普通だった）',
    choices: [
      { label: 'えいとも来てくれると思わなかった',
        res: '...なんで\n*少し笑ったように見えた*', resExpr: 'soft',
        d: { 安心度:5, 理解度:2 } },
      { label: 'ちゃんと来ましたよ（笑）',
        res: '...そっか\n*短く言った*', resExpr: 'neutral',
        d: { 安心度:3, 理解度:1 } },
      { label: '（黙って、向かいに座る）',
        res: '...\n*少し間があった*', resExpr: 'cold',
        d: { 理解度:3, 無関心度:-1 } },
    ],
  },
  {
    bg: 'night', expr: 'neutral',
    narration: 'その夜、えいとからメッセージが来た。',
    speaker: 'えいと', text: '今日は\n（それだけだった）',
    choices: [
      { label: '楽しかった',
        res: 'そう\n*短く返ってきた*', resExpr: 'soft',
        d: { 安心度:5, 理解度:2 } },
      { label: 'また会いたいな',
        res: '...考えとく\n*それだけだった*', resExpr: 'neutral',
        d: { 安心度:4, 依存度:1 } },
      { label: 'えいとはどうだった？',
        res: '...別に\n*それ以上は来なかった*', resExpr: 'cold',
        d: { 無関心度:2, 安心度:-1 } },
    ],
  },
  {
    bg: 'park', expr: 'neutral',
    narration: '2回目に会う日。\nえいとが指定したのは、駅近の公園だった。',
    speaker: 'えいと', text: '...（隣に座っている）',
    choices: [
      { label: '（何も言わず、隣に座る）',
        res: '...*しばらく、黙っていた*', resExpr: 'soft',
        d: { 安心度:6, 無関心度:-2 } },
      { label: 'また会ってくれたんですね',
        res: '...来るって言ったから\n*それだけ*', resExpr: 'neutral',
        d: { 安心度:4, 理解度:2 } },
      { label: '公園好きなんですか？',
        res: '...まあ\n*遠くを見ていた*', resExpr: 'neutral',
        d: { 理解度:3 } },
    ],
  },
  {
    bg: 'classroom', expr: 'neutral',
    narration: 'えいとが、少し話してくれた。',
    speaker: 'えいと', text: '仕事、今年からで\nまだよくわかんない',
    choices: [
      { label: '私もそう（笑）',
        res: '...そっか\n*少し、表情が緩んだ*', resExpr: 'soft',
        d: { 安心度:5, 理解度:3 } },
      { label: 'どんな仕事？',
        res: '...普通の\n*それ以上は言わなかった*', resExpr: 'neutral',
        d: { 理解度:2, 安心度:2 } },
      { label: '何がやりたくてその仕事に？',
        res: '...知らない\n*視線を逸らした*', resExpr: 'cold',
        d: { 無関心度:3, 拒絶度:1 } },
    ],
  },
  {
    bg: 'hallway', expr: 'neutral',
    narration: '3回目。\nえいとが珍しく、カフェを指定してきた。',
    speaker: 'えいと', text: '...ここ、好きで\n（自分から話した）',
    choices: [
      { label: '教えてくれてありがとう',
        res: '...別に\n*でも悪くない顔をした*', resExpr: 'soft',
        d: { 安心度:6, 自己開示率:3 } },
      { label: '（黙って、周りを見る）',
        res: '...*少し、嬉しそうだった*', resExpr: 'soft',
        d: { 安心度:5, 自己開示率:2 } },
      { label: 'わかる、雰囲気いいですね',
        res: '...そう\n*それだけ言った*', resExpr: 'neutral',
        d: { 安心度:3 } },
    ],
  },
  {
    bg: 'hallway', expr: 'cold',
    narration: 'ランチに入った店に、えいとがいた。\n一人で、静かにご飯を食べていた。',
    speaker: 'えいと', text: '...（気づいているが、何も言わない）',
    choices: [
      { label: '隣、いいですか',
        res: '...別に\n*でも断らなかった*', resExpr: 'soft',
        d: { 安心度:6, 理解度:3 } },
      { label: '（気づかないふりをする）',
        res: '...*ちらっとこちらを見た*', resExpr: 'cold',
        d: { 理解度:2 } },
      { label: '偶然ですね！（声をかける）',
        res: '...うん\n*すぐ視線を戻した*', resExpr: 'cold',
        d: { 拒絶度:2 } },
    ],
  },
  {
    bg: 'night', expr: 'neutral',
    narration: '夜、スマホが鳴った。\nえいとからだった。',
    speaker: 'えいと', text: 'これ、知ってる？\n*何かの記事のリンクが貼ってあった*',
    choices: [
      { label: '知らなかった、面白いね',
        res: 'そう\n*それだけだった*', resExpr: 'soft',
        d: { 安心度:5, 理解度:3 } },
      { label: '（すぐ既読をつけない）',
        res: '...\n*少し後、もう一度通知が来た*', resExpr: 'soft',
        d: { 安心度:7, 依存度:2 } },
      { label: 'なんで急に？（返す）',
        res: '...別に\n*既読がついてしばらく、返信はなかった*', resExpr: 'cold',
        d: { 拒絶度:2, 安心度:-1 } },
    ],
  },
  {
    bg: 'rain', expr: 'neutral',
    narration: '急な雨。\n軒下にえいとがいた。',
    speaker: 'えいと', text: '...（こちらに気づく）',
    choices: [
      { label: '（黙って、隣に入る）',
        res: '...狭い\n*でもずれなかった*', resExpr: 'soft',
        d: { 安心度:6, 自己開示率:2, 無関心度:-3 } },
      { label: '傘、一緒に入りますか？',
        res: '...別にいい\n*でも一緒に歩き始めた*', resExpr: 'neutral',
        d: { 安心度:4, 理解度:2 } },
      { label: '（先に走り去る）',
        res: '...*ずっと雨の中に立っていた*', resExpr: 'cold',
        d: { 無関心度:3 } },
    ],
  },
  {
    bg: 'evening', expr: 'neutral',
    narration: '「今日、暇か」\nえいとから初めて連絡が来た。',
    speaker: 'えいと', text: '...来てくれると思ってなかった',
    choices: [
      { label: '連絡くれて嬉しかったよ',
        res: '...そういうこと言うな\n*耳が少し赤かった*', resExpr: 'soft',
        d: { 安心度:8, 依存度:3, 自己開示率:4, 無関心度:-5 } },
      { label: '（隣に座って、黙っている）',
        res: '...ここ、好きなんだ\n*珍しく、自分から話した*', resExpr: 'neutral',
        d: { 安心度:6, 自己開示率:5, 無関心度:-4 } },
      { label: '呼んでくれたらいつでも来るよ',
        res: '...そんなこと言うなよ\n*困ったように呟いた*', resExpr: 'cold',
        d: { 無関心度:3, 依存度:2 } },
    ],
  },
  {
    bg: 'spring', expr: 'neutral',
    narration: '桜の季節。\nえいとが、ぽつりと言った。',
    speaker: 'えいと', text: '...なあ\n（少し、間があった）',
    choices: [
      { label: '（黙って、隣にいる）',
        res: 'うん\n*それだけで良かったみたいだった*', resExpr: 'soft',
        d: { 安心度:10, 自己開示率:6, 無関心度:-8 } },
      { label: 'どうした？',
        res: '...なんでもない\n*でも、笑っていた*', resExpr: 'soft',
        d: { 安心度:7, 自己開示率:3, 無関心度:-4 } },
      { label: '（桜を見上げる）',
        res: '...*しばらく、二人でいた*', resExpr: 'neutral',
        d: { 安心度:4, 無関心度:-2 } },
    ],
  },
];

// ============================================================
// CHAPTER 2 SCENES  (付き合ってからの物語)
// ============================================================
const SCENES_2 = [
  {
    bg: 'hallway', expr: 'neutral',
    narration: '付き合って、最初の週末。\nえいとから「どっか行くか」と連絡が来た。',
    speaker: 'えいと', text: '...どこ行きたい\n（珍しく、聞いてきた）',
    choices: [
      { label: '決めていい？',
        res: '...任せる\n*短く、でも嫌じゃなさそうだった*', resExpr: 'soft',
        d: { 親密度:6, 信頼度:3 } },
      { label: 'えいとはどこ行きたい',
        res: 'どこでも\n*でも少し考えてるみたいだった*', resExpr: 'neutral',
        d: { 信頼度:4, 素直さ:2 } },
      { label: '家でいい',
        res: '...え\n*意外そうな顔をした*', resExpr: 'cold',
        d: { ドキドキ:4, 親密度:2, 安定度:-2 } },
    ],
  },
  {
    bg: 'evening', expr: 'neutral',
    narration: '帰り道。\n人が少なくなったとき、えいとの手が触れた。',
    speaker: 'えいと', text: '...（何も言わない）',
    choices: [
      { label: '（そっと握り返す）',
        res: '...*指を絡めてきた*', resExpr: 'soft',
        d: { 親密度:8, ドキドキ:4 } },
      { label: '（そのまま、黙って歩く）',
        res: '...*少し歩幅を合わせてきた*', resExpr: 'soft',
        d: { 親密度:6, 安定度:3 } },
      { label: '手、繋いでるね（笑）',
        res: '...うるさい\n*でも手は離さなかった*', resExpr: 'neutral',
        d: { ドキドキ:5, 素直さ:1 } },
    ],
  },
  {
    bg: 'night', expr: 'neutral',
    narration: '夜、えいとから「今何してる」と来た。\nLINEで話すようになってきた。',
    speaker: 'えいと', text: '今何してる',
    choices: [
      { label: 'えいとのこと考えてた',
        res: '...嘘つくな\n*でも返信が早かった*', resExpr: 'soft',
        d: { ドキドキ:5, 素直さ:3 } },
      { label: 'ごろごろしてる、えいとは？',
        res: 'おれも\n*それだけだった*', resExpr: 'neutral',
        d: { 親密度:5, 安定度:3 } },
      { label: '（既読して少し待ってから返す）',
        res: '...\n*少しして「寝てた？」と来た*', resExpr: 'soft',
        d: { 親密度:6, 信頼度:2 } },
    ],
  },
  {
    bg: 'hallway', expr: 'neutral',
    narration: 'えいとの部屋に、初めて行った。\n思ったより、きれいだった。',
    speaker: 'えいと', text: '...適当にしてていい\n（ぶっきらぼうだけど、案内してくれた）',
    choices: [
      { label: 'えいとの部屋って感じがする',
        res: '...そうか\n*少し嬉しそうだった*', resExpr: 'soft',
        d: { 素直さ:6, 親密度:5 } },
      { label: '（えいとのものを、ひとつひとつ見る）',
        res: '...見すぎ\n*でも止めなかった*', resExpr: 'neutral',
        d: { 親密度:7, ドキドキ:3 } },
      { label: 'また来てもいい？',
        res: '...まあ\n*それだけだったけど、笑ってた*', resExpr: 'soft',
        d: { 親密度:8, 素直さ:4 } },
    ],
  },
  {
    bg: 'evening', expr: 'neutral',
    narration: 'えいとが、珍しく静かだった。\nしばらくして、ぽつりと言った。',
    speaker: 'えいと', text: '...俺のこと、どう思ってる\n（珍しく、直接聞いてきた）',
    choices: [
      { label: '好き、ずっと',
        res: '...そっか\n*短く、でも嬉しそうだった*', resExpr: 'soft',
        d: { 素直さ:8, 親密度:6 } },
      { label: 'えいとも聞いていい？',
        res: '...おれは\n*少し間があった*\n好きだよ', resExpr: 'soft',
        d: { 素直さ:10, 親密度:7, 信頼度:5 } },
      { label: '（黙って、えいとの手を握る）',
        res: '...*しばらく、そのままでいた*', resExpr: 'soft',
        d: { 親密度:8, 安定度:5 } },
    ],
  },
  {
    bg: 'spring', expr: 'soft',
    narration: '桜の季節が、また来た。\nえいとと、並んで歩いていた。',
    speaker: 'えいと', text: '...来年も、こうしてたい\n（珍しく、そんなことを言った）',
    choices: [
      { label: 'うん、そうしよう',
        res: '...ああ\n*少し笑った*', resExpr: 'soft',
        d: { 素直さ:5, 親密度:5, 安定度:4 } },
      { label: '（黙って、えいとに寄り添う）',
        res: '...*腕を回してきた*', resExpr: 'soft',
        d: { 親密度:8, 安定度:5 } },
      { label: 'えいとって、たまにロマンチック',
        res: '...うるさい\n*でも、機嫌が良かった*', resExpr: 'soft',
        d: { ドキドキ:5, 素直さ:4, 親密度:4 } },
    ],
  },
];

// ============================================================
// ENDINGS
// ============================================================
const ENDINGS = {
  best_end: {
    cls:'ending-best', tag:'BEST END', expr:'soft',
    text:'気づいたら、えいとが連絡をくれるようになっていた。\n\n「今日、空いてる？」\n\nいつもそれだけ。\n\nある日、誰かに「あの人と付き合ってるの？」と聞かれた。\nえいとに聞いたら、\n\n「...そういうことだろ」\n\n不器用な答えだったけど、\nそれがえいとの「好き」だった。\n\n──付き合うことになった。',
  },
  good_end: {
    cls:'ending-good', tag:'GOOD END', expr:'neutral',
    text:'えいととの距離は、まだはっきりしない。\n\nでも以前より、ずっと近くなった。\n\n「...また連絡する」\n\nえいとが珍しく、自分からそう言った。',
  },
  normal_end: {
    cls:'ending-normal', tag:'NORMAL END', expr:'neutral',
    text:'えいとは今日も、少し遠い。\n\nあのとき何か違うことをしていたら、\n何かが変わっていたのかもしれない。\n\nでも、嫌いになったわけじゃない。\nそれだけのこと。',
  },
  bad_collapse: {
    cls:'ending-bad', tag:'BAD END — 無関心', expr:'cold',
    text:'えいとの返信が、少しずつ遅くなった。\n\n特に理由はない。\nただ、それだけのことだった。\n\n「あ、そういえばあの人」\n\nえいとにとって、あなたはそういう存在になっていた。\n\n悪いやつじゃない。\nただ、興味がなくなっただけだ。',
  },
  bad_rejection: {
    cls:'ending-bad', tag:'BAD END — 拒絶', expr:'cold',
    text:'ある日、えいとがさらっと言った。\n\n「ごめん、ちょっと合わないかも」\n\n怒っているわけじゃない。\nただ、えいとはそういうやつだった。\n\n合わないと思ったら、引く。\nそれだけのことだった。',
  },
};

const ENDINGS_2 = {
  best_end2: {
    cls:'ending-best', tag:'BEST END', expr:'soft',
    text:'えいとが、少しずつ素直になってきた。\n\n「好きだよ」\n\nそう言えるようになった。\nえいとにしては、珍しいことだった。\n\nそれが、えいとなりの精一杯だと知っていた。\n\nたぶん、ずっとこのままだ。\nでも、それでよかった。',
  },
  good_end2: {
    cls:'ending-good', tag:'GOOD END', expr:'neutral',
    text:'ゆっくりと、確かに近づいてきた。\n\nえいとはまだぎこちない。\nでも、そばにいようとしてくれていた。\n\nそれだけで、十分だった。',
  },
  normal_end2: {
    cls:'ending-normal', tag:'NORMAL END', expr:'neutral',
    text:'付き合っていても、\nえいとは変わらず少し遠かった。\n\n嫌いになったわけじゃない。\nただ、もう少し時間がかかりそうだった。',
  },
  bad_end2: {
    cls:'ending-bad', tag:'BAD END', expr:'cold',
    text:'えいとが、静かに言った。\n\n「俺、こういうの向いてないかも」\n\n怒っているわけじゃない。\nただ、えいとは正直だった。\n\n────それで、終わった。',
  },
};

function getEnding2(metrics, sceneIdx) {
  if (metrics.安定度 <= 5) return 'bad_end2';
  if (sceneIdx >= SCENES_2.length) {
    if (metrics.親密度 >= 55 && metrics.素直さ >= 28) return 'best_end2';
    if (metrics.親密度 >= 35 && metrics.安定度 >= 30) return 'good_end2';
    return 'normal_end2';
  }
  return null;
}

function getEnding(metrics, sceneIdx) {
  const m = metrics;
  if (m.無関心度 >= 80) return 'bad_collapse';
  if (m.拒絶度 >= 80) return 'bad_rejection';
  if (sceneIdx >= SCENES.length) {
    if (m.安心度 >= 60 && m.自己開示率 >= 20 && m.無関心度 <= 35) return 'best_end';
    if (m.安心度 >= 38 && m.無関心度 <= 60) return 'good_end';
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
      this.chapter     = d?.chapter     ?? 1;
      const initM      = this.chapter === 2 ? INITIAL_METRICS_2 : INITIAL_METRICS;
      this.metrics     = d?.metrics     ? { ...initM, ...d.metrics } : { ...initM };
      this.phase       = d?.phase       ?? 'setup';
      this.sceneIndex  = d?.sceneIndex  ?? 0;
      this.endingType  = d?.endingType  ?? null;
    } catch { this.reset(); }
  }

  save() {
    localStorage.setItem('eito_vn1', JSON.stringify({
      metrics: this.metrics, phase: this.phase,
      sceneIndex: this.sceneIndex, endingType: this.endingType,
      chapter: this.chapter,
    }));
  }

  reset() {
    this.metrics    = { ...INITIAL_METRICS };
    this.phase      = 'setup';
    this.sceneIndex = 0;
    this.endingType = null;
    this.chapter    = 1;
    localStorage.removeItem('eito_vn1');
  }

  applyDelta(d) {
    if (!d) return;
    for (const k of Object.keys(this.metrics)) {
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
    _processCharaImage();
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
    <div class="setup-logo">画面越しのエトセトラ</div>
    <div class="setup-tagline">アプリで知り合った、えいとの話。</div>
    <div class="setup-card">
      プロフィール写真は一枚だけ。<br>
      それでも、会ってみることにした。
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
    const scenes = this.state.chapter === 2 ? SCENES_2 : SCENES;
    const si = this.state.sceneIndex;
    if (si >= scenes.length) { this._triggerEnding(); return; }
    const scene = scenes[si];
    const label = this.state.chapter === 2
      ? `Ch.2 &nbsp; SCENE ${si + 1} / ${scenes.length}`
      : `SCENE ${si + 1} / ${scenes.length}`;

    this.root.innerHTML = `
<div class="vn-screen scene-fade">
  <div class="scene-bg bg-${scene.bg}" id="scene-bg">
    <div class="char-area" id="char-area">${charSVG(scene.expr)}</div>
    <div class="vn-hud">
      <div class="scene-label">${label}</div>
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
    const idx = this._scene.choices.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    area.innerHTML = idx.map(i =>
      `<button class="choice-btn" data-i="${i}">${esc(this._scene.choices[i].label)}</button>`
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

    const endingFn = this.state.chapter === 2 ? getEnding2 : getEnding;
    const early = endingFn(this.state.metrics, this.state.sceneIndex);
    if (early && early.startsWith('bad_')) {
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
    const endingFn = this.state.chapter === 2 ? getEnding2 : getEnding;
    const ending = endingFn(this.state.metrics, this.state.sceneIndex);
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
    const endingFn = this.state.chapter === 2 ? getEnding2 : getEnding;
    const fallback = this.state.chapter === 2 ? 'normal_end2' : 'normal_end';
    const ending = endingFn(this.state.metrics, this.state.sceneIndex) || fallback;
    this.state.endingType = ending;
    this.state.phase = 'ending';
    this.state.save();
    this._renderEnding();
  }

  // ── ENDING ───────────────────────────────────────
  _renderEnding() {
    const isC2   = this.state.chapter === 2;
    const ends   = isC2 ? ENDINGS_2 : ENDINGS;
    const fallback = isC2 ? ENDINGS_2.normal_end2 : ENDINGS.normal_end;
    const e      = ends[this.state.endingType] ?? fallback;
    const colors = isC2 ? M_COLORS_2 : M_COLORS;
    const m      = this.state.metrics;
    const nextBtn = this.state.endingType === 'best_end'
      ? `<button id="next-ch-btn" class="btn-start" style="margin-top:.5rem;background:linear-gradient(135deg,#9c88b8,#7c68a8);box-shadow:0 4px 18px rgba(124,104,168,.35)">付き合ってからの物語へ ▶</button>`
      : '';
    this.root.innerHTML = `
<div class="ending-screen ${e.cls}">
  <div class="ending-wrap">
    <div class="ending-tag">${e.tag}</div>
    <div class="ending-char">${charSVG(e.expr)}</div>
    <div class="ending-text">${esc(e.text).replace(/\n/g,'<br>')}</div>
    <div class="ending-metrics">
      ${Object.entries(m).map(([k,v]) =>
        `<div class="em-item">
          <div class="em-dot" style="background:${colors[k] ?? '#aaa'}"></div>
          ${k} ${v}
        </div>`
      ).join('')}
    </div>
    ${nextBtn}
    <button id="restart-btn" class="btn-start" style="margin-top:.5rem">もう一度</button>
  </div>
</div>`;
    document.getElementById('next-ch-btn')?.addEventListener('click', () => this._startChapter2());
    document.getElementById('restart-btn').addEventListener('click', () => {
      this.state.reset();
      this.render();
    });
  }

  _startChapter2() {
    this.state.chapter    = 2;
    this.state.metrics    = { ...INITIAL_METRICS_2 };
    this.state.sceneIndex = 0;
    this.state.phase      = 'game';
    this.state.endingType = null;
    this.state.save();
    this._renderScene();
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
