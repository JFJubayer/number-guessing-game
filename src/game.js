import readline from 'node:readline';

const MODES = {
  easy: { name: 'easy', min: 1, max: 50 },
  hard: { name: 'hard', min: 1, max: 200 },
};

const rl = readline.createInterface({ input: process.stdin });
const lines = rl[Symbol.asyncIterator]();

// Shows the question, then waits for the next line. Returns null when the input has ended.
async function ask(question) {
  process.stdout.write(question);
  const { value, done } = await lines.next();
  if (done) {
    process.stdout.write('\n');
    return null;
  }
  const answer = value.trim();
  // A pipe does not echo what was typed, so print it to keep the output readable.
  if (!process.stdin.isTTY) process.stdout.write(`${answer}\n`);
  return answer;
}

function parseMode(text) {
  const word = text.trim().toLowerCase();
  if (word === 'e' || word === 'easy') return MODES.easy;
  if (word === 'h' || word === 'hard') return MODES.hard;
  return null;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function parseGuess(text, mode) {
  if (!/^-?\d+$/.test(text)) return { error: 'Please type a whole number.' };
  const guess = Number(text);
  if (guess < mode.min || guess > mode.max) {
    return { error: `Please type a number from ${mode.min} to ${mode.max}.` };
  }
  return { guess };
}

function hintFor(guess, secret) {
  const direction = guess < secret ? 'low' : 'high';
  const distance = Math.abs(guess - secret);
  if (distance <= 3) return `Too ${direction}, but very close!`;
  if (distance <= 10) return `Too ${direction}, but close.`;
  return `Too ${direction}, and far away.`;
}

// 100 points for a win on the first try, 10 less for every extra attempt, never below 10.
function scoreFor(attempts) {
  return Math.max(10, 110 - attempts * 10);
}

// Asks until the player picks a mode. Returns null when the input has ended.
async function chooseMode() {
  while (true) {
    const answer = await ask('Choose a mode: (e)asy 1-50 or (h)ard 1-200 [e/h]: ');
    if (answer === null) return null;
    const mode = parseMode(answer);
    if (mode) return mode;
    console.log('Please type e or h.');
  }
}

// Plays one round. Returns { attempts, score }, or null when the input has ended.
async function playRound(mode) {
  const secret = randomInt(mode.min, mode.max);
  console.log(`I am thinking of a number from ${mode.min} to ${mode.max}.`);
  let attempts = 0;

  while (true) {
    const answer = await ask(`Guess #${attempts + 1}: `);
    if (answer === null) return null;

    const { guess, error } = parseGuess(answer, mode);
    if (error) {
      console.log(error);
      continue;
    }

    attempts += 1;
    if (guess === secret) {
      const score = scoreFor(attempts);
      console.log(`Correct! You found it in ${attempts} ${attempts === 1 ? 'attempt' : 'attempts'}. Score: ${score}`);
      return { attempts, score };
    }
    console.log(hintFor(guess, secret));
  }
}

console.log('Number Guessing Game');
let rounds = 0;
let total = 0;

while (true) {
  const mode = await chooseMode();
  if (mode === null) break;

  const result = await playRound(mode);
  if (result === null) break;

  rounds += 1;
  total += result.score;
  console.log(`Total score: ${total} after ${rounds} ${rounds === 1 ? 'round' : 'rounds'}.`);

  const again = await ask('Play again? (y/n): ');
  if (again === null || !/^y(es)?$/i.test(again)) break;
}

console.log(rounds === 0 ? 'Bye!' : `Thanks for playing! Final score: ${total}.`);
rl.close();
