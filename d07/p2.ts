import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { TreeNode, parseFS } from "./utils.ts";

const idealSize = 40000000;

const calcTotalSizes = (node: TreeNode, folderSizes: { sizes: number[] }) => {
  if (node.isFolder()) {
    let size = 0;
    node.getChildren().forEach((child) => {
      size += calcTotalSizes(child, folderSizes);
    });
    node.setSize(size);
    folderSizes.sizes.push(size);
    return size;
  } else {
    return node.getSize()!;
  }
};

const solve = (data: string) => {
  const folderSizes = { sizes: [] };
  const totalSize = calcTotalSizes(parseFS(data), folderSizes);
  const spaceToFree = totalSize - idealSize;
  folderSizes.sizes.sort((a, b) => a - b);
  let i = 0;
  while (folderSizes.sizes[i] < spaceToFree) {
    i++;
  }
  return folderSizes.sizes[i];
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 24933642);
  console.log("SOLUTION", solve(input));
});
