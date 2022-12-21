import { calcXPerCycle } from "./utils.ts";

const solve = (data: string) => {
  const xPerCycle = calcXPerCycle(data);

  for (let i = 1; i < 241; i += 40) {
    let row = "";
    for (let j = 0; j < 40; j++) {
      if (j < xPerCycle.get(i + j)! + 2 && j > xPerCycle.get(i + j)! - 2) {
        row += "#";
      } else {
        row += ".";
      }
    }
    console.log(row);
  }
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  console.log("Example:");
  solve(example);
  console.log("\nInput:");
  const t0 = performance.now();
  solve(input);
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
