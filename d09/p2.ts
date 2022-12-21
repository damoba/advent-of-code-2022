import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

type Knot = { r: number; c: number; str: string };

const MOVE_UP_LEFT = "UL";
const MOVE_UP = "U";
const MOVE_UP_RIGHT = "UR";
const MOVE_LEFT = "L";
const MOVE_RIGHT = "R";
const MOVE_DOWN_LEFT = "DL";
const MOVE_DOWN = "D";
const MOVE_DOWN_RIGHT = "DR";

const calcMaxLen = (lines: string[]) => {
  return lines.reduce((acc, line) => {
    return Math.max(acc, parseInt(line.split(" ")[1], 10));
  }, 0);
};

const parseMotion = (motion: string) => {
  return motion.split(" ").map((x, i) => {
    if (i === 1) {
      return parseInt(x, 10);
    } else {
      return x;
    }
  });
};

const move = (
  visitedPos: Set<string>,
  headPos: Knot,
  tailsPos: Knot[],
  tailIdx: number,
  motion: string
) => {
  const [dir, dist]: [string, number] = parseMotion(motion) as [string, number];

  switch (dir) {
    case MOVE_UP_LEFT:
      for (let i = 0; i < dist; i++) {
        const pHeadPos = { ...headPos };
        headPos.r--;
        headPos.c--;
        headPos.str = [headPos.r, headPos.c].toString();

        if (tailIdx < tailsPos.length) {
          if (
            (tailsPos[tailIdx].r === pHeadPos.r &&
              tailsPos[tailIdx].c > pHeadPos.c) ||
            (tailsPos[tailIdx].r > pHeadPos.r &&
              tailsPos[tailIdx].c > pHeadPos.c) ||
            (tailsPos[tailIdx].r > pHeadPos.r &&
              tailsPos[tailIdx].c === pHeadPos.c)
          ) {
            move(
              visitedPos,
              tailsPos[tailIdx],
              tailsPos,
              tailIdx + 1,
              `${MOVE_UP_LEFT} 1`
            );
          } else if (
            tailsPos[tailIdx].r > pHeadPos.r &&
            tailsPos[tailIdx].c < pHeadPos.c
          ) {
            move(
              visitedPos,
              tailsPos[tailIdx],
              tailsPos,
              tailIdx + 1,
              `${MOVE_UP} 1`
            );
          } else if (
            tailsPos[tailIdx].r < pHeadPos.r &&
            tailsPos[tailIdx].c > pHeadPos.c
          ) {
            move(
              visitedPos,
              tailsPos[tailIdx],
              tailsPos,
              tailIdx + 1,
              `${MOVE_LEFT} 1`
            );
          }
        } else {
          visitedPos.add(headPos.str);
        }
      }
      break;
    case MOVE_UP:
      for (let i = 0; i < dist; i++) {
        const pHeadPos = { ...headPos };
        headPos.r--;
        headPos.str = [headPos.r, headPos.c].toString();

        if (tailIdx < tailsPos.length) {
          if (
            tailsPos[tailIdx].r > pHeadPos.r &&
            tailsPos[tailIdx].c < pHeadPos.c
          ) {
            move(
              visitedPos,
              tailsPos[tailIdx],
              tailsPos,
              tailIdx + 1,
              `${MOVE_UP_RIGHT} 1`
            );
          } else if (
            tailsPos[tailIdx].r > pHeadPos.r &&
            tailsPos[tailIdx].c === pHeadPos.c
          ) {
            move(
              visitedPos,
              tailsPos[tailIdx],
              tailsPos,
              tailIdx + 1,
              `${MOVE_UP} 1`
            );
          } else if (
            tailsPos[tailIdx].r > pHeadPos.r &&
            tailsPos[tailIdx].c > pHeadPos.c
          ) {
            move(
              visitedPos,
              tailsPos[tailIdx],
              tailsPos,
              tailIdx + 1,
              `${MOVE_UP_LEFT} 1`
            );
          }
        } else {
          visitedPos.add(headPos.str);
        }
      }
      break;
    case MOVE_UP_RIGHT:
      for (let i = 0; i < dist; i++) {
        const pHeadPos = { ...headPos };
        headPos.r--;
        headPos.c++;
        headPos.str = [headPos.r, headPos.c].toString();

        if (tailIdx < tailsPos.length) {
          if (
            (tailsPos[tailIdx].r === pHeadPos.r &&
              tailsPos[tailIdx].c < pHeadPos.c) ||
            (tailsPos[tailIdx].r > pHeadPos.r &&
              tailsPos[tailIdx].c < pHeadPos.c) ||
            (tailsPos[tailIdx].r > pHeadPos.r &&
              tailsPos[tailIdx].c === pHeadPos.c)
          ) {
            move(
              visitedPos,
              tailsPos[tailIdx],
              tailsPos,
              tailIdx + 1,
              `${MOVE_UP_RIGHT} 1`
            );
          } else if (
            tailsPos[tailIdx].r > pHeadPos.r &&
            tailsPos[tailIdx].c > pHeadPos.c
          ) {
            move(
              visitedPos,
              tailsPos[tailIdx],
              tailsPos,
              tailIdx + 1,
              `${MOVE_UP} 1`
            );
          } else if (
            tailsPos[tailIdx].r < pHeadPos.r &&
            tailsPos[tailIdx].c < pHeadPos.c
          ) {
            move(
              visitedPos,
              tailsPos[tailIdx],
              tailsPos,
              tailIdx + 1,
              `${MOVE_RIGHT} 1`
            );
          }
        } else {
          visitedPos.add(headPos.str);
        }
      }
      break;
    case MOVE_LEFT:
      for (let i = 0; i < dist; i++) {
        const pHeadPos = { ...headPos };
        headPos.c--;
        headPos.str = [headPos.r, headPos.c].toString();

        if (tailIdx < tailsPos.length) {
          if (
            tailsPos[tailIdx].r < pHeadPos.r &&
            tailsPos[tailIdx].c > pHeadPos.c
          ) {
            move(
              visitedPos,
              tailsPos[tailIdx],
              tailsPos,
              tailIdx + 1,
              `${MOVE_DOWN_LEFT} 1`
            );
          } else if (
            tailsPos[tailIdx].r === pHeadPos.r &&
            tailsPos[tailIdx].c > pHeadPos.c
          ) {
            move(
              visitedPos,
              tailsPos[tailIdx],
              tailsPos,
              tailIdx + 1,
              `${MOVE_LEFT} 1`
            );
          } else if (
            tailsPos[tailIdx].r > pHeadPos.r &&
            tailsPos[tailIdx].c > pHeadPos.c
          ) {
            move(
              visitedPos,
              tailsPos[tailIdx],
              tailsPos,
              tailIdx + 1,
              `${MOVE_UP_LEFT} 1`
            );
          }
        } else {
          visitedPos.add(headPos.str);
        }
      }
      break;
    case MOVE_RIGHT:
      for (let i = 0; i < dist; i++) {
        const pHeadPos = { ...headPos };
        headPos.c++;
        headPos.str = [headPos.r, headPos.c].toString();

        if (tailIdx < tailsPos.length) {
          if (
            tailsPos[tailIdx].r < pHeadPos.r &&
            tailsPos[tailIdx].c < pHeadPos.c
          ) {
            move(
              visitedPos,
              tailsPos[tailIdx],
              tailsPos,
              tailIdx + 1,
              `${MOVE_DOWN_RIGHT} 1`
            );
          } else if (
            tailsPos[tailIdx].r === pHeadPos.r &&
            tailsPos[tailIdx].c < pHeadPos.c
          ) {
            move(
              visitedPos,
              tailsPos[tailIdx],
              tailsPos,
              tailIdx + 1,
              `${MOVE_RIGHT} 1`
            );
          } else if (
            tailsPos[tailIdx].r > pHeadPos.r &&
            tailsPos[tailIdx].c < pHeadPos.c
          ) {
            move(
              visitedPos,
              tailsPos[tailIdx],
              tailsPos,
              tailIdx + 1,
              `${MOVE_UP_RIGHT} 1`
            );
          }
        } else {
          visitedPos.add(headPos.str);
        }
      }
      break;
    case MOVE_DOWN_LEFT:
      for (let i = 0; i < dist; i++) {
        const pHeadPos = { ...headPos };
        headPos.r++;
        headPos.c--;
        headPos.str = [headPos.r, headPos.c].toString();

        if (tailIdx < tailsPos.length) {
          if (
            (tailsPos[tailIdx].r < pHeadPos.r &&
              tailsPos[tailIdx].c === pHeadPos.c) ||
            (tailsPos[tailIdx].r < pHeadPos.r &&
              tailsPos[tailIdx].c > pHeadPos.c) ||
            (tailsPos[tailIdx].r === pHeadPos.r &&
              tailsPos[tailIdx].c > pHeadPos.c)
          ) {
            move(
              visitedPos,
              tailsPos[tailIdx],
              tailsPos,
              tailIdx + 1,
              `${MOVE_DOWN_LEFT} 1`
            );
          } else if (
            tailsPos[tailIdx].r < pHeadPos.r &&
            tailsPos[tailIdx].c < pHeadPos.c
          ) {
            move(
              visitedPos,
              tailsPos[tailIdx],
              tailsPos,
              tailIdx + 1,
              `${MOVE_DOWN} 1`
            );
          } else if (
            tailsPos[tailIdx].r > pHeadPos.r &&
            tailsPos[tailIdx].c > pHeadPos.c
          ) {
            move(
              visitedPos,
              tailsPos[tailIdx],
              tailsPos,
              tailIdx + 1,
              `${MOVE_LEFT} 1`
            );
          }
        } else {
          visitedPos.add(headPos.str);
        }
      }
      break;
    case MOVE_DOWN:
      for (let i = 0; i < dist; i++) {
        const pHeadPos = { ...headPos };
        headPos.r++;
        headPos.str = [headPos.r, headPos.c].toString();

        if (tailIdx < tailsPos.length) {
          if (
            tailsPos[tailIdx].r < pHeadPos.r &&
            tailsPos[tailIdx].c < pHeadPos.c
          ) {
            move(
              visitedPos,
              tailsPos[tailIdx],
              tailsPos,
              tailIdx + 1,
              `${MOVE_DOWN_RIGHT} 1`
            );
          } else if (
            tailsPos[tailIdx].r < pHeadPos.r &&
            tailsPos[tailIdx].c === pHeadPos.c
          ) {
            move(
              visitedPos,
              tailsPos[tailIdx],
              tailsPos,
              tailIdx + 1,
              `${MOVE_DOWN} 1`
            );
          } else if (
            tailsPos[tailIdx].r < pHeadPos.r &&
            tailsPos[tailIdx].c > pHeadPos.c
          ) {
            move(
              visitedPos,
              tailsPos[tailIdx],
              tailsPos,
              tailIdx + 1,
              `${MOVE_DOWN_LEFT} 1`
            );
          }
        } else {
          visitedPos.add(headPos.str);
        }
      }
      break;
    case MOVE_DOWN_RIGHT:
      for (let i = 0; i < dist; i++) {
        const pHeadPos = { ...headPos };
        headPos.r++;
        headPos.c++;
        headPos.str = [headPos.r, headPos.c].toString();

        if (tailIdx < tailsPos.length) {
          if (
            (tailsPos[tailIdx].r < pHeadPos.r &&
              tailsPos[tailIdx].c === pHeadPos.c) ||
            (tailsPos[tailIdx].r < pHeadPos.r &&
              tailsPos[tailIdx].c < pHeadPos.c) ||
            (tailsPos[tailIdx].r === pHeadPos.r &&
              tailsPos[tailIdx].c < pHeadPos.c)
          ) {
            move(
              visitedPos,
              tailsPos[tailIdx],
              tailsPos,
              tailIdx + 1,
              `${MOVE_DOWN_RIGHT} 1`
            );
          } else if (
            tailsPos[tailIdx].r < pHeadPos.r &&
            tailsPos[tailIdx].c > pHeadPos.c
          ) {
            move(
              visitedPos,
              tailsPos[tailIdx],
              tailsPos,
              tailIdx + 1,
              `${MOVE_DOWN} 1`
            );
          } else if (
            tailsPos[tailIdx].r > pHeadPos.r &&
            tailsPos[tailIdx].c < pHeadPos.c
          ) {
            move(
              visitedPos,
              tailsPos[tailIdx],
              tailsPos,
              tailIdx + 1,
              `${MOVE_RIGHT} 1`
            );
          }
        } else {
          visitedPos.add(headPos.str);
        }
      }
      break;
    default: {
      break;
    }
  }
};

const solve = (data: string) => {
  const motions = data.split("\n");
  const maxLen = calcMaxLen(motions);
  const headPos: Knot = {
    r: maxLen,
    c: maxLen,
    str: [maxLen, maxLen].toString(),
  };
  const tailsPos: Knot[] = new Array(9).fill(0).map(() => ({
    r: maxLen,
    c: maxLen,
    str: [maxLen, maxLen].toString(),
  }));
  const visitedPos = new Set<string>();
  visitedPos.add(headPos.str);

  motions.forEach((motion) => {
    move(visitedPos, headPos, tailsPos, 0, motion);
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
