# Number Guessing Game

A number guessing game for the terminal, written in JavaScript for Node.js. The computer thinks of a number, you guess it, and the game tells you whether to go higher or lower and how close you are. There are no packages to install.

## Run it

```bash
git clone https://github.com/JFJubayer/number-guessing-game.git
cd number-guessing-game
npm start
```

Needs Node.js 20 or newer (tested on Node 22).

## How to play

1. Choose a mode: `e` for easy (1 to 50) or `h` for hard (1 to 200).
2. Type a whole number and press Enter. The game answers with a hint.
3. Keep guessing until you find the number. Then you get a score and can play again.

| Hint | How far the guess is from the number |
| --- | --- |
| `Too low, but very close!` or `Too high, but very close!` | 3 or less |
| `Too low, but close.` or `Too high, but close.` | 4 to 10 |
| `Too low, and far away.` or `Too high, and far away.` | more than 10 |

- The attempts are counted. A guess that is not a whole number, or is outside the range, is explained and does not count.
- Score: 100 points for finding the number on the first try, 10 less for every extra attempt, never below 10. The total of all the rounds is shown after each round and at the end.
- `Ctrl+D` on Linux and Mac stops the game at any time.

## Example

Real output of `npm start`. The answers were typed by a small script that plays a binary search, and the program prints them after each question, so the lines look like a typed game:

```text
$ npm start
Number Guessing Game
Choose a mode: (e)asy 1-50 or (h)ard 1-200 [e/h]: e
I am thinking of a number from 1 to 50.
Guess #1: 25
Too high, and far away.
Guess #2: 12
Too low, but very close!
Guess #3: 18
Too high, but close.
Guess #4: 15
Too high, but very close!
Guess #5: 13
Too low, but very close!
Guess #6: 14
Correct! You found it in 6 attempts. Score: 50
Total score: 50 after 1 round.
Play again? (y/n): n
Thanks for playing! Final score: 50.
```

## How the code is organised

```text
src/logic.js   the rules: modes, random number, checking a guess, hints and score
src/play.js    one round and the mode question (they talk to the player through ask and say)
src/game.js    reads the typed lines with readline and runs the rounds
test/          automated tests
```

What I practised: `if`/`else`, `while` loops, functions, random numbers with `Math.random`, `readline` and tests. The Git history shows the steps in order: the basic game, the attempt count, the hints and score, the two modes, the split into files, and the tests.

## Tests

```bash
npm test
```

16 tests with Node's built-in test runner: the rules in `logic.js`, a round and the mode question with a scripted player, and the real game started with typed lines.
