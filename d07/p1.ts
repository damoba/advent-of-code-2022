import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { TreeNode, parseFS } from "./utils.ts";

const maxSize = 100000;

const calcTotalSizesSum = (node: TreeNode, totalSizesSum: { sum: number }) => {
  if (node.isFolder()) {
    let size = 0;
    node.getChildren().forEach((child) => {
      size += calcTotalSizesSum(child, totalSizesSum);
    });
    node.setSize(size);

    if (size <= maxSize) {
      totalSizesSum.sum += size;
    }
    return size;
  } else {
    return node.getSize()!;
  }
};

const solve = (data: string) => {
  const totalSizesSum = { sum: 0 };
  calcTotalSizesSum(parseFS(data), totalSizesSum);
  return totalSizesSum.sum;
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 95437);
  console.log("SOLUTION", solve(input));
});
