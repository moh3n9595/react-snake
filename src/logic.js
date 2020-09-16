import { INIT_STATE, WEST, EAST, NORTH, SOUTH } from './initialState';

const _deepEqual = (x, y) => {
  if (x === y) return true;
  // if both x and y are null or undefined and exactly the same

  if (!(x instanceof Object) || !(y instanceof Object)) return false;
  // if they are not strictly equal, they both need to be Objects

  if (x.constructor !== y.constructor) return false;
  // they must have the exact same prototype chain, the closest we can do is
  // test there constructor.

  for (var p in x) {
    if (!Object.prototype.hasOwnProperty.call(x, p)) continue;
    // other properties were tested using x.constructor === y.constructor

    if (!Object.prototype.hasOwnProperty.call(y, p)) return false;
    // allows to compare x[ p ] and y[ p ] when set to undefined

    if (x[p] === y[p]) continue;
    // if they have the same strict value or identity then they are equal

    if (typeof x[p] !== 'object') return false;
    // Numbers, Strings, consts, Booleans must be strictly equal

    if (!_deepEqual(x[p], y[p])) return false;
    // Objects and Arrays must be tested recursively
  }

  for (p in y)
    if (
      Object.prototype.hasOwnProperty.call(y, p) &&
      !Object.prototype.hasOwnProperty.call(x, p)
    )
      return false;
  // allows x[ p ] to be set to undefined

  return true;
};

const _getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const _getRandomCoordinate = () => ({
  x: _getRandomInt(INIT_STATE.cols),
  y: _getRandomInt(INIT_STATE.rows),
});

const _getRandomAppleCoordinate = (snake) => {
  let newApple = _getRandomCoordinate();
  while (_isSnake(newApple, snake)) newApple = _getRandomCoordinate();
  return newApple;
};

const _moveSnakeSlice = (move, snakeSlice) => {
  let xx = move.x + snakeSlice.x;
  let yy = move.y + snakeSlice.y;
  while (xx < 0) xx += INIT_STATE.cols;
  while (yy < 0) yy += INIT_STATE.rows;
  return {
    x: xx % INIT_STATE.cols,
    y: yy % INIT_STATE.rows,
  };
};

const _isSamePosition = (a, b) => {
  return a.x === b.x && a.y === b.y;
};

const _isSnake = (coordinate, snake) =>
  snake.filter((snakeSlice) => _isSamePosition(coordinate, snakeSlice)).length;

const _getSnakeHead = (snake) => snake[0];

const getWillSnakeEating = ({ snake, apple, moves }) =>
  _isSamePosition(
    _moveSnakeSlice(moves[moves.length - 1], _getSnakeHead(snake)),
    apple,
  );

const _getSnakeWithoutStub = (snake) => snake.slice(0, snake.length - 1);

const _getSnakeTail = (snake) => snake.slice(1);

const _conditionSnakeChangeDirectionState = (state, move) => {
  const firstMove = state.moves[0];
  const lastMove = state.moves[state.moves.length - 1];

  const REVERSE_DIRS = {
    [JSON.stringify(NORTH)]: SOUTH,
    [JSON.stringify(SOUTH)]: NORTH,
    [JSON.stringify(EAST)]: WEST,
    [JSON.stringify(WEST)]: EAST,
  };

  return (
    !_deepEqual(firstMove, REVERSE_DIRS[JSON.stringify(move)]) &&
    !_deepEqual(lastMove, move)
  );
};

const _newSnakeChangeDirectionState = (state, move) => {
  const finalState = {
    ...state,
    moves: [move, ...state.moves],
  };

  return finalState;
};

const getIsSnakeSilly = (snake) =>
  _isSnake(_getSnakeHead(snake), _getSnakeTail(snake));

export const snakeMoveState = (state) => {
  const lastMove = state.moves[state.moves.length - 1];
  const isSnakeEating = getWillSnakeEating(state);

  const snakeHead = _moveSnakeSlice(lastMove, _getSnakeHead(state.snake));

  const snakeTail = isSnakeEating
    ? state.snake
    : _getSnakeWithoutStub(state.snake);

  const movedSnake = [snakeHead, ...snakeTail];

  if (getIsSnakeSilly(movedSnake)) return { ...INIT_STATE };

  const appleCoordinate = isSnakeEating
    ? _getRandomAppleCoordinate(movedSnake)
    : state.apple;

  return {
    ...state,
    snake: [...movedSnake],
    apple: appleCoordinate,
    moves:
      state.moves.length > 1 ? [...state.moves.slice(0, -1)] : [...state.moves],
  };
};

export const snakeChangeDirectionState = (state, move) => {
  switch (move) {
    case 'w':
      if (_conditionSnakeChangeDirectionState(state, NORTH)) {
        return _newSnakeChangeDirectionState(state, NORTH);
      }
      return {
        ...state,
      };
    case 'a':
      if (_conditionSnakeChangeDirectionState(state, WEST)) {
        return _newSnakeChangeDirectionState(state, WEST);
      }
      return {
        ...state,
      };
    case 's':
      if (_conditionSnakeChangeDirectionState(state, SOUTH)) {
        return _newSnakeChangeDirectionState(state, SOUTH);
      }
      return {
        ...state,
      };
    case 'd':
      if (_conditionSnakeChangeDirectionState(state, EAST)) {
        return _newSnakeChangeDirectionState(state, EAST);
      }
      return {
        ...state,
      };
    default:
      return { ...state };
  }
};
