export {};

const list = (await Deno.readTextFile("./input.txt")).split("\n");

const vowelPriorityStart = "a".charCodeAt(0) - 1;
const capitalPriorityStart = "A".charCodeAt(0) - 27;

let totalPriority = 0;

let i = 0;
while (i < list.length) {
  const itemsPerTrio = [new Set(), new Set()];
  let common = "";

  let j = 0;
  while (j < 2) {
    for (const item of list[i]) {
      itemsPerTrio[j].add(item);
    }
    i += 1;
    j += 1;
  }
  for (const item of list[i]) {
    if (itemsPerTrio[0].has(item) && itemsPerTrio[1].has(item)) {
      common = item;
      break;
    }
  }

  if (common === common.toLowerCase()) {
    totalPriority += common.charCodeAt(0) - vowelPriorityStart;
  } else {
    totalPriority += common.charCodeAt(0) - capitalPriorityStart;
  }

  i += 1
}

console.log("total priority", totalPriority);
