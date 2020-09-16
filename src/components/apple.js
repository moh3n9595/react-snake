import React from 'react';
import PropTypes from 'prop-types';

const Apple = (props) => {
  const { cols, rows, apple, board } = props.state;
  return (
    <div
      className="apple"
      data-testid="apple"
      style={{
        left: `${apple.x * (board.width / cols)}px`,
        top: `${apple.y * (board.height / rows)}px`,
        width: `${board.width / cols}px`,
        height: `${board.height / rows}px`,
      }}
    />
  );
};

Apple.propTypes = {
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

export default Apple;
