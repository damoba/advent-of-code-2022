import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

const parseLines = (data: string) => {
  const devicesArr = data
    .split("\n")
    .map((line) =>
      line
        .split(":")
        .map((part) =>
          part
            .split(",")
            .map((pointStr) => parseInt(pointStr.split("=")[1], 10))
        )
    );

  const beacons = new Set(
    devicesArr.map((devices) =>
      devices.reduce((acc, point, i) => {
        if (i === 1) {
          acc = point.toString();
        }
        return acc;
      }, "")
    )
  );
  return { devicesArr, beacons };
};

const calcManhattan = (a: number[], b: number[]) => {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
};

const solve = (data: string, y: number) => {
  const { devicesArr, beacons } = parseLines(data);
  let count = 0;
  const seen = new Set();

  devicesArr.forEach((devices) => {
    const [sensor, beacon] = devices;
    const dist = calcManhattan(sensor, beacon);

    // calculate the range of x coordinates that can be seen
    const yDiff = Math.abs(y - sensor[1]);
    let rangeXSeen = dist * 2 + 1;
    let i = 0;
    while (i < yDiff && rangeXSeen > 0) {
      // subtract both left and right as you go up or down the diamond
      rangeXSeen -= 2;
      i++;
    }

    if (rangeXSeen > 0) {
      // walk through the x coordinates that can be seen
      for (let i = 0; i < rangeXSeen; i++) {
        const pointStr = [
          sensor[0] - Math.floor(rangeXSeen / 2) + i,
          y,
        ].toString();
        if (!seen.has(pointStr) && !beacons.has(pointStr)) {
          count++;
          seen.add(pointStr);
        }
      }
    }
  });

  return count;
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example, 10), 26);
  const t0 = performance.now();
  console.log("SOLUTION", solve(input, 2000000));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
