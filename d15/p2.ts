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

  const sensorsStr = new Set(
    devicesArr.map((devices) =>
      devices.reduce((acc, point, i) => {
        if (i === 0) {
          acc = point.toString();
        }
        return acc;
      }, "")
    )
  );
  return { devicesArr, sensorsStr };
};

const calcManhattan = (a: number[], b: number[]) => {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
};

const isWithinRange = (point: number[], upBound: number) => {
  return (
    point[0] >= 0 && point[0] <= upBound && point[1] >= 0 && point[1] <= upBound
  );
};

const isNotSeen = (
  point: number[],
  sensorsStr: Set<string>,
  devicesArr: number[][][]
) => {
  if (sensorsStr.has(point.toString())) {
    return false;
  }

  const notSeen = devicesArr.every((devices) => {
    const [sensor, beacon] = devices;
    const dist = calcManhattan(sensor, beacon);
    const distToSensor = calcManhattan(sensor, point);
    return distToSensor > dist;
  });

  return notSeen;
};

const solve = (data: string, upBound: number) => {
  const { devicesArr, sensorsStr } = parseLines(data);
  let corners: number[][][] = [];
  const notSeen = new Set<string>();

  // calculate the corners of the diamonds
  devicesArr.forEach((devices) => {
    const [sensor, beacon] = devices;
    const dist = calcManhattan(sensor, beacon);
    corners = corners.concat([
      [
        [sensor[0] - dist, sensor[1]],
        [sensor[0] + dist, sensor[1]],
        [sensor[0], sensor[1] - dist],
        [sensor[0], sensor[1] + dist],
      ],
    ]);
  });

  let i = 0;
  while (i < corners.length && notSeen.size === 0) {
    const [left, right, top, _] = corners[i];

    let yTop = left[1];
    let yBottom = left[1];
    let xLeft = left[0] - 1;
    let xRight = right[0] + 1;
    while (yTop >= top[1] - 1) {
      // test every point surrounding the diamond
      // (if it's the only not seen point,
      // it will always surround at least one diamond)
      if (
        isWithinRange([xLeft, yTop], upBound) &&
        isNotSeen([xLeft, yTop], sensorsStr, devicesArr)
      ) {
        notSeen.add([xLeft, yTop].toString());
        break;
      }
      if (
        isWithinRange([xRight, yTop], upBound) &&
        isNotSeen([xRight, yTop], sensorsStr, devicesArr)
      ) {
        notSeen.add([xRight, yTop].toString());
        break;
      }
      if (
        isWithinRange([xLeft, yBottom], upBound) &&
        isNotSeen([xLeft, yBottom], sensorsStr, devicesArr)
      ) {
        notSeen.add([xLeft, yBottom].toString());
        break;
      }
      if (
        isWithinRange([xRight, yBottom], upBound) &&
        isNotSeen([xRight, yBottom], sensorsStr, devicesArr)
      ) {
        notSeen.add([xRight, yBottom].toString());
        break;
      }
      xLeft++;
      xRight--;
      yTop--;
      yBottom++;
    }
    i++;
  }

  return [...notSeen][0].split(",").reduce((freq, coorStr, i) => {
    const coor = parseInt(coorStr, 10);
    i === 0 ? (freq *= coor * 4000000) : (freq += coor);
    return freq;
  }, 1);
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example, 20), 56000011);
  const t0 = performance.now();
  console.log("SOLUTION", solve(input, 4000000));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
