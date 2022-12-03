export {};

const rounds = (await Deno.readTextFile("./input.txt")).split("\r\n");

const pointsPerShape: { [key: string]: number } = { A: 1, B: 2, C: 3 };
const wins: { [key: string]: string } = { A: "C", B: "A", C: "B" };
const loses: { [key: string]: string } = { A: "B", B: "C", C: "A" };
const drawShape = "Y";
const winShape = "Z";
const drawPoints = 3;
const winPoints = 6;

let totalPoints = 0;

for (const round of rounds) {
  const shapes = round.split(" ");
  let myShape = "";
  
  if (shapes[1] === drawShape) {
    totalPoints += drawPoints;
    myShape = shapes[0];
  } else if (shapes[1] === winShape) {
    totalPoints += winPoints;
    myShape = loses[shapes[0]];
  } else {
    myShape = wins[shapes[0]];
  }

  totalPoints += pointsPerShape[myShape];
}

console.log("total score", totalPoints);
