// deno-lint-ignore-file
import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

const parsePairs = (data: string) => {
  const pairsAll = data
    .split("\n")
    .map((pair) => (pair ? JSON.parse(pair) : ""));

  const pairs = [];
  for (let i = 0; i < pairsAll.length; i += 3) {
    const pair = [];
    pair.push(pairsAll[i]);
    pair.push(pairsAll[i + 1]);
    pairs.push(pair);
  }

  return pairs;
};

const compare = (
  left: any[] | number,
  right: any[] | number,
  result: { isCorrect: boolean; continue: boolean }
): void => {
  if (left === undefined && right === undefined) {
    result.isCorrect = true;
    result.continue = true;
    return;
  } else if (left === undefined) {
    result.isCorrect = true;
    result.continue = false;
    return;
  } else if (right === undefined) {
    result.isCorrect = false;
    result.continue = false;
    return;
  } else if (!Array.isArray(left) && !Array.isArray(right)) {
    if (left < right) {
      result.isCorrect = true;
      result.continue = false;
      return;
    } else if (left === right) {
      result.isCorrect = true;
      result.continue = true;
      return;
    } else if (left > right) {
      result.isCorrect = false;
      result.continue = false;
      return;
    }
  } else if (!Array.isArray(left)) {
    left = [left];
  } else if (!Array.isArray(right)) {
    right = [right];
  }

  let i = 0;
  while (
    result.continue &&
    i < (left as any[]).length &&
    i < (right as any[]).length
  ) {
    compare((left as any[])[i], (right as any[])[i], result);
    i++;
  }

  if (result.continue) {
    if (i === (left as any[]).length && i === (right as any[]).length) {
      result.isCorrect = true;
      result.continue = true;
      return;
    } else if (i === (left as any[]).length) {
      result.isCorrect = true;
      result.continue = false;
      return;
    } else if (i === (right as any[]).length) {
      result.isCorrect = false;
      result.continue = false;
      return;
    }
  }
};

const solve = (data: string) => {
  const pairs = parsePairs(data);
  let correctSum = 0;

  pairs.forEach((pair, i) => {
    const left = pair[0];
    const right = pair[1];

    const result = { isCorrect: true, continue: true };
    compare(left, right, result);
    if (result.isCorrect) {
      correctSum += i + 1;
    }
  });

  return correctSum;
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 13);
  const t0 = performance.now();
  console.log("SOLUTION", solve(input));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
