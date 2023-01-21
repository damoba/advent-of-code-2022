import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

const SNAFU_DECIMAL = new Map<string, number>([
  ["=", -2],
  ["-", -1],
  ["0", 0],
  ["1", 1],
  ["2", 2],
]);
const DECIMAL_SNAFU = new Map<number, string>(
  [...SNAFU_DECIMAL.entries()].map(([k, v]) => [v, k])
);
const SNAFU_BASE = SNAFU_DECIMAL.size;
const MAX_SNAFU_DIGIT = [...SNAFU_DECIMAL.values()][SNAFU_DECIMAL.size - 1];

const snafuToDecimal = (snafu: string) => {
  return snafu
    .split("")
    .reverse()
    .reduce(
      (acc, curr, i) => acc + SNAFU_DECIMAL.get(curr)! * SNAFU_BASE ** i,
      0
    );
};

const decimalToSnafu = (decimal: number) => {
  let snafu = "";
  let quotient = decimal;
  while (quotient > 0) {
    const remainder = quotient % SNAFU_BASE;
    if (remainder <= MAX_SNAFU_DIGIT) {
      snafu = DECIMAL_SNAFU.get(remainder)! + snafu;
      quotient = (quotient - remainder) / SNAFU_BASE;
    } else {
      const offset = SNAFU_BASE - remainder;
      snafu = DECIMAL_SNAFU.get(-offset)! + snafu;
      quotient = (quotient + offset) / SNAFU_BASE;
    }
  }
  return snafu;
};

const solve = (data: string) => {
  return decimalToSnafu(
    data.split("\n").reduce((acc, curr) => {
      if (curr) {
        acc += snafuToDecimal(curr);
      }
      return acc;
    }, 0)
  );
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), "2=-1=0");
  const t0 = performance.now();
  console.log("SOLUTION", solve(input));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
