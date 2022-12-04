import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

const solve = (data: string) => {
  const elves = data
    .split("\n\n")
    .map((listStr) =>
      listStr.split("\n").map((itemCalsStr) => parseInt(itemCalsStr, 10))
    );

  const maxCalsPerElf: number[] = [];

  elves.forEach((list) => {
    maxCalsPerElf.push(list.reduce((itemCals, c) => itemCals + c, 0));
  });

  return maxCalsPerElf
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((maxCals, c) => maxCals + c, 0);
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 45000);
  console.log("SOLUTION", solve(input));
});
