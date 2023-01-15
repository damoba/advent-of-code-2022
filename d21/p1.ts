import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

type MonkeyCalc = { operand1: string; operand2: string; operator: string };

const PLUS = "+";
const MINUS = "-";
const DIV = "/";
const MULT = "*";
const MONKEY_NAME = "root";

const parseMonkeys = (
  data: string,
  monkeys: Map<string, MonkeyCalc>,
  cachedMonkeys: Map<string, number>
) => {
  data.split("\n").forEach((line) => {
    if (line) {
      let [name, calc] = line.split(":");
      calc = calc.trim();

      if (/^\d+$/.test(calc)) {
        cachedMonkeys.set(name, parseInt(calc, 10));
      } else {
        const [operand1, operator, operand2] = calc.split(" ");
        monkeys.set(name, { operand1, operand2, operator });
      }
    }
  });
};

const getMonkeyNum = (
  name: string,
  monkeys: Map<string, MonkeyCalc>,
  cachedMonkeys: Map<string, number>
) => {
  if (cachedMonkeys.has(name)) {
    return cachedMonkeys.get(name);
  } else {
    const monkey = monkeys.get(name)!;
    const operand1 = getMonkeyNum(monkey.operand1, monkeys, cachedMonkeys)!;
    const operand2 = getMonkeyNum(monkey.operand2, monkeys, cachedMonkeys)!;
    const operator = monkey.operator;

    let result = 0;
    switch (operator) {
      case PLUS:
        result = operand1 + operand2;
        break;
      case MINUS:
        result = operand1 - operand2;
        break;
      case DIV:
        result = operand1 / operand2;
        break;
      case MULT:
        result = operand1 * operand2;
        break;
    }

    cachedMonkeys.set(name, result);
    return result;
  }
};

const solve = (data: string) => {
  const monkeys = new Map<string, MonkeyCalc>();
  const cachedMonkeys = new Map<string, number>();
  parseMonkeys(data, monkeys, cachedMonkeys);
  return getMonkeyNum(MONKEY_NAME, monkeys, cachedMonkeys);
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 152);
  const t0 = performance.now();
  console.log("SOLUTION", solve(input));
  const t1 = performance.now();
  console.log("TIME", (t1 - t0).toLocaleString(), "ms");
});
