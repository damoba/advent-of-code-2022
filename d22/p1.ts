import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

const FACINGS = ["Right", "Down", "Left", "Up"] as const;
type Facing = typeof FACINGS[number];

const ROTATIONS = { L: -1, R: 1 } as const;
type Rotation = keyof typeof ROTATIONS;

const TILE = ".";
const WALL = "#";
const EDGE = "!";

const parseMap = (data: string) => {
  let maxRowLen = 0;

  const [mapComb, pathComb] = data.split("\n\n");

  const map: string[][] = mapComb
    .split("\n")
    .map((line) => {
      maxRowLen = Math.max(maxRowLen, line.length);
      return line.replaceAll(" ", EDGE);
    })
    .map((line) => line.padEnd(maxRowLen, EDGE).split(""));

  const pathLessComb = pathComb.split("\n").reduce((acc, line) => {
    if (line) {
      return line;
    } else {
      return acc;
    }
  }, "");
  const pathNums = pathLessComb.split(/[R,L]+/).map((num) => parseInt(num));
  const pathRots = pathLessComb.split(/\d+/).filter((x) => x);
  const path: (number | Rotation)[] = [];
  const minPathLen = Math.min(pathNums.length, pathRots.length);
  for (let i = 0; i < minPathLen; i++) {
    path.push(pathNums[i], pathRots[i] as Rotation);
  }
  path.push(
    ...pathNums.slice(minPathLen),
    ...(pathRots as Rotation[]).slice(minPathLen)
  );

  return [map, path] as [string[][], (number | Rotation)[]];
};

const teleport = (
  map: string[][],
  pos: { row: number; col: number },
  facing: { val: Facing }
) => {
  if (facing.val == "Up") {
    let nextRow = map.length - 1;
    while (map[nextRow][pos.col] === EDGE) {
      nextRow--;
    }
    if (map[nextRow][pos.col] === WALL) {
      return true;
    } else if (map[nextRow][pos.col] === TILE) {
      pos.row = nextRow;
      return false;
    }
  } else if (facing.val == "Right") {
    let nextCol = 0;
    while (map[pos.row][nextCol] === EDGE) {
      nextCol++;
    }
    if (map[pos.row][nextCol] === WALL) {
      return true;
    } else if (map[pos.row][nextCol] === TILE) {
      pos.col = nextCol;
      return false;
    }
  } else if (facing.val == "Down") {
    let nextRow = 0;
    while (map[nextRow][pos.col] === EDGE) {
      nextRow++;
    }
    if (map[nextRow][pos.col] === WALL) {
      return true;
    } else if (map[nextRow][pos.col] === TILE) {
      pos.row = nextRow;
      return false;
    }
  } else if (facing.val == "Left") {
    let nextCol = map[pos.row].length - 1;
    while (map[pos.row][nextCol] === EDGE) {
      nextCol--;
    }
    if (map[pos.row][nextCol] === WALL) {
      return true;
    } else if (map[pos.row][nextCol] === TILE) {
      pos.col = nextCol;
      return false;
    }
  }
};

const move = (
  map: string[][],
  pos: { row: number; col: number },
  facing: { val: Facing }
) => {
  switch (facing.val) {
    case "Up":
      if (pos.row === 0 || map[pos.row - 1][pos.col] === EDGE) {
        const metWall = teleport(map, pos, facing);
        return metWall;
      }
      if (map[pos.row - 1][pos.col] === WALL) {
        return true;
      }
      if (map[pos.row - 1][pos.col] === TILE) {
        pos.row--;
        return false;
      }
      break;
    case "Right":
      if (
        pos.col === map[pos.row].length - 1 ||
        map[pos.row][pos.col + 1] === EDGE
      ) {
        const metWall = teleport(map, pos, facing);
        return metWall;
      }
      if (map[pos.row][pos.col + 1] === WALL) {
        return true;
      }
      if (map[pos.row][pos.col + 1] === TILE) {
        pos.col++;
        return false;
      }
      break;
    case "Down":
      if (pos.row === map.length - 1 || map[pos.row + 1][pos.col] === EDGE) {
        const metWall = teleport(map, pos, facing);
        return metWall;
      }
      if (map[pos.row + 1][pos.col] === WALL) {
        return true;
      }
      if (map[pos.row + 1][pos.col] === TILE) {
        pos.row++;
        return false;
      }
      break;
    case "Left":
      if (pos.col === 0 || map[pos.row][pos.col - 1] === EDGE) {
        const metWall = teleport(map, pos, facing);
        return metWall;
      }
      if (map[pos.row][pos.col - 1] === WALL) {
        return true;
      }
      if (map[pos.row][pos.col - 1] === TILE) {
        pos.col--;
        return false;
      }
      break;
  }
};

const rotate = (facing: { val: Facing }, rot: Rotation) => {
  const idx = FACINGS.indexOf(facing.val);
  facing.val =
    FACINGS[(idx + ROTATIONS[rot] + FACINGS.length) % FACINGS.length];
};

const traverseMap = (
  map: string[][],
  path: (number | Rotation)[],
  pos: { row: number; col: number },
  facing: { val: Facing }
) => {
  for (const step of path) {
    if (typeof step === "number") {
      for (let i = 0; i < step; i++) {
        const metWall = move(map, pos, facing);
        if (metWall) {
          break;
        }
      }
    } else {
      rotate(facing, step);
    }
  }
};

const solve = (data: string) => {
  const [map, path] = parseMap(data);

  const pos = { row: 0, col: map[0].indexOf(TILE) };
  const facing: { val: Facing } = { val: "Right" };
  traverseMap(map, path, pos, facing);

  pos.row++;
  pos.col++;
  return 1000 * pos.row + 4 * pos.col + FACINGS.indexOf(facing.val);
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 6032);
  const t0 = performance.now();
  console.log("SOLUTION", solve(input));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
