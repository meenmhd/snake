# snake
Kindergarten Snake Game

A number game for young children. Steer the snake to eat numbers and add them
up until your score is exactly the target.

## How to play

1. Look at the **Target** at the top. That is the number you need to make.
2. Move the snake onto a yellow square to eat its number. The number is added
   to your **Score**, and the snake grows one square longer.
3. **Need** shows how many more points you need to reach the target.
4. Choose your numbers carefully:
   - Score exactly the target and you win.
   - Go over the target and you have to try again.
   - Bump into your own body and the game is over.
5. Press **Play again** to start a new game with a new target and new numbers.

The snake only moves when you press a key, so take your time and work out the
sum before each move.

## Controls

| Action     | Keyboard   | Tablet          |
|------------|------------|-----------------|
| Move up    | ↑          | Swipe up        |
| Move down  | ↓          | Swipe down      |
| Move left  | ←          | Swipe left      |
| Move right | →          | Swipe right     |
| Play again | Enter      | Tap Play again  |

The snake can go off one side of the board and come back on the other.
It can't turn straight back into itself.

## Running the game

Open `snake.html` in a web browser. If it doesn't load, run a small web
server from this folder:

```bash
python3 -m http.server 8000
```

Then go to http://localhost:8000/snake.html.

## Changing the game

Settings are at the top of `snake.js` in `CONFIG`:

- `targetMin` / `targetMax`: the range the target is picked from
- `foodCount`: how many numbers are on the board (numbered 1 to `foodCount`)
- `cols` / `rows`: the size of the board

Keep the sum of all the numbers (45 for the default of 9) above `targetMax`,
so every target can be reached.
