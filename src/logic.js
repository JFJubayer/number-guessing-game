export const MODES = {
  easy: { name: 'easy', min: 1, max: 50 },
  hard: { name: 'hard', min: 1, max: 200 },
};

export function parseMode(text) {
  const word = text.trim().toLowerCase();
  if (word === 'e' || word === 'easy') return MODES.easy;
  if (word === 'h' || word === 'hard') return MODES.hard;
  return null;
}

export function randomInt(min, max, random = Math.random) {
  return Math.floor(random() * (max - min + 1)) + min;
}

// Returns { guess } for a whole number inside the mode's range, or { error } with a message.
export function parseGuess(text, mode) {
  if (!/^-?\d+$/.test(text)) return { error: 'Please type a whole number.' };
  const guess = Number(text);
  if (guess < mode.min || guess > mode.max) {
    return { error: `Please type a number from ${mode.min} to ${mode.max}.` };
  }
  return { guess };
}

export function hintFor(guess, secret) {
  const direction = guess < secret ? 'low' : 'high';
  const distance = Math.abs(guess - secret);
  if (distance <= 3) return `Too ${direction}, but very close!`;
  if (distance <= 10) return `Too ${direction}, but close.`;
  return `Too ${direction}, and far away.`;
}

// 100 points for a win on the first try, 10 less for every extra attempt, never below 10.
export function scoreFor(attempts) {
  return Math.max(10, 110 - attempts * 10);
}
