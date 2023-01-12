import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

type CostMat = { ore: number; clay: number; obsidian: number };
type Costs = { [key: string]: CostMat };
type Mats = { ore: number; clay: number; obsidian: number; geode: number };
type NumRobots = { ore: number; clay: number; obsidian: number; geode: number };
type Time = { mins: number };
type PathStep = { mats: Mats; numRobots: NumRobots; time: Time };
type PathEnded = { timeReachedGeodes: number };
type PathContinued = { nextPathStep: PathStep };
type BuildResult = PathEnded | PathContinued;

const ORE = "ore";
const CLAY = "clay";
const OBSIDIAN = "obsidian";
const GEODE = "geode";

const MAX = "max";

const TIME_END = 24;

const parseBlueprints = (data: string): Costs[] => {
  const blueprints: Costs[] = [];
  const lines = data.split("\n").reduce((lines, line) => {
    if (line) {
      lines.push(line);
    }
    return lines;
  }, [] as string[]);

  for (const line of lines) {
    const matLines = line
      .split(":")[1]
      .split(".")
      .reduce((lines, line) => {
        if (line) {
          lines.push(line);
        }
        return lines;
      }, [] as string[]);

    const costsArr = matLines.reduce((costsArr, matLine) => {
      costsArr.push(
        matLine.match(/\d+/g)!.map((numStr) => parseInt(numStr, 10))
      );
      return costsArr;
    }, [] as number[][]);

    blueprints.push({
      [ORE]: {
        ore: costsArr[0][0],
        clay: 0,
        obsidian: 0,
      },
      [CLAY]: {
        ore: costsArr[1][0],
        clay: 0,
        obsidian: 0,
      },
      [OBSIDIAN]: {
        ore: costsArr[2][0],
        clay: costsArr[2][1],
        obsidian: 0,
      },
      [GEODE]: {
        ore: costsArr[3][0],
        clay: 0,
        obsidian: costsArr[3][1],
      },
      [MAX]: {
        ore: Math.max(
          costsArr[0][0],
          costsArr[1][0],
          costsArr[2][0],
          costsArr[3][0]
        ),
        clay: costsArr[2][1],
        obsidian: costsArr[3][1],
      },
    });
  }
  return blueprints;
};

const deepCopyPathStep = (pathStep: PathStep): PathStep => {
  const mats = { ...pathStep.mats };
  const numRobots = { ...pathStep.numRobots };
  const time = { ...pathStep.time };
  return { mats, numRobots, time };
};

const collectMats = (mats: Mats, numRobots: NumRobots) => {
  mats.ore += numRobots.ore;
  mats.clay += numRobots.clay;
  mats.obsidian += numRobots.obsidian;
  mats.geode += numRobots.geode;
};

const removeSurplusMats = (pathStep: PathStep, costs: Costs) => {
  const { mats, numRobots, time } = pathStep;
  const timeLeft = TIME_END - time.mins;
  mats.ore = Math.min(
    mats.ore,
    timeLeft * costs[MAX].ore - (timeLeft - 1) * numRobots.ore
  );
  mats.clay = Math.min(
    mats.clay,
    timeLeft * costs[MAX].clay - (timeLeft - 1) * numRobots.clay
  );
  mats.obsidian = Math.min(
    mats.obsidian,
    timeLeft * costs[MAX].obsidian - (timeLeft - 1) * numRobots.obsidian
  );
};

const buildRobot = (
  pathStep: PathStep,
  costs: Costs,
  robotType: string
): BuildResult => {
  let { mats, numRobots, time } = deepCopyPathStep(pathStep);
  // Collect mats until we have enough to build a robot
  while (
    time.mins < TIME_END &&
    (mats.ore < costs[robotType].ore ||
      mats.clay < costs[robotType].clay ||
      mats.obsidian < costs[robotType].obsidian)
  ) {
    collectMats(mats, numRobots);
    time.mins++;
  }

  // If time ran out, return the geodes we have
  if (time.mins === TIME_END) {
    return { timeReachedGeodes: mats.geode };
  }

  // Otherwise, first spend mats to build the robot
  mats = {
    ...mats,
    ore: mats.ore - costs[robotType].ore,
    clay: mats.clay - costs[robotType].clay,
    obsidian: mats.obsidian - costs[robotType].obsidian,
  };
  // Then collect mats for the day
  collectMats(mats, numRobots);
  time.mins++;
  // Then build the robot
  numRobots = {
    ...numRobots,
    [robotType]: numRobots[robotType as keyof NumRobots] + 1,
  };
  return { nextPathStep: { mats, numRobots, time } };
};

const buildWithoutSurplusBots = (
  pathStep: PathStep,
  costs: Costs,
  robotType: string
): BuildResult => {
  // Checks whether we already have the maximum number of robots
  // required to collect the maximum number of mats needed for that particular
  // type. - If we do, we don't need to build any surplus robots of that type.
  return pathStep.numRobots[robotType as keyof NumRobots] <
    costs[MAX][robotType as keyof CostMat]
    ? buildRobot(pathStep, costs, robotType)
    : { timeReachedGeodes: pathStep.mats.geode };
};

const isPathEnd = (buildResult: BuildResult): buildResult is PathEnded => {
  return (buildResult as PathEnded).timeReachedGeodes !== undefined;
};

const respondToBuildResult = (
  buildResult: BuildResult,
  maxGeodes: { val: number },
  pathSteps: PathStep[]
) => {
  if (isPathEnd(buildResult)) {
    maxGeodes.val = Math.max(maxGeodes.val, buildResult.timeReachedGeodes);
  } else if (buildResult.nextPathStep) {
    pathSteps.push(buildResult.nextPathStep);
  }
};

const calcMaxGeodes = (blueprint: Costs) => {
  const maxGeodes = { val: 0 };

  const visited = new Set<string>();
  const mats = { ore: 0, clay: 0, obsidian: 0, geode: 0 };
  const numRobots = { ore: 1, clay: 0, obsidian: 0, geode: 0 };
  const time = { mins: 0 };
  const pathStart = { mats, numRobots, time };

  const pathSteps: PathStep[] = [pathStart];

  while (pathSteps.length) {
    const pathStep = pathSteps.shift()!;

    removeSurplusMats(pathStep, blueprint);
    const key = JSON.stringify(pathStep);
    if (visited.has(key)) {
      continue;
    }
    visited.add(key);

    const buildOreResult = buildWithoutSurplusBots(pathStep, blueprint, ORE);
    const buildClayResult = buildWithoutSurplusBots(pathStep, blueprint, CLAY);
    const buildObsidianResult = buildWithoutSurplusBots(
      pathStep,
      blueprint,
      OBSIDIAN
    );
    const buildGeodeResult = buildRobot(pathStep, blueprint, GEODE);

    respondToBuildResult(buildOreResult, maxGeodes, pathSteps);
    respondToBuildResult(buildClayResult, maxGeodes, pathSteps);
    respondToBuildResult(buildObsidianResult, maxGeodes, pathSteps);
    respondToBuildResult(buildGeodeResult, maxGeodes, pathSteps);
  }

  return maxGeodes.val;
};

const solve = (data: string) => {
  const blueprints = parseBlueprints(data);
  const geodesPerBlueprint: number[] = [];

  for (const blueprint of blueprints) {
    geodesPerBlueprint.push(calcMaxGeodes(blueprint));
  }

  return geodesPerBlueprint.reduce((ga, gb, i) => ga + gb * (i + 1), 0);
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 33);
  const t0 = performance.now();
  console.log("SOLUTION", solve(input));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
