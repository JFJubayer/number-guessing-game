import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MODES } from '../src/logic.js';
import { chooseMode, playRound } from '../src/play.js';

// A player who types the given answers and then stops. It also records what the game said and asked.
function player(answers) {
  const remaining = [...answers];
  const said = [];
  const asked = [];
  return {
    said,
    asked,
    ask: async (question) => {
      asked.push(question);
      return remaining.length > 0 ? remaining.shift() : null;
    },
    say: (text) => said.push(text),
  };
}

test('a round ends with the right guess and returns the attempts and the score', async () => {
  const you = player(['25', '40', '30']);
  const result = await playRound({ mode: MODES.easy, secret: 30, ask: you.ask, say: you.say });

  assert.deepEqual(result, { attempts: 3, score: 80 });
  assert.deepEqual(you.said, [
    'I am thinking of a number from 1 to 50.',
    'Too low, but close.',
    'Too high, but close.',
    'Correct! You found it in 3 attempts. Score: 80',
  ]);
  assert.deepEqual(you.asked, ['Guess #1: ', 'Guess #2: ', 'Guess #3: ']);
});

test('a bad guess is not counted as an attempt', async () => {
  const you = player(['abc', '99', '10']);
  const result = await playRound({ mode: MODES.easy, secret: 10, ask: you.ask, say: you.say });

  assert.deepEqual(result, { attempts: 1, score: 100 });
  assert.deepEqual(you.said.slice(1, 3), ['Please type a whole number.', 'Please type a number from 1 to 50.']);
  assert.equal(you.said.at(-1), 'Correct! You found it in 1 attempt. Score: 100');
  assert.deepEqual(you.asked, ['Guess #1: ', 'Guess #1: ', 'Guess #1: ']);
});

test('a round returns null when the input ends before the number is found', async () => {
  const you = player(['1']);
  const result = await playRound({ mode: MODES.easy, secret: 30, ask: you.ask, say: you.say });
  assert.equal(result, null);
});

test('chooseMode asks again after a wrong answer', async () => {
  const you = player(['x', 'hard']);
  assert.equal(await chooseMode({ ask: you.ask, say: you.say }), MODES.hard);
  assert.deepEqual(you.said, ['Please type e or h.']);
});

test('chooseMode returns null when the input has ended', async () => {
  const you = player([]);
  assert.equal(await chooseMode({ ask: you.ask, say: you.say }), null);
});
