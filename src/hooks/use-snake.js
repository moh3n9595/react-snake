import { useReducer, useEffect } from 'react';
import { INIT_STATE } from '../initialState';
import { snakeMoveState, snakeChangeDirectionState } from '../logic';

const reducer = (state, action) => {
  switch (action.type) {
    case 'SNAKE_CHANGE_DIRECTION':
      return snakeChangeDirectionState(state, action.payload);

    case 'SNAKE_MOVE':
      return snakeMoveState(state);

    default:
      throw new Error();
  }
};

export default function useSnake() {
  const [state, dispatch] = useReducer(reducer, { ...INIT_STATE });
  const onChangeDirection = (event) => {
    dispatch({
      type: 'SNAKE_CHANGE_DIRECTION',
      payload: event.key,
    });
  };

  useEffect(() => {
    window.addEventListener('keydown', onChangeDirection, false);

    return () =>
      window.removeEventListener('keydown', onChangeDirection, false);
  }, []);

  useEffect(() => {
    const onStep = () => {
      dispatch({
        type: 'SNAKE_MOVE',
      });
    };

    const interval = setInterval(onStep, state.speed);

    return () => clearInterval(interval);
  }, [state.speed]);

  return state;
}
