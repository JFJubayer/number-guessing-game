import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MODES, hintFor, parseGuess, parseMode, randomInt, scoreFor } from '../src/logic.js';

test('the modes use the ranges 1-50 and 1-200', () => {
  assert.deepEqual([MODES.easy.min, MODES.easy.max], [1, 50]);
  assert.deepEqual([MODES.hard.min, MODES.hard.max], [1, 200]);
});

test('parseMode accepts e, easy, h and hard in any letter case', () => {
  assert.equal(parseMode('e'), MODES.easy);
  assert.equal(parseMode(' Easy '), MODES.easy);
  assert.equal(parseMode('H'), MODES.hard);
  assert.equal(parseMode('hard'), MODES.hard);
});

test('parseMode returns null for anything else', () => {
  assert.equal(parseMode(''), null);
  assert.equal(parseMode('medium'), null);
});

test('randomInt stays inside the range', () => {
  assert.equal(randomInt(1, 50, () => 0), 1);
  assert.equal(randomInt(1, 50, () => 0.999999), 50);
  assert.equal(randomInt(1, 200, () => 0.5), 101);
});

test('parseGuess returns the number when it is a whole number inside the range', () => {
  assert.deepEqual(parseGuess('25', MODES.easy), { guess: 25 });
  assert.deepEqual(parseGuess('1', MODES.easy), { guess: 1 });
  assert.deepEqual(parseGuess('50', MODES.easy), { guess: 50 });
  assert.deepEqual(parseGuess('51', MODES.hard), { guess: 51 });
});

test('parseGuess explains what is wrong with a bad guess', () => {
  assert.equal(parseGuess('abc', MODES.easy).error, 'Please type a whole number.');
  assert.equal(parseGuess('2.5', MODES.easy).error, 'Please type a whole number.');
  assert.equal(parseGuess('', MODES.easy).error, 'Please type a whole number.');
  assert.equal(parseGuess('0', MODES.easy).error, 'Please type a number from 1 to 50.');
  assert.equal(parseGuess('51', MODES.easy).error, 'Please type a number from 1 to 50.');
  assert.equal(parseGuess('-5', MODES.hard).error, 'Please type a number from 1 to 200.');
});

test('hintFor tells which way to go and how close the guess is', () => {
  assert.equal(hintFor(24, 25), 'Too low, but very close!');
  assert.equal(hintFor(20, 25), 'Too low, but close.');
  assert.equal(hintFor(1, 25), 'Too low, and far away.');
  assert.equal(hintFor(26, 25), 'Too high, but very close!');
  assert.equal(hintFor(30, 25), 'Too high, but close.');
  assert.equal(hintFor(50, 25), 'Too high, and far away.');
});

test('hintFor changes at a distance of 3 and of 10', () => {
  assert.equal(hintFor(22, 25), 'Too low, but very close!');
  assert.equal(hintFor(21, 25), 'Too low, but close.');
  assert.equal(hintFor(15, 25), 'Too low, but close.');
  assert.equal(hintFor(14, 25), 'Too low, and far away.');
});

test('scoreFor gives 100 for one attempt and 10 less for each extra one, never below 10', () => {
  assert.equal(scoreFor(1), 100);
  assert.equal(scoreFor(2), 90);
  assert.equal(scoreFor(10), 10);
  assert.equal(scoreFor(30), 10);
});
