import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

const solve = (data: string) => {
  return data.split("\n").reduce((sum, pair) => {
    const pairSplit = pair
      .split(",")
      .map((pairSplit) =>
        pairSplit.split("-").map((edge) => parseInt(edge, 10))
      );

    return (pairSplit[0][0] >= pairSplit[1][0] &&
      pairSplit[0][0] <= pairSplit[1][1] &&
      pairSplit[0][1] >= pairSplit[1][0] &&
      pairSplit[0][1] <= pairSplit[1][1]) ||
      (pairSplit[1][0] >= pairSplit[0][0] &&
        pairSplit[1][0] <= pairSplit[0][1] &&
        pairSplit[1][1] >= pairSplit[0][0] &&
        pairSplit[1][1] <= pairSplit[0][1])
      ? sum + 1
      : sum + 0;
  }, 0);
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 2);
  const t0 = performance.now();
  console.log("SOLUTION", solve(input));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
