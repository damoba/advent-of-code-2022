import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

type Knot = { r: number; c: number; str: string };

const KNOT_COUNT = 10;

const MOVE_RIGHT = "R";
const MOVE_LEFT = "L";
const MOVE_UP = "U";
const MOVE_DOWN = "D";

const parseMotion = (motion: string) => {
  return motion.split(" ").map((x, i) => {
    if (i === 1) {
      return parseInt(x, 10);
    } else {
      return x;
    }
  });
};

const move = (visitedPos: Set<string>, knotsPos: Knot[], motion: string) => {
  const [dir, dist]: [string, number] = parseMotion(motion) as [string, number];

  for (let i = 0; i < dist; i++) {
    switch (dir) {
      case MOVE_RIGHT:
        knotsPos[0].c++;
        break;
      case MOVE_LEFT:
        knotsPos[0].c--;
        break;
      case MOVE_UP:
        knotsPos[0].r--;
        break;
      case MOVE_DOWN:
        knotsPos[0].r++;
        break;
      default:
        break;
    }
    knotsPos[0].str = [knotsPos[0].r, knotsPos[0].c].toString();

    for (let j = 0; j < KNOT_COUNT - 1; j++) {
      const knotDistR = knotsPos[j].r - knotsPos[j + 1].r;
      const knotDistRAbs = Math.abs(knotDistR);
      const knotDistC = knotsPos[j].c - knotsPos[j + 1].c;
      const knotDistCAbs = Math.abs(knotDistC);

      if (knotDistRAbs > 1 && knotDistCAbs === 0) {
        knotDistR < 0 ? knotsPos[j + 1].r-- : knotsPos[j + 1].r++;
      } else if (knotDistCAbs > 1 && knotDistRAbs === 0) {
        knotDistC < 0 ? knotsPos[j + 1].c-- : knotsPos[j + 1].c++;
      } else if (
        (knotDistRAbs > 1 && knotDistCAbs >= 1) ||
        (knotDistCAbs > 1 && knotDistRAbs >= 1)
      ) {
        knotDistR < 0 ? knotsPos[j + 1].r-- : knotsPos[j + 1].r++;
        knotDistC < 0 ? knotsPos[j + 1].c-- : knotsPos[j + 1].c++;
      }

      knotsPos[j + 1].str = [knotsPos[j + 1].r, knotsPos[j + 1].c].toString();
    }

    visitedPos.add(knotsPos[KNOT_COUNT - 1].str);
  }
};

const solve = (data: string) => {
  const motions = data.split("\n");
  const knotsPos: Knot[] = new Array(KNOT_COUNT).fill(0).map(() => ({
    r: 0,
    c: 0,
    str: [0, 0].toString(),
  }));
  const visitedPos = new Set<string>();
  visitedPos.add(knotsPos[KNOT_COUNT - 1].str);

  motions.forEach((motion) => {
    move(visitedPos, knotsPos, motion);
  });
  return visitedPos.size;
};

const example = await Deno.readTextFile("./example_p2.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 36);
  const t0 = performance.now();
  console.log("SOLUTION", solve(input));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
