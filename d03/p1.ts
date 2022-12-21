import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

const VOWEL_PRIORITY_START = "a".charCodeAt(0) - 1;
const CAPITAL_PRIORITY_START = "A".charCodeAt(0) - 27;

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
      totalPriority += common.charCodeAt(0) - VOWEL_PRIORITY_START;
    } else {
      totalPriority += common.charCodeAt(0) - CAPITAL_PRIORITY_START;
    }
  });

  return totalPriority;
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 157);
  const t0 = performance.now();
  console.log("SOLUTION", solve(input));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
