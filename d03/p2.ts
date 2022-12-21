import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

const VOWEL_PRIORITY_START = "a".charCodeAt(0) - 1;
const CAPITAL_PRIORITY_START = "A".charCodeAt(0) - 27;

const solve = (data: string) => {
  const list = data.split("\n");
  let totalPriority = 0;

  let i = 0;
  while (i < list.length) {
    const itemsPerTrio = [new Set(), new Set()];
    let common = "";

    let j = 0;
    while (j < 2) {
      for (const item of list[i]) {
        itemsPerTrio[j].add(item);
      }
      i += 1;
      j += 1;
    }
    for (const item of list[i]) {
      if (itemsPerTrio[0].has(item) && itemsPerTrio[1].has(item)) {
        common = item;
        break;
      }
    }

    if (common === common.toLowerCase()) {
      totalPriority += common.charCodeAt(0) - VOWEL_PRIORITY_START;
    } else {
      totalPriority += common.charCodeAt(0) - CAPITAL_PRIORITY_START;
    }

    i += 1;
  }

  return totalPriority;
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 70);
  const t0 = performance.now();
  console.log("SOLUTION", solve(input));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
