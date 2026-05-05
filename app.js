const START_BANKROLL = 1_000_000;
const GOAL_BANKROLL = 100_000_000;
const STORAGE_KEY = "baccarat-tiger-challenge-v2";
const META_KEY = `${STORAGE_KEY}-meta`;
const CONFIG = window.BACCARAT_CONFIG || {};

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
  "今の負け、音だけは高級だった。"
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
let audioCtx = null;

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
        unlockedAchievements: Array.isArray(saved.unlockedAchievements) ? saved.unlockedAchievements : []
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
    unlockedAchievements: []
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

function attemptMessage() {
  return `${meta.attemptNumber}回目の挑戦。何回でクリアできたか教えてね。`;
}

function render() {
  $("#titleOverlay").classList.toggle("hidden", titleSeen);
  $("#titleAttempt").textContent = attemptMessage();
  $("#attemptBadge").textContent = `${meta.attemptNumber}回目の挑戦`;
  $("#titleAchievementCount").textContent = `${meta.unlockedAchievements.length} / ${ACHIEVEMENTS.length}`;
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

  $("#currentChip").textContent = formatPlain(currentChip);
  $("#totalBet").textContent = `合計 ${formatPlain(sumBets(activeBets))}`;
  $("#allInTarget").textContent = `${BETS[selectedBetKey].label}に残り全額`;
  $("#dealButton").disabled = sumBets(activeBets) <= 0 || sumBets(activeBets) > state.bankroll || isDealing || state.status !== "playing";

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
  state.history.slice(0, 18).reverse().forEach((item) => {
    const dot = document.createElement("div");
    dot.className = `road-dot ${item.winner}${item.natural ? " natural" : ""}${item.playerPair || item.bankerPair ? " pair" : ""}`;
    dot.textContent = item.winner;
    road.appendChild(dot);
  });
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
  const cells = buildBigRoad(state.history);
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
  const items = [...state.history].reverse().slice(-42);
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
  state.history.slice(0, 20).reverse().forEach((item) => {
    const chip = document.createElement("div");
    chip.className = `trend-chip ${item.winner}`;
    chip.textContent = item.winner;
    container.appendChild(chip);
  });
}

function roadSummary() {
  if (!state.history.length) return "まだ履歴なし";
  const recent = state.history.slice(0, 12);
  const p = recent.filter((item) => item.winner === "P").length;
  const b = recent.filter((item) => item.winner === "B").length;
  const t = recent.filter((item) => item.winner === "T").length;
  return `直近 P${p} / B${b} / T${t}`;
}

function trendSummary() {
  if (!state.history.length) return "-";
  const latest = state.history[0].winner;
  let streak = 0;
  for (const item of state.history) {
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
  const total = sumBets(activeBets);
  if (!total || total > state.bankroll || isDealing) {
    playTone("danger");
    return;
  }

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
  playTone(total === state.bankroll ? "allin" : "deal");
  vibrate(20);
  render();
  playDealSequence(roundToken);
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
  queueAchievementToasts(unlockedNow);
  logRound(displayedRound, settlement);
  render();
  checkEnding();
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

function checkEnding() {
  if (state.bankroll >= GOAL_BANKROLL) {
    state.status = "cleared";
    meta.clearCount += 1;
    if (!meta.bestClearRounds || state.rounds < meta.bestClearRounds) meta.bestClearRounds = state.rounds;
    $("#endingTitle").textContent = "支払い完了!";
    $("#endingMessage").textContent = `${meta.attemptNumber}回目の挑戦、${state.rounds}Rで1億到達。負けサビ100万円から帰国確定。`;
    $("#endingMoney").textContent = formatYen(state.bankroll);
    $("#endingOverlay").classList.add("open");
    $("#endingOverlay").setAttribute("aria-hidden", "false");
    syncPlayer();
  }

  if (state.bankroll <= 0) {
    state.status = "bankrupt";
    $("#endingTitle").textContent = "泳いで帰国";
    $("#endingMessage").textContent = `${meta.attemptNumber}回目の挑戦は${state.rounds}Rで終了。明日の支払いは残ったまま、海が見えてきた。`;
    $("#endingMoney").textContent = formatYen(state.maxBankroll);
    $("#endingOverlay").classList.add("open");
    $("#endingOverlay").setAttribute("aria-hidden", "false");
    syncPlayer();
  }
}

function startNewAttempt() {
  meta.attemptNumber += 1;
  meta.currentAttemptId = createId();
  meta.currentAttemptStartedAt = new Date().toISOString();
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
  $("#endingOverlay").classList.remove("open");
  $("#resultOverlay").classList.remove("open");
  $("#drawer").classList.remove("open");
  $("#dealButtonText").textContent = "ベット確定";
  $("#dealerMessage").textContent = "ベットしてカードを配る";
  syncPlayer();
  render();
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

function supabaseReady() {
  return Boolean(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_PUBLISHABLE_KEY);
}

async function supabaseFetch(path, options = {}) {
  if (!supabaseReady()) return null;
  const base = CONFIG.SUPABASE_URL.replace(/\/$/, "");
  try {
    const response = await fetch(`${base}/rest/v1/${path}`, {
      ...options,
      headers: {
        apikey: CONFIG.SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${CONFIG.SUPABASE_PUBLISHABLE_KEY}`,
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

function wireEvents() {
  document.addEventListener("click", (event) => {
    if (event.target.closest("button")) playTone("tap");
  }, true);

  $("#startGame").addEventListener("click", () => {
    titleSeen = true;
    localStorage.setItem(`${STORAGE_KEY}-title-seen`, "1");
    playTone("start");
    syncPlayer();
    render();
  });

  $("#openHowTo").addEventListener("click", () => {
    titleSeen = true;
    localStorage.setItem(`${STORAGE_KEY}-title-seen`, "1");
    render();
    openPanel("rules");
  });

  $$(".bet-tile, .side-tile").forEach((button) => {
    button.addEventListener("click", () => addBet(button.dataset.bet));
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
    activeBets = blankBets();
    playTone("clear");
    render();
  });

  $("#repeatBet").addEventListener("click", () => {
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
  $("#storyButton").addEventListener("click", () => openPanel("main"));
  $("#missionButton").addEventListener("click", () => openPanel("achievements"));
  $("#moreHistory").addEventListener("click", () => openPanel("history"));
  $("#endingStats").addEventListener("click", () => {
    $("#endingOverlay").classList.remove("open");
    playTone("panel");
    openPanel("stats");
  });
  $("#restartGame").addEventListener("click", () => {
    playTone("start");
    startNewAttempt();
  });
  $("#resetGame").addEventListener("click", () => {
    playTone("start");
    startNewAttempt();
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
    if (soundEnabled) playTone("chip");
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
