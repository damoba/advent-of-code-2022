// deno-lint-ignore-file
import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

const divOne = [[2]];
const divTwo = [[6]];

const parsePackets = (data: string, packetsAll: any[]) => {
  const packets = data
    .split("\n")
    .map((pair) => (pair ? JSON.parse(pair) : ""));

  for (let i = 0; i < packets.length; i += 3) {
    packetsAll.push(packets[i]);
    packetsAll.push(packets[i + 1]);
  }
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

const sortFunc = (a: any[], b: any[]) => {
  const result = { isCorrect: true, continue: true };
  compare(a, b, result);
  return result.isCorrect ? -1 : 1;
};

const solve = (data: string) => {
  const packets = [divOne, divTwo];
  parsePackets(data, packets);
  packets.sort(sortFunc);
  const divOnePosition = packets.indexOf(divOne) + 1;
  const divTwoPosition = packets.indexOf(divTwo) + 1;
  return divOnePosition * divTwoPosition;
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 140);
  const t0 = performance.now();
  console.log("SOLUTION", solve(input));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
