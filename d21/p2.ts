import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  BigFloat,
  set_precision,
} from "https://deno.land/x/bigfloat@v3.0.2/mod.ts";

set_precision(-20);

type MonkeyCalc = { operand1: string; operand2: string; operator: string };
type Point = { x: string; y: string };

const PLUS = "+";
const MINUS = "-";
const DIV = "/";
const MULT = "*";
const MONKEY_NAME = "root";
const YOUR_NAME = "humn";

const parseMonkeys = (
  data: string,
  monkeys: Map<string, MonkeyCalc>,
  cachedMonkeys: Map<string, string>
) => {
  data.split("\n").forEach((line) => {
    if (line) {
      let [name, calc] = line.split(":");
      calc = calc.trim();

      if (/^\d+$/.test(calc)) {
        cachedMonkeys.set(name, calc);
      } else {
        let [operand1, operator, operand2] = calc.split(" ");
        // ----> Main change here: <----
        if (name === MONKEY_NAME) operator = MINUS;
        monkeys.set(name, { operand1, operand2, operator });
      }
    }
  });
};

const getMonkeyNum = (
  name: string,
  monkeys: Map<string, MonkeyCalc>,
  cachedMonkeys: Map<string, string>
) => {
  if (cachedMonkeys.has(name)) {
    return cachedMonkeys.get(name);
  } else {
    const monkey = monkeys.get(name)!;
    const operand1 = getMonkeyNum(monkey.operand1, monkeys, cachedMonkeys)!;
    const operand2 = getMonkeyNum(monkey.operand2, monkeys, cachedMonkeys)!;
    const operator = monkey.operator;

    let result = "";
    switch (operator) {
      case PLUS:
        result = new BigFloat(operand1).add(operand2).toString();
        break;
      case MINUS:
        result = new BigFloat(operand1).sub(operand2).toString();
        break;
      case DIV:
        result = new BigFloat(operand1).div(operand2).toString();
        break;
      case MULT:
        result = new BigFloat(operand1).mul(operand2).toString();
        break;
    }

    cachedMonkeys.set(name, result);
    return result;
  }
};

const solve = (data: string) => {
  const monkeys = new Map<string, MonkeyCalc>();
  const cachedMonkeys = new Map<string, string>();
  parseMonkeys(data, monkeys, cachedMonkeys);

  // y = mx + b
  // y is the result of MONKEY_NAME's calculation
  // x is YOUR_NAME's number yelled at that time
  // m is the slope (delta y / delta x)
  // b is the y-intercept (y when x is 0)
  // When MONKEY_NAME's operands are equal, we know they subtract to 0
  // So we need to solve for x when: 0 = mx + b
  // In other words: -b/m = x
  const points: Point[] = [];
  let x = 0;
  while (x < 2) {
    const xStr = x.toString();
    const monkeysTest = new Map(monkeys);
    const cachedMonkeysTest = new Map(cachedMonkeys);
    cachedMonkeysTest.set(YOUR_NAME, xStr);
    const y = getMonkeyNum(MONKEY_NAME, monkeysTest, cachedMonkeysTest)!;
    points.push({ x: xStr, y });
    x++;
  }

  const m = new BigFloat(new BigFloat(points[1].y).sub(points[0].y).toString())
    .div(new BigFloat(points[1].x).sub(points[0].x).toString())
    .toString();
  const b = points[0].y;
  return new BigFloat("-1")
    .mul(new BigFloat(new BigFloat(b).div(m).toString()).toString())
    .toString();
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), "301");
  const t0 = performance.now();
  console.log("SOLUTION", solve(input));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
