import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { TreeNode, parseFS } from "./utils.ts";

const idealSize = 40000000;
let folderSizes: number[] = [];

const calculateTotalSizes = (node: TreeNode) => {
  if (node.isFolder()) {
    let size = 0;
    node.getChildren().forEach((child) => {
      size += calculateTotalSizes(child);
    });
    node.setSize(size);
    folderSizes.push(size);
    return size;
  } else {
    return node.getSize()!;
  }
};

const solve = (data: string) => {
  const totalSize = calculateTotalSizes(parseFS(data));
  const spaceToFree = totalSize - idealSize;
  folderSizes.sort((a, b) => a - b);
  let i = 0;
  while (folderSizes[i] < spaceToFree) {
    i++;
  }
  const result = folderSizes[i];
  folderSizes = [];
  return result;
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 24933642);
  console.log("SOLUTION", solve(input));
});
