import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

type Tree = {
  index: string;
  num: number;
};

const DOWN = "down";
const UP = "up";
const RIGHT = "right";
const LEFT = "left";

const calcVisibleTrees = (
  grid: Tree[][],
  visibleTrees: Tree[],
  row: number,
  col: number,
  highestTree: Tree,
  direction: string
) => {
  if (
    row < 1 ||
    row >= grid.length - 1 ||
    col < 1 ||
    col >= grid[0].length - 1
  ) {
    return;
  }

  if (grid[row][col].num > highestTree.num) {
    highestTree = grid[row][col];
    if (!visibleTrees.includes(grid[row][col])) {
      visibleTrees.push(grid[row][col]);
    }
  }

  if (direction === DOWN) {
    calcVisibleTrees(grid, visibleTrees, row + 1, col, highestTree, DOWN);
  } else if (direction === UP) {
    calcVisibleTrees(grid, visibleTrees, row - 1, col, highestTree, UP);
  } else if (direction === RIGHT) {
    calcVisibleTrees(grid, visibleTrees, row, col + 1, highestTree, RIGHT);
  } else if (direction === LEFT) {
    calcVisibleTrees(grid, visibleTrees, row, col - 1, highestTree, LEFT);
  }
};

const solve = (data: string) => {
  const grid = data.split("\n").map((line, row) =>
    line.split("").map((treeStr: string, col) => {
      const tree: Tree = {
        index: row.toString(10) + "-" + col.toString(10),
        num: parseInt(treeStr, 10),
      };
      return tree;
    })
  );

  const ROWS = grid.length;
  const COLS = grid[0].length;
  const visibleTrees: Tree[] = [];

  for (let row = 0; row < ROWS; row++) {
    visibleTrees.push(grid[row][0]);
    visibleTrees.push(grid[row][COLS - 1]);
  }
  for (let col = 1; col < COLS - 1; col++) {
    calcVisibleTrees(grid, visibleTrees, 1, col, grid[0][col], DOWN);
    calcVisibleTrees(
      grid,
      visibleTrees,
      ROWS - 2,
      col,
      grid[ROWS - 1][col],
      UP
    );
  }

  for (let col = 1; col < COLS - 1; col++) {
    visibleTrees.push(grid[0][col]);
    visibleTrees.push(grid[ROWS - 1][col]);
  }
  for (let row = 1; row < ROWS - 1; row++) {
    calcVisibleTrees(grid, visibleTrees, row, 1, grid[row][0], RIGHT);
    calcVisibleTrees(
      grid,
      visibleTrees,
      row,
      COLS - 2,
      grid[row][COLS - 1],
      LEFT
    );
  }

  return visibleTrees.length;
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 21);
  const t0 = performance.now();
  console.log("SOLUTION", solve(input));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
