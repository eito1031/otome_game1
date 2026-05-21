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
// CHARACTER SVG  (えいと — 社会人1年目, アニメ風バストアップ)
// ============================================================
function charSVG(expr) {
  const e = expr || 'neutral';

  const brows = {
    neutral: `<path d="M142 100 Q159 94 177 100" stroke="#141418" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <path d="M223 100 Q241 94 258 100" stroke="#141418" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
    cold: `<path d="M139 97 Q157 91 177 100" stroke="#141418" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M223 100 Q243 91 260 97" stroke="#141418" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    soft: `<path d="M144 103 Q160 97 177 102" stroke="#141418" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M223 102 Q240 97 256 103" stroke="#141418" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  };

  const eyes = {
    neutral: `
      <ellipse cx="162" cy="128" rx="20" ry="14" fill="white"/>
      <path d="M140 120 Q162 111 184 121" stroke="#141418" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse cx="162" cy="128" rx="13" ry="13" fill="#8a6030"/>
      <ellipse cx="162" cy="129" rx="8" ry="9" fill="#241408"/>
      <circle cx="168" cy="121" r="4.5" fill="white" opacity=".9"/>
      <circle cx="156" cy="134" r="2" fill="white" opacity=".35"/>
      <path d="M143 135 Q162 142 181 135" stroke="rgba(170,100,55,.22)" stroke-width="1.2" fill="none"/>
      <ellipse cx="238" cy="128" rx="20" ry="14" fill="white"/>
      <path d="M216 121 Q238 111 260 120" stroke="#141418" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse cx="238" cy="128" rx="13" ry="13" fill="#8a6030"/>
      <ellipse cx="238" cy="129" rx="8" ry="9" fill="#241408"/>
      <circle cx="244" cy="121" r="4.5" fill="white" opacity=".9"/>
      <circle cx="232" cy="134" r="2" fill="white" opacity=".35"/>
      <path d="M219 135 Q238 142 257 135" stroke="rgba(170,100,55,.22)" stroke-width="1.2" fill="none"/>`,
    cold: `
      <ellipse cx="162" cy="126" rx="20" ry="10" fill="white"/>
      <path d="M138 117 Q162 107 186 117" stroke="#141418" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="162" cy="126" rx="13" ry="10.5" fill="#7a5025"/>
      <ellipse cx="162" cy="126" rx="8" ry="7" fill="#1e1005"/>
      <circle cx="167" cy="120" r="3.5" fill="white" opacity=".8"/>
      <path d="M142 131 Q162 136 182 131" stroke="rgba(170,100,55,.15)" stroke-width="1" fill="none"/>
      <ellipse cx="238" cy="126" rx="20" ry="10" fill="white"/>
      <path d="M214 117 Q238 107 262 117" stroke="#141418" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="238" cy="126" rx="13" ry="10.5" fill="#7a5025"/>
      <ellipse cx="238" cy="126" rx="8" ry="7" fill="#1e1005"/>
      <circle cx="243" cy="120" r="3.5" fill="white" opacity=".8"/>
      <path d="M218 131 Q238 136 258 131" stroke="rgba(170,100,55,.15)" stroke-width="1" fill="none"/>`,
    soft: `
      <ellipse cx="162" cy="130" rx="20" ry="15" fill="white"/>
      <path d="M141 122 Q162 113 183 122" stroke="#141418" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="162" cy="131" rx="13" ry="15" fill="#9a7040"/>
      <ellipse cx="162" cy="132" rx="8.5" ry="10" fill="#241408"/>
      <circle cx="168" cy="123" r="5" fill="white" opacity=".92"/>
      <circle cx="155" cy="137" r="2.5" fill="white" opacity=".38"/>
      <path d="M143 139 Q162 146 181 139" stroke="rgba(170,100,55,.25)" stroke-width="1.2" fill="none"/>
      <ellipse cx="238" cy="130" rx="20" ry="15" fill="white"/>
      <path d="M217 122 Q238 113 259 122" stroke="#141418" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="238" cy="131" rx="13" ry="15" fill="#9a7040"/>
      <ellipse cx="238" cy="132" rx="8.5" ry="10" fill="#241408"/>
      <circle cx="244" cy="123" r="5" fill="white" opacity=".92"/>
      <circle cx="231" cy="137" r="2.5" fill="white" opacity=".38"/>
      <path d="M219 139 Q238 146 257 139" stroke="rgba(170,100,55,.25)" stroke-width="1.2" fill="none"/>`,
  };

  const mouths = {
    neutral: `<path d="M183 195 Q200 200 217 195" stroke="#c07858" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
    cold:    `<path d="M185 196 Q200 193 215 196" stroke="#b06848" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    soft:    `<path d="M180 193 Q200 206 220 193" stroke="#c07858" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M188 198 Q200 207 212 198" stroke="rgba(200,120,90,.28)" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
  };

  const blush = e === 'soft'
    ? `<ellipse cx="143" cy="167" rx="24" ry="13" fill="rgba(240,120,110,.11)"/>
       <ellipse cx="257" cy="167" rx="24" ry="13" fill="rgba(240,120,110,.11)"/>`
    : '';

  return `<svg viewBox="0 0 400 520" xmlns="http://www.w3.org/2000/svg">

  <!-- Hood behind head -->
  <path d="M122 248 Q102 212 112 185 Q132 158 158 170 L163 202" fill="#181c1c"/>
  <path d="M278 248 Q298 212 288 185 Q268 158 242 170 L237 202" fill="#181c1c"/>

  <!-- Hoodie body -->
  <path d="M68 300 Q60 398 58 520 L342 520 Q340 398 332 300 Q310 276 278 266 Q240 257 200 257 Q160 257 122 266 Q90 276 68 300Z" fill="#181c1c"/>

  <!-- Left sleeve -->
  <path d="M68 305 Q30 332 24 418 Q44 426 62 418 Q62 350 86 316Z" fill="#181c1c"/>
  <!-- Right sleeve -->
  <path d="M332 305 Q370 332 376 418 Q356 426 338 418 Q338 350 314 316Z" fill="#181c1c"/>

  <!-- Cuffs -->
  <path d="M24 418 Q34 432 46 430 Q56 428 62 418 Q52 426 38 422Z" fill="#222828"/>
  <path d="M376 418 Q366 432 354 430 Q344 428 338 418 Q348 426 362 422Z" fill="#222828"/>

  <!-- Hands -->
  <ellipse cx="40" cy="422" rx="22" ry="14" fill="#f0cca8"/>
  <ellipse cx="360" cy="422" rx="22" ry="14" fill="#f0cca8"/>
  <!-- Ring on left hand (character right, viewer left) -->
  <ellipse cx="34" cy="416" rx="5.5" ry="3.5" fill="none" stroke="#b8b8c8" stroke-width="2.2"/>

  <!-- Inner shirt at collar -->
  <path d="M162 272 Q200 286 238 272 Q222 262 200 260 Q178 262 162 272Z" fill="#222222"/>

  <!-- Zip line -->
  <line x1="200" y1="276" x2="200" y2="520" stroke="#242828" stroke-width="2.5"/>
  <!-- Zip puller -->
  <rect x="196" y="320" width="8" height="18" rx="3" fill="#686868"/>
  <rect x="197" y="322" width="6" height="14" rx="2" fill="#909090"/>

  <!-- Pocket -->
  <path d="M106 376 Q200 392 294 376 Q292 408 294 435 L252 435 Q250 412 250 384 Q200 396 150 384 Q150 412 148 435 L106 435 Q108 408 106 376Z" fill="#141818"/>

  <!-- Necklace (double chain) -->
  <path d="M163 283 Q200 304 237 283" stroke="#a4a4b2" stroke-width="2.5" fill="none" stroke-dasharray="5,3"/>
  <path d="M158 290 Q200 314 242 290" stroke="#949498" stroke-width="2" fill="none" stroke-dasharray="5,3"/>

  <!-- Neck -->
  <path d="M172 226 Q170 268 172 274 Q184 282 200 284 Q216 282 228 274 Q230 268 228 226 Q216 237 200 239 Q184 237 172 226Z" fill="#f0cca8"/>
  <path d="M172 238 Q168 262 172 274" stroke="rgba(155,95,45,.12)" stroke-width="7" fill="none"/>
  <path d="M228 238 Q232 262 228 274" stroke="rgba(155,95,45,.12)" stroke-width="7" fill="none"/>

  <!-- Ears -->
  <ellipse cx="124" cy="142" rx="10" ry="15" fill="#f0cca8"/>
  <ellipse cx="276" cy="142" rx="10" ry="15" fill="#f0cca8"/>
  <path d="M126 131 Q132 137 131 149 Q128 153 126 149 Q124 143 125 134Z" fill="#d8a880" opacity=".45"/>
  <!-- Ear stud (right ear of character = viewer left) -->
  <circle cx="126" cy="132" r="4" fill="#c0c0cc"/>
  <circle cx="126" cy="132" r="2.5" fill="#dcdce8"/>

  <!-- Face -->
  <ellipse cx="200" cy="141" rx="75" ry="92" fill="#f8dfc5"/>

  <!-- Face depth/jaw shadow -->
  <path d="M146 200 Q166 234 200 242 Q234 234 254 200" stroke="rgba(188,118,68,.08)" stroke-width="14" fill="none" stroke-linecap="round"/>
  <ellipse cx="148" cy="172" rx="20" ry="14" fill="rgba(195,120,68,.055)"/>
  <ellipse cx="252" cy="172" rx="20" ry="14" fill="rgba(195,120,68,.055)"/>

  <!-- Hair — back mass -->
  <ellipse cx="200" cy="78" rx="82" ry="56" fill="#141820"/>
  <path d="M122 114 Q114 152 117 195 Q128 203 142 198 Q138 158 136 116Z" fill="#141820"/>
  <path d="M278 114 Q286 152 283 195 Q272 203 258 198 Q262 158 264 116Z" fill="#141820"/>

  <!-- Hair — top layer -->
  <path d="M122 114 Q129 58 200 44 Q271 58 278 114 Q258 73 200 69 Q142 73 122 114Z" fill="#141820"/>

  <!-- Hair fringe strands (swept) -->
  <path d="M148 69 Q168 43 196 51 Q175 53 162 73Z" fill="#1c2230"/>
  <path d="M165 63 Q188 37 217 45 Q195 47 183 67Z" fill="#1c2230"/>
  <path d="M184 58 Q210 30 236 41 Q216 43 205 61Z" fill="#1c2230"/>
  <path d="M207 59 Q234 35 254 47 Q237 49 228 67Z" fill="#1c2230"/>

  <!-- Hair highlight sheen -->
  <path d="M158 67 Q182 53 210 59" stroke="#252e42" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>
  <path d="M167 77 Q194 63 220 70" stroke="#1e2840" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5"/>
  <path d="M152 88 Q174 77 196 81" stroke="#252e42" stroke-width="2" fill="none" stroke-linecap="round" opacity=".4"/>

  <!-- Eyebrows -->
  ${brows[e] || brows.neutral}

  <!-- Eyes -->
  ${eyes[e] || eyes.neutral}

  <!-- Nose (minimal, anime) -->
  <path d="M195 162 Q193 176 189 185" stroke="rgba(175,100,52,.16)" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M205 162 Q207 176 211 185" stroke="rgba(175,100,52,.16)" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <ellipse cx="191" cy="187" rx="5.5" ry="3" fill="rgba(155,85,42,.13)"/>
  <ellipse cx="209" cy="187" rx="5.5" ry="3" fill="rgba(155,85,42,.13)"/>

  <!-- Blush -->
  ${blush}

  <!-- Mouth -->
  ${mouths[e] || mouths.neutral}

</svg>`;
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
    bg: 'classroom', expr: 'neutral',
    narration: '次に会った時、えいとが急に話しかけてきた。',
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
    bg: 'evening', expr: 'neutral',
    narration: '「今日、暇か」\nえいとから初めて連絡が来た。',
    speaker: 'えいと', text: '...来てくれると思ってなかった',
    choices: [
      { label: '連絡くれて嬉しかったよ',
        res: '...そういうこと言うな\n*耳が少し赤かった*', resExpr: 'soft',
        d: { 安心度:8, 依存度:3, 自己開示率:4, 崩壊危険値:-5 } },
      { label: '（隣に座って、黙っている）',
        res: '...ここ、好きなんだ\n*珍しく、自分から話した*', resExpr: 'neutral',
        d: { 安心度:6, 自己開示率:5, 崩壊危険値:-4 } },
      { label: '呼んでくれたらいつでも来るよ',
        res: '...そんなこと言うなよ\n*困ったように呟いた*', resExpr: 'cold',
        d: { 崩壊危険値:3, 依存度:2 } },
    ],
  },
  {
    bg: 'spring', expr: 'neutral',
    narration: '桜の季節。\nえいとが、ぽつりと言った。',
    speaker: 'えいと', text: '...なあ\n（少し、間があった）',
    choices: [
      { label: '（黙って、隣にいる）',
        res: 'うん\n*それだけで良かったみたいだった*', resExpr: 'soft',
        d: { 安心度:10, 自己開示率:6, 崩壊危険値:-8 } },
      { label: 'どうした？',
        res: '...なんでもない\n*でも、笑っていた*', resExpr: 'soft',
        d: { 安心度:7, 自己開示率:3, 崩壊危険値:-4 } },
      { label: '（桜を見上げる）',
        res: '...*しばらく、二人でいた*', resExpr: 'neutral',
        d: { 安心度:4, 崩壊危険値:-2 } },
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
    cls:'ending-normal', tag:'END', expr:'neutral',
    text:'えいとは今日も、少し遠い。\n\nあのとき何か違うことをしていたら、\n何かが変わっていたのかもしれない。\n\nでも、嫌いになったわけじゃない。\nそれだけのこと。',
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
    if (m.安心度 >= 60 && m.自己開示率 >= 22 && m.崩壊危険値 <= 35) return 'best_end';
    if (m.安心度 >= 38 && m.崩壊危険値 <= 60) return 'good_end';
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
    <div class="setup-tagline">えいとの隣に立てるか。それだけの話。</div>
    <div class="setup-card">
      不器用で、口下手で、<br>
      でもたしかに、えいとはそこにいる。
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
