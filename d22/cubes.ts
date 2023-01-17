const CUBE_FACES = [1, 2, 3, 4, 5, 6] as const;
export type CubeFace = typeof CUBE_FACES[number];
export type CubeFaceInfo = {
  topLeft: { row: number; col: number };
  Up: { cubeFace: number; facing: string };
  Right: { cubeFace: number; facing: string };
  Down: { cubeFace: number; facing: string };
  Left: { cubeFace: number; facing: string };
};
export type Cube = {
  len: number;
  1: CubeFaceInfo;
  2: CubeFaceInfo;
  3: CubeFaceInfo;
  4: CubeFaceInfo;
  5: CubeFaceInfo;
  6: CubeFaceInfo;
};

export const exampleCube = {
  len: 4,
  1: {
    topLeft: { row: 0, col: 8 },
    Up: { cubeFace: 2, facing: "Down" },
    Right: { cubeFace: 6, facing: "Left" },
    Down: { cubeFace: 4, facing: "Down" },
    Left: { cubeFace: 3, facing: "Down" },
  },
  2: {
    topLeft: { row: 4, col: 0 },
    Up: { cubeFace: 1, facing: "Down" },
    Right: { cubeFace: 3, facing: "Right" },
    Down: { cubeFace: 5, facing: "Up" },
    Left: { cubeFace: 6, facing: "Up" },
  },
  3: {
    topLeft: { row: 4, col: 4 },
    Up: { cubeFace: 1, facing: "Right" },
    Right: { cubeFace: 4, facing: "Right" },
    Down: { cubeFace: 5, facing: "Right" },
    Left: { cubeFace: 2, facing: "Left" },
  },
  4: {
    topLeft: { row: 4, col: 8 },
    Up: { cubeFace: 1, facing: "Up" },
    Right: { cubeFace: 6, facing: "Down" },
    Down: { cubeFace: 5, facing: "Down" },
    Left: { cubeFace: 3, facing: "Left" },
  },
  5: {
    topLeft: { row: 8, col: 8 },
    Up: { cubeFace: 4, facing: "Up" },
    Right: { cubeFace: 6, facing: "Right" },
    Down: { cubeFace: 2, facing: "Up" },
    Left: { cubeFace: 3, facing: "Up" },
  },
  6: {
    topLeft: { row: 8, col: 12 },
    Up: { cubeFace: 4, facing: "Left" },
    Right: { cubeFace: 1, facing: "Left" },
    Down: { cubeFace: 2, facing: "Right" },
    Left: { cubeFace: 5, facing: "Left" },
  },
};

export const inputCube = {
  len: 50,
  1: {
    topLeft: { row: 0, col: 50 },
    Up: { cubeFace: 6, facing: "Right" },
    Right: { cubeFace: 2, facing: "Right" },
    Down: { cubeFace: 3, facing: "Down" },
    Left: { cubeFace: 4, facing: "Right" },
  },
  2: {
    topLeft: { row: 0, col: 100 },
    Up: { cubeFace: 6, facing: "Up" },
    Right: { cubeFace: 5, facing: "Left" },
    Down: { cubeFace: 3, facing: "Left" },
    Left: { cubeFace: 1, facing: "Left" },
  },
  3: {
    topLeft: { row: 50, col: 50 },
    Up: { cubeFace: 1, facing: "Up" },
    Right: { cubeFace: 2, facing: "Up" },
    Down: { cubeFace: 5, facing: "Down" },
    Left: { cubeFace: 4, facing: "Down" },
  },
  4: {
    topLeft: { row: 100, col: 0 },
    Up: { cubeFace: 3, facing: "Right" },
    Right: { cubeFace: 5, facing: "Right" },
    Down: { cubeFace: 6, facing: "Down" },
    Left: { cubeFace: 1, facing: "Right" },
  },
  5: {
    topLeft: { row: 100, col: 50 },
    Up: { cubeFace: 3, facing: "Up" },
    Right: { cubeFace: 2, facing: "Left" },
    Down: { cubeFace: 6, facing: "Left" },
    Left: { cubeFace: 4, facing: "Left" },
  },
  6: {
    topLeft: { row: 150, col: 0 },
    Up: { cubeFace: 4, facing: "Up" },
    Right: { cubeFace: 5, facing: "Up" },
    Down: { cubeFace: 2, facing: "Down" },
    Left: { cubeFace: 1, facing: "Down" },
  },
};
