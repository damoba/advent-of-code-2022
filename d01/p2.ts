export {};

const elves = (await Deno.readTextFile("./input.txt"))
  .split("\r\n\r\n")
  .map((listStr) => listStr.split("\r\n").map((itemCalsStr) => parseInt(itemCalsStr, 10)));

const maxCalsPerElf: number[] = [];

elves.forEach((list) => {
  maxCalsPerElf.push(list.reduce((itemCals, c) => itemCals + c, 0));
});

console.log("top 3 max", maxCalsPerElf.sort((a, b) => b - a).slice(0,3).reduce((maxCals, c) => maxCals + c, 0));
