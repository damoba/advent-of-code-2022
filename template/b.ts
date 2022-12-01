export {};

const lines = (await Deno.readTextFile("./input.txt")).split("\r\n");

console.log(lines);
