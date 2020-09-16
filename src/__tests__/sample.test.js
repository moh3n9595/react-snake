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
