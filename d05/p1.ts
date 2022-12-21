import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { parseSolution, parseStacks } from "./utils.ts";

const solve = (data: string) => {
  const [stacksStr, instructions] = data.split("\n\n");
  const stacks = parseStacks(stacksStr);

  instructions.split("\n").forEach((line) => {
    const [_, amount, __, from, ___, to] = line.split(" ");
    for (let i = 0; i < parseInt(amount); i++) {
      stacks[parseInt(to) - 1].push(stacks[parseInt(from) - 1].pop() as string);
    }
  });

  return parseSolution(stacks);
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), "CMZ");
  const t0 = performance.now();
  console.log("SOLUTION", solve(input));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
