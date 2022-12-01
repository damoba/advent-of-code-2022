export {};

const elves = (await Deno.readTextFile("./input.txt"))
  .split("\r\n\r\n")
  .map((listStr) => listStr.split("\r\n").map((itemCalsStr) => parseInt(itemCalsStr, 10)));

let maxCalsPerElf: number[] = [];

elves.forEach((list) => {
  maxCalsPerElf.push(list.reduce((itemCals, c) => itemCals + c, 0));
});

console.log("top 3 max", maxCalsPerElf.sort((a, b) => b - a).slice(0,3).reduce((maxCals, a) => maxCals + a, 0));
