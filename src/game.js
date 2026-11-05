import readline from 'node:readline';

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

const secret = Math.floor(Math.random() * 100) + 1;
console.log('Number Guessing Game');
console.log('I am thinking of a number from 1 to 100.');

let attempts = 0;

while (true) {
  const answer = await ask(`Guess #${attempts + 1}: `);
  if (answer === null) break;

  const guess = Number(answer);
  if (answer === '' || !Number.isInteger(guess)) {
    console.log('Please type a whole number.');
    continue;
  }

  attempts += 1;
  if (guess < secret) {
    console.log('Too low.');
  } else if (guess > secret) {
    console.log('Too high.');
  } else {
    console.log(`Correct! You found it in ${attempts} ${attempts === 1 ? 'attempt' : 'attempts'}.`);
    break;
  }
}

rl.close();
