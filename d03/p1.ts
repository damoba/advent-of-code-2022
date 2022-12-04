import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

const vowelPriorityStart = "a".charCodeAt(0) - 1;
const capitalPriorityStart = "A".charCodeAt(0) - 27;

const solve = (data: string) => {
  const list = data.split("\n");
  let totalPriority = 0;

  list.forEach((line) => {
    const items = new Set();
    let common = "";

    let i = 0;
    while (i < line.length / 2) {
      items.add(line[i]);
      i += 1;
    }
    while (i < line.length) {
      if (items.has(line[i])) {
        common = line[i];
        break;
      }
      i += 1;
    }

    if (common === common.toLowerCase()) {
      totalPriority += common.charCodeAt(0) - vowelPriorityStart;
    } else {
      totalPriority += common.charCodeAt(0) - capitalPriorityStart;
    }
  });

  return totalPriority;
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 157);
  console.log("SOLUTION", solve(input));
});
