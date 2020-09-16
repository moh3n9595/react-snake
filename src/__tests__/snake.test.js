import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import Game from '../components/game';
import { INIT_STATE } from '../initialState';

beforeAll(() => {
  jest.useFakeTimers();
});
afterAll(() => {
  jest.useRealTimers();
});

const cellWidth = INIT_STATE.board.width / INIT_STATE.cols;
const cellHeight = INIT_STATE.board.height / INIT_STATE.rows;
const stepSpeed = 4 * INIT_STATE.speed + INIT_STATE.speed - 1;

test('renders snake and food', () => {
  const { getByTestId } = render(<Game />);

  const snakeDot = getByTestId('snake');
  expect(snakeDot).toBeInTheDocument();
  expect(snakeDot).toHaveStyle(
    `width: ${cellWidth}px; height: ${cellHeight}px; left: ${
      INIT_STATE.snake[0].x * cellWidth
    }px; top: ${INIT_STATE.snake[0].y * cellHeight}px`,
  );

  const food = getByTestId('apple');
  expect(food).toBeInTheDocument();
  expect(food).toHaveStyle(
    `width: ${cellWidth}px; height: ${cellHeight}px; left: ${
      INIT_STATE.apple.x * cellWidth
    }px; top: ${INIT_STATE.apple.y * cellHeight}px`,
  );
});

test('snake moves in start', () => {
  const { getByTestId } = render(<Game />);

  const snakeDot = getByTestId('snake');
  expect(snakeDot).toHaveStyle(
    `left: ${INIT_STATE.snake[0].x * cellWidth}px; top: ${
      INIT_STATE.snake[0].y * cellHeight
    }px`,
  );

  for (let j = 1; j <= 10; j++) {
    act(() => jest.advanceTimersByTime(INIT_STATE.speed));
    expect(snakeDot).toHaveStyle(
      `left: ${(INIT_STATE.snake[0].x + j) * cellWidth}px; top: ${
        INIT_STATE.snake[0].y * cellHeight
      }px`,
    );
  }
});

test('change direction', () => {
  const { getByTestId } = render(<Game />);
  const snakeDot = getByTestId('snake');

  // moves right on default
  act(() => jest.advanceTimersByTime(stepSpeed));
  expect(snakeDot).toHaveStyle(
    `left: ${(INIT_STATE.snake[0].x + 4) * cellWidth}px; top: ${
      INIT_STATE.snake[0].y * cellHeight
    }px`,
  );

  // down
  fireEvent.keyDown(document, {
    key: 's',
    keyCode: 83,
  });
  act(() => jest.advanceTimersByTime(stepSpeed));
  expect(snakeDot).toHaveStyle(
    `left: ${(INIT_STATE.snake[0].x + 5) * cellWidth}px; top: ${
      (INIT_STATE.snake[0].y + 4) * cellHeight
    }px`,
  );

  // left
  fireEvent.keyDown(document, {
    key: 'a',
    keyCode: '65',
  });
  act(() => jest.advanceTimersByTime(stepSpeed));
  expect(snakeDot).toHaveStyle(
    `left: ${(INIT_STATE.snake[0].x + 1) * cellWidth}px; top: ${
      (INIT_STATE.snake[0].y + 5) * cellHeight
    }px`,
  );

  // top
  fireEvent.keyDown(document, {
    key: 'w',
    keyCode: 87,
  });
  act(() => jest.advanceTimersByTime(stepSpeed));
  expect(snakeDot).toHaveStyle(
    `left: ${INIT_STATE.snake[0].x * cellWidth}px; top: ${
      (INIT_STATE.snake[0].y + 1) * cellHeight
    }px`,
  );

  // right again
  fireEvent.keyDown(document, { key: 'd', keyCode: 68 });
  act(() => jest.advanceTimersByTime(stepSpeed));
  expect(snakeDot).toHaveStyle(
    `left: ${(INIT_STATE.snake[0].x + 4) * cellWidth}px; top: ${
      INIT_STATE.snake[0].y * cellHeight
    }px`,
  );
});

test('cant go in reverse direction', () => {
  const { getByTestId } = render(<Game />);

  const snakeDot = getByTestId('snake');

  fireEvent.keyDown(document, {
    key: 'a',
    keyCode: '65',
  });

  for (let j = 1; j <= 10; j++) {
    act(() => jest.advanceTimersByTime(INIT_STATE.speed));
    expect(snakeDot).toHaveStyle(
      `left: ${(INIT_STATE.snake[0].x + j) * cellWidth}px; top: ${
        INIT_STATE.snake[0].y * cellHeight
      }px`,
    );
  }
});

test('snake grows', () => {
  const { getAllByTestId } = render(<Game />);

  expect(getAllByTestId('snake').length).toBe(1);
  act(() => jest.advanceTimersByTime(15 * INIT_STATE.speed));

  const snakeDots = getAllByTestId('snake');
  expect(snakeDots.length).toBe(2);

  expect(snakeDots[0]).toHaveStyle(
    `left: ${(INIT_STATE.snake[0].x + 15) * cellWidth}px; top: ${
      INIT_STATE.snake[0].y * cellHeight
    }px`,
  );
  expect(snakeDots[1]).toHaveStyle(
    `left: ${(INIT_STATE.snake[0].x + 14) * cellWidth}px; top: ${
      INIT_STATE.snake[0].y * cellHeight
    }px`,
  );
});

test('food appear in random place', () => {
  const { getByTestId, unmount, rerender } = render(<Game />);

  act(() => jest.advanceTimersByTime(15 * INIT_STATE.speed));
  const first_left = getByTestId('apple').style.left;
  const first_top = getByTestId('apple').style.top;

  unmount();
  rerender(<Game />);
  act(() => jest.advanceTimersByTime(15 * INIT_STATE.speed));
  const second_left = getByTestId('apple').style.left;
  const second_top = getByTestId('apple').style.top;

  unmount();
  rerender(<Game />);
  act(() => jest.advanceTimersByTime(15 * INIT_STATE.speed));
  const third_left = getByTestId('apple').style.left;
  const third_top = getByTestId('apple').style.top;

  // random place
  if (first_left === second_left) {
    expect(second_left).not.toBe(third_left);
  } else {
    expect(first_left).not.toBe(second_left);
  }

  if (first_top === second_top) {
    expect(second_top).not.toBe(third_top);
  } else {
    expect(first_top).not.toBe(second_top);
  }

  const toInt = (number) => {
    return parseInt(number.match(/\d+/)[0]);
  };

  // in board
  expect(toInt(first_left)).toBeGreaterThanOrEqual(0);
  expect(toInt(first_left)).toBeLessThanOrEqual(INIT_STATE.board.width);
  expect(toInt(first_top)).toBeGreaterThanOrEqual(0);
  expect(toInt(first_top)).toBeLessThanOrEqual(INIT_STATE.board.height);

  expect(toInt(second_left)).toBeGreaterThanOrEqual(0);
  expect(toInt(second_left)).toBeLessThanOrEqual(INIT_STATE.board.width);
  expect(toInt(second_top)).toBeGreaterThanOrEqual(0);
  expect(toInt(second_top)).toBeLessThanOrEqual(INIT_STATE.board.height);

  expect(toInt(third_left)).toBeGreaterThanOrEqual(0);
  expect(toInt(third_left)).toBeLessThanOrEqual(INIT_STATE.board.width);
  expect(toInt(third_top)).toBeGreaterThanOrEqual(0);
  expect(toInt(third_top)).toBeLessThanOrEqual(INIT_STATE.board.height);
});

test('snake can go through board', () => {
  const { getAllByTestId } = render(<Game />);

  act(() => jest.advanceTimersByTime((INIT_STATE.cols - 2) * INIT_STATE.speed));
  expect(getAllByTestId('snake')[0]).toHaveStyle(
    `left: 0px; top: ${INIT_STATE.snake[0].y * cellHeight}px`,
  );

  act(() => jest.advanceTimersByTime(2 * INIT_STATE.speed));
  expect(getAllByTestId('snake')[0]).toHaveStyle(
    `left: ${INIT_STATE.snake[0].x * cellWidth}px; top: ${
      INIT_STATE.snake[0].y * cellHeight
    }px`,
  );
});
