import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

type Coordinate = { r: number; c: number };
type Status = { infinity: boolean; addSand: boolean };

const ROCK = "#";
const AIR = ".";
const SRC = "+";
const SAND = "o";

const parseScan = (data: string) => {
  let minC = 500;
  let maxC = 500;
  let minR = 0;
  let maxR = 0;

  const lines = data
    .split("\n")
    .map((line) =>
      line.split("->").map((coor) =>
        coor.split(",").map((numStr, i) => {
          const num = parseInt(numStr.trim());
          if (i === 0) {
            if (num < minC) {
              minC = num;
            }
            if (num > maxC) {
              maxC = num;
            }
          } else {
            if (num < minR) {
              minR = num;
            }
            if (num > maxR) {
              maxR = num;
            }
          }
          return num;
        })
      )
    )
    .map((line) =>
      line.map((coor) =>
        coor.map((num, i) => (i === 0 ? num - minC : num - minR))
      )
    );

  const grid = new Array(maxR - minR + 1)
    .fill(0)
    .map(() => Array(maxC - minC + 1).fill(AIR));

  grid[0][500 - minC] = SRC;
  lines.forEach((line) => {
    for (let i = 1; i < line.length; i++) {
      if (line[i][1] === line[i - 1][1]) {
        if (line[i][0] - line[i - 1][0] > 0) {
          for (let j = 0; j <= line[i][0] - line[i - 1][0]; j++) {
            grid[line[i][1]][line[i - 1][0] + j] = ROCK;
          }
        } else {
          for (let j = 0; j <= line[i - 1][0] - line[i][0]; j++) {
            grid[line[i][1]][line[i - 1][0] - j] = ROCK;
          }
        }
      } else {
        if (line[i][1] - line[i - 1][1] > 0) {
          for (let j = 0; j <= line[i][1] - line[i - 1][1]; j++) {
            grid[line[i - 1][1] + j][line[i][0]] = ROCK;
          }
        } else {
          for (let j = 0; j <= line[i - 1][1] - line[i][1]; j++) {
            grid[line[i - 1][1] - j][line[i][0]] = ROCK;
          }
        }
      }
    }
  });

  return [grid, { r: 0, c: 500 - minC }];
};

const fall = (grid: string[][], source: Coordinate, status: Status) => {
  while (source.r < grid.length && grid[source.r][source.c] === AIR) {
    source.r += 1;
  }
  source.r -= 1; // undo the last step
  // if you went too far down, we got to infinity
  if (source.r === grid.length - 1) {
    status.infinity = true;
    status.addSand = false;
    return;
  }
  if (source.c - 1 >= -1) {
    // if you went too far left, we got to infinity
    if (source.c === 0) {
      status.infinity = true;
      status.addSand = false;
      return;
    }
    // go left first if you can
    else if (grid[source.r + 1][source.c - 1] === AIR) {
      fall(grid, { ...source, r: source.r + 1, c: source.c - 1 }, status);
    }
  }
  // if you can't go left, check if you can go right
  if (
    grid[source.r + 1][source.c - 1] !== AIR &&
    source.c + 1 < grid[0].length
  ) {
    // if you went too far right, we got to infinity
    if (source.c === grid[0].length - 1) {
      status.infinity = true;
      status.addSand = false;
      return;
    }
    // if you can go right, go right
    else if (grid[source.r + 1][source.c + 1] === AIR) {
      fall(grid, { ...source, r: source.r + 1, c: source.c + 1 }, status);
    }
  }
  // if you're stuck, fill the space (only if you are at the end of the path)
  if (status.addSand) {
    grid[source.r][source.c] = SAND;
    status.addSand = false;
  }
};

const solve = (data: string) => {
  const dataParsed = parseScan(data);
  const grid: string[][] = dataParsed[0] as string[][];
  const source: Coordinate = dataParsed[1] as Coordinate;
  source.r += 1; // start falling

  const status: Status = { infinity: false, addSand: true };
  let count = 0;
  while (!status.infinity) {
    status.addSand = true;
    fall(grid, source, status);
    if (!status.infinity) {
      count += 1;
    }
  }

  return count;
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 24);
  const t0 = performance.now();
  console.log("SOLUTION", solve(input));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
