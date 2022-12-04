import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

const pointsPerShape: { [key: string]: number } = { X: 1, Y: 2, Z: 3 };
const draws = ["A X", "B Y", "C Z"];
const wins = ["C X", "A Y", "B Z"];
const drawPoints = 3;
const winPoints = 6;

const solve = (data: string) => {
  const rounds = data.split("\n");
  let totalPoints = 0;

  for (const round of rounds) {
    const shapes = round.split(" ");
    totalPoints += pointsPerShape[shapes[1]];

    if (draws.includes(round)) {
      totalPoints += drawPoints;
    } else if (wins.includes(round)) {
      totalPoints += winPoints;
    }
  }

  return totalPoints;
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 15);
  console.log("SOLUTION", solve(input));
});
