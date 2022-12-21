import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { calcXPerCycle } from "./utils.ts";

const solve = (data: string) => {
  const xPerCycle = calcXPerCycle(data);

  let total = 0;
  for (let i = 20; i <= 220; i += 40) {
    total += i * xPerCycle.get(i)!;
  }

  return total;
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 13140);
  const t0 = performance.now();
  console.log("SOLUTION", solve(input));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
