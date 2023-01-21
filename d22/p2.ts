import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import type { Cube, CubeFace, CubeFaceInfo } from "./cubes.ts";
import { exampleCube, inputCube } from "./cubes.ts";

const RIGHT = "Right";
const DOWN = "Down";
const LEFT = "Left";
const UP = "Up";
const FACINGS = [RIGHT, DOWN, LEFT, UP] as const;
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
  cubeFace: { val: CubeFace },
  facing: { val: Facing },
  cube: Cube
) => {
  const cubeFaceInfo = cube[cubeFace.val];
  const cubeRowOffset = pos.row - cubeFaceInfo.topLeft.row;
  const cubeRowOffsetFromEnd = cube.len - 1 - cubeRowOffset;
  const cubeColOffset = pos.col - cubeFaceInfo.topLeft.col;
  const cubeColOffsetFromEnd = cube.len - 1 - cubeColOffset;

  const nextCubeFace: number = cube[cubeFace.val][facing.val].cubeFace;
  const nextCubeFaceInfo = cube[nextCubeFace as keyof Cube] as CubeFaceInfo;
  const nextFacing: string = cube[cubeFace.val][facing.val].facing;
  const nextCubeRowStart = nextCubeFaceInfo.topLeft.row;
  const nextCubeRowEnd = nextCubeRowStart + cube.len - 1;
  const nextCubeColStart = nextCubeFaceInfo.topLeft.col;
  const nextCubeColEnd = nextCubeColStart + cube.len - 1;

  let nextRow = pos.row;
  let nextCol = pos.col;

  switch (facing.val) {
    case UP:
      switch (nextFacing) {
        case UP:
          nextRow = nextCubeRowEnd;
          nextCol = nextCubeColStart + cubeColOffset;
          break;
        case RIGHT:
          nextRow = nextCubeRowStart + cubeColOffset;
          nextCol = nextCubeColStart;
          break;
        case DOWN:
          nextRow = nextCubeRowStart;
          nextCol = nextCubeColStart + cubeColOffsetFromEnd;
          break;
        case LEFT:
          nextRow = nextCubeRowStart + cubeColOffsetFromEnd;
          nextCol = nextCubeColEnd;
      }
      break;
    case RIGHT:
      switch (nextFacing) {
        case UP:
          nextRow = nextCubeRowEnd;
          nextCol = nextCubeColStart + cubeRowOffset;
          break;
        case RIGHT:
          nextRow = nextCubeRowStart + cubeRowOffset;
          nextCol = nextCubeColStart;
          break;
        case DOWN:
          nextRow = nextCubeRowStart;
          nextCol = nextCubeColStart + cubeRowOffsetFromEnd;
          break;
        case LEFT:
          nextRow = nextCubeRowStart + cubeRowOffsetFromEnd;
          nextCol = nextCubeColEnd;
      }
      break;
    case DOWN:
      switch (nextFacing) {
        case UP:
          nextRow = nextCubeRowEnd;
          nextCol = nextCubeColStart + cubeColOffsetFromEnd;
          break;
        case RIGHT:
          nextRow = nextCubeRowStart + cubeColOffsetFromEnd;
          nextCol = nextCubeColStart;
          break;
        case DOWN:
          nextRow = nextCubeRowStart;
          nextCol = nextCubeColStart + cubeColOffset;
          break;
        case LEFT:
          nextRow = nextCubeRowStart + cubeColOffset;
          nextCol = nextCubeColEnd;
      }
      break;
    case LEFT:
      switch (nextFacing) {
        case UP:
          nextRow = nextCubeRowEnd;
          nextCol = nextCubeColStart + cubeRowOffsetFromEnd;
          break;
        case RIGHT:
          nextRow = nextCubeRowStart + cubeRowOffsetFromEnd;
          nextCol = nextCubeColStart;
          break;
        case DOWN:
          nextRow = nextCubeRowStart;
          nextCol = nextCubeColStart + cubeRowOffset;
          break;
        case LEFT:
          nextRow = nextCubeRowStart + cubeRowOffset;
          nextCol = nextCubeColEnd;
      }
  }
  if (map[nextRow][nextCol] === WALL) {
    return true;
  } else if (map[nextRow][nextCol] === TILE) {
    pos.row = nextRow;
    pos.col = nextCol;
    cubeFace.val = nextCubeFace as CubeFace;
    facing.val = nextFacing as Facing;
    return false;
  }
};

const move = (
  map: string[][],
  pos: { row: number; col: number },
  cubeFace: { val: CubeFace },
  facing: { val: Facing },
  cube: Cube
) => {
  switch (facing.val) {
    case UP:
      if (
        pos.row === 0 ||
        map[pos.row - 1][pos.col] === EDGE ||
        pos.row === cube[cubeFace.val].topLeft.row
      ) {
        const metWall = teleport(map, pos, cubeFace, facing, cube);
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
    case RIGHT:
      if (
        pos.col === map[pos.row].length - 1 ||
        map[pos.row][pos.col + 1] === EDGE ||
        pos.col === cube[cubeFace.val].topLeft.col + cube.len - 1
      ) {
        const metWall = teleport(map, pos, cubeFace, facing, cube);
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
    case DOWN:
      if (
        pos.row === map.length - 1 ||
        map[pos.row + 1][pos.col] === EDGE ||
        pos.row === cube[cubeFace.val].topLeft.row + cube.len - 1
      ) {
        const metWall = teleport(map, pos, cubeFace, facing, cube);
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
    case LEFT:
      if (
        pos.col === 0 ||
        map[pos.row][pos.col - 1] === EDGE ||
        pos.col === cube[cubeFace.val].topLeft.col
      ) {
        const metWall = teleport(map, pos, cubeFace, facing, cube);
        return metWall;
      }
      if (map[pos.row][pos.col - 1] === WALL) {
        return true;
      }
      if ((map[pos.row][pos.col - 1] === TILE, cube)) {
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
  cubeFace: { val: CubeFace },
  facing: { val: Facing },
  cube: Cube
) => {
  for (const step of path) {
    if (typeof step === "number") {
      for (let i = 0; i < step; i++) {
        const metWall = move(map, pos, cubeFace, facing, cube);
        if (metWall) {
          break;
        }
      }
    } else {
      rotate(facing, step);
    }
  }
};

const solve = (data: string, cube: Cube) => {
  const [map, path] = parseMap(data);

  const pos = { row: 0, col: map[0].indexOf(TILE) };
  const cubeFace: { val: CubeFace } = { val: 1 };
  const facing: { val: Facing } = { val: RIGHT };
  traverseMap(map, path, pos, cubeFace, facing, cube);

  pos.row++;
  pos.col++;
  return 1000 * pos.row + 4 * pos.col + FACINGS.indexOf(facing.val);
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example, exampleCube), 5031);
  const t0 = performance.now();
  console.log("SOLUTION", solve(input, inputCube));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
