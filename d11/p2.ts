import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

type Monkey = {
  items: number[];
  oper: (string | number)[];
  div: number;
  yes: number;
  no: number;
  count: number;
};

const multiply = "*";
const itself = "old";

const parseMonkeys = (data: string, monkeys: Monkey[]) => {
  const monkeysStr = data.split("\n\n");
  for (const monkeyStr of monkeysStr) {
    const parts = monkeyStr.split("\n");
    const items = parts[1]
      .split(":")[1]
      .split(",")
      .map((itemStr) => parseInt(itemStr, 10));
    const oper = parts[2]
      .split("=")[1]
      .trim()
      .split(" ")
      .slice(1)
      .map((partStr) =>
        isNaN(partStr as any) ? partStr : parseInt(partStr, 10)
      );
    const div = parseInt(parts[3].trim().split(" ")[3], 10);
    const yes = parseInt(parts[4].trim().split(" ")[5], 10);
    const no = parseInt(parts[5].trim().split(" ")[5], 10);
    monkeys.push({ items, oper, div, yes, no, count: 0 });
  }
};

const solve = (data: string) => {
  const monkeys: Monkey[] = [];
  parseMonkeys(data, monkeys);
  const divMultiple = monkeys.reduce((mult, monkey) => mult *= monkey.div, 1);

  for (let i = 0; i < 10000; i++) {
    for (const monkey of monkeys) {
      while (monkey.items.length > 0) {
        monkey.count++;
        if (monkey.oper[0] === multiply) {
          if (monkey.oper[1] === itself) {
            monkey.items[0] *= monkey.items[0];
          } else {
            monkey.items[0] *= monkey.oper[1] as number;
          }
        } else {
          if (monkey.oper[1] === itself) {
            monkey.items[0] += monkey.items[0];
          } else {
            monkey.items[0] += monkey.oper[1] as number;
          }
        }
        // since  (a mod m) mod n = a mod n when m is a multiple of n
        monkey.items[0] %= divMultiple;
        if (monkey.items[0] % monkey.div === 0) {
          monkeys[monkey.yes].items.push(monkey.items[0]);
        } else {
          monkeys[monkey.no].items.push(monkey.items[0]);
        }
        monkey.items.splice(0, 1);
      }
    }
  }

  return monkeys
    .sort((monkey1, monkey2) => monkey2.count - monkey1.count)
    .slice(0, 2)
    .reduce((monkeyBusiness, monkey) => monkeyBusiness * monkey.count, 1);
};

const example = await Deno.readTextFile("./example.txt");
const input = await Deno.readTextFile("./input.txt");
Deno.test("Test and Solve", () => {
  assertEquals(solve(example), 2713310158);
  console.log("SOLUTION", solve(input));
});
