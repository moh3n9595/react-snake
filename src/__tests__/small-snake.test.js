import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import Game from '../components/game';
import { INIT_STATE } from '../initialState';

const cellHeight = INIT_STATE.board.height / INIT_STATE.rows;

beforeAll(() => {
  jest.useFakeTimers();
});
afterAll(() => {
  jest.useRealTimers();
});

jest.mock('../initialState', () => ({
  NORTH: { x: 0, y: -1 },
  SOUTH: { x: 0, y: 1 },
  EAST: { x: 1, y: 0 },
  WEST: { x: -1, y: 0 },
  INIT_STATE: {
    cols: 5,
    rows: 2,
    board: { width: 700, height: 500 },
    speed: 100,
    moves: [{ x: 1, y: 0 }],
    snake: [
      { x: 4, y: 0 },
      { x: 3, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 0 },
    ],
    apple: { x: 1, y: 0 },
  },
}));

test('reset game when snake hit itself', () => {
  const { getAllByTestId } = render(<Game />);
  fireEvent.keyDown(document, {
    key: 'w',
    keyCode: 83,
  });

  const snakeDots = getAllByTestId('snake');

  for (let i = 0; i < snakeDots.length; i++) {
    expect(snakeDots[i]).toHaveStyle(`top: 0px`);
  }
  act(() => jest.advanceTimersByTime(2 * INIT_STATE.speed));
  expect(snakeDots[0]).toHaveStyle(`top: ${1 * cellHeight}px`);
  for (let i = 1; i < snakeDots.length; i++) {
    expect(snakeDots[i]).toHaveStyle(`top: 0px`);
  }

  act(() => jest.advanceTimersByTime(1 * INIT_STATE.speed));
  for (let i = 0; i < snakeDots.length; i++) {
    expect(snakeDots[i]).toHaveStyle(`top: 0px`);
  }
});
