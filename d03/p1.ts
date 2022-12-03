export {};

const list = (await Deno.readTextFile("./input.txt")).split("\n");

const vowelPriorityStart = "a".charCodeAt(0) - 1;
const capitalPriorityStart = "A".charCodeAt(0) - 27;

let totalPriority = 0;

list.forEach((line) => {
  const items = new Set();
  let common = "";

  let i = 0;
  while (i < line.length / 2) {
    items.add(line[i]);
    i += 1;
  }
  while (i < line.length) {
    if (items.has(line[i])) {
      common = line[i];
      break;
    }
    i += 1;
  }

  if (common === common.toLowerCase()) {
    totalPriority += common.charCodeAt(0) - vowelPriorityStart;
  } else {
    totalPriority += common.charCodeAt(0) - capitalPriorityStart;
  }
});

console.log("total priority", totalPriority);