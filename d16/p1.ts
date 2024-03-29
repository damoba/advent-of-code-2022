import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

type Valve = {
  label: string;
  fRate: number;
  neighs?: string[];
  neighsInfo: { label: string; dist: number; fRate: number }[];
};
type Valves = {
  [key: string]: Valve;
};
type ValveCheck = { [key: string]: boolean };
type TripStats = { mins: number; totalFreq: number; visited: ValveCheck };

const TRIP_TIME = 30;
const START_LABEL = "AA";

const calcDists = (valve: Valve, valves: Valves, valvesWithFreq: Valves) => {
  for (const key in valvesWithFreq) {
    if (key === START_LABEL || key === valve.label) {
      continue;
    }
    const visited: ValveCheck = {};
    valve.neighs!.forEach((neighStr) => {
      visited[neighStr] = false;
    });
    const toVisit: Valve[] = [];
    const dists: number[] = [];
    toVisit.push(valve);
    dists.push(0);
    visited[valve.label] = true;

    while (toVisit.length != 0) {
      const currValve = toVisit.shift();
      const currDist = dists.shift();

      if (currValve!.label == key) {
        valve.neighsInfo.push({
          label: key,
          dist: currDist!,
          fRate: valvesWithFreq[key].fRate,
        });
        break;
      }

      currValve!.neighs!.forEach((currNeighStr) => {
        if (!visited[currNeighStr]) {
          toVisit.push(valves[currNeighStr]);
          dists.push(currDist! + 1);
          visited[currNeighStr] = true;
        }
      });
    }
  }
};

const parseValves = (data: string) => {
  const valves: Valves = {};
  const valvesWithFreq: Valves = {};

  data.split("\n").forEach((valve) => {
    const parts = valve.split(" ");
    const singleValve = parts[1];
    const fRate = parseInt(parts[4].split("=")[1].replace(";", ""), 10);
    const neighs = valve
      .split("valve")[1]
      .replace("s", "")
      .split(",")
      .map((neigh) => neigh.trim());
    valves[singleValve] = {
      label: singleValve,
      fRate,
      neighs,
      neighsInfo: [],
    };
    if (fRate > 0 || singleValve === START_LABEL) {
      valvesWithFreq[singleValve] = {
        ...valves[singleValve],
        neighsInfo: [...valves[singleValve].neighsInfo],
      };
    }
  });

  for (const key in valvesWithFreq) {
    calcDists(valvesWithFreq[key], valves, valvesWithFreq);
  }
  for (const key in valvesWithFreq) {
    delete valvesWithFreq[key].neighs;
  }

  return valvesWithFreq;
};

const calcPressure = (valves: Valves) => {
  let maxFreq = -Infinity;
  const toVisit: Valve[] = [];
  const stats: TripStats[] = [];
  toVisit.push(valves[START_LABEL]);
  const visited: ValveCheck = {};
  Object.keys(valves).forEach((key) => {
    if (key !== START_LABEL) {
      visited[key] = false;
    }
  });
  stats.push({
    mins: 0,
    totalFreq: 0,
    visited: { ...visited },
  });

  while (toVisit.length != 0) {
    const currValve = toVisit.shift();
    const currStats = stats.shift();

    let tripLen = 0;
    currValve!.neighsInfo.forEach((neighsInfo) => {
      const nextValve = valves[neighsInfo.label];
      const nextMins = currStats!.mins + neighsInfo.dist + 1;
      if (
        currStats!.visited[neighsInfo.label] === false &&
        nextMins < TRIP_TIME
      ) {
        tripLen++;
        const minsWithNewFreq =
          TRIP_TIME - nextMins >= 0 ? TRIP_TIME - nextMins : 0;
        toVisit.push(nextValve!);
        stats.push({
          mins: nextMins > TRIP_TIME ? TRIP_TIME : nextMins,
          totalFreq: currStats!.totalFreq + minsWithNewFreq * neighsInfo.fRate,
          visited: { ...currStats!.visited, [neighsInfo.label]: true },
        });
      }
    });
    if (tripLen === 0) {
      maxFreq = Math.max(maxFreq, currStats!.totalFreq);
    }
  }
  return maxFreq;
};

const solve = (data: string) => {
  const valves = parseValves(data);
  return calcPressure(valves);
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 1651);
  const t0 = performance.now();
  console.log("SOLUTION", solve(input));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
