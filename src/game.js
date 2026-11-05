import readline from 'node:readline';
import { randomInt } from './logic.js';
import { chooseMode, playRound } from './play.js';

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

const say = (text) => console.log(text);

say('Number Guessing Game');
let rounds = 0;
let total = 0;

while (true) {
  const mode = await chooseMode({ ask, say });
  if (mode === null) break;

  const secret = randomInt(mode.min, mode.max);
  const result = await playRound({ mode, secret, ask, say });
  if (result === null) break;

  rounds += 1;
  total += result.score;
  say(`Total score: ${total} after ${rounds} ${rounds === 1 ? 'round' : 'rounds'}.`);

  const again = await ask('Play again? (y/n): ');
  if (again === null || !/^y(es)?$/i.test(again)) break;
}

say(rounds === 0 ? 'Bye!' : `Thanks for playing! Final score: ${total}.`);
rl.close();
