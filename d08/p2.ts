import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

const calcViewingDistance = (
  grid: number[][],
  row: number,
  col: number,
  originalTree: number,
  countOfShorterTrees: { dist: number },
  direction: string
) => {
  if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
    return;
  } else if (grid[row][col] >= originalTree) {
    countOfShorterTrees.dist++;
    return;
  }

  countOfShorterTrees.dist++;
  if (direction === "down") {
    calcViewingDistance(
      grid,
      row + 1,
      col,
      originalTree,
      countOfShorterTrees,
      "down"
    );
  } else if (direction === "up") {
    calcViewingDistance(
      grid,
      row - 1,
      col,
      originalTree,
      countOfShorterTrees,
      "up"
    );
  } else if (direction === "right") {
    calcViewingDistance(
      grid,
      row,
      col + 1,
      originalTree,
      countOfShorterTrees,
      "right"
    );
  } else if (direction === "left") {
    calcViewingDistance(
      grid,
      row,
      col - 1,
      originalTree,
      countOfShorterTrees,
      "left"
    );
  }
};

const solve = (data: string) => {
  const grid = data
    .split("\n")
    .map((line) =>
      line.split("").map((treeStr: string) => parseInt(treeStr, 10))
    );

  const ROWS = grid.length;
  const COLS = grid[0].length;
  let highestScore = 1;

  for (let row = 1; row < ROWS - 1; row++) {
    for (let col = 1; col < COLS - 1; col++) {
      const [distanceDown, distanceUp, distanceRight, distanceLeft] = [
        { dist: 0 },
        { dist: 0 },
        { dist: 0 },
        { dist: 0 },
      ];

      calcViewingDistance(
        grid,
        row + 1,
        col,
        grid[row][col],
        distanceDown,
        "down"
      );
      calcViewingDistance(grid, row - 1, col, grid[row][col], distanceUp, "up");
      calcViewingDistance(
        grid,
        row,
        col + 1,
        grid[row][col],
        distanceRight,
        "right"
      );
      calcViewingDistance(
        grid,
        row,
        col - 1,
        grid[row][col],
        distanceLeft,
        "left"
      );

      const score =
        distanceDown.dist *
        distanceUp.dist *
        distanceRight.dist *
        distanceLeft.dist;
      if (score > highestScore) {
        highestScore = score;
      }
    }
  }

  return highestScore;
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 8);
  const t0 = performance.now();
  console.log("SOLUTION", solve(input));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
