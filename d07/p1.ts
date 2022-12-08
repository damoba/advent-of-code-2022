import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { TreeNode, parseFS } from "./utils.ts";

const maxSize = 100000;
let totalSizeSum = 0;

const calculateTotalSizesSum = (node: TreeNode) => {
  if (node.isFolder()) {
    let size = 0;
    node.getChildren().forEach((child) => {
      size += calculateTotalSizesSum(child);
    });
    node.setSize(size);

    if (size <= maxSize) {
      totalSizeSum += size;
    }
    return size;
  } else {
    return node.getSize()!;
  }
};

const solve = (data: string) => {
  calculateTotalSizesSum(parseFS(data));
  const result = totalSizeSum;
  totalSizeSum = 0;
  return result;
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 95437);
  console.log("SOLUTION", solve(input));
});
