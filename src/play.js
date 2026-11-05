import { hintFor, parseGuess, parseMode, scoreFor } from './logic.js';

// Both functions talk to the player through ask(question), which returns the typed line or null
// when the input has ended, and say(text), which prints a line.

// Asks until the player picks a mode. Returns null when the input has ended.
export async function chooseMode({ ask, say }) {
  while (true) {
    const answer = await ask('Choose a mode: (e)asy 1-50 or (h)ard 1-200 [e/h]: ');
    if (answer === null) return null;
    const mode = parseMode(answer);
    if (mode) return mode;
    say('Please type e or h.');
  }
}

// Plays one round. Returns { attempts, score }, or null when the input has ended.
export async function playRound({ mode, secret, ask, say }) {
  say(`I am thinking of a number from ${mode.min} to ${mode.max}.`);
  let attempts = 0;

  while (true) {
    const answer = await ask(`Guess #${attempts + 1}: `);
    if (answer === null) return null;

    const { guess, error } = parseGuess(answer, mode);
    if (error) {
      say(error);
      continue;
    }

    attempts += 1;
    if (guess === secret) {
      const score = scoreFor(attempts);
      say(`Correct! You found it in ${attempts} ${attempts === 1 ? 'attempt' : 'attempts'}. Score: ${score}`);
      return { attempts, score };
    }
    say(hintFor(guess, secret));
  }
}
