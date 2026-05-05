const START_BANKROLL = 1_000_000;
const GOAL_BANKROLL = 100_000_000;
const OFFICIAL_ATTEMPT_LIMIT = 10;
const RACE_TAKEOUT_RATE = 0.25;
const RACE_PAYOUT_RATE = 1 - RACE_TAKEOUT_RATE;
const MIN_RACE_ODDS = 1.1;
const MAX_RACE_ODDS = 20;
const STORY_DURATION_MS = 30_000;
const STORAGE_KEY = "make-sabi-100m-challenge-v3";
const META_KEY = `${STORAGE_KEY}-meta`;
const ATTEMPT_LIMIT_MESSAGE = "公式10回は終了。ここからはリベンジプレイで何度でも遊べます。";
const CONFIG = window.BACCARAT_CONFIG || {};

const LASTONE_FACE_PATHS = {
  thinking: "assets/characters/lastone-thinking.png",
  smug: "assets/characters/lastone-smug.png",
  crying: "assets/characters/lastone-crying.png",
  laughing: "assets/characters/lastone-laughing.png"
};

const SPORTS = {
  baccarat: { label: "バカラ", short: "BACCARAT", icon: "♠", tone: "baccarat" },
  horse: { label: "競馬", short: "KEIBA", icon: "馬", tone: "horse", min: 8, max: 12 },
  boat: { label: "競艇", short: "BOAT", icon: "艇", tone: "boat", min: 6, max: 6 },
  keirin: { label: "競輪", short: "KEIRIN", icon: "輪", tone: "keirin", min: 9, max: 9 }
};

const SPORT_ICON_SVG = {
  baccarat: `<svg viewBox="0 0 72 72" aria-hidden="true"><path class="sport-solid" d="M36 8C22 23 13 31 13 43c0 9 7 16 16 16 3 0 6-1 8-4-1 6-5 10-11 12h20c-6-2-10-6-11-12 2 3 5 4 8 4 9 0 16-7 16-16C59 31 50 23 36 8Z"/></svg>`,
  horse: `<svg viewBox="0 0 112 78" aria-hidden="true"><path class="sport-shadow" d="M14 66h82"/><path class="sport-solid" d="M24 37c6-13 18-20 39-17 10 2 17 7 22 16 7-10 15-15 23-9l-8 8 8 6-12 7-12-5c-5 11-17 18-35 17-18-1-30-9-34-20Z"/><path class="sport-line cut" d="M37 50 25 70M52 52l7 18M70 50l-4 20M83 43l15 21M42 27c10 5 27 6 40 1"/><path class="sport-line cut" d="M55 15c8-9 21-7 31 5l-5 12-21-8Z"/><circle class="sport-dot gold" cx="97" cy="33" r="3"/></svg>`,
  boat: `<svg viewBox="0 0 112 78" aria-hidden="true"><path class="sport-wave" d="M8 62c17-8 32-8 49 0 18 8 34 8 51 0"/><path class="sport-solid" d="M9 42h82l17 10-25 15H27Z"/><path class="sport-solid dim" d="M38 21h37l18 21H23Z"/><path class="sport-line cut" d="M48 21v21M71 21v21M16 53c14-7 28-7 43 0"/></svg>`,
  keirin: `<svg viewBox="0 0 112 78" aria-hidden="true"><path class="sport-shadow" d="M12 68h90"/><circle class="sport-wheel" cx="34" cy="53" r="17"/><circle class="sport-wheel" cx="82" cy="53" r="17"/><path class="sport-line" d="M34 53h28l15-29 14 29H62L49 31"/><path class="sport-line cut" d="M74 24h18l8-10M50 16c9-10 22-8 31 3M50 16l24 8-12 29M50 16 38 32"/></svg>`
};

const RACE_RUNNER_SVG = {
  horse: `<svg class="runner-svg runner-horse" viewBox="0 0 128 72" aria-hidden="true"><path class="runner-shadow" d="M10 62h98"/><ellipse class="runner-fill" cx="52" cy="37" rx="35" ry="16"/><path class="runner-fill" d="M78 30c5-16 16-24 31-18l8 8-11 6 7 10-15 8-19-10Z"/><path class="runner-detail" d="M34 28c10 6 29 8 45 3M39 49L26 68M58 52l8 16M76 50l-5 18M90 44l17 20"/><circle class="runner-eye" cx="102" cy="22" r="2.5"/><path class="runner-rider" d="M55 17c7-8 19-6 28 5l-5 12-18-8Z"/></svg>`,
  boat: `<svg class="runner-svg runner-boat" viewBox="0 0 128 72" aria-hidden="true"><path class="runner-wave" d="M8 60c18-8 34-8 52 0 17 7 34 7 55 0"/><path class="runner-fill" d="M10 39h91l16 10-25 13H29Z"/><path class="runner-cabin" d="M42 21h36l15 18H30Z"/><path class="runner-detail" d="M50 21v18M72 21v18M15 51c15-7 30-7 45 0"/></svg>`,
  keirin: `<svg class="runner-svg runner-keirin" viewBox="0 0 128 72" aria-hidden="true"><path class="runner-shadow" d="M12 65h100"/><circle class="runner-wheel" cx="34" cy="49" r="17"/><circle class="runner-wheel" cx="92" cy="49" r="17"/><path class="runner-frame" d="M34 49h26l16-27 16 27H60L47 28"/><path class="runner-detail" d="M76 22h18l9-9M52 14c8-10 21-9 30 1M52 14l24 8-16 27M52 14L39 30"/></svg>`
};

const STORY_SCENES = [
  {
    label: "第1幕 / 明日",
    headline: "明日、支払いが1億ある。",
    text: "日本で負け続けたラスワン。スマホを見るたび、通知より先に現実が刺してくる。",
    face: "thinking"
  },
  {
    label: "第2幕 / 記憶",
    headline: "そういえば韓国に、負けサビがある。",
    text: "残っているのは100万円。100万の負けサビってことは、あの日いくら燃えたんだ。",
    face: "smug"
  },
  {
    label: "第3幕 / 出発",
    headline: "帰りのチケットは、まだ買わない。",
    text: "バカラ、競馬、競艇、競輪。増やせなければ、泳いで帰国。水温だけは見ない。",
    face: "thinking"
  },
  {
    label: "最終幕 / 公式挑戦",
    headline: "10回以内に、1億へ。",
    text: "これは無料の仮想チップゲーム。だけど、スクショに残るドラマだけは本物でいく。",
    face: "laughing"
  }
];

const STORY_ROLL_LINES = [
  "ラスワンは明日の1億円支払いから逃げていた。",
  "通知は鳴らない。鳴っているのは心拍と残高アプリだけ。",
  "その時、脳裏に韓国で残した負けサビ100万円がよみがえる。",
  "100万円の負けサビ。それはつまり、前回の負け方がだいぶ終わっていたという証拠。",
  "だが、帰るには増やすしかない。",
  "舞台はバカラ卓、競馬場、水面、そしてバンクへ。",
  "10回以内に1億へ届けば伝説。",
  "届かなければ、泳いで帰国。",
  "これは無料の仮想チップゲーム。",
  "それでもラスワンの顔だけは、やけに本気だった。"
];

const FAILURE_ENDINGS = [
  { title: "泳いで帰国", text: "海が近い。Googleマップが徒歩ルートを諦めました。" },
  { title: "タイミーに行く", text: "明日の支払いは残ったまま、今日のスキマ時間だけ埋まりました。" },
  { title: "空港で深呼吸", text: "帰国便の前に、財布が先にチェックアウトしました。" },
  { title: "負けサビ増殖", text: "サビ止めのつもりが、サビのテーマパークになりました。" },
  { title: "海パン購入検討", text: "まだ負けじゃない。泳ぎ方を思い出しているだけです。" }
];

const HORSE_NAMES = [
  "ニンジン未払い", "明日ハヤイネン", "財布ノコリカス", "海パンキング", "サビドメ太郎",
  "家賃マッテクレ", "確定申告ブルース", "ワンチャン銀河", "逆噴射プリンス", "寝不足ダービー",
  "請求書クラッシュ", "ラスワンロケット", "帰国子女スイム", "ミョンドン残像", "カラアゲ定食",
  "絶対押スナヨ", "残高スクショ", "借入ブラック", "明日ノ支払", "サウナ上ガリ"
];

const BOAT_NAMES = [
  "潮見拓也", "波多野蓮", "三浦航平", "赤城湊", "白石悠斗", "青柳直樹",
  "黒川大地", "緑川壮真", "桐島航", "浦辺慎也", "森永圭", "真鍋亮介"
];

const KEIRIN_NAMES = [
  "ママチャリ改", "ロードバイク課長", "折りたたみの乱", "電動アシスト兄貴", "ピスト職人",
  "三輪車ドリーム", "通学チャリ号", "サドル低すぎ丸", "空気抜けロード", "買い物カゴSpecial",
  "ブレーキ鳴き侍", "ベルだけ一流"
];

const EXTRA_NAME_POOLS = {
  horse: [
    "未読スルー号", "家賃滞納スター", "利息ノビテル", "レシート紛失", "残高ゼロヨシ",
    "経費デオチロ", "サイフカラッポ", "一発逆転丼", "請求書マーチ", "オールイン社長",
    "海岸線ダッシュ", "空港マダトオイ", "水温チェック", "負けサビ二世", "明日支払王",
    "ナンピン禁止令", "単勝一本釣り", "馬券ノ祈祷師", "焼肉キャンセル", "領収書ナイヨ",
    "返済プランB", "深夜テンション", "銀行アプリ重い", "口座残像", "勝ったら寿司",
    "負けたらモヤシ", "人生向こう正面", "最終直線土下座", "穴馬ノ誘惑", "本命コワイ",
    "オッズ見過ぎ", "買ウナヨ絶対", "三連単ヤメロ", "複勝ニ逃ゲルナ", "払い戻し幻覚",
    "電卓ガタガタ", "財布カウンター", "請求書リターン", "夜行バス検討", "浮き輪予約",
    "出国ゲート前", "帰国便未定", "海パン試着中", "馬体重メンタル", "パドック反省会",
    "推奨馬ゼンブ負け", "逆神ノ祝福", "ニンジン担保", "確率ノ勉強中", "期待値マイナス",
    "人気薄ノ夢", "締切直前病", "実況ニ救ワレタ", "財布ノ葬列", "勝負服パジャマ",
    "出走取消希望", "差シ脚ノ借金", "逃ゲ馬ノ現実", "追込ミ残業", "馬連ハズシ職人",
    "単勝一点病", "生活防衛資金", "明細見タクナイ", "通知オフ希望", "赤字ノ末脚",
    "黒字ニナリタイ", "オッズ十倍沼", "一番人気怖イ", "穴狙イ反省", "全財産ストレート",
    "サウナ後ノ無敵感", "焼鳥一本勝負", "給料日前夜", "カード停止前", "財布ノ幽体離脱",
    "払戻機ノ幻", "競馬場ノ風", "直線長スギ", "残高短スギ", "祈リノフォーム",
    "勝利ノ前借リ", "負ケサビ熟成", "土壇場ノ靴紐", "夢見ル小銭", "未来ノ自分任セ",
    "月末ノ逃亡者", "本命ノ裏切リ", "穴馬ノ営業", "外レ券コレクター", "勝ッタラ帰ル"
  ],
  boat: [
    "佐伯航太", "水谷蓮司", "河野晴斗", "白川湊介", "黒瀬大和", "青井直人",
    "赤羽亮", "緑山慎吾", "黄島拓真", "若松悠", "桐谷颯", "浜野圭吾",
    "潮崎宗介", "波田野歩", "浦田龍之介", "真壁海斗", "三崎怜", "守屋隼人",
    "大泊健吾", "島田航", "風間匠", "水野京介", "森川蒼", "江波純也",
    "白波俊", "赤堀凪", "黒岩舜", "青柳航一", "黄瀬圭", "緑川海里",
    "港谷翔", "津田優馬", "湾岸涼", "桟橋豪", "水面礼二", "波止場真",
    "浮田賢", "泡坂一誠", "潮路仁", "艇王タケル", "江戸川ミナト", "住之江ハルト",
    "蒲郡レン", "平和島リョウ", "若松ナギ", "芦屋ソウタ", "丸亀ユウ", "宮島カイ",
    "多摩川タクミ", "戸田ショウ", "尼崎レイ", "児島マコト", "津ナオキ", "唐津リク",
    "三国カズマ", "鳴門アキラ", "徳山ユウト", "下関ダイチ", "福岡シュン", "大村ヒカル",
    "内枠信者", "展示タイム男", "まくり職人", "差し切り課長", "転覆回避兄貴", "水しぶき王子",
    "海パン予備軍", "浮き輪マスター", "返済レーサー", "泡ノサラリーマン", "波間ノ領収書", "支払日前夜",
    "万舟狙いマン", "堅実イン屋", "外枠ドリーマー", "直線ノ祈祷師", "ターン深男", "モーター音フェチ",
    "スリット無言", "展示詐欺疑惑", "一マーク番長", "二マーク残業", "最終ターン神頼み", "バック水面刑事",
    "荒波会計士", "回収率先生", "単勝ボートマン", "波乗リ請求書"
  ],
  keirin: [
    "クロスバイク師匠", "電チャリ皇帝", "補助輪メンタル", "空気入れ番長", "前カゴ王者",
    "サビサビ通勤号", "チェーン外レ丸", "ギア重スギ", "立ちこぎ主任", "パンク寸前",
    "ベル鳴ラシ隊", "ライト点滅号", "雨の日ママチャリ", "サドル高杉", "カゴ曲ガリ",
    "鍵ナクシ号", "二段ロック神", "駅前放置車", "通勤快速沼", "ロード沼先輩",
    "ピスト無口", "競輪場ノ風", "ライン読み違い", "番手絶好ニキ", "まくり一閃",
    "差し目ノ誘惑", "脚パンパン丸", "踏み直し侍", "残り半周病", "ジャン鳴リ待ち",
    "ゴール前沈黙", "写真判定怖イ", "チャリ担保", "返済ペダル", "借金スプリント",
    "全力立ち漕ぎ", "風除け人生", "自転車操業", "車券ノ幻", "低ギア高望み",
    "高ギア低残高", "タイヤ細スギ", "ブレーキ甘男", "ハンドル遠イ", "サドル硬イ",
    "人生バンク角", "最終四角勝負", "内抜け希望", "外踏み夢見", "脚力未払い",
    "回転数過多", "ギア比ノ沼", "ママチャリ魂", "買物帰リ特急", "ペダル祈祷師",
    "前輪ノ希望", "後輪ノ現実", "チェーン油不足", "二ケツ禁止令", "立体駐輪場王",
    "鍵穴サビテル", "坂道ノ借入", "下り坂ノ人生", "上り坂ノ請求", "変速レバー神",
    "六段変速沼", "ライト消シ忘レ", "盗難登録済", "駅前五分勝負", "歩道橋キツイ",
    "ハンドル曲ガリ", "泥除け職人", "ペダル片方ナシ", "空気圧不足", "カゴ満載王",
    "夜道反射板", "タイヤ太郎", "細タイヤ夢男", "固定ギア哲学", "補給食モヤシ",
    "最終周回課金", "捲リノ土下座", "番手ノ沈黙", "先行逃亡者", "脚質未設定",
    "残高スプリンター", "外帯線ノ夢", "内圏線ノ罠", "赤板ホームレス", "青板ブルース",
    "白線ギリギリ", "競輪新聞熟読", "車券握リシメ", "払い戻し待機", "帰宅チャリ便"
  ]
};

Object.entries(EXTRA_NAME_POOLS).forEach(([sport, names]) => {
  if (sport === "horse") HORSE_NAMES.push(...names);
  if (sport === "boat") BOAT_NAMES.push(...names);
  if (sport === "keirin") KEIRIN_NAMES.push(...names);
});

const RACE_EVENTS = {
  horse: [
    "第3コーナーでニンジンの匂い。全馬の集中力が一瞬だけ生活感に寄る。",
    "外から海パンキング。名前だけで場内が不安になる。",
    "隕石が遠くに落ちた気がしたが、実況はなかったことにした。",
    "ラスワンロケット、脚より先に気持ちが前へ出ている。",
    "請求書クラッシュが伸びる。名前が怖い。",
    "残り400、急に全馬が人生を考え始めた。",
    "インから寝不足ダービー。眠そうなのに脚は起きている。",
    "場内ざわめく。誰かが『これ買ってないやつだ』と言った。",
    "最後の直線、明日の支払いがゴール板の横に立っている。",
    "大外から謎の末脚。負けサビが変な音を立てた。"
  ],
  boat: [
    "1マークで水しぶき。ラスワンのメンタルも少し濡れる。",
    "内から潮見、外から波多野。人名が本当にいそうで逆に怖い。",
    "突然の向かい風。財布にはずっと吹いている。",
    "モーター音が上がる。明日の支払いも音量を上げた。",
    "ここでまくり差し。言葉の意味より勢いが強い。",
    "バック水面、泡がすごい。残高より泡立っている。",
    "2周1マーク、買っていない艇が急に主人公。",
    "展示タイムより、ラスワンの心拍の方が速い。",
    "最終ターン、海パンが視界の端にちらつく。",
    "波が荒い。人生ほどではない。"
  ],
  keirin: [
    "ママチャリ改が番手を取る。買い物帰りとは思えない。",
    "ロードバイク課長、会議を抜け出したような伸び。",
    "サドル低すぎ丸が苦しそう。名前通りすぎる。",
    "電動アシスト兄貴、バッテリー残量に人生を賭ける。",
    "最終バック、ベルだけ一流が本当にベルだけ鳴らした。",
    "ジャンが鳴る。財布もなぜか鳴った。",
    "ママチャリ改、前カゴに夢を入れて踏んでいる。",
    "折りたたみの乱、折りたたまれない意地を見せる。",
    "残り半周、脚より口座残高が限界。",
    "最終直線、サドル低すぎ丸が低い姿勢で世界を狙う。"
  ]
};

const EXTRA_RACE_EVENTS = {
  horse: [
    "ゲートが開いた。ラスワンの表情も少し開いたが、残高は閉じ気味。",
    "1番人気が好位。人気者なのに返済能力まで背負わされている。",
    "大外の馬、名前のわりに内面は堅実そうな走り。",
    "中団でじっと我慢。ラスワンも請求書の通知をじっと無視。",
    "ここでペースが上がる。スマホのバッテリーより先に心拍が減る。",
    "向こう正面、風が強い。借金の向かい風ほどではない。",
    "内で詰まる。人生でよく見る光景です。",
    "先頭が入れ替わった。コメント欄の手のひらも一緒に回転。",
    "3コーナー、穴人気がじわっと来た。財布はまだ疑っている。",
    "お気に入り登録していない馬が、急に通知を鳴らしてきた。",
    "先行勢が粘る。ラスワンの言い訳より粘っている。",
    "後方から一気。明日の支払いも後方から追ってくる。",
    "直線入口、全員が主人公みたいな顔をしている。",
    "場内がざわつく。ざわつく時はだいたい買ってない。",
    "実況席が少し笑った。これは展開が荒れる合図。",
    "内ラチ沿いから伸びる。財布の伸びしろも信じたい。",
    "ニンジン未払いが反応。食費だけは踏み倒せない。",
    "明日ハヤイネンが加速。明日の支払いも早い。",
    "ワンチャン銀河、名前のスケールだけは1億円級。",
    "寝不足ダービー、まぶたは重いが脚は軽い。",
    "カラアゲ定食が外を回る。急に腹が減る実況。",
    "借入ブラック、名前の時点で審査が通らない走り。",
    "残高スクショが進出。証拠だけは残したい。",
    "ここで一頭が謎の二段加速。AIも少し困っている。",
    "ラスト200、勝つ馬と負けサビの距離が縮まる。",
    "残り100、祈りが馬券より厚くなってきた。",
    "ゴール前、全員が請求書を振り切ろうとしている。",
    "写真判定級の接戦。ラスワンの顔だけ先に判定負け。",
    "人気薄が来そうな空気。空気だけなら無料。",
    "最後にもう一伸び。希望が差し脚を覚えました。"
  ],
  boat: [
    "ピット離れから空気が違う。ラスワンの財布だけ置いていかれた。",
    "1号艇がインを主張。主張が通る世界、少しうらやましい。",
    "スタート展示の記憶が急に役に立たない展開。",
    "スリット通過、全艇ほぼ横一線。人生だけ縦一線。",
    "1マーク、内が残すか外が飲むか。ラスワンは水を飲みたくない。",
    "まくりに行った。言葉の圧だけで半分勝っている。",
    "差しが入る。財布にも差し入れがほしい。",
    "バックストレッチ、モーター音が支払い督促に聞こえる。",
    "2番手争いが激しい。ラスワンの胃も激しい。",
    "水面が荒れている。心の水面はさらに荒れている。",
    "ここで外の艇が伸びる。買っていたら名実況だった。",
    "ターンマークで一瞬ふくらむ。夢もふくらむが破れやすい。",
    "イン逃げ濃厚。堅い展開ほど額が足りない。",
    "2マーク、まだ逆転の余地。余地だけで家賃は払えない。",
    "波多野が粘る。名前からして水面に強そう。",
    "潮見のターンが深い。財布の谷も深い。",
    "赤城が外から攻める。色も名前も強い。",
    "白石が白い航跡を引く。領収書は黒い。",
    "展示タイムよりコメント欄の手のひらが速い。",
    "最終周回、海パンの存在感が増してきた。",
    "1艇だけ別の風を掴んだ。ラスワンも掴みたい。",
    "水しぶきが画面を叩く。目覚ましとしては強すぎる。",
    "最終ターン、まだ差せる。気持ちだけは差せている。",
    "外が届くか。届かなければ泳ぐ距離が届く。",
    "内が残した。残ってほしいのは所持金です。",
    "直線、エンジン音が急に説教っぽい。",
    "ゴール前、舟券と人生が同時に震える。",
    "勝者が見えた。買っているかどうかは別問題。",
    "ラスワン、画面に近づきすぎて水しぶきを浴びそう。",
    "決着。水面だけが全部知っていました。"
  ],
  keirin: [
    "周回板が光る。ラスワンの残高も光ってほしい。",
    "誘導が外れる前から、財布の誘導は失敗しています。",
    "ラインができる。人生にもラインを引き直したい。",
    "ママチャリ改、カゴの中に夢と領収書。",
    "ロードバイク課長、会議より踏み込みが鋭い。",
    "折りたたみの乱、今日は折れない気持ち。",
    "電動アシスト兄貴、合法かどうかはゲームなので安心。",
    "ピスト職人、無口に踏む。職人は言い訳しない。",
    "通学チャリ号、遅刻ギリギリの伸び。",
    "サドル低すぎ丸、姿勢の低さだけは世界基準。",
    "買い物カゴSpecial、玉ねぎのような粘り。",
    "ブレーキ鳴き侍、音だけで牽制している。",
    "ベルだけ一流、やっぱりベルがうまい。",
    "ジャン前、空気が変わる。ラスワンの顔色も変わる。",
    "先行が踏む。踏み込みと踏み倒しは似て非なるもの。",
    "番手が絶好。絶好なのに買っていないと地獄。",
    "まくりが飛んでくる。請求書よりは遅い。",
    "三番手から伸びる。地味だけど怖い。",
    "最終バック、脚色が違う。財布の色も違う。",
    "内で我慢。ラスワンも笑顔を我慢。",
    "外並走、空気抵抗より支払い抵抗。",
    "残り半周、全員の太ももが物語を語り始めた。",
    "4コーナー、夢が外へ膨らむ。膨らみすぎ注意。",
    "直線、ベルだけ一流がまだベルを主張。",
    "ゴール線が近い。海岸線はもっと近い。",
    "差したか、残したか。ラスワンの声だけ裏返った。",
    "写真判定。チャリの種類で人生が決まる瞬間。",
    "低すぎるサドルから高すぎる夢が伸びる。",
    "最後の踏み込み、タイミーの通知より強い。",
    "決着。脚は回った、運命も少し回った。"
  ]
};

Object.entries(EXTRA_RACE_EVENTS).forEach(([sport, lines]) => {
  RACE_EVENTS[sport].push(...lines);
});

const EXTRA_RACE_EVENTS_2 = {
  horse: [
    "ラスワンの買い目だけ、なぜか向こう正面で迷子。",
    "単勝の文字が急に重い。100万円が背中に乗っている。",
    "本命馬が堂々。堂々と負ける時もあるので油断は禁物。",
    "穴馬がちらっと見えた。希望はいつもチラ見から始まる。",
    "場内モニターに映る残高、たぶん一番走っていない。",
    "ここで人気馬が動く。ラスワンの口角も少し動く。",
    "外差しの気配。請求書も外から差してくる。",
    "騎手の手が動いた。ラスワンの手汗も動いた。",
    "直線の坂がきつい。明日の支払いほどではない。",
    "人気薄が伸びると、人は急に神を信じ始めます。",
    "馬群が割れた。財布の未来も割れそう。",
    "ゴール板まであと少し。心拍はもうゴールしています。",
    "勝ったら伝説、負けたら海辺の散歩。",
    "買っている馬だけ、なぜかカメラから消える時間帯。",
    "最後は脚色。ラスワンは顔色。"
  ],
  boat: [
    "1マークの角度が鋭い。ラスワンの現実も鋭い。",
    "水面に航跡、財布に傷跡。",
    "外枠が夢を見る。夢を見るのは無料です。",
    "インが強い。強いものにはだいたい倍率がつかない。",
    "まくり差しの気配。用語だけで勝った気分になる。",
    "波が跳ねるたび、所持金が小さく見える。",
    "モーター音が上がる。ラスワンの言い訳も回転数上昇。",
    "艇団が詰まった。支払い予定も詰まっている。",
    "ここで勝負駆け。海パンだけはまだ待機。",
    "ターンで膨らむ。夢も膨らむ。破裂音はまだしない。",
    "白い航跡が美しい。赤字は美しくない。",
    "水しぶきが派手。回収率は地味。",
    "買っている艇が映るだけで、一瞬世界が許された気がする。",
    "最終ターン、海がこちらを見ている。",
    "直線勝負。祈りが水面を走る。"
  ],
  keirin: [
    "誘導退避。ここから人間の太もも会議です。",
    "ラインが伸びる。返済計画は伸びないでほしい。",
    "番手絶好。絶好を買ってないと絶望。",
    "外を踏む。外食はしばらく無理そう。",
    "ジャンが鳴った。財布の警報音にも聞こえる。",
    "先行が粘る。ラスワンの強がりも粘る。",
    "まくり一発。人生も一発でまくりたい。",
    "内に詰まった。スマホ容量みたいな詰まり方。",
    "直線で脚が残っている。残高は残したい。",
    "サドル低すぎ丸が今日も世界を低く見ている。",
    "外並走で火花。口座アプリにも火花。",
    "写真判定なら、ラスワンの顔も判定対象。",
    "ゴール前、チャリの種類が運命を背負う。",
    "踏み直し。人生も踏み直し。",
    "決着の鐘。財布は無音。"
  ]
};

Object.entries(EXTRA_RACE_EVENTS_2).forEach(([sport, lines]) => {
  RACE_EVENTS[sport].push(...lines);
});

const BACCARAT_CHAOS_EVENTS = [
  "カードを開いた瞬間、明日の請求書が一歩下がった。",
  "チップの音が高級。残高はまだ庶民。",
  "ラスワンが一瞬だけ勝者の顔をした。まだ早い。",
  "テーブル上に謎の追い風。海からではないことを祈る。",
  "ナチュラルの気配。心拍だけ先に9点。",
  "負けサビが光った。たぶん演出、たぶん希望。",
  "バンカーが笑った気がした。カードなのに。",
  "プレイヤーが伸びた。こっちの背筋も伸びた。",
  "タイの匂い。ネクタイではなく引き分けのほう。",
  "一瞬、空港の出国ゲートが見えた。まだ幻覚。"
];

const BETS = {
  player: { label: "PLAYER", payout: 1 },
  banker: { label: "BANKER", payout: 0.95 },
  tie: { label: "TIE", payout: 8 },
  bigTiger: { label: "BIG TIGER", payout: 50 },
  smallTiger: { label: "SMALL TIGER", payout: 22 },
  playerPair: { label: "P PAIR", payout: 11 },
  bankerPair: { label: "B PAIR", payout: 11 }
};

const CHIP_STEPS = [1_000, 5_000, 10_000, 50_000, 100_000];
const suits = ["♠", "♥", "♦", "♣"];
const ranks = [
  ["A", 1],
  ["2", 2],
  ["3", 3],
  ["4", 4],
  ["5", 5],
  ["6", 6],
  ["7", 7],
  ["8", 8],
  ["9", 9],
  ["10", 0],
  ["J", 0],
  ["Q", 0],
  ["K", 0]
];

const ACHIEVEMENTS = [
  { id: "first_round", icon: "▶", title: "はじめの一局", desc: "最初のラウンドを完了する", check: ({ state }) => state.rounds >= 1 },
  { id: "first_win", icon: "勝", title: "初勝利", desc: "初めて収支プラスで勝つ", check: ({ settlement }) => settlement.net > 0 },
  { id: "player_win", icon: "P", title: "青の流れ", desc: "PLAYERが勝利する", check: ({ round }) => round.winner === "P" },
  { id: "banker_win", icon: "B", title: "赤の本命", desc: "BANKERが勝利する", check: ({ round }) => round.winner === "B" },
  { id: "tie_result", icon: "T", title: "緑の奇跡", desc: "TIEが出る", check: ({ round }) => round.winner === "T" },
  { id: "player_bet_hit", icon: "P", title: "PLAYER的中", desc: "PLAYERベットを当てる", check: ({ settlement }) => settlement.outcomes.player?.status === "win" },
  { id: "banker_bet_hit", icon: "B", title: "BANKER的中", desc: "BANKERベットを当てる", check: ({ settlement }) => settlement.outcomes.banker?.status === "win" },
  { id: "tie_bet_hit", icon: "T", title: "TIE一点突破", desc: "TIEベットを当てる", check: ({ settlement }) => settlement.outcomes.tie?.status === "win" },
  { id: "pair_hit", icon: "♣", title: "ペアハンター", desc: "PLAYER PAIR / BANKER PAIRベットを当てる", check: ({ settlement }) => settlement.outcomes.playerPair?.status === "win" || settlement.outcomes.bankerPair?.status === "win" },
  { id: "big_tiger_hit", icon: "虎", title: "ビッグタイガー咆哮", desc: "BIG TIGERを当てる", check: ({ settlement }) => settlement.outcomes.bigTiger?.status === "win" },
  { id: "small_tiger_hit", icon: "虎", title: "スモールタイガー閃光", desc: "SMALL TIGERを当てる", check: ({ settlement }) => settlement.outcomes.smallTiger?.status === "win" },
  { id: "natural8", icon: "8", title: "ナチュラルエイト", desc: "最初の2枚で8点が出る", check: ({ round }) => round.natural && Math.max(round.initialPlayer, round.initialBanker) === 8 },
  { id: "natural9", icon: "9", title: "ナチュラルナイン実績解除", desc: "最初の2枚で9点が出る", check: ({ round }) => round.natural && Math.max(round.initialPlayer, round.initialBanker) === 9 },
  { id: "player_pair", icon: "P2", title: "PLAYERペア", desc: "PLAYERの最初の2枚が同じ数字", check: ({ settlement }) => settlement.playerPair },
  { id: "banker_pair", icon: "B2", title: "BANKERペア", desc: "BANKERの最初の2枚が同じ数字", check: ({ settlement }) => settlement.bankerPair },
  { id: "player_third", icon: "+P", title: "PLAYER三枚目", desc: "PLAYERに3枚目が配られる", check: ({ round }) => round.player.length === 3 },
  { id: "banker_third", icon: "+B", title: "BANKER三枚目", desc: "BANKERに3枚目が配られる", check: ({ round }) => round.banker.length === 3 },
  { id: "win_streak3", icon: "3", title: "3連勝の火種", desc: "3連勝する", check: ({ state }) => state.streak >= 3 },
  { id: "win_streak5", icon: "5", title: "5連勝の波", desc: "5連勝する", check: ({ state }) => state.streak >= 5 },
  { id: "loss_streak5", icon: "耐", title: "沼の入口", desc: "5連敗を経験する", check: ({ state }) => state.history.slice(0, 5).length === 5 && state.history.slice(0, 5).every((item) => item.net < 0) },
  { id: "round10", icon: "10", title: "10R到達", desc: "10ラウンド遊ぶ", check: ({ state }) => state.rounds >= 10 },
  { id: "round30", icon: "30", title: "30R到達", desc: "30ラウンド遊ぶ", check: ({ state }) => state.rounds >= 30 },
  { id: "round50", icon: "50", title: "50R到達", desc: "50ラウンド遊ぶ", check: ({ state }) => state.rounds >= 50 },
  { id: "bankroll2m", icon: "2M", title: "200万円突破", desc: "所持金200万円を突破する", check: ({ state }) => state.bankroll >= 2_000_000 },
  { id: "bankroll5m", icon: "5M", title: "500万円突破", desc: "所持金500万円を突破する", check: ({ state }) => state.bankroll >= 5_000_000 },
  { id: "bankroll10m", icon: "10M", title: "1000万円突破", desc: "所持金1000万円を突破する", check: ({ state }) => state.bankroll >= 10_000_000 },
  { id: "bankroll50m", icon: "50M", title: "5000万円突破", desc: "所持金5000万円を突破する", check: ({ state }) => state.bankroll >= 50_000_000 },
  { id: "clear100m", icon: "億", title: "1億達成 CLEAR", desc: "所持金1億円を突破する", check: ({ state }) => state.bankroll >= GOAL_BANKROLL },
  { id: "million_profit", icon: "爆", title: "一撃100万円プラス", desc: "1ラウンドで100万円以上勝つ", check: ({ settlement }) => settlement.net >= 1_000_000 },
  { id: "all_main_bets", icon: "全", title: "三面待ち", desc: "PLAYER / BANKER / TIEすべてに同時ベットする", check: ({ bets }) => bets.player > 0 && bets.banker > 0 && bets.tie > 0 }
];

const LOSE_COMMENTS = [
  "負けサビがサビ止めじゃなくて、普通に広がってる。",
  "泳いで帰国ルート、Googleマップが海を案内し始めた。",
  "今のは流れを読む前に、流れに読まれた。",
  "カードより先に財布が絞られている。",
  "この負け方、航空券じゃなくて浮き輪を検索するやつ。",
  "韓国の空気を吸いに来たはずが、海水を飲む準備になってきた。",
  "まだ大丈夫。大丈夫って言ってる時が一番大丈夫じゃない。",
  "100万の負けサビ、追加塗装入りました。",
  "今の一局、財布だけ先に帰国した。",
  "運が休憩に入りました。勤務再開を待ちましょう。",
  "負けた瞬間、明日の支払いがこっちを見た。",
  "バンカーもプレイヤーも強い。俺の所持金だけ弱い。",
  "これは負けじゃない。支払い日へのリアルなカウントダウン。",
  "海が近い。たぶん演出じゃない。",
  "ナチュラルに負けた。こっちもナチュラルに泣いていい。",
  "いまのは練習。そう思わないと心が持たない。",
  "チップが旅立った。目的地は知らない。",
  "次で取り返す、という名の古典芸能が始まりました。",
  "明日の1億が、遠くで拍手してる。",
  "ラスワン、今のは笑ってごまかすしかない。",
  "負けサビ100万円、また思い出が増えた。",
  "ここからドラマ。今はまだ水温チェック。",
  "手元の100万が、急に敬語で別れを告げてきた。",
  "この負け方は、配信的にはおいしい。財布的にはまずい。",
  "カードを開いたら、現実も開いた。",
  "泳いで帰国のフォーム確認を始めます。",
  "負けたけど、コメント欄は盛り上がる。たぶん。",
  "大丈夫、まだ海パンは履いてない。",
  "支払いまであと1億。所持金は反抗期。",
  "今の負け、音だけは高級だった。",
  "ラスワンの表情が、急に通信制限みたいになった。",
  "残高が手を振っている。戻ってくるとは言っていない。",
  "明日の支払いに既読がつきました。",
  "今の負け方、スクショより深呼吸が必要。",
  "財布の防御力が紙コップでした。",
  "一瞬だけ未来が見えた。全部青ざめていた。",
  "流れを変える前に、生活を変えたくなってきた。",
  "海岸線がチュートリアルを始めました。",
  "負けサビが熟成されて、もはや名産品。",
  "ラスワン、笑顔のロード時間が長い。",
  "この負けは教材。授業料が高い。",
  "チップが消えた場所に、謎の静寂だけ残った。",
  "画面は派手。所持金は質素。",
  "勝負勘より水泳フォームを鍛える時間です。",
  "返済計画が一瞬フリーズしました。",
  "空港ではなく、砂浜が手招きしている。",
  "今のは運負け。そう言い切る勇気だけは勝った。",
  "負けた瞬間、BGMだけプロっぽくなった。",
  "ラスワンの心に、そっとタイミーの通知。",
  "ここで引いたら物語。続けたらドキュメンタリー。"
];

const WIN_COMMENTS = [
  "帰国便が少しだけ見えてきた。",
  "負けサビに金メッキが乗り始めた。",
  "明日の支払いが一瞬だけ黙った。",
  "これは流れを掴んだ顔。まだ帰れないけど。",
  "海から空港へ、ルート再検索中。",
  "今のは気持ちいい。財布も少しだけ敬語をやめた。",
  "100万が仕事をした。社員旅行はまだ早い。",
  "この勝ち方、配信の切り抜き候補。",
  "ラスワン、ちょっとだけ主人公感が出てきた。",
  "いい風が吹いた。海じゃなくて追い風で頼む。"
];

const BANKRUPT_TICKER_LINES = [
  "破産速報：負けサビがサビではなく本体になりました。",
  "空港カウンターより先に、海岸線へご案内します。",
  "タイミー担当者が静かにアプリを開きました。",
  "明日の支払い、急に敬語をやめました。",
  "このあと流れる映像は、泳法確認ではありません。",
  "所持金0円。財布の中で風だけが実況しています。",
  "ラスワン、ここで現実の第三コーナーへ。",
  "負けサビ残高、見事にサビだけ残りました。",
  "次回予告：100万円、もう一度ちゃんと働く。",
  "スクショ価値はあります。資産価値はありません。",
  "出国ゲートが遠い。海だけが近い。",
  "チップは旅立ちました。帰国予定は未定です。",
  "明日の支払いが拍手をやめません。",
  "水温チェックを始めるには、ちょうどいい残高です。",
  "今なら反省だけが無料で増えます。",
  "臨時ニュース：100万円、現場から姿を消しました。",
  "空港券売機が、なぜか水着売り場を案内しています。",
  "ラスワンの財布、ここで一旦エンドロール。",
  "スタッフロールにタイミーが協賛で入りました。",
  "『泳いで帰国』の文字が、やけに高解像度です。",
  "次の挑戦までに、肺活量だけ上げておきましょう。",
  "残高0円。画面の光だけが優しい。",
  "負けサビは消えました。サビ跡は残りました。",
  "海パン購入ボタンは、まだ実装していません。",
  "現実がログインしてきました。",
  "1億の支払いが、そっと椅子を引いて待っています。",
  "実況席、言葉を選んでいます。選びきれません。",
  "この負けは伝説です。主に反面教師として。",
  "ラスワン、しばらく水平線と面談です。",
  "財布の中身が、完全にオフラインになりました。",
  "勝負は終わり。海は始まり。",
  "残ったのはスクショと、妙な達成感だけ。",
  "次回、負けサビ100万円ふたたび。",
  "ゲームオーバーですが、ネタとしては続行可能です。",
  "海岸までのルート検索が、なぜか最短です。"
];

let state = loadState();
let meta = loadMeta();
let shoe = buildShoe();
let currentChip = 1_000;
let activeBets = blankBets();
let previousBets = blankBets();
let selectedBetKey = "banker";
let pendingRound = null;
let displayedRound = null;
let lastSettlement = null;
let titleSeen = location.search.includes("intro=1")
  ? false
  : localStorage.getItem(`${STORAGE_KEY}-title-seen`) === "1";
let soundEnabled = localStorage.getItem(`${STORAGE_KEY}-sound`) !== "0";
let vibeEnabled = localStorage.getItem(`${STORAGE_KEY}-vibe`) !== "0";
let visibleCards = new Set();
let revealedCards = new Set();
let activeCardId = null;
let roundToken = 0;
let isDealing = false;
let isRaceRunning = false;
let raceToken = 0;
let raceProgress = {};
let raceMood = "通常";
let authReady = false;
let authUser = null;
let authProfile = null;
let supabaseClient = null;
let audioCtx = null;
let bgmTimer = null;
let bgmKind = null;
let endingTickerTimer = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function blankBets() {
  return Object.fromEntries(Object.keys(BETS).map((key) => [key, 0]));
}

function createId() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function loadMeta() {
  try {
    const saved = JSON.parse(localStorage.getItem(META_KEY));
    if (saved?.installId) {
      return {
        installId: saved.installId,
        attemptNumber: saved.attemptNumber || 1,
        currentAttemptId: saved.currentAttemptId || createId(),
        firstSeenAt: saved.firstSeenAt || new Date().toISOString(),
        currentAttemptStartedAt: saved.currentAttemptStartedAt || new Date().toISOString(),
        bestClearRounds: saved.bestClearRounds || null,
        clearCount: saved.clearCount || 0,
        unlockedAchievements: Array.isArray(saved.unlockedAchievements) ? saved.unlockedAchievements : [],
        officialAttemptsUsed: Number.isFinite(saved.officialAttemptsUsed) ? saved.officialAttemptsUsed : 0,
        officialClears: Number.isFinite(saved.officialClears) ? saved.officialClears : 0,
        currentAttemptOfficial: Boolean(saved.currentAttemptOfficial),
        currentAttemptConsumed: Boolean(saved.currentAttemptConsumed),
        authUserId: saved.authUserId || null,
        authEmail: saved.authEmail || null,
        storySeen: Boolean(saved.storySeen)
      };
    }
  } catch {
    localStorage.removeItem(META_KEY);
  }

  const now = new Date().toISOString();
  return {
    installId: createId(),
    attemptNumber: 1,
    currentAttemptId: createId(),
    firstSeenAt: now,
    currentAttemptStartedAt: now,
    bestClearRounds: null,
    clearCount: 0,
    unlockedAchievements: [],
    officialAttemptsUsed: 0,
    officialClears: 0,
    currentAttemptOfficial: false,
    currentAttemptConsumed: false,
    authUserId: null,
    authEmail: null,
    storySeen: false
  };
}

function saveMeta() {
  localStorage.setItem(META_KEY, JSON.stringify(meta));
}

function newGameState() {
  return {
    bankroll: START_BANKROLL,
    sessionProfit: 0,
    streak: 0,
    bestStreak: 0,
    maxBankroll: START_BANKROLL,
    rounds: 0,
    wins: 0,
    activeSport: "baccarat",
    currentRace: null,
    raceBets: {},
    previousRaceBets: {},
    selectedRaceId: null,
    history: [],
    bankrollTrace: [START_BANKROLL],
    status: "playing"
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Number.isFinite(saved.bankroll)) {
      return {
        ...newGameState(),
        ...saved,
        bankrollTrace: saved.bankrollTrace?.length ? saved.bankrollTrace : [START_BANKROLL]
      };
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return newGameState();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  saveMeta();
}

function buildShoe() {
  const cards = [];
  for (let deck = 0; deck < 8; deck += 1) {
    for (const suit of suits) {
      for (const [rank, value] of ranks) {
        cards.push({ rank, value, suit, id: `${rank}${suit}-${deck}-${createId()}` });
      }
    }
  }
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

function drawCard() {
  if (shoe.length < 26) shoe = buildShoe();
  return shoe.pop();
}

function currentSport() {
  return state.activeSport && SPORTS[state.activeSport] ? state.activeSport : "baccarat";
}

function isRaceSport(sport = currentSport()) {
  return sport !== "baccarat";
}

function sportLabel(sport = currentSport()) {
  return SPORTS[sport]?.label || "バカラ";
}

function createRace(sport) {
  const spec = SPORTS[sport];
  const count = sport === "horse"
    ? (Math.random() < 0.55 ? 8 : 12)
    : spec.min;
  const names = raceNamePool(sport);
  const participants = createRaceProbabilities(count, sport).map((prob, index) => {
    const odds = RACE_PAYOUT_RATE / prob;
    return {
      id: `${sport}-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
      number: index + 1,
      name: names[index % names.length],
      prob,
      odds,
      color: runnerColor(index, sport)
    };
  });

  return {
    id: createId(),
    sport,
    name: raceTitle(sport),
    participants,
    createdAt: Date.now(),
    result: null
  };
}

function createRaceProbabilities(count, sport) {
  const minProb = RACE_PAYOUT_RATE / MAX_RACE_ODDS;
  const maxProb = RACE_PAYOUT_RATE / MIN_RACE_ODDS;
  const weights = Array.from({ length: count }, (_, index) => {
    const base = Math.pow(Math.random(), sport === "horse" ? 1.65 : 1.35) + 0.04;
    const favoriteBoost = index === 0 ? (sport === "boat" ? 4.8 : 4.2) + Math.random() * 3.2 : 1;
    const secondBoost = index === 1 && Math.random() < 0.78 ? 1.6 + Math.random() * 1.6 : 1;
    const longshotDrag = index > Math.floor(count * 0.62) ? 0.32 + Math.random() * 0.5 : 1;
    return base * favoriteBoost * secondBoost * longshotDrag;
  }).sort(() => Math.random() - 0.5);

  return boundedNormalize(weights, minProb, maxProb);
}

function boundedNormalize(weights, floor, ceiling) {
  const result = Array(weights.length).fill(0);
  const open = new Set(weights.map((_, index) => index));
  let remainingMass = 1;

  while (open.size) {
    const openWeight = [...open].reduce((sum, index) => sum + weights[index], 0);
    let changed = false;

    for (const index of [...open]) {
      const proposed = openWeight > 0 ? (remainingMass * weights[index]) / openWeight : remainingMass / open.size;
      if (proposed < floor) {
        result[index] = floor;
        remainingMass -= floor;
        open.delete(index);
        changed = true;
      } else if (proposed > ceiling) {
        result[index] = ceiling;
        remainingMass -= ceiling;
        open.delete(index);
        changed = true;
      }
    }

    if (!changed) {
      for (const index of open) {
        result[index] = openWeight > 0 ? (remainingMass * weights[index]) / openWeight : remainingMass / open.size;
      }
      break;
    }
  }

  const total = result.reduce((sum, value) => sum + value, 0);
  if (!Number.isFinite(total) || total <= 0) return Array(weights.length).fill(1 / weights.length);
  const drift = 1 - total;
  const adjustable = result.findIndex((value) => value + drift >= floor && value + drift <= ceiling);
  if (Math.abs(drift) > 1e-10 && adjustable >= 0) result[adjustable] += drift;
  return result;
}

function raceExpectedReturnText() {
  return `控除率${Math.round(RACE_TAKEOUT_RATE * 100)}% / 期待値${Math.round(RACE_PAYOUT_RATE * 100)}%`;
}

function raceNamePool(sport) {
  const source = sport === "horse" ? HORSE_NAMES : sport === "boat" ? BOAT_NAMES : KEIRIN_NAMES;
  return [...source].sort(() => Math.random() - 0.5);
}

function raceTitle(sport) {
  const titles = {
    horse: ["負けサビ記念", "明日支払いステークス", "泳いで帰国カップ", "ニンジン未払い特別"],
    boat: ["負けサビ水面決戦", "明日支払い優勝戦", "海パン準備選抜", "韓国残高カップ"],
    keirin: ["負けサビバンク", "ママチャリ杯", "明日支払いグランプリ", "サドル低すぎ記念"]
  };
  return sample(titles[sport] || ["負けサビ記念"]);
}

function runnerColor(index, sport) {
  const palettes = {
    horse: ["#f6d56b", "#4fb4ff", "#ff6258", "#8dff7a", "#b86cff", "#ffffff", "#ff9a3d", "#38e4d5", "#d8b48a", "#ef5aa7", "#89a6ff", "#c8ff5a"],
    boat: ["#ffffff", "#1e2734", "#ff3d35", "#238dff", "#ffe65b", "#35db69"],
    keirin: ["#ffffff", "#151515", "#e1352f", "#2377ff", "#ffe65b", "#37d56d", "#ff8c2f", "#ff72ce", "#8d43ff"]
  };
  return palettes[sport]?.[index % palettes[sport].length] || "#ffd773";
}

function ensureRace(force = false) {
  const sport = currentSport();
  if (!isRaceSport(sport)) return null;
  if (force || !state.currentRace || state.currentRace.sport !== sport) {
    state.currentRace = createRace(sport);
    state.raceBets = {};
    state.previousRaceBets = {};
    state.selectedRaceId = state.currentRace.participants[0]?.id || null;
    raceProgress = {};
  }
  return state.currentRace;
}

function sumRaceBets(bets = state.raceBets) {
  return Object.values(bets || {}).reduce((sum, amount) => sum + amount, 0);
}

function selectedRaceParticipant() {
  const race = ensureRace();
  if (!race) return null;
  return race.participants.find((entry) => entry.id === state.selectedRaceId) || race.participants[0] || null;
}

function addRaceBet(id) {
  if (isRaceRunning || isDealing || state.status !== "playing") return;
  const race = ensureRace();
  const entry = race.participants.find((item) => item.id === id);
  if (!entry) return;
  if (state.selectedRaceId !== id) {
    state.raceBets = {};
    state.selectedRaceId = id;
  }
  const total = sumRaceBets();
  if (total + currentChip > state.bankroll) {
    pulseDeal("所持金不足");
    playTone("danger");
    return;
  }
  state.raceBets[id] = (state.raceBets[id] || 0) + currentChip;
  playTone("bet");
  vibrate(12);
  render();
}

function pickRaceWinner(race) {
  const roll = Math.random();
  let cumulative = 0;
  for (const entry of race.participants) {
    cumulative += entry.prob;
    if (roll <= cumulative) return entry;
  }
  return race.participants[race.participants.length - 1];
}

function resolveRace(race, bets, winner) {
  const totalStake = sumRaceBets(bets);
  let returned = 0;
  const outcomes = {};
  for (const entry of race.participants) {
    const stake = bets[entry.id] || 0;
    if (!stake) continue;
    const hit = entry.id === winner.id;
    const payout = hit ? Math.floor(stake * entry.odds) : 0;
    returned += payout;
    outcomes[entry.id] = { status: hit ? "win" : "lose", stake, payout, odds: entry.odds, name: entry.name };
  }
  return { totalStake, returned, net: returned - totalStake, outcomes, winner };
}

function handTotal(cards) {
  return cards.reduce((sum, card) => sum + card.value, 0) % 10;
}

function shouldBankerDraw(bankerTotal, playerThird) {
  if (!playerThird) return bankerTotal <= 5;
  const v = playerThird.value;
  if (bankerTotal <= 2) return true;
  if (bankerTotal === 3) return v !== 8;
  if (bankerTotal === 4) return v >= 2 && v <= 7;
  if (bankerTotal === 5) return v >= 4 && v <= 7;
  if (bankerTotal === 6) return v === 6 || v === 7;
  return false;
}

function dealRound() {
  const player = [drawCard(), drawCard()];
  const banker = [drawCard(), drawCard()];
  const sequence = [
    { side: "player", index: 0, label: "PLAYER 1枚目" },
    { side: "banker", index: 0, label: "BANKER 1枚目" },
    { side: "player", index: 1, label: "PLAYER 2枚目" },
    { side: "banker", index: 1, label: "BANKER 2枚目" }
  ];

  const initialPlayer = handTotal(player);
  const initialBanker = handTotal(banker);
  const natural = [8, 9].includes(initialPlayer) || [8, 9].includes(initialBanker);

  if (!natural) {
    let playerThird = null;
    if (initialPlayer <= 5) {
      playerThird = drawCard();
      player.push(playerThird);
      sequence.push({ side: "player", index: 2, label: "PLAYER 3枚目" });
    }
    if (shouldBankerDraw(initialBanker, playerThird)) {
      banker.push(drawCard());
      sequence.push({ side: "banker", index: 2, label: "BANKER 3枚目" });
    }
  }

  const playerTotal = handTotal(player);
  const bankerTotal = handTotal(banker);
  const winner = playerTotal > bankerTotal ? "P" : bankerTotal > playerTotal ? "B" : "T";

  return {
    player,
    banker,
    sequence,
    initialPlayer,
    initialBanker,
    playerTotal,
    bankerTotal,
    winner,
    natural,
    createdAt: Date.now()
  };
}

function resolveRound(round, bets) {
  const totalStake = sumBets(bets);
  let returned = 0;
  const outcomes = {};
  const playerPair = round.player[0].rank === round.player[1].rank;
  const bankerPair = round.banker[0].rank === round.banker[1].rank;

  for (const [key, stake] of Object.entries(bets)) {
    if (!stake) continue;
    let status = "lose";
    let payout = 0;

    if (key === "player") {
      if (round.winner === "P") status = "win";
      if (round.winner === "T") status = "push";
    }
    if (key === "banker") {
      if (round.winner === "B") status = "win";
      if (round.winner === "T") status = "push";
    }
    if (key === "tie" && round.winner === "T") status = "win";
    if (key === "bigTiger" && round.winner === "B" && round.bankerTotal === 6 && round.banker.length === 3) status = "win";
    if (key === "smallTiger" && round.winner === "B" && round.bankerTotal === 6 && round.banker.length === 2) status = "win";
    if (key === "playerPair" && playerPair) status = "win";
    if (key === "bankerPair" && bankerPair) status = "win";

    if (status === "win") payout = stake + Math.floor(stake * BETS[key].payout);
    if (status === "push") payout = stake;
    returned += payout;
    outcomes[key] = { status, stake, payout };
  }

  const net = returned - totalStake;
  return { totalStake, returned, net, outcomes, playerPair, bankerPair };
}

function sumBets(bets) {
  return Object.values(bets).reduce((sum, amount) => sum + amount, 0);
}

function formatYen(value, compact = false) {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(Math.trunc(value));
  if (compact && abs >= 10_000) return `${sign}${(abs / 10_000).toLocaleString("ja-JP")}万`;
  return `${sign}¥${abs.toLocaleString("ja-JP")}`;
}

function formatPlain(value) {
  return Math.trunc(value).toLocaleString("ja-JP");
}

function proofCode() {
  return `${meta.currentAttemptId || meta.installId}`.replace(/-/g, "").slice(0, 10).toUpperCase();
}

function attemptsLeft() {
  return Math.max(0, OFFICIAL_ATTEMPT_LIMIT - meta.officialAttemptsUsed);
}

function canContinueAttempt() {
  return meta.currentAttemptConsumed && state.status === "playing";
}

function canStartAttempt() {
  return true;
}

function blockAttemptLimit() {
  titleSeen = false;
  localStorage.removeItem(`${STORAGE_KEY}-title-seen`);
  const hint = $("#authHint");
  if (hint) hint.textContent = ATTEMPT_LIMIT_MESSAGE;
  playTone("danger");
  render();
}

function attemptMessage() {
  if (attemptsLeft() <= 0 && !meta.currentAttemptOfficial) return ATTEMPT_LIMIT_MESSAGE;
  return `${meta.attemptNumber}回目の挑戦。公式10回以内で1億いけたらスクショで伝説。`;
}

function render() {
  const sport = currentSport();
  const raceMode = isRaceSport(sport);
  if (raceMode) ensureRace();
  const mustLogin = supabaseReady() && authReady && !authUser;
  $("#titleOverlay").classList.toggle("hidden", titleSeen && !mustLogin);
  $("#titleAttempt").textContent = attemptMessage();
  $("#attemptBadge").textContent = `${meta.attemptNumber}回目の挑戦`;
  $("#titleAchievementCount").textContent = `${meta.unlockedAchievements.length} / ${ACHIEVEMENTS.length}`;
  $("#titleAttemptLimit").textContent = `${meta.officialAttemptsUsed} / ${OFFICIAL_ATTEMPT_LIMIT}`;
  $("#bankroll").textContent = formatYen(state.bankroll);
  $("#debtGap").textContent = `${formatPlain(Math.max(0, GOAL_BANKROLL - state.bankroll))}円`;
  $("#sessionProfit").textContent = state.sessionProfit === 0
    ? "±0"
    : `${state.sessionProfit > 0 ? "+" : "-"}${formatPlain(Math.abs(state.sessionProfit))}`;
  $("#streak").textContent = state.streak;
  $("#rounds").textContent = state.rounds;
  $("#maxBankroll").textContent = formatYen(state.maxBankroll);
  $("#bestStreak").textContent = state.bestStreak;
  $("#bestProgress").textContent = `${Math.min(100, Math.floor((state.maxBankroll / GOAL_BANKROLL) * 100))}%`;
  $("#stageNumber").textContent = Math.max(1, Math.min(10, Math.floor((state.bankroll / GOAL_BANKROLL) * 10) + 1));

  const rate = state.rounds ? Math.round((state.wins / state.rounds) * 100) : 0;
  $("#winRate").textContent = `${rate}%`;
  $("#goalProgress").style.width = `${Math.max(1, Math.min(100, (state.bankroll / GOAL_BANKROLL) * 100))}%`;
  const frame = $(".game-frame");
  frame.classList.toggle("race-mode", raceMode);
  Object.keys(SPORTS).forEach((key) => frame.classList.toggle(`sport-${key}`, key === sport));
  $("#modeTitle").textContent = raceMode ? `${sportLabel(sport)} 単勝チャレンジ` : "負けサビ資産チャレンジ";
  $("#currentSportName").textContent = sportLabel(sport);
  $("#venueCurrentName").textContent = sportLabel(sport);
  $("#venueBankroll").textContent = formatYen(state.bankroll);
  $("#officialAttemptStatus").textContent = officialStatusText();
  renderAuth();
  renderSportTabs();
  renderVenueIcons();

  $("#currentChip").textContent = formatPlain(currentChip);
  const totalBet = raceMode ? sumRaceBets() : sumBets(activeBets);
  $("#totalBet").textContent = `合計 ${formatPlain(totalBet)}`;
  const selectedRace = selectedRaceParticipant();
  $("#allInTarget").textContent = raceMode
    ? `${selectedRace?.name || "単勝"}に残り全額`
    : `${BETS[selectedBetKey].label}に残り全額`;
  if (!isDealing && !isRaceRunning) $("#dealButtonText").textContent = raceMode ? "レース開始" : "ベット確定";
  $("#dealButton").disabled = totalBet <= 0 || totalBet > state.bankroll || isDealing || isRaceRunning || state.status !== "playing";

  for (const [key, amount] of Object.entries(activeBets)) {
    const el = $(`#bet-${key}`);
    if (el) el.textContent = amount ? formatPlain(amount) : "0";
    const tile = $(`[data-bet="${key}"]`);
    if (tile) {
      tile.classList.toggle("active", amount > 0);
      tile.classList.toggle("selected-target", key === selectedBetKey);
    }
  }

  renderCards(displayedRound);
  renderRace();
  renderRoad();
  renderRoadMaps();
  renderHistory();
  renderAchievements();
  renderSparkline();
  $("#soundToggle").classList.toggle("active", soundEnabled);
  $("#soundToggle").textContent = soundEnabled ? "ON" : "OFF";
  $("#vibeToggle").classList.toggle("active", vibeEnabled);
  $("#vibeToggle").textContent = vibeEnabled ? "ON" : "OFF";
  saveState();
}

function renderCards(round) {
  const playerCards = $("#playerCards");
  const bankerCards = $("#bankerCards");
  playerCards.innerHTML = "";
  bankerCards.innerHTML = "";

  const player = round?.player ?? [];
  const banker = round?.banker ?? [];

  if (!round) {
    playerCards.appendChild(cardPlaceholder());
    bankerCards.appendChild(cardPlaceholder());
    $("#playerScore").textContent = "-";
    $("#bankerScore").textContent = "-";
    $("#resultSeal").innerHTML = "<span>BET</span><strong>READY</strong>";
    $("#dealerMessage").textContent = "ベットしてカードを配る";
    return;
  }

  for (const card of player) {
    if (visibleCards.has(card.id)) playerCards.appendChild(cardElement(card, revealedCards.has(card.id)));
  }
  for (const card of banker) {
    if (visibleCards.has(card.id)) bankerCards.appendChild(cardElement(card, revealedCards.has(card.id)));
  }

  if (!playerCards.children.length) playerCards.appendChild(cardPlaceholder());
  if (!bankerCards.children.length) bankerCards.appendChild(cardPlaceholder());

  $("#playerScore").textContent = scoreForVisible(player);
  $("#bankerScore").textContent = scoreForVisible(banker);

  if (revealedCards.size < round.sequence.length) {
    $("#resultSeal").innerHTML = "<span>DEAL</span><strong>OPEN</strong>";
    return;
  }

  const label = round.winner === "P" ? "PLAYER" : round.winner === "B" ? "BANKER" : "TIE";
  $("#resultSeal").innerHTML = `<span>${label}</span><strong>WIN</strong>`;
}

function officialStatusText() {
  if (!supabaseReady()) return attemptsLeft() <= 0 && !meta.currentAttemptOfficial
    ? "リベンジ"
    : `ゲスト ${meta.officialAttemptsUsed}/${OFFICIAL_ATTEMPT_LIMIT}`;
  if (!authReady) return "認証確認中";
  if (!authUser) return attemptsLeft() <= 0 && !meta.currentAttemptOfficial
    ? "リベンジ"
    : `ゲスト公式 ${meta.officialAttemptsUsed}/${OFFICIAL_ATTEMPT_LIMIT}`;
  const left = attemptsLeft();
  if (meta.currentAttemptOfficial) return `公式 ${meta.officialAttemptsUsed}/${OFFICIAL_ATTEMPT_LIMIT}`;
  if (left <= 0) return "リベンジ";
  return `公式残り${left}回`;
}

function renderAuth() {
  const status = $("#authStatus");
  const hint = $("#authHint");
  const google = $("#googleLogin");
  const emailBox = $("#emailLoginBox");
  if (!status || !hint || !google) return;
  const startButton = $("#startGame");
  const quotaOpen = canStartAttempt();
  const left = attemptsLeft();

  if (!supabaseReady()) {
    status.textContent = `ゲスト ${meta.officialAttemptsUsed}/${OFFICIAL_ATTEMPT_LIMIT}`;
    hint.textContent = left > 0
      ? `ログインなしで残り${left}回。キャッシュを消さなければ続きから遊べます。`
      : ATTEMPT_LIMIT_MESSAGE;
    google.disabled = false;
    google.textContent = left > 0 ? "ゲスト公式で開始" : "リベンジで開始";
    if (emailBox) emailBox.style.display = "none";
    startButton.textContent = left > 0 ? "公式チャレンジ開始" : "リベンジでゲームスタート";
    startButton.disabled = false;
    return;
  }

  google.disabled = !authReady;
  startButton.disabled = !authReady;
  if (!authReady) {
    status.textContent = "認証確認中";
    hint.textContent = "ログイン状態を確認しています。";
    google.textContent = "確認中";
    startButton.textContent = "準備中";
    return;
  }

  if (authUser) {
    status.textContent = `${authUser.email || "Google"} / ${meta.officialAttemptsUsed}/${OFFICIAL_ATTEMPT_LIMIT}`;
    hint.textContent = left > 0
      ? `このGoogle IDで残り${left}回。公式達成証明を残せます。`
      : ATTEMPT_LIMIT_MESSAGE;
    google.textContent = left > 0 ? "ゲームスタート" : "リベンジでゲームスタート";
    google.disabled = false;
    startButton.textContent = left > 0 ? "ゲームスタート" : "リベンジでゲームスタート";
    startButton.disabled = false;
    if (emailBox) emailBox.style.display = "none";
    return;
  }

  status.textContent = `ゲスト公式 ${meta.officialAttemptsUsed}/${OFFICIAL_ATTEMPT_LIMIT}`;
  hint.textContent = left > 0
    ? `ログインなしで開始できます。Google連携すると達成証明が強くなります。`
    : ATTEMPT_LIMIT_MESSAGE;
  google.textContent = "Googleで証明をつける";
  google.disabled = false;
  startButton.textContent = left > 0 ? "公式チャレンジ開始" : "リベンジでゲームスタート";
  startButton.disabled = false;
  if (emailBox) emailBox.style.display = "none";
}

function renderSportTabs() {
  $$(".sport-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.sport === currentSport());
  });
}

function renderVenueIcons() {
  $$("[data-venue-sport]").forEach((button) => {
    const sport = button.dataset.venueSport;
    const icon = button.querySelector("span");
    if (icon && SPORT_ICON_SVG[sport] && icon.dataset.svgReady !== "1") {
      icon.classList.add("venue-svg-icon");
      icon.innerHTML = SPORT_ICON_SVG[sport];
      icon.dataset.svgReady = "1";
    }
  });
}

function renderRace() {
  const stage = $("#raceStage");
  if (!stage) return;
  const race = ensureRace();
  if (!race) return;
  $("#raceTypeLabel").textContent = SPORTS[race.sport].label;
  $("#raceName").textContent = race.name;

  const track = $("#raceTrack");
  track.innerHTML = "";
  race.participants.forEach((entry) => {
    const lane = document.createElement("div");
    lane.className = `race-lane${race.result?.winnerId === entry.id ? " winner" : ""}`;
    lane.dataset.sport = race.sport;
    const progress = raceProgress[entry.id] || 0;
    lane.innerHTML = `
      <div class="race-lane-number">${entry.number}</div>
      <div class="race-lane-road">
        <div class="race-lane-label"><b>${entry.name}</b><span>${formatOdds(entry.odds)}x</span></div>
        <div class="race-lane-glow"></div>
        <div class="race-runner" style="--runner-color:${entry.color}; --race-progress:${progress}%">${raceIcon(race.sport)}</div>
      </div>
    `;
    track.appendChild(lane);
  });

  const entries = $("#raceEntries");
  entries.innerHTML = "";
  race.participants.forEach((entry) => {
    const amount = state.raceBets?.[entry.id] || 0;
    const button = document.createElement("button");
    button.type = "button";
    button.className = `race-entry${state.selectedRaceId === entry.id ? " selected" : ""}${race.result?.winnerId === entry.id ? " hit" : ""}`;
    button.dataset.racePick = entry.id;
    button.innerHTML = `
      <div class="race-entry-number" style="--runner-color:${entry.color}">${entry.number}</div>
      <div>
        <strong>${entry.name}</strong>
        <span>${raceFlavor(entry, race.sport)}</span>
      </div>
      <div>
        <small>${formatOdds(entry.odds)}倍</small>
        <b>${amount ? formatPlain(amount) : ""}</b>
      </div>
    `;
    entries.appendChild(button);
  });

  const selected = selectedRaceParticipant();
  const amount = selected ? state.raceBets?.[selected.id] || 0 : 0;
  $("#raceTicketName").textContent = selected ? `${selected.number} ${selected.name} / ${formatOdds(selected.odds)}倍` : "未選択";
  $("#raceTicketAmount").textContent = `${formatPlain(amount)}円`;
  renderRaceShowcase(race);
  renderRaceBroadcast(race);
}

function raceIcon(sport) {
  return RACE_RUNNER_SVG[sport] || SPORT_ICON_SVG.baccarat;
}

function formatOdds(value) {
  return value >= 10 ? value.toFixed(1) : value.toFixed(2);
}

function raceFlavor(entry, sport) {
  if (sport === "horse") return entry.number % 3 === 0 ? "末脚だけは上場企業" : entry.number % 2 === 0 ? "ニンジン反応良好" : "返済意識は高い";
  if (sport === "boat") return entry.number <= 2 ? "イン逃げ気配" : entry.number <= 4 ? "まくり警戒" : "外から夢を見る";
  return entry.number % 2 === 0 ? "ギア比より気合" : "サドル位置が哲学";
}

function renderRaceShowcase(race) {
  const icon = $("#raceShowcaseIcon");
  if (!icon) return;
  icon.innerHTML = raceIcon(race.sport);
  $("#raceVenueLabel").textContent = raceVenueLabel(race.sport);
  $("#raceMainCall").textContent = raceMainCall(race);
  $("#raceOddsSummary").textContent = raceOddsSummary(race);
  const face = $("#raceCommentatorFace");
  if (face) face.src = LASTONE_FACE_PATHS[raceCommentatorMood(race)];
}

function raceVenueLabel(sport) {
  if (sport === "horse") return "負けサビ競馬場 / 単勝";
  if (sport === "boat") return "負けサビ水面 / 単勝";
  if (sport === "keirin") return "負けサビバンク / 単勝";
  return "負けサビ本店";
}

function raceMainCall(race) {
  const favorite = race.participants.reduce((best, entry) => entry.odds < best.odds ? entry : best, race.participants[0]);
  if (isRaceRunning) return `${leaderEntry()?.name || favorite.name}が前へ出る`;
  return `本命 ${favorite.number} ${favorite.name} / ${formatOdds(favorite.odds)}倍`;
}

function raceOddsSummary(race) {
  const longshot = race.participants.reduce((best, entry) => entry.odds > best.odds ? entry : best, race.participants[0]);
  return `${raceExpectedReturnText()} / 大穴 ${longshot.number} ${formatOdds(longshot.odds)}倍`;
}

function raceCommentatorMood(race) {
  const selected = selectedRaceParticipant();
  const stake = selected ? state.raceBets?.[selected.id] || 0 : 0;
  if (isRaceRunning) return "thinking";
  if (stake >= Math.max(100_000, state.bankroll * 0.55)) return "crying";
  const favorite = race.participants.reduce((best, entry) => entry.odds < best.odds ? entry : best, race.participants[0]);
  if (selected?.id === favorite.id) return "smug";
  if ((selected?.odds || 0) >= 12) return "laughing";
  return "thinking";
}

function renderRaceBroadcast(race = state.currentRace) {
  if (!race || !$("#raceLeaderName")) return;
  const leader = leaderEntry();
  const topProgress = leader ? Math.max(0, raceProgress[leader.id] || 0) : 0;
  const remaining = Math.max(0, Math.round(1000 - topProgress * 10));
  $("#raceLeaderName").textContent = leader ? `${leader.number} ${leader.name}` : "-";
  $("#raceDistance").textContent = isRaceRunning ? `残り${remaining}m` : "待機中";
  $("#raceTension").textContent = isRaceRunning ? raceMood : oddsHeatLabel(race);
  if ($("#raceMainCall")) $("#raceMainCall").textContent = raceMainCall(race);
}

function leaderEntry() {
  const race = state.currentRace;
  if (!race?.participants?.length) return null;
  return race.participants.reduce((leader, entry) => {
    if (!leader) return entry;
    return (raceProgress[entry.id] || 0) > (raceProgress[leader.id] || 0) ? entry : leader;
  }, null);
}

function oddsHeatLabel(race) {
  const favorite = race.participants.reduce((best, entry) => entry.odds < best.odds ? entry : best, race.participants[0]);
  if (favorite.odds <= 1.6) return "本命濃厚";
  if (favorite.odds <= 2.4) return "本命あり";
  return "波乱含み";
}

function scoreForVisible(cards) {
  const visible = cards.filter((card) => revealedCards.has(card.id));
  if (!visible.length) return "-";
  return handTotal(visible);
}

function cardPlaceholder() {
  const div = document.createElement("div");
  div.className = "card-placeholder";
  div.textContent = "CARD";
  return div;
}

function cardElement(card, revealed) {
  const div = document.createElement("div");
  div.className = `playing-card ${isRed(card) ? "red" : "black"} ${revealed ? "revealed" : "back"}`;
  if (card.id === activeCardId) div.classList.add("just-dealt");

  if (!revealed) {
    div.innerHTML = `
      <div class="card-back-inner">
        <span>BACCARAT</span>
        <b>◆</b>
      </div>
    `;
    return div;
  }

  div.innerHTML = `
    <div class="corner top"><b>${card.rank}</b><span>${card.suit}</span></div>
    <div class="card-pips">${pipMarkup(card)}</div>
    <div class="corner bottom"><b>${card.rank}</b><span>${card.suit}</span></div>
  `;
  return div;
}

function pipMarkup(card) {
  const rank = card.rank;
  if (rank === "A") return `<span class="pip ace">${card.suit}</span>`;
  if (["J", "Q", "K"].includes(rank)) {
    const label = rank === "J" ? "JACK" : rank === "Q" ? "QUEEN" : "KING";
    return `<span class="court">${card.suit}</span><strong>${label}</strong><em>${card.suit}</em>`;
  }

  const count = rank === "10" ? 10 : Number(rank);
  return Array.from({ length: count }, (_, i) => `<span class="pip p${i + 1}">${card.suit}</span>`).join("");
}

function isRed(card) {
  return card.suit === "♥" || card.suit === "♦";
}

function renderRoad() {
  const road = $("#road");
  road.innerHTML = "";
  $("#historyTitle").textContent = isRaceSport() ? "最近の勝負履歴" : "最近の履歴（ビッグロード）";
  const items = isRaceSport()
    ? state.history.filter((item) => item.sport && item.sport !== "baccarat").slice(0, 18)
    : baccaratHistory().slice(0, 18);
  items.reverse().forEach((item) => {
    const dot = document.createElement("div");
    const winner = item.winner || "R";
    dot.className = `road-dot ${winner}${item.natural ? " natural" : ""}${item.playerPair || item.bankerPair ? " pair" : ""}`;
    dot.textContent = item.sport && item.sport !== "baccarat" ? item.winnerNumber : winner;
    road.appendChild(dot);
  });
}

function baccaratHistory() {
  return state.history.filter((item) => !item.sport || item.sport === "baccarat");
}

function renderRoadMaps() {
  const bigRoadGrid = $("#bigRoadGrid");
  const beadPlate = $("#beadPlate");
  const trendStrip = $("#trendStrip");
  if (!bigRoadGrid || !beadPlate || !trendStrip) return;

  renderBigRoad(bigRoadGrid);
  renderBeadPlate(beadPlate);
  renderTrendStrip(trendStrip);
  $("#roadSummary").textContent = roadSummary();
  $("#trendSummary").textContent = trendSummary();
}

function renderBigRoad(container) {
  container.innerHTML = "";
  const cells = buildBigRoad(baccaratHistory());
  const maxCol = Math.max(12, ...cells.map((cell) => cell.col + 1), 0);
  const visibleStart = Math.max(0, maxCol - 18);
  const cellMap = new Map(cells.map((cell) => [`${cell.col - visibleStart}:${cell.row}`, cell]));

  for (let col = visibleStart; col < maxCol; col += 1) {
    for (let row = 0; row < 6; row += 1) {
      const cell = cellMap.get(`${col - visibleStart}:${row}`);
      container.appendChild(roadCell(cell));
    }
  }
}

function buildBigRoad(history) {
  const chronological = [...history].reverse();
  const cells = [];
  let col = 0;
  let row = 0;
  let lastWinner = null;
  let lastCell = null;
  const occupied = new Set();

  for (const item of chronological) {
    if (item.winner === "T") {
      if (lastCell) lastCell.ties = (lastCell.ties || 0) + 1;
      else {
        cells.push({ ...item, winner: "T", row: 0, col: 0, ties: 1 });
        occupied.add("0:0");
      }
      continue;
    }

    if (!lastWinner) {
      col = 0;
      row = 0;
    } else if (item.winner === lastWinner) {
      const nextKey = `${col}:${row + 1}`;
      if (row < 5 && !occupied.has(nextKey)) {
        row += 1;
      } else {
        col += 1;
      }
    } else {
      col += 1;
      row = 0;
    }

    const cell = { ...item, row, col, ties: 0 };
    cells.push(cell);
    occupied.add(`${col}:${row}`);
    lastWinner = item.winner;
    lastCell = cell;
  }

  return cells;
}

function roadCell(cell) {
  const div = document.createElement("div");
  if (!cell) {
    div.className = "road-cell empty";
    return div;
  }
  const pair = cell.playerPair || cell.bankerPair ? " pair" : "";
  const natural = cell.natural ? " natural" : "";
  const tie = cell.ties ? " tie" : "";
  div.className = `road-cell ${cell.winner}${pair}${natural}${tie}`;
  div.textContent = cell.winner;
  if (cell.ties > 1) {
    const count = document.createElement("span");
    count.className = "tie-count";
    count.textContent = cell.ties;
    div.appendChild(count);
  }
  return div;
}

function renderBeadPlate(container) {
  container.innerHTML = "";
  const items = [...baccaratHistory()].reverse().slice(-42);
  for (let index = 0; index < 42; index += 1) {
    const item = items[index];
    const div = document.createElement("div");
    if (!item) {
      div.className = "bead-cell empty";
    } else {
      const pair = item.playerPair || item.bankerPair ? " pair" : "";
      const natural = item.natural ? " natural" : "";
      div.className = `bead-cell ${item.winner}${pair}${natural}`;
      div.textContent = item.winner;
    }
    container.appendChild(div);
  }
}

function renderTrendStrip(container) {
  container.innerHTML = "";
  baccaratHistory().slice(0, 20).reverse().forEach((item) => {
    const chip = document.createElement("div");
    chip.className = `trend-chip ${item.winner}`;
    chip.textContent = item.winner;
    container.appendChild(chip);
  });
}

function roadSummary() {
  const history = baccaratHistory();
  if (!history.length) return "まだ履歴なし";
  const recent = history.slice(0, 12);
  const p = recent.filter((item) => item.winner === "P").length;
  const b = recent.filter((item) => item.winner === "B").length;
  const t = recent.filter((item) => item.winner === "T").length;
  return `直近 P${p} / B${b} / T${t}`;
}

function trendSummary() {
  const history = baccaratHistory();
  if (!history.length) return "-";
  const latest = history[0].winner;
  let streak = 0;
  for (const item of history) {
    if (item.winner !== latest) break;
    streak += 1;
  }
  const label = latest === "P" ? "PLAYER" : latest === "B" ? "BANKER" : "TIE";
  return `${label} ${streak}連続`;
}

function renderHistory() {
  const list = $("#historyList");
  list.innerHTML = "";
  if (!state.history.length) {
    list.innerHTML = `<div class="history-item"><strong>-</strong><span>まだ履歴がありません</span><b>0</b></div>`;
    return;
  }

  state.history.slice(0, 24).forEach((item, index) => {
    const row = document.createElement("div");
    const resultClass = item.net >= 0 ? "win" : "loss";
    if (item.sport && item.sport !== "baccarat") {
      row.className = "history-item";
      row.innerHTML = `
        <strong>${state.history.length - index}R</strong>
        <span>${SPORTS[item.sport].label} / ${item.winnerNumber} ${item.winnerName} / ${formatOdds(item.odds)}倍</span>
        <b class="${resultClass}">${item.net >= 0 ? "+" : "-"}${formatPlain(Math.abs(item.net))}</b>
      `;
      list.appendChild(row);
      return;
    }
    const badges = [
      item.natural ? "NATURAL" : "",
      item.playerPair ? "P PAIR" : "",
      item.bankerPair ? "B PAIR" : ""
    ].filter(Boolean).join(" / ");
    row.className = "history-item";
    row.innerHTML = `
      <strong>${state.history.length - index}R</strong>
      <span>${item.label} / P${item.playerTotal} - B${item.bankerTotal}${badges ? ` / ${badges}` : ""}</span>
      <b class="${resultClass}">${item.net >= 0 ? "+" : "-"}${formatPlain(Math.abs(item.net))}</b>
    `;
    list.appendChild(row);
  });
}

function renderAchievements() {
  const grid = $("#achievementGrid");
  if (!grid) return;
  const unlocked = new Set(meta.unlockedAchievements);
  const count = unlocked.size;
  $("#achievementSummary").textContent = `${count} / ${ACHIEVEMENTS.length} 解除`;
  $("#achievementProgressFill").style.width = `${(count / ACHIEVEMENTS.length) * 100}%`;
  grid.innerHTML = "";

  for (const achievement of ACHIEVEMENTS) {
    const isUnlocked = unlocked.has(achievement.id);
    const item = document.createElement("div");
    item.className = `achievement-item${isUnlocked ? "" : " locked"}`;
    item.innerHTML = `
      <div class="badge-icon">${achievement.icon}</div>
      <div><strong>${isUnlocked ? achievement.title : `未解除：${achievement.title}`}</strong><span>${achievement.desc}</span></div>
      <em>${isUnlocked ? "解除済" : "LOCK"}</em>
    `;
    grid.appendChild(item);
  }
}

function renderSparkline() {
  const chart = $("#sparkline");
  chart.innerHTML = "";
  const trace = state.bankrollTrace.slice(-28);
  const min = Math.min(...trace, START_BANKROLL);
  const max = Math.max(...trace, START_BANKROLL + 1);
  trace.forEach((value) => {
    const bar = document.createElement("div");
    const height = 8 + ((value - min) / (max - min)) * 106;
    bar.className = "spark-bar";
    bar.style.height = `${height}px`;
    chart.appendChild(bar);
  });
}

function addBet(key) {
  if (isRaceSport()) return;
  selectedBetKey = key;
  const total = sumBets(activeBets);
  if (total + currentChip > state.bankroll) {
    pulseDeal("所持金不足");
    playTone("danger");
    return;
  }
  activeBets[key] += currentChip;
  playTone("bet");
  vibrate(12);
  render();
}

function allInBet() {
  if (isDealing || state.status !== "playing") return;
  if (isRaceSport()) {
    if (isRaceRunning) return;
    const selected = selectedRaceParticipant();
    if (!selected) {
      pulseDeal("選手を選択");
      playTone("danger");
      return;
    }
    const remaining = state.bankroll - sumRaceBets();
    if (remaining <= 0) {
      pulseDeal("全額ベット中");
      playTone("danger");
      return;
    }
    state.raceBets = { [selected.id]: (state.raceBets[selected.id] || 0) + remaining };
    pulseDeal("オールイン");
    playTone("allin");
    vibrate([45, 30, 45]);
    createBurst(["#ffd773", "#ff453a", "#ffffff"], 26);
    render();
    return;
  }
  const remaining = state.bankroll - sumBets(activeBets);
  if (remaining <= 0) {
    pulseDeal("全額ベット中");
    playTone("danger");
    return;
  }
  activeBets[selectedBetKey] += remaining;
  pulseDeal("オールイン");
  playTone("allin");
  vibrate([45, 30, 45]);
  createBurst(["#ffd773", "#ff453a", "#ffffff"], 26);
  render();
}

function pulseDeal(text) {
  const label = $("#dealButtonText");
  const original = label.textContent;
  label.textContent = text;
  window.setTimeout(() => {
    label.textContent = original;
  }, 900);
}

function beginRound() {
  if (isRaceSport()) {
    beginRace();
    return;
  }
  const total = sumBets(activeBets);
  if (!total || total > state.bankroll || isDealing) {
    playTone("danger");
    return;
  }

  const allInRound = total === state.bankroll;
  previousBets = { ...activeBets };
  pendingRound = dealRound();
  displayedRound = pendingRound;
  visibleCards = new Set();
  revealedCards = new Set();
  activeCardId = null;
  state.bankroll -= total;
  isDealing = true;
  roundToken += 1;
  $("#dealButtonText").textContent = "配牌中";
  $("#dealerMessage").textContent = "カードを配ります";
  playTone(allInRound ? "allin" : "deal");
  vibrate(20);
  render();
  playDealSequence(roundToken);
}

async function beginRace() {
  const race = ensureRace();
  const total = sumRaceBets();
  if (!race || !total || total > state.bankroll || isRaceRunning || isDealing) {
    playTone("danger");
    return;
  }

  const winner = pickRaceWinner(race);
  const settlement = resolveRace(race, { ...state.raceBets }, winner);
  state.previousRaceBets = { ...state.raceBets };
  state.bankroll -= total;
  isRaceRunning = true;
  raceMood = "発走前";
  raceToken += 1;
  race.result = null;
  raceProgress = Object.fromEntries(race.participants.map((entry) => [entry.id, 0]));
  $("#dealButtonText").textContent = "出走中";
  $("#raceCommentary").textContent = `${SPORTS[race.sport].label}スタート。単勝${formatPlain(total)}円、人生の向こう正面へ。`;
  playTone("raceStart");
  startBgm(race.sport);
  vibrate(25);
  render();
  await playRaceCountdown(raceToken, race);
  playRaceAnimation(raceToken, race, winner, settlement);
}

async function playRaceCountdown(token, race) {
  const labels = ["3", "2", "1", race.sport === "boat" ? "スタート!" : "出走!"];
  for (const label of labels) {
    if (token !== raceToken || !isRaceRunning) return;
    $("#raceCommentary").textContent = `${race.name} ${label}`;
    createFloatingCaption(label, label === "出走!" || label === "スタート!" ? "#ffd773" : "#34e5ff");
    playTone(label === "出走!" || label === "スタート!" ? "raceStart" : "raceTick");
    await delay(label.length > 1 ? 520 : 620);
  }
}

async function playRaceAnimation(token, race, winner, settlement) {
  const duration = 15_000;
  const tick = 500;
  const steps = duration / tick;
  const eventEvery = 5;
  const eventPool = RACE_EVENTS[race.sport] || [];
  const offsets = Object.fromEntries(race.participants.map((entry) => [entry.id, Math.random() * 12]));

  for (let step = 1; step <= steps; step += 1) {
    if (token !== raceToken || !isRaceRunning) return;
    const t = step / steps;
    race.participants.forEach((entry) => {
      const isWinner = entry.id === winner.id;
      const wave = Math.sin((t * 8 + offsets[entry.id]) * Math.PI) * (isWinner ? 5 : 8);
      const noise = (Math.random() - 0.5) * (isWinner ? 4 : 9);
      const latePush = isWinner ? Math.pow(t, 3) * 18 : -Math.pow(t, 4) * (4 + Math.random() * 10);
      const cap = isWinner ? 97 : 88 + Math.random() * 4;
      raceProgress[entry.id] = Math.max(0, Math.min(cap, t * 78 + wave + noise + latePush));
    });
    if (step > steps - 4) {
      raceProgress[winner.id] = 82 + (step - (steps - 4)) * 4.4;
    }
    updateRaceProgressDom();
    if (step % eventEvery === 0) {
      const line = eventPool[(step / eventEvery - 1) % eventPool.length] || "勝負どころ。ラスワンの呼吸だけが荒い。";
      $("#raceCommentary").textContent = line;
      raceMood = raceMoodForLine(line, t);
      triggerRaceMidEvent(line);
      playTone("raceTick");
    }
    if (step % 2 === 0) renderRaceBroadcast(race);
    await delay(tick);
  }

  if (token !== raceToken || !isRaceRunning) return;
  raceProgress[winner.id] = 98;
  raceMood = "写真判定";
  race.participants.forEach((entry) => {
    if (entry.id !== winner.id) raceProgress[entry.id] = Math.min(raceProgress[entry.id] || 0, 91 - Math.random() * 8);
  });
  updateRaceProgressDom();
  await delay(700);
  settleRace(race, settlement);
}

function updateRaceProgressDom() {
  $$(".race-lane").forEach((lane, index) => {
    const race = state.currentRace;
    const entry = race?.participants[index];
    const runner = lane.querySelector(".race-runner");
    if (entry && runner) runner.style.setProperty("--race-progress", `${raceProgress[entry.id] || 0}%`);
    lane.classList.toggle("leader", entry && leaderEntryId() === entry.id);
  });
  renderRaceBroadcast();
}

function raceMoodForLine(line, t) {
  if (line.includes("隕石")) return "異常気象";
  if (line.includes("ニンジン")) return "人参反応";
  if (line.includes("海パン") || line.includes("波") || line.includes("水")) return "水温注意";
  if (line.includes("ベル") || line.includes("ジャン")) return "鐘鳴り";
  if (t > 0.78) return "最終勝負";
  if (t > 0.48) return "差し合い";
  return "序盤牽制";
}

function leaderEntryId() {
  return leaderEntry()?.id || null;
}

function settleRace(race, settlement) {
  const winner = settlement.winner;
  state.bankroll += settlement.returned;
  state.sessionProfit += settlement.net;
  state.rounds += 1;
  if (settlement.net > 0) {
    state.wins += 1;
    state.streak += 1;
  } else {
    state.streak = 0;
  }
  state.bestStreak = Math.max(state.bestStreak, state.streak);
  state.maxBankroll = Math.max(state.maxBankroll, state.bankroll);
  state.bankrollTrace.push(state.bankroll);
  state.bankrollTrace = state.bankrollTrace.slice(-120);

  race.result = { winnerId: winner.id };
  state.history.unshift({
    sport: race.sport,
    winner: "R",
    winnerNumber: winner.number,
    winnerName: winner.name,
    odds: winner.odds,
    label: `${SPORTS[race.sport].label} ${winner.number} ${winner.name}`,
    net: settlement.net,
    bankroll: state.bankroll,
    createdAt: Date.now()
  });
  state.history = state.history.slice(0, 100);
  isRaceRunning = false;
  $("#dealButtonText").textContent = "レース開始";
  $("#raceCommentary").textContent = settlement.net > 0
    ? `${winner.number} ${winner.name}が差し切り。ラスワン、泳ぐ距離が少し縮む。`
    : `${winner.number} ${winner.name}が勝利。買ってない勝者ほどよく伸びる。`;
  showRaceResult(race, settlement);
  playTone(settlement.net > 0 ? "win" : "lose");
  triggerRaceEffects(race, settlement);
  logRace(race, settlement);
  state.currentRace = createRace(race.sport);
  state.raceBets = {};
  state.selectedRaceId = state.currentRace.participants[0]?.id || null;
  raceProgress = {};
  raceMood = settlement.net > 0 ? "的中余韻" : "反省会";
  render();
  checkEnding();
}

function showRaceResult(race, settlement) {
  const winner = settlement.winner;
  $("#resultHero").textContent = `${winner.number} ${winner.name} WIN`;
  $("#resultPlayerScore").textContent = SPORTS[race.sport].label;
  $("#resultBankerScore").textContent = `${formatOdds(winner.odds)}倍`;
  $("#resultProfit").textContent = `${settlement.net >= 0 ? "+" : "-"}${formatPlain(Math.abs(settlement.net))}円`;
  $("#resultProfit").classList.toggle("loss", settlement.net < 0);
  $("#resultCharacter").src = settlement.net > 0
    ? "assets/characters/lastone-laughing.png"
    : "assets/characters/lastone-crying.png";
  $("#resultComment").textContent = settlement.net > 0
    ? sample(WIN_COMMENTS)
    : sample(LOSE_COMMENTS);
  const rows = Object.entries(settlement.outcomes).map(([, item]) => {
    const delta = item.payout - item.stake;
    return `<div><span>${item.name} ${formatOdds(item.odds)}倍 ${item.status === "win" ? "的中" : "ハズレ"}</span><b>${delta >= 0 ? "+" : "-"}${formatPlain(Math.abs(delta))}</b></div>`;
  });
  $("#resultBreakdown").innerHTML = rows.join("") || "<div><span>単勝なし</span><b>0</b></div>";
  $("#resultOverlay").classList.add("open");
  $("#resultOverlay").setAttribute("aria-hidden", "false");
}

function triggerRaceEffects(race, settlement) {
  createScreenFlash();
  createBurst(settlement.net > 0 ? ["#ffd773", "#34e5ff", "#79ff9d"] : ["#ff453a", "#b64cff", "#ffffff"], settlement.net > 0 ? 30 : 18);
  if (settlement.net < 0) createFloatingCaption(sample(["泳いで帰国?", "タイミー?", "海パン?", "負けサビ増殖"]), "#ff837a");
}

function triggerRaceMidEvent(line) {
  const lower = line;
  if (lower.includes("隕石")) {
    createFloatingCaption("隕石落下", "#ff453a");
    createTrackShockwave();
    return;
  }
  if (lower.includes("ニンジン")) {
    createFloatingCaption("人参ブースト", "#ffd773");
    createTrackSpark("#ffd773");
    return;
  }
  if (lower.includes("海パン") || lower.includes("波")) {
    createFloatingCaption("水温確認", "#34e5ff");
    createTrackSpark("#34e5ff");
    return;
  }
  if (lower.includes("ベル") || lower.includes("ジャン")) {
    createFloatingCaption("鐘だけ一流", "#b64cff");
    createTrackSpark("#b64cff");
    return;
  }
  if (Math.random() < 0.35) createTrackSpark("#ffd773");
}

function createTrackSpark(color) {
  const stage = $("#raceStage");
  if (!stage) return;
  const spark = document.createElement("div");
  spark.className = "track-spark";
  spark.style.setProperty("--spark-color", color);
  stage.appendChild(spark);
  window.setTimeout(() => spark.remove(), 900);
}

function createTrackShockwave() {
  const stage = $("#raceStage");
  if (!stage) return;
  const wave = document.createElement("div");
  wave.className = "track-shockwave";
  stage.appendChild(wave);
  window.setTimeout(() => wave.remove(), 1000);
}

async function playDealSequence(token) {
  for (const step of pendingRound.sequence) {
    if (token !== roundToken || !pendingRound) return;
    const card = pendingRound[step.side][step.index];
    activeCardId = card.id;
    visibleCards.add(card.id);
    $("#dealerMessage").textContent = `${step.label}を配る`;
    renderCards(pendingRound);
    playTone("deal");
    await delay(420);

    if (token !== roundToken || !pendingRound) return;
    revealedCards.add(card.id);
    $("#dealerMessage").textContent = `${step.label}をオープン`;
    renderCards(pendingRound);
    playTone("reveal");
    await delay(620);
  }

  if (token !== roundToken || !pendingRound) return;
  activeCardId = null;
  $("#dealerMessage").textContent = "勝敗を判定中";
  renderCards(pendingRound);
  await delay(520);
  settlePendingRound();
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function settlePendingRound() {
  if (!pendingRound) return;
  const settlement = resolveRound(pendingRound, activeBets);
  lastSettlement = settlement;
  state.bankroll += settlement.returned;
  state.sessionProfit += settlement.net;
  state.rounds += 1;

  if (settlement.net > 0) {
    state.wins += 1;
    state.streak += 1;
  } else {
    state.streak = 0;
  }

  state.bestStreak = Math.max(state.bestStreak, state.streak);
  state.maxBankroll = Math.max(state.maxBankroll, state.bankroll);
  state.bankrollTrace.push(state.bankroll);

  const label = pendingRound.winner === "P" ? "PLAYER WIN" : pendingRound.winner === "B" ? "BANKER WIN" : "TIE";
  state.history.unshift({
    winner: pendingRound.winner,
    label,
    playerTotal: pendingRound.playerTotal,
    bankerTotal: pendingRound.bankerTotal,
    net: settlement.net,
    bankroll: state.bankroll,
    natural: pendingRound.natural,
    playerPair: settlement.playerPair,
    bankerPair: settlement.bankerPair,
    createdAt: pendingRound.createdAt
  });
  state.history = state.history.slice(0, 80);
  state.bankrollTrace = state.bankrollTrace.slice(-120);
  const unlockedNow = evaluateAchievements(pendingRound, settlement, previousBets);

  displayedRound = pendingRound;
  visibleCards = new Set([...pendingRound.player, ...pendingRound.banker].map((card) => card.id));
  revealedCards = new Set([...visibleCards]);
  pendingRound = null;
  isDealing = false;
  activeBets = blankBets();
  $("#dealButtonText").textContent = "ベット確定";
  $("#dealerMessage").textContent = resultText(displayedRound, settlement);
  showResult(displayedRound, settlement, unlockedNow);
  playTone(settlement.net >= 0 ? "win" : "lose");
  vibrate(settlement.net >= 0 ? [30, 45, 30] : [80]);
  triggerRoundEffects(displayedRound, settlement, unlockedNow);
  triggerBaccaratFlavor(displayedRound, settlement);
  queueAchievementToasts(unlockedNow);
  logRound(displayedRound, settlement);
  render();
  checkEnding();
}

function triggerBaccaratFlavor(round, settlement) {
  if (Math.random() < 0.62 || round.natural || Math.abs(settlement.net) >= 500_000) {
    createFloatingCaption(sample(BACCARAT_CHAOS_EVENTS), settlement.net >= 0 ? "#ffd773" : "#ff837a");
  }
}

function resultText(round, settlement) {
  const side = round.winner === "P" ? "プレイヤー" : round.winner === "B" ? "バンカー" : "タイ";
  const money = `${settlement.net >= 0 ? "+" : "-"}${formatPlain(Math.abs(settlement.net))}円`;
  return `${side}勝利 / 今回 ${money}`;
}

function showResult(round, settlement, unlockedNow = []) {
  const label = round.winner === "P" ? "PLAYER WIN" : round.winner === "B" ? "BANKER WIN" : "TIE";
  $("#resultHero").textContent = label;
  $("#resultPlayerScore").textContent = round.playerTotal;
  $("#resultBankerScore").textContent = round.bankerTotal;
  $("#resultProfit").textContent = `${settlement.net >= 0 ? "+" : "-"}${formatPlain(Math.abs(settlement.net))}円`;
  $("#resultProfit").classList.toggle("loss", settlement.net < 0);
  $("#resultCharacter").src = settlement.net > 0
    ? "assets/characters/lastone-laughing.png"
    : settlement.net < 0
      ? "assets/characters/lastone-crying.png"
      : "assets/characters/lastone-smug.png";
  $("#resultComment").textContent = resultComment(settlement);

  const specialRows = [
    round.natural ? `<div><span>NATURAL ${Math.max(round.initialPlayer, round.initialBanker)}</span><b>実績チャンス</b></div>` : "",
    settlement.outcomes.bigTiger?.status === "win" ? `<div><span>BIG TIGER</span><b>咆哮</b></div>` : "",
    settlement.outcomes.smallTiger?.status === "win" ? `<div><span>SMALL TIGER</span><b>閃光</b></div>` : "",
    settlement.outcomes.playerPair?.status === "win" ? `<div><span>P PAIR</span><b>ペア的中</b></div>` : "",
    settlement.outcomes.bankerPair?.status === "win" ? `<div><span>B PAIR</span><b>ペア的中</b></div>` : "",
    unlockedNow.length ? `<div><span>実績解除</span><b>${unlockedNow.length}個</b></div>` : ""
  ].filter(Boolean);
  const rows = Object.entries(settlement.outcomes).map(([key, item]) => {
    const status = item.status === "win" ? "的中" : item.status === "push" ? "プッシュ" : "ハズレ";
    const delta = item.payout - item.stake;
    return `<div><span>${BETS[key].label} ${status}</span><b>${delta >= 0 ? "+" : "-"}${formatPlain(Math.abs(delta))}</b></div>`;
  });
  $("#resultBreakdown").innerHTML = [...specialRows, ...rows].join("") || "<div><span>ベットなし</span><b>0</b></div>";
  $("#resultOverlay").classList.add("open");
  $("#resultOverlay").setAttribute("aria-hidden", "false");
}

function resultComment(settlement) {
  if (settlement.net < 0) return sample(LOSE_COMMENTS);
  if (settlement.net > 0) return sample(WIN_COMMENTS);
  return "引き分け。海も空港も、いったん保留。";
}

function sample(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function evaluateAchievements(round, settlement, bets) {
  const unlocked = new Set(meta.unlockedAchievements);
  const newlyUnlocked = [];
  for (const achievement of ACHIEVEMENTS) {
    if (unlocked.has(achievement.id)) continue;
    if (achievement.check({ state, meta, round, settlement, bets })) {
      unlocked.add(achievement.id);
      newlyUnlocked.push(achievement);
    }
  }
  if (newlyUnlocked.length) {
    meta.unlockedAchievements = [...unlocked];
    saveMeta();
  }
  return newlyUnlocked;
}

function queueAchievementToasts(achievements) {
  achievements.slice(0, 4).forEach((achievement, index) => {
    window.setTimeout(() => showAchievementToast(achievement), index * 900);
  });
}

function showAchievementToast(achievement) {
  const toast = $("#achievementToast");
  $("#achievementToastTitle").textContent = achievement.title;
  $("#achievementToastDesc").textContent = achievement.desc;
  toast.classList.remove("show");
  toast.setAttribute("aria-hidden", "false");
  void toast.offsetWidth;
  toast.classList.add("show");
  window.setTimeout(() => toast.setAttribute("aria-hidden", "true"), 3600);
}

function triggerRoundEffects(round, settlement, unlockedNow) {
  const sideHit = settlement.outcomes.bigTiger?.status === "win"
    || settlement.outcomes.smallTiger?.status === "win"
    || settlement.outcomes.playerPair?.status === "win"
    || settlement.outcomes.bankerPair?.status === "win";
  const special = round.natural || settlement.net >= 1_000_000 || sideHit || unlockedNow.length;
  if (!special) return;
  const colors = round.natural
    ? ["#ffd773", "#ffffff", "#34e5ff"]
    : settlement.net >= 1_000_000
      ? ["#ffd773", "#ff453a", "#b64cff"]
      : ["#20d466", "#34e5ff", "#ffd773"];
  createScreenFlash();
  createBurst(colors, round.natural ? 30 : 22);
}

function createScreenFlash() {
  const flash = document.createElement("div");
  flash.className = "screen-flash";
  $("#fxLayer").appendChild(flash);
  window.setTimeout(() => flash.remove(), 800);
}

function createBurst(colors, count) {
  const layer = $("#fxLayer");
  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement("span");
    particle.className = "fx-burst";
    particle.style.setProperty("--angle", `${(360 / count) * i + Math.random() * 10}deg`);
    particle.style.setProperty("--distance", `${120 + Math.random() * 160}px`);
    particle.style.setProperty("--fx-color", colors[i % colors.length]);
    layer.appendChild(particle);
    window.setTimeout(() => particle.remove(), 1000);
  }
}

function createFloatingCaption(text, color = "#ffd773") {
  const caption = document.createElement("div");
  caption.className = "floating-caption";
  caption.textContent = text;
  caption.style.setProperty("--caption-color", color);
  $("#fxLayer").appendChild(caption);
  window.setTimeout(() => caption.remove(), 1800);
}

function checkEnding() {
  if (state.bankroll >= GOAL_BANKROLL) {
    state.status = "cleared";
    meta.clearCount += 1;
    if (meta.currentAttemptOfficial) meta.officialClears += 1;
    if (!meta.bestClearRounds || state.rounds < meta.bestClearRounds) meta.bestClearRounds = state.rounds;
    $("#endingTitle").textContent = "到達おめでとうございます";
    $("#endingMessage").textContent = `${meta.attemptNumber}回目の挑戦、${state.rounds}勝負で1億到達。ラスワンの負けサビ、ついに支払い能力を持つ。`;
    $("#endingMoney").textContent = formatYen(state.bankroll);
    stopEndingTicker();
    $("#proofText").textContent = meta.currentAttemptOfficial
      ? `公式${meta.officialAttemptsUsed}/10回以内クリア / 証明ID ${proofCode()}`
      : `リベンジクリア / 証明ID ${proofCode()}`;
    $("#shareResult").textContent = "クリアをXに投稿";
    $("#restartGame").textContent = attemptsLeft() > 0 ? "次の公式挑戦へ" : "リベンジでもう一度";
    $("#endingOverlay").classList.add("open");
    $("#endingOverlay").setAttribute("aria-hidden", "false");
    updateOfficialProfile();
    syncPlayer();
  }

  if (state.bankroll <= 0) {
    state.status = "bankrupt";
    const failure = sample(FAILURE_ENDINGS);
    $("#endingTitle").textContent = failure.title;
    $("#endingMessage").textContent = `${meta.attemptNumber}回目の挑戦は${state.rounds}勝負で終了。${failure.text}`;
    $("#endingMoney").textContent = formatYen(state.maxBankroll);
    $("#proofText").textContent = meta.currentAttemptOfficial
      ? `公式${meta.officialAttemptsUsed}/10回目終了 / 証明ID ${proofCode()}`
      : `リベンジ終了 / 証明ID ${proofCode()}`;
    $("#shareResult").textContent = "負けをXに投稿";
    $("#restartGame").textContent = attemptsLeft() > 0 ? "次の公式挑戦へ" : "リベンジでもう一度";
    startEndingTicker();
    $("#endingOverlay").classList.add("open");
    $("#endingOverlay").setAttribute("aria-hidden", "false");
    syncPlayer();
  }
}

function startEndingTicker() {
  stopEndingTicker();
  const ticker = $("#endingTicker");
  if (!ticker) return;
  const lines = shuffle([...BANKRUPT_TICKER_LINES, ...LOSE_COMMENTS]).slice(0, 10);
  let index = 0;
  const renderLine = () => {
    ticker.textContent = lines[index % lines.length];
    ticker.classList.remove("pulse");
    ticker.setAttribute("aria-hidden", "false");
    void ticker.offsetWidth;
    ticker.classList.add("pulse");
    index += 1;
  };
  renderLine();
  endingTickerTimer = window.setInterval(renderLine, 1800);
}

function stopEndingTicker() {
  if (endingTickerTimer) window.clearInterval(endingTickerTimer);
  endingTickerTimer = null;
  const ticker = $("#endingTicker");
  if (ticker) {
    ticker.textContent = "";
    ticker.classList.remove("pulse");
    ticker.setAttribute("aria-hidden", "true");
  }
}

function startNewAttempt(openVenueAfterReset = true) {
  stopEndingTicker();
  meta.attemptNumber += 1;
  meta.currentAttemptId = createId();
  meta.currentAttemptStartedAt = new Date().toISOString();
  meta.currentAttemptOfficial = false;
  meta.currentAttemptConsumed = false;
  state = newGameState();
  activeBets = blankBets();
  previousBets = blankBets();
  selectedBetKey = "banker";
  pendingRound = null;
  displayedRound = null;
  lastSettlement = null;
  visibleCards = new Set();
  revealedCards = new Set();
  activeCardId = null;
  isDealing = false;
  roundToken += 1;
  shoe = buildShoe();
  stopBgm();
  $("#endingOverlay").classList.remove("open");
  $("#resultOverlay").classList.remove("open");
  $("#drawer").classList.remove("open");
  closeVenueSelect();
  $("#dealButtonText").textContent = "ベット確定";
  $("#dealerMessage").textContent = "ベットしてカードを配る";
  syncPlayer();
  render();
  if (openVenueAfterReset) openVenueSelect();
}

function playTone(kind) {
  if (!soundEnabled) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  audioCtx ||= new AudioContext();
  const ctx = audioCtx;
  if (ctx.state === "suspended") ctx.resume();
  const patterns = {
    tap: { notes: [520], type: "sine", volume: 0.018, step: 0.04, hold: 0.07 },
    chip: { notes: [640, 760], type: "triangle", volume: 0.028, step: 0.05, hold: 0.09 },
    bet: { notes: [420, 620], type: "triangle", volume: 0.035, step: 0.05, hold: 0.11 },
    clear: { notes: [240, 190], type: "sawtooth", volume: 0.026, step: 0.06, hold: 0.12 },
    panel: { notes: [360, 540], type: "sine", volume: 0.026, step: 0.06, hold: 0.11 },
    start: { notes: [392, 523, 659, 784], type: "triangle", volume: 0.045, step: 0.08, hold: 0.15 },
    allin: { notes: [196, 392, 784, 988], type: "sawtooth", volume: 0.05, step: 0.075, hold: 0.18 },
    deal: { notes: [330, 440], type: "triangle", volume: 0.032, step: 0.06, hold: 0.11 },
    reveal: { notes: [760, 580], type: "sine", volume: 0.022, step: 0.035, hold: 0.08 },
    win: { notes: [523, 659, 784, 1046], type: "triangle", volume: 0.052, step: 0.08, hold: 0.17 },
    lose: { notes: [220, 175, 147], type: "sawtooth", volume: 0.04, step: 0.1, hold: 0.2 },
    story: { notes: [196, 247, 330, 392], type: "triangle", volume: 0.032, step: 0.12, hold: 0.22 },
    raceStart: { notes: [196, 392, 587, 784], type: "sawtooth", volume: 0.044, step: 0.065, hold: 0.14 },
    raceTick: { notes: [330, 392, 330], type: "square", volume: 0.02, step: 0.05, hold: 0.08 },
    danger: { notes: [120, 120], type: "square", volume: 0.03, step: 0.08, hold: 0.1 }
  };
  const pattern = patterns[kind] || patterns.tap;
  pattern.notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = pattern.type;
    osc.frequency.value = freq;
    const start = ctx.currentTime + index * pattern.step;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(pattern.volume, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + pattern.hold);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + pattern.hold + 0.02);
  });
}

function startBgm(kind) {
  if (!soundEnabled) return;
  if (bgmKind === kind && bgmTimer) return;
  stopBgm();
  bgmKind = kind;
  const patterns = {
    story: { tempo: 720, bass: [98, 110, 123, 98], lead: [196, 247, 330, 392, 330, 247], type: "triangle" },
    baccarat: { tempo: 360, bass: [82, 98, 110, 123], lead: [220, 330, 392, 440, 392, 330], type: "sawtooth" },
    horse: { tempo: 240, bass: [98, 147, 110, 165], lead: [294, 440, 392, 494, 587, 440, 330, 392], type: "triangle" },
    boat: { tempo: 260, bass: [73, 98, 110, 98], lead: [196, 294, 330, 392, 330, 260, 294, 220], type: "sine" },
    keirin: { tempo: 220, bass: [82, 130, 146, 164], lead: [260, 390, 520, 586, 659, 520, 390, 329], type: "square" }
  };
  const pattern = patterns[kind] || patterns.baccarat;
  let step = 0;
  bgmTimer = window.setInterval(() => {
    const bass = pattern.bass[Math.floor(step / 4) % pattern.bass.length];
    const lead = pattern.lead[step % pattern.lead.length];
    if (step % 2 === 0) playChord([bass, bass * 2], 0.009, kind === "story" ? 0.42 : 0.16, pattern.type);
    if (step % 4 === 1 || step % 8 === 5) playChord([lead], 0.008, 0.12, kind === "keirin" ? "square" : "triangle");
    if (kind !== "story" && step % 4 === 2) playNoise(kind === "boat" ? 0.012 : 0.007, kind === "boat" ? 0.18 : 0.06);
    if (kind === "horse" && step % 8 === 6) playChord([196, 294], 0.007, 0.09, "square");
    step += 1;
  }, pattern.tempo);
}

function stopBgm() {
  if (bgmTimer) window.clearInterval(bgmTimer);
  bgmTimer = null;
  bgmKind = null;
}

function playChord(notes, volume, hold, type = "triangle") {
  if (!soundEnabled) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  audioCtx ||= new AudioContext();
  const ctx = audioCtx;
  if (ctx.state === "suspended") ctx.resume();
  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const start = ctx.currentTime + index * 0.025;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + hold);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + hold + 0.05);
  });
}

function playNoise(volume = 0.008, hold = 0.08) {
  if (!soundEnabled) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  audioCtx ||= new AudioContext();
  const ctx = audioCtx;
  if (ctx.state === "suspended") ctx.resume();
  const bufferSize = Math.floor(ctx.sampleRate * hold);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  const source = ctx.createBufferSource();
  const gain = ctx.createGain();
  source.buffer = buffer;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + hold);
  source.connect(gain).connect(ctx.destination);
  source.start();
  source.stop(ctx.currentTime + hold);
}

function vibrate(pattern) {
  if (vibeEnabled && navigator.vibrate) navigator.vibrate(pattern);
}

function preventMobileDoubleTapZoom() {
  let lastTouch = { time: 0, x: 0, y: 0, target: null };
  document.addEventListener("touchend", (event) => {
    const touch = event.changedTouches?.[0];
    if (!touch) return;
    const now = Date.now();
    const dx = touch.clientX - lastTouch.x;
    const dy = touch.clientY - lastTouch.y;
    const sameSpot = Math.hypot(dx, dy) < 24;
    const sameTarget = event.target === lastTouch.target || event.target?.closest("button") === lastTouch.target?.closest?.("button");
    if (now - lastTouch.time <= 320 && sameSpot && sameTarget) event.preventDefault();
    lastTouch = { time: now, x: touch.clientX, y: touch.clientY, target: event.target };
  }, { passive: false });
  document.addEventListener("dblclick", (event) => event.preventDefault(), { passive: false });
}

function openPanel(tab = "main") {
  playTone("panel");
  $(".panel-drawer").classList.add("open");
  $(".panel-drawer").setAttribute("aria-hidden", "false");
  $$(".tab-panel").forEach((panel) => panel.classList.remove("active"));
  $(`#panel-${tab}`).classList.add("active");
  $$(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.tab === tab));
}

async function startGameFlow(openRules = false) {
  if (!canStartAttempt()) {
    blockAttemptLimit();
    return;
  }
  if (supabaseReady() && !authReady) {
    $("#authHint").textContent = "認証確認中です。数秒待ってからもう一度押してください。";
    playTone("danger");
    return;
  }
  const allowed = await consumeOfficialAttempt();
  if (!allowed) {
    blockAttemptLimit();
    return;
  }
  if (!meta.storySeen) {
    await playOpeningStory();
    meta.storySeen = true;
    saveMeta();
  }
  titleSeen = true;
  localStorage.setItem(`${STORAGE_KEY}-title-seen`, "1");
  playTone("start");
  startBgm(currentSport());
  syncPlayer();
  render();
  openVenueSelect();
  if (openRules) openPanel("rules");
}

function playOpeningStory() {
  const overlay = $("#storyOverlay");
  const cinema = overlay.querySelector(".story-cinema");
  const progress = $("#storyProgress");
  const roll = $("#storyRollText");
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  if (roll) {
    roll.innerHTML = STORY_ROLL_LINES.map((line) => `<span>${line}</span>`).join("");
    roll.style.animation = "none";
    void roll.offsetWidth;
    roll.style.animation = "";
  }
  const started = Date.now();
  let lastScene = -1;
  playTone("story");
  startBgm("story");

  return new Promise((resolve) => {
    const timer = window.setInterval(() => {
      const elapsed = Date.now() - started;
      const ratio = Math.min(1, elapsed / STORY_DURATION_MS);
      const remaining = Math.max(0, Math.ceil((STORY_DURATION_MS - elapsed) / 1000));
      const sceneIndex = Math.min(STORY_SCENES.length - 1, Math.floor(ratio * STORY_SCENES.length));
      if (sceneIndex !== lastScene) {
        const scene = STORY_SCENES[sceneIndex];
        cinema?.style.setProperty("--story-scene", sceneIndex);
        cinema?.setAttribute("data-scene", String(sceneIndex + 1));
        $("#storySceneLabel").textContent = scene.label;
        $("#storyHeadline").textContent = scene.headline;
        $("#storyText").textContent = scene.text;
        $("#storyCharacter").src = `assets/characters/lastone-${scene.face}.png`;
        playTone("panel");
        lastScene = sceneIndex;
      }
      $("#storyTimer").textContent = remaining;
      progress.style.width = `${ratio * 100}%`;
      if (ratio >= 1) {
        window.clearInterval(timer);
        overlay.classList.remove("open");
        overlay.setAttribute("aria-hidden", "true");
        stopBgm();
        resolve();
      }
    }, 180);
  });
}

function selectSport(sport) {
  if (!SPORTS[sport] || isDealing || isRaceRunning || state.status !== "playing") {
    playTone("danger");
    return;
  }
  state.activeSport = sport;
  if (isRaceSport(sport)) ensureRace(true);
  raceMood = "通常";
  activeBets = blankBets();
  state.raceBets = {};
  selectedBetKey = sport === "baccarat" ? selectedBetKey : selectedBetKey;
  $("#resultOverlay").classList.remove("open");
  $("#resultOverlay").setAttribute("aria-hidden", "true");
  $("#raceCommentary").textContent = isRaceSport(sport)
    ? `${sportLabel(sport)}へ移動。単勝のみ、${raceExpectedReturnText()}。穴はちゃんと穴です。`
    : "バカラ卓へ戻りました。負けサビ本店、営業再開。";
  playTone("panel");
  startBgm(sport);
  closeVenueSelect();
  render();
}

function openVenueSelect() {
  if (isDealing || isRaceRunning || state.status !== "playing") return;
  $("#venueOverlay").classList.add("open");
  $("#venueOverlay").setAttribute("aria-hidden", "false");
  playTone("panel");
}

function closeVenueSelect() {
  $("#venueOverlay").classList.remove("open");
  $("#venueOverlay").setAttribute("aria-hidden", "true");
}

function supabaseReady() {
  return Boolean(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_PUBLISHABLE_KEY);
}

function authRedirectTo() {
  return `${location.origin}${location.pathname}`;
}

async function initAuth() {
  if (!supabaseReady() || !window.supabase?.createClient) {
    authReady = true;
    render();
    return;
  }

  supabaseClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });

  try {
    const { data } = await supabaseClient.auth.getSession();
    await applyAuthUser(data.session?.user || null);
    supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      await applyAuthUser(session?.user || null);
    });
  } catch (error) {
    console.warn("Auth init skipped:", error.message);
    authReady = true;
    render();
  }
}

async function applyAuthUser(user) {
  authUser = user;
  if (!user) {
    authProfile = null;
    authReady = true;
    render();
    return;
  }

  meta.authUserId = user.id;
  meta.authEmail = user.email || null;
  await loadOfficialProfile();
  authReady = true;
  saveMeta();
  render();
  syncPlayer();
  const pendingStart = sessionStorage.getItem(`${STORAGE_KEY}-pending-start`);
  if (pendingStart) {
    sessionStorage.removeItem(`${STORAGE_KEY}-pending-start`);
    startGameFlow(pendingStart === "rules");
  }
}

async function loadOfficialProfile() {
  if (!supabaseClient || !authUser) return;
  try {
    const { data, error } = await supabaseClient
      .from("challenge_profiles")
      .select("user_id,email,official_attempts_used,official_clears")
      .eq("user_id", authUser.id)
      .maybeSingle();
    if (error) throw error;
    if (data) {
      authProfile = data;
      meta.officialAttemptsUsed = data.official_attempts_used || 0;
      meta.officialClears = data.official_clears || 0;
      return;
    }
    const profile = {
      user_id: authUser.id,
      email: authUser.email || null,
      official_attempts_used: meta.officialAttemptsUsed || 0,
      official_clears: meta.officialClears || 0
    };
    await supabaseClient.from("challenge_profiles").insert(profile);
    authProfile = profile;
  } catch (error) {
    console.warn("Official profile skipped:", error.message);
  }
}

async function updateOfficialProfile() {
  if (!supabaseClient || !authUser) return;
  try {
    await supabaseClient
      .from("challenge_profiles")
      .upsert({
        user_id: authUser.id,
        email: authUser.email || null,
        official_attempts_used: meta.officialAttemptsUsed,
        official_clears: meta.officialClears,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" });
  } catch (error) {
    console.warn("Official profile update skipped:", error.message);
  }
}

async function consumeOfficialAttempt() {
  if (meta.currentAttemptConsumed) return true;
  if (meta.officialAttemptsUsed >= OFFICIAL_ATTEMPT_LIMIT) {
    meta.currentAttemptOfficial = false;
    meta.currentAttemptConsumed = true;
    saveMeta();
    render();
    return true;
  }

  if (supabaseReady() && authUser) {
    const allowed = await consumeRemoteOfficialAttempt();
    if (!allowed) {
      meta.currentAttemptOfficial = false;
      meta.currentAttemptConsumed = true;
      saveMeta();
      render();
      return true;
    }
  } else {
    meta.officialAttemptsUsed += 1;
    meta.currentAttemptOfficial = true;
  }

  meta.currentAttemptConsumed = true;
  saveMeta();
  render();
  return true;
}

async function consumeRemoteOfficialAttempt() {
  try {
    const { data, error } = await supabaseClient.rpc("consume_official_attempt");
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.allowed) {
      meta.officialAttemptsUsed = Number(row?.attempts_used ?? OFFICIAL_ATTEMPT_LIMIT);
      meta.currentAttemptOfficial = false;
      saveMeta();
      render();
      return false;
    }
    meta.officialAttemptsUsed = Number(row.attempts_used || meta.officialAttemptsUsed + 1);
    meta.officialClears = Number(row.official_clears || meta.officialClears);
    meta.currentAttemptOfficial = true;
    return true;
  } catch (error) {
    console.warn("Official attempt RPC skipped:", error.message);
    meta.officialAttemptsUsed += 1;
    meta.currentAttemptOfficial = true;
    await updateOfficialProfile();
    return true;
  }
}

async function loginWithGoogle() {
  if (!supabaseClient) {
    startGameFlow(false);
    return;
  }
  await supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: authRedirectTo() }
  });
}

async function loginWithEmail() {
  if (!supabaseClient) return;
  const email = $("#emailInput")?.value?.trim();
  if (!email) {
    playTone("danger");
    return;
  }
  const { error } = await supabaseClient.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: authRedirectTo() }
  });
  $("#authHint").textContent = error
    ? `メール送信に失敗: ${error.message}`
    : "確認メールを送りました。メールのリンクから戻ると公式挑戦できます。";
}

async function supabaseFetch(path, options = {}) {
  if (!supabaseReady()) return null;
  const base = CONFIG.SUPABASE_URL.replace(/\/$/, "");
  try {
    let bearer = CONFIG.SUPABASE_PUBLISHABLE_KEY;
    if (supabaseClient) {
      const { data } = await supabaseClient.auth.getSession();
      bearer = data.session?.access_token || bearer;
    }
    const response = await fetch(`${base}/rest/v1/${path}`, {
      ...options,
      headers: {
        apikey: CONFIG.SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${bearer}`,
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });
    if (!response.ok) throw new Error(`Supabase ${response.status}`);
    return response;
  } catch (error) {
    console.warn("Supabase sync skipped:", error.message);
    return null;
  }
}

function syncPlayer() {
  const payload = [{
    install_id: meta.installId,
    current_attempt_id: meta.currentAttemptId,
    attempt_number: meta.attemptNumber,
    bankroll: state.bankroll,
    max_bankroll: state.maxBankroll,
    rounds: state.rounds,
    status: state.status,
    clear_count: meta.clearCount,
    best_clear_rounds: meta.bestClearRounds,
    official_attempts_used: meta.officialAttemptsUsed,
    official_clears: meta.officialClears,
    current_attempt_official: meta.currentAttemptOfficial,
    auth_user_id: meta.authUserId,
    active_sport: currentSport(),
    updated_at: new Date().toISOString()
  }];
  supabaseFetch("challenge_players?on_conflict=install_id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(payload)
  });
}

function logRound(round, settlement) {
  syncPlayer();
  const payload = [{
    install_id: meta.installId,
    attempt_id: meta.currentAttemptId,
    attempt_number: meta.attemptNumber,
    round_number: state.rounds,
    sport: "baccarat",
    winner: round.winner,
    player_total: round.playerTotal,
    banker_total: round.bankerTotal,
    net: settlement.net,
    bankroll_after: state.bankroll,
    bets: previousBets,
    outcomes: settlement.outcomes,
    created_at: new Date().toISOString()
  }];
  supabaseFetch("challenge_rounds", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(payload)
  });
}

function logRace(race, settlement) {
  syncPlayer();
  const payload = [{
    install_id: meta.installId,
    attempt_id: meta.currentAttemptId,
    attempt_number: meta.attemptNumber,
    round_number: state.rounds,
    sport: race.sport,
    winner: String(settlement.winner.number),
    player_total: null,
    banker_total: null,
    net: settlement.net,
    bankroll_after: state.bankroll,
    bets: state.previousRaceBets,
    outcomes: settlement.outcomes,
    created_at: new Date().toISOString()
  }];
  supabaseFetch("challenge_rounds", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(payload)
  });
}

function wireEvents() {
  document.addEventListener("click", (event) => {
    if (event.target.closest("button")) playTone("tap");
  }, true);

  $("#startGame").addEventListener("click", () => startGameFlow(false));
  $("#openHowTo").addEventListener("click", () => startGameFlow(true));
  $("#googleLogin").addEventListener("click", () => {
    if (!supabaseReady()) {
      startGameFlow(false);
      return;
    }
    $("#authHint").textContent = "Googleログイン画面へ移動します。ログイン後は同じボタンで続きから遊べます。";
    playTone("start");
    loginWithGoogle();
  });
  $("#emailLogin").addEventListener("click", loginWithEmail);

  $$(".bet-tile, .side-tile").forEach((button) => {
    button.addEventListener("click", () => addBet(button.dataset.bet));
  });

  $("#openVenue").addEventListener("click", openVenueSelect);
  $("#venueButton").addEventListener("click", openVenueSelect);
  $("#closeVenue").addEventListener("click", closeVenueSelect);
  $("#venueOverlay").addEventListener("click", (event) => {
    if (event.target.id === "venueOverlay") closeVenueSelect();
    const button = event.target.closest("[data-venue-sport]");
    if (button) selectSport(button.dataset.venueSport);
  });

  $("#raceEntries").addEventListener("click", (event) => {
    const button = event.target.closest("[data-race-pick]");
    if (button) addRaceBet(button.dataset.racePick);
  });

  $("#newRaceCard").addEventListener("click", () => {
    if (isRaceRunning || isDealing) return;
    ensureRace(true);
    playTone("panel");
    render();
  });

  $$(".chip").forEach((button) => {
    button.addEventListener("click", () => {
      currentChip = Number(button.dataset.chip);
      $$(".chip").forEach((chip) => chip.classList.remove("selected"));
      button.classList.add("selected");
      playTone("chip");
      render();
    });
  });

  $("#minusBet").addEventListener("click", () => {
    const index = Math.max(0, CHIP_STEPS.indexOf(currentChip) - 1);
    currentChip = CHIP_STEPS[index];
    document.querySelector(`[data-chip="${currentChip}"]`).click();
  });

  $("#plusBet").addEventListener("click", () => {
    const index = Math.min(CHIP_STEPS.length - 1, CHIP_STEPS.indexOf(currentChip) + 1);
    currentChip = CHIP_STEPS[index];
    document.querySelector(`[data-chip="${currentChip}"]`).click();
  });

  $("#clearBet").addEventListener("click", () => {
    if (isRaceSport()) state.raceBets = {};
    else activeBets = blankBets();
    playTone("clear");
    render();
  });

  $("#repeatBet").addEventListener("click", () => {
    if (isRaceSport()) {
      const total = sumRaceBets(state.previousRaceBets || {});
      const race = ensureRace();
      if (total && total <= state.bankroll && race?.participants.length) {
        const entry = race.participants[0];
        state.selectedRaceId = entry.id;
        state.raceBets = { [entry.id]: total };
        playTone("bet");
        render();
      } else {
        pulseDeal("資金不足");
        playTone("danger");
      }
      return;
    }
    if (sumBets(previousBets) <= state.bankroll) {
      activeBets = { ...previousBets };
      playTone("bet");
      render();
    } else {
      pulseDeal("資金不足");
      playTone("danger");
    }
  });

  $("#allInBet").addEventListener("click", allInBet);
  $("#dealButton").addEventListener("click", beginRound);
  $("#menuButton").addEventListener("click", () => openPanel("main"));
  $("#missionButton").addEventListener("click", () => openPanel("achievements"));
  $("#moreHistory").addEventListener("click", () => openPanel("history"));
  $("#shareResult").addEventListener("click", () => {
    const mode = meta.currentAttemptOfficial ? `公式${meta.officialAttemptsUsed}/10` : "リベンジ";
    const text = encodeURIComponent(`ラスワンの負けサビ1億円になるまで帰れません：${mode}、${meta.attemptNumber}回目、${state.rounds}勝負で${formatYen(state.bankroll)}まで到達。証明ID ${proofCode()}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank", "noopener");
  });
  $("#endingStats").addEventListener("click", () => {
    stopEndingTicker();
    $("#endingOverlay").classList.remove("open");
    playTone("panel");
    openPanel("stats");
  });
  $("#restartGame").addEventListener("click", () => {
    playTone("start");
    startNewAttempt(true);
  });
  $("#titleReturn").addEventListener("click", () => {
    playTone("panel");
    startNewAttempt(false);
    titleSeen = false;
    localStorage.removeItem(`${STORAGE_KEY}-title-seen`);
    render();
  });
  $("#resetGame").addEventListener("click", () => {
    playTone("start");
    startNewAttempt(true);
  });
  $("#nextRound").addEventListener("click", () => {
    $("#resultOverlay").classList.remove("open");
    $("#resultOverlay").setAttribute("aria-hidden", "true");
    playTone("panel");
  });
  $("#resultHistory").addEventListener("click", () => {
    $("#resultOverlay").classList.remove("open");
    openPanel("history");
  });
  $("#soundToggle").addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem(`${STORAGE_KEY}-sound`, soundEnabled ? "1" : "0");
    if (soundEnabled) {
      playTone("chip");
      startBgm(currentSport());
    } else {
      stopBgm();
    }
    render();
  });
  $("#vibeToggle").addEventListener("click", () => {
    vibeEnabled = !vibeEnabled;
    localStorage.setItem(`${STORAGE_KEY}-vibe`, vibeEnabled ? "1" : "0");
    playTone("chip");
    render();
  });

  $$(".nav-item").forEach((item) => {
    item.addEventListener("click", () => openPanel(item.dataset.tab));
  });

  $$("[data-close='drawer']").forEach((button) => {
    button.addEventListener("click", () => {
      $("#drawer").classList.remove("open");
      $("#drawer").setAttribute("aria-hidden", "true");
      playTone("panel");
    });
  });
}

preventMobileDoubleTapZoom();
wireEvents();
render();
syncPlayer();
initAuth();
