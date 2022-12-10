const addToken = "addx";
const addCycLen = 2;
const noopToken = "noop";

export const calcXPerCycle = (data: string) => {
  const lines = data.split("\n");
  const xPerCycle: Map<number, number> = new Map([[0, 1]]);

  let cyc = 0;
  let x = 1;

  lines.forEach((line) => {
    const [token, amount] = line.split(" ");

    if (token === noopToken) {
      // run the cycle once while updating map
      cyc++;
      xPerCycle.set(cyc, x);
    } else if (token === addToken) {
      const cycStart = cyc;
      while (cyc < cycStart + addCycLen) {
        // run the cycle "addCycLen" times while updating map
        cyc++;
        xPerCycle.set(cyc, x);
      }
      // then add the value for the start of the next cycle
      x += parseInt(amount, 10);
      xPerCycle.set(cyc + 1, x);
    }
  });

  return xPerCycle;
};
