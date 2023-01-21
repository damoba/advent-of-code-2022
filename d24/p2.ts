import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

const UP = "^";
const DOWN = "v";
const LEFT = "<";
const RIGHT = ">";
const DIRS = [UP, DOWN, LEFT, RIGHT];
const DIRS_SET = new Set(DIRS);
type Dir = typeof DIRS[number];
type Stats = { mins: number; posR: number; posC: number };

const ST = "S";
const GL = "G";
const DESTS = [ST, GL];
type Dest = typeof DESTS[number];
// to be updated when blizzards are parsed:
const destsCoor = {
  G: { start: { r: 0, c: 1 }, end: { r: 0, c: 1 } },
  S: { start: { r: 0, c: 1 }, end: { r: 0, c: 1 } },
};

const minRow = 0;
let maxRow = -Infinity;
const minCol = 0;
let maxCol = -Infinity;

const parseBlizzards = (data: string) => {
  const blizzsAtMin = new Map<number, Map<string, Dir[]>>();
  blizzsAtMin.set(0, new Map());

  data
    .split("\n")
    .reduce((acc, line) => {
      if (line) {
        acc.push(line);
      }
      return acc;
    }, [] as string[])
    .map((line, r) => {
      maxRow = Math.max(maxRow, r);
      line.split("").map((dir, c) => {
        maxCol = Math.max(maxCol, c);
        if (DIRS_SET.has(dir)) {
          blizzsAtMin.get(0)!.set(`${r},${c}`, [dir]);
        }
      });
    });

  destsCoor.G.end.r = maxRow;
  destsCoor.G.end.c = maxCol - 1;
  destsCoor.S.start.r = maxRow;
  destsCoor.S.start.c = maxCol - 1;
  return blizzsAtMin;
};

const moveBlizzard = (
  coor: string,
  dir: Dir,
  blizzMovesCache: Map<string, string>
) => {
  const key = `${coor},${dir}`;
  if (blizzMovesCache.has(key)) {
    return blizzMovesCache.get(key)!;
  }

  let [r, c] = coor.split(",").map((n) => parseInt(n, 10));
  switch (dir) {
    case UP:
      if (r === minRow + 1) {
        r = maxRow - 1;
      } else {
        r--;
      }
      break;
    case DOWN:
      if (r === maxRow - 1) {
        r = minRow + 1;
      } else {
        r++;
      }
      break;
    case LEFT:
      if (c === minCol + 1) {
        c = maxCol - 1;
      } else {
        c--;
      }
      break;
    case RIGHT:
      if (c === maxCol - 1) {
        c = minCol + 1;
      } else {
        c++;
      }
      break;
  }

  const newCoor = `${r},${c}`;
  blizzMovesCache.set(key, newCoor);
  return newCoor;
};

const calcBlizzardsAtMin = (
  mins: number,
  blizzsAtMin: Map<number, Map<string, Dir[]>>,
  blizzMovesCache: Map<string, string>
) => {
  const prevBlizzards = blizzsAtMin.get(mins - 1)!;
  const currBlizzards = new Map<string, Dir[]>();

  prevBlizzards.forEach((dirs, coor) => {
    dirs.forEach((dir) => {
      const newCoor = moveBlizzard(coor, dir, blizzMovesCache);
      currBlizzards.set(
        newCoor,
        (currBlizzards.get(newCoor) || []).concat(dir)
      );
    });
  });

  blizzsAtMin.set(mins, currBlizzards);
  return currBlizzards;
};

const getNeighbours = (
  r: number,
  c: number,
  currBlizzards: Map<string, Dir[]>,
  dest: Dest
) => {
  const neighbours = [];

  if (
    (r > minRow + 1 || (dest === ST && c === minCol + 1)) &&
    !currBlizzards.has(`${r - 1},${c}`)
  ) {
    neighbours.push({ r: r - 1, c });
  }
  if (
    (r < maxRow - 1 || (dest === GL && c === maxCol - 1)) &&
    !currBlizzards.has(`${r + 1},${c}`)
  ) {
    neighbours.push({ r: r + 1, c });
  }
  if (
    c > minCol + 1 &&
    r > minRow &&
    r < maxRow &&
    !currBlizzards.has(`${r},${c - 1}`)
  ) {
    neighbours.push({ r, c: c - 1 });
  }
  if (
    c < maxCol - 1 &&
    r > minRow &&
    r < maxRow &&
    !currBlizzards.has(`${r},${c + 1}`)
  ) {
    neighbours.push({ r, c: c + 1 });
  }

  return neighbours;
};

const walkWorld = (
  blizzsAtMin: Map<number, Map<string, Dir[]>>,
  blizzMovesCache: Map<string, string>,
  startMins: number,
  dest: Dest
) => {
  const destObj = destsCoor[dest as keyof typeof destsCoor];
  const [startR, startC] = [destObj.start.r, destObj.start.c];
  const [endR, endC] = [destObj.end.r, destObj.end.c];
  const visited = new Set<string>();
  const openSpots: Stats[] = [{ mins: startMins, posR: startR, posC: startC }];

  while (openSpots.length) {
    const { mins, posR, posC } = openSpots.shift()!;
    const key = `${mins},${posR},${posC}`;
    if (visited.has(key)) {
      continue;
    }
    visited.add(key);

    if (posR === endR && endC === endC) {
      for (let i = 0; i < mins; i++) {
        blizzsAtMin.delete(i);
      }
      return mins;
    }

    const nextBlizzards =
      blizzsAtMin.get(mins + 1) ||
      calcBlizzardsAtMin(mins + 1, blizzsAtMin, blizzMovesCache);
    if (!nextBlizzards.has(`${posR},${posC}`)) {
      openSpots.push({
        mins: mins + 1,
        posR,
        posC,
      });
    }
    const neighbours = getNeighbours(posR, posC, nextBlizzards, dest);
    neighbours.forEach(({ r, c }) => {
      openSpots.push({
        mins: mins + 1,
        posR: r,
        posC: c,
      });
    });
  }
};

const solve = (data: string) => {
  const blizzsAtMin = parseBlizzards(data);
  const blizzMovesCache = new Map<string, string>();
  const minsRound1 = walkWorld(blizzsAtMin, blizzMovesCache, 0, GL);
  const minsRound2 = walkWorld(blizzsAtMin, blizzMovesCache, minsRound1!, ST);
  return walkWorld(blizzsAtMin, blizzMovesCache, minsRound2!, GL);
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 54);
  const t0 = performance.now();
  console.log("SOLUTION", solve(input));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
