import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

const markerLength = 4;

const solve = (data: string) => {
  const quartetArr = [];
  const quartetMap: Map<string, number> = new Map();
  let hasGreaterThanOne = 0;

  let i = 0;
  while (i < data.length) {
    quartetArr.push(data[i]);
    quartetMap.get(data[i])
      ? quartetMap.set(data[i], (quartetMap.get(data[i]) as number) + 1)
      : quartetMap.set(data[i], 1);

    if ((quartetMap.get(data[i]) as number) === 2) {
      hasGreaterThanOne++;
    }

    if (quartetArr.length == markerLength && hasGreaterThanOne === 0) {
      break;
    } else if (quartetArr.length == markerLength) {
      quartetMap.set(
        quartetArr[0],
        (quartetMap.get(quartetArr[0]) as number) - 1
      );
      if ((quartetMap.get(quartetArr[0]) as number) === 1) {
        hasGreaterThanOne--;
      } else if ((quartetMap.get(quartetArr[0]) as number) === 0) {
        quartetMap.delete(quartetArr[0]);
      }
      quartetArr.shift();
    }

    i++;
  }

  return i + 1;
};

const example1 = await Deno.readTextFile("./example1.txt");
const example2 = await Deno.readTextFile("./example2.txt");
const example3 = await Deno.readTextFile("./example3.txt");
const example4 = await Deno.readTextFile("./example4.txt");
const example5 = await Deno.readTextFile("./example5.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example1), 7);
  assertEquals(solve(example2), 5);
  assertEquals(solve(example3), 6);
  assertEquals(solve(example4), 10);
  assertEquals(solve(example5), 11);
  console.log("SOLUTION", solve(input));
});
