export function randomize(): number {
  // max is 6, min is 1
  return Math.floor(Math.random() * (6 - 1) + 1);
}

// calculate column by game logic
export function sumColumn(_input: number[]): number {
  return _input.reduce((_not_sure, _count, _num) => {
    if (_count === 1) {
      _not_sure += _num;
      return _not_sure;
    }
    if (_count === 2) {
      if (_num === 1) {
        _not_sure += _num + _num;
        return _not_sure;
      }
      _not_sure += _num * _num;
      return _not_sure;
    }
    if (_count === 3) {
      _not_sure += _num * 9;
      return _not_sure;
    }

    return _not_sure;
  }, 0);
}

// [number => count]
export function countOccurencesInArray(_input: number[]): number[] {
  return _input.reduce((acc: number[], curr: number) => {
    return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
  }, []);
}

// rotate the array and fill with zeros for the view
export function rotateNestedArray(_board: number[][]): number[][] {
  return _board.map((_, index) => _board.map(row => row[index] ?? 0));
}

// remove zeroes from the board
export function removeTheVoid(_board: number[][]): number[][] {
  return _board.map(col => col.filter(r => r > 0));
}

// semantics: player one attacks player two on sub array index
// 1) traverse to sub array of the board on index
// 2) remove occurence of the last played value in player-one sub array from player-two sub array
// 3) shift values of defender sub array so that there are no leading zeroes
export function playerAttackOnSubArr(
  _attacker_board: number[][],
  _defender_board: number[][],
  _index: number
): number[][] | boolean {
  if (_index > 2 || _index < 0) return false;

  // get sub arrays
  const attackerSubArray = _attacker_board[_index];
  const defenderSubArray = _defender_board[_index];

  // get last played value of attacker sub array
  const value = getLastValueOfArray(attackerSubArray);
  // remove values
  const newDefenderSubArray = removeValueFromArray(defenderSubArray, value);
  // shift values
  const shiftedSubArray = shiftArray(newDefenderSubArray);
  // fill array
  const finalSubArray = fillArray(shiftedSubArray);

  const newDefenderBoard = _defender_board;
  newDefenderBoard[_index] = finalSubArray;

  return newDefenderBoard;
}

// remove zeroes, pop last value
function getLastValueOfArray(_arr: number[]): number {
  return _arr.filter(x => x != 0).pop() || 0;
}

// remove a value from array
function removeValueFromArray(_arr: number[], _value: number): number[] {
  return _arr.map(x => (x == _value ? 0 : x));
}

// shift values so there are no leading zeroes, mutability is real.
export function shiftArray(_arr: number[]): number[] {
  if (_arr.slice().shift() == 0) {
    _arr.shift();
    return shiftArray(_arr);
  }

  return _arr;
}

// fill array with zeroes till length of 3
// basically combine array with a 3 zeroes static array
export function fillArray(_arr: number[]): number[] {
  return [0, 0, 0].map((_x, _i) => _arr[_i] ?? 0);
}

export function fillBoard(_board: number[][]): number[][] {
  return [[], [], []].map((_, _i) => fillArray(_board[_i]));
}
