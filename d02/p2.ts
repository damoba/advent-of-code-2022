import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

const POINTS_PER_SHAPE: { [key: string]: number } = { A: 1, B: 2, C: 3 };
const WINS: { [key: string]: string } = { A: "C", B: "A", C: "B" };
const LOSES: { [key: string]: string } = { A: "B", B: "C", C: "A" };
const DRAW_SHAPE = "Y";
const WIN_SHAPE = "Z";
const DRAW_POINTS = 3;
const WIN_POINTS = 6;

const solve = (data: string) => {
  const rounds = data.split("\n");
  let totalPoints = 0;

  for (const round of rounds) {
    const shapes = round.split(" ");
    let myShape = "";

    if (shapes[1] === DRAW_SHAPE) {
      totalPoints += DRAW_POINTS;
      myShape = shapes[0];
    } else if (shapes[1] === WIN_SHAPE) {
      totalPoints += WIN_POINTS;
      myShape = LOSES[shapes[0]];
    } else {
      myShape = WINS[shapes[0]];
    }

    totalPoints += POINTS_PER_SHAPE[myShape];
  }

  return totalPoints;
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 12);
  const t0 = performance.now();
  console.log("SOLUTION", solve(input));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
