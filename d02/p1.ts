import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

const POINTS_PER_SHAPE: { [key: string]: number } = { X: 1, Y: 2, Z: 3 };
const DRAWS = ["A X", "B Y", "C Z"];
const WINS = ["C X", "A Y", "B Z"];
const DRAW_POINTS = 3;
const WIN_POINTS = 6;

const solve = (data: string) => {
  const rounds = data.split("\n");
  let totalPoints = 0;

  for (const round of rounds) {
    const shapes = round.split(" ");
    totalPoints += POINTS_PER_SHAPE[shapes[1]];

    if (DRAWS.includes(round)) {
      totalPoints += DRAW_POINTS;
    } else if (WINS.includes(round)) {
      totalPoints += WIN_POINTS;
    }
  }

  return totalPoints;
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 15);
  const t0 = performance.now();
  console.log("SOLUTION", solve(input));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
