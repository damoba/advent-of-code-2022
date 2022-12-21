import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

type Coordinate = { r: number; c: number };
type Status = { addSand: boolean };

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

  const grid = new Array(maxR - minR + 3)
    .fill(0)
    .map(() => Array(maxC - minC + 1).fill("."));

  grid[0][500 - minC] = "+";
  for (let j = 0; j < grid[0].length; j++) {
    grid[grid.length - 1][j] = "#";
  }
  lines.forEach((line) => {
    for (let i = 1; i < line.length; i++) {
      if (line[i][1] === line[i - 1][1]) {
        if (line[i][0] - line[i - 1][0] > 0) {
          for (let j = 0; j <= line[i][0] - line[i - 1][0]; j++) {
            grid[line[i][1]][line[i - 1][0] + j] = "#";
          }
        } else {
          for (let j = 0; j <= line[i - 1][0] - line[i][0]; j++) {
            grid[line[i][1]][line[i - 1][0] - j] = "#";
          }
        }
      } else {
        if (line[i][1] - line[i - 1][1] > 0) {
          for (let j = 0; j <= line[i][1] - line[i - 1][1]; j++) {
            grid[line[i - 1][1] + j][line[i][0]] = "#";
          }
        } else {
          for (let j = 0; j <= line[i - 1][1] - line[i][1]; j++) {
            grid[line[i - 1][1] - j][line[i][0]] = "#";
          }
        }
      }
    }
  });

  return [grid, { r: 0, c: 500 - minC }];
};

const fall = (
  grid: string[][],
  source: Coordinate,
  unit: Coordinate,
  status: Status
) => {
  while (unit.r < grid.length && grid[unit.r][unit.c] === ".") {
    unit.r += 1;
  }
  unit.r -= 1; // undo the last step
  if (unit.c - 1 >= -1) {
    // if you went too far left, add a column
    if (unit.c === 0) {
      grid.map((row, r) =>
        r !== grid.length - 1 ? row.splice(0, 0, ".") : row.splice(0, 0, "#")
      );
      source.c++;
      // if you are the end of the path, fill the space
      if (status.addSand) {
        grid[grid.length - 2][unit.c] = "o";
        status.addSand = false;
      }
      return;
    }
    // go left first if you can
    else if (grid[unit.r + 1][unit.c - 1] === ".") {
      fall(grid, source, { ...unit, r: unit.r + 1, c: unit.c - 1 }, status);
    }
  }
  // if you can't go left check if you can go right
  if (grid[unit.r + 1][unit.c - 1] !== "." && unit.c + 1 <= grid[0].length) {
    // if you went too far right, add a column
    if (unit.c === grid[0].length - 1) {
      grid.map((row, r) =>
        r !== grid.length - 1 ? row.push(".") : row.push("#")
      );
      // if you are the end of the path, fill the space
      if (status.addSand) {
        grid[grid.length - 2][unit.c + 1] = "o";
        status.addSand = false;
      }
      return;
    }
    // if you can go right, go right
    else if (grid[unit.r + 1][unit.c + 1] === ".") {
      fall(grid, source, { ...unit, r: unit.r + 1, c: unit.c + 1 }, status);
    }
  }
  // if you're stuck, fill the space (only if you are at the end of the path)
  if (status.addSand) {
    grid[unit.r][unit.c] = "o";
    status.addSand = false;
  }
};

const solve = (data: string) => {
  const dataParsed = parseScan(data);
  const grid: string[][] = dataParsed[0] as string[][];
  const source: Coordinate = dataParsed[1] as Coordinate;
  source.r += 1; // start falling

  const status: Status = { addSand: true };
  let count = 0;
  while (grid[source.r - 1][source.c] !== "o") {
    status.addSand = true;
    fall(grid, source, { ...source }, status);
    if (grid[source.r - 1][source.c] !== "o") {
      count += 1;
    }
  }

  return count;
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 93);
  const t0 = performance.now();
  console.log("SOLUTION", solve(input));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
