import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

const solve = (data: string) => {
  const elves = data
    .split("\n\n")
    .map((listStr) =>
      listStr.split("\n").map((itemCalsStr) => parseInt(itemCalsStr, 10))
    );

  let maxCalsPerElf = 0;

  elves.forEach((list) => {
    const maxCalsForElf = list.reduce((itemCals, c) => itemCals + c, 0);
    if (maxCalsForElf > maxCalsPerElf) {
      maxCalsPerElf = maxCalsForElf;
    }
  });

  return maxCalsPerElf;
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 24000);
  console.log("SOLUTION", solve(input));
});
