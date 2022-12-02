export {};

const lines = (await Deno.readTextFile("./example.txt")).split("\r\n");

console.log(lines);
