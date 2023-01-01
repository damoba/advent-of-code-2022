import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

type Rock = {
  shape: string[][];
  height: number;
  width: number;
  bases: number;
  tops: number;
};
type RockStatus = { count: number; maxHeight: number };
type LoopStats = {
  firstRock: RockStatus;
  secondRock: RockStatus;
  nextLoopFirstRock: RockStatus;
};

const ROCKS: Rock[] = [
  {
    shape: [["#", "#", "#", "#"]],
    height: 1,
    width: 4,
    bases: 1,
    tops: 1,
  },
  {
    shape: [
      [".", "#", "."],
      ["#", "#", "#"],
      [".", "#", "."],
    ],
    height: 3,
    width: 3,
    bases: 2,
    tops: 2,
  },
  {
    shape: [
      [".", ".", "#"],
      [".", ".", "#"],
      ["#", "#", "#"],
    ],
    height: 3,
    width: 3,
    bases: 1,
    tops: 3,
  },
  {
    shape: [["#"], ["#"], ["#"], ["#"]],
    height: 4,
    width: 1,
    bases: 1,
    tops: 1,
  },
  {
    shape: [
      ["#", "#"],
      ["#", "#"],
    ],
    height: 2,
    width: 2,
    bases: 1,
    tops: 1,
  },
];
const ROCK_MAX_COUNT = 1000000000000;
const ROCK_INIT_DIST = 4;
const CHAMBER_INIT_LEN = 7;
const CHAMBER_WIDTH = 7;
const JET_LEFT = "<";
const JET_RIGHT = ">";

const createRockLefts = (rock: Rock, rockHeight: number) => {
  const rockLefts = [];
  for (let i = 0; i < rock.height; i++) {
    const posRow = rockHeight - rock.height + 1 + i;
    let posCol = 1;

    for (let j = 0; j < rock.width; j++) {
      if (rock.shape[i][j] === "#") {
        posCol += j + 1;
        break;
      }
    }
    rockLefts.push([posRow, posCol]);
  }
  return rockLefts;
};

const createRockRights = (rock: Rock, rockHeight: number) => {
  const rockRights = [];
  for (let i = 0; i < rock.height; i++) {
    const posRow = rockHeight - rock.height + 1 + i;
    let posCol = 1;

    for (let j = rock.width - 1; j >= 0; j--) {
      if (rock.shape[i][j] === "#") {
        posCol += j + 1;
        break;
      }
    }
    rockRights.push([posRow, posCol]);
  }
  return rockRights;
};

const createRockBottoms = (
  rock: Rock,
  rockHeight: number,
  rockLefts: number[][]
) => {
  const rockBottoms = [];
  for (let i = 0; i < rock.width; i++) {
    const posCol =
      rock.bases === 2
        ? rockLefts[rock.height - 1][1] - 1 + i
        : rockLefts[rock.height - 1][1] + i;

    if (rock.shape[rock.height - rock.bases][i] === "#") {
      if (rock.bases === 2 && (i === 0 || i === 2)) {
        rockBottoms.push([rockHeight - 1, posCol]);
        continue;
      }
      rockBottoms.push([rockHeight, posCol]);
    }
  }
  return rockBottoms;
};

const createRockTops = (
  rock: Rock,
  rockHeight: number,
  rockLefts: number[][]
) => {
  const rockTops = [];
  for (let i = 0; i < rock.width; i++) {
    const posCol =
      rock.bases === 2
        ? rockLefts[0][1] - 1 + i
        : rock.tops === 3
        ? rockLefts[0][1] - 2 + i
        : rockLefts[0][1] + i;
    if (rock.shape[rock.height - rock.bases][i] === "#") {
      if (rock.bases === 2 && (i === 0 || i === 2)) {
        rockTops.push([rockHeight - rock.height + 2, posCol]);
        continue;
      } else if (rock.tops === 3 && (i === 0 || i === 1)) {
        rockTops.push([rockHeight - rock.height + 3, posCol]);
        continue;
      }
      rockTops.push([rockHeight - rock.height + 1, posCol]);
    }
  }
  return rockTops;
};

const rockCanGoLeft = (rockLefts: number[][], chamber: string[][]) => {
  return rockLefts.every((rockLeft) => {
    const [row, col] = rockLeft;
    return col > 0 && chamber[row][col - 1] === ".";
  });
};

const rockCanGoRight = (rockRights: number[][], chamber: string[][]) => {
  return rockRights.every((rockRight) => {
    const [row, col] = rockRight;
    return col < CHAMBER_WIDTH - 1 && chamber[row][col + 1] === ".";
  });
};

const rockCanGoDown = (rockBottoms: number[][], chamber: string[][]) => {
  return rockBottoms.every((rockBottom) => {
    const [row, col] = rockBottom;
    return row < chamber.length - 1 && chamber[row + 1][col] === ".";
  });
};

const updateFloor = (floor: number[], rock: Rock, rockTops: number[][]) => {
  for (let i = 0; i < rock.width; i++) {
    floor[rockTops[i][1]] = Math.min(floor[rockTops[i][1]], rockTops[i][0]);
  }
};

const calcRockStatus = (jetIdx: number, rockIdx: number, floor: number[]) => {
  return JSON.stringify({
    jetIdx,
    rockIdx,
    floorDifs: floor.reduce((a, c, i) => {
      if (i < floor.length - 1) {
        a.push(c - floor[i + 1]);
        return a;
      } else {
        return a;
      }
    }, [] as number[]),
  });
};

const solve = (data: string) => {
  const jets = data;
  let jetIdx = 0;
  const chamber = new Array(CHAMBER_INIT_LEN)
    .fill(0)
    .map(() => new Array(CHAMBER_WIDTH).fill("."));
  let maxHeight = 0;
  let floor = new Array(CHAMBER_WIDTH).fill(chamber.length);
  const rockStats = new Map<string, RockStatus>();
  let loopStats: LoopStats = {
    firstRock: { count: 0, maxHeight: 0 },
    secondRock: { count: 0, maxHeight: 0 },
    nextLoopFirstRock: { count: 0, maxHeight: 0 },
  };

  for (let rockCount = 0; rockCount < ROCK_MAX_COUNT; rockCount++) {
    const rockCurrent = ROCKS[rockCount % ROCKS.length];
    const rockHeight = chamber.length - maxHeight - ROCK_INIT_DIST;

    let rockLefts = createRockLefts(rockCurrent, rockHeight);
    let rockRights = createRockRights(rockCurrent, rockHeight);
    let rockBottoms = createRockBottoms(rockCurrent, rockHeight, rockLefts);
    let rockTops = createRockTops(rockCurrent, rockHeight, rockLefts);

    let rockHitBottom = false;
    let foundLoop = false;

    while (!rockHitBottom) {
      const jet = jets[jetIdx];

      if (jet === JET_LEFT && rockCanGoLeft(rockLefts, chamber)) {
        rockLefts = rockLefts.map(([row, col]) => [row, col - 1]);
        rockRights = rockRights.map(([row, col]) => [row, col - 1]);
        rockBottoms = rockBottoms.map(([row, col]) => [row, col - 1]);
        rockTops = rockTops.map(([row, col]) => [row, col - 1]);
      } else if (jet === JET_RIGHT && rockCanGoRight(rockRights, chamber)) {
        rockLefts = rockLefts.map(([row, col]) => [row, col + 1]);
        rockRights = rockRights.map(([row, col]) => [row, col + 1]);
        rockBottoms = rockBottoms.map(([row, col]) => [row, col + 1]);
        rockTops = rockTops.map(([row, col]) => [row, col + 1]);
      }

      if (rockCanGoDown(rockBottoms, chamber)) {
        rockLefts = rockLefts.map(([row, col]) => [row + 1, col]);
        rockRights = rockRights.map(([row, col]) => [row + 1, col]);
        rockBottoms = rockBottoms.map(([row, col]) => [row + 1, col]);
        rockTops = rockTops.map(([row, col]) => [row + 1, col]);
      } else {
        const topLeftCorner =
          rockCurrent.bases === 2
            ? [rockTops[0][0] - 1, rockTops[0][1]]
            : rockCurrent.tops === 3
            ? [rockTops[0][0] - 2, rockTops[0][1]]
            : [rockTops[0][0], rockTops[0][1]];
        for (let i = 0; i < rockCurrent.height; i++) {
          for (let j = 0; j < rockCurrent.width; j++) {
            if (rockCurrent.shape[i][j] === "#") {
              chamber[i + topLeftCorner[0]][j + topLeftCorner[1]] = "#";
            }
          }
        }

        const prevMaxHeight = maxHeight;
        maxHeight = Math.max(
          maxHeight,
          ...rockTops.map(([row]) => chamber.length - row)
        );
        if (maxHeight > prevMaxHeight) {
          for (let i = 0; i < maxHeight - prevMaxHeight; i++) {
            chamber.unshift(new Array(CHAMBER_WIDTH).fill("."));
            floor = floor.map((f) => f + 1);
            rockLefts = rockLefts.map(([row, col]) => [row + 1, col]);
            rockRights = rockRights.map(([row, col]) => [row + 1, col]);
            rockBottoms = rockBottoms.map(([row, col]) => [row + 1, col]);
            rockTops = rockTops.map(([row, col]) => [row + 1, col]);
          }
        }

        updateFloor(floor, rockCurrent, rockTops);
        const rockStatus = calcRockStatus(
          jetIdx,
          rockCount % ROCKS.length,
          floor
        );

        if (rockStats.has(rockStatus)) {
          const loopsFirstRock = rockStats.get(rockStatus)!;
          let loopsSecondRock: RockStatus;
          for (const [_, value] of rockStats) {
            if (value.count === loopsFirstRock.count + 1) {
              loopsSecondRock = value;
              break;
            }
          }
          loopStats = {
            firstRock: loopsFirstRock,
            secondRock: loopsSecondRock!,
            nextLoopFirstRock: { count: rockCount, maxHeight },
          };

          foundLoop = true;
        } else {
          rockStats.set(rockStatus, { count: rockCount, maxHeight });
        }

        rockHitBottom = true;
      }
      jetIdx = (jetIdx + 1) % jets.length;
    }

    if (foundLoop) {
      const { firstRock, secondRock, nextLoopFirstRock } = loopStats;

      maxHeight = firstRock.maxHeight;
      const firstRockInLoopDiff = secondRock.maxHeight - firstRock.maxHeight;
      maxHeight -= firstRockInLoopDiff;

      const rockCountLeft = ROCK_MAX_COUNT - firstRock.count;
      const loopLength = nextLoopFirstRock.count - firstRock.count;
      const loopsLeft = Math.floor(rockCountLeft / loopLength);

      const extraRocks = rockCountLeft % loopLength;
      if (extraRocks > 0) {
        let extraRockStats: RockStatus;
        for (const [_, value] of rockStats) {
          if (value.count === firstRock.count + extraRocks + 1) {
            extraRockStats = value;
            break;
          }
        }
        maxHeight +=
          extraRockStats!.maxHeight - firstRock.maxHeight - firstRockInLoopDiff;
      }

      const maxHeightDiff = nextLoopFirstRock.maxHeight - firstRock.maxHeight;
      maxHeight += maxHeightDiff * loopsLeft;
      break;
    }
  }

  return maxHeight;
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 1514285714288);
  const t0 = performance.now();
  console.log("SOLUTION", solve(input));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
