import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

const DECRYPTION_KEY = 811589153;
const MIX_CYCLES = 10;

let zeroObjStr = "";

const parseUniqueNums = (data: string) => {
  return data.split("\n").reduce((uniqueNums, numStr, i) => {
    if (numStr) {
      const uniqueNum = JSON.stringify({
        ogIdx: i,
        num: parseInt(numStr, 10) * DECRYPTION_KEY,
      });
      if (numStr === "0") zeroObjStr = uniqueNum;
      uniqueNums.push(uniqueNum);
    }
    return uniqueNums;
  }, [] as string[]);
};

const mixNums = (uniqueNums: string[], mixedUniqueNums: string[]) => {
  for (let i = 0; i < uniqueNums.length; i++) {
    const uniqueNum = uniqueNums[i];

    const numIdx = mixedUniqueNums.indexOf(uniqueNum);
    const num = JSON.parse(uniqueNum).num;
    if (num === 0) continue;

    mixedUniqueNums.splice(numIdx, 1);
    const j =
      (((numIdx + num) % mixedUniqueNums.length) + mixedUniqueNums.length) %
      mixedUniqueNums.length;
    mixedUniqueNums.splice(j, 0, uniqueNum);
  }
};

const solve = (data: string) => {
  const uniqueNums = parseUniqueNums(data);
  const mixedUniqueNums: string[] = [...uniqueNums];

  for (let i = 0; i < MIX_CYCLES; i++) {
    mixNums(uniqueNums, mixedUniqueNums);
  }

  const zeroIdx = mixedUniqueNums.indexOf(zeroObjStr);
  const numObjStr1 = mixedUniqueNums[(zeroIdx + 1000) % mixedUniqueNums.length];
  const numObjStr2 = mixedUniqueNums[(zeroIdx + 2000) % mixedUniqueNums.length];
  const numObjStr3 = mixedUniqueNums[(zeroIdx + 3000) % mixedUniqueNums.length];

  return (
    JSON.parse(numObjStr1).num +
    JSON.parse(numObjStr2).num +
    JSON.parse(numObjStr3).num
  );
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 1623178306);
  const t0 = performance.now();
  console.log("SOLUTION", solve(input));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
