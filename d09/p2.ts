import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

type Knot = { r: number; c: number; str: string };

const moveUpLeft = "UL";
const moveUp = "U";
const moveUpRight = "UR";
const moveLeft = "L";
const moveRight = "R";
const moveDownLeft = "DL";
const moveDown = "D";
const moveDownRight = "DR";

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
    case moveUpLeft:
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
              `${moveUpLeft} 1`
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
              `${moveUp} 1`
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
              `${moveLeft} 1`
            );
          }
        } else {
          visitedPos.add(headPos.str);
        }
      }
      break;
    case moveUp:
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
              `${moveUpRight} 1`
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
              `${moveUp} 1`
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
              `${moveUpLeft} 1`
            );
          }
        } else {
          visitedPos.add(headPos.str);
        }
      }
      break;
    case moveUpRight:
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
              `${moveUpRight} 1`
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
              `${moveUp} 1`
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
              `${moveRight} 1`
            );
          }
        } else {
          visitedPos.add(headPos.str);
        }
      }
      break;
    case moveLeft:
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
              `${moveDownLeft} 1`
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
              `${moveLeft} 1`
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
              `${moveUpLeft} 1`
            );
          }
        } else {
          visitedPos.add(headPos.str);
        }
      }
      break;
    case moveRight:
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
              `${moveDownRight} 1`
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
              `${moveRight} 1`
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
              `${moveUpRight} 1`
            );
          }
        } else {
          visitedPos.add(headPos.str);
        }
      }
      break;
    case moveDownLeft:
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
              `${moveDownLeft} 1`
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
              `${moveDown} 1`
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
              `${moveLeft} 1`
            );
          }
        } else {
          visitedPos.add(headPos.str);
        }
      }
      break;
    case moveDown:
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
              `${moveDownRight} 1`
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
              `${moveDown} 1`
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
              `${moveDownLeft} 1`
            );
          }
        } else {
          visitedPos.add(headPos.str);
        }
      }
      break;
    case moveDownRight:
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
              `${moveDownRight} 1`
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
              `${moveDown} 1`
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
              `${moveRight} 1`
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
  console.log("SOLUTION", solve(input));
});
