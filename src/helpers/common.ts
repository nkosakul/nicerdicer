export function randomize(): number {
  // max is 6, min is 1
  return Math.floor(Math.random() * (6 - 1) + 1);
}

// calculate column by game logic
export function sumColumn(_input: number[]): number {
  return _input.reduce((_not_sure, _count, _num) => {
    if (_count === 1 || _num === 1) {
      _not_sure += _num;
    }
    if (_count === 2) {
      _not_sure += _num * _num;
    }
    if (_count === 3) {
      _not_sure += _num * 9;
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
