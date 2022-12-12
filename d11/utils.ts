export type Monkey = {
  items: number[];
  oper: (string | number)[];
  div: number;
  yes: number;
  no: number;
  count: number;
};

export const parseMonkeys = (data: string, monkeys: Monkey[]) => {
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
        isNaN(Number(partStr)) ? partStr : parseInt(partStr, 10)
      );
    const div = parseInt(parts[3].trim().split(" ")[3], 10);
    const yes = parseInt(parts[4].trim().split(" ")[5], 10);
    const no = parseInt(parts[5].trim().split(" ")[5], 10);
    monkeys.push({ items, oper, div, yes, no, count: 0 });
  }
};
