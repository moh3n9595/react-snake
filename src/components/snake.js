import React from 'react';
import PropTypes from 'prop-types';

const Snake = (props) => {
  const { rows, cols, snake, board } = props.state;

  return (
    <>
      {snake.map((dot, idx) => (
        <div
          key={idx}
          className="snake"
          data-testid="snake"
          style={{
            left: `${(board.width / cols) * dot.x}px`,
            top: `${(board.height / rows) * dot.y}px`,
            width: `${board.width / cols}px`,
            height: `${board.height / rows}px`,
          }}
        ></div>
      ))}
    </>
  );
};

Snake.propTypes = {
  state: PropTypes.shape({
    cols: PropTypes.number.isRequired,
    rows: PropTypes.number.isRequired,
    speed: PropTypes.number.isRequired,
    moves: PropTypes.arrayOf(
      PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
      }),
    ).isRequired,
    snake: PropTypes.arrayOf(
      PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
      }),
    ).isRequired,
    board: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }),
  }),
};

export default Snake;
