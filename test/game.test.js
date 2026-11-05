import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../src/game.js', import.meta.url));

// Starts the real game and types the given lines into it.
function runGame(lines) {
  return spawnSync(process.execPath, [script], { input: `${lines.join('\n')}\n`, encoding: 'utf8' });
}

test('guessing every number in order always finds the secret number', () => {
  const guesses = Array.from({ length: 50 }, (_, index) => String(index + 1));
  const result = runGame(['e', ...guesses, 'n']);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /I am thinking of a number from 1 to 50\./);
  assert.match(result.stdout, /Correct! You found it in \d+ attempts?\. Score: \d+/);
  assert.match(result.stdout, /Thanks for playing! Final score: \d+\./);
});

test('a wrong mode is explained and the game says bye when the input ends', () => {
  const result = runGame(['x']);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Please type e or h\./);
  assert.match(result.stdout, /Bye!/);
});
