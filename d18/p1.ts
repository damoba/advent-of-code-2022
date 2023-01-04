import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

const NUM_SIDES = 6;

const parseCube = (cube: string) => {
  return cube.split(",").map((dirStr) => parseInt(dirStr, 10));
};

const getNeighbour = (cube: string, side: number) => {
  const [x, y, z] = parseCube(cube);
  switch (side) {
    case 0:
      return `${x + 1},${y},${z}`;
    case 1:
      return `${x - 1},${y},${z}`;
    case 2:
      return `${x},${y + 1},${z}`;
    case 3:
      return `${x},${y - 1},${z}`;
    case 4:
      return `${x},${y},${z + 1}`;
    case 5:
      return `${x},${y},${z - 1}`;
  }
};

const solve = (data: string) => {
  const cubes = new Set<string>(
    data.split("\n").reduce((cubes, line) => {
      return line !== "" ? cubes.concat([line]) : cubes;
    }, [] as string[])
  );

  let countExposed = 0;
  for (const cube of cubes) {
    for (let i = 0; i < NUM_SIDES; i++) {
      const neighbour = getNeighbour(cube, i);
      if (!cubes.has(neighbour!)) {
        countExposed++;
      }
    }
  }

  return countExposed;
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 64);
  const t0 = performance.now();
  console.log("SOLUTION", solve(input));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
