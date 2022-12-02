export {};

const rounds = (await Deno.readTextFile("./input.txt")).split("\r\n");

const pointsPerShape: { [key: string]: number } = { "X": 1, "Y": 2, "Z": 3 };
const draws = ["A X", "B Y", "C Z"];
const wins = ["C X", "A Y", "B Z"];
const drawPoints = 3;
const winPoints = 6;

let totalPoints = 0;

for (const round of rounds) {
  const shapes = round.split(" ");
  totalPoints += pointsPerShape[shapes[1]];
  
  if (draws.includes(round)) {
    totalPoints += drawPoints;
  }
  else if (wins.includes(round)) {
    totalPoints += winPoints;
  }
}

console.log("total score", totalPoints)
