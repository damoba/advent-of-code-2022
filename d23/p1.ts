import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

type Elf = { r: number; c: number };

const GROUND = ".";
const ELF = "#";
const PROPOSAL_ORDER = ["N", "S", "W", "E"];
type Dir = typeof PROPOSAL_ORDER[number];

const ROUNDS = 10;

const parseWorld = (data: string) => {
  const mapRows = data.split("\n").reduce((acc, row) => {
    if (row) {
      acc.push(row);
    }
    return acc;
  }, [] as string[]);
  const groundLenRows = new Array(mapRows.length).fill(0);
  const groundLenCols = new Array(mapRows[0].length * 3).fill(".");

  const map = groundLenRows
    .map(() => [...groundLenCols])
    .concat(
      mapRows
        .map((line) =>
          new Array(line.length)
            .fill(GROUND)
            .concat(line.split("").concat(new Array(line.length).fill(GROUND)))
        )
        .concat([...groundLenRows].map(() => [...groundLenCols]))
    );

  const elves: string[] = [];
  map.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell === ELF) {
        elves.push(JSON.stringify({ r, c }));
      }
    });
  });

  return [map as string[][], elves as string[]];
};

const checkProposal = (map: string[][], elf: string, dir: string) => {
  const { r, c } = JSON.parse(elf) as Elf;
  const northIsValid =
    map[r - 1][c - 1] === GROUND &&
    map[r - 1][c] === GROUND &&
    map[r - 1][c + 1] === GROUND;
  const southIsValid =
    map[r + 1][c - 1] === GROUND &&
    map[r + 1][c] === GROUND &&
    map[r + 1][c + 1] === GROUND;
  const westIsValid =
    map[r - 1][c - 1] === GROUND &&
    map[r][c - 1] === GROUND &&
    map[r + 1][c - 1] === GROUND;
  const eastIsValid =
    map[r - 1][c + 1] === GROUND &&
    map[r][c + 1] === GROUND &&
    map[r + 1][c + 1] === GROUND;
  const validChecks = [northIsValid, southIsValid, westIsValid, eastIsValid];

  if (northIsValid && southIsValid && westIsValid && eastIsValid) {
    return null;
  }

  const dirIdx = PROPOSAL_ORDER.indexOf(dir);
  let foundValidDir = {
    dir: PROPOSAL_ORDER[dirIdx],
    isValid: validChecks[dirIdx],
  };
  let nextDirIdx = (dirIdx + 1) % PROPOSAL_ORDER.length;
  while (!foundValidDir.isValid && nextDirIdx !== dirIdx) {
    foundValidDir = {
      dir: PROPOSAL_ORDER[nextDirIdx],
      isValid: validChecks[nextDirIdx],
    };
    nextDirIdx = (nextDirIdx + 1) % PROPOSAL_ORDER.length;
  }

  if (foundValidDir.isValid) {
    return foundValidDir.dir;
  } else {
    return null;
  }
};

const getCoorFromDir = (elf: string, dir: Dir) => {
  const { r, c } = JSON.parse(elf) as Elf;
  switch (dir) {
    case "N":
      return { r: r - 1, c };
    case "S":
      return { r: r + 1, c };
    case "W":
      return { r, c: c - 1 };
    case "E":
      return { r, c: c + 1 };
  }
};

const performRound = (
  map: string[][],
  elves: { vals: string[] },
  orderIdx: number
) => {
  const dirProposals = new Set<string>();
  const dirConflicts = new Set<string>();
  const elvesNextDirs = new Map<string, string>();

  for (let i = 0; i < elves.vals.length; i++) {
    const elf = elves.vals[i];
    const dir = PROPOSAL_ORDER[orderIdx];
    const validDir = checkProposal(map, elf, dir);
    if (!validDir) {
      continue;
    }
    const coor = getCoorFromDir(elf, validDir);
    const coorKey = JSON.stringify(coor);
    elvesNextDirs.set(elf, coorKey);
    if (dirProposals.has(coorKey)) {
      dirConflicts.add(coorKey);
    } else {
      dirProposals.add(coorKey);
    }
  }

  const newElves: string[] = [];
  for (let i = 0; i < elves.vals.length; i++) {
    const elf = elves.vals[i];
    const coorKey = elvesNextDirs.get(elf)!;
    if (!coorKey || dirConflicts.has(coorKey)) {
      newElves.push(elf);
      continue;
    }

    const { r, c } = JSON.parse(elf) as Elf;
    map[r][c] = GROUND;
    const newCoor = JSON.parse(coorKey) as Elf;
    map[newCoor.r][newCoor.c] = ELF;

    newElves.push(coorKey);
  }
  elves.vals = newElves;
};

const findGroundTiles = (map: string[][]) => {
  let minRow = map.length;
  let maxRow = 0;
  let minCol = map[0].length;
  let maxCol = 0;

  map.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell === ELF) {
        minRow = Math.min(minRow, r);
        maxRow = Math.max(maxRow, r);
        minCol = Math.min(minCol, c);
        maxCol = Math.max(maxCol, c);
      }
    });
  });

  let groundTiles = 0;
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      if (map[r][c] === GROUND) {
        groundTiles++;
      }
    }
  }
  return groundTiles;
};

const solve = (data: string) => {
  const [mapOg, elvesOg] = parseWorld(data);
  const map = mapOg as string[][];
  const elves = { vals: elvesOg as string[] };

  for (let round = 0; round < ROUNDS; round++) {
    performRound(map, elves, round % PROPOSAL_ORDER.length);
  }

  return findGroundTiles(map);
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 110);
  const t0 = performance.now();
  console.log("SOLUTION", solve(input));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
