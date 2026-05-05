const RACE_TAKEOUT_RATE = 0.25;
const RACE_PAYOUT_RATE = 1 - RACE_TAKEOUT_RATE;
const MIN_RACE_ODDS = 1.1;
const MAX_RACE_ODDS = 20;
const SPORTS = ["horse", "boat", "keirin"];

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

  const drift = 1 - result.reduce((sum, value) => sum + value, 0);
  const adjustable = result.findIndex((value) => value + drift >= floor && value + drift <= ceiling);
  if (Math.abs(drift) > 1e-10 && adjustable >= 0) result[adjustable] += drift;
  return result;
}

function oneRace(sport) {
  const count = sport === "horse" ? (Math.random() < 0.55 ? 8 : 12) : sport === "boat" ? 6 : 9;
  return createRaceProbabilities(count, sport).map((prob) => ({ prob, odds: RACE_PAYOUT_RATE / prob }));
}

function simulateAttempt() {
  let bankroll = 1_000_000;
  for (let round = 0; round < 6; round += 1) {
    const required = 100_000_000 / bankroll;
    if (required <= 1) return true;
    const race = oneRace(SPORTS[Math.floor(Math.random() * SPORTS.length)]).sort((a, b) => a.odds - b.odds);
    const pick = race.find((entry) => entry.odds >= required) || race[race.length - 1];
    if (Math.random() > pick.prob) return false;
    bankroll = Math.floor(bankroll * pick.odds);
  }
  return bankroll >= 100_000_000;
}

let minEv = Infinity;
let maxEv = -Infinity;
let minSum = Infinity;
let maxSum = -Infinity;
let maxOdds = 0;
let entryCount = 0;
const buckets = { "1.1-1.99": 0, "2.0-4.99": 0, "5.0-9.99": 0, "10.0-20.0": 0 };

for (let raceIndex = 0; raceIndex < 20_000; raceIndex += 1) {
  for (const sport of SPORTS) {
    const race = oneRace(sport);
    const sumProb = race.reduce((sum, entry) => sum + entry.prob, 0);
    const impliedSum = race.reduce((sum, entry) => sum + (1 / entry.odds), 0);
    if (Math.abs(sumProb - 1) > 1e-9) throw new Error(`probability drift: ${sumProb}`);
    if (Math.abs(impliedSum - 1 / RACE_PAYOUT_RATE) > 1e-9) throw new Error(`implied drift: ${impliedSum}`);
    minSum = Math.min(minSum, sumProb);
    maxSum = Math.max(maxSum, sumProb);

    for (const entry of race) {
      const ev = entry.prob * entry.odds;
      if (Math.abs(ev - RACE_PAYOUT_RATE) > 1e-9) throw new Error(`EV drift: ${ev}`);
      minEv = Math.min(minEv, ev);
      maxEv = Math.max(maxEv, ev);
      maxOdds = Math.max(maxOdds, entry.odds);
      entryCount += 1;
      if (entry.odds < 2) buckets["1.1-1.99"] += 1;
      else if (entry.odds < 5) buckets["2.0-4.99"] += 1;
      else if (entry.odds < 10) buckets["5.0-9.99"] += 1;
      else buckets["10.0-20.0"] += 1;
    }
  }
}

let clears = 0;
const attempts = 100_000;
for (let index = 0; index < attempts; index += 1) {
  if (simulateAttempt()) clears += 1;
}

const clearRatePerAttempt = clears / attempts;
const report = {
  payoutRate: RACE_PAYOUT_RATE,
  houseTake: RACE_TAKEOUT_RATE,
  probabilitySumRange: [minSum, maxSum],
  entryExpectedValueRange: [minEv, maxEv],
  impliedOddsSum: 1 / RACE_PAYOUT_RATE,
  maxOdds,
  oddsBuckets: Object.fromEntries(Object.entries(buckets).map(([key, count]) => [key, `${((count / entryCount) * 100).toFixed(1)}%`])),
  clearRatePerAttempt: `${(clearRatePerAttempt * 100).toFixed(3)}%`,
  clearRateTenAttempts: `${((1 - Math.pow(1 - clearRatePerAttempt, 10)) * 100).toFixed(3)}%`
};

console.log(JSON.stringify(report, null, 2));
