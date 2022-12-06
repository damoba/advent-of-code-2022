export const parseStacks = (stacksStr: string) => {
  const rows = stacksStr.split("\n");
  const rowsSplit = rows.slice(0, rows.length - 1).map((row) =>
    row
      .replace(/[^\]\n]\s\s\s/g, " [0] ")
      .split(" ")
      .reduce((row: string[], crate) => {
        if (crate !== "") {
          row.push(crate.replace(/[\[\]]/g, ""));
        }
        return row;
      }, [])
  );

  const stacksParsed: string[][] = [];
  for (let c = 0; c < rowsSplit[0].length; c++) {
    const stack = [];
    for (let r = rowsSplit.length - 1; r >= 0; r--) {
      if (rowsSplit[r][c] !== "0") {
        stack.push(rowsSplit[r][c]);
      }
    }
    stacksParsed.push(stack);
  }

  return stacksParsed;
};

export const parseSolution = (stacks: string[][]) => {
  let solution = "";
  stacks.forEach((stack) => {
    solution += stack[stack.length - 1];
  });

  return solution;
};
