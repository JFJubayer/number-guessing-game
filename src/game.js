import readline from 'node:readline';

const MIN = 1;
const MAX = 100;

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

// Plays one round. Returns { attempts, score }, or null when the input has ended.
async function playRound() {
  const secret = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
  console.log(`I am thinking of a number from ${MIN} to ${MAX}.`);
  let attempts = 0;

  while (true) {
    const answer = await ask(`Guess #${attempts + 1}: `);
    if (answer === null) return null;

    const guess = Number(answer);
    if (answer === '' || !Number.isInteger(guess)) {
      console.log('Please type a whole number.');
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
  const result = await playRound();
  if (result === null) break;

  rounds += 1;
  total += result.score;
  console.log(`Total score: ${total} after ${rounds} ${rounds === 1 ? 'round' : 'rounds'}.`);

  const again = await ask('Play again? (y/n): ');
  if (again === null || !/^y(es)?$/i.test(again)) break;
}

console.log(rounds === 0 ? 'Bye!' : `Thanks for playing! Final score: ${total}.`);
rl.close();
