import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

const DIRS = ["^", "v", "<", ">"];
const DIRS_SET = new Set(DIRS);
type Dir = typeof DIRS[number];
type Stats = { mins: number; posR: number; posC: number };

const minRow = 0;
let maxRow = -Infinity;
const minCol = 0;
let maxCol = -Infinity;

const parseBlizzards = (data: string) => {
  const blizzardsAtMin = new Map<number, Map<string, Dir[]>>();
  blizzardsAtMin.set(0, new Map());

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
          blizzardsAtMin.get(0)!.set(`${r},${c}`, [dir]);
        }
      });
    });

  return blizzardsAtMin;
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
    case "^":
      if (r === minRow + 1) {
        r = maxRow - 1;
      } else {
        r--;
      }
      break;
    case "v":
      if (r === maxRow - 1) {
        r = minRow + 1;
      } else {
        r++;
      }
      break;
    case "<":
      if (c === minCol + 1) {
        c = maxCol - 1;
      } else {
        c--;
      }
      break;
    case ">":
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
  blizzardsAtMin: Map<number, Map<string, Dir[]>>,
  blizzMovesCache: Map<string, string>
) => {
  const prevBlizzards = blizzardsAtMin.get(mins - 1)!;
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

  blizzardsAtMin.set(mins, currBlizzards);
  return currBlizzards;
};

const getNeighbours = (
  r: number,
  c: number,
  currBlizzards: Map<string, Dir[]>
) => {
  const neighbours = [];

  if (r > minRow + 1 && !currBlizzards.has(`${r - 1},${c}`)) {
    neighbours.push({ r: r - 1, c });
  }
  if (
    (r < maxRow - 1 || c === maxCol - 1) &&
    !currBlizzards.has(`${r + 1},${c}`)
  ) {
    neighbours.push({ r: r + 1, c });
  }
  if (c > minCol + 1 && r > minRow && !currBlizzards.has(`${r},${c - 1}`)) {
    neighbours.push({ r, c: c - 1 });
  }
  if (c < maxCol - 1 && r > minRow && !currBlizzards.has(`${r},${c + 1}`)) {
    neighbours.push({ r, c: c + 1 });
  }

  return neighbours;
};

const walkWorld = (
  blizzardsAtMin: Map<number, Map<string, Dir[]>>,
  blizzMovesCache: Map<string, string>,
  startR: number,
  startC: number,
  destR: number,
  destC: number
) => {
  const visited = new Set<string>();
  const openSpots: Stats[] = [{ mins: 0, posR: startR, posC: startC }];

  while (openSpots.length) {
    const { mins, posR, posC } = openSpots.shift()!;
    const key = `${mins},${posR},${posC}`;
    if (visited.has(key)) {
      continue;
    }
    visited.add(key);

    if (posR === destR && posC === destC) {
      return mins;
    }

    const nextBlizzards =
      blizzardsAtMin.get(mins + 1) ||
      calcBlizzardsAtMin(mins + 1, blizzardsAtMin, blizzMovesCache);
    if (!nextBlizzards.has(`${posR},${posC}`)) {
      openSpots.push({
        mins: mins + 1,
        posR,
        posC,
      });
    }
    const neighbours = getNeighbours(posR, posC, nextBlizzards);
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
  const blizzardsAtMin = parseBlizzards(data);
  const blizzMovesCache = new Map<string, string>();
  return walkWorld(blizzardsAtMin, blizzMovesCache, 0, 1, maxRow, maxCol - 1);
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 18);
  const t0 = performance.now();
  console.log("SOLUTION", solve(input));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
