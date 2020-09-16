export const NORTH = { x: 0, y: -1 };
export const SOUTH = { x: 0, y: 1 };
export const EAST = { x: 1, y: 0 };
export const WEST = { x: -1, y: 0 };

export const INIT_STATE = {
  cols: 20,
  rows: 14,
  board: { width: 700, height: 500 },
  speed: 100,
  moves: [EAST],
  snake: [{ x: 2, y: 2 }],
  apple: { x: 16, y: 2 },
};
