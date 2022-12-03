export {};

const lines = (await Deno.readTextFile("./example.txt")).split("\n");

console.log(lines);
