import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

const markerLength = 14;

const solve = (data: string) => {
  const quartetArr = []; // window holding the last "markerLength" chars
  const quartetMap: Map<string, number> = new Map(); // char -> count for window
  let charsAppearingMoreThanOnce = 0; // count of chars appearing more than once in window

  let i = 0;
  // initialize window with the last char missing, awaiting uniqueness check
  while (i < markerLength - 1) {
    quartetArr.push(data[i]);
    quartetMap.get(data[i])
      ? quartetMap.set(data[i], (quartetMap.get(data[i]) as number) + 1)
      : quartetMap.set(data[i], 1);

    // if the char is already in the map, it's appearing more than once.
    // (if the count was higher than 2, it's already been counted)
    if ((quartetMap.get(data[i]) as number) === 2) {
      charsAppearingMoreThanOnce++;
    }

    i++;
  }

  while (i < data.length) {
    // add the last char to the window and update the map
    quartetArr.push(data[i]);
    quartetMap.get(data[i])
      ? quartetMap.set(data[i], (quartetMap.get(data[i]) as number) + 1)
      : quartetMap.set(data[i], 1);

    // if the char is already in the map, it's appearing more than once.
    // (if the count was higher than 2, it's already been counted)
    if ((quartetMap.get(data[i]) as number) === 2) {
      charsAppearingMoreThanOnce++;
    }

    // if the window is full and there are no chars appearing more than once, we're done
    if (charsAppearingMoreThanOnce === 0) {
      break;
    }

    // otherwise, remove the first char from the window and update the map
    quartetMap.set(
      quartetArr[0],
      (quartetMap.get(quartetArr[0]) as number) - 1
    );
    if ((quartetMap.get(quartetArr[0]) as number) === 1) {
      charsAppearingMoreThanOnce--;
    } else if ((quartetMap.get(quartetArr[0]) as number) === 0) {
      quartetMap.delete(quartetArr[0]);
    }
    quartetArr.shift();

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
  assertEquals(solve(example1), 19);
  assertEquals(solve(example2), 23);
  assertEquals(solve(example3), 23);
  assertEquals(solve(example4), 29);
  assertEquals(solve(example5), 26);
  console.log("SOLUTION", solve(input));
});
