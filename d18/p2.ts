import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

type Bounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
};

const parseCube = (cube: string) => {
  return cube.split(",").map((dirStr) => parseInt(dirStr, 10));
};

const calcBounds = (cubes: Set<string>) => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;

  for (const cubeStr of cubes) {
    const [x, y, z] = parseCube(cubeStr);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    minZ = Math.min(minZ, z);
    maxZ = Math.max(maxZ, z);
  }

  return { minX, maxX, minY, maxY, minZ, maxZ };
};

const getNeighbours = (cube: string, bounds: Bounds) => {
  const neighbours: string[] = [];
  const [x, y, z] = parseCube(cube);
  if (x + 1 <= bounds.maxX + 1) neighbours.push(`${x + 1},${y},${z}`);
  if (x - 1 >= bounds.minX - 1) neighbours.push(`${x - 1},${y},${z}`);
  if (y + 1 <= bounds.maxY + 1) neighbours.push(`${x},${y + 1},${z}`);
  if (y - 1 >= bounds.minY - 1) neighbours.push(`${x},${y - 1},${z}`);
  if (z + 1 <= bounds.maxZ + 1) neighbours.push(`${x},${y},${z + 1}`);
  if (z - 1 >= bounds.minZ - 1) neighbours.push(`${x},${y},${z - 1}`);
  return neighbours;
};

const traverseMap = (cubes: Set<string>, source: string, bounds: Bounds) => {
  let countExposed = 0;
  const visited = new Set<string>();
  const openSpots = [source];

  while (openSpots.length > 0) {
    const current = openSpots.shift()!;

    if (!visited.has(current)) {
      const neighbours = getNeighbours(current, bounds);
      for (const neighbour of neighbours) {
        if (cubes.has(neighbour)) {
          countExposed++;
        } else if (!visited.has(neighbour)) {
          openSpots.push(neighbour);
        }
      }
      visited.add(current);
    }
  }

  return countExposed;
};

const solve = (data: string) => {
  const cubes = new Set<string>(
    data.split("\n").reduce((cubes, line) => {
      return line !== "" ? cubes.concat([line]) : cubes;
    }, [] as string[])
  );
  const bounds = calcBounds(cubes);
  return traverseMap(
    cubes,
    `${bounds.minX - 1},${bounds.minY - 1},${bounds.minZ - 1}`,
    bounds
  );
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 58);
  const t0 = performance.now();
  console.log("SOLUTION", solve(input));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
