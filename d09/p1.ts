import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

type Knot = { r: number; c: number; str: string };

const moveRight = "R";
const moveLeft = "L";
const moveUp = "U";
const moveDown = "D";

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

const moveTailCloser = (tailPos: Knot, headPos: Knot) => {
  tailPos.r = headPos.r;
  tailPos.c = headPos.c;
  tailPos.str = headPos.str;
};

const move = (
  visitedPos: Set<string>,
  headPos: Knot,
  tailPos: Knot,
  motion: string
) => {
  const [dir, dist]: [string, number] = parseMotion(motion) as [string, number];

  switch (dir) {
    case moveRight:
      for (let i = 0; i < dist; i++) {
        if (
          (tailPos.r < headPos.r && tailPos.c < headPos.c) ||
          (tailPos.r === headPos.r && tailPos.c < headPos.c) ||
          (tailPos.r > headPos.r && tailPos.c < headPos.c)
        ) {
          moveTailCloser(tailPos, headPos);
          visitedPos.add(tailPos.str);
        }
        headPos.c++;
        headPos.str = [headPos.r, headPos.c].toString();
      }
      break;
    case moveLeft:
      for (let i = 0; i < dist; i++) {
        if (
          (tailPos.r < headPos.r && tailPos.c > headPos.c) ||
          (tailPos.r === headPos.r && tailPos.c > headPos.c) ||
          (tailPos.r > headPos.r && tailPos.c > headPos.c)
        ) {
          moveTailCloser(tailPos, headPos);
          visitedPos.add(tailPos.str);
        }
        headPos.c--;
        headPos.str = [headPos.r, headPos.c].toString();
      }
      break;
    case moveUp:
      for (let i = 0; i < dist; i++) {
        if (
          (tailPos.r > headPos.r && tailPos.c < headPos.c) ||
          (tailPos.r > headPos.r && tailPos.c === headPos.c) ||
          (tailPos.r > headPos.r && tailPos.c > headPos.c)
        ) {
          moveTailCloser(tailPos, headPos);
          visitedPos.add(tailPos.str);
        }
        headPos.r--;
        headPos.str = [headPos.r, headPos.c].toString();
      }
      break;
    case moveDown:
      for (let i = 0; i < dist; i++) {
        if (
          (tailPos.r < headPos.r && tailPos.c < headPos.c) ||
          (tailPos.r < headPos.r && tailPos.c === headPos.c) ||
          (tailPos.r < headPos.r && tailPos.c > headPos.c)
        ) {
          moveTailCloser(tailPos, headPos);
          visitedPos.add(tailPos.str);
        }
        headPos.r++;
        headPos.str = [headPos.r, headPos.c].toString();
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
    c: 0,
    str: [maxLen, 0].toString(),
  };
  const tailPos: Knot = {
    r: maxLen,
    c: 0,
    str: [maxLen, 0].toString(),
  };
  const visitedPos = new Set<string>();
  visitedPos.add(tailPos.str);

  motions.forEach((motion) => {
    move(visitedPos, headPos, tailPos, motion);
  });
  return visitedPos.size;
};

const example = await Deno.readTextFile("./example_p1.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 13);
  console.log("SOLUTION", solve(input));
});
