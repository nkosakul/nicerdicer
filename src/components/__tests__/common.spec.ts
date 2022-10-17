import { describe, expect, it } from 'vitest';
import {
  countOccurencesInArray,
  removeTheVoid,
  rotateNestedArray,
  sumColumn,
} from '@/helpers/common';

describe('test summing up column counts', () => {
  it('it should sum distinct counts', () => {
    // num(index) => occurance
    const myArray = [0, 1, 1, 1];

    const sum = sumColumn(myArray);

    expect(sum).toEqual(6);
  });
  it('it should sum doubled counts', () => {
    // num(index) => occurance
    const myArray = [0, 1, 2, 1];

    const sum = sumColumn(myArray);

    expect(sum).toEqual(8);
  });
  it('it should sum trippled counts', () => {
    // num(index) => occurance
    const myArray = [0, 1, 3, 1];

    const sum = sumColumn(myArray);

    expect(sum).toEqual(22);
  });
  it('it should sum doubled ones', () => {
    // num(index) => occurance
    const myArray = [0, 2, 1, 1];

    const sum = sumColumn(myArray);

    expect(sum).toEqual(7);
  });
  it('it should sum trippled ones', () => {
    // num(index) => occurance
    const myArray = [0, 3, 1, 1];

    const sum = sumColumn(myArray);

    expect(sum).toEqual(14);
  });
});

describe('test count occurences', () => {
  it('it should count no occurences', () => {
    // num(index) => occurance
    const myArray = [1, 2, 3];

    const countArray = countOccurencesInArray(myArray);

    expect(countArray).toEqual([undefined, 1, 1, 1]);
  });
  it('it should count double occurences', () => {
    // num(index) => occurance
    const myArray = [2, 2, 3, 4];

    const countArray = countOccurencesInArray(myArray);

    expect(countArray).toEqual([undefined, undefined, 2, 1, 1]);
  });
  it('it should count multiple double occurences', () => {
    // num(index) => occurance
    const myArray = [1, 2, 1, 2];

    const countArray = countOccurencesInArray(myArray);

    expect(countArray).toEqual([undefined, 2, 2]);
  });

  it('it should count triple occurences', () => {
    // num(index) => occurance
    const myArray = [1, 1, 1];

    const countArray = countOccurencesInArray(myArray);

    expect(countArray).toEqual([undefined, 3]);
  });
});

describe('test rotating nested arrays', () => {
  it('rotate 2 level array', () => {
    const myArray = [
      [1, 2],
      [3, 4],
    ];

    const rotated = rotateNestedArray(myArray);

    expect(rotated).toEqual([
      [1, 3],
      [2, 4],
    ]);
  });
  it('rotate 3 level array', () => {
    const myArray = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];

    const rotated = rotateNestedArray(myArray);

    expect(rotated).toEqual([
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
    ]);
  });

  it('rotate twice back to original', () => {
    const myArray = [
      [0, 1, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    const rotated1 = rotateNestedArray(myArray);
    const rotated2 = rotateNestedArray(rotated1);

    expect(rotated2).toEqual([
      [0, 1, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
  });

  it('remove zeroes from board', () => {
    const myArray = [
      [1, 1, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    const emptiness = removeTheVoid(myArray);

    expect(emptiness).toEqual([[1, 1], [], []]);
  });
});
