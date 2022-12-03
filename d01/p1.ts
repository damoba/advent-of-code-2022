export {};

const elves = (await Deno.readTextFile("./input.txt"))
  .split("\n\n")
  .map((listStr) => listStr.split("\n").map((itemCalsStr) => parseInt(itemCalsStr, 10)));

let maxCalsPerElf = 0;

elves.forEach((list) => {
  const maxCalsForElf = list.reduce((itemCals, c) => itemCals + c, 0);
  if (maxCalsForElf > maxCalsPerElf) {
    maxCalsPerElf = maxCalsForElf;
  }
});

console.log("total max", maxCalsPerElf);
