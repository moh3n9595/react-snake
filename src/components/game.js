import React from 'react';

import Snake from './snake';
import Apple from './apple';
import useSnake from '../hooks/use-snake';

const Game = () => {
  const state = useSnake();

  return (
    <>
      <h1>Snake Game</h1>
      <div
        className="game-board"
        style={{
          width: `${state.board.width}px`,
          height: `${state.board.height}px`,
        }}
      >
        <Snake state={state} />
        <Apple state={state} />
      </div>
    </>
  );
};

export default Game;
